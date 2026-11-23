import type { SupabaseClient } from "@supabase/supabase-js";
import { customerLocale, type BookingEmailInput } from "@/lib/bookingEmails";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabaseAdmin";

/**
 * Operations panel (`admin_bookings`, shared with Cant Wait Travel): every
 * Ruta Pacifico web booking is registered there, one row per shuttle leg,
 * tagged `company = 'ruta'`. Idempotent through `external_ref`
 * (`ruta:<confirmation code>:<leg>`), so a retry or a second call for the
 * same booking never duplicates it. Never throws: the panel must not break
 * the customer's booking.
 */

const LOG = "[panel]";

function externalRef(code: string, leg: number): string {
  return `ruta:${code}:${leg}`;
}

function bookedDate(createdAt: string | undefined): string | null {
  const d = createdAt ? new Date(createdAt) : new Date();
  return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

export async function registerBookingInPanel(
  b: BookingEmailInput,
  opts: { status: "pending" | "confirmed"; paidAt?: string; cardAuth?: string },
  db: SupabaseClient | null = null,
): Promise<void> {
  try {
    if (!db && !isSupabaseAdminConfigured()) return;
    const client = db ?? getSupabaseAdmin();
    const code = b.confirmationCode;
    const rows = b.trips.map((trip, i) => ({
      external_ref: externalRef(code, i + 1),
      company: "ruta",
      booking_code: code,
      voucher_code: `${code}-S${i + 1}`,
      source: "web",
      service_type: "transfer",
      customer_name: b.name.trim(),
      customer_email: b.email.trim() || null,
      customer_phone: b.phone?.trim() || null,
      customer_language: customerLocale(b),
      service_date: trip.date,
      pickup_time: trip.time || null,
      pickup_location: trip.pickup?.trim() || trip.from,
      dropoff_location: trip.dropoff?.trim() || trip.to,
      adults: trip.adults || 0,
      children: trip.children || 0,
      flight_info: trip.flight?.trim() || null,
      notes: trip.notes?.trim() || null,
      price_usd: Number(trip.price) || 0,
      payment_method: "link",
      apply_bank_fee: true,
      bank_fee_pct: 2.5,
      operated_by: "propio",
      status: opts.status,
      paid_at: opts.paidAt ? opts.paidAt.slice(0, 10) : null,
      card_auth: opts.cardAuth || null,
      booked_at: bookedDate(b.createdAt),
    }));
    const { error } = await client
      .from("admin_bookings")
      .upsert(rows, { onConflict: "external_ref", ignoreDuplicates: true });
    if (error) console.error(LOG, "register failed:", error.message);
  } catch (err) {
    console.error(LOG, "register threw:", err);
  }
}

/** The card payment went through: the panel rows of that booking become confirmed and paid. */
export async function markPanelBookingPaid(
  code: string,
  payment: { paidAt: string; authCode?: string },
  db: SupabaseClient | null = null,
): Promise<void> {
  try {
    if (!db && !isSupabaseAdminConfigured()) return;
    const client = db ?? getSupabaseAdmin();
    const { error } = await client
      .from("admin_bookings")
      .update({
        status: "confirmed",
        paid_at: payment.paidAt.slice(0, 10),
        card_auth: payment.authCode || null,
        payment_method: "link",
        updated_at: new Date().toISOString(),
      })
      .like("external_ref", `ruta:${code}:%`)
      .neq("status", "cancelled");
    if (error) console.error(LOG, "mark paid failed:", error.message);
  } catch (err) {
    console.error(LOG, "mark paid threw:", err);
  }
}
