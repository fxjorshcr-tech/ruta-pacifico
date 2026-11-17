import { NextRequest, NextResponse, after } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import {
  parsePowertranzBody,
  completeSpiPayment,
  decideFromCallback,
  friendlyMessage,
  type PowertranzResponse,
} from "@/lib/powertranz";
import {
  loadRpBooking,
  isRpBookingPaid,
  claimRpBooking,
  releaseRpBooking,
  markRpBookingPaid,
  rpBookingToEmailInput,
  confirmationPath,
} from "@/lib/rpBookings";
import { sendBookingEmails } from "@/lib/bookingEmails";

/**
 * MerchantResponseUrl for the Powertranz SPI flow.
 *
 * Powertranz posts the 3-D Secure / hosted-page result here FROM THE
 * CARDHOLDER'S BROWSER, inside the iframe on the checkout page (form fields
 * `Response` (JSON), `TransactionIdentifier`, `SpiToken`). This handler:
 *   1. matches the result to our powertranz_transactions row (atomically,
 *      so a replayed callback is ignored),
 *   2. decides whether to finalise and, if so, calls /spi/payment with the
 *      stored SpiToken — the only place money moves,
 *   3. marks the booking paid and sends the paid emails,
 *   4. answers with a tiny page that hands control back to the checkout
 *      (postMessage to the parent window, redirect fallback).
 *
 * A forged POST cannot charge anyone: money moves only when OUR server
 * redeems a token Powertranz issued, and Powertranz denies that when 3-D
 * Secure did not succeed.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Outcome = {
  ok: boolean;
  status: "approved" | "declined" | "error" | "duplicate";
  message: string;
  redirectUrl?: string;
};

const LOG = "[Powertranz Callback]";

export async function POST(request: NextRequest) {
  const tx = request.nextUrl.searchParams.get("tx") || "";
  const locale = request.nextUrl.searchParams.get("lang") === "es" ? "es" : "en";
  const generic = (): Outcome => ({ ok: false, status: "error", message: friendlyMessage("", "", undefined, locale) });

  const payload = await readCallbackPayload(request);
  const cb = parsePowertranzBody(payload, 200);

  if (!/^[0-9a-f-]{36}$/i.test(tx)) return htmlResponse(generic(), tx, locale);

  const db = getSupabaseAdmin();

  const { data: row } = await db
    .from("powertranz_transactions")
    .update({ status: "authenticating", callback_payload: cb.raw, updated_at: new Date().toISOString() })
    .eq("transaction_identifier", tx)
    .eq("status", "initiated")
    .select("*")
    .maybeSingle();

  if (!row) {
    const { data: existing } = await db
      .from("powertranz_transactions")
      .select("status")
      .eq("transaction_identifier", tx)
      .maybeSingle();
    const outcome: Outcome = existing?.status === "approved"
      ? { ok: true, status: "approved", message: "Payment approved", redirectUrl: confirmationPath(true) }
      : { ok: false, status: "duplicate", message: friendlyMessage("", "", undefined, locale) };
    return htmlResponse(outcome, tx, locale);
  }

  if (cb.transactionIdentifier && cb.transactionIdentifier.toLowerCase() !== tx.toLowerCase()) {
    console.error(LOG, "TransactionIdentifier mismatch", { tx, echoed: cb.transactionIdentifier });
    await setTx(db, row.id, { status: "error", error_message: "TransactionIdentifier mismatch in callback" });
    return htmlResponse(generic(), tx, locale);
  }

  const threeDsCols = {
    iso_response_code: cb.isoResponseCode || null,
    response_message: cb.responseMessage || null,
    card_brand: cb.cardBrand || null,
    pan_token: cb.panToken || null,
    three_ds_eci: cb.threeDS?.eci || null,
    three_ds_authentication_status: cb.threeDS?.authenticationStatus || null,
    three_ds_protocol_version: cb.threeDS?.protocolVersion || null,
    three_ds_cavv: cb.threeDS?.cavv || null,
    three_ds_ds_trans_id: cb.threeDS?.dsTransId || null,
  };

  const decision = decideFromCallback(cb);
  if (!decision.proceed) {
    console.warn(LOG, "not finalising", { tx, booking: row.booking_number, code: cb.isoResponseCode, auth: cb.threeDS?.authenticationStatus, reason: decision.reason });
    await setTx(db, row.id, { ...threeDsCols, status: decision.reason === "error" ? "error" : "declined", error_message: decision.reason });
    const issuerNote = cb.threeDS?.cardholderInfo ? ` ${cb.threeDS.cardholderInfo}` : "";
    // decideFromCallback already picked the right wording (a gateway
    // configuration error is "temporary problem", never "your bank declined").
    const message = decision.reason === "error"
      ? friendlyMessage("", "", undefined, locale)
      : friendlyMessage(cb.isoResponseCode, cb.responseMessage, cb.threeDS?.authenticationStatus, locale) + issuerNote;
    return htmlResponse({ ok: false, status: decision.reason === "error" ? "error" : "declined", message }, tx, locale);
  }

  const booking = row.order_id ? await loadRpBooking(db, String(row.order_id)) : null;
  if (!booking) {
    await setTx(db, row.id, { ...threeDsCols, status: "error", error_message: "Booking row not found" });
    return htmlResponse(generic(), tx, locale);
  }
  if (isRpBookingPaid(booking)) {
    await setTx(db, row.id, { ...threeDsCols, status: "error", error_message: "Booking already paid before finalisation" });
    return htmlResponse({ ok: true, status: "approved", message: "Payment approved", redirectUrl: confirmationPath(true) }, tx, locale);
  }

  if (!(await claimRpBooking(db, booking.id))) {
    await setTx(db, row.id, { ...threeDsCols, status: "error", error_message: "Booking claim failed (already processing or paid)" });
    return htmlResponse({ ok: false, status: "duplicate", message: friendlyMessage("", "", undefined, locale) }, tx, locale);
  }

  if (!row.spi_token) {
    await releaseRpBooking(db, booking.id, "pending");
    await setTx(db, row.id, { ...threeDsCols, status: "error", error_message: "Missing SpiToken on row" });
    return htmlResponse(generic(), tx, locale);
  }

  // ── The charge ──────────────────────────────────────────────────────────
  let pay: PowertranzResponse;
  try {
    pay = await completeSpiPayment(row.spi_token);
  } catch (err) {
    console.error(LOG, "completeSpiPayment threw:", err);
    await releaseRpBooking(db, booking.id, "pending");
    await setTx(db, row.id, { ...threeDsCols, status: "error", error_message: err instanceof Error ? err.message : String(err) });
    return htmlResponse(generic(), tx, locale);
  }

  console.warn(LOG, "payment result", { tx, booking: row.booking_number, approved: pay.approved, iso: pay.isoResponseCode, message: pay.responseMessage, httpStatus: pay.httpStatus });

  if (!pay.approved) {
    const transient = pay.httpStatus === 0 || pay.httpStatus >= 500;
    await releaseRpBooking(db, booking.id, transient ? "pending" : "failed");
    await setTx(db, row.id, {
      ...threeDsCols,
      status: transient ? "error" : "declined",
      iso_response_code: pay.isoResponseCode || cb.isoResponseCode || null,
      response_message: pay.responseMessage || null,
      error_message: pay.errors?.map((e) => `${e.code}: ${e.message}`).join(" | ") || null,
      payment_payload: pay.raw,
    });
    return htmlResponse(
      { ok: false, status: transient ? "error" : "declined", message: friendlyMessage(pay.isoResponseCode, pay.responseMessage, undefined, locale) },
      tx,
      locale,
    );
  }

  // ── Approved ────────────────────────────────────────────────────────────
  const paidAt = new Date().toISOString();
  const payment = {
    transactionId: pay.transactionIdentifier || tx,
    authCode: pay.authorizationCode || "",
    rrn: pay.rrn,
    cardBrand: pay.cardBrand || cb.cardBrand,
    paidAt,
  };

  await setTx(db, row.id, {
    ...threeDsCols,
    status: "approved",
    iso_response_code: pay.isoResponseCode,
    response_message: pay.responseMessage,
    authorization_code: pay.authorizationCode || null,
    rrn: pay.rrn || null,
    card_brand: payment.cardBrand || null,
    pan_token: pay.panToken || cb.panToken || null,
    payment_payload: pay.raw,
    spi_token: null,
  });
  await markRpBookingPaid(db, booking.id, payment);

  after(async () => {
    const input = rpBookingToEmailInput(booking, {
      transactionId: payment.transactionId,
      authCode: payment.authCode,
      amount: Number(booking.total_amount),
      paidAt,
    });
    let sent = false;
    for (let attempt = 1; attempt <= 3 && !sent; attempt++) {
      try {
        const r = await sendBookingEmails(input);
        if (!r.customer.ok) console.error(LOG, "customer email failed:", r.customer.error);
        if (!r.admin.ok) console.error(LOG, "admin email failed:", r.admin.error);
        sent = r.customer.ok;
      } catch (err) {
        console.error(LOG, `paid emails attempt ${attempt} threw:`, err);
      }
      if (!sent && attempt < 3) await new Promise((r) => setTimeout(r, attempt * 1500));
    }
    if (sent) {
      await db.from("rp_bookings").update({ paid_emails_sent_at: new Date().toISOString() }).eq("id", booking.id);
    } else {
      console.error(LOG, `paid emails permanently failed for ${booking.confirmation_code} — manual resend needed`);
    }
  });

  return htmlResponse({ ok: true, status: "approved", message: "Payment approved", redirectUrl: confirmationPath(true) }, tx, locale);
}

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("lang") === "es" ? "es" : "en";
  return htmlResponse({ ok: false, status: "error", message: friendlyMessage("", "", undefined, locale) }, "", locale);
}

// ─── helpers ───────────────────────────────────────────────────────────────

async function readCallbackPayload(request: NextRequest): Promise<unknown> {
  const contentType = request.headers.get("content-type") || "";
  const text = await request.text();
  if (!text) return {};
  if (contentType.includes("application/json")) {
    try { return JSON.parse(text); } catch { return {}; }
  }
  const params = new URLSearchParams(text);
  for (const c of [params.get("Response"), params.get("response"), params.get("json")]) {
    if (c) {
      try { return JSON.parse(c); } catch { /* fall through */ }
    }
  }
  try { return JSON.parse(text); } catch { /* not JSON */ }
  const flat: Record<string, string> = {};
  params.forEach((v, k) => { flat[k] = v; });
  return flat;
}

async function setTx(db: ReturnType<typeof getSupabaseAdmin>, id: string, patch: Record<string, unknown>): Promise<void> {
  const { error } = await db
    .from("powertranz_transactions")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) console.error(LOG, "Failed to update powertranz_transactions:", error);
}

/**
 * Rendered inside the checkout's payment iframe once Powertranz is done.
 * Tells the checkout page (same origin) what happened; falls back to
 * navigating the parent window itself if nothing listens.
 */
function htmlResponse(outcome: Outcome, tx: string, locale: "en" | "es"): NextResponse {
  const payload = JSON.stringify({ type: "powertranz:result", tx, ...outcome });
  const prefix = locale === "es" ? "/es" : "";
  const fallback = outcome.redirectUrl
    ? `${prefix}${outcome.redirectUrl}`
    : `${prefix}/private-shuttle/checkout?ptz=${encodeURIComponent(outcome.status)}&tx=${encodeURIComponent(tx)}`;
  const title = outcome.ok
    ? (locale === "es" ? "Pago aprobado" : "Payment approved")
    : (locale === "es" ? "Volviendo al checkout…" : "Returning to checkout…");

  const html = `<!DOCTYPE html>
<html lang="${locale}"><head><meta charset="utf-8"><meta name="robots" content="noindex">
<title>${title}</title>
<style>body{font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;color:#334155;background:#faf6ee}</style>
</head><body><p>${title}</p>
<script>
(function(){
  var payload = ${payload.replace(/</g, "\\u003c")};
  var fallback = ${JSON.stringify(fallback)};
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(payload, window.location.origin);
    }
  } catch (e) {}
  setTimeout(function(){
    try {
      if (window.parent && window.parent !== window) { window.parent.location.href = fallback; }
      else { window.location.href = fallback; }
    } catch (e) { window.location.href = fallback; }
  }, 1500);
})();
</script></body></html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Frame-Options": "SAMEORIGIN",
    },
  });
}
