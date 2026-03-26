import Image from "next/image";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import RouteSearch from "@/components/RouteSearch";
import type { Route } from "@/components/RouteSearch";
import type { Metadata } from "next";

const LOGO_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/Logo%20Transparente.png";
const HERO_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/hero-ruta-pacifico.webp";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book a Transfer | Ruta Pacifico — Private Transfers in Guanacaste",
  description:
    "Private transfers across Guanacaste and all of Costa Rica. Airport pickups from LIR, beach-to-beach rides, and inter-destination transport. Fixed prices, book instantly.",
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
  const routes = await getRoutes();

  return (
    <main className="bg-light-surface min-h-screen">
      {/* ─── NAV ─── */}
      <nav className="absolute top-0 z-50 w-full">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={LOGO_URL}
              alt="Ruta Pacifico"
              width={480}
              height={160}
              className="h-40 w-auto"
              unoptimized
            />
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/#services"
              className="text-sm font-medium text-white/80 transition hover:text-sunset-orange"
            >
              Private Transfers
            </Link>
            <Link
              href="/blog"
              className="hidden text-sm font-medium text-white/80 transition hover:text-sunset-orange sm:block"
            >
              Blog
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-white/80 transition hover:text-sunset-orange"
            >
              About &amp; Contact Us
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative flex min-h-[55vh] items-center overflow-hidden">
        <Image
          src={HERO_URL}
          alt="Costa Rica shuttle transfer"
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
            Private Transfers in{" "}
            <span className="bg-gradient-to-r from-sunset-gold via-sunset-orange to-sunset-red bg-clip-text text-transparent">
              Guanacaste
            </span>{" "}
            <span className="text-white/70">&amp;</span> all of Costa Rica
          </h1>
          <div className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 px-5 py-2.5">
              <svg className="h-5 w-5 text-sunset-gold" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
              </svg>
              <span className="text-sm font-semibold text-white">Airport Transfers</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 px-5 py-2.5">
              <svg className="h-5 w-5 text-sunset-gold" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              <span className="text-sm font-semibold text-white">Inter-Beach Rides</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 px-5 py-2.5">
              <svg className="h-5 w-5 text-sunset-gold" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
              </svg>
              <span className="text-sm font-semibold text-white">Inter-Destination Transport</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CLIENT-SIDE ROUTE SEARCH ─── */}
      <RouteSearch routes={routes} />

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
              <a
                href="https://wa.me/50600000000"
                className="transition hover:text-sunset-orange"
              >
                WhatsApp
              </a>
              <a
                href="mailto:info@rutapacifico.com"
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
