import Image from "next/image";
import type { Metadata } from "next";
import Link from "@/components/LocaleLink";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { localizeDestination } from "@/lib/destinations";
import { getDestinationHubs } from "@/lib/destinationHubs";
import { LIR_HUB_PATH } from "@/lib/pricing";
import { isOptimizable } from "@/lib/images";
import {
  IN_LANGUAGE,
  OG_LOCALE,
  localeAlternates,
  localeFromParams,
  localeUrl,
  type Locale,
} from "@/lib/i18n";
import { DESTINATIONS_INDEX } from "@/i18n/destinationHub";

/**
 * Index of the destination hubs (/tamarindo-shuttle…): one card per place
 * with the live "from" price and how many priced routes touch it. The
 * single "Destinations" entry in the navigation lands here, so every hub
 * is two clicks from any page without a dozen menu items.
 */
export const revalidate = 86400;

type Params = Promise<{ lang: string }>;

const HERO_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/hero-ruta-pacifico.webp";

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = DESTINATIONS_INDEX[locale];
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: localeAlternates("/destinations", locale),
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale],
      url: localeUrl(locale, "/destinations"),
      title: t.metaTitle,
      description: t.metaDescription,
      images: [{ url: HERO_URL, width: 1200, height: 630, alt: t.heroAlt }],
    },
  };
}

export default async function DestinationsPage({ params }: { params: Params }) {
  const locale: Locale = await localeFromParams(params);
  const t = DESTINATIONS_INDEX[locale];
  const hubs = await getDestinationHubs();
  const pageUrl = localeUrl(locale, "/destinations");

  const cards = [
    {
      key: "lir",
      name: t.lirName,
      path: LIR_HUB_PATH,
      image: HERO_URL,
      alt: t.heroAlt,
      from: null as number | null,
      routes: 0,
      tag: t.lirTag,
    },
    ...hubs.map((hub) => {
      const d = localizeDestination(hub.destination, locale);
      return {
        key: hub.slug,
        name: d.short_name,
        path: hub.path,
        image: d.image_url || HERO_URL,
        alt: d.image_alt ?? `${d.short_name}, Costa Rica`,
        from: hub.range?.low ?? null,
        routes: hub.from.length + hub.to.length,
        tag: undefined as string | undefined,
      };
    }),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#page`,
        url: pageUrl,
        name: t.title,
        description: t.metaDescription,
        inLanguage: IN_LANGUAGE[locale],
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: t.home, item: localeUrl(locale, "/") },
          { "@type": "ListItem", position: 2, name: t.title, item: pageUrl },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#hubs`,
        name: t.title,
        itemListElement: cards.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.name,
          url: localeUrl(locale, c.path),
        })),
      },
    ],
  };

  return (
    <main className="bg-light-surface min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav transparent />

      <section className="relative flex min-h-[46vh] items-end overflow-hidden">
        <Image src={HERO_URL} alt={t.heroAlt} fill className="object-cover" sizes="100vw" preload />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-32 pb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sunset-gold">{t.eyebrow}</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl">{t.title}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">{t.intro}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 sm:py-20">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <li key={card.key}>
              <Link
                href={card.path}
                className="group block overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-sunset-orange/40 hover:shadow-md"
              >
                <div className="relative h-48">
                  <Image
                    src={card.image}
                    alt={card.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized={!isOptimizable(card.image)}
                  />
                  {card.tag && (
                    <span className="absolute left-4 top-4 rounded-full bg-sunset-orange px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-white">
                      {card.tag}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="text-lg font-bold text-foreground">{card.name}</h2>
                  <p className="mt-1 text-sm text-foreground/60">
                    {card.from !== null ? t.from(card.from) : ""}
                    {card.from !== null && card.routes > 0 ? " · " : ""}
                    {card.routes > 0 ? t.routes(card.routes) : ""}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-sunset-orange">
                    {t.view}
                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <SiteFooter locale={locale} />
    </main>
  );
}
