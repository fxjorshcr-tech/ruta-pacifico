"use client";

/**
 * Payment page — UX skeleton.
 *
 * The card form below collects raw card details on the client for preview
 * purposes only. Before taking real money in production, swap these inputs
 * for Stripe Elements (or an equivalent tokenizer) so the raw PAN/CVV never
 * touch this origin — that keeps us out of PCI-DSS scope. The submit handler
 * and /api/book/create are intentionally thin so they can be replaced with a
 * PaymentIntent confirmation without reshaping the rest of the flow.
 */

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import BookingStepper from "@/components/BookingStepper";
import BookingSummary from "@/components/BookingSummary";
import {
  BOOKING_PENDING_KEY,
  BOOKING_STORAGE_KEY,
  type Booking,
  type BookingPending,
} from "@/lib/booking";

type CardBrand = "visa" | "mastercard" | "amex" | "discover" | "unknown";

function subscribeSessionStorage(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getPendingSnapshot(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(BOOKING_PENDING_KEY);
  } catch {
    return null;
  }
}

function getServerSnapshot(): string | null {
  return null;
}

export default function PaymentPage() {
  const router = useRouter();

  const raw = useSyncExternalStore(
    subscribeSessionStorage,
    getPendingSnapshot,
    getServerSnapshot
  );

  const pending = useMemo((): BookingPending | null => {
    if (!raw) return null;
    try {
      return JSON.parse(raw) as BookingPending;
    } catch {
      return null;
    }
  }, [raw]);

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [zip, setZip] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const brand: CardBrand = useMemo(
    () => detectBrand(cardNumber),
    [cardNumber]
  );
  const cardDigits = cardNumber.replace(/\D/g, "");
  const isAmex = brand === "amex";
  const expectedLen = isAmex ? 15 : 16;
  const cvvLen = isAmex ? 4 : 3;

  const cardValid =
    cardDigits.length === expectedLen && luhn(cardDigits);
  const expiryValid = isExpiryValid(expiry);
  const cvvValid = cvv.length === cvvLen;
  const cardNameValid = cardName.trim().length >= 2;
  const zipValid = zip.trim().length >= 3;

  const formValid =
    cardValid && expiryValid && cvvValid && cardNameValid && zipValid;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!pending || submitting || !formValid) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/book/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking: pending,
          // NOTE: this is a placeholder payload. Real integration must send a
          // tokenized payment method id (e.g. Stripe's pm_… or a PaymentIntent
          // client_secret), never raw PAN/CVV.
          payment: {
            brand,
            last4: cardDigits.slice(-4),
            zip: zip.trim(),
          },
        }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(body?.error ?? "Payment could not be processed");
      }

      const body = (await res.json()) as {
        confirmationCode: string;
        createdAt: string;
      };

      const booking: Booking = {
        ...pending,
        confirmationCode: body.confirmationCode,
        createdAt: body.createdAt,
        paid: true,
      };

      sessionStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(booking));
      sessionStorage.removeItem(BOOKING_PENDING_KEY);
      router.push("/book/confirmation");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  if (raw === null && typeof window === "undefined") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-light-surface">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-sunset-orange/20 border-t-sunset-orange" />
      </main>
    );
  }

  if (!pending) {
    return (
      <main className="min-h-screen bg-light-surface">
        <SiteNav transparent={false} />
        <div className="mx-auto max-w-md px-6 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Session expired
          </h1>
          <p className="mt-3 text-sm text-foreground/60">
            Please start your booking again from the routes page.
          </p>
          <Link
            href="/book/transfer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-sunset-orange px-6 py-3 text-sm font-semibold text-white transition hover:bg-sunset-gold"
          >
            Find a route
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-light-surface">
      <SiteNav transparent={false} />
      <BookingStepper current={3} />

      <div className="mx-auto max-w-5xl px-6 pb-16">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Payment
          </h1>
          <p className="mt-2 text-sm text-foreground/60">
            Enter your card to confirm and secure your booking.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Card form */}
          <form onSubmit={handleSubmit} className="order-2 lg:order-1">
            <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sunset-orange text-sm font-bold text-white">
                    3
                  </span>
                  <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                    Card details
                  </h2>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground/50">
                  <svg
                    className="h-4 w-4 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                    />
                  </svg>
                  Secure
                </div>
              </div>

              {/* Card number */}
              <div>
                <label
                  htmlFor="card-number"
                  className="text-sm font-medium text-foreground/70"
                >
                  Card number
                </label>
                <div
                  className={`mt-2 flex items-center gap-3 rounded-xl border bg-light-surface px-4 py-3 transition focus-within:border-sunset-orange focus-within:ring-2 focus-within:ring-sunset-orange/20 ${
                    cardNumber && !cardValid
                      ? "border-red-300"
                      : "border-black/10"
                  }`}
                >
                  <input
                    id="card-number"
                    type="text"
                    required
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="1234 1234 1234 1234"
                    value={cardNumber}
                    onChange={(e) =>
                      setCardNumber(formatCardNumber(e.target.value, isAmex))
                    }
                    maxLength={isAmex ? 17 : 19}
                    className="w-full bg-transparent text-sm font-semibold tracking-wider text-foreground outline-none placeholder:font-normal placeholder:tracking-normal placeholder:text-foreground/30"
                  />
                  <CardBrandBadge brand={brand} />
                </div>
              </div>

              {/* Cardholder name */}
              <div className="mt-5">
                <label
                  htmlFor="card-name"
                  className="text-sm font-medium text-foreground/70"
                >
                  Cardholder name
                </label>
                <input
                  id="card-name"
                  type="text"
                  required
                  autoComplete="cc-name"
                  placeholder="As printed on the card"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                  className="mt-2 w-full rounded-xl border border-black/10 bg-light-surface px-4 py-3 text-sm font-semibold text-foreground outline-none transition focus:border-sunset-orange focus:ring-2 focus:ring-sunset-orange/20 placeholder:font-normal placeholder:text-foreground/30"
                />
              </div>

              {/* Expiry + CVV */}
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="card-exp"
                    className="text-sm font-medium text-foreground/70"
                  >
                    Expiry (MM/YY)
                  </label>
                  <input
                    id="card-exp"
                    type="text"
                    required
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="MM / YY"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    maxLength={7}
                    className={`mt-2 w-full rounded-xl border bg-light-surface px-4 py-3 text-sm font-semibold text-foreground outline-none transition focus:border-sunset-orange focus:ring-2 focus:ring-sunset-orange/20 placeholder:font-normal placeholder:text-foreground/30 ${
                      expiry && !expiryValid
                        ? "border-red-300"
                        : "border-black/10"
                    }`}
                  />
                </div>
                <div>
                  <label
                    htmlFor="card-cvv"
                    className="text-sm font-medium text-foreground/70"
                  >
                    CVV
                  </label>
                  <input
                    id="card-cvv"
                    type="text"
                    required
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder={isAmex ? "4 digits" : "3 digits"}
                    value={cvv}
                    onChange={(e) =>
                      setCvv(e.target.value.replace(/\D/g, "").slice(0, cvvLen))
                    }
                    maxLength={cvvLen}
                    className="mt-2 w-full rounded-xl border border-black/10 bg-light-surface px-4 py-3 text-sm font-semibold text-foreground outline-none transition focus:border-sunset-orange focus:ring-2 focus:ring-sunset-orange/20 placeholder:font-normal placeholder:text-foreground/30"
                  />
                </div>
              </div>

              {/* Billing ZIP */}
              <div className="mt-5">
                <label
                  htmlFor="card-zip"
                  className="text-sm font-medium text-foreground/70"
                >
                  Billing ZIP / Postal code
                </label>
                <input
                  id="card-zip"
                  type="text"
                  required
                  autoComplete="postal-code"
                  placeholder="e.g. 94107"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-black/10 bg-light-surface px-4 py-3 text-sm font-semibold text-foreground outline-none transition focus:border-sunset-orange focus:ring-2 focus:ring-sunset-orange/20 placeholder:font-normal placeholder:text-foreground/30"
                />
              </div>

              {error && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}
            </section>

            <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/book/review"
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
                Back
              </Link>
              <button
                type="submit"
                disabled={!formValid || submitting}
                className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-sunset-red via-sunset-orange to-sunset-gold px-10 py-4 text-base font-bold text-white shadow-lg shadow-sunset-orange/25 transition hover:shadow-xl hover:shadow-sunset-orange/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <svg
                      className="h-5 w-5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                      <path
                        className="opacity-90"
                        fill="currentColor"
                        d="M4 12a8 8 0 0 1 8-8v3a5 5 0 0 0-5 5H4z"
                      />
                    </svg>
                    Processing…
                  </>
                ) : (
                  <>
                    Pay ${pending.price}
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
                        d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>

            <p className="mt-4 text-center text-xs text-foreground/40">
              Your card is charged only once you confirm. We never share your
              details with the driver.
            </p>
          </form>

          {/* Sidebar summary */}
          <aside className="order-1 lg:order-2">
            <div className="lg:sticky lg:top-24">
              <BookingSummary
                draft={pending}
                editHref="/book/review"
                compact
              />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

/* ── helpers ───────────────────────────────────────────────────────────── */

function formatCardNumber(raw: string, isAmex: boolean): string {
  const digits = raw.replace(/\D/g, "").slice(0, isAmex ? 15 : 16);
  if (isAmex) {
    // 4-6-5 grouping
    return digits
      .replace(/^(\d{0,4})(\d{0,6})(\d{0,5}).*$/, (_, a, b, c) =>
        [a, b, c].filter(Boolean).join(" ")
      )
      .trim();
  }
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length < 3) return digits;
  return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
}

function isExpiryValid(value: string): boolean {
  const m = value.match(/^(\d{2})\s*\/\s*(\d{2})$/);
  if (!m) return false;
  const month = parseInt(m[1], 10);
  const year = 2000 + parseInt(m[2], 10);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const end = new Date(year, month, 0, 23, 59, 59);
  return end >= now;
}

function luhn(digits: string): boolean {
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = digits.charCodeAt(i) - 48;
    if (n < 0 || n > 9) return false;
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum > 0 && sum % 10 === 0;
}

function detectBrand(cardNumber: string): CardBrand {
  const n = cardNumber.replace(/\D/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(n)) return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  if (/^(6011|65|64[4-9])/.test(n)) return "discover";
  return "unknown";
}

function CardBrandBadge({ brand }: { brand: CardBrand }) {
  if (brand === "unknown") {
    return (
      <svg
        className="h-6 w-9 text-foreground/30"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 8.25h19.5M2.25 9v10.5A1.5 1.5 0 0 0 3.75 21h16.5a1.5 1.5 0 0 0 1.5-1.5V9M3.75 3h16.5A1.5 1.5 0 0 1 21.75 4.5v3.75H2.25V4.5A1.5 1.5 0 0 1 3.75 3Z"
        />
      </svg>
    );
  }
  const label = brand === "amex" ? "AMEX" : brand.toUpperCase();
  const bg: Record<Exclude<CardBrand, "unknown">, string> = {
    visa: "bg-[#1a1f71] text-white",
    mastercard: "bg-[#eb001b] text-white",
    amex: "bg-[#006fcf] text-white",
    discover: "bg-[#ff6000] text-white",
  };
  return (
    <span
      className={`inline-flex h-6 items-center rounded-md px-2 text-[0.65rem] font-bold tracking-[0.1em] ${bg[brand]}`}
    >
      {label}
    </span>
  );
}
