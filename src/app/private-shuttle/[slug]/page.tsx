import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSupabase } from "@/lib/supabase";
import BookingSection from "@/components/BookingSection";
import SiteNav from "@/components/SiteNav";
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

const BASE_URL = "https://rutapacifico.com";

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
      robots: { index: false, follow: false },
    };
  }
  const title = `${route.origen} to ${route.destino} Private Shuttle (from $${route.precio1a6})`;
  const description = `Private shuttle from ${route.origen} to ${route.destino}${
    route.duracion ? ` (${route.duracion})` : ""
  }. Fixed price from $${route.precio1a6} per vehicle, door-to-door, bilingual driver, flight tracking. Book online.`;
  const canonical = `/private-shuttle/${slug}`;
  return {
    title,
    description,
    alternates: { canonical },
    keywords: [
      `${route.origen} to ${route.destino} shuttle`,
      `${route.origen} ${route.destino} transfer`,
      `private shuttle ${route.destino}`,
      `${route.destino} Costa Rica transfer`,
      "Costa Rica private shuttle",
      "Guanacaste shuttle",
    ],
    openGraph: {
      type: "website",
      url: `${BASE_URL}${canonical}`,
      title,
      description,
      siteName: "Ruta Pacifico",
      images: [
        {
          url: HERO_URL,
          width: 1200,
          height: 630,
          alt: `Private shuttle from ${route.origen} to ${route.destino}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [HERO_URL],
    },
  };
}

function RouteJsonLd({
  route,
  slug,
  airportPickup,
}: {
  route: Route;
  slug: string;
  airportPickup: boolean;
}) {
  const url = `${BASE_URL}/private-shuttle/${slug}`;
  const offers: Record<string, unknown>[] = [
    {
      "@type": "Offer",
      name: `${route.origen} → ${route.destino} — up to 6 passengers`,
      price: route.precio1a6,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url,
      eligibleQuantity: {
        "@type": "QuantitativeValue",
        minValue: 1,
        maxValue: 6,
        unitText: "passengers",
      },
    },
  ];
  if (route.precio7a9) {
    offers.push({
      "@type": "Offer",
      name: `${route.origen} → ${route.destino} — 7 to 9 passengers`,
      price: route.precio7a9,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url,
      eligibleQuantity: {
        "@type": "QuantitativeValue",
        minValue: 7,
        maxValue: 9,
        unitText: "passengers",
      },
    });
  }
  if (route.precio10a12) {
    offers.push({
      "@type": "Offer",
      name: `${route.origen} → ${route.destino} — 10 to 12 passengers`,
      price: route.precio10a12,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url,
      eligibleQuantity: {
        "@type": "QuantitativeValue",
        minValue: 10,
        maxValue: 12,
        unitText: "passengers",
      },
    });
  }

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Service", "Product"],
        "@id": `${url}#service`,
        name: `Private Shuttle: ${route.origen} to ${route.destino}`,
        description: `Private, direct shuttle service from ${route.origen} to ${route.destino}${
          route.duracion ? ` — approximately ${route.duracion}` : ""
        }. Includes a professional bilingual driver, air-conditioned vehicle, WiFi, water${
          airportPickup ? " and real-time flight tracking" : ""
        }.`,
        serviceType: airportPickup
          ? "Airport transfer"
          : "Private ground transportation",
        category: "Ground transportation",
        provider: { "@id": `${BASE_URL}/#organization` },
        areaServed: { "@type": "Country", name: "Costa Rica" },
        brand: { "@type": "Brand", name: "Ruta Pacifico" },
        image: HERO_URL,
        url,
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "USD",
          lowPrice: route.precio1a6,
          highPrice:
            route.precio10a12 ?? route.precio7a9 ?? route.precio1a6,
          offerCount: offers.length,
          offers,
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5.0",
          bestRating: "5",
          worstRating: "1",
          ratingCount: "50",
          reviewCount: "50",
        },
      },
      {
        "@type": "Trip",
        "@id": `${url}#trip`,
        name: `${route.origen} to ${route.destino}`,
        description: `Private transfer from ${route.origen} to ${route.destino}.`,
        provider: { "@id": `${BASE_URL}/#organization` },
        itinerary: [
          { "@type": "Place", name: route.origen },
          { "@type": "Place", name: route.destino },
        ],
        offers: {
          "@type": "Offer",
          price: route.precio1a6,
          priceCurrency: "USD",
          url,
          availability: "https://schema.org/InStock",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Private Shuttles",
            item: `${BASE_URL}/private-shuttle`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `${route.origen} → ${route.destino}`,
            item: url,
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
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
      <RouteJsonLd route={route} slug={slug} airportPickup={airportPickup} />
      {/* ─── NAV ─── */}
      <SiteNav transparent />

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

          {/* Prominent price badge */}
          <div className="mt-10 flex justify-center">
            <div className="inline-flex items-center gap-5 rounded-3xl border border-white/15 bg-white/5 px-7 py-5 shadow-xl shadow-black/20 backdrop-blur-xl sm:gap-6 sm:px-8">
              <div className="flex flex-col items-start leading-none">
                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-white/60">
                  Starting from
                </span>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="bg-gradient-to-r from-sunset-gold via-sunset-orange to-sunset-red bg-clip-text text-5xl font-extrabold tracking-tight text-transparent drop-shadow-sm sm:text-6xl">
                    ${startingPrice}
                  </span>
                  <span className="text-sm font-semibold text-white/80">
                    USD
                  </span>
                </div>
                <span className="mt-1.5 text-[0.7rem] text-white/60">
                  per vehicle (1–6 pax) · all taxes included
                </span>
              </div>
              <div className="h-16 w-px bg-white/20" />
              <div className="flex flex-col items-start gap-1.5 text-left">
                {["Private vehicle", "Fixed price", "Free cancellation"].map(
                  (item) => (
                    <div
                      key={item}
                      className="flex items-center gap-1.5 text-xs text-white/90"
                    >
                      <svg
                        className="h-3.5 w-3.5 text-green-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={3}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 12.75 6 6 9-13.5"
                        />
                      </svg>
                      {item}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Continue CTA — smooth-scrolls to booking form */}
          <div className="mt-8 flex flex-col items-center gap-2">
            <a
              href="#booking"
              className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-sunset-red via-sunset-orange to-sunset-gold px-10 py-4 text-base font-bold text-white shadow-lg shadow-sunset-orange/25 transition hover:shadow-xl hover:shadow-sunset-orange/40 hover:scale-[1.02]"
            >
              Continue to book
              <svg
                className="h-5 w-5 transition-transform group-hover:translate-y-0.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
                />
              </svg>
            </a>
            <p className="text-xs text-white/60">
              Next: pick vehicle, date, passengers &amp; pickup details
            </p>
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
              Direct, non-stop service from{" "}
              <strong className="text-foreground">{route.origen}</strong> to{" "}
              <strong className="text-foreground">{route.destino}</strong>,
              operated by a professional bilingual driver in a modern
              air-conditioned private vehicle.
              {airportPickup
                ? " Arrival flights are monitored in real time and pickups are adjusted automatically to match your actual landing."
                : ""}
            </p>
          </div>
        </div>
      </section>

      {/* ─── Booking form ─── */}
      <section id="booking" className="mx-auto max-w-5xl px-6 py-16 scroll-mt-24">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-sunset-orange/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sunset-orange">
            Step 2 of 3 · Trip details
          </div>
          <h2 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl">
            Choose vehicle &amp; trip details
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-foreground/60">
            Pick the vehicle that fits your group, the date and time, and tell
            us where to meet you — we&apos;ll take it from there.
          </p>
        </div>
        <BookingSection
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
                href="/private-shuttle"
                className="transition hover:text-sunset-orange"
              >
                All routes
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
