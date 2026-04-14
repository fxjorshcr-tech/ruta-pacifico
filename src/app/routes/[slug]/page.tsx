import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSupabase } from "@/lib/supabase";
import BookingForm from "@/components/BookingForm";
import type { Route } from "@/components/RouteSearch";
import { isAirportOrigin, routeSlug } from "@/lib/slug";

const LOGO_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/Logo%20Transparente.png";
const HERO_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/hero-ruta-pacifico.webp";

export const dynamic = "force-dynamic";

type VehicleParam = "staria" | "hiace" | "maxus";

async function getAllRoutes(): Promise<Route[]> {
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

async function findRouteBySlug(slug: string): Promise<Route | null> {
  const all = await getAllRoutes();
  return all.find((r) => routeSlug(r.origen, r.destino) === slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const route = await findRouteBySlug(slug);
  if (!route) {
    return {
      title: "Route not found | Ruta Pacifico",
    };
  }
  const title = `${route.origen} to ${route.destino} — Private Shuttle | Ruta Pacifico`;
  const description = `Private shuttle from ${route.origen} to ${route.destino}. Fixed price from $${route.precio1a6}, door-to-door, bilingual drivers. Book online in minutes.`;
  return {
    title,
    description,
  };
}

export default async function RoutePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ v?: VehicleParam }>;
}) {
  const [{ slug }, { v }] = await Promise.all([params, searchParams]);
  const route = await findRouteBySlug(slug);
  if (!route) notFound();

  const airportPickup = isAirportOrigin(route.origen);
  const startingPrice = route.precio1a6;

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
              className="h-28 w-auto sm:h-36"
              unoptimized
            />
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-white/80 transition hover:text-sunset-orange"
            >
              Home
            </Link>
            <Link
              href="/book/transfer"
              className="hidden text-sm font-medium text-white/80 transition hover:text-sunset-orange sm:block"
            >
              All Routes
            </Link>
            <a
              href="https://wa.me/50685962438"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-sunset-orange px-5 py-2 text-sm font-semibold text-white transition hover:bg-sunset-gold"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </nav>

      {/* ─── HERO / Route header ─── */}
      <section className="relative flex min-h-[52vh] items-center overflow-hidden">
        <Image
          src={HERO_URL}
          alt="Private shuttle in Costa Rica"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-light-surface via-transparent to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            Private Shuttle · {route.duracion || "Direct"}
          </div>
          <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            {route.origen}{" "}
            <span className="text-white/60">→</span>{" "}
            <span className="bg-gradient-to-r from-sunset-gold via-sunset-orange to-sunset-red bg-clip-text text-transparent">
              {route.destino}
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-white/80 sm:text-base">
            Door-to-door private shuttle service. One vehicle, one driver,
            straight to your destination.
          </p>
          <div className="mt-6 inline-flex items-baseline gap-2 rounded-full bg-white/10 px-5 py-2.5 backdrop-blur-sm">
            <span className="text-xs text-white/70">From</span>
            <span className="text-2xl font-bold text-white">
              ${startingPrice}
            </span>
            <span className="text-xs text-white/60">per vehicle</span>
          </div>
        </div>
      </section>

      {/* ─── Route info ─── */}
      <section className="relative -mt-16 z-20 mx-auto max-w-5xl px-6">
        <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-xl sm:p-8">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sunset-orange/10 text-sunset-orange">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-foreground/40">
                  Travel time
                </div>
                <div className="text-sm font-bold text-foreground">
                  {route.duracion || "Varies by traffic"}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sunset-orange/10 text-sunset-orange">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-foreground/40">
                  Private service
                </div>
                <div className="text-sm font-bold text-foreground">
                  Just your group — up to 12 pax
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sunset-orange/10 text-sunset-orange">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-foreground/40">
                  What&apos;s included
                </div>
                <div className="text-sm font-bold text-foreground">
                  WiFi, water, child seats
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-black/5 pt-6">
            <p className="text-sm leading-relaxed text-foreground/70">
              This private shuttle takes you directly from{" "}
              <strong className="text-foreground">{route.origen}</strong> to{" "}
              <strong className="text-foreground">{route.destino}</strong> —
              no stops, no other passengers, no connections. Your driver meets
              you at the pickup point and drops you off at the entrance of your
              destination.
              {airportPickup
                ? " If you're flying in, we monitor your flight in real time and adjust the pickup if you land early or late."
                : ""}
            </p>
          </div>
        </div>
      </section>

      {/* ─── Booking form ─── */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Book your shuttle
          </h2>
          <p className="mt-2 text-sm text-foreground/60">
            Fill in your trip details and we&apos;ll confirm availability on
            WhatsApp within minutes.
          </p>
        </div>
        <BookingForm
          route={route}
          isAirportPickup={airportPickup}
          initialVehicle={v}
        />
      </section>

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
                href="/book/transfer"
                className="transition hover:text-sunset-orange"
              >
                All routes
              </Link>
              <a
                href="https://wa.me/50685962438"
                className="transition hover:text-sunset-orange"
              >
                WhatsApp
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
