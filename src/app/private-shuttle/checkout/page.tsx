"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import PhoneInput from "@/components/PhoneInput";
import {
  BOOKING_STORAGE_KEY,
  CART_STORAGE_KEY,
  getCartTotal,
  generateConfirmationCode,
  formatDate,
  formatTime,
  type TripItem,
} from "@/lib/booking";

const HERO_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/hero-ruta-pacifico.webp";

function subscribeCart(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener("rp-cart-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("rp-cart-change", callback);
  };
}

function getCartSnapshot(): string {
  if (typeof window === "undefined") return "[]";
  try {
    return window.sessionStorage.getItem(CART_STORAGE_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function getCartServerSnapshot(): string | null {
  return null;
}

export default function CheckoutPage() {
  const router = useRouter();

  const raw = useSyncExternalStore(
    subscribeCart,
    getCartSnapshot,
    getCartServerSnapshot
  );

  const cart = useMemo<TripItem[]>(() => {
    if (!raw) return [];
    try {
      return JSON.parse(raw) as TripItem[];
    } catch {
      return [];
    }
  }, [raw]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const total = getCartTotal(cart);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (cart.length === 0) return;
    setSubmitting(true);
    setSubmitError(null);

    const booking = {
      trips: cart,
      name,
      email,
      phone,
      notes: notes || undefined,
      total,
      confirmationCode: generateConfirmationCode(),
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error ?? "Could not confirm your booking.");
      }
    } catch (err) {
      setSubmitting(false);
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Could not confirm your booking. Please try again.",
      );
      return;
    }

    try {
      sessionStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(booking));
      sessionStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      // sessionStorage disabled
    }

    router.push("/private-shuttle/confirmation");
  }

  if (raw === null && typeof window === "undefined") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-light-surface">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-sunset-orange/20 border-t-sunset-orange" />
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="bg-light-surface min-h-screen">
        <SiteNav transparent={false} />
        <div className="mx-auto max-w-2xl px-6 py-32 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Your trip is empty
          </h1>
          <p className="mt-3 text-sm text-foreground/60">
            Add at least one shuttle to continue.
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
      <SiteNav transparent />

      {/* ─── HERO ─── */}
      <section className="relative flex min-h-[40vh] items-center overflow-hidden">
        <Image src={HERO_URL} alt="Private shuttle in Costa Rica" fill className="object-cover" priority unoptimized />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-light-surface via-transparent to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-3xl px-6 pt-24 pb-20 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Checkout
          </h1>
          <p className="mt-3 text-white/70">
            Review your {cart.length === 1 ? "shuttle" : `${cart.length} shuttles`} and complete your booking.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 pb-20 pt-10">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-3">
            {/* ── LEFT: Shuttles + Info ── */}
            <div className="space-y-6 lg:col-span-2">
              {/* Shuttle cards */}
              <div className="space-y-4">
                {cart.map((trip, idx) => {
                  const pax = `${trip.adults} adult${trip.adults !== 1 ? "s" : ""}${trip.children > 0 ? `, ${trip.children} child${trip.children !== 1 ? "ren" : ""}` : ""}`;
                  return (
                    <div key={trip.id} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {cart.length > 1 && (
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sunset-orange text-xs font-bold text-white">
                              {idx + 1}
                            </span>
                          )}
                          <div>
                            <div className="font-bold text-foreground">{trip.from} → {trip.to}</div>
                            <div className="mt-0.5 text-xs text-foreground/50">
                              {formatDate(trip.date)} · {formatTime(trip.time)}
                              {trip.duracion && <> · ~{trip.duracion}</>}
                            </div>
                          </div>
                        </div>
                        <div className="text-xl font-bold text-sunset-orange">${trip.price}</div>
                      </div>
                      <div className="mt-4 grid gap-x-6 gap-y-2 text-sm text-foreground/70 sm:grid-cols-2">
                        <div><span className="text-foreground/40">Vehicle:</span> {trip.vehicleName} ({trip.vehiclePax})</div>
                        <div><span className="text-foreground/40">Travelers:</span> {pax}</div>
                        {trip.flight && <div><span className="text-foreground/40">Flight:</span> {trip.flight}</div>}
                        <div><span className="text-foreground/40">Pickup:</span> {trip.pickup}</div>
                        <div><span className="text-foreground/40">Drop-off:</span> {trip.dropoff}</div>
                      </div>
                    </div>
                  );
                })}
                <div className="text-right">
                  <Link href="/private-shuttle" className="text-sm font-semibold text-sunset-orange transition hover:text-sunset-red">
                    + Add another shuttle
                  </Link>
                </div>
              </div>

              {/* Your Information */}
              <div className="rounded-2xl border-2 border-sunset-orange/30 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sunset-orange text-xs font-bold text-white">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0" />
                    </svg>
                  </span>
                  <h2 className="text-lg font-bold text-foreground">Complete your details</h2>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="checkout-name" className="text-sm font-medium text-foreground/70">Full name</label>
                    <input id="checkout-name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full rounded-xl border border-black/10 bg-light-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-sunset-orange focus:ring-2 focus:ring-sunset-orange/20" />
                  </div>
                  <div>
                    <label htmlFor="checkout-email" className="text-sm font-medium text-foreground/70">Email</label>
                    <input id="checkout-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-black/10 bg-light-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-sunset-orange focus:ring-2 focus:ring-sunset-orange/20" />
                  </div>
                  <div>
                    <label htmlFor="checkout-phone" className="text-sm font-medium text-foreground/70">Phone / WhatsApp</label>
                    <div className="mt-2"><PhoneInput id="checkout-phone" value={phone} onChange={setPhone} required /></div>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="checkout-notes" className="text-sm font-medium text-foreground/70">Special requests <span className="text-foreground/40">(optional)</span></label>
                    <textarea id="checkout-notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Child seats, extra stops, luggage notes…" className="mt-2 w-full resize-none rounded-xl border border-black/10 bg-light-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-sunset-orange focus:ring-2 focus:ring-sunset-orange/20" />
                  </div>
                </div>

              </div>

              {/* ── CONFIRM BOOKING BLOCK ── */}
              <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
                {submitError && (
                  <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="group flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-8 py-5 text-base font-bold text-white shadow-lg shadow-green-500/25 transition hover:shadow-xl hover:shadow-green-500/40 disabled:cursor-not-allowed disabled:opacity-60 sm:text-lg"
                >
                  {submitting ? (
                    "Confirming…"
                  ) : (
                    <>
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                        />
                      </svg>
                      Confirm Booking — ${total}
                    </>
                  )}
                </button>

                {/* Yellow "How does payment work?" notice */}
                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0 text-amber-500">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.8}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 8.25h19.5M2.25 9v10.5A1.5 1.5 0 0 0 3.75 21h16.5a1.5 1.5 0 0 0 1.5-1.5V9M3.75 3h16.5A1.5 1.5 0 0 1 21.75 4.5v3.75H2.25V4.5A1.5 1.5 0 0 1 3.75 3Z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-amber-900">
                        How does payment work?
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-amber-900/80">
                        After confirming your booking, we will send you a{" "}
                        <strong>secure payment link</strong> to your email so
                        you can complete the payment safely. Your reservation
                        will be held in the meantime.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Trust badges row */}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-black/5 pt-5 text-sm">
                  <div className="flex items-center gap-2 text-foreground/70">
                    <svg
                      className="h-5 w-5 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.8}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                      />
                    </svg>
                    Reservation Guaranteed
                  </div>
                  <div className="flex items-center gap-2 text-foreground/70">
                    <svg
                      className="h-5 w-5 text-green-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.8}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                      />
                    </svg>
                    Secure Payment Link
                  </div>
                  <div className="flex items-center gap-2 text-foreground/70">
                    <svg
                      className="h-5 w-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.8}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                      />
                    </svg>
                    ICT Licensed
                  </div>
                </div>
              </div>

              {/* Back + ICT footer */}
              <div className="flex flex-col-reverse items-start justify-between gap-4 pt-2 sm:flex-row sm:items-center">
                <Link
                  href="/private-shuttle"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/60 transition hover:text-sunset-orange"
                >
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
                      d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                    />
                  </svg>
                  Back to Trip Details
                </Link>
                <div className="inline-flex items-center gap-2.5 rounded-xl border border-black/5 bg-white px-4 py-2.5 shadow-sm">
                  <svg
                    className="h-4 w-4 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                    />
                  </svg>
                  <div className="leading-tight">
                    <div className="text-xs font-bold text-foreground">
                      ICT Licensed #4121-2025
                    </div>
                    <div className="text-[0.65rem] text-foreground/50">
                      Costa Rica Tourism Board
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Sidebar ── */}
            <div className="space-y-6">
              {/* Total + Pay */}
              <div className="sticky top-24 space-y-6">
                <div className="rounded-2xl border border-sunset-orange/20 bg-sunset-orange/5 p-6">
                  <div className="text-sm text-foreground/60">
                    Total ({cart.length} shuttle{cart.length !== 1 ? "s" : ""})
                  </div>
                  <div className="mt-1 text-3xl font-bold text-sunset-orange">${total}</div>
                  <div className="text-xs text-foreground/40">13% VAT included</div>
                  <p className="mt-3 text-xs text-foreground/40">
                    Confirm your reservation — we&apos;ll email a secure payment link.
                  </p>
                </div>

                {/* What's Included */}
                <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-bold text-foreground">What&apos;s Included</h3>
                  <ul className="mt-3 space-y-2.5">
                    {[
                      "Spacious van with full A/C",
                      "Personalized meet & greet",
                      "Door-to-door private service",
                      "Free Wi-Fi & bottled water",
                      "Professional bilingual driver",
                      "All-inclusive pricing",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-sm text-foreground/70">
                        <svg className="h-4 w-4 shrink-0 text-sunset-orange" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Important Info */}
                <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-bold text-foreground">Important Information</h3>
                  <ul className="mt-3 space-y-2.5">
                    {[
                      "1 large bag + 1 carry-on per person",
                      "One complimentary 15-min stop",
                      "Baby car seats & boosters free",
                      "No refund within 48h of pickup",
                      "Free changes up to 48h before",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-sm text-foreground/70">
                        <svg className="h-4 w-4 shrink-0 text-foreground/30" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
