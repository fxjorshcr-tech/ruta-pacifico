export interface TripItem {
  id: string; // unique per cart item
  from: string;
  to: string;
  duracion: string | null;
  date: string;
  time: string;
  adults: number;
  children: number;
  flight?: string;
  pickup: string;
  dropoff: string;
  vehicleKey: "staria" | "hiace" | "maxus";
  vehicleName: string;
  vehiclePax: string;
  price: number;
  isAirportPickup: boolean;
}

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
export const CART_STORAGE_KEY = "rp_cart";

export function generateTripId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function getCart(): TripItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCart(items: TripItem[]): void {
  try {
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // sessionStorage disabled
  }
}

export function addToCart(item: TripItem): TripItem[] {
  const cart = getCart();
  cart.push(item);
  saveCart(cart);
  return cart;
}

export function removeFromCart(id: string): TripItem[] {
  const cart = getCart().filter((item) => item.id !== id);
  saveCart(cart);
  return cart;
}

export function getCartTotal(items: TripItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

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
