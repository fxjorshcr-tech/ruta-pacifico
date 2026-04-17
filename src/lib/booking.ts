/**
 * A booking goes through three persisted stages in sessionStorage:
 *
 *   BookingDraft   → trip details only (after step 1)
 *   BookingPending → draft + customer info (after step 2)
 *   Booking        → pending + confirmation code + paid flag (after step 3)
 *
 * Each stage widens the previous one, so the later pages can read the same
 * record as they make progress.
 */

export interface BookingDraft {
  // Route
  from: string;
  to: string;
  duracion: string | null;

  // Trip
  date: string;
  time: string;
  adults: number;
  children: number;
  flight?: string;
  pickup: string;
  dropoff: string;

  // Vehicle
  vehicleKey: "staria" | "hiace" | "maxus";
  vehicleName: string;
  vehiclePax: string;
  price: number;

  // Meta
  isAirportPickup: boolean;
}

export interface BookingPending extends BookingDraft {
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

export interface Booking extends BookingPending {
  confirmationCode: string;
  createdAt: string;
  paid: boolean;
}

export const BOOKING_DRAFT_KEY = "rp_booking_draft";
export const BOOKING_PENDING_KEY = "rp_booking_pending";
export const BOOKING_STORAGE_KEY = "rp_booking";

export function generateConfirmationCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `RP-${code}`;
}

export function formatDate(isoDate: string): string {
  if (!isoDate) return "";
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(isoTime: string): string {
  if (!isoTime) return "";
  const [h, m] = isoTime.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatPassengers(
  adults: number,
  children: number
): string {
  return `${adults} adult${adults === 1 ? "" : "s"}${
    children > 0
      ? ` · ${children} child${children === 1 ? "" : "ren"}`
      : ""
  }`;
}
