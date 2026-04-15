export interface Booking {
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

  // Customer
  name: string;
  email: string;
  phone: string;
  notes?: string;

  // Meta
  isAirportPickup: boolean;
  confirmationCode: string;
  createdAt: string;
}

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
