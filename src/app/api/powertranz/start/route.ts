import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabaseAdmin";
import { checkRateLimit, getClientIP } from "@/lib/rateLimit";
import {
  buildHostedSaleRequest,
  startHostedSale,
  isPowertranzConfigured,
  getPowertranzEnvironment,
  friendlyMessage,
} from "@/lib/powertranz";
import { loadRpBooking, isRpBookingPaid } from "@/lib/rpBookings";

/**
 * Step 1 of the Powertranz SPI + Hosted Payment Page flow: open a 3-D Secure
 * session for a saved booking and hand the browser the HTML to render in an
 * iframe. Amount and customer come from `rp_bookings` (server-priced), never
 * from the client. The SpiToken stays on the server. Nothing is charged here.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function callbackBaseUrl(request: NextRequest): string {
  const override = process.env.POWERTRANZ_CALLBACK_BASE_URL?.trim();
  if (override) return override.replace(/\/$/, "");
  const proto = request.headers.get("x-forwarded-proto") || "https";
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
  return host ? `${proto}://${host}` : request.nextUrl.origin;
}

/**
 * The hosted page picks its language from the browser-info form Powertranz
 * auto-submits (field `browserLanguage`, read from navigator.language). We
 * know which site the customer is on, so pin that field to the site's
 * language; an English-site visitor with a Spanish browser gets the form in
 * English. Falls back to the untouched HTML if the markup ever changes.
 */
function localizeRedirectData(html: string, locale: "en" | "es"): string {
  const needle = "document.getElementById('browserLanguage').value=e.language";
  if (!html.includes(needle)) return html;
  const lang = locale === "es" ? "es-CR" : "en-US";
  return html.replace(needle, `document.getElementById('browserLanguage').value='${lang}'`);
}

function splitName(full: string): { first: string; last: string } {
  const parts = full.trim().split(/\s+/);
  return { first: parts[0] ?? "", last: parts.slice(1).join(" ") };
}

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  if (!checkRateLimit(`ptz_start:${ip}`, 20, 60).success) {
    return NextResponse.json({ error: "Too many payment attempts. Try again in a minute." }, { status: 429 });
  }
  if (!isPowertranzConfigured() || !isSupabaseAdminConfigured()) {
    return NextResponse.json({ error: "Card payments are not available right now.", code: "not_configured" }, { status: 503 });
  }

  let body: { bookingId?: string; locale?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const bookingId = String(body?.bookingId || "").trim();
  const locale = body?.locale === "es" ? "es" : "en";
  if (!bookingId) return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });

  const db = getSupabaseAdmin();
  const booking = await loadRpBooking(db, bookingId);
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  if (isRpBookingPaid(booking)) {
    return NextResponse.json({ error: "This booking has already been paid" }, { status: 409 });
  }
  const amount = Number(booking.total_amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: "Invalid booking amount" }, { status: 500 });
  }

  const transactionIdentifier = crypto.randomUUID();
  const orderIdentifier = `${booking.confirmation_code}-${transactionIdentifier.slice(0, 8)}`;
  const merchantResponseUrl = `${callbackBaseUrl(request)}/api/powertranz/callback?tx=${transactionIdentifier}&lang=${locale}`;
  const { first, last } = splitName(booking.customer_name);

  const saleInput = {
    transactionIdentifier,
    orderIdentifier,
    amount,
    merchantResponseUrl,
    customer: { firstName: first || undefined, lastName: last || undefined, email: booking.customer_email || undefined },
  };

  let requestPayload: Record<string, unknown>;
  try {
    requestPayload = buildHostedSaleRequest(saleInput);
  } catch (err) {
    console.error("[Powertranz Start] buildHostedSaleRequest threw:", err);
    return NextResponse.json({ error: "Card payments are not available right now.", code: "not_configured" }, { status: 503 });
  }

  const { data: txRow, error: insertErr } = await db
    .from("powertranz_transactions")
    .insert({
      site: "ruta",
      booking_number: booking.confirmation_code,
      booking_type: "shuttle",
      order_id: booking.id,
      amount,
      currency: "USD",
      tx_type: "sale",
      environment: getPowertranzEnvironment(),
      status: "initiated",
      transaction_identifier: transactionIdentifier,
      order_identifier: orderIdentifier,
      customer_email: booking.customer_email,
      customer_first_name: first,
      customer_last_name: last,
      customer_phone: booking.customer_phone,
      ip_address: ip,
      user_agent: request.headers.get("user-agent") || "",
      request_payload: requestPayload,
    })
    .select("id")
    .single();
  if (insertErr || !txRow) {
    console.error("[Powertranz Start] powertranz_transactions insert failed:", insertErr);
    return NextResponse.json({ error: "Could not start the payment. Please try again." }, { status: 500 });
  }

  const gw = await startHostedSale(saleInput);
  if (gw.isoResponseCode !== "SP4" || !gw.redirectData || !gw.spiToken) {
    console.error("[Powertranz Start] SPI preprocessing failed:", {
      bookingId,
      httpStatus: gw.httpStatus,
      isoResponseCode: gw.isoResponseCode,
      responseMessage: gw.responseMessage,
      errors: gw.errors,
    });
    await db
      .from("powertranz_transactions")
      .update({
        status: "error",
        iso_response_code: gw.isoResponseCode || null,
        response_message: gw.responseMessage || null,
        error_message: gw.errors?.map((e) => `${e.code}: ${e.message}`).join(" | ") || gw.responseMessage || "SPI preprocessing failed",
        response_payload: gw.raw,
        updated_at: new Date().toISOString(),
      })
      .eq("id", txRow.id);
    return NextResponse.json(
      { error: friendlyMessage(gw.isoResponseCode, gw.responseMessage, undefined, locale), code: "gateway" },
      { status: 502 },
    );
  }

  await db
    .from("powertranz_transactions")
    .update({
      spi_token: gw.spiToken,
      iso_response_code: gw.isoResponseCode,
      response_message: gw.responseMessage,
      response_payload: gw.raw,
      updated_at: new Date().toISOString(),
    })
    .eq("id", txRow.id);

  return NextResponse.json({
    ok: true,
    transactionId: transactionIdentifier,
    redirectData: localizeRedirectData(gw.redirectData, locale),
    // The amount actually sent to the gateway (rp_bookings.total_amount).
    amount,
    environment: getPowertranzEnvironment(),
  });
}
