import type { SupabaseClient } from "@supabase/supabase-js";
import type { TripItem } from "@/lib/booking";
import type { BookingEmailInput, PaidInfo } from "@/lib/bookingEmails";

/**
 * Server-side booking rows (`rp_bookings`) for the card-payment flow.
 * SERVER ONLY.
 */
export interface RpBookingRow {
  id: string;
  created_at: string;
  confirmation_code: string;
  locale: "en" | "es" | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  trips: TripItem[];
  total_amount: number | string;
  status: "pending_payment" | "confirmed" | "cancelled";
  payment_status: "pending" | "processing" | "approved" | "failed";
  payment_transaction_id: string | null;
  payment_auth_code: string | null;
  paid_at: string | null;
  pending_emails_sent_at: string | null;
  paid_emails_sent_at: string | null;
}

export function isUuid(s: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

export async function loadRpBooking(db: SupabaseClient, id: string): Promise<RpBookingRow | null> {
  if (!isUuid(id)) return null;
  const { data } = await db.from("rp_bookings").select("*").eq("id", id).maybeSingle();
  return (data as RpBookingRow | null) ?? null;
}

export function isRpBookingPaid(row: RpBookingRow): boolean {
  return row.payment_status === "approved" || row.status === "confirmed";
}

/** Atomic claim: only one charge may be in flight for a booking. */
export async function claimRpBooking(db: SupabaseClient, id: string): Promise<boolean> {
  const { data } = await db
    .from("rp_bookings")
    .update({ payment_status: "processing", updated_at: new Date().toISOString() })
    .eq("id", id)
    .in("payment_status", ["pending", "failed"])
    .select("id")
    .maybeSingle();
  return !!data;
}

export async function releaseRpBooking(db: SupabaseClient, id: string, to: "pending" | "failed"): Promise<void> {
  await db
    .from("rp_bookings")
    .update({ payment_status: to, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("payment_status", "processing");
}

export async function markRpBookingPaid(
  db: SupabaseClient,
  id: string,
  payment: { transactionId: string; authCode: string; rrn?: string; cardBrand?: string; paidAt: string },
): Promise<void> {
  const { error } = await db
    .from("rp_bookings")
    .update({
      status: "confirmed",
      payment_status: "approved",
      payment_provider: "powertranz",
      payment_transaction_id: payment.transactionId,
      payment_auth_code: payment.authCode,
      payment_rrn: payment.rrn ?? null,
      payment_card_brand: payment.cardBrand ?? null,
      paid_at: payment.paidAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) console.error("[rpBookings] markRpBookingPaid failed:", error);
}

/** Shape the row the way the email builders expect it. */
export function rpBookingToEmailInput(row: RpBookingRow, paid?: PaidInfo): BookingEmailInput {
  return {
    trips: row.trips,
    name: row.customer_name,
    email: row.customer_email,
    phone: row.customer_phone ?? "",
    total: Number(row.total_amount),
    confirmationCode: row.confirmation_code,
    createdAt: row.created_at,
    locale: row.locale ?? "en",
    paid,
  };
}

/** Where the customer lands after the card step. */
export function confirmationPath(paid: boolean): string {
  return paid ? "/private-shuttle/confirmation?paid=1" : "/private-shuttle/confirmation";
}
