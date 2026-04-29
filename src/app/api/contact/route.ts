import { type NextRequest } from "next/server";
import { sendEmail, escapeHtml, getAdminRecipients } from "@/lib/email";

export const runtime = "nodejs";

const LOGO_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/Logo%20Transparente.png";
const HERO_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/hero-ruta-pacifico.webp";
const SITE_URL = "https://rutapacifico.com";
const WHATSAPP_DISPLAY = "+506 8596-2438";
const WHATSAPP_RAW = "50685962438";
const RESERVATIONS_EMAIL = "reservations@rutapacifico.com";
const ICT_LICENSE = "#4121-2025";

interface ContactRequestBody {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
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
    (b.subject === undefined || (typeof b.subject === "string" && b.subject.length <= 200))
  );
}

function adminEmailHtml(b: ContactRequestBody): string {
  return `
  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f5f5f5;padding:20px;">
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
        <div style="margin-top:14px;padding:14px 16px;background:#faf6ee;border-radius:10px;font-size:14px;color:#222;line-height:1.6;white-space:pre-wrap;">${escapeHtml(b.message)}</div>
      </div>
    </div>
  </div>`;
}

function customerEmailHtml(b: ContactRequestBody): string {
  const firstName = escapeHtml(b.name.split(" ")[0] || b.name);
  return `
  <!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>We received your message · Ruta Pacifico</title>
  </head>
  <body style="margin:0;padding:0;background:#f4efe7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1a1a1a;-webkit-font-smoothing:antialiased;">
    <div style="display:none;font-size:0;line-height:0;color:transparent;max-height:0;overflow:hidden;">Pura vida, ${firstName}! Thanks for reaching out — we'll get back to you within a few hours.</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4efe7;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.06);">
            <!-- Hero -->
            <tr>
              <td style="position:relative;background-color:#1a1a1a;background-image:url('${HERO_URL}');background-size:cover;background-position:center;padding:0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="background:linear-gradient(135deg,rgba(230,57,70,.85),rgba(227,100,20,.78),rgba(244,162,97,.7));padding:40px 32px;text-align:center;">
                      <img src="${LOGO_URL}" alt="Ruta Pacifico" width="180" style="display:block;margin:0 auto 16px;height:auto;max-width:180px;" />
                      <div style="display:inline-block;background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.3);border-radius:999px;padding:6px 14px;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#fff;backdrop-filter:blur(8px);">Message received</div>
                      <h1 style="margin:18px 0 6px;font-size:30px;font-weight:800;color:#fff;letter-spacing:-.5px;line-height:1.2;">¡Pura vida, ${firstName}!</h1>
                      <p style="margin:0;font-size:15px;color:rgba(255,255,255,.92);line-height:1.5;">Thanks for reaching out — we&rsquo;ve got your message.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:32px 32px 8px;">
                <p style="margin:0 0 14px;font-size:16px;line-height:1.65;color:#222;">
                  We&rsquo;re a small bilingual team based in Guanacaste and we read every message ourselves. You&rsquo;ll usually hear back from us <strong>within a few hours</strong> during the day, and first thing in the morning if you wrote at night.
                </p>
                <p style="margin:0 0 22px;font-size:16px;line-height:1.65;color:#222;">
                  In the meantime, save this email — it has all our contact info if you need to reach us faster.
                </p>
              </td>
            </tr>

            <!-- Their message card -->
            <tr>
              <td style="padding:0 32px 22px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf6ee;border:1px solid #f0e6d2;border-radius:14px;">
                  <tr>
                    <td style="padding:18px 20px;">
                      <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#b07a3a;">Your message</div>
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
                <h2 style="margin:0 0 14px;font-size:18px;font-weight:800;color:#1a1a1a;letter-spacing:-.3px;">Need an answer right now?</h2>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:0 0 10px;">
                      <a href="https://wa.me/${WHATSAPP_RAW}" style="display:block;background:#25d366;color:#fff;text-decoration:none;border-radius:12px;padding:14px 18px;font-weight:700;font-size:15px;text-align:center;box-shadow:0 2px 8px rgba(37,211,102,.25);">
                        💬 &nbsp;WhatsApp us &middot; ${WHATSAPP_DISPLAY}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <a href="mailto:${RESERVATIONS_EMAIL}" style="display:block;background:#ffffff;border:1px solid #e5dfd2;color:#1a1a1a;text-decoration:none;border-radius:12px;padding:14px 18px;font-weight:600;font-size:15px;text-align:center;">
                        ✉️ &nbsp;${RESERVATIONS_EMAIL}
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
                      <div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#f4a261;">Licensed &amp; Insured</div>
                      <div style="margin-top:6px;font-size:14px;color:rgba(255,255,255,.85);line-height:1.5;">
                        ICT ${ICT_LICENSE} &middot; Costa Rica Tourism Board<br/>
                        Professional bilingual drivers &middot; Modern fleet
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- CTA back to site -->
            <tr>
              <td style="padding:0 32px 32px;text-align:center;">
                <a href="${SITE_URL}/private-shuttle" style="display:inline-block;background:linear-gradient(135deg,#e63946,#e36414,#f4a261);color:#fff;text-decoration:none;border-radius:999px;padding:14px 28px;font-weight:700;font-size:14px;letter-spacing:.3px;box-shadow:0 4px 14px rgba(227,100,20,.35);">
                  Browse our routes &nbsp;→
                </a>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:22px 32px;background:#faf6ee;border-top:1px solid #f0e6d2;text-align:center;">
                <div style="font-size:13px;font-weight:700;color:#1a1a1a;">Ruta Pacifico</div>
                <div style="margin-top:4px;font-size:12px;color:#888;line-height:1.6;">
                  Liberia, Guanacaste &middot; Costa Rica<br/>
                  <a href="${SITE_URL}" style="color:#e36414;text-decoration:none;">rutapacifico.com</a>
                </div>
                <div style="margin-top:12px;font-size:11px;color:#aaa;">You&rsquo;re receiving this because you contacted us through our website.</div>
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
    return Response.json({ ok: false, error: "Missing or invalid fields" }, { status: 422 });
  }

  const adminRecipients = getAdminRecipients();
  if (adminRecipients.length === 0) {
    console.error("[contact] EMAIL_NOTIFICATIONS_TO not configured");
    return Response.json(
      { ok: false, error: "Server email not configured" },
      { status: 500 },
    );
  }

  const adminResult = await sendEmail({
    to: adminRecipients,
    subject: `Contact · ${body.name}${body.subject ? ` — ${body.subject}` : ""}`,
    html: adminEmailHtml(body),
    replyTo: body.email,
  });

  if (!adminResult.ok) {
    console.error("[contact] admin email failed:", adminResult.error);
    return Response.json(
      { ok: false, error: "Could not send your message. Please try WhatsApp instead." },
      { status: 502 },
    );
  }

  // Customer auto-reply (best-effort, never blocks the response).
  void sendEmail({
    to: body.email,
    subject: "We received your message · Ruta Pacifico",
    html: customerEmailHtml(body),
    replyTo: adminRecipients[0],
  }).then((r) => {
    if (!r.ok) console.error("[contact] customer auto-reply failed:", r.error);
  });

  return Response.json({ ok: true });
}
