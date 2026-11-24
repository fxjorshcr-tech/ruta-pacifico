import type { TripItem } from "@/lib/booking";
import {
  sendEmail,
  escapeHtml,
  getAdminRecipients,
  getNotificationsFrom,
  getInlineLogo,
  logoSrc,
  EMAIL_FONT_STACK,
  EMAIL_FONT_LINK,
} from "@/lib/email";
import { HTML_LANG, INTL_LOCALE, type Locale } from "@/lib/i18n";
import { BOOKING_EMAIL } from "@/i18n/emails";
import { scheduleHowItWorksEmail } from "@/lib/howItWorksEmail";

/**
 * The two booking emails (customer + internal copy), shared by
 * /api/bookings (payment-link flow) and the Powertranz callback (card flow,
 * `paid` set). Moved out of the route so the card flow can send the same
 * emails without duplicating 300 lines of HTML.
 */

const HERO_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/hero-ruta-pacifico.webp";
const SITE_URL = "https://rutapacifico.com";
const WHATSAPP_DISPLAY = "+506 7080-5578";
const WHATSAPP_RAW = "50670805578";
const RESERVATIONS_EMAIL = "reservations@rutapacifico.com";
const ICT_LICENSE = "#4121-2025";

export interface BookingEmailInput {
  trips: TripItem[];
  name: string;
  email: string;
  phone: string;
  total: number;
  confirmationCode: string;
  createdAt: string;
  /** Language of the site the customer booked on; picks the customer email's language. */
  locale?: unknown;
  /** Set when the booking was paid by card on the site: switches both emails to the "paid & confirmed" variant. */
  paid?: PaidInfo;
}

export interface PaidInfo {
  transactionId: string;
  authCode: string;
  amount: number;
  paidAt: string;
}

/** "es" when the customer booked on the Spanish site, English for anything else. */
export function customerLocale(b: BookingEmailInput): Locale {
  return b.locale === "es" ? "es" : "en";
}

function formatDate(iso: string, locale: Locale = "en"): string {
  if (!iso) return "";
  try {
    return new Date(iso + "T00:00:00").toLocaleDateString(INTL_LOCALE[locale], {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function formatTime(iso: string, locale: Locale = "en"): string {
  if (!iso) return "";
  const [h, m] = iso.split(":").map(Number);
  if (Number.isNaN(h)) return iso;
  const d = new Date();
  d.setHours(h, m ?? 0);
  return d.toLocaleTimeString(INTL_LOCALE[locale], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/** "November 17, 2026" / "17 de noviembre de 2026", Costa Rica time. */
function formatPaidDate(iso: string, locale: Locale): string {
  try {
    return new Date(iso).toLocaleDateString(INTL_LOCALE[locale], {
      timeZone: "America/Costa_Rica",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function tripCardsHtml(trips: TripItem[], locale: Locale = "en"): string {
  const t = BOOKING_EMAIL[locale];
  return trips
    .map((t_, i) => {
      const pax = t.pax(t_.adults, t_.children);
      const detailRow = (label: string, value: string) =>
        `<tr>
           <td style="padding:5px 0;font-size:13px;color:#888;width:90px;vertical-align:top;">${label}</td>
           <td style="padding:5px 0;font-size:13px;color:#222;font-weight:500;vertical-align:top;">${value}</td>
         </tr>`;
      return `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #ececec;border-radius:14px;margin-bottom:${i < trips.length - 1 ? "12px" : "0"};">
          <tr>
            <td style="padding:18px 20px;border-bottom:1px solid #f3f3f3;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align:top;">
                    ${trips.length > 1 ? `<div style="display:inline-block;width:22px;height:22px;line-height:22px;background:#e36414;color:#fff;border-radius:50%;text-align:center;font-size:11px;font-weight:700;margin-right:8px;">${i + 1}</div>` : ""}
                    <span style="font-size:16px;font-weight:700;color:#1a1a1a;">${escapeHtml(t_.from)}</span>
                    <span style="color:#e36414;font-weight:700;">&nbsp;→&nbsp;</span>
                    <span style="font-size:16px;font-weight:700;color:#1a1a1a;">${escapeHtml(t_.to)}</span>
                    <div style="margin-top:4px;font-size:12px;color:#999;">
                      ${escapeHtml(formatDate(t_.date, locale))} &middot; ${escapeHtml(formatTime(t_.time, locale))}${t_.duracion ? ` &middot; ~${escapeHtml(t_.duracion)}` : ""}
                    </div>
                  </td>
                  <td style="text-align:right;vertical-align:top;white-space:nowrap;">
                    <div style="font-size:20px;font-weight:700;color:#e36414;">$${t_.price}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:14px 20px 18px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${detailRow(t.labels.vehicle, `${escapeHtml(t_.vehicleName)} (${escapeHtml(t_.vehiclePax)})`)}
                ${detailRow(t.labels.travelers, escapeHtml(pax))}
                ${t_.flight ? detailRow(t.labels.flight, escapeHtml(t_.flight)) : ""}
                ${detailRow(t.labels.pickup, escapeHtml(t_.pickup))}
                ${detailRow(t.labels.dropoff, escapeHtml(t_.dropoff))}
                ${t_.notes ? detailRow(t.labels.notes, escapeHtml(t_.notes)) : ""}
              </table>
            </td>
          </tr>
        </table>`;
    })
    .join("");
}

interface CustomerEmailOptions {
  /** <img src> for the logo (inline cid or absolute URL). */
  logo: string;
  /** Extra block rendered above the card (internal copies only). */
  internalHeader?: string;
  /** Inbox preview text; defaults to the customer-facing one. */
  preheader?: string;
  /** Language of the email copy; defaults to English. */
  locale?: Locale;
}

function customerEmailHtml(
  b: BookingEmailInput,
  opts: CustomerEmailOptions,
): string {
  const locale = opts.locale ?? "en";
  const t = BOOKING_EMAIL[locale];
  // Paid-by-card variant of the copy; everything not overridden falls back to the pending copy.
  const p = b.paid ? t.paid : null;
  const firstName = escapeHtml(b.name.split(" ")[0] || b.name);
  const code = escapeHtml(b.confirmationCode);
  const tripsCount = b.trips.length;
  const internalHeader = opts.internalHeader ?? "";
  const preheader = opts.preheader ?? (p ?? t).preheader(code, firstName);
  return `
  <!doctype html>
  <html lang="${HTML_LANG[locale]}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${(p ?? t).title(code)}</title>
    ${EMAIL_FONT_LINK}
  </head>
  <body style="margin:0;padding:0;background:#f4efe7;font-family:${EMAIL_FONT_STACK};color:#1a1a1a;-webkit-font-smoothing:antialiased;">
    <div style="display:none;font-size:0;line-height:0;color:transparent;max-height:0;overflow:hidden;">${preheader}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4efe7;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          ${internalHeader}
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">
            <!-- Hero -->
            <tr>
              <td style="background-color:#1a1a1a;background-image:url('${HERO_URL}');background-size:cover;background-position:center;padding:0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="background:linear-gradient(135deg,rgba(230,57,70,.86),rgba(227,100,20,.78),rgba(244,162,97,.7));padding:38px 32px 36px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding:0 0 18px;">
                            <img src="${opts.logo}" alt="Ruta Pacifico" width="170" height="71" style="display:block;width:170px;height:auto;border:0;" />
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="padding:0 0 18px;">
                            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                              <tr>
                                <td style="background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.32);border-radius:999px;padding:7px 16px;font-size:11px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:#ffffff;">${(p ?? t).badge}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="padding:0 0 20px;font-size:30px;line-height:1.2;font-weight:700;color:#ffffff;letter-spacing:-.5px;">${t.greeting(firstName)}</td>
                        </tr>
                        <tr>
                          <td align="center">
                            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                              <tr>
                                <td align="center" style="background:rgba(0,0,0,.28);border:1px solid rgba(255,255,255,.18);border-radius:14px;padding:12px 20px;">
                                  <div style="font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.7);">${t.codeLabel}</div>
                                  <div style="margin-top:4px;font-family:Menlo,Consolas,'Courier New',monospace;font-size:22px;font-weight:700;letter-spacing:2px;color:#ffd9a8;">${code}</div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Greeting body -->
            <tr>
              <td style="padding:32px 32px 8px;">
                <p style="margin:0 0 14px;font-size:16px;line-height:1.65;color:#222;">
                  ${(p ?? t).intro1}
                </p>
                <p style="margin:0;font-size:16px;line-height:1.65;color:#222;">
                  ${(p ?? t).intro2}
                </p>
              </td>
            </tr>

            <!-- Payment notice: green receipt when paid by card, amber "link coming" otherwise -->
            <tr>
              <td style="padding:18px 32px 0;">
                ${p && b.paid ? `
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ecfdf3;border:1px solid #bbe5c8;border-radius:14px;">
                  <tr>
                    <td style="padding:16px 18px;">
                      <div style="font-size:13px;font-weight:700;color:#166534;">${p.paymentTitle}</div>
                      <div style="margin-top:4px;font-size:13px;line-height:1.6;color:#14532d;">
                        ${p.paymentBody(`$${b.paid.amount.toFixed(2)} USD`, escapeHtml(b.paid.authCode || "—"), escapeHtml(b.paid.transactionId), escapeHtml(formatPaidDate(b.paid.paidAt, locale)))}
                      </div>
                    </td>
                  </tr>
                </table>` : `
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fff8eb;border:1px solid #f6e3b8;border-radius:14px;">
                  <tr>
                    <td style="padding:16px 18px;">
                      <div style="font-size:13px;font-weight:700;color:#92560f;">${t.paymentTitle}</div>
                      <div style="margin-top:4px;font-size:13px;line-height:1.6;color:#7a4a14;">
                        ${t.paymentBody(escapeHtml(b.email))}
                      </div>
                    </td>
                  </tr>
                </table>`}
              </td>
            </tr>

            <!-- Trip cards -->
            <tr>
              <td style="padding:24px 32px 0;">
                <h2 style="margin:0 0 12px;font-size:14px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#888;">${t.shuttles(tripsCount)}</h2>
                ${tripCardsHtml(b.trips, locale)}
              </td>
            </tr>

            <!-- Total -->
            <tr>
              <td style="padding:18px 32px 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:14px;">
                  <tr>
                    <td style="padding:18px 22px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="vertical-align:middle;">
                            <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,.5);">${t.total(tripsCount)}</div>
                            <div style="margin-top:2px;font-size:11px;color:rgba(255,255,255,.4);">${t.vat}</div>
                          </td>
                          <td style="text-align:right;vertical-align:middle;">
                            <div style="font-size:30px;font-weight:700;color:#fff;letter-spacing:-.5px;">$${b.total}</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- What happens next -->
            <tr>
              <td style="padding:30px 32px 0;">
                <h2 style="margin:0 0 14px;font-size:18px;font-weight:700;color:#1a1a1a;letter-spacing:-.3px;">${t.nextTitle}</h2>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:0 0 12px;vertical-align:top;width:38px;">
                      <div style="width:30px;height:30px;line-height:30px;background:#e36414;color:#fff;border-radius:50%;text-align:center;font-size:13px;font-weight:700;">1</div>
                    </td>
                    <td style="padding:0 0 12px;vertical-align:top;">
                      <div style="font-size:14px;font-weight:700;color:#1a1a1a;">${(p ? p.step1 : t.steps[0]).title}</div>
                      <div style="margin-top:2px;font-size:13px;line-height:1.55;color:#666;">${(p ? p.step1 : t.steps[0]).body}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 0 12px;vertical-align:top;">
                      <div style="width:30px;height:30px;line-height:30px;background:#e36414;color:#fff;border-radius:50%;text-align:center;font-size:13px;font-weight:700;">2</div>
                    </td>
                    <td style="padding:0 0 12px;vertical-align:top;">
                      <div style="font-size:14px;font-weight:700;color:#1a1a1a;">${t.steps[1].title}</div>
                      <div style="margin-top:2px;font-size:13px;line-height:1.55;color:#666;">${t.steps[1].body}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0;vertical-align:top;">
                      <div style="width:30px;height:30px;line-height:30px;background:#e36414;color:#fff;border-radius:50%;text-align:center;font-size:13px;font-weight:700;">3</div>
                    </td>
                    <td style="padding:0;vertical-align:top;">
                      <div style="font-size:14px;font-weight:700;color:#1a1a1a;">${t.steps[2].title}</div>
                      <div style="margin-top:2px;font-size:13px;line-height:1.55;color:#666;">${t.steps[2].body}</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- WhatsApp CTA -->
            <tr>
              <td style="padding:26px 32px 0;">
                <a href="https://wa.me/${WHATSAPP_RAW}?text=${encodeURIComponent((p ?? t).whatsappMessage(b.confirmationCode))}" style="display:block;background:#25d366;color:#fff;text-decoration:none;border-radius:12px;padding:14px 18px;font-weight:700;font-size:15px;text-align:center;box-shadow:0 2px 8px rgba(37,211,102,.25);">
                  ${t.whatsappCta(WHATSAPP_DISPLAY)}
                </a>
              </td>
            </tr>

            <!-- Trust strip -->
            <tr>
              <td style="padding:24px 32px 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="33%" style="padding:10px;background:#faf6ee;border-radius:12px;text-align:center;">
                      <div style="font-size:11px;font-weight:700;color:#1a1a1a;">${t.trust.insured}</div>
                    </td>
                    <td width="8" style="font-size:0;">&nbsp;</td>
                    <td width="33%" style="padding:10px;background:#faf6ee;border-radius:12px;text-align:center;">
                      <div style="font-size:11px;font-weight:700;color:#1a1a1a;">${t.trust.ict(ICT_LICENSE)}</div>
                    </td>
                    <td width="8" style="font-size:0;">&nbsp;</td>
                    <td width="33%" style="padding:10px;background:#faf6ee;border-radius:12px;text-align:center;">
                      <div style="font-size:11px;font-weight:700;color:#1a1a1a;">${t.trust.bilingual}</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Important -->
            <tr>
              <td style="padding:22px 32px 30px;">
                <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#888;">${t.goodToKnow}</div>
                <ul style="margin:8px 0 0;padding-left:18px;font-size:13px;line-height:1.7;color:#555;">
                  <li>${t.goodToKnowItems[0]}</li>
                  <li>${t.goodToKnowItems[1]}</li>
                  <li>${t.goodToKnowItems[2]}</li>
                </ul>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:22px 32px;background:#faf6ee;border-top:1px solid #f0e6d2;text-align:center;">
                <div style="font-size:13px;font-weight:700;color:#1a1a1a;">Ruta Pacifico</div>
                <div style="margin-top:4px;font-size:12px;color:#888;line-height:1.6;">
                  ${t.footerAddress}<br/>
                  <a href="${SITE_URL}" style="color:#e36414;text-decoration:none;">rutapacifico.com</a> &middot;
                  <a href="mailto:${RESERVATIONS_EMAIL}" style="color:#e36414;text-decoration:none;">${RESERVATIONS_EMAIL}</a>
                </div>
                <div style="margin-top:12px;font-size:11px;color:#aaa;">${t.footerCode} <strong style="color:#666;">${code}</strong> &middot; ${t.footerKeep}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>`;
}

/**
 * Internal copy for the team: the customer email rendered in English (the
 * team's working language), with a compact strip on top holding the contact
 * details needed to reply fast and the language the customer booked in.
 * The message is sent with Reply-To = customer, so hitting "Reply" from the
 * reservations@ inbox goes straight to them.
 */
function adminEmailHtml(b: BookingEmailInput, logo: string, locale: Locale): string {
  const phoneDigits = b.phone.replace(/[^0-9]/g, "");
  let created = b.createdAt;
  try {
    created = new Date(b.createdAt).toLocaleString("en-US", {
      timeZone: "America/Costa_Rica",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    /* keep raw value */
  }
  const internalHeader = `
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto 14px;background:#1a1a1a;border-radius:14px;">
            <tr>
              <td style="padding:14px 18px;">
                <div style="font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.7);">${b.paid ? "✅ &nbsp;Paid booking (card)" : "🌴☀️ &nbsp;New booking"} &middot; Internal copy</div>${b.paid ? `
                <div style="margin-top:6px;font-size:13px;font-weight:700;color:#86efac;">PAID $${b.paid.amount.toFixed(2)} USD &middot; Auth ${escapeHtml(b.paid.authCode || "—")} &middot; Tx ${escapeHtml(b.paid.transactionId)}</div>` : ""}
                <div style="margin-top:6px;font-size:15px;font-weight:700;color:#fff;">${escapeHtml(b.name)}</div>
                <div style="margin-top:4px;font-size:13px;line-height:1.7;color:rgba(255,255,255,.85);">
                  <a href="mailto:${escapeHtml(b.email)}" style="color:#ffd9a8;text-decoration:none;">${escapeHtml(b.email)}</a>
                  &nbsp;&middot;&nbsp;
                  <a href="https://wa.me/${escapeHtml(phoneDigits)}" style="color:#ffd9a8;text-decoration:none;">${escapeHtml(b.phone)}</a>
                </div>
                <div style="margin-top:6px;font-size:13px;font-weight:700;color:#ffd9a8;">${BOOKING_EMAIL[locale].customerLanguage}</div>
                <div style="margin-top:8px;font-size:11px;color:rgba(255,255,255,.45);">Hit Reply to answer the customer directly. Booked ${escapeHtml(created)} (Costa Rica time)</div>
              </td>
            </tr>
          </table>`;
  const firstTrip = b.trips[0];
  const preheader = `${b.paid ? "✅ PAID · " : "🌴 "}${escapeHtml(b.name)} · ${escapeHtml(firstTrip.from)} → ${escapeHtml(firstTrip.to)} · $${b.total}${b.trips.length > 1 ? ` · ${b.trips.length} shuttles` : ""}`;
  return customerEmailHtml(b, { logo, internalHeader, preheader });
}


export interface SendBookingEmailsResult {
  customer: { ok: boolean; error?: string };
  admin: { ok: boolean; error?: string };
}

/**
 * Customer email + internal copy. Never throws; failures are returned and
 * logged by the caller. `skipAdmin` lets a retry resend only the customer
 * email once the internal copy already went out (otherwise every retry
 * would alert the team again). With no customer address the customer send
 * is reported as failed without calling the provider.
 */
export async function sendBookingEmails(
  b: BookingEmailInput,
  opts: { skipAdmin?: boolean } = {},
): Promise<SendBookingEmailsResult> {
  const locale = customerLocale(b);
  const adminRecipients = getAdminRecipients();
  const hasCustomerEmail = /\S+@\S+\.\S+/.test(b.email || "");
  const subjectSuffix = `${b.confirmationCode} — ${b.name}`;
  const inlineLogo = await getInlineLogo();
  const logo = logoSrc(inlineLogo);
  const attachments = inlineLogo ? [inlineLogo] : undefined;
  const t = BOOKING_EMAIL[locale];

  const [customer, admin] = await Promise.all([
    hasCustomerEmail
      ? sendEmail({
          to: b.email,
          subject: (b.paid ? t.paid : t).subject(b.confirmationCode),
          html: customerEmailHtml(b, { logo, locale }),
          replyTo: adminRecipients[0],
          attachments,
        })
      : Promise.resolve({ ok: false, error: "No customer email on the booking" }),
    opts.skipAdmin
      ? Promise.resolve({ ok: true })
      : adminRecipients.length > 0
      ? sendEmail({
          to: adminRecipients,
          // Send from a distinct address (not the reservations@ inbox) so the
          // copy addressed to reservations@ is not dropped as a mail-to-self.
          from: getNotificationsFrom(),
          // Palm + sun prefix tells the Ruta Pacifico alerts apart from the
          // sister brand's (bell) at a glance in a shared inbox.
          subject: b.paid
            ? `🌴✅ Paid booking · ${subjectSuffix} · $${b.paid.amount.toFixed(2)}`
            : `🌴☀️ New booking · ${subjectSuffix}`,
          html: adminEmailHtml(b, logo, locale),
          replyTo: b.email,
          attachments,
        })
      : Promise.resolve({ ok: false, error: "EMAIL_NOTIFICATIONS_TO not configured" }),
  ]);
  // "Your trip, step by step" follows ~20 minutes later (customer only).
  if (customer.ok) void scheduleHowItWorksEmail(b);
  return { customer, admin };
}
