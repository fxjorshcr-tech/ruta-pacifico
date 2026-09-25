import Image from "next/image";
import Link from "@/components/LocaleLink";
import RouteSearch from "@/components/RouteSearch";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import GoogleReviewBadge from "@/components/GoogleReviewBadge";
import FaqAccordion from "@/components/FaqAccordion";
import { getFeaturedFaqs } from "@/lib/faqs";
import PopularRoutes from "@/components/PopularRoutes";
import { getRoutes, type Route } from "@/lib/routes";
import { getDestinations, selectIndexableRoutes } from "@/lib/destinations";
import {
  PRICE_LIST_PATH,
  lowestPrice,
  popularAirportRoutes,
  routePrices } from "@/lib/pricing";
import type { Metadata } from "next";
import { routeSlug } from "@/lib/slug";
import {
  BASE_URL,
  IN_LANGUAGE,
  OG_LOCALE,
  localeAlternates,
  localeFromParams,
  localeUrl,
  type Locale } from "@/lib/i18n";
import { SHUTTLE } from "@/i18n/shuttle";

type Params = Promise<{ lang: string }>;

const HERO_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/hero-ruta-pacifico.webp";

/** Routes and FAQs change rarely; regenerate at most hourly instead of querying Supabase on every visit. */
export const revalidate = 3600;

export async function generateMetadata({
  params }: {
  params: Params;
}): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = SHUTTLE[locale];
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: localeAlternates("/private-shuttle", locale),
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale],
      url: localeUrl(locale, "/private-shuttle"),
      title: t.ogTitle,
      description: t.ogDescription,
      images: [
        {
          url: HERO_URL,
          width: 1200,
          height: 630,
          alt: t.heroAlt },
      ] },
    twitter: {
      card: "summary_large_image",
      title: t.ogTitle,
      description: t.twitterDescription,
      images: [HERO_URL] } };
}

function TransferPageJsonLd({ routes, locale }: { routes: Route[]; locale: Locale }) {
  const t = SHUTTLE[locale].jsonLd;
  const pageUrl = localeUrl(locale, "/private-shuttle");
  // Declare the 50 most important index-able routes as ItemList (airport
  // routes first) — enough for Google Rich Results without bloating the HTML.
  const topRoutes = routes.slice(0, 50);
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#page`,
        url: pageUrl,
        name: t.pageName,
        description: t.pageDescription,
        isPartOf: { "@id": `${BASE_URL}/#website` },
        inLanguage: IN_LANGUAGE[locale],
        primaryImageOfPage: HERO_URL },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#routes`,
        name: t.listName,
        numberOfItems: topRoutes.length,
        itemListElement: topRoutes.map((r, idx) => {
          const url = localeUrl(locale, `/private-shuttle/${routeSlug(r.origen, r.destino)}`);
          const prices = routePrices(r);
          return {
            "@type": "ListItem",
            position: idx + 1,
            name: t.routeName(r.origen, r.destino),
            url,
            ...(prices.length
              ? {
                  item: {
                    "@type": ["Service", "Product"],
                    "@id": `${url}#service`,
                    name: t.serviceName(r.origen, r.destino),
                    url,
                    offers: {
                      "@type": "AggregateOffer",
                      priceCurrency: "USD",
                      lowPrice: prices[0].price,
                      highPrice: prices[prices.length - 1].price,
                      offerCount: prices.length,
                      availability: "https://schema.org/InStock",
                      url } } }
              : {}) };
        }) },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: t.home, item: localeUrl(locale, "/") },
          {
            "@type": "ListItem",
            position: 2,
            name: t.shuttles,
            item: pageUrl },
        ] },
    ] };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

export default async function TransferPage({ params }: { params: Params }) {
  const locale = await localeFromParams(params);
  const t = SHUTTLE[locale];
  const [routes, faqs, destinations] = await Promise.all([
    getRoutes(),
    getFeaturedFaqs(6, locale),
    getDestinations(),
  ]);
  const indexable = selectIndexableRoutes(routes, destinations);
  const popular = popularAirportRoutes(routes, destinations, 12);
  const pricedCount = indexable.filter((r) => lowestPrice(r)).length;
  const pairs = routes.map((r) => ({ origen: r.origen, destino: r.destino }));

  return (
    <main className="bg-light-surface min-h-screen">
      <TransferPageJsonLd routes={indexable} locale={locale} />
      {/* ─── NAV ─── */}
      <SiteNav transparent />

      {/* ─── HERO ─── */}
      <section className="relative flex min-h-[55vh] items-center overflow-hidden">
        <Image
          src={HERO_URL}
          alt={t.heroAlt}
          fill
          className="object-cover"
          sizes="100vw"
          preload
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-light-surface via-transparent to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-4xl px-6 pt-24 pb-32 text-center">
          <div className="mb-6 flex justify-center">
            <GoogleReviewBadge locale={locale} />
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t.hero.before}{" "}
            <span className="bg-gradient-to-r from-sunset-gold via-sunset-orange to-sunset-red bg-clip-text text-transparent">
              {t.hero.highlight}
            </span>{" "}
            <span className="text-white/70">{t.hero.connector}</span> {t.hero.after}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-white/80 sm:text-lg">
            {t.hero.intro}
          </p>
          <div className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 px-5 py-2.5">
              <svg className="h-5 w-5 text-sunset-gold" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
              </svg>
              <span className="text-sm font-semibold text-white">{t.hero.badges.airport}</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 px-5 py-2.5">
              <svg className="h-5 w-5 text-sunset-gold" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              <span className="text-sm font-semibold text-white">{t.hero.badges.beach}</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 px-5 py-2.5">
              <svg className="h-5 w-5 text-sunset-gold" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
              </svg>
              <span className="text-sm font-semibold text-white">{t.hero.badges.destination}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CLIENT-SIDE ROUTE SEARCH ─── */}
      <RouteSearch routes={pairs} />

      {/* ─── POPULAR ROUTES WITH PRICES (server-rendered, crawlable) ─── */}
      <PopularRoutes routes={popular} totalPriced={pricedCount} locale={locale} />

      {/* ─── GOOD TO KNOW ─── */}
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            {t.goodToKnow.heading}
          </h2>
          <p className="mt-2 text-sm text-foreground/60">
            {t.goodToKnow.intro}
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
              <h3 className="text-lg font-bold text-foreground">{t.goodToKnow.cancellation.title}</h3>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-foreground/70">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </span>
                <span><strong className="text-foreground">{t.goodToKnow.cancellation.before.strong}</strong> {t.goodToKnow.cancellation.before.text}</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </span>
                <span><strong className="text-foreground">{t.goodToKnow.cancellation.within.strong}</strong> {t.goodToKnow.cancellation.within.text}</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sunset-orange/15 text-sunset-orange">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </span>
                <span>
                  {t.goodToKnow.cancellation.email}{" "}
                  <a href="mailto:reservations@rutapacifico.com" className="font-medium text-sunset-orange hover:text-sunset-gold">
                    reservations@rutapacifico.com
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
              <h3 className="text-lg font-bold text-foreground">{t.goodToKnow.changes.title}</h3>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-foreground/70">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </span>
                <span>{t.goodToKnow.changes.items[0]}</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </span>
                <span>{t.goodToKnow.changes.items[1]}</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sunset-orange/15 text-sunset-orange">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </span>
                <span>{t.goodToKnow.changes.items[2]}</span>
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
              <h3 className="text-lg font-bold text-foreground">{t.goodToKnow.help.title}</h3>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-foreground/70">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </span>
                <span>{t.goodToKnow.help.items[0]}</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </span>
                <span>{t.goodToKnow.help.items[1]}</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sunset-orange/15 text-sunset-orange">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </span>
                <span>
                  {t.goodToKnow.help.reachUs}{" "}
                  <a href="https://wa.me/50670805578" className="font-medium text-sunset-orange hover:text-sunset-gold">
                    +506-7080-5578
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
              <h3 className="text-lg font-bold text-foreground">{t.goodToKnow.pricing.title}</h3>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-foreground/70">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </span>
                <span>{t.goodToKnow.pricing.items[0]}</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </span>
                <span>{t.goodToKnow.pricing.items[1]}</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </span>
                <span>{t.goodToKnow.pricing.items[2]}</span>
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
              {t.faq.eyebrow}
            </div>
            <h2 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl">
              {t.faq.heading}
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-foreground/60">
              {t.faq.intro}
            </p>
          </div>

          <FaqAccordion faqs={faqs} defaultOpenFirst />

          <div className="mt-8 flex justify-center">
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-sunset-orange"
            >
              {t.faq.seeAll}
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
      <SiteFooter locale={locale} />
    </main>
  );
}
