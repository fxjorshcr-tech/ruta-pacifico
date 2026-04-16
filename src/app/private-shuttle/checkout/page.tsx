"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SiteNav from "@/components/SiteNav";

const HERO_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/hero-ruta-pacifico.webp";
import PhoneInput from "@/components/PhoneInput";
import {
  BOOKING_STORAGE_KEY,
  CART_STORAGE_KEY,
  getCart,
  getCartTotal,
  generateConfirmationCode,
  formatDate,
  formatTime,
  type TripItem,
} from "@/lib/booking";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<TripItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setCart(getCart());
    setLoaded(true);
  }, []);

  const total = getCartTotal(cart);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (cart.length === 0) return;
    setSubmitting(true);

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
      sessionStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(booking));
      sessionStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      // sessionStorage disabled
    }

    router.push("/private-shuttle/confirmation");
  }

  if (!loaded) return null;

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
                  <h2 className="text-lg font-bold text-foreground">Complete your details to pay</h2>
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

                {/* Pay button right here, below the form */}
                <div className="mt-6 flex flex-col items-end gap-3 border-t border-black/5 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm text-foreground/60">Total ({cart.length} shuttle{cart.length !== 1 ? "s" : ""})</div>
                    <div className="text-2xl font-bold text-sunset-orange">${total}</div>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="group flex items-center gap-3 rounded-xl bg-gradient-to-r from-sunset-red via-sunset-orange to-sunset-gold px-8 py-4 text-base font-bold text-white shadow-lg shadow-sunset-orange/25 transition hover:shadow-xl hover:shadow-sunset-orange/40 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "Processing…" : "Pay This Booking"}
                    <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
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
                    Fill in your details below to complete the booking.
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
