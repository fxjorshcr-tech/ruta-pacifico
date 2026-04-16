"use client";

import { useSyncExternalStore, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import PhoneInput from "@/components/PhoneInput";
import {
  BOOKING_STORAGE_KEY,
  generateConfirmationCode,
  formatDate,
  formatTime,
  type Booking,
} from "@/lib/booking";

function subscribeSessionStorage(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getTripSnapshot(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(BOOKING_STORAGE_KEY);
  } catch {
    return null;
  }
}

function getServerSnapshot(): string | null {
  return null;
}

export default function CheckoutPage() {
  const router = useRouter();
  const raw = useSyncExternalStore(
    subscribeSessionStorage,
    getTripSnapshot,
    getServerSnapshot,
  );

  const trip = raw ? JSON.parse(raw) : null;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!trip) return;
    setSubmitting(true);

    const booking: Booking = {
      ...trip,
      name,
      email,
      phone,
      notes: notes || undefined,
      confirmationCode: generateConfirmationCode(),
      createdAt: new Date().toISOString(),
    };

    try {
      sessionStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(booking));
    } catch {
      // sessionStorage disabled
    }

    router.push("/private-shuttle/confirmation");
  }

  if (!trip) {
    return (
      <main className="bg-light-surface min-h-screen">
        <SiteNav transparent={false} />
        <div className="mx-auto max-w-2xl px-6 py-32 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            No trip selected
          </h1>
          <p className="mt-3 text-sm text-foreground/60">
            Please select a route and fill in your trip details first.
          </p>
          <Link
            href="/private-shuttle"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-sunset-orange px-6 py-3 text-sm font-semibold text-white transition hover:bg-sunset-gold"
          >
            Find a route
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-light-surface min-h-screen">
      <SiteNav transparent={false} />

      <div className="mx-auto max-w-3xl px-6 pb-20 pt-28">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          Checkout
        </h1>
        <p className="mt-2 text-foreground/60">
          Review your trip and complete your booking.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-8">
          {/* ── Trip Summary ── */}
          <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sunset-orange text-sm font-bold text-white">
                1
              </span>
              <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                Trip Summary
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-light-surface p-4">
                <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-foreground/40">Route</div>
                <div className="mt-1 text-sm font-bold text-foreground">{trip.from} → {trip.to}</div>
                {trip.duracion && (
                  <div className="mt-0.5 text-xs text-foreground/50">~{trip.duracion}</div>
                )}
              </div>
              <div className="rounded-xl bg-light-surface p-4">
                <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-foreground/40">Vehicle</div>
                <div className="mt-1 text-sm font-bold text-foreground">{trip.vehicleName}</div>
                <div className="mt-0.5 text-xs text-foreground/50">{trip.vehiclePax}</div>
              </div>
              <div className="rounded-xl bg-light-surface p-4">
                <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-foreground/40">Date &amp; Time</div>
                <div className="mt-1 text-sm font-bold text-foreground">{formatDate(trip.date)}</div>
                <div className="mt-0.5 text-xs text-foreground/50">{formatTime(trip.time)}</div>
              </div>
              <div className="rounded-xl bg-light-surface p-4">
                <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-foreground/40">Travelers</div>
                <div className="mt-1 text-sm font-bold text-foreground">
                  {trip.adults} adult{trip.adults !== 1 ? "s" : ""}
                  {trip.children > 0 && `, ${trip.children} child${trip.children !== 1 ? "ren" : ""}`}
                </div>
              </div>
              {trip.flight && (
                <div className="rounded-xl bg-light-surface p-4">
                  <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-foreground/40">Flight</div>
                  <div className="mt-1 text-sm font-bold text-foreground">{trip.flight}</div>
                </div>
              )}
              <div className="rounded-xl bg-light-surface p-4">
                <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-foreground/40">Pickup</div>
                <div className="mt-1 text-sm font-bold text-foreground">{trip.pickup}</div>
              </div>
              <div className="rounded-xl bg-light-surface p-4">
                <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-foreground/40">Drop-off</div>
                <div className="mt-1 text-sm font-bold text-foreground">{trip.dropoff}</div>
              </div>
            </div>

            <div className="mt-4 text-right">
              <Link href="/private-shuttle" className="text-sm font-semibold text-sunset-orange transition hover:text-sunset-red">
                Edit trip details
              </Link>
            </div>
          </section>

          {/* ── Your Information ── */}
          <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sunset-orange text-sm font-bold text-white">
                2
              </span>
              <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                Your Information
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="checkout-name" className="text-sm font-medium text-foreground/70">
                  Full name
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-black/10 bg-light-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-sunset-orange focus:ring-2 focus:ring-sunset-orange/20"
                />
              </div>
              <div>
                <label htmlFor="checkout-email" className="text-sm font-medium text-foreground/70">
                  Email
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-black/10 bg-light-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-sunset-orange focus:ring-2 focus:ring-sunset-orange/20"
                />
              </div>
              <div>
                <label htmlFor="checkout-phone" className="text-sm font-medium text-foreground/70">
                  Phone / WhatsApp
                </label>
                <div className="mt-2">
                  <PhoneInput id="checkout-phone" value={phone} onChange={setPhone} required />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="checkout-notes" className="text-sm font-medium text-foreground/70">
                  Special requests <span className="text-foreground/40">(optional)</span>
                </label>
                <textarea
                  id="checkout-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Child seats, extra stops, luggage notes…"
                  className="mt-2 w-full resize-none rounded-xl border border-black/10 bg-light-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-sunset-orange focus:ring-2 focus:ring-sunset-orange/20"
                />
              </div>
            </div>
          </section>

          {/* ── Total + Submit ── */}
          <div className="rounded-3xl border border-sunset-orange/20 bg-sunset-orange/5 p-6 sm:p-8">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <div className="text-sm text-foreground/60">Total (per vehicle)</div>
                <div className="text-3xl font-bold text-sunset-orange">${trip.price}</div>
                <div className="text-xs text-foreground/40">13% VAT included</div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-sunset-red via-sunset-orange to-sunset-gold px-10 py-4 text-base font-bold text-white shadow-lg shadow-sunset-orange/25 transition hover:shadow-xl hover:shadow-sunset-orange/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Confirm Booking"}
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
            <p className="mt-4 text-center text-xs text-foreground/50 sm:text-right">
              You&apos;ll receive the payment link by email and WhatsApp shortly after confirming.
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
