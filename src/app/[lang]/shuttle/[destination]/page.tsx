import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { marked } from "marked";
import Link from "@/components/LocaleLink";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import GoogleReviewBadge from "@/components/GoogleReviewBadge";
import HubRoutePicker from "@/components/HubRoutePicker";
import RouteCards from "@/components/RouteCards";
import { getRoutes, type Route } from "@/lib/routes";
import { destinationFor, getDestinations, localizeDestination, type DestinationMap } from "@/lib/destinations";
import {
  findDestinationHub,
  getDestinationHubs,
  plainParagraph,
  type DestinationHub,
} from "@/lib/destinationHubs";
import { pickerRoutes } from "@/lib/hubPicker";
import { LIR_HUB_PATH, PRICE_LIST_PATH, lowestPrice, routePrices, travelTime } from "@/lib/pricing";
import { VEHICLE_TIERS, vehicleTierCopy } from "@/lib/vehicles";
import { routeSlug, toSlug } from "@/lib/slug";
import { WHATSAPP_DISPLAY, WHATSAPP_URL, withCurrentContact } from "@/lib/contact";
import { isOptimizable } from "@/lib/images";
import {
  BASE_URL,
  IN_LANGUAGE,
  OG_LOCALE,
  localeAlternates,
  localeFromParams,
  localeUrl,
  type Locale,
} from "@/lib/i18n";
import { DESTINATION_HUB, type HubFacts } from "@/i18n/destinationHub";

/**
 * Destination hub: every priced shuttle from and to one destination, the
 * destination guide and the questions travellers ask before booking, on
 * the URL they search for ("Tamarindo shuttle"). Which destinations get
 * one is decided from data in src/lib/destinationHubs.ts.
 *
 * Public URL: /<destination-slug>-shuttle (Spanish: /es/<slug>-shuttle).
 * next.config.ts rewrites it here and redirects the internal path back,
 * so each hub has one address per language. Only the slugs returned by
 * generateStaticParams exist; everything else is a static 404.
 */
export const dynamicParams = false;

/** Routes change rarely; regenerate daily, /api/revalidate publishes sooner. */
export const revalidate = 86400;

type Params = Promise<{ lang: string; destination: string }>;

const FALLBACK_HERO =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/hero-ruta-pacifico.webp";

/** Routes declared in the ItemList JSON-LD (the tables carry all of them). */
const JSON_LD_ROUTES = 40;

const PROSE =
  "text-sm leading-relaxed text-foreground/75 [&_p]:mb-4 [&_p:last-child]:mb-0 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_ul:last-child]:mb-0 [&_strong]:font-semibold [&_strong]:text-foreground";

function md(src: string): string {
  return marked.parse(withCurrentContact(src), { async: false }) as string;
}

export async function generateStaticParams(): Promise<{ destination: string }[]> {
  const hubs = await getDestinationHubs();
  if (hubs.length === 0) {
    // With dynamicParams off, an empty list would 404 every hub. Fail the
    // build instead (a table came back empty); Vercel keeps the previous
    // deployment live. Same rule as the route pages.
    throw new Error("generateStaticParams: no destination hubs (routes or destinations table empty)");
  }
  return hubs.map((h) => ({ destination: h.slug }));
}

/** The figures the copy is written around. */
function hubFacts(hub: DestinationHub, locale: Locale): HubFacts {
  const d = localizeDestination(hub.destination, locale);
  return {
    name: d.short_name,
    region: d.region,
    lirPrice: hub.lirRoute ? lowestPrice(hub.lirRoute) : null,
    lirTime: hub.lirRoute?.duracion ? travelTime(hub.lirRoute, locale) : null,
    lowest: hub.range?.low ?? null,
    fromCount: hub.from.length,
    toCount: hub.to.length,
    nearby: hub.related.slice(0, 4).map((r) => localizeDestination(r.destination, locale).short_name),
  };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { destination } = await params;
  const locale = await localeFromParams(params);
  const hub = await findDestinationHub(destination);
  if (!hub) return {};
  const t = DESTINATION_HUB[locale];
  const d = localizeDestination(hub.destination, locale);
  const facts = hubFacts(hub, locale);
  const title = t.metaTitle(d.short_name, facts.lirPrice ?? facts.lowest);
  const description = t.metaDescription(facts);
  const image = d.image_url || FALLBACK_HERO;
  return {
    title,
    description,
    keywords: t.keywords(d.short_name),
    alternates: localeAlternates(hub.path, locale),
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale],
      url: localeUrl(locale, hub.path),
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: d.image_alt ?? t.heroAltFallback(d.short_name) }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

function shortName(place: string, map: DestinationMap): string {
  return destinationFor(place, map)?.short_name ?? place;
}

function HubJsonLd({
  hub,
  locale,
  facts,
  faqs,
  image,
}: {
  hub: DestinationHub;
  locale: Locale;
  facts: HubFacts;
  faqs: { q: string; a: string }[];
  image: string;
}) {
  const t = DESTINATION_HUB[locale];
  const j = t.jsonLd;
  const d = localizeDestination(hub.destination, locale);
  const pageUrl = localeUrl(locale, hub.path);
  const routes = [...hub.to, ...hub.from].slice(0, JSON_LD_ROUTES);
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#page`,
        url: pageUrl,
        name: j.pageName(d.short_name),
        description: t.metaDescription(facts),
        isPartOf: { "@id": `${BASE_URL}/#website` },
        about: { "@id": `${pageUrl}#place` },
        mainEntity: { "@id": `${pageUrl}#service` },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
        inLanguage: IN_LANGUAGE[locale],
        primaryImageOfPage: image,
        ...(hub.updatedAt ? { dateModified: hub.updatedAt } : {}),
      },
      {
        "@type": ["Place", "TouristDestination"],
        "@id": `${pageUrl}#place`,
        name: d.short_name,
        alternateName: d.name,
        description: plainParagraph(d.intro_md),
        image,
        containedInPlace: {
          "@type": "AdministrativeArea",
          name: d.region,
          containedInPlace: { "@type": "Country", name: "Costa Rica" },
        },
        ...(d.best_for.length ? { touristType: d.best_for } : {}),
      },
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        serviceType: "Private shuttle",
        name: j.serviceName(d.short_name),
        description: t.metaDescription(facts),
        url: pageUrl,
        provider: { "@id": `${BASE_URL}/#organization` },
        areaServed: [{ "@id": `${pageUrl}#place` }, { "@type": "Country", name: "Costa Rica" }],
        availableChannel: {
          "@type": "ServiceChannel",
          serviceUrl: localeUrl(locale, "/private-shuttle"),
          availableLanguage: ["en", "es"],
        },
        ...(hub.range
          ? {
              offers: {
                "@type": "AggregateOffer",
                priceCurrency: "USD",
                lowPrice: hub.range.low,
                highPrice: hub.range.high,
                offerCount: hub.to.length + hub.from.length,
                availability: "https://schema.org/InStock",
                url: pageUrl,
              },
            }
          : {}),
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#routes`,
        name: j.listName(d.short_name),
        numberOfItems: routes.length,
        itemListElement: routes.map((r, idx) => {
          const url = localeUrl(locale, `/private-shuttle/${routeSlug(r.origen, r.destino)}`);
          const prices = routePrices(r);
          return {
            "@type": "ListItem",
            position: idx + 1,
            name: j.routeName(r.origen, r.destino),
            url,
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
          };
        }),
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        inLanguage: IN_LANGUAGE[locale],
        mainEntity: faqs.map((f) => ({
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
          { "@type": "ListItem", position: 2, name: j.hub(d.short_name), item: pageUrl },
        ],
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />;
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

function RouteTable({
  id,
  heading,
  body,
  routes,
  locale,
  map,
  /** Which end of the route the table is about, so the other end is the label. */
  show,
}: {
  id: string;
  heading: string;
  body: string;
  routes: Route[];
  locale: Locale;
  map: DestinationMap;
  show: "origen" | "destino";
}) {
  const t = DESTINATION_HUB[locale].table;
  if (routes.length === 0) return null;
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-24 py-6 md:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-3xl border border-black/5 bg-white shadow-sm">
          <div className="px-5 py-5 sm:px-8 sm:py-6">
            <h2 id={`${id}-heading`} className="text-xl font-bold text-foreground sm:text-2xl">{heading}</h2>
            <p className="mt-1 hidden text-sm text-foreground/60 md:block">{body}</p>
          </div>

          {/* Phones: one card per route, price and Book button first. */}
          <RouteCards
            className="border-t border-black/5 md:hidden"
            locale={locale}
            book={t.book}
            onRequest={t.onRequest}
            items={routes.map((r) => ({
              key: r.id,
              href: `/private-shuttle/${routeSlug(r.origen, r.destino)}`,
              from: shortName(r.origen, map),
              to: shortName(r.destino, map),
              highlight: show === "origen" ? "from" : "to",
              route: r,
            }))}
          />

          {/* md+: the full table with every van size. */}
          <div className="relative hidden overflow-x-auto border-t border-black/5 md:block">
            <table className="w-full min-w-[640px] text-left text-sm">
              <caption className="sr-only">{t.caption(heading)}</caption>
              <thead className="bg-light-surface text-xs uppercase tracking-wider text-foreground/50">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">{t.route}</th>
                  <th scope="col" className="px-4 py-3 font-semibold">{t.travelTime}</th>
                  {VEHICLE_TIERS.map((tier) => (
                    <th key={tier.key} scope="col" className="whitespace-nowrap px-4 py-3 text-right font-semibold">
                      {t.pax(tier.minPax, tier.maxPax)}
                    </th>
                  ))}
                  <th scope="col" className="px-4 py-3 font-semibold"><span className="sr-only">{t.bookColumn}</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {routes.map((r) => {
                  const href = `/private-shuttle/${routeSlug(r.origen, r.destino)}`;
                  const other = show === "origen" ? r.origen : r.destino;
                  return (
                    <tr key={r.id} className="transition hover:bg-sunset-orange/5">
                      <th scope="row" className="px-4 py-3 font-medium text-foreground">
                        <Link href={href} className="hover:text-sunset-orange">
                          {show === "origen" ? (
                            <>
                              {shortName(other, map)}
                              <span className="mx-1.5 text-foreground/30">→</span>
                              <span className="text-foreground/50">{shortName(r.destino, map)}</span>
                            </>
                          ) : (
                            <>
                              <span className="text-foreground/50">{shortName(r.origen, map)}</span>
                              <span className="mx-1.5 text-foreground/30">→</span>
                              {shortName(other, map)}
                            </>
                          )}
                        </Link>
                      </th>
                      <td className="whitespace-nowrap px-4 py-3 text-foreground/70">{travelTime(r, locale)}</td>
                      {VEHICLE_TIERS.map((tier) => (
                        <td key={tier.key} className="whitespace-nowrap px-4 py-3 text-right">
                          <PriceCell route={r} field={tier.priceField} onRequest={t.onRequest} />
                        </td>
                      ))}
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={href}
                          className="inline-flex items-center rounded-full bg-sunset-orange px-4 py-2 text-xs font-bold text-white transition hover:bg-sunset-red"
                        >
                          {t.book}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
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

/** First `n` sentences of a plain-text paragraph. */
function firstSentences(text: string, n: number): string {
  const parts = text.match(/[^.!?]+[.!?]+(\s|$)/g);
  if (!parts) return text;
  return parts.slice(0, n).join("").trim();
}

/**
 * A folded section: the heading is the clickable summary, the content stays
 * in the HTML (crawlers read it; the FAQPage JSON-LD still matches) and
 * opens on tap. Closed by default on every screen so the page reads as
 * routes and prices first, text second.
 */
function Fold({ id, heading, children, tone = "white" }: {
  id: string;
  heading: string;
  children: React.ReactNode;
  tone?: "white" | "surface";
}) {
  return (
    <details id={id} className={`group scroll-mt-24 rounded-2xl border border-black/5 shadow-sm ${tone === "white" ? "bg-white" : "bg-light-surface"}`}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 sm:px-6 [&::-webkit-details-marker]:hidden">
        <h2 className="text-base font-bold text-foreground sm:text-lg">{heading}</h2>
        <ChevronIcon />
      </summary>
      <div className="border-t border-black/5 px-5 py-5 sm:px-6">{children}</div>
    </details>
  );
}

export default async function DestinationHubPage({ params }: { params: Params }) {
  const { destination: slug } = await params;
  const locale = await localeFromParams(params);
  const [hub, destinations, allRoutes] = await Promise.all([
    findDestinationHub(slug),
    getDestinations(),
    getRoutes(),
  ]);
  if (!hub) notFound();

  const t = DESTINATION_HUB[locale];
  const d = localizeDestination(hub.destination, locale);
  const name = d.short_name;
  const facts = hubFacts(hub, locale);
  const faqs = t.faqs(facts);
  const heroUrl = d.image_url || FALLBACK_HERO;
  const heroAlt = d.image_alt ?? t.heroAltFallback(name);
  const introHtml = md(d.intro_md);
  const arrivalHtml = d.arrival_md?.trim() ? md(d.arrival_md) : "";
  const tipsHtml = d.tips_md?.trim() ? md(d.tips_md) : "";
  const shortIntro = firstSentences(plainParagraph(d.intro_md), 2);
  // The picker is a booking tool, so it lists EVERY priced route touching
  // the place, not only the index-able ones the tables show (a route left
  // out of the tables for SEO reasons still has a page and can be booked).
  // It opens on the airport pickup, or the top arrival when that is not sold.
  const placeSlug = hub.destination.slug;
  const priced = allRoutes.filter((r) => lowestPrice(r) && r.origen !== r.destino);
  const bookableFrom = priced.filter((r) => toSlug(r.origen) === placeSlug);
  const bookableTo = priced.filter((r) => toSlug(r.destino) === placeSlug);
  const picker = pickerRoutes(bookableFrom, bookableTo, destinations, locale);
  const pickerDefault = hub.lirRoute ?? hub.to[0] ?? hub.from[0] ?? bookableTo[0] ?? bookableFrom[0];

  return (
    <main className="min-h-screen bg-light-surface pb-28 lg:pb-0">
      <HubJsonLd hub={hub} locale={locale} facts={facts} faqs={faqs} image={heroUrl} />
      <SiteNav transparent />

      {/* ─── HERO: compact, the answer in one line ─── */}
      <section className="relative flex min-h-[42vh] items-end overflow-hidden sm:min-h-[52vh] sm:items-center">
        <Image
          src={heroUrl}
          alt={heroAlt}
          fill
          className="object-cover"
          sizes="100vw"
          preload
          unoptimized={!isOptimizable(heroUrl)}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-light-surface via-transparent to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-4xl px-5 pb-10 pt-24 text-center sm:px-6 sm:pb-20 sm:pt-28">
          <span className="inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-sunset-gold backdrop-blur-sm sm:px-4 sm:py-1.5 sm:text-xs">
            {t.hero.eyebrow(d.region)}
          </span>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white sm:mt-5 sm:text-5xl lg:text-6xl">
            {t.hero.titleLead}{" "}
            <span className="bg-gradient-to-r from-sunset-gold via-sunset-orange to-sunset-red bg-clip-text text-transparent">
              {name}
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold text-white sm:mt-5 sm:text-lg">{t.hero.dataLine(facts)}</p>
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

      {/* ─── PICK & BOOK: the destination on one side, every other end on the wheel ─── */}
      {pickerDefault && (
        <section id="book" aria-labelledby="hub-facts" className="mx-auto max-w-6xl scroll-mt-24 px-4 pt-4 sm:px-6 sm:pt-6">
          <h2 id="hub-facts" className="sr-only">{t.facts.heading(name)}</h2>
          <HubRoutePicker
            place={name}
            routes={picker}
            defaultId={pickerDefault.id}
            allRoutesHref={hub.to.length ? "#to" : "#from"}
          />
        </section>
      )}

      {/* ─── TABLES: to, then from ─── */}
      <RouteTable id="to" heading={t.to.heading(name)} body={t.to.body(name)} routes={hub.to} locale={locale} map={destinations} show="destino" />
      <RouteTable id="from" heading={t.from.heading(name)} body={t.from.body(name)} routes={hub.from} locale={locale} map={destinations} show="origen" />

      {/* ─── SHORT INTRO + everything else folded ─── */}
      <section className="mx-auto max-w-4xl space-y-3 px-4 py-8 sm:px-6 sm:py-12">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-sunset-orange/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sunset-orange">
            {d.region}
          </span>
          {d.best_for.map((tag) => (
            <span key={tag} className="inline-flex items-center rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-foreground/60">
              {tag}
            </span>
          ))}
        </div>
        {shortIntro && <p className="pb-2 text-sm leading-relaxed text-foreground/75 sm:text-base">{shortIntro}</p>}

        <Fold id="hub-guide" heading={t.guide.about(name)}>
          <div className={PROSE} dangerouslySetInnerHTML={{ __html: introHtml }} />
          {arrivalHtml && (
            <>
              <h3 className="mt-8 text-lg font-bold text-foreground">{t.guide.arrival(name)}</h3>
              <div className={`mt-3 ${PROSE}`} dangerouslySetInnerHTML={{ __html: arrivalHtml }} />
            </>
          )}
          {tipsHtml && (
            <>
              <h3 className="mt-8 text-lg font-bold text-foreground">{t.guide.tips}</h3>
              <div className={`mt-3 ${PROSE}`} dangerouslySetInnerHTML={{ __html: tipsHtml }} />
            </>
          )}
        </Fold>

        {hub.related.length > 0 && (
          <Fold id="hub-nearby" heading={t.nearby.heading(d.region)}>
            <p className="text-sm text-foreground/60">{t.nearby.body}</p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {hub.related.map((r) => (
                <li key={r.path}>
                  <Link
                    href={r.path}
                    className="flex items-center justify-between rounded-2xl border border-black/5 bg-light-surface px-5 py-4 text-sm font-semibold text-foreground transition hover:border-sunset-orange/40 hover:text-sunset-orange"
                  >
                    {t.nearby.cta(localizeDestination(r.destination, locale).short_name)}
                    <ArrowIcon />
                  </Link>
                </li>
              ))}
            </ul>
          </Fold>
        )}

        <Fold id="hub-vehicles" heading={t.fold.vehicles}>
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
                    <div className="text-xs font-semibold uppercase tracking-wider text-sunset-orange">{t.vehicles.pax(tier.minPax, tier.maxPax)}</div>
                    <h3 className="mt-1 text-base font-bold text-foreground">{tier.name}</h3>
                    <p className="mt-1 text-sm text-foreground/60">{copy.typicalUse}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Fold>

        {/* FAQ: plain HTML, mirrors the FAQPage JSON-LD word for word. */}
        <Fold id="hub-faq" heading={t.faqHeading(name)}>
          <dl className="divide-y divide-black/5">
            {faqs.map((f) => (
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
          <h2 className="text-2xl font-bold sm:text-3xl">{t.cta.heading(name)}</h2>
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
            <Link href={PRICE_LIST_PATH} className="inline-flex items-center text-sm font-semibold text-white/70 underline-offset-4 hover:text-white hover:underline">
              {t.cta.allPrices}
            </Link>
            <Link href={LIR_HUB_PATH} className="inline-flex items-center text-sm font-semibold text-white/70 underline-offset-4 hover:text-white hover:underline">
              {t.facts.lirHub}
            </Link>
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
