import Image from "next/image";
import Link from "@/components/LocaleLink";
import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SocialLinks from "@/components/SocialLinks";
import { getRoutes, type Route } from "@/lib/routes";
import { getDestinations } from "@/lib/destinations";
import {
  BASE_URL,
  PRICE_LIST_PATH,
  groupRoutesForPriceList,
  priceFacts,
  priceRange,
  routePrices,
  routeUrl,
  travelTime,
  type PriceGroup,
} from "@/lib/pricing";
import { VEHICLE_TIERS } from "@/lib/vehicles";
import { routeSlug } from "@/lib/slug";
import { LOGO_WHITE_URL } from "@/lib/brand";
import { WHATSAPP_DISPLAY, WHATSAPP_URL } from "@/lib/contact";
import {
  IN_LANGUAGE,
  OG_LOCALE,
  localeAlternates,
  localeFromParams,
  localeUrl,
  type Locale,
} from "@/lib/i18n";
import { PRICES } from "@/i18n/prices";

const HERO_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/hero-ruta-pacifico.webp";

/**
 * The public price list. One server-rendered HTML table per airport group,
 * every figure in the DOM (no client JS, no accordion), plus an ItemList of
 * Offers in JSON-LD — the page an answer engine lands on when someone asks
 * "how much is a shuttle from Liberia airport to X". Re-rendered hourly so a
 * price edit in the routes table shows up without a deploy.
 */
export const revalidate = 3600;

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = PRICES[locale];
  const pageUrl = localeUrl(locale, PRICE_LIST_PATH);
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: localeAlternates(PRICE_LIST_PATH, locale),
    keywords: t.keywords,
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale],
      url: pageUrl,
      title: `${t.metaTitle} | Ruta Pacifico`,
      description: t.metaDescription,
      siteName: "Ruta Pacifico",
      images: [{ url: HERO_URL, width: 1200, height: 630, alt: t.ogImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${t.metaTitle} | Ruta Pacifico`,
      description: t.metaDescription,
      images: [HERO_URL],
    },
  };
}

function PriceListJsonLd({ groups, locale }: { groups: PriceGroup[]; locale: Locale }) {
  const t = PRICES[locale];
  const pageUrl = localeUrl(locale, PRICE_LIST_PATH);
  const all = groups.flatMap((g) => g.routes);
  const range = priceRange(all);
  const itemListElement = all.map((r, idx) => {
    const prices = routePrices(r);
    const url = routeUrl(r, locale);
    return {
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": ["Service", "Product"],
        "@id": `${url}#service`,
        name: t.jsonLd.serviceName(r.origen, r.destino),
        url,
        provider: { "@id": `${BASE_URL}/#organization` },
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
  });

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: t.metaTitle,
        description: t.metaDescription,
        isPartOf: { "@id": `${BASE_URL}/#website` },
        about: { "@id": `${BASE_URL}/#organization` },
        inLanguage: IN_LANGUAGE[locale],
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
      },
      {
        "@type": "OfferCatalog",
        "@id": `${pageUrl}#catalog`,
        name: t.jsonLd.catalogName,
        url: pageUrl,
        numberOfItems: itemListElement.length,
        ...(range
          ? {
              description: t.jsonLd.catalogDescription(itemListElement.length, range.low, range.high),
            }
          : {}),
        itemListElement,
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
          { "@type": "ListItem", position: 1, name: t.jsonLd.breadcrumbHome, item: localeUrl(locale, "/") },
          { "@type": "ListItem", position: 2, name: t.jsonLd.breadcrumbPrices, item: pageUrl },
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

function PriceCell({
  route,
  field,
  onRequest,
}: {
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

function GroupTable({ group, locale, defaultOpen }: { group: PriceGroup; locale: Locale; defaultOpen: boolean }) {
  const t = PRICES[locale].table;
  const tp = PRICES[locale];
  const id = `prices-${group.key}`;
  return (
    // Native <details>: only the first group is open by default so the page
    // is not a 350-row wall, yet every route stays in the DOM for crawlers and
    // answer engines (collapsed content is indexed normally). Browsers
    // auto-expand a <details> when a fragment link targets it, so the jump
    // nav keeps working with no client JS.
    <details
      id={group.key}
      open={defaultOpen}
      className="group scroll-mt-24 rounded-3xl border border-black/5 bg-white shadow-sm"
    >
      <summary
        aria-describedby={`${id}-blurb`}
        className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 sm:px-8 [&::-webkit-details-marker]:hidden"
      >
        <span className="min-w-0">
          <h2 id={id} className="text-xl font-bold text-foreground sm:text-2xl">
            {group.title}
          </h2>
          <span id={`${id}-blurb`} className="mt-1 block text-sm text-foreground/60">
            {group.blurb}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-3">
          <span className="hidden rounded-full bg-light-surface px-3 py-1 text-xs font-semibold text-foreground/60 sm:inline">
            {tp.jumpNav.count(group.routes.length)}
          </span>
          <svg
            className="h-5 w-5 text-foreground/40 transition group-open:rotate-180"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </span>
      </summary>
      <div className="overflow-x-auto border-t border-black/5">
        <table className="w-full min-w-[640px] text-left text-sm">
          <caption className="sr-only">{t.caption(group.title)}</caption>
          <thead className="bg-light-surface text-xs uppercase tracking-wider text-foreground/50">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">{t.route}</th>
              <th scope="col" className="px-4 py-3 font-semibold">{t.travelTime}</th>
              {VEHICLE_TIERS.map((tier) => (
                <th key={tier.key} scope="col" className="px-4 py-3 text-right font-semibold whitespace-nowrap">
                  {t.pax(tier.minPax, tier.maxPax)}
                </th>
              ))}
              <th scope="col" className="px-4 py-3 font-semibold">
                <span className="sr-only">{t.bookColumn}</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {group.routes.map((r) => {
              const href = `/private-shuttle/${routeSlug(r.origen, r.destino)}`;
              return (
                <tr key={r.id} className="transition hover:bg-sunset-orange/5">
                  <th scope="row" className="px-4 py-3 font-medium text-foreground">
                    <Link href={href} className="hover:text-sunset-orange">
                      {r.origen}
                      <span className="mx-1.5 text-foreground/30">→</span>
                      {r.destino}
                    </Link>
                  </th>
                  <td className="px-4 py-3 text-foreground/70 whitespace-nowrap">{travelTime(r, locale)}</td>
                  {VEHICLE_TIERS.map((tier) => (
                    <td key={tier.key} className="px-4 py-3 text-right whitespace-nowrap">
                      <PriceCell route={r} field={tier.priceField} onRequest={t.onRequest} />
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
              );
            })}
          </tbody>
        </table>
      </div>
    </details>
  );
}

export default async function PricesPage({ params }: { params: Params }) {
  const locale = await localeFromParams(params);
  const t = PRICES[locale];
  const [routes, destinations] = await Promise.all([getRoutes(), getDestinations()]);
  const groups = groupRoutesForPriceList(routes, { indexableOnly: true, destinations, locale });
  const all = groups.flatMap((g) => g.routes);
  const range = priceRange(all);
  const lir = groups.find((g) => g.key === "from-lir");

  return (
    <main className="bg-light-surface min-h-screen">
      {all.length ? <PriceListJsonLd groups={groups} locale={locale} /> : null}
      <SiteNav transparent />

      {/* ─── HERO ─── */}
      <section className="relative flex min-h-[46vh] items-center overflow-hidden">
        <Image src={HERO_URL} alt={t.hero.imageAlt} fill className="object-cover" priority unoptimized />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-light-surface via-transparent to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pt-24 pb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            {t.hero.eyebrow}
          </div>
          <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            {t.hero.titleBefore}{" "}
            <span className="bg-gradient-to-r from-sunset-gold via-sunset-orange to-sunset-red bg-clip-text text-transparent">
              {t.hero.titleHighlight}
            </span>{" "}
            {t.hero.titleAfter}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-white/85 sm:text-lg">
            {range ? t.hero.intro(all.length, range.low) : t.hero.introFallback}
          </p>
        </div>
      </section>

      {/* ─── Facts + tiers ─── */}
      <section className="relative -mt-10 z-20 mx-auto max-w-5xl px-6">
        <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-xl sm:p-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-lg font-bold text-foreground">{t.facts.heading}</h2>
              <ul className="mt-4 space-y-3 text-sm text-foreground/70">
                {priceFacts(locale).map((fact) => (
                  <li key={fact} className="flex gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    </span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">{t.tiers.heading}</h2>
              <p className="mt-1 text-xs text-foreground/50">{t.tiers.hint}</p>
              <ul className="mt-4 divide-y divide-black/5 overflow-hidden rounded-2xl border border-black/5">
                {VEHICLE_TIERS.map((tier) => (
                  <li key={tier.key} className="px-4 py-3">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                      <span className="font-bold text-foreground">{t.tiers.paxLabel(tier)}</span>
                      <span className="text-sm text-foreground/70">{t.tiers.vehicleLabel(tier)}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-foreground/50">{t.tiers.typicalUseOf(tier)}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {groups.length > 1 ? (
            <nav aria-label={t.jumpNav.label} className="mt-8 flex flex-wrap gap-2 border-t border-black/5 pt-6">
              {groups.map((g) => (
                <a
                  key={g.key}
                  href={`#${g.key}`}
                  className="rounded-full border border-black/10 bg-white px-4 py-1.5 text-xs font-semibold text-foreground/70 transition hover:border-sunset-orange hover:text-sunset-orange"
                >
                  {t.jumpNav.item(g.title, g.routes.length)}
                </a>
              ))}
            </nav>
          ) : null}
        </div>
      </section>

      {/* ─── Price tables ─── */}
      <div className="mx-auto max-w-5xl space-y-6 px-6 py-16">
        {all.length ? (
          groups.map((g, i) => <GroupTable key={g.key} group={g} locale={locale} defaultOpen={i === 0} />)
        ) : (
          <section className="rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-bold text-foreground">{t.unavailable.heading}</h2>
            <p className="mt-2 text-sm text-foreground/60">
              {t.unavailable.before}{" "}
              <Link href="/private-shuttle" className="font-semibold text-sunset-orange">{t.unavailable.bookingPage}</Link>{" "}
              {t.unavailable.between} <a href={WHATSAPP_URL} className="font-semibold text-sunset-orange">{t.unavailable.whatsapp}</a>.
            </p>
          </section>
        )}

        {/* ─── Not listed ─── */}
        <section className="rounded-3xl bg-foreground p-8 text-white sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-2xl font-bold">{t.notListed.heading}</h2>
              <p className="mt-3 max-w-2xl text-white/70">
                {lir ? t.notListed.body(all.length) : t.notListed.bodyFallback}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/private-shuttle"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sunset-red via-sunset-orange to-sunset-gold px-7 py-3.5 text-sm font-bold text-white shadow-lg transition hover:scale-[1.02]"
              >
                {t.notListed.searchAll}
              </Link>
              <a
                href={WHATSAPP_URL}
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                {t.notListed.whatsapp(WHATSAPP_DISPLAY)}
              </a>
            </div>
          </div>
        </section>

        {/* ─── FAQ (plain HTML, mirrors the FAQPage JSON-LD) ─── */}
        <section aria-labelledby="price-faq">
          <h2 id="price-faq" className="text-2xl font-bold text-foreground sm:text-3xl">
            {t.faqHeading}
          </h2>
          <dl className="mt-6 divide-y divide-black/5 rounded-3xl border border-black/5 bg-white shadow-sm">
            {t.faqs.map((f) => (
              <div key={f.q} className="px-6 py-5 sm:px-8">
                <dt className="font-bold text-foreground">{f.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-foreground/70">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-black/5 bg-foreground text-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <Image src={LOGO_WHITE_URL} alt="Ruta Pacifico" width={240} height={100} className="h-16 w-auto" unoptimized />
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-8">
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/50">
                <Link href="/" className="transition hover:text-sunset-orange">{t.footer.home}</Link>
                <Link href="/private-shuttle" className="transition hover:text-sunset-orange">{t.footer.allRoutes}</Link>
                <Link href="/faq" className="transition hover:text-sunset-orange">{t.footer.faq}</Link>
                <a href={WHATSAPP_URL} className="transition hover:text-sunset-orange">{t.footer.whatsapp}</a>
              </div>
              <SocialLinks />
            </div>
          </div>
          <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-white/30">
            &copy; {new Date().getFullYear()} Ruta Pacifico. {t.footer.rights}
          </div>
        </div>
      </footer>
    </main>
  );
}
