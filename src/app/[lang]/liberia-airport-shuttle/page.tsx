import Image from "next/image";
import type { Metadata } from "next";
import { marked } from "marked";
import Link from "@/components/LocaleLink";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import GoogleReviewBadge from "@/components/GoogleReviewBadge";
import HubRoutePicker from "@/components/HubRoutePicker";
import RouteCards from "@/components/RouteCards";
import { getRoutes, type Route } from "@/lib/routes";
import {
  destinationFor,
  getDestinations,
  localizeDestination,
  routeSeoRank,
  selectIndexableRoutes,
  type DestinationMap,
} from "@/lib/destinations";
import {
  LIR_HUB_PATH,
  lowestPrice,
  pairRoutesForPriceList,
  popularAirportRoutes,
  priceRange,
  routePrices,
  travelTime,
  type RoutePair,
} from "@/lib/pricing";
import { VEHICLE_TIERS, vehicleTierCopy } from "@/lib/vehicles";
import { buildDestinationHubs } from "@/lib/destinationHubs";
import { pickerRoutes } from "@/lib/hubPicker";
import { routeSlug, toSlug } from "@/lib/slug";
import { WHATSAPP_DISPLAY, WHATSAPP_URL, withCurrentContact } from "@/lib/contact";
import {
  BASE_URL,
  IN_LANGUAGE,
  OG_LOCALE,
  localeAlternates,
  localeFromParams,
  localeUrl,
  type Locale,
} from "@/lib/i18n";
import { LIBERIA_AIRPORT } from "@/i18n/liberiaAirport";
import { PRICES } from "@/i18n/prices";

/**
 * The Liberia Airport (LIR) hub: everything a traveller landing at or
 * leaving from Daniel Oduber Quirós needs on one URL. Ruta Pacifico is
 * based in Liberia, so this is the page that should rank for "Liberia
 * airport shuttle", "LIR transfer", "Liberia airport to Tamarindo" and the
 * rest of the airport queries. Every figure (prices, drive times, counts)
 * is read live from the shared `routes` table; only the prose is authored.
 */

type Params = Promise<{ lang: string }>;

const HERO_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/aeropuerto-LIR-guanacaste.webp";

const LIR = /\bLIR\b/;
const SJO = /\bSJO\b/;
const LIR_ORIGIN_NAME = "LIR - Liberia Int. Airport";

/** Departures answered one by one in the "Quick answers" block. */
const QUICK_ANSWERS = 8;

/** Routes declared in the ItemList JSON-LD (the table carries all of them). */
const JSON_LD_ROUTES = 40;

/** Destinations compared from both airports in the LIR vs SJO table. */
const COMPARE_SLUGS = [
  "tamarindo-guanacaste",
  "flamingo-guanacaste",
  "papagayo-peninsula-guanacaste",
  "playas-del-coco-guanacaste",
  "nosara-playa-guiones-area",
  "samara-playa-carrillo-guanacaste",
  "la-fortuna-arenal",
  "monteverde-cloud-forest",
  "manuel-antonio-quepos",
];

/** Routes change rarely; regenerate daily, /api/revalidate publishes sooner. */
export const revalidate = 86400;

function routeFromAirport(routes: Route[], airport: RegExp, destinationSlug: string): Route | undefined {
  return routes.find((r) => airport.test(r.origen) && toSlug(r.destino) === destinationSlug);
}

/** The short name the destination guide uses ("Tamarindo"), or the raw table value. */
function shortName(place: string, map: DestinationMap): string {
  return destinationFor(place, map)?.short_name ?? place;
}

const PROSE =
  "text-sm leading-relaxed text-foreground/75 [&_p]:mb-4 [&_p:last-child]:mb-0 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_ul:last-child]:mb-0 [&_strong]:font-semibold [&_strong]:text-foreground";

function md(src: string): string {
  return marked.parse(withCurrentContact(src), { async: false }) as string;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = LIBERIA_AIRPORT[locale];
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    keywords: t.keywords,
    alternates: localeAlternates(LIR_HUB_PATH, locale),
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale],
      url: localeUrl(locale, LIR_HUB_PATH),
      title: t.ogTitle,
      description: t.ogDescription,
      images: [{ url: HERO_URL, width: 1200, height: 630, alt: t.heroAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: t.ogTitle,
      description: t.ogDescription,
      images: [HERO_URL],
    },
  };
}

function LirHubJsonLd({ routes, locale }: { routes: Route[]; locale: Locale }) {
  const t = LIBERIA_AIRPORT[locale];
  const j = t.jsonLd;
  const pageUrl = localeUrl(locale, LIR_HUB_PATH);
  const top = routes.slice(0, JSON_LD_ROUTES);
  const range = priceRange(routes);
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#page`,
        url: pageUrl,
        name: j.pageName,
        description: j.pageDescription,
        isPartOf: { "@id": `${BASE_URL}/#website` },
        about: { "@id": `${pageUrl}#airport` },
        inLanguage: IN_LANGUAGE[locale],
        primaryImageOfPage: HERO_URL,
      },
      {
        "@type": "Airport",
        "@id": `${pageUrl}#airport`,
        name: "Daniel Oduber Quirós International Airport",
        alternateName: "Liberia Airport",
        iataCode: "LIR",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Liberia",
          addressRegion: "Guanacaste",
          addressCountry: "CR",
        },
      },
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        serviceType: "Airport shuttle",
        name: j.serviceName,
        description: j.pageDescription,
        url: pageUrl,
        provider: { "@id": `${BASE_URL}/#organization` },
        areaServed: [
          { "@type": "AdministrativeArea", name: "Guanacaste, Costa Rica" },
          { "@type": "Country", name: "Costa Rica" },
        ],
        availableChannel: {
          "@type": "ServiceChannel",
          serviceUrl: localeUrl(locale, "/private-shuttle"),
          availableLanguage: ["en", "es"],
        },
        ...(range
          ? {
              offers: {
                "@type": "AggregateOffer",
                priceCurrency: "USD",
                lowPrice: range.low,
                highPrice: range.high,
                offerCount: routes.length,
                availability: "https://schema.org/InStock",
                url: pageUrl,
              },
            }
          : {}),
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#routes`,
        name: j.listName,
        numberOfItems: top.length,
        itemListElement: top.map((r, idx) => {
          const url = localeUrl(locale, `/private-shuttle/${routeSlug(r.origen, r.destino)}`);
          const prices = routePrices(r);
          return {
            "@type": "ListItem",
            position: idx + 1,
            name: j.routeName(r.origen, r.destino),
            url,
            ...(prices.length
              ? {
                  item: {
                    "@type": ["Service", "Product"],
                    "@id": `${url}#service`,
                    name: j.itemName(r.origen, r.destino),
                    url,
                    offers: {
                      "@type": "AggregateOffer",
                      priceCurrency: "USD",
                      lowPrice: prices[0].price,
                      highPrice: prices[prices.length - 1].price,
                      offerCount: prices.length,
                      availability: "https://schema.org/InStock",
                      url,
                    },
                  },
                }
              : {}),
          };
        }),
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: t.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: j.home, item: localeUrl(locale, "/") },
          { "@type": "ListItem", position: 2, name: j.hub, item: pageUrl },
        ],
      },
    ],
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
  );
}

function PriceCell({ route, field, onRequest }: {
  route: Route;
  field: (typeof VEHICLE_TIERS)[number]["priceField"];
  onRequest: string;
}) {
  const price = route[field];
  if (typeof price === "number" && price > 0) {
    return <span className="font-bold text-foreground">{`$${price}`}</span>;
  }
  return <span className="text-xs text-foreground/40">{onRequest}</span>;
}

function PairRow({ pair, locale, map }: { pair: RoutePair; locale: Locale; map: DestinationMap }) {
  const t = PRICES[locale].table;
  const { out, back } = pair;
  const href = `/private-shuttle/${routeSlug(out.origen, out.destino)}`;
  const backHref = back ? `/private-shuttle/${routeSlug(back.origen, back.destino)}` : null;
  return (
    <>
      <tr className="transition hover:bg-sunset-orange/5">
        <th scope="row" className="px-4 py-3 font-medium text-foreground">
          <Link href={href} className="hover:text-sunset-orange">
            <span className="text-foreground/50">LIR</span>
            <span className="mx-1.5 text-foreground/30">{back ? "→" : "↔"}</span>
            {shortName(out.destino, map)}
          </Link>
        </th>
        <td className="whitespace-nowrap px-4 py-3 text-foreground/70">{travelTime(out, locale)}</td>
        {VEHICLE_TIERS.map((tier) => (
          <td key={tier.key} className="whitespace-nowrap px-4 py-3 text-right">
            <PriceCell route={out} field={tier.priceField} onRequest={t.onRequest} />
          </td>
        ))}
        <td className="px-4 py-3 text-right">
          <Link
            href={href}
            className="inline-flex items-center rounded-full bg-foreground px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-sunset-orange"
          >
            {t.book}
          </Link>
        </td>
      </tr>
      {back && backHref ? (
        <tr className="bg-light-surface/60 transition hover:bg-sunset-orange/5">
          <th scope="row" className="px-4 py-2 pl-8 text-xs font-medium text-foreground/70">
            <Link href={backHref} className="hover:text-sunset-orange">
              {t.returnLabel}: {shortName(back.origen, map)}
              <span className="mx-1.5 text-foreground/30">→</span>
              LIR
            </Link>
          </th>
          <td className="whitespace-nowrap px-4 py-2 text-xs text-foreground/60">{travelTime(back, locale)}</td>
          {VEHICLE_TIERS.map((tier) => (
            <td key={tier.key} className="whitespace-nowrap px-4 py-2 text-right text-xs">
              <PriceCell route={back} field={tier.priceField} onRequest={t.onRequest} />
            </td>
          ))}
          <td className="px-4 py-2 text-right">
            <Link href={backHref} className="text-xs font-semibold text-foreground/60 hover:text-sunset-orange">
              {t.book}
            </Link>
          </td>
        </tr>
      ) : null}
    </>
  );
}

function ArrowIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0 text-sunset-orange transition-transform group-open:rotate-180"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

/**
 * A folded section: the heading is the clickable summary, the content stays
 * in the HTML (crawlers read it; the FAQPage JSON-LD still matches) and
 * opens on tap. Closed by default so the page reads as routes and prices
 * first, text second.
 */
function Fold({ id, heading, children }: { id: string; heading: string; children: React.ReactNode }) {
  return (
    <details id={id} className="group scroll-mt-24 rounded-2xl border border-black/5 bg-white shadow-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 sm:px-6 [&::-webkit-details-marker]:hidden">
        <h2 className="text-base font-bold text-foreground sm:text-lg">{heading}</h2>
        <ChevronIcon />
      </summary>
      <div className="border-t border-black/5 px-5 py-5 sm:px-6">{children}</div>
    </details>
  );
}

export default async function LiberiaAirportPage({ params }: { params: Params }) {
  const locale = await localeFromParams(params);
  const t = LIBERIA_AIRPORT[locale];
  const tp = PRICES[locale].table;
  const [routes, destinations] = await Promise.all([getRoutes(), getDestinations()]);

  // Every priced, index-able route that touches LIR, most important first.
  const lirRoutes = selectIndexableRoutes(routes, destinations).filter(
    (r) => lowestPrice(r) && (LIR.test(r.origen) || LIR.test(r.destino)),
  );
  const range = priceRange(lirRoutes.filter((r) => LIR.test(r.origen)));
  const quick = popularAirportRoutes(routes, destinations, QUICK_ANSWERS);
  const pairs = pairRoutesForPriceList(routes, { indexableOnly: true, destinations, locale }).find(
    (g) => g.key === "lir",
  )?.pairs ?? [];

  const compare = COMPARE_SLUGS.map((slug) => ({
    slug,
    lir: routeFromAirport(routes, LIR, slug),
    sjo: routeFromAirport(routes, SJO, slug),
  })).filter((row) => row.lir || row.sjo);

  // Destination hubs, for the "every shuttle to/from X" links under the grid.
  const hubs = buildDestinationHubs(routes, destinations);

  const lirGuideRaw = destinationFor(LIR_ORIGIN_NAME, destinations);
  const lirGuide = lirGuideRaw ? localizeDestination(lirGuideRaw, locale) : undefined;
  const arrivalHtml = lirGuide?.arrival_md?.trim() ? md(lirGuide.arrival_md) : "";
  const tipsHtml = lirGuide?.tips_md?.trim() ? md(lirGuide.tips_md) : "";

  // Keep the JSON-LD ordered like the page: airport pickups first.
  const jsonLdRoutes = [...lirRoutes].sort(
    (a, b) => routeSeoRank(a, destinations) - routeSeoRank(b, destinations) ||
      (lowestPrice(a) ?? Infinity) - (lowestPrice(b) ?? Infinity),
  );

  const routeHref = (r: Route) => `/private-shuttle/${routeSlug(r.origen, r.destino)}`;

  // The picker: EVERY priced LIR departure and arrival, index-able or not
  // (it is a booking tool, not the SEO table), opened on the most-booked
  // airport pickup. One widget replaces the old destination grid, quick
  // answer list and phone bar, which all repeated the table's figures.
  const pricedLir = routes.filter((r) => lowestPrice(r) && r.origen !== r.destino);
  const picker = pickerRoutes(
    pricedLir.filter((r) => LIR.test(r.origen)),
    pricedLir.filter((r) => LIR.test(r.destino)),
    destinations,
    locale,
  );
  const pickerDefault = quick[0] ?? lirRoutes[0] ?? pricedLir[0];

  return (
    <main className="min-h-screen bg-light-surface pb-28 lg:pb-0">
      <LirHubJsonLd routes={jsonLdRoutes} locale={locale} />
      <SiteNav transparent />

      {/* ─── HERO: compact, the answer in one line ─── */}
      <section className="relative flex min-h-[42vh] items-end overflow-hidden sm:min-h-[52vh] sm:items-center">
        <Image src={HERO_URL} alt={t.heroAlt} fill className="object-cover" sizes="100vw" preload />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-light-surface via-transparent to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-4xl px-5 pb-10 pt-24 text-center sm:px-6 sm:pb-20 sm:pt-28">
          <span className="inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-sunset-gold backdrop-blur-sm sm:px-4 sm:py-1.5 sm:text-xs">
            {t.hero.eyebrow}
          </span>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white sm:mt-5 sm:text-5xl lg:text-6xl">
            {t.hero.titleLead}{" "}
            <span className="bg-gradient-to-r from-sunset-gold via-sunset-orange to-sunset-red bg-clip-text text-transparent">
              {t.hero.titleAccent}
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold text-white sm:mt-5 sm:text-lg">
            {range ? t.hero.dataLine(lirRoutes.length, range.low) : t.hero.dataLineFallback}
          </p>
          {/* Desktop only: phones get the sticky bar instead. */}
          <div className="mt-8 hidden flex-wrap items-center justify-center gap-3 sm:flex">
            <Link
              href="#book"
              className="inline-flex items-center gap-2 rounded-full bg-sunset-orange px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-sunset-red"
            >
              {t.hero.book}
              <ArrowIcon />
            </Link>
            <a
              href={WHATSAPP_URL}
              className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              {t.hero.whatsapp}
            </a>
          </div>
        </div>
      </section>

      {/* ─── PICK & BOOK: LIR on one side, every other end on the wheel ─── */}
      {picker.length > 0 && pickerDefault && (
        <section id="book" className="scroll-mt-24 pt-4 sm:pt-6">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <HubRoutePicker place="LIR" routes={picker} defaultId={pickerDefault.id} allRoutesHref="#all-routes" />
          </div>
        </section>
      )}

      {/* ─── FULL TABLE: every pair that touches LIR ─── */}
      <section id="all-routes" aria-labelledby="lir-table" className="scroll-mt-24 pt-4 pb-6 sm:pt-6 md:py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="rounded-3xl border border-black/5 bg-white shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4 px-5 py-5 sm:px-8 sm:py-6">
              <div className="min-w-0">
                <h2 id="lir-table" className="text-xl font-bold text-foreground sm:text-2xl">{t.table.heading}</h2>
                <p className="mt-1 hidden text-sm text-foreground/60 md:block">{t.table.body}</p>
              </div>
              {pairs.length > 0 && (
                <span className="rounded-full bg-light-surface px-3 py-1 text-xs font-semibold text-foreground/60">
                  {t.table.count(pairs.length)}
                </span>
              )}
            </div>
            {pairs.length > 0 ? (
              <>
                {/* Phones: one card per destination, return leg underneath. */}
                <RouteCards
                  className="border-t border-black/5 md:hidden"
                  locale={locale}
                  book={tp.book}
                  onRequest={tp.onRequest}
                  items={pairs.map((pair) => ({
                    key: pair.out.id,
                    href: routeHref(pair.out),
                    from: "LIR",
                    to: shortName(pair.out.destino, destinations),
                    highlight: "to",
                    route: pair.out,
                    sub: pair.back
                      ? {
                          href: routeHref(pair.back),
                          label: `${tp.returnLabel}: ${shortName(pair.back.origen, destinations)} → LIR`,
                          price: lowestPrice(pair.back),
                        }
                      : undefined,
                  }))}
                />
                {/* md+: the full table with every van size. */}
                <div className="relative hidden overflow-x-auto border-t border-black/5 md:block">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <caption className="sr-only">{tp.caption(t.table.heading)}</caption>
                    <thead className="bg-light-surface text-xs uppercase tracking-wider text-foreground/50">
                      <tr>
                        <th scope="col" className="px-4 py-3 font-semibold">{tp.route}</th>
                        <th scope="col" className="px-4 py-3 font-semibold">{tp.travelTime}</th>
                        {VEHICLE_TIERS.map((tier) => (
                          <th key={tier.key} scope="col" className="whitespace-nowrap px-4 py-3 text-right font-semibold">
                            {tp.pax(tier.minPax, tier.maxPax)}
                          </th>
                        ))}
                        <th scope="col" className="px-4 py-3 font-semibold">
                          <span className="sr-only">{tp.bookColumn}</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      {pairs.map((pair) => (
                        <PairRow key={pair.out.id} pair={pair} locale={locale} map={destinations} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <p className="border-t border-black/5 px-6 py-6 text-sm text-foreground/70 sm:px-8">{t.table.unavailable}</p>
            )}
          </div>
        </div>
      </section>

      {/* ─── DESTINATION HUBS: one link per destination page, no figures
           (the table above already has every price) ─── */}
      {hubs.length > 0 && (
        <nav aria-label={t.destinations.hubsLabel} className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 sm:pb-12">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-foreground/50">{t.destinations.hubsLabel}</p>
          <ul className="mt-3 flex flex-wrap justify-center gap-2">
            {hubs.map((h) => (
              <li key={h.slug}>
                <Link
                  href={h.path}
                  className="inline-flex items-center rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-xs font-semibold text-foreground/70 transition hover:border-sunset-orange hover:text-sunset-orange"
                >
                  {localizeDestination(h.destination, locale).short_name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* ─── Everything else, folded: why, arrival, airports, vehicles, FAQ ─── */}
      <section className="mx-auto max-w-4xl space-y-3 px-4 pb-8 sm:px-6 sm:pb-12">
        {quick.length > 0 && (
          <Fold id="quick-answers" heading={t.quick.heading}>
            <p className="text-sm text-foreground/60">{t.quick.body}</p>
            <ul className="mt-4 divide-y divide-black/5">
              {quick.map((r) => {
                const price = lowestPrice(r);
                if (!price) return null;
                return (
                  <li key={r.id} className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-foreground">
                      {t.quick.answer(shortName(r.destino, destinations), price, travelTime(r, locale))}
                    </p>
                    <Link href={routeHref(r)} className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-sunset-orange hover:text-sunset-red">
                      {t.quick.book}
                      <ArrowIcon />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Fold>
        )}

        <Fold id="lir-why" heading={t.fold.why}>
          <div className="grid gap-4 sm:grid-cols-2">
            {t.why.items.map((item, i) => (
              <div key={item.title} className="rounded-2xl border border-black/5 bg-light-surface p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sunset-orange/10 text-sm font-bold text-sunset-orange">
                    {i + 1}
                  </span>
                  <h3 className="text-base font-bold text-foreground">{item.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-foreground/70">{item.body}</p>
              </div>
            ))}
          </div>
        </Fold>

        <Fold id="lir-arrival" heading={t.fold.arrival}>
          <ol className="grid gap-4 md:grid-cols-3">
            {t.arrival.steps.map((step, i) => (
              <li key={step.title} className="rounded-2xl border border-black/5 bg-light-surface p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sunset-orange text-sm font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-3 text-base font-bold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/70">{step.body}</p>
              </li>
            ))}
          </ol>
          {(arrivalHtml || tipsHtml) && (
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {arrivalHtml && (
                <div>
                  <h3 className="text-base font-bold text-foreground">{t.arrival.guideHeading}</h3>
                  <div className={`mt-3 ${PROSE}`} dangerouslySetInnerHTML={{ __html: arrivalHtml }} />
                </div>
              )}
              {tipsHtml && (
                <div>
                  <h3 className="text-base font-bold text-foreground">{t.arrival.tipsHeading}</h3>
                  <div className={`mt-3 ${PROSE}`} dangerouslySetInnerHTML={{ __html: tipsHtml }} />
                </div>
              )}
            </div>
          )}
        </Fold>

        {compare.length > 0 && (
          <Fold id="airports-compared" heading={t.fold.airports}>
            <p className="text-sm leading-relaxed text-foreground/70">{t.airports.body}</p>
            <div className="relative mt-5 overflow-x-auto rounded-2xl border border-black/5">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="bg-light-surface text-xs uppercase tracking-wider text-foreground/50">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">{t.airports.destination}</th>
                    <th scope="col" className="px-4 py-3 font-semibold text-sunset-orange">{t.airports.fromLir}</th>
                    <th scope="col" className="px-4 py-3 font-semibold">{t.airports.fromSjo}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {compare.map((row) => {
                    const name = shortName((row.lir ?? row.sjo)!.destino, destinations);
                    const cell = (r: Route | undefined) => {
                      const price = r ? lowestPrice(r) : null;
                      if (!r || !price) return <span className="text-foreground/40">{t.airports.noRoute}</span>;
                      return (
                        <Link href={routeHref(r)} className="hover:text-sunset-orange">
                          <span className="font-bold text-foreground">${price}</span>
                          <span className="ml-2 text-foreground/60">{travelTime(r, locale)}</span>
                        </Link>
                      );
                    };
                    return (
                      <tr key={row.slug}>
                        <th scope="row" className="px-4 py-3 font-medium text-foreground">{name}</th>
                        <td className="whitespace-nowrap px-4 py-3">{cell(row.lir)}</td>
                        <td className="whitespace-nowrap px-4 py-3">{cell(row.sjo)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-foreground/70">{t.airports.verdict}</p>
          </Fold>
        )}

        <Fold id="lir-vehicles" heading={t.fold.vehicles}>
          <p className="text-sm text-foreground/60">{t.vehicles.body}</p>
          <ul className="mt-4 grid gap-4 sm:grid-cols-3">
            {VEHICLE_TIERS.map((tier) => {
              const copy = vehicleTierCopy(tier.key, locale);
              return (
                <li key={tier.key} className="overflow-hidden rounded-2xl border border-black/5 bg-light-surface">
                  <div className="relative aspect-[16/10] bg-white">
                    <Image src={tier.image} alt={tier.name} fill loading="lazy" className="object-contain p-4" sizes="(min-width: 640px) 33vw, 100vw" />
                  </div>
                  <div className="p-4">
                    <div className="text-xs font-semibold uppercase tracking-wider text-sunset-orange">
                      {t.vehicles.pax(tier.minPax, tier.maxPax)}
                    </div>
                    <h3 className="mt-1 text-base font-bold text-foreground">{tier.name}</h3>
                    <p className="mt-1 text-sm text-foreground/60">{copy.typicalUse}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Fold>

        {/* FAQ: plain HTML, mirrors the FAQPage JSON-LD word for word. */}
        <Fold id="lir-faq" heading={t.faqHeading}>
          <dl className="divide-y divide-black/5">
            {t.faqs.map((f) => (
              <div key={f.q} className="py-4 first:pt-0 last:pb-0">
                <dt className="text-base font-semibold text-foreground">{f.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-foreground/75">{f.a}</dd>
              </div>
            ))}
          </dl>
        </Fold>
      </section>

      {/* ─── CTA ─── */}
      <section className="mx-auto max-w-5xl px-4 pb-12 sm:px-6 sm:pb-16">
        <div className="rounded-3xl bg-foreground p-6 text-center text-white sm:p-12">
          <h2 className="text-2xl font-bold sm:text-3xl">{t.cta.heading}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/70 sm:text-base">{t.cta.body}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:mt-8">
            <Link
              href="#book"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-sunset-orange px-6 text-sm font-bold text-white transition hover:bg-sunset-red"
            >
              {t.cta.book}
              <ArrowIcon />
            </Link>
            <a
              href={WHATSAPP_URL}
              className="inline-flex h-12 items-center rounded-full border border-white/30 px-6 text-sm font-bold text-white transition hover:bg-white/10"
            >
              {t.cta.whatsapp} · {WHATSAPP_DISPLAY}
            </a>
          </div>
          <div className="mt-8 flex justify-center">
            <GoogleReviewBadge locale={locale} />
          </div>
        </div>
      </section>

      <SiteFooter locale={locale} />
    </main>
  );
}
