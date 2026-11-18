import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabaseAdmin";
import { checkRateLimit, getClientIP } from "@/lib/rateLimit";
import { loadRpBooking, isRpBookingPaid, isUuid } from "@/lib/rpBookings";

/**
 * Reopen a saved booking so the customer can pay it (or see its receipt)
 * from a link: /private-shuttle/checkout?pay=<rp_bookings.id>.
 * The unguessable UUID is the capability; only what the checkout needs to
 * render is returned.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!checkRateLimit(`booking_resume:${getClientIP(request)}`, 30, 60).success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ error: "Not available" }, { status: 503 });
  }
  const id = (request.nextUrl.searchParams.get("id") || "").trim();
  if (!isUuid(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const booking = await loadRpBooking(getSupabaseAdmin(), id);
  if (!booking || booking.status === "cancelled") {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  return NextResponse.json({
    bookingId: booking.id,
    confirmationCode: booking.confirmation_code,
    locale: booking.locale,
    name: booking.customer_name,
    email: booking.customer_email,
    phone: booking.customer_phone,
    trips: booking.trips,
    total: Number(booking.total_amount),
    createdAt: booking.created_at,
    paid: isRpBookingPaid(booking),
  });
}
