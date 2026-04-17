/**
 * POST /api/book/create
 *
 * Stub booking + payment endpoint. In production this is where you would:
 *
 *   1. Validate the tokenized payment method (e.g. Stripe PaymentIntent)
 *   2. Confirm the charge for booking.price USD
 *   3. Persist the booking to Supabase
 *   4. Trigger transactional email + WhatsApp to the customer
 *
 * For now it performs light validation, fakes a ~600ms "charge", and returns a
 * confirmation code so the client can advance to /book/confirmation.
 *
 * IMPORTANT: the client currently posts last4 + brand only. Do NOT start
 * accepting raw PAN/CVV here — swap the payment step on the client to use
 * Stripe Elements and send { payment_method_id } instead.
 */

import { NextResponse } from "next/server";
import {
  generateConfirmationCode,
  type BookingPending,
} from "@/lib/booking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Body {
  booking: BookingPending;
  payment: {
    brand: string;
    last4: string;
    zip: string;
  };
}

function isValidBooking(b: unknown): b is BookingPending {
  if (!b || typeof b !== "object") return false;
  const o = b as Record<string, unknown>;
  return (
    typeof o.from === "string" &&
    typeof o.to === "string" &&
    typeof o.date === "string" &&
    typeof o.time === "string" &&
    typeof o.pickup === "string" &&
    typeof o.dropoff === "string" &&
    typeof o.vehicleKey === "string" &&
    typeof o.price === "number" &&
    typeof o.name === "string" &&
    typeof o.email === "string" &&
    typeof o.phone === "string"
  );
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  if (!isValidBooking(body.booking)) {
    return NextResponse.json(
      { error: "Missing or invalid booking details" },
      { status: 400 }
    );
  }

  if (
    !body.payment ||
    typeof body.payment.last4 !== "string" ||
    body.payment.last4.length < 3
  ) {
    return NextResponse.json(
      { error: "Missing card information" },
      { status: 400 }
    );
  }

  // Simulate a tiny latency so the UI feels like a real charge pass.
  await new Promise((r) => setTimeout(r, 600));

  const confirmationCode = generateConfirmationCode();
  const createdAt = new Date().toISOString();

  // TODO: persist booking + Stripe payment reference before returning.
  console.info(
    `[book/create] ${confirmationCode} ${body.booking.from} → ${body.booking.to} ($${body.booking.price}, card ••${body.payment.last4})`
  );

  return NextResponse.json({ confirmationCode, createdAt });
}
