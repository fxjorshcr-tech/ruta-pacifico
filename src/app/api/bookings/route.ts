import { type NextRequest } from "next/server";
import type { TripItem } from "@/lib/booking";
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

interface BookingRequestBody {
  trips: TripItem[];
  name: string;
  email: string;
  phone: string;
  notes?: string;
  total: number;
  confirmationCode: string;
  createdAt: string;
}

function isValidBody(body: unknown): body is BookingRequestBody {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    Array.isArray(b.trips) &&
    b.trips.length > 0 &&
    typeof b.name === "string" &&
    b.name.trim().length > 0 &&
    typeof b.email === "string" &&
    /.+@.+\..+/.test(b.email) &&
    typeof b.phone === "string" &&
    b.phone.trim().length > 0 &&
    typeof b.total === "number" &&
    typeof b.confirmationCode === "string" &&
    typeof b.createdAt === "string"
  );
}

function formatDate(iso: string): string {
  if (!iso) return "";
  try {
    return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function formatTime(iso: string): string {
  if (!iso) return "";
  const [h, m] = iso.split(":").map(Number);
  if (Number.isNaN(h)) return iso;
  const d = new Date();
  d.setHours(h, m ?? 0);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function tripCardsHtml(trips: TripItem[]): string {
  return trips
    .map((t, i) => {
      const pax =
        `${t.adults} adult${t.adults !== 1 ? "s" : ""}` +
        (t.children > 0
          ? `, ${t.children} child${t.children !== 1 ? "ren" : ""}`
          : "");
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
                    <span style="font-size:16px;font-weight:800;color:#1a1a1a;">${escapeHtml(t.from)}</span>
                    <span style="color:#e36414;font-weight:700;">&nbsp;→&nbsp;</span>
                    <span style="font-size:16px;font-weight:800;color:#1a1a1a;">${escapeHtml(t.to)}</span>
                    <div style="margin-top:4px;font-size:12px;color:#999;">
                      ${escapeHtml(formatDate(t.date))} &middot; ${escapeHtml(formatTime(t.time))}${t.duracion ? ` &middot; ~${escapeHtml(t.duracion)}` : ""}
                    </div>
                  </td>
                  <td style="text-align:right;vertical-align:top;white-space:nowrap;">
                    <div style="font-size:20px;font-weight:800;color:#e36414;">$${t.price}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:14px 20px 18px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${detailRow("Vehicle", `${escapeHtml(t.vehicleName)} (${escapeHtml(t.vehiclePax)})`)}
                ${detailRow("Travelers", escapeHtml(pax))}
                ${t.flight ? detailRow("Flight", escapeHtml(t.flight)) : ""}
                ${detailRow("Pickup", escapeHtml(t.pickup))}
                ${detailRow("Drop-off", escapeHtml(t.dropoff))}
              </table>
            </td>
          </tr>
        </table>`;
    })
    .join("");
}

function tripRowsHtml(trips: TripItem[]): string {
  return trips
    .map((t, i) => {
      const pax =
        `${t.adults} adult${t.adults !== 1 ? "s" : ""}` +
        (t.children > 0
          ? `, ${t.children} child${t.children !== 1 ? "ren" : ""}`
          : "");
      return `
        <tr>
          <td style="padding:14px 16px;border-bottom:1px solid #eee;">
            <div style="font-weight:700;color:#111;">
              ${trips.length > 1 ? `${i + 1}. ` : ""}${escapeHtml(t.from)} → ${escapeHtml(t.to)}
            </div>
            <div style="font-size:13px;color:#666;margin-top:4px;">
              ${escapeHtml(formatDate(t.date))} · ${escapeHtml(formatTime(t.time))}
              ${t.duracion ? ` · ~${escapeHtml(t.duracion)}` : ""}
            </div>
            <div style="font-size:13px;color:#444;margin-top:8px;line-height:1.6;">
              <div><strong>Vehicle:</strong> ${escapeHtml(t.vehicleName)} (${escapeHtml(t.vehiclePax)})</div>
              <div><strong>Travelers:</strong> ${escapeHtml(pax)}</div>
              ${t.flight ? `<div><strong>Flight:</strong> ${escapeHtml(t.flight)}</div>` : ""}
              <div><strong>Pickup:</strong> ${escapeHtml(t.pickup)}</div>
              <div><strong>Drop-off:</strong> ${escapeHtml(t.dropoff)}</div>
            </div>
          </td>
          <td style="padding:14px 16px;border-bottom:1px solid #eee;text-align:right;font-weight:700;color:#e36414;white-space:nowrap;vertical-align:top;">
            $${t.price}
          </td>
        </tr>`;
    })
    .join("");
}

function customerEmailHtml(b: BookingRequestBody): string {
  const firstName = escapeHtml(b.name.split(" ")[0] || b.name);
  const tripsCount = b.trips.length;
  return `
  <!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Reservation confirmed · ${escapeHtml(b.confirmationCode)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f4efe7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1a1a1a;-webkit-font-smoothing:antialiased;">
    <div style="display:none;font-size:0;line-height:0;color:transparent;max-height:0;overflow:hidden;">Reservation ${escapeHtml(b.confirmationCode)} confirmed for ${firstName}. We&#39;ll send your secure payment link shortly.</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4efe7;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">
            <!-- Hero -->
            <tr>
              <td style="background-color:#1a1a1a;background-image:url('${HERO_URL}');background-size:cover;background-position:center;padding:0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="background:linear-gradient(135deg,rgba(230,57,70,.86),rgba(227,100,20,.78),rgba(244,162,97,.7));padding:38px 32px 36px;text-align:center;">
                      <img src="${LOGO_URL}" alt="Ruta Pacifico" width="170" style="display:block;margin:0 auto 18px;height:auto;max-width:170px;" />
                      <div style="display:inline-block;background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.32);border-radius:999px;padding:7px 16px;font-size:11px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:#fff;">✓ Reservation confirmed</div>
                      <h1 style="margin:18px 0 6px;font-size:30px;font-weight:800;color:#fff;letter-spacing:-.5px;line-height:1.2;">¡Pura vida, ${firstName}!</h1>
                      <p style="margin:0 0 20px;font-size:15px;color:rgba(255,255,255,.92);line-height:1.5;">Your private shuttle is booked. We can&rsquo;t wait to drive you.</p>
                      <div style="display:inline-block;background:rgba(0,0,0,.28);border:1px solid rgba(255,255,255,.18);border-radius:14px;padding:12px 20px;">
                        <div style="font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.7);">Confirmation code</div>
                        <div style="margin-top:4px;font-family:'SF Mono',Menlo,Consolas,monospace;font-size:22px;font-weight:800;letter-spacing:2px;color:#ffd9a8;">${escapeHtml(b.confirmationCode)}</div>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Greeting body -->
            <tr>
              <td style="padding:32px 32px 8px;">
                <p style="margin:0 0 14px;font-size:16px;line-height:1.65;color:#222;">
                  Thank you so much for choosing <strong>Ruta Pacifico</strong>. Your seat is officially held — and we&rsquo;ve already added your trip to our schedule.
                </p>
                <p style="margin:0;font-size:16px;line-height:1.65;color:#222;">
                  In a few minutes you&rsquo;ll get a separate message with your <strong>secure payment link</strong>. As soon as payment clears, the booking becomes final and we&rsquo;ll start monitoring your itinerary.
                </p>
              </td>
            </tr>

            <!-- Payment notice -->
            <tr>
              <td style="padding:18px 32px 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fff8eb;border:1px solid #f6e3b8;border-radius:14px;">
                  <tr>
                    <td style="padding:16px 18px;">
                      <div style="font-size:13px;font-weight:800;color:#92560f;">💳 &nbsp;Payment link on the way</div>
                      <div style="margin-top:4px;font-size:13px;line-height:1.6;color:#7a4a14;">
                        Watch your inbox at <strong>${escapeHtml(b.email)}</strong> and your WhatsApp at <strong>${escapeHtml(b.phone)}</strong>. Your reservation is held in the meantime.
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Trip cards -->
            <tr>
              <td style="padding:24px 32px 0;">
                <h2 style="margin:0 0 12px;font-size:14px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:#888;">${tripsCount === 1 ? "Your shuttle" : `Your ${tripsCount} shuttles`}</h2>
                ${tripCardsHtml(b.trips)}
              </td>
            </tr>

            ${
              b.notes
                ? `<tr>
                    <td style="padding:14px 32px 0;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf6ee;border:1px solid #f0e6d2;border-radius:14px;">
                        <tr>
                          <td style="padding:14px 18px;">
                            <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#b07a3a;">Special requests</div>
                            <div style="margin-top:4px;font-size:14px;line-height:1.6;color:#444;">${escapeHtml(b.notes)}</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>`
                : ""
            }

            <!-- Total -->
            <tr>
              <td style="padding:18px 32px 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:14px;">
                  <tr>
                    <td style="padding:18px 22px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="vertical-align:middle;">
                            <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,.5);">Total &middot; ${tripsCount} shuttle${tripsCount !== 1 ? "s" : ""}</div>
                            <div style="margin-top:2px;font-size:11px;color:rgba(255,255,255,.4);">13% VAT included</div>
                          </td>
                          <td style="text-align:right;vertical-align:middle;">
                            <div style="font-size:30px;font-weight:800;color:#fff;letter-spacing:-.5px;">$${b.total}</div>
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
                <h2 style="margin:0 0 14px;font-size:18px;font-weight:800;color:#1a1a1a;letter-spacing:-.3px;">What happens next</h2>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:0 0 12px;vertical-align:top;width:38px;">
                      <div style="width:30px;height:30px;line-height:30px;background:#e36414;color:#fff;border-radius:50%;text-align:center;font-size:13px;font-weight:800;">1</div>
                    </td>
                    <td style="padding:0 0 12px;vertical-align:top;">
                      <div style="font-size:14px;font-weight:700;color:#1a1a1a;">Pay with the secure link</div>
                      <div style="margin-top:2px;font-size:13px;line-height:1.55;color:#666;">We send it to your email + WhatsApp within minutes. Card or bank transfer.</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 0 12px;vertical-align:top;">
                      <div style="width:30px;height:30px;line-height:30px;background:#e36414;color:#fff;border-radius:50%;text-align:center;font-size:13px;font-weight:800;">2</div>
                    </td>
                    <td style="padding:0 0 12px;vertical-align:top;">
                      <div style="font-size:14px;font-weight:700;color:#1a1a1a;">Driver details, the day before</div>
                      <div style="margin-top:2px;font-size:13px;line-height:1.55;color:#666;">Name, photo, plate, and direct phone — sent the day before your pickup.</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0;vertical-align:top;">
                      <div style="width:30px;height:30px;line-height:30px;background:#e36414;color:#fff;border-radius:50%;text-align:center;font-size:13px;font-weight:800;">3</div>
                    </td>
                    <td style="padding:0;vertical-align:top;">
                      <div style="font-size:14px;font-weight:700;color:#1a1a1a;">Meet &amp; greet, on time</div>
                      <div style="margin-top:2px;font-size:13px;line-height:1.55;color:#666;">If it&rsquo;s an airport pickup, we monitor your flight in real time. Just look for the sign with your name.</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- WhatsApp CTA -->
            <tr>
              <td style="padding:26px 32px 0;">
                <a href="https://wa.me/${WHATSAPP_RAW}?text=${encodeURIComponent(`Hi! Booking ${b.confirmationCode} — could you send me the payment link?`)}" style="display:block;background:#25d366;color:#fff;text-decoration:none;border-radius:12px;padding:14px 18px;font-weight:700;font-size:15px;text-align:center;box-shadow:0 2px 8px rgba(37,211,102,.25);">
                  💬 &nbsp;Message us on WhatsApp &middot; ${WHATSAPP_DISPLAY}
                </a>
              </td>
            </tr>

            <!-- Trust strip -->
            <tr>
              <td style="padding:24px 32px 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="33%" style="padding:10px;background:#faf6ee;border-radius:12px;text-align:center;">
                      <div style="font-size:18px;">🛡️</div>
                      <div style="margin-top:4px;font-size:11px;font-weight:700;color:#1a1a1a;">Insured</div>
                    </td>
                    <td width="8" style="font-size:0;">&nbsp;</td>
                    <td width="33%" style="padding:10px;background:#faf6ee;border-radius:12px;text-align:center;">
                      <div style="font-size:18px;">⭐</div>
                      <div style="margin-top:4px;font-size:11px;font-weight:700;color:#1a1a1a;">ICT ${ICT_LICENSE}</div>
                    </td>
                    <td width="8" style="font-size:0;">&nbsp;</td>
                    <td width="33%" style="padding:10px;background:#faf6ee;border-radius:12px;text-align:center;">
                      <div style="font-size:18px;">🇨🇷</div>
                      <div style="margin-top:4px;font-size:11px;font-weight:700;color:#1a1a1a;">Bilingual drivers</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Important -->
            <tr>
              <td style="padding:22px 32px 30px;">
                <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#888;">Good to know</div>
                <ul style="margin:8px 0 0;padding-left:18px;font-size:13px;line-height:1.7;color:#555;">
                  <li>Free changes up to 48h before pickup</li>
                  <li>Baby seats &amp; boosters at no extra cost — just reply with ages</li>
                  <li>1 large bag + 1 carry-on per traveler included</li>
                </ul>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:22px 32px;background:#faf6ee;border-top:1px solid #f0e6d2;text-align:center;">
                <div style="font-size:13px;font-weight:700;color:#1a1a1a;">Ruta Pacifico</div>
                <div style="margin-top:4px;font-size:12px;color:#888;line-height:1.6;">
                  Liberia, Guanacaste &middot; Costa Rica<br/>
                  <a href="${SITE_URL}" style="color:#e36414;text-decoration:none;">rutapacifico.com</a> &middot;
                  <a href="mailto:${RESERVATIONS_EMAIL}" style="color:#e36414;text-decoration:none;">${RESERVATIONS_EMAIL}</a>
                </div>
                <div style="margin-top:12px;font-size:11px;color:#aaa;">Confirmation code <strong style="color:#666;">${escapeHtml(b.confirmationCode)}</strong> &middot; Keep this email for your records.</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>`;
}

function adminEmailHtml(b: BookingRequestBody): string {
  return `
  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f5f5f5;padding:20px;">
    <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #ddd;">
      <div style="background:#111;color:#fff;padding:16px 20px;">
        <div style="font-size:12px;opacity:.6;text-transform:uppercase;letter-spacing:1px;">New Reservation</div>
        <div style="font-size:18px;font-weight:700;margin-top:2px;font-family:monospace;">${escapeHtml(b.confirmationCode)}</div>
      </div>
      <div style="padding:20px;">
        <table style="width:100%;font-size:14px;color:#222;">
          <tr><td style="padding:4px 0;color:#666;width:120px;">Customer</td><td style="padding:4px 0;font-weight:600;">${escapeHtml(b.name)}</td></tr>
          <tr><td style="padding:4px 0;color:#666;">Email</td><td style="padding:4px 0;"><a href="mailto:${escapeHtml(b.email)}" style="color:#e36414;">${escapeHtml(b.email)}</a></td></tr>
          <tr><td style="padding:4px 0;color:#666;">Phone</td><td style="padding:4px 0;"><a href="https://wa.me/${escapeHtml(b.phone.replace(/[^0-9]/g, ""))}" style="color:#e36414;">${escapeHtml(b.phone)}</a></td></tr>
          <tr><td style="padding:4px 0;color:#666;">Total</td><td style="padding:4px 0;font-weight:700;">$${b.total}</td></tr>
          <tr><td style="padding:4px 0;color:#666;">Created</td><td style="padding:4px 0;">${escapeHtml(b.createdAt)}</td></tr>
        </table>
        ${
          b.notes
            ? `<div style="margin-top:12px;padding:10px 12px;background:#fff8e1;border-left:3px solid #f4a261;border-radius:4px;font-size:13px;">
                 <strong>Notes:</strong> ${escapeHtml(b.notes)}
               </div>`
            : ""
        }
        <h3 style="margin:20px 0 8px;font-size:13px;color:#666;text-transform:uppercase;letter-spacing:1px;">Trips</h3>
        <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;border:1px solid #eee;border-radius:8px;overflow:hidden;">
          ${tripRowsHtml(b.trips)}
        </table>
      </div>
    </div>
  </div>`;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  if (!isValidBody(body)) {
    return Response.json(
      { ok: false, error: "Missing or invalid fields" },
      { status: 422 },
    );
  }

  const adminRecipients = getAdminRecipients();
  const subjectSuffix = `${body.confirmationCode} — ${body.name}`;

  const [customerResult, adminResult] = await Promise.all([
    sendEmail({
      to: body.email,
      subject: `Your Ruta Pacifico reservation ${body.confirmationCode}`,
      html: customerEmailHtml(body),
      replyTo: adminRecipients[0],
    }),
    adminRecipients.length > 0
      ? sendEmail({
          to: adminRecipients,
          subject: `New booking · ${subjectSuffix}`,
          html: adminEmailHtml(body),
          replyTo: body.email,
        })
      : Promise.resolve({ ok: false, error: "EMAIL_NOTIFICATIONS_TO not configured" }),
  ]);

  if (!customerResult.ok) {
    console.error("[bookings] customer email failed:", customerResult.error);
  }
  if (!adminResult.ok) {
    console.error("[bookings] admin email failed:", adminResult.error);
  }

  return Response.json({
    ok: true,
    confirmationCode: body.confirmationCode,
  });
}
