import Image from "next/image";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import RouteSearch from "@/components/RouteSearch";
import SiteNav from "@/components/SiteNav";
import FaqAccordion, { type Faq } from "@/components/FaqAccordion";
import type { Route } from "@/components/RouteSearch";
import type { Metadata } from "next";

const LOGO_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/Logo%20Transparente.png";
const HERO_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/hero-ruta-pacifico.webp";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book a Private Shuttle | Ruta Pacifico — Private Shuttles in Guanacaste",
  description:
    "Private shuttles from Liberia Airport (LIR) to every beach and destination in Costa Rica. Fixed prices, flight tracking, book instantly.",
};

async function getRoutes(): Promise<Route[]> {
  const allRoutes: Route[] = [];
  const pageSize = 1000;
  let from = 0;
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await getSupabase()
      .from("routes")
      .select("id, origen, destino, precio1a6, precio7a9, precio10a12, duracion, alias")
      .order("origen", { ascending: true })
      .range(from, from + pageSize - 1);

    if (error) {
      console.error("Failed to fetch routes:", error.message);
      break;
    }

    if (data) {
      allRoutes.push(...data);
    }

    hasMore = (data?.length ?? 0) === pageSize;
    from += pageSize;
  }

  return allRoutes;
}

async function getFeaturedFaqs(): Promise<Faq[]> {
  // Show up to 6 FAQs on the transfer page: featured ones first, then fill
  // with the lowest-display-order active FAQs so the section always has
  // content even if nothing is flagged as featured.
  const { data: featured, error: featuredError } = await getSupabase()
    .from("faqs_ruta_pacifico")
    .select("id, category, question, answer, display_order, is_featured")
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("display_order", { ascending: true })
    .limit(6);

  if (featuredError) {
    console.error("Failed to fetch featured FAQs:", featuredError.message);
    return [];
  }

  const result: Faq[] = (featured ?? []) as Faq[];
  if (result.length >= 6) return result.slice(0, 6);

  const { data: fill } = await getSupabase()
    .from("faqs_ruta_pacifico")
    .select("id, category, question, answer, display_order, is_featured")
    .eq("is_active", true)
    .eq("is_featured", false)
    .order("display_order", { ascending: true })
    .limit(6 - result.length);

  return [...result, ...((fill ?? []) as Faq[])];
}

function GoogleReviewBadge() {
  return (
    <div className="inline-flex items-center gap-2.5 rounded-full bg-black/60 px-5 py-2.5 backdrop-blur-sm border border-white/10">
      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
      <div className="flex items-center gap-1">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-sm font-semibold text-white">5.0</span>
        <span className="text-sm text-white/60">on Google Reviews</span>
      </div>
    </div>
  );
}

export default async function TransferPage() {
  const [routes, faqs] = await Promise.all([getRoutes(), getFeaturedFaqs()]);

  return (
    <main className="bg-light-surface min-h-screen">
      {/* ─── NAV ─── */}
      <SiteNav transparent />

      {/* ─── HERO ─── */}
      <section className="relative flex min-h-[55vh] items-center overflow-hidden">
        <Image
          src={HERO_URL}
          alt="Private shuttle along the Guanacaste coast"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-light-surface via-transparent to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-4xl px-6 pt-24 pb-32 text-center">
          <div className="mb-6 flex justify-center">
            <GoogleReviewBadge />
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Private Shuttles in{" "}
            <span className="bg-gradient-to-r from-sunset-gold via-sunset-orange to-sunset-red bg-clip-text text-transparent">
              Guanacaste
            </span>{" "}
            <span className="text-white/70">&amp;</span> all of Costa Rica
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-white/80 sm:text-lg">
            Private door-to-door shuttles from Liberia Airport (LIR) to every beach and destination in Costa Rica.
          </p>
          <div className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 px-5 py-2.5">
              <svg className="h-5 w-5 text-sunset-gold" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
              </svg>
              <span className="text-sm font-semibold text-white">Airport Shuttles</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 px-5 py-2.5">
              <svg className="h-5 w-5 text-sunset-gold" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              <span className="text-sm font-semibold text-white">Inter-Beach Shuttles</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 px-5 py-2.5">
              <svg className="h-5 w-5 text-sunset-gold" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
              </svg>
              <span className="text-sm font-semibold text-white">Inter-Destination Shuttles</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CLIENT-SIDE ROUTE SEARCH ─── */}
      <RouteSearch routes={routes} />

      {/* ─── GOOD TO KNOW ─── */}
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Good to Know
          </h2>
          <p className="mt-2 text-sm text-foreground/60">
            Everything you need to know before booking your private shuttle.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {/* Cancellation */}
          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sunset-orange/10 text-sunset-orange">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-foreground">Cancellation</h3>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-foreground/70">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </span>
                <span><strong className="text-foreground">48+ hours before:</strong> Full refund (minus 13% tax)</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </span>
                <span><strong className="text-foreground">Within 48 hours:</strong> Non-refundable</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sunset-orange/15 text-sunset-orange">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </span>
                <span>
                  Email:{" "}
                  <a href="mailto:mybooking@rutapacificocr.com" className="font-medium text-sunset-orange hover:text-sunset-gold">
                    mybooking@rutapacificocr.com
                  </a>
                </span>
              </li>
            </ul>
          </div>

          {/* Changes & Modifications */}
          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sunset-orange/10 text-sunset-orange">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-foreground">Changes &amp; Modifications</h3>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-foreground/70">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </span>
                <span>Free changes up to 48 hours before pickup</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </span>
                <span>Change time, date, or location (subject to availability)</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sunset-orange/15 text-sunset-orange">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </span>
                <span>Route changes may affect price</span>
              </li>
            </ul>
          </div>

          {/* Need Help */}
          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sunset-orange/10 text-sunset-orange">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.553 4.116 1.519 5.848L.058 23.306a.5.5 0 00.636.636l5.458-1.461A11.948 11.948 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.94 0-3.753-.563-5.28-1.532l-.368-.224-3.821 1.023 1.023-3.821-.224-.368A9.935 9.935 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-foreground">Need Help?</h3>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-foreground/70">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </span>
                <span>WhatsApp support before, during &amp; after your ride</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </span>
                <span>Bilingual team available 7 days a week</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sunset-orange/15 text-sunset-orange">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </span>
                <span>
                  Reach us at{" "}
                  <a href="https://wa.me/50685962438" className="font-medium text-sunset-orange hover:text-sunset-gold">
                    +506-8596-2438
                  </a>
                </span>
              </li>
            </ul>
          </div>

          {/* Pricing */}
          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sunset-orange/10 text-sunset-orange">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3-3h.008v.008H18V9Zm-12 6h.008v.008H6V15Z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-foreground">Pricing</h3>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-foreground/70">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </span>
                <span>Price is per vehicle, not per person</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </span>
                <span>No hidden fees — the price you see is final</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </span>
                <span>All taxes included (13% VAT)</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ─── FAQ SNIPPET ─── */}
      {faqs.length > 0 && (
        <section className="mx-auto max-w-4xl px-6 pb-20">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-sunset-orange/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sunset-orange">
              Help Center
            </div>
            <h2 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-foreground/60">
              The most common questions travelers ask before booking a private
              shuttle with us.
            </p>
          </div>

          <FaqAccordion faqs={faqs} defaultOpenFirst />

          <div className="mt-8 flex justify-center">
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-sunset-orange"
            >
              See all FAQs
              <svg
                className="h-4 w-4"
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
            </Link>
          </div>
        </section>
      )}

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-black/5 bg-foreground text-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-4">
              <Image
                src={LOGO_URL}
                alt="Ruta Pacifico"
                width={200}
                height={65}
                className="h-16 w-auto"
                unoptimized
              />
            </div>
            <div className="flex items-center gap-6 text-sm text-white/50">
              <Link href="/" className="transition hover:text-sunset-orange">
                Home
              </Link>
              <Link
                href="/#services"
                className="transition hover:text-sunset-orange"
              >
                Services
              </Link>
              <Link href="/faq" className="transition hover:text-sunset-orange">
                FAQ
              </Link>
              <a
                href="https://wa.me/50685962438"
                className="transition hover:text-sunset-orange"
              >
                WhatsApp
              </a>
              <a
                href="mailto:mybooking@rutapacificocr.com"
                className="transition hover:text-sunset-orange"
              >
                Email
              </a>
            </div>
          </div>
          <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-white/30">
            &copy; 2025 Ruta Pacifico. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
