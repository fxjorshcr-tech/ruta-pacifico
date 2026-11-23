import { type NextRequest } from "next/server";
import type { TripItem } from "@/lib/booking";
import {
  sendBookingEmails,
  customerLocale,
  type BookingEmailInput,
} from "@/lib/bookingEmails";
import { isPickupDateAllowed, LEAD_TIME_MESSAGE } from "@/lib/leadTime";
import { PEAK_CAPACITY_API_MESSAGE, isPeakCapacityBlocked } from "@/lib/peakCapacity";
import { getTier, isVehicleKey } from "@/lib/vehicles";
import { repriceTrips } from "@/lib/serverPricing";
import { registerBookingInPanel } from "@/lib/panelRegistry";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabaseAdmin";
import { getClientIP } from "@/lib/rateLimit";

export const runtime = "nodejs";

interface BookingRequestBody extends BookingEmailInput {
  trips: TripItem[];
  /**
   * Card flow (NEXT_PUBLIC_PAYMENT_PROVIDER=powertranz): persist the booking
   * with a server-computed total and hold the emails — the paid confirmation
   * goes out from the Powertranz callback, or the pending pair from
   * /api/powertranz/pay-later if the customer bails out of the card step.
   */
  payWithCard?: boolean;
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

  // Enforce the lead-time rule server-side; the UI already prevents this, but
  // a stale cart or a hand-crafted request must not create a same-day booking.
  const tooSoon = body.trips.find((t) => !isPickupDateAllowed(t.date));
  if (tooSoon) {
    return Response.json(
      {
        ok: false,
        error: `Pickup on ${tooSoon.date} is too soon. ${LEAD_TIME_MESSAGE}`,
      },
      { status: 422 },
    );
  }

  // Peak-season capacity: no large vehicle exists for these travel dates, so
  // a request for one is refused whatever the UI showed. The vehicle key is
  // checked as well as the head count: a group of 4 in a Hiace is still a
  // Hiace we do not have.
  const peakBlocked = body.trips.find((t) => {
    const pax = (Number(t.adults) || 0) + (Number(t.children) || 0);
    const vehicleMax = isVehicleKey(t.vehicleKey) ? getTier(t.vehicleKey).maxPax : pax;
    return isPeakCapacityBlocked(t.date, pax, vehicleMax);
  });
  if (peakBlocked) {
    return Response.json(
      {
        ok: false,
        error: `${peakBlocked.from} → ${peakBlocked.to} on ${peakBlocked.date}: ${PEAK_CAPACITY_API_MESSAGE}`,
      },
      { status: 422 },
    );
  }

  // ── Card flow: price on the server, persist, no emails yet ──────────────
  if (body.payWithCard === true) {
    if (!isSupabaseAdminConfigured()) {
      // Misconfigured environment: fall through to the payment-link flow
      // below so the customer is never stuck. The checkout treats a missing
      // bookingId as "card step unavailable".
      console.error("[bookings] payWithCard requested but SUPABASE_SERVICE_ROLE_KEY is missing; using the link flow");
    } else {
      const priced = await repriceTrips(body.trips);
      if (!priced.ok) {
        return Response.json({ ok: false, error: priced.error }, { status: 422 });
      }
      if (priced.adjusted) {
        console.warn("[bookings] client total differed from server total", {
          code: body.confirmationCode,
          clientTotal: body.total,
          serverTotal: priced.total,
        });
      }
      const { data: row, error } = await getSupabaseAdmin()
        .from("rp_bookings")
        .insert({
          confirmation_code: body.confirmationCode,
          locale: customerLocale(body),
          customer_name: body.name.trim(),
          customer_email: body.email.trim(),
          customer_phone: body.phone.trim(),
          trips: priced.trips,
          total_amount: priced.total,
          client_total: body.total,
          currency: "USD",
          status: "pending_payment",
          payment_status: "pending",
          ip_address: getClientIP(request),
          user_agent: request.headers.get("user-agent") || "",
        })
        .select("id")
        .single();
      if (error || !row) {
        console.error("[bookings] rp_bookings insert failed:", error);
        return Response.json({ ok: false, error: "Could not save your booking. Please try again." }, { status: 500 });
      }
      // Operations panel: the leg(s) appear as pending until the card goes through.
      void registerBookingInPanel({ ...body, trips: priced.trips, total: priced.total }, { status: "pending" }, getSupabaseAdmin());
      return Response.json({
        ok: true,
        confirmationCode: body.confirmationCode,
        bookingId: row.id as string,
        total: priced.total,
        trips: priced.trips,
      });
    }
  }

  // ── Payment-link flow (unchanged): email the customer + the team ─────────
  void registerBookingInPanel(body, { status: "pending" });
  const { customer, admin } = await sendBookingEmails(body);
  if (!customer.ok) {
    console.error("[bookings] customer email failed:", customer.error);
  }
  if (!admin.ok) {
    console.error("[bookings] admin email failed:", admin.error);
  }

  return Response.json({
    ok: true,
    confirmationCode: body.confirmationCode,
  });
}
