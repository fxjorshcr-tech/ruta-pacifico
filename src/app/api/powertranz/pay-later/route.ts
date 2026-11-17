import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabaseAdmin";
import { checkRateLimit, getClientIP } from "@/lib/rateLimit";
import { loadRpBooking, isRpBookingPaid, rpBookingToEmailInput } from "@/lib/rpBookings";
import { sendBookingEmails } from "@/lib/bookingEmails";

/**
 * Escape hatch from the card step (declined card / gateway unavailable):
 * sends the same "booking received, payment link coming" pair of emails the
 * link flow sends, which the card flow had held back. Once per booking.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!checkRateLimit(`ptz_paylater:${getClientIP(request)}`, 10, 60).success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ error: "Not available" }, { status: 503 });
  }
  let body: { bookingId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const bookingId = String(body?.bookingId || "").trim();
  if (!bookingId) return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });

  const db = getSupabaseAdmin();
  const booking = await loadRpBooking(db, bookingId);
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  if (isRpBookingPaid(booking)) return NextResponse.json({ error: "This booking has already been paid" }, { status: 409 });

  // Atomic "first caller sends": a double click must not alert the team twice.
  const { data: claimed } = await db
    .from("rp_bookings")
    .update({ pending_emails_sent_at: new Date().toISOString() })
    .eq("id", booking.id)
    .is("pending_emails_sent_at", null)
    .select("id")
    .maybeSingle();
  if (!claimed) return NextResponse.json({ ok: true, alreadySent: true });

  const r = await sendBookingEmails(rpBookingToEmailInput(booking));
  if (!r.customer.ok) console.error("[Powertranz PayLater] customer email failed:", r.customer.error);
  if (!r.admin.ok) console.error("[Powertranz PayLater] admin email failed:", r.admin.error);
  if (!r.customer.ok) {
    // Let them try again later rather than leaving a silent gap.
    await db.from("rp_bookings").update({ pending_emails_sent_at: null }).eq("id", booking.id);
    return NextResponse.json({ error: "Could not send the email" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
