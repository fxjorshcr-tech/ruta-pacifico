"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import {
  BOOKING_STORAGE_KEY,
  formatDate,
  formatTime,
  type TripItem,
} from "@/lib/booking";

const HERO_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/hero-ruta-pacifico.webp";

interface BookingData {
  trips: TripItem[];
  name: string;
  email: string;
  phone: string;
  notes?: string;
  total: number;
  confirmationCode: string;
  createdAt: string;
}

function subscribeSessionStorage(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getBookingSnapshot(): string | null {
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

export default function ConfirmationPage() {
  const raw = useSyncExternalStore(
    subscribeSessionStorage,
    getBookingSnapshot,
    getServerSnapshot,
  );

  let booking: BookingData | null = null;
  if (raw) {
    try {
      booking = JSON.parse(raw) as BookingData;
    } catch {
      booking = null;
    }
  }

  if (!booking || !booking.trips) {
    return (
      <main className="min-h-screen bg-light-surface">
        <SiteNav transparent={false} />
        <div className="mx-auto max-w-md px-6 py-32 text-center">
          <h1 className="text-2xl font-bold text-foreground">No booking found</h1>
          <p className="mt-3 text-sm text-foreground/60">
            Please start a new booking from the routes page.
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

  const whatsappText = `Hi! I just submitted booking ${booking.confirmationCode} (${booking.trips.map((t) => `${t.from} → ${t.to}`).join(", ")}). Could you please send me the payment link?`;

  return (
    <main className="min-h-screen bg-light-surface">
      <SiteNav transparent />

      {/* ─── HERO ─── */}
      <section className="relative flex min-h-[45vh] items-center overflow-hidden">
        <Image src={HERO_URL} alt="" fill className="object-cover" priority unoptimized />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-light-surface via-transparent to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-3xl px-6 pt-24 pb-20 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500 text-white shadow-xl shadow-green-500/30">
            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Booking Received
          </h1>
          <p className="mt-3 text-white/70">
            Thank you, {booking.name}
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm backdrop-blur-sm border border-white/10">
            <span className="text-white/60">Confirmation code</span>
            <span className="font-mono text-lg font-bold text-sunset-gold">
              {booking.confirmationCode}
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 pb-20 pt-10">
        {/* Payment notice */}
        <div className="rounded-3xl border border-sunset-orange/20 bg-sunset-orange/5 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sunset-orange text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9v10.5A1.5 1.5 0 0 0 3.75 21h16.5a1.5 1.5 0 0 0 1.5-1.5V9M3.75 3h16.5A1.5 1.5 0 0 1 21.75 4.5v3.75H2.25V4.5A1.5 1.5 0 0 1 3.75 3Z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Payment link on the way
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                We&apos;re reviewing your booking now. You&apos;ll get the secure payment link by{" "}
                <strong className="text-foreground">email</strong> ({booking.email}) and{" "}
                <strong className="text-foreground">WhatsApp</strong> ({booking.phone}) within a few minutes.
                Your booking is confirmed once payment is completed.
              </p>
            </div>
          </div>
        </div>

        {/* Shuttles */}
        <div className="mt-8 rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-bold text-foreground">
            {booking.trips.length === 1 ? "Your Shuttle" : `Your ${booking.trips.length} Shuttles`}
          </h2>

          <div className="mt-5 space-y-4">
            {booking.trips.map((trip, idx) => {
              const pax = `${trip.adults} adult${trip.adults !== 1 ? "s" : ""}${trip.children > 0 ? `, ${trip.children} child${trip.children !== 1 ? "ren" : ""}` : ""}`;
              return (
                <div key={trip.id} className="rounded-2xl border border-black/5 bg-light-surface p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {booking.trips.length > 1 && (
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sunset-orange/10 text-xs font-bold text-sunset-orange">
                          {idx + 1}
                        </span>
                      )}
                      <div>
                        <div className="text-sm font-bold text-foreground">
                          {trip.from} → {trip.to}
                        </div>
                        {trip.duracion && (
                          <div className="text-xs text-foreground/40">~{trip.duracion}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-lg font-bold text-sunset-orange">${trip.price}</div>
                  </div>
                  <div className="mt-3 grid gap-2 text-xs text-foreground/60 sm:grid-cols-2">
                    <div>
                      <span className="text-foreground/40">Date: </span>
                      {formatDate(trip.date)} at {formatTime(trip.time)}
                    </div>
                    <div>
                      <span className="text-foreground/40">Vehicle: </span>
                      {trip.vehicleName} ({trip.vehiclePax})
                    </div>
                    <div>
                      <span className="text-foreground/40">Travelers: </span>
                      {pax}
                    </div>
                    {trip.flight && (
                      <div>
                        <span className="text-foreground/40">Flight: </span>
                        {trip.flight}
                      </div>
                    )}
                    <div>
                      <span className="text-foreground/40">Pickup: </span>
                      {trip.pickup}
                    </div>
                    <div>
                      <span className="text-foreground/40">Drop-off: </span>
                      {trip.dropoff}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {booking.notes && (
            <div className="mt-4 rounded-2xl border border-black/5 bg-light-surface p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-foreground/40">Special requests</div>
              <p className="mt-1 text-sm text-foreground/70">{booking.notes}</p>
            </div>
          )}

          {/* Total */}
          <div className="mt-6 flex items-center justify-between rounded-2xl bg-foreground p-5">
            <div>
              <div className="text-sm text-white/60">
                Total ({booking.trips.length} shuttle{booking.trips.length !== 1 ? "s" : ""})
              </div>
              <div className="text-xs text-white/40">13% VAT included</div>
            </div>
            <div className="text-3xl font-extrabold text-white">${booking.total}</div>
          </div>
        </div>

        {/* Contact info */}
        <div className="mt-6 rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground/40">Contact Information</h2>
          <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
            <div>
              <span className="text-foreground/50">Name: </span>
              <span className="font-medium text-foreground">{booking.name}</span>
            </div>
            <div>
              <span className="text-foreground/50">Email: </span>
              <span className="font-medium text-foreground break-all">{booking.email}</span>
            </div>
            <div>
              <span className="text-foreground/50">Phone: </span>
              <span className="font-medium text-foreground">{booking.phone}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a
            href={`https://wa.me/50685962438?text=${encodeURIComponent(whatsappText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-green-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-600"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.553 4.116 1.519 5.848L.058 23.306a.5.5 0 00.636.636l5.458-1.461A11.948 11.948 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.94 0-3.753-.563-5.28-1.532l-.368-.224-3.821 1.023 1.023-3.821-.224-.368A9.935 9.935 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
            </svg>
            Message us on WhatsApp
          </a>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-foreground transition hover:border-sunset-orange hover:text-sunset-orange"
          >
            Back to home
          </Link>
        </div>

        <p className="mt-8 text-center text-xs text-foreground/40">
          Free changes up to 48 hours before pickup. Contact us via WhatsApp or email.
        </p>
      </div>
    </main>
  );
}
