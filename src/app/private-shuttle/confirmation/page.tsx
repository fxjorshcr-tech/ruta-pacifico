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

        {/* Trust badges */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "100% Private", sub: "No shared shuttles", color: "text-blue-500 bg-blue-50", icon: "M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9-1.5H3.375c-.621 0-1.125-.504-1.125-1.125V9.375c0-.621.504-1.125 1.125-1.125h9A1.125 1.125 0 0 1 13.5 9.375v7.5c0 .621-.504 1.125-1.125 1.125H9.75m0 0h4.5m-4.5 0a1.5 1.5 0 0 0-3 0m3 0a1.5 1.5 0 0 1-3 0m12 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H13.5" },
            { label: "Fully Insured", sub: "Complete coverage", color: "text-emerald-500 bg-emerald-50", icon: "M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" },
            { label: "Licensed & Vetted", sub: "Certified drivers", color: "text-green-600 bg-green-50", icon: "M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" },
            { label: "24/7 Support", sub: "Always available", color: "text-sunset-orange bg-sunset-orange/10", icon: "M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" },
          ].map((badge) => (
            <div key={badge.label} className="rounded-2xl border border-black/5 bg-white p-4 text-center shadow-sm">
              <div className={`mx-auto flex h-11 w-11 items-center justify-center rounded-full ${badge.color}`}>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d={badge.icon} />
                </svg>
              </div>
              <div className="mt-2 text-sm font-bold text-foreground">{badge.label}</div>
              <div className="text-xs text-foreground/50">{badge.sub}</div>
            </div>
          ))}
        </div>

        {/* What's included + Important info */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-foreground">What&apos;s Included</h3>
            <ul className="mt-4 space-y-3">
              {[
                { icon: "M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9-1.5H3.375c-.621 0-1.125-.504-1.125-1.125V9.375c0-.621.504-1.125 1.125-1.125h9A1.125 1.125 0 0 1 13.5 9.375v7.5c0 .621-.504 1.125-1.125 1.125H9.75", text: "Spacious van with full A/C" },
                { icon: "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0", text: "Personalized meet & greet" },
                { icon: "M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z", text: "Door-to-door private service" },
                { icon: "M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0", text: "Free Wi-Fi & bottled water" },
                { icon: "M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802", text: "Professional bilingual driver" },
                { icon: "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z", text: "All-inclusive pricing" },
              ].map((item) => (
                <li key={item.text} className="flex items-center gap-3 text-sm text-foreground/70">
                  <svg className="h-4 w-4 shrink-0 text-sunset-orange" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-foreground">Important Information</h3>
            <ul className="mt-4 space-y-3">
              {[
                { icon: "M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z", text: "1 large bag + 1 carry-on per person" },
                { icon: "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z", text: "One complimentary 15-min stop" },
                { icon: "M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z", text: "Baby car seats & boosters free" },
                { icon: "M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636", text: "No refund within 48h of pickup" },
                { icon: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182", text: "Free changes up to 48h before" },
              ].map((item) => (
                <li key={item.text} className="flex items-center gap-3 text-sm text-foreground/70">
                  <svg className="h-4 w-4 shrink-0 text-foreground/40" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                  {item.text}
                </li>
              ))}
            </ul>
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
