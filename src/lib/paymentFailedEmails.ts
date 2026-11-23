import type { SupabaseClient } from "@supabase/supabase-js";
import { sendEmail, escapeHtml, getAdminRecipients, getNotificationsFrom, EMAIL_FONT_STACK, EMAIL_FONT_LINK } from "@/lib/email";
import { loadRpBooking, isRpBookingPaid, type RpBookingRow } from "@/lib/rpBookings";
import type { Locale } from "@/lib/i18n";

/**
 * A card payment failed (bank declined, 3-D Secure not completed): the customer
 * gets "nothing was charged" with the bank tip and the pay-by-link URL that
 * reopens the booking; operations gets who, how much and why. Once per booking
 * per day. Gateway/configuration errors alert operations only.
 */

const SITE_URL = "https://rutapacifico.com";
const WHATSAPP_DISPLAY = "+506 7080-5578";
const WHATSAPP_RAW = "50670805578";
const RESERVATIONS_EMAIL = "reservations@rutapacifico.com";
const ORANGE = "#e36414";

export interface PaymentFailedInput {
  /** rp_bookings.id */
  bookingId: string;
  kind: "declined" | "error";
  isoCode?: string | null;
  gatewayMessage?: string | null;
  threeDsStatus?: string | null;
  cardBrand?: string | null;
  locale?: Locale | null;
}

const COPY = {
  en: {
    subject: (code: string) => `Your payment didn't go through – nothing was charged · ${code}`,
    title: "Your payment didn’t go through",
    hello: (n: string) => `Hello ${n},`,
    body: (code: string) => `Your card payment for booking <strong>${code}</strong> was not completed by your bank, so <strong>nothing was charged</strong>. Your dates are still held for you.`,
    why: "This usually happens when a bank blocks the first online or international charge on a card, or when the verification code the bank sends (3-D Secure) is not completed. A quick approval in your banking app, or a short call to your bank, normally fixes it.",
    cta: "Try again or use another card",
    alt: `Prefer a hand? Reply to this email or message us on WhatsApp ${WHATSAPP_DISPLAY} and we sort it out together.`,
    already: "If you already managed to pay after this attempt, please ignore this message.",
    total: "Total",
  },
  es: {
    subject: (code: string) => `Tu pago no se completó: no se cobró nada · ${code}`,
    title: "Tu pago no se completó",
    hello: (n: string) => `Hola ${n},`,
    body: (code: string) => `El pago con tarjeta de tu reserva <strong>${code}</strong> no fue completado por tu banco, así que <strong>no se cobró nada</strong>. Tus fechas siguen apartadas.`,
    why: "Suele pasar cuando un banco bloquea el primer cobro en línea o internacional de una tarjeta, o cuando no se completa el código de verificación que envía el banco (3-D Secure). Una aprobación rápida en la app de tu banco, o una llamada corta, normalmente lo resuelve.",
    cta: "Intentar de nuevo o usar otra tarjeta",
    alt: `¿Prefieres que te ayudemos? Responde a este correo o escríbenos por WhatsApp ${WHATSAPP_DISPLAY} y lo resolvemos juntos.`,
    already: "Si ya lograste pagar después de este intento, ignora este mensaje.",
    total: "Total",
  },
} as const;

export function retryPaymentUrl(booking: Pick<RpBookingRow, "id">, locale: Locale): string {
  return `${SITE_URL}${locale === "es" ? "/es" : ""}/private-shuttle/checkout?pay=${encodeURIComponent(booking.id)}`;
}

export function renderPaymentFailedCustomerHtml(b: RpBookingRow, retryUrl: string, locale: Locale): { subject: string; html: string } {
  const t = COPY[locale];
  const firstName = b.customer_name.trim().split(/\s+/)[0] || b.customer_name;
  const legs = (b.trips || []).map((tr) => `<div style="font-size:13px;color:#444;">${escapeHtml(tr.from)} → ${escapeHtml(tr.to)} · ${escapeHtml(tr.date)}</div>`).join("");
  const html = `<!DOCTYPE html>
<html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${EMAIL_FONT_LINK}<title>${t.title}</title></head>
<body style="margin:0;padding:0;background:#f6f3ee;font-family:${EMAIL_FONT_STACK};">
  <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background:#f6f3ee;"><tr><td align="center" style="padding:20px 10px;">
  <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 4px 14px rgba(0,0,0,.06);">
    <tr><td style="background:${ORANGE};padding:26px 28px;text-align:center;">
      <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.8);">Ruta Pacifico</div>
      <h1 style="margin:8px 0 0;font-size:22px;color:#fff;">${t.title}</h1>
    </td></tr>
    <tr><td style="padding:26px 28px 8px;font-size:15px;color:#1a1a1a;line-height:1.6;">
      <p style="margin:0 0 8px;">${t.hello(escapeHtml(firstName))}</p>
      <p style="margin:0 0 12px;color:#444;">${t.body(escapeHtml(b.confirmation_code))}</p>
      <div style="background:#fef3c7;border-left:4px solid #f59e0b;border-radius:0 10px 10px 0;padding:12px 14px;font-size:14px;color:#92400e;">${t.why}</div>
    </td></tr>
    <tr><td style="padding:10px 28px 6px;">
      <div style="border:1px solid #ececec;border-radius:14px;padding:14px 16px;background:#faf8f5;">
        <div style="font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#888;">${escapeHtml(b.confirmation_code)}</div>
        <div style="margin-top:6px;">${legs}</div>
        <div style="margin-top:8px;font-size:14px;color:#1a1a1a;"><strong>${t.total}: $${Number(b.total_amount).toFixed(2)} USD</strong></div>
      </div>
    </td></tr>
    <tr><td style="padding:16px 28px 6px;text-align:center;">
      <a href="${retryUrl}" style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:13px 24px;border-radius:999px;">${t.cta} →</a>
      <p style="margin:14px 0 0;font-size:14px;color:#444;">${t.alt}</p>
      <a href="https://wa.me/${WHATSAPP_RAW}?text=${encodeURIComponent(b.confirmation_code)}" style="display:inline-block;margin-top:8px;color:#16a34a;font-weight:700;text-decoration:none;">WhatsApp ${WHATSAPP_DISPLAY}</a>
    </td></tr>
    <tr><td style="padding:14px 28px 28px;font-size:12px;color:#9a9a9a;text-align:center;">${t.already}<br>${RESERVATIONS_EMAIL}</td></tr>
  </table>
  </td></tr></table>
</body></html>`;
  return { subject: t.subject(b.confirmation_code), html };
}

function opsHtml(b: RpBookingRow, input: PaymentFailedInput, retryUrl: string): string {
  const reason = input.kind === "error"
    ? `Gateway / configuration error (${escapeHtml(input.isoCode || "")} ${escapeHtml(input.gatewayMessage || "")})`
    : input.threeDsStatus && input.threeDsStatus !== "Y" && input.threeDsStatus !== "A"
      ? `3-D Secure not completed by the bank (status ${escapeHtml(input.threeDsStatus)})`
      : `Bank declined (${escapeHtml(input.isoCode || "")} ${escapeHtml(input.gatewayMessage || "")})`;
  const legs = (b.trips || []).map((tr) => `<div>${escapeHtml(tr.from)} → ${escapeHtml(tr.to)} · ${escapeHtml(tr.date)} ${escapeHtml(tr.time)}</div>`).join("");
  const phone = (b.customer_phone || "").replace(/[^0-9]/g, "");
  return `<!DOCTYPE html><html><body style="font-family:${EMAIL_FONT_STACK};background:#f5f5f5;margin:0;padding:20px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;">
    <div style="background:#991b1b;color:#fff;padding:18px 22px;">
      <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;opacity:.8;">🌴 Payment failed · card</div>
      <div style="font-size:20px;font-weight:700;margin-top:4px;">${escapeHtml(b.confirmation_code)} · $${Number(b.total_amount).toFixed(2)} USD</div>
    </div>
    <div style="padding:20px 22px;color:#111;font-size:14px;line-height:1.6;">
      <p style="margin:0 0 6px;"><strong>${escapeHtml(b.customer_name)}</strong> · <a href="mailto:${escapeHtml(b.customer_email)}">${escapeHtml(b.customer_email)}</a>${phone ? ` · <a href="https://wa.me/${phone}">${escapeHtml(b.customer_phone || "")}</a>` : ""}${b.locale ? ` · ${b.locale.toUpperCase()}` : ""}</p>
      <p style="margin:0 0 10px;color:#991b1b;"><strong>Why:</strong> ${reason}${input.cardBrand ? ` · ${escapeHtml(input.cardBrand)}` : ""}</p>
      <div style="background:#f9fafb;border-left:4px solid #ef4444;border-radius:8px;padding:12px 14px;font-size:13px;">${legs}</div>
      <p style="margin:12px 0 0;">${input.kind === "declined" ? "The customer got an email with the bank tip and the retry link." : "Nothing was sent to the customer: this looks like a problem on our side."} Retry link: <a href="${retryUrl}">${retryUrl}</a></p>
    </div>
  </div></body></html>`;
}

/** Once per booking per day (first declined/error attempt). Never throws. */
export async function notifyPaymentFailed(db: SupabaseClient, input: PaymentFailedInput): Promise<{ customer: boolean; ops: boolean }> {
  const none = { customer: false, ops: false };
  try {
    const booking = await loadRpBooking(db, input.bookingId);
    if (!booking || isRpBookingPaid(booking) || booking.status === "cancelled") return none;

    const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    const { count } = await db
      .from("powertranz_transactions")
      .select("id", { count: "exact", head: true })
      .eq("order_id", booking.id)
      .in("status", ["declined", "error"])
      .gte("updated_at", since);
    if ((count || 0) > 1) return none;

    const locale: Locale = (input.locale || booking.locale) === "es" ? "es" : "en";
    const retryUrl = retryPaymentUrl(booking, locale);
    const admins = getAdminRecipients();

    const opsPromise = admins.length > 0
      ? sendEmail({
          to: admins,
          from: getNotificationsFrom(),
          replyTo: booking.customer_email,
          subject: `${input.kind === "error" ? "🌴🛠 Payment error" : "🌴⚠️ Payment failed"} · ${booking.confirmation_code} — ${booking.customer_name} · $${Number(booking.total_amount).toFixed(2)}`,
          html: opsHtml(booking, input, retryUrl),
        })
      : Promise.resolve({ ok: false, error: "EMAIL_NOTIFICATIONS_TO not configured" });

    const customerPromise = input.kind === "declined"
      ? (() => {
          const { subject, html } = renderPaymentFailedCustomerHtml(booking, retryUrl, locale);
          return sendEmail({ to: booking.customer_email, subject, html, replyTo: admins[0] });
        })()
      : Promise.resolve({ ok: false });

    const [ops, cust] = await Promise.all([opsPromise, customerPromise]);
    if (!ops.ok && "error" in ops) console.error("[Email] Payment-failed ops email failed:", ops.error);
    return { customer: cust.ok, ops: ops.ok };
  } catch (err) {
    console.error("[Email] notifyPaymentFailed threw:", err);
    return none;
  }
}
