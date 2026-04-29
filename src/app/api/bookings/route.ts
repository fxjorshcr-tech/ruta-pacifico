import { type NextRequest } from "next/server";
import type { TripItem } from "@/lib/booking";
import { sendEmail, escapeHtml, getAdminRecipients } from "@/lib/email";

export const runtime = "nodejs";

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
  const tripsCount = b.trips.length;
  return `
  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f8f6f2;padding:24px;">
    <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #eee;">
      <div style="background:linear-gradient(135deg,#e63946,#e36414,#f4a261);padding:28px 24px;text-align:center;color:#fff;">
        <div style="font-size:20px;font-weight:800;letter-spacing:.5px;">RUTA PACIFICO</div>
        <div style="margin-top:6px;font-size:14px;opacity:.9;">Reservation confirmed</div>
        <div style="margin-top:14px;display:inline-block;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.25);border-radius:999px;padding:8px 16px;font-family:monospace;font-size:16px;font-weight:700;letter-spacing:1px;">
          ${escapeHtml(b.confirmationCode)}
        </div>
      </div>
      <div style="padding:24px;">
        <p style="margin:0 0 12px;color:#111;">Hi ${escapeHtml(b.name)},</p>
        <p style="margin:0 0 16px;color:#444;line-height:1.6;">
          Thank you for booking with Ruta Pacifico. Your reservation is held —
          we'll send a <strong>secure payment link</strong> to this email and via
          WhatsApp shortly. The booking is final once payment completes.
        </p>
        <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin-top:8px;">
          ${tripRowsHtml(b.trips)}
        </table>
        ${
          b.notes
            ? `<div style="margin-top:16px;padding:12px 14px;background:#faf6ee;border-radius:10px;font-size:13px;color:#444;">
                 <div style="font-weight:700;color:#666;text-transform:uppercase;letter-spacing:.5px;font-size:11px;">Special requests</div>
                 <div style="margin-top:4px;">${escapeHtml(b.notes)}</div>
               </div>`
            : ""
        }
        <div style="margin-top:20px;padding:16px;background:#111;color:#fff;border-radius:12px;display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-size:12px;opacity:.6;">Total (${tripsCount} shuttle${tripsCount !== 1 ? "s" : ""})</div>
            <div style="font-size:11px;opacity:.5;">13% VAT included</div>
          </div>
          <div style="font-size:24px;font-weight:800;">$${b.total}</div>
        </div>
        <p style="margin:20px 0 0;color:#555;font-size:13px;line-height:1.6;">
          Need to make changes? Reply to this email or message us on WhatsApp at
          <a href="https://wa.me/50685962438" style="color:#e36414;">+506 8596-2438</a>.
        </p>
      </div>
      <div style="padding:14px 24px;background:#fafafa;border-top:1px solid #eee;text-align:center;font-size:11px;color:#999;">
        ICT Licensed #4121-2025 · Costa Rica Tourism Board
      </div>
    </div>
  </div>`;
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
