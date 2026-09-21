import { type NextRequest } from "next/server";
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
import { HTML_LANG, localeUrl, type Locale } from "@/lib/i18n";
import { CONTACT_API, CONTACT_EMAIL } from "@/i18n/contact";

export const runtime = "nodejs";

const HERO_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/hero-ruta-pacifico.webp";
const WHATSAPP_DISPLAY = "+506 7080-5578";
const WHATSAPP_RAW = "50670805578";
const RESERVATIONS_EMAIL = "reservations@rutapacifico.com";
const ICT_LICENSE = "#4121-2025";

interface ContactRequestBody {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  /** Site language the form was submitted from ("en" | "es"); anything else means English. */
  locale?: string;
}

function isValidBody(body: unknown): body is ContactRequestBody {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.name === "string" &&
    b.name.trim().length > 0 &&
    b.name.length <= 200 &&
    typeof b.email === "string" &&
    /.+@.+\..+/.test(b.email) &&
    b.email.length <= 200 &&
    typeof b.message === "string" &&
    b.message.trim().length > 0 &&
    b.message.length <= 5000 &&
    (b.phone === undefined || (typeof b.phone === "string" && b.phone.length <= 50)) &&
    (b.subject === undefined || (typeof b.subject === "string" && b.subject.length <= 200)) &&
    (b.locale === undefined || typeof b.locale === "string")
  );
}

/**
 * The customer's language from the (possibly malformed) body: "es" when the
 * form said so, English otherwise. The internal notification stays English.
 */
function localeOf(body: unknown): Locale {
  const locale = body && typeof body === "object" ? (body as Record<string, unknown>).locale : undefined;
  return locale === "es" ? "es" : "en";
}

function adminEmailHtml(b: ContactRequestBody, locale: Locale): string {
  return `
  <div style="font-family:${EMAIL_FONT_STACK};background:#f5f5f5;padding:20px;">
    <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #ddd;">
      <div style="background:#111;color:#fff;padding:16px 20px;">
        <div style="font-size:12px;opacity:.6;text-transform:uppercase;letter-spacing:1px;">Contact form</div>
        <div style="font-size:18px;font-weight:700;margin-top:2px;">${escapeHtml(b.subject || "New message")}</div>
      </div>
      <div style="padding:20px;">
        <table style="width:100%;font-size:14px;color:#222;">
          <tr><td style="padding:4px 0;color:#666;width:90px;">Name</td><td style="padding:4px 0;font-weight:600;">${escapeHtml(b.name)}</td></tr>
          <tr><td style="padding:4px 0;color:#666;">Email</td><td style="padding:4px 0;"><a href="mailto:${escapeHtml(b.email)}" style="color:#e36414;">${escapeHtml(b.email)}</a></td></tr>
          ${b.phone ? `<tr><td style="padding:4px 0;color:#666;">Phone</td><td style="padding:4px 0;"><a href="https://wa.me/${escapeHtml(b.phone.replace(/[^0-9]/g, ""))}" style="color:#e36414;">${escapeHtml(b.phone)}</a></td></tr>` : ""}
        </table>
        <div style="margin-top:10px;font-size:13px;color:#666;">${CONTACT_API[locale].adminLanguageLine}</div>
        <div style="margin-top:14px;padding:14px 16px;background:#faf6ee;border-radius:10px;font-size:14px;color:#222;line-height:1.6;white-space:pre-wrap;">${escapeHtml(b.message)}</div>
      </div>
    </div>
  </div>`;
}

function customerEmailHtml(b: ContactRequestBody, logo: string, locale: Locale): string {
  const t = CONTACT_EMAIL[locale];
  const firstName = escapeHtml(b.name.split(" ")[0] || b.name);
  // "https://rutapacifico.com" / "https://rutapacifico.com/es"
  const homeUrl = localeUrl(locale, "/").replace(/\/$/, "");
  const routesUrl = localeUrl(locale, "/private-shuttle");
  return `
  <!doctype html>
  <html lang="${HTML_LANG[locale]}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${t.subject}</title>
    ${EMAIL_FONT_LINK}
  </head>
  <body style="margin:0;padding:0;background:#f4efe7;font-family:${EMAIL_FONT_STACK};color:#1a1a1a;-webkit-font-smoothing:antialiased;">
    <div style="display:none;font-size:0;line-height:0;color:transparent;max-height:0;overflow:hidden;">${t.preheader(firstName)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4efe7;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.06);">
            <!-- Hero -->
            <tr>
              <td style="position:relative;background-color:#1a1a1a;background-image:url('${HERO_URL}');background-size:cover;background-position:center;padding:0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="background:linear-gradient(135deg,rgba(230,57,70,.86),rgba(227,100,20,.78),rgba(244,162,97,.7));padding:38px 32px 36px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding:0 0 18px;">
                            <img src="${logo}" alt="Ruta Pacifico" width="170" height="71" style="display:block;width:170px;height:auto;border:0;" />
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="padding:0 0 18px;">
                            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                              <tr>
                                <td style="background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.32);border-radius:999px;padding:7px 16px;font-size:11px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:#ffffff;">${t.badge}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="padding:0 0 20px;font-size:30px;line-height:1.2;font-weight:700;color:#ffffff;letter-spacing:-.5px;">${t.greeting(firstName)}</td>
                        </tr>
                        <tr>
                          <td align="center" style="font-size:15px;line-height:1.5;color:rgba(255,255,255,.92);">${t.heroSub}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:32px 32px 8px;">
                <p style="margin:0 0 14px;font-size:16px;line-height:1.65;color:#222;">
                  ${t.body1}
                </p>
                <p style="margin:0 0 22px;font-size:16px;line-height:1.65;color:#222;">
                  ${t.body2}
                </p>
              </td>
            </tr>

            <!-- Their message card -->
            <tr>
              <td style="padding:0 32px 22px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf6ee;border:1px solid #f0e6d2;border-radius:14px;">
                  <tr>
                    <td style="padding:18px 20px;">
                      <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#b07a3a;">${t.yourMessage}</div>
                      ${b.subject ? `<div style="margin-top:8px;font-size:15px;font-weight:700;color:#1a1a1a;">${escapeHtml(b.subject)}</div>` : ""}
                      <div style="margin-top:${b.subject ? "6px" : "10px"};font-size:14px;line-height:1.65;color:#444;white-space:pre-wrap;">${escapeHtml(b.message)}</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Need it now? -->
            <tr>
              <td style="padding:8px 32px 24px;">
                <h2 style="margin:0 0 14px;font-size:18px;font-weight:700;color:#1a1a1a;letter-spacing:-.3px;">${t.needNow}</h2>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:0 0 10px;">
                      <a href="https://wa.me/${WHATSAPP_RAW}" style="display:block;background:#25d366;color:#fff;text-decoration:none;border-radius:12px;padding:14px 18px;font-weight:700;font-size:15px;text-align:center;box-shadow:0 2px 8px rgba(37,211,102,.25);">
                        ${t.whatsappUs} &middot; ${WHATSAPP_DISPLAY}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <a href="mailto:${RESERVATIONS_EMAIL}" style="display:block;background:#ffffff;border:1px solid #e5dfd2;color:#1a1a1a;text-decoration:none;border-radius:12px;padding:14px 18px;font-weight:600;font-size:15px;text-align:center;">
                        ${RESERVATIONS_EMAIL}
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Trust strip -->
            <tr>
              <td style="padding:0 32px 28px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:14px;">
                  <tr>
                    <td style="padding:18px 20px;text-align:center;">
                      <div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#f4a261;">${t.licensedInsured}</div>
                      <div style="margin-top:6px;font-size:14px;color:rgba(255,255,255,.85);line-height:1.5;">
                        ICT ${ICT_LICENSE} &middot; ${t.tourismBoard}<br/>
                        ${t.trustLine}
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- CTA back to site -->
            <tr>
              <td style="padding:0 32px 32px;text-align:center;">
                <a href="${routesUrl}" style="display:inline-block;background:linear-gradient(135deg,#e63946,#e36414,#f4a261);color:#fff;text-decoration:none;border-radius:999px;padding:14px 28px;font-weight:700;font-size:14px;letter-spacing:.3px;box-shadow:0 4px 14px rgba(227,100,20,.35);">
                  ${t.browseRoutes} &nbsp;→
                </a>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:22px 32px;background:#faf6ee;border-top:1px solid #f0e6d2;text-align:center;">
                <div style="font-size:13px;font-weight:700;color:#1a1a1a;">Ruta Pacifico</div>
                <div style="margin-top:4px;font-size:12px;color:#888;line-height:1.6;">
                  Liberia, Guanacaste &middot; Costa Rica<br/>
                  <a href="${homeUrl}" style="color:#e36414;text-decoration:none;">rutapacifico.com</a>
                </div>
                <div style="margin-top:12px;font-size:11px;color:#aaa;">${t.footerNote}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>`;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  if (!isValidBody(body)) {
    return Response.json(
      { ok: false, error: CONTACT_API[localeOf(body)].invalidFields },
      { status: 422 },
    );
  }

  const locale = localeOf(body);
  const errors = CONTACT_API[locale];

  const adminRecipients = getAdminRecipients();
  if (adminRecipients.length === 0) {
    console.error("[contact] EMAIL_NOTIFICATIONS_TO not configured");
    return Response.json(
      { ok: false, error: errors.notConfigured },
      { status: 500 },
    );
  }

  const adminResult = await sendEmail({
    to: adminRecipients,
    // Distinct sender so the reservations@ copy isn't dropped as a mail-to-self.
    from: getNotificationsFrom(),
    subject: `🌴☀️ Contact · ${body.name}${body.subject ? ` — ${body.subject}` : ""}`,
    html: adminEmailHtml(body, locale),
    replyTo: body.email,
  });

  if (!adminResult.ok) {
    console.error("[contact] admin email failed:", adminResult.error);
    return Response.json(
      { ok: false, error: errors.sendFailed },
      { status: 502 },
    );
  }

  // Customer auto-reply (best-effort, never blocks the response).
  const inlineLogo = await getInlineLogo();
  void sendEmail({
    to: body.email,
    subject: CONTACT_EMAIL[locale].subject,
    html: customerEmailHtml(body, logoSrc(inlineLogo), locale),
    replyTo: adminRecipients[0],
    attachments: inlineLogo ? [inlineLogo] : undefined,
  }).then((r) => {
    if (!r.ok) console.error("[contact] customer auto-reply failed:", r.error);
  });

  return Response.json({ ok: true });
}
