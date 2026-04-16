"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import {
  BOOKING_STORAGE_KEY,
  formatDate,
  formatTime,
  type Booking,
} from "@/lib/booking";

// Subscribe to sessionStorage changes from other tabs / windows
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

function getBookingServerSnapshot(): string | null {
  return null;
}

export default function ConfirmationPage() {
  const raw = useSyncExternalStore(
    subscribeSessionStorage,
    getBookingSnapshot,
    getBookingServerSnapshot
  );

  let booking: Booking | null = null;
  if (raw) {
    try {
      booking = JSON.parse(raw) as Booking;
    } catch {
      booking = null;
    }
  }

  // SSR / pre-hydration render: show loading shell
  if (raw === null && typeof window === "undefined") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-light-surface">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-sunset-orange/20 border-t-sunset-orange" />
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-light-surface px-6">
        <div className="max-w-md rounded-3xl border border-black/5 bg-white p-10 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-foreground/5 text-foreground/40">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <h1 className="mt-6 text-2xl font-bold text-foreground">
            No booking found
          </h1>
          <p className="mt-3 text-sm text-foreground/60">
            We couldn&apos;t find a booking in this session. Please start again
            from the routes page.
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

  const passengers = `${booking.adults} adult${
    booking.adults === 1 ? "" : "s"
  }${
    booking.children > 0
      ? ` · ${booking.children} child${booking.children === 1 ? "" : "ren"}`
      : ""
  }`;

  return (
    <main className="min-h-screen bg-light-surface">
      {/* Top bar */}
      <SiteNav transparent={false} />

      <div className="mx-auto max-w-3xl px-6 py-16">
        {/* Success header */}
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white shadow-xl shadow-green-500/30">
            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="mt-6 text-3xl font-bold text-foreground sm:text-4xl">
            Booking received!
          </h1>
          <p className="mt-3 text-foreground/60">
            Thank you, <strong className="text-foreground">{booking.name}</strong> — we&apos;ve got your request.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm shadow-sm">
            <span className="text-foreground/50">Confirmation code</span>
            <span className="font-mono text-base font-bold text-sunset-orange">
              {booking.confirmationCode}
            </span>
          </div>
        </div>

        {/* Payment link notice */}
        <div className="mt-10 overflow-hidden rounded-3xl border border-sunset-orange/30 bg-gradient-to-br from-sunset-gold/10 via-sunset-orange/10 to-sunset-red/10 p-[2px]">
          <div className="rounded-[22px] bg-white p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sunset-orange text-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9v10.5A1.5 1.5 0 0 0 3.75 21h16.5a1.5 1.5 0 0 0 1.5-1.5V9M3.75 3h16.5A1.5 1.5 0 0 1 21.75 4.5v3.75H2.25V4.5A1.5 1.5 0 0 1 3.75 3Z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-bold text-foreground sm:text-xl">
                  We&apos;ll send you the payment link shortly
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                  Our team is reviewing your booking right now. You&apos;ll
                  receive the secure payment link by <strong className="text-foreground">email</strong> at{" "}
                  <a
                    href={`mailto:${booking.email}`}
                    className="font-semibold text-sunset-orange hover:text-sunset-gold"
                  >
                    {booking.email}
                  </a>{" "}
                  and by <strong className="text-foreground">WhatsApp</strong>{" "}
                  at{" "}
                  <span className="font-semibold text-sunset-orange">
                    {booking.phone}
                  </span>{" "}
                  within a few minutes. The booking is confirmed once payment
                  is completed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking details card */}
        <div className="mt-8 rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-foreground sm:text-xl">
              Booking details
            </h2>
          </div>

          {/* Route */}
          <div className="rounded-2xl bg-light-surface p-5">
            <div className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-foreground/40">
              Your route
            </div>
            <div className="mt-2 flex flex-col items-start gap-2 sm:flex-row sm:items-center">
              <div className="font-semibold text-foreground">
                {booking.from}
              </div>
              <svg className="h-4 w-4 shrink-0 rotate-90 text-sunset-orange sm:rotate-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
              <div className="font-semibold text-foreground">{booking.to}</div>
            </div>
            {booking.duracion && (
              <div className="mt-2 text-xs text-foreground/50">
                Estimated travel time: {booking.duracion}
              </div>
            )}
          </div>

          {/* Grid of details */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <DetailRow
              label="Pickup date"
              value={formatDate(booking.date)}
              icon="calendar"
            />
            <DetailRow
              label="Pickup time"
              value={formatTime(booking.time)}
              icon="clock"
            />
            <DetailRow
              label="Passengers"
              value={passengers}
              icon="users"
            />
            <DetailRow
              label="Vehicle"
              value={`${booking.vehicleName} · ${booking.vehiclePax}`}
              icon="van"
            />
            {booking.isAirportPickup && booking.flight && (
              <DetailRow
                label="Flight number"
                value={booking.flight}
                icon="plane"
              />
            )}
            <DetailRow
              label="Pickup location"
              value={booking.pickup}
              icon="pin"
              full={!booking.isAirportPickup || !booking.flight}
            />
            <DetailRow
              label="Drop-off location"
              value={booking.dropoff}
              icon="pin"
              full={!booking.isAirportPickup || !booking.flight}
            />
          </div>

          {booking.notes && (
            <div className="mt-5 rounded-2xl border border-black/5 bg-light-surface p-4">
              <div className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-foreground/40">
                Special requests
              </div>
              <p className="mt-1 text-sm text-foreground/70">{booking.notes}</p>
            </div>
          )}

          {/* Customer */}
          <div className="mt-6 border-t border-black/5 pt-6">
            <div className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-foreground/40">
              Contact
            </div>
            <div className="mt-2 grid gap-2 text-sm sm:grid-cols-3">
              <div>
                <span className="text-foreground/50">Name: </span>
                <span className="font-medium text-foreground">
                  {booking.name}
                </span>
              </div>
              <div>
                <span className="text-foreground/50">Email: </span>
                <span className="font-medium text-foreground break-all">
                  {booking.email}
                </span>
              </div>
              <div>
                <span className="text-foreground/50">Phone: </span>
                <span className="font-medium text-foreground">
                  {booking.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="mt-6 flex items-center justify-between rounded-2xl bg-gradient-to-br from-sunset-gold/10 via-sunset-orange/10 to-sunset-red/10 p-5">
            <div>
              <div className="text-xs text-foreground/60">Total (per vehicle)</div>
              <div className="text-xs text-foreground/40">
                13% VAT included · no hidden fees
              </div>
            </div>
            <div className="text-3xl font-extrabold text-sunset-orange sm:text-4xl">
              ${booking.price}
            </div>
          </div>
        </div>

        {/* Secondary actions */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a
            href={`https://wa.me/50685962438?text=${encodeURIComponent(
              `Hi! I just submitted booking ${booking.confirmationCode} (${booking.from} → ${booking.to}). Could you please send me the payment link?`
            )}`}
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
          Questions about cancellation or changes? You have free changes up to
          48 hours before pickup.
        </p>
      </div>
    </main>
  );
}

function DetailRow({
  label,
  value,
  icon,
  full = false,
}: {
  label: string;
  value: string;
  icon: "calendar" | "clock" | "users" | "van" | "plane" | "pin";
  full?: boolean;
}) {
  const icons: Record<typeof icon, string> = {
    calendar:
      "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5",
    clock: "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    users:
      "M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z",
    van:
      "M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9-1.5h.008v.008H5.25v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm1.5 0H9.75m-4.125 0H3.375c-.621 0-1.125-.504-1.125-1.125V9.375c0-.621.504-1.125 1.125-1.125h9A1.125 1.125 0 0 1 13.5 9.375v7.5c0 .621-.504 1.125-1.125 1.125H9.75m0 0h4.5m-4.5 0a1.5 1.5 0 0 0-3 0m3 0a1.5 1.5 0 0 1-3 0m12 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H13.5",
    plane:
      "M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5",
    pin:
      "M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z",
  };

  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border border-black/5 bg-light-surface/60 p-4 ${
        full ? "sm:col-span-2" : ""
      }`}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sunset-orange/10 text-sunset-orange">
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d={icons[icon]}
          />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-foreground/40">
          {label}
        </div>
        <div className="mt-0.5 text-sm font-semibold text-foreground break-words">
          {value}
        </div>
      </div>
    </div>
  );
}
