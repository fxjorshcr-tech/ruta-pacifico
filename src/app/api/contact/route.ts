import { type NextRequest } from "next/server";
import { sendEmail, escapeHtml, getAdminRecipients } from "@/lib/email";

export const runtime = "nodejs";

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
  return `
  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f8f6f2;padding:24px;">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #eee;">
      <div style="background:linear-gradient(135deg,#e63946,#e36414,#f4a261);padding:24px;text-align:center;color:#fff;">
        <div style="font-size:18px;font-weight:800;letter-spacing:.5px;">RUTA PACIFICO</div>
        <div style="margin-top:4px;font-size:13px;opacity:.9;">We received your message</div>
      </div>
      <div style="padding:22px;">
        <p style="margin:0 0 12px;color:#111;">Hi ${escapeHtml(b.name)},</p>
        <p style="margin:0 0 14px;color:#444;line-height:1.6;">
          Thanks for reaching out — we'll get back to you shortly. For faster
          responses, message us on WhatsApp at
          <a href="https://wa.me/50685962438" style="color:#e36414;">+506 8596-2438</a>.
        </p>
        <div style="padding:14px 16px;background:#faf6ee;border-radius:10px;font-size:13px;color:#444;line-height:1.6;white-space:pre-wrap;">${escapeHtml(b.message)}</div>
      </div>
      <div style="padding:14px 24px;background:#fafafa;border-top:1px solid #eee;text-align:center;font-size:11px;color:#999;">
        ICT Licensed #4121-2025 · Costa Rica Tourism Board
      </div>
    </div>
  </div>`;
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
