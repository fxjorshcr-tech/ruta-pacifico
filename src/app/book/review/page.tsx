"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import BookingStepper from "@/components/BookingStepper";
import BookingSummary from "@/components/BookingSummary";
import PhoneInput from "@/components/PhoneInput";
import { routeSlug } from "@/lib/slug";
import {
  BOOKING_DRAFT_KEY,
  BOOKING_PENDING_KEY,
  type BookingDraft,
  type BookingPending,
} from "@/lib/booking";

function subscribeSessionStorage(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return (
      window.sessionStorage.getItem(BOOKING_PENDING_KEY) ??
      window.sessionStorage.getItem(BOOKING_DRAFT_KEY)
    );
  } catch {
    return null;
  }
}

function getServerSnapshot(): string | null {
  return null;
}

export default function ReviewPage() {
  const router = useRouter();

  const raw = useSyncExternalStore(
    subscribeSessionStorage,
    getSnapshot,
    getServerSnapshot
  );

  const source = useMemo((): (BookingDraft & Partial<BookingPending>) | null => {
    if (!raw) return null;
    try {
      return JSON.parse(raw) as BookingDraft & Partial<BookingPending>;
    } catch {
      return null;
    }
  }, [raw]);

  // User edits "overlay" on top of whatever was persisted in sessionStorage,
  // so we don't need a setState-in-effect to initialize the inputs.
  const [edits, setEdits] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    notes?: string;
  }>({});
  const [submitting, setSubmitting] = useState(false);

  const name = edits.name ?? source?.name ?? "";
  const email = edits.email ?? source?.email ?? "";
  const phone = edits.phone ?? source?.phone ?? "";
  const notes = edits.notes ?? source?.notes ?? "";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!source || submitting) return;
    setSubmitting(true);

    const pending: BookingPending = {
      from: source.from,
      to: source.to,
      duracion: source.duracion,
      date: source.date,
      time: source.time,
      adults: source.adults,
      children: source.children,
      flight: source.flight,
      pickup: source.pickup,
      dropoff: source.dropoff,
      vehicleKey: source.vehicleKey,
      vehicleName: source.vehicleName,
      vehiclePax: source.vehiclePax,
      price: source.price,
      isAirportPickup: source.isAirportPickup,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      notes: notes.trim() || undefined,
    };

    try {
      sessionStorage.setItem(BOOKING_PENDING_KEY, JSON.stringify(pending));
    } catch {
      // sessionStorage disabled — next page will redirect the user
    }

    router.push("/book/payment");
  }

  // SSR / pre-hydration render
  if (raw === null && typeof window === "undefined") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-light-surface">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-sunset-orange/20 border-t-sunset-orange" />
      </main>
    );
  }

  if (!source) {
    return (
      <main className="min-h-screen bg-light-surface">
        <SiteNav transparent={false} />
        <div className="mx-auto max-w-md px-6 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            No trip selected yet
          </h1>
          <p className="mt-3 text-sm text-foreground/60">
            Start by picking a route to review and book.
          </p>
          <Link
            href="/book/transfer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-sunset-orange px-6 py-3 text-sm font-semibold text-white transition hover:bg-sunset-gold"
          >
            Find a route
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>
      </main>
    );
  }

  const backHref = `/routes/${routeSlug(source.from, source.to)}?v=${source.vehicleKey}`;

  return (
    <main className="min-h-screen bg-light-surface">
      <SiteNav transparent={false} />
      <BookingStepper current={2} />

      <div className="mx-auto max-w-3xl px-6 pb-16">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Review &amp; your information
          </h1>
          <p className="mt-2 text-sm text-foreground/60">
            Double-check the trip, then tell us how to reach you.
          </p>
        </div>

        <BookingSummary draft={source} editHref={backHref} />

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
                <label
                  htmlFor="review-name"
                  className="text-sm font-medium text-foreground/70"
                >
                  Full name
                </label>
                <input
                  id="review-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) =>
                    setEdits((prev) => ({ ...prev, name: e.target.value }))
                  }
                  autoComplete="name"
                  className="mt-2 w-full rounded-xl border border-black/10 bg-light-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-sunset-orange focus:ring-2 focus:ring-sunset-orange/20"
                />
              </div>
              <div>
                <label
                  htmlFor="review-email"
                  className="text-sm font-medium text-foreground/70"
                >
                  Email
                </label>
                <input
                  id="review-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) =>
                    setEdits((prev) => ({ ...prev, email: e.target.value }))
                  }
                  autoComplete="email"
                  className="mt-2 w-full rounded-xl border border-black/10 bg-light-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-sunset-orange focus:ring-2 focus:ring-sunset-orange/20"
                />
              </div>
              <div>
                <label
                  htmlFor="review-phone"
                  className="text-sm font-medium text-foreground/70"
                >
                  Phone / WhatsApp
                </label>
                <div className="mt-2">
                  <PhoneInput
                    id="review-phone"
                    value={phone}
                    onChange={(value) =>
                      setEdits((prev) => ({ ...prev, phone: value }))
                    }
                    required
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="review-notes"
                  className="text-sm font-medium text-foreground/70"
                >
                  Special requests{" "}
                  <span className="text-foreground/40">(optional)</span>
                </label>
                <textarea
                  id="review-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) =>
                    setEdits((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  placeholder="Child seats, extra stops, luggage notes…"
                  className="mt-2 w-full resize-none rounded-xl border border-black/10 bg-light-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-sunset-orange focus:ring-2 focus:ring-sunset-orange/20"
                />
              </div>
            </div>
          </section>

          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href={backHref}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-foreground transition hover:border-sunset-orange hover:text-sunset-orange"
            >
              <svg
                className="h-4 w-4 rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
              Back to trip
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-sunset-red via-sunset-orange to-sunset-gold px-10 py-4 text-base font-bold text-white shadow-lg shadow-sunset-orange/25 transition hover:shadow-xl hover:shadow-sunset-orange/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Loading…" : "Continue to payment"}
              <svg
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
