// Minimal Resend client (no SDK dep — direct REST call).
// Required env vars (see .env.local.example):
//   RESEND_API_KEY            – API key from https://resend.com/api-keys
//   EMAIL_FROM                – e.g. "Ruta Pacifico <reservations@rutapacifico.com>"
//   EMAIL_NOTIFICATIONS_TO    – comma-separated admin recipients
//   EMAIL_REPLY_TO            – optional, defaults to EMAIL_FROM address

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export interface SendEmailInput {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
}

export interface SendEmailResult {
  ok: boolean;
  id?: string;
  error?: string;
}

export function getAdminRecipients(): string[] {
  const raw = process.env.EMAIL_NOTIFICATIONS_TO ?? "";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = input.from ?? process.env.EMAIL_FROM;

  if (!apiKey) return { ok: false, error: "RESEND_API_KEY is not set" };
  if (!from) return { ok: false, error: "EMAIL_FROM is not set" };

  const payload: Record<string, unknown> = {
    from,
    to: Array.isArray(input.to) ? input.to : [input.to],
    subject: input.subject,
    html: input.html,
  };
  if (input.text) payload.text = input.text;
  if (input.cc) payload.cc = Array.isArray(input.cc) ? input.cc : [input.cc];
  if (input.bcc) payload.bcc = Array.isArray(input.bcc) ? input.bcc : [input.bcc];

  const replyTo = input.replyTo ?? process.env.EMAIL_REPLY_TO;
  if (replyTo) payload.reply_to = replyTo;

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errBody = await res.text();
      return { ok: false, error: `Resend ${res.status}: ${errBody.slice(0, 300)}` };
    }
    const data = (await res.json()) as { id?: string };
    return { ok: true, id: data.id };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown email error",
    };
  }
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
