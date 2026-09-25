import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BookingSection from "@/components/BookingSection";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import DestinationGuide from "@/components/DestinationGuide";
import RouteFaqSection from "@/components/RouteFaq";
import { buildRouteFaqs, type RouteFaq } from "@/lib/routeFaqs";
import { findRouteBySlug, getRoutes, type Route } from "@/lib/routes";
import { isAirportOrigin, routeSlug } from "@/lib/slug";
import {
  destinationFor,
  getDestinations,
  hasGuide,
  isRouteIndexable,
  localizeDestination,
  selectIndexableRoutes,
  type Destination } from "@/lib/destinations";
import { MAX_PAX, VEHICLE_TIERS } from "@/lib/vehicles";
import {
  BASE_URL,
  IN_LANGUAGE,
  OG_LOCALE,
  localeAlternates,
  localeFromParams,
  localeUrl,
  type Locale } from "@/lib/i18n";
import { ROUTE } from "@/i18n/route";

const HERO_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/hero-ruta-pacifico.webp";

/**
 * Cached for 7 days and regenerated in the background on the next visit
 * (ISR). Every regeneration is an ISR write on Vercel, and with ~1,400
 * route URLs in two languages, almost all of them visited only by crawlers,
 * a 12-hour window meant several thousand writes a day: the bulk of the
 * project's ISR write budget. Prices change rarely; /prices (1 h) and the
 * booking search always show the live figure, and this page catches up
 * within a week.
 */
export const revalidate = 604800;

/**
 * No paths at build time: each slug is rendered on its first visit and then
 * served from the ISR cache until `revalidate` elapses. Next only treats a
 * dynamic segment as ISR when this function exists (an empty array is the
 * documented way to say "all paths at runtime").
 */
export function generateStaticParams(): { slug: string }[] {
  return [];
}

type Params = Promise<{ lang: string; slug: string }>;

export async function generateMetadata({
  params }: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await localeFromParams(params);
  const t = ROUTE[locale];
  const [route, destinations] = await Promise.all([
    findRouteBySlug(slug),
    getDestinations(),
  ]);
  if (!route) {
    return {
      title: t.notFoundTitle,
      robots: { index: false, follow: false } };
  }
  const indexable = isRouteIndexable(route, destinations);
  const title = t.metaTitle(route.origen, route.destino, route.precio1a5);
  const description = t.metaDescription(
    route.origen,
    route.destino,
    route.duracion,
    route.precio1a5
  );
  const canonical = `/private-shuttle/${slug}`;
  return {
    title,
    description,
    alternates: localeAlternates(canonical, locale),
    // Long-tail pairs stay bookable but out of the index (see
    // src/lib/destinations.ts for the tier rule). `follow` keeps link equity
    // flowing to the routes that matter.
    robots: indexable ? undefined : { index: false, follow: true },
    keywords: t.keywords(route.origen, route.destino),
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale],
      url: localeUrl(locale, canonical),
      title,
      description,
      siteName: "Ruta Pacifico",
      images: [
        {
          url: HERO_URL,
          width: 1200,
          height: 630,
          alt: t.ogImageAlt(route.origen, route.destino) },
      ] },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [HERO_URL] } };
}

/** First paragraph of a Markdown block as plain text, for JSON-LD descriptions. */
function plainSummary(md: string | undefined): string | undefined {
  if (!md) return undefined;
  const first = md.trim().split(/\n\s*\n/)[0] ?? "";
  const text = first
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`#>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text || undefined;
}

function RouteJsonLd({
  route,
  slug,
  airportPickup,
  origin,
  destination,
  faqs,
  locale }: {
  route: Route;
  slug: string;
  airportPickup: boolean;
  /** Already localized (see `localizeDestination`), so the Place descriptions match the page language. */
  origin?: Destination;
  destination?: Destination;
  faqs: RouteFaq[];
  locale: Locale;
}) {
  const t = ROUTE[locale].jsonLd;
  const url = localeUrl(locale, `/private-shuttle/${slug}`);
  // "https://rutapacifico.com" (no trailing slash, as it always was) or
  // "https://rutapacifico.com/es".
  const homeUrl = localeUrl(locale, "/").replace(/\/$/, "");
  const prices = VEHICLE_TIERS.map((tier) => ({
    tier,
    price: route[tier.priceField] })).filter((entry): entry is { tier: (typeof VEHICLE_TIERS)[number]; price: number } =>
    Boolean(entry.price)
  );
  const offers: Record<string, unknown>[] = prices.map(({ tier, price }) => ({
    "@type": "Offer",
    name: t.offerName(route.origen, route.destino, tier.minPax, tier.maxPax),
    price,
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url,
    eligibleQuantity: {
      "@type": "QuantitativeValue",
      minValue: tier.minPax,
      maxValue: tier.maxPax,
      unitText: t.passengers } }));
  const lowPrice = prices.length ? prices[0].price : route.precio1a5;
  const highPrice = prices.length
    ? prices[prices.length - 1].price
    : route.precio1a5;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Service", "Product"],
        "@id": `${url}#service`,
        name: t.serviceName(route.origen, route.destino),
        description: t.serviceDescription(
          route.origen,
          route.destino,
          route.duracion,
          airportPickup
        ),
        serviceType: airportPickup ? t.serviceTypeAirport : t.serviceTypeGround,
        category: t.category,
        provider: { "@id": `${BASE_URL}/#organization` },
        areaServed: { "@type": "Country", name: "Costa Rica" },
        brand: { "@type": "Brand", name: "Ruta Pacifico" },
        image: HERO_URL,
        url,
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "USD",
          lowPrice,
          highPrice,
          offerCount: offers.length,
          offers } },
      {
        "@type": "Trip",
        "@id": `${url}#trip`,
        name: t.tripName(route.origen, route.destino),
        description: t.tripDescription(route.origen, route.destino),
        provider: { "@id": `${BASE_URL}/#organization` },
        itinerary: [
          {
            "@type": "Place",
            name: route.origen,
            description: plainSummary(origin?.intro_md) },
          {
            "@type": "Place",
            name: route.destino,
            description: plainSummary(destination?.intro_md) },
        ],
        offers: {
          "@type": "Offer",
          price: lowPrice,
          priceCurrency: "USD",
          url,
          availability: "https://schema.org/InStock" } },
      ...(faqs.length
        ? [
            {
              "@type": "FAQPage",
              "@id": `${url}#faq`,
              inLanguage: IN_LANGUAGE[locale],
              mainEntity: faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a } })) },
          ]
        : []),
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: t.breadcrumbHome, item: homeUrl },
          {
            "@type": "ListItem",
            position: 2,
            name: t.breadcrumbShuttles,
            item: localeUrl(locale, "/private-shuttle") },
          {
            "@type": "ListItem",
            position: 3,
            name: t.breadcrumbRoute(route.origen, route.destino),
            item: url },
        ] },
    ] };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

export default async function RoutePage({
  params }: {
  params: Params;
}) {
  const { slug } = await params;
  const locale = await localeFromParams(params);
  const t = ROUTE[locale];
  const [route, destinations, allRoutes] = await Promise.all([
    findRouteBySlug(slug),
    getDestinations(),
    getRoutes(),
  ]);
  if (!route) notFound();

  const airportPickup = isAirportOrigin(route.origen);

  // Destination guide + internal links, only on index-able pages. Guide copy
  // is picked in the page language (English wherever the Spanish column is
  // still empty) before it reaches the guide section or the JSON-LD.
  const indexable = isRouteIndexable(route, destinations);
  const localize = (d: Destination | undefined) =>
    d ? localizeDestination(d, locale) : undefined;
  const destination = localize(destinationFor(route.destino, destinations));
  const origin = localize(destinationFor(route.origen, destinations));
  const showGuide = indexable && hasGuide(destination);
  const reverseSlug = routeSlug(route.destino, route.origen);
  const reverse = showGuide
    ? allRoutes.find(
        (r) =>
          routeSlug(r.origen, r.destino) === reverseSlug &&
          isRouteIndexable(r, destinations)
      )
    : undefined;
  const faqs = indexable
    ? buildRouteFaqs(route, { origin, destination }, locale)
    : [];
  const related = showGuide
    ? selectIndexableRoutes(
        allRoutes.filter(
          (r) =>
            r.id !== route.id &&
            r.id !== reverse?.id &&
            (r.origen === route.origen || r.destino === route.destino)
        ),
        destinations
      ).slice(0, 8)
    : [];
  const baseTier = VEHICLE_TIERS[0];
  const startingPrice = route.precio1a5;

  return (
    <main className="bg-light-surface min-h-screen">
      <RouteJsonLd
        route={route}
        slug={slug}
        airportPickup={airportPickup}
        origin={showGuide ? origin : undefined}
        destination={showGuide ? destination : undefined}
        faqs={faqs}
        locale={locale}
      />
      {/* ─── NAV ─── */}
      <SiteNav transparent />

      {/* ─── HERO / Route header ─── */}
      <section className="relative flex min-h-[52vh] items-center overflow-hidden">
        <Image
          src={HERO_URL}
          alt={t.hero.imageAlt}
          fill
          className="object-cover"
          sizes="100vw"
          preload
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-light-surface via-transparent to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            {t.hero.badge(route.duracion)}
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
                  {t.hero.startingFrom}
                </span>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="bg-gradient-to-r from-sunset-gold via-sunset-orange to-sunset-red bg-clip-text text-5xl font-extrabold tracking-tight text-transparent drop-shadow-sm sm:text-6xl">
                    {`$${startingPrice}`}
                  </span>
                  <span className="text-sm font-semibold text-white/80">
                    USD
                  </span>
                </div>
                <span className="mt-1.5 text-[0.7rem] text-white/60">
                  {t.hero.perVehicle(baseTier.minPax, baseTier.maxPax)}
                </span>
              </div>
              <div className="h-16 w-px bg-white/20" />
              <div className="flex flex-col items-start gap-1.5 text-left">
                {t.hero.perks.map((item) => (
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
                ))}
              </div>
            </div>
          </div>

          {/* Continue CTA — smooth-scrolls to booking form */}
          <div className="mt-8 flex flex-col items-center gap-2">
            <a
              href="#booking"
              className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-sunset-red via-sunset-orange to-sunset-gold px-10 py-4 text-base font-bold text-white shadow-lg shadow-sunset-orange/25 transition hover:shadow-xl hover:shadow-sunset-orange/40 hover:scale-[1.02]"
            >
              {t.hero.continueCta}
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
            <p className="text-xs text-white/60">{t.hero.continueHint}</p>
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
                  {t.info.travelTimeLabel}
                </div>
                <div className="text-sm font-bold text-foreground">
                  {route.duracion || t.info.travelTimeFallback}
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
                  {t.info.privateServiceLabel}
                </div>
                <div className="text-sm font-bold text-foreground">
                  {t.info.privateServiceValue(MAX_PAX)}
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
                  {t.info.includedLabel}
                </div>
                <div className="text-sm font-bold text-foreground">
                  {t.info.includedValue}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-black/5 pt-6">
            <p className="text-sm leading-relaxed text-foreground/70">
              {t.info.summary.before}
              <strong className="text-foreground">{route.origen}</strong>
              {t.info.summary.between}
              <strong className="text-foreground">{route.destino}</strong>
              {t.info.summary.after}
              {airportPickup ? t.info.summary.airport : ""}
            </p>
          </div>
        </div>
      </section>

      {/* ─── Booking form ─── */}
      <section id="booking" className="mx-auto max-w-5xl px-6 py-16 scroll-mt-24">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-sunset-orange/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sunset-orange">
            {t.booking.step}
          </div>
          <h2 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl">
            {t.booking.title}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-foreground/60">
            {t.booking.intro}
          </p>
        </div>
        <BookingSection route={route} isAirportPickup={airportPickup} />
      </section>

      {/* ─── Destination guide — after the booking form, collapsed by default
          so it never interrupts the booking flow; the copy stays in the HTML
          for search engines and AI assistants. ─── */}
      {showGuide && destination ? (
        <DestinationGuide
          route={route}
          origin={origin}
          destination={destination}
          related={related}
          reverse={reverse}
          locale={locale}
        />
      ) : null}

      <RouteFaqSection
        faqs={faqs}
        originName={origin?.short_name ?? route.origen}
        destinationName={destination?.short_name ?? route.destino}
        locale={locale}
      />

      {/* ─── FOOTER ─── */}
      <SiteFooter locale={locale} />
    </main>
  );
}
