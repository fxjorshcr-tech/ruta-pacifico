import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SocialLinks from "@/components/SocialLinks";
import { getRoutes, type Route } from "@/lib/routes";
import { getDestinations } from "@/lib/destinations";
import {
  BASE_URL,
  PRICE_FACTS,
  PRICE_LIST_PATH,
  groupRoutesForPriceList,
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

const PAGE_URL = `${BASE_URL}${PRICE_LIST_PATH}`;
const TITLE = "Private Shuttle Prices in Costa Rica — Full Price List (USD)";
const DESCRIPTION =
  "Every Ruta Pacifico private shuttle price, published: Liberia Airport (LIR) to Tamarindo, Flamingo, Papagayo, Nosara, La Fortuna and 300+ more routes. Fixed USD prices per vehicle, taxes included, same price all year.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PRICE_LIST_PATH },
  keywords: [
    "Liberia airport shuttle prices",
    "LIR shuttle cost",
    "Costa Rica private shuttle prices",
    "Liberia airport to Tamarindo shuttle price",
    "Guanacaste airport transfer cost",
    "how much is a private shuttle in Costa Rica",
    "Ruta Pacifico prices",
    "Ruta Pacifico rates",
  ],
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: `${TITLE} | Ruta Pacifico`,
    description: DESCRIPTION,
    siteName: "Ruta Pacifico",
    images: [{ url: HERO_URL, width: 1200, height: 630, alt: "Ruta Pacifico private shuttle price list" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | Ruta Pacifico`,
    description: DESCRIPTION,
    images: [HERO_URL],
  },
};

const PRICE_FAQS = [
  {
    q: "Are Ruta Pacifico's prices per person or per vehicle?",
    a: `Per vehicle. The figure in the table is the total for the whole group, whatever the number of passengers within the tier (${VEHICLE_TIERS.map((t) => `${t.minPax}–${t.maxPax}`).join(", ")} passengers). Two people and five people pay the same price in the ${VEHICLE_TIERS[0].minPax}–${VEHICLE_TIERS[0].maxPax} tier.`,
  },
  {
    q: "Do prices go up in high season, at Christmas or New Year?",
    a: "No. The price published here is the price on any date of the year, including Christmas, New Year, Easter week and the December–April high season. There is no night surcharge and no airport fee either.",
  },
  {
    q: "What is included in the price?",
    a: "The private vehicle and professional bilingual driver, fuel, tolls, 13% VAT, WiFi, bottled water, child or booster seats on request and, on airport pickups, real-time flight tracking with a name sign at arrivals. The only optional extra is a driver gratuity.",
  },
  {
    q: "My route is not in the list. How do I get a price?",
    a: `The list shows the most requested routes. More than 1,000 origin/destination pairs are priced on the booking page, and any other pickup or drop-off in Costa Rica is quoted on WhatsApp (${WHATSAPP_DISPLAY}) within minutes at the same fixed, per-vehicle terms.`,
  },
  {
    q: "How do I pay, and when?",
    a: "Book online with a credit or debit card, or confirm on WhatsApp and pay by card or cash. Nothing is charged at pickup beyond the price shown. Cancellations more than 48 hours before pickup are refunded in full minus the 13% tax.",
  },
];

function PriceListJsonLd({ groups }: { groups: PriceGroup[] }) {
  const all = groups.flatMap((g) => g.routes);
  const range = priceRange(all);
  const itemListElement = all.map((r, idx) => {
    const prices = routePrices(r);
    const url = routeUrl(r);
    return {
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": ["Service", "Product"],
        "@id": `${url}#service`,
        name: `Private Shuttle: ${r.origen} to ${r.destino}`,
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
        "@id": `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: TITLE,
        description: DESCRIPTION,
        isPartOf: { "@id": `${BASE_URL}/#website` },
        about: { "@id": `${BASE_URL}/#organization` },
        inLanguage: "en-US",
        breadcrumb: { "@id": `${PAGE_URL}#breadcrumb` },
      },
      {
        "@type": "OfferCatalog",
        "@id": `${PAGE_URL}#catalog`,
        name: "Ruta Pacifico private shuttle price list",
        url: PAGE_URL,
        numberOfItems: itemListElement.length,
        ...(range
          ? {
              description: `${itemListElement.length} private shuttle routes in Costa Rica priced from $${range.low} to $${range.high} per vehicle, USD, 13% VAT included.`,
            }
          : {}),
        itemListElement,
      },
      {
        "@type": "FAQPage",
        "@id": `${PAGE_URL}#faq`,
        mainEntity: PRICE_FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${PAGE_URL}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: "Prices", item: PAGE_URL },
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

function PriceCell({ route, field }: { route: Route; field: (typeof VEHICLE_TIERS)[number]["priceField"] }) {
  const price = route[field];
  if (typeof price === "number" && price > 0) {
    return <span className="font-bold text-foreground">{`$${price}`}</span>;
  }
  return <span className="text-xs text-foreground/40">on request</span>;
}

function GroupTable({ group }: { group: PriceGroup }) {
  const id = `prices-${group.key}`;
  return (
    <section aria-labelledby={id} className="scroll-mt-24" id={group.key}>
      <h2 id={id} className="text-2xl font-bold text-foreground sm:text-3xl">
        {group.title}
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-foreground/60">{group.blurb}</p>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-black/5 bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <caption className="sr-only">
            {`${group.title}: private shuttle prices in USD per vehicle, 13% VAT included`}
          </caption>
          <thead className="bg-light-surface text-xs uppercase tracking-wider text-foreground/50">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">Route</th>
              <th scope="col" className="px-4 py-3 font-semibold">Travel time</th>
              {VEHICLE_TIERS.map((t) => (
                <th key={t.key} scope="col" className="px-4 py-3 text-right font-semibold whitespace-nowrap">
                  {`${t.minPax}–${t.maxPax} pax`}
                </th>
              ))}
              <th scope="col" className="px-4 py-3 font-semibold">
                <span className="sr-only">Book</span>
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
                  <td className="px-4 py-3 text-foreground/70 whitespace-nowrap">{travelTime(r)}</td>
                  {VEHICLE_TIERS.map((t) => (
                    <td key={t.key} className="px-4 py-3 text-right whitespace-nowrap">
                      <PriceCell route={r} field={t.priceField} />
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={href}
                      className="inline-flex items-center rounded-full bg-foreground px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-sunset-orange"
                    >
                      Book
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default async function PricesPage() {
  const [routes, destinations] = await Promise.all([getRoutes(), getDestinations()]);
  const groups = groupRoutesForPriceList(routes, { indexableOnly: true, destinations });
  const all = groups.flatMap((g) => g.routes);
  const range = priceRange(all);
  const lir = groups.find((g) => g.key === "from-lir");

  return (
    <main className="bg-light-surface min-h-screen">
      {all.length ? <PriceListJsonLd groups={groups} /> : null}
      <SiteNav transparent />

      {/* ─── HERO ─── */}
      <section className="relative flex min-h-[46vh] items-center overflow-hidden">
        <Image src={HERO_URL} alt="Private shuttle on the Guanacaste coast" fill className="object-cover" priority unoptimized />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-light-surface via-transparent to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pt-24 pb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            Public price list · USD · per vehicle
          </div>
          <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Private Shuttle{" "}
            <span className="bg-gradient-to-r from-sunset-gold via-sunset-orange to-sunset-red bg-clip-text text-transparent">
              Prices
            </span>{" "}
            in Costa Rica
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-white/85 sm:text-lg">
            {range
              ? `Every price we charge, published. ${all.length} routes from Liberia Airport (LIR), San José Airport (SJO) and between beaches, from $${range.low} per vehicle with 13% VAT included. The same price on any date of the year.`
              : "Every price we charge, published: fixed, per vehicle, taxes included, the same on any date of the year."}
          </p>
        </div>
      </section>

      {/* ─── Facts + tiers ─── */}
      <section className="relative -mt-10 z-20 mx-auto max-w-5xl px-6">
        <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-xl sm:p-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-lg font-bold text-foreground">How our pricing works</h2>
              <ul className="mt-4 space-y-3 text-sm text-foreground/70">
                {PRICE_FACTS.map((fact) => (
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
              <h2 className="text-lg font-bold text-foreground">Price tiers by group size</h2>
              <p className="mt-1 text-xs text-foreground/50">
                Count everyone, adults and children. Your group falls into exactly one tier.
              </p>
              <div className="mt-4 overflow-hidden rounded-2xl border border-black/5">
                <table className="w-full text-left text-sm">
                  <thead className="bg-light-surface text-xs uppercase tracking-wider text-foreground/50">
                    <tr>
                      <th scope="col" className="px-4 py-2.5 font-semibold">Passengers</th>
                      <th scope="col" className="px-4 py-2.5 font-semibold">Vehicle</th>
                      <th scope="col" className="px-4 py-2.5 font-semibold">Typical use</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {VEHICLE_TIERS.map((t) => (
                      <tr key={t.key}>
                        <td className="px-4 py-2.5 font-bold text-foreground whitespace-nowrap">{t.paxLabel}</td>
                        <td className="px-4 py-2.5 text-foreground/70 whitespace-nowrap">{`${t.name} or similar`}</td>
                        <td className="px-4 py-2.5 text-foreground/70">{t.typicalUse}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {groups.length > 1 ? (
            <nav aria-label="Jump to a price group" className="mt-8 flex flex-wrap gap-2 border-t border-black/5 pt-6">
              {groups.map((g) => (
                <a
                  key={g.key}
                  href={`#${g.key}`}
                  className="rounded-full border border-black/10 bg-white px-4 py-1.5 text-xs font-semibold text-foreground/70 transition hover:border-sunset-orange hover:text-sunset-orange"
                >
                  {`${g.title} (${g.routes.length})`}
                </a>
              ))}
            </nav>
          ) : null}
        </div>
      </section>

      {/* ─── Price tables ─── */}
      <div className="mx-auto max-w-5xl space-y-16 px-6 py-16">
        {all.length ? (
          groups.map((g) => <GroupTable key={g.key} group={g} />)
        ) : (
          <section className="rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-bold text-foreground">Prices are loading</h2>
            <p className="mt-2 text-sm text-foreground/60">
              The live price list is temporarily unavailable. Search any route on the{" "}
              <Link href="/private-shuttle" className="font-semibold text-sunset-orange">booking page</Link>{" "}
              or ask on <a href={WHATSAPP_URL} className="font-semibold text-sunset-orange">WhatsApp</a>.
            </p>
          </section>
        )}

        {/* ─── Not listed ─── */}
        <section className="rounded-3xl bg-foreground p-8 text-white sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-2xl font-bold">Need a route that is not listed?</h2>
              <p className="mt-3 max-w-2xl text-white/70">
                {lir
                  ? `This page lists the ${all.length} routes travellers ask about most. More than 1,000 other origin/destination pairs are already priced on the booking page, and any other address in Costa Rica is quoted on WhatsApp within minutes, on the same fixed, per-vehicle terms.`
                  : "More than 1,000 origin/destination pairs are priced on the booking page, and any other address in Costa Rica is quoted on WhatsApp within minutes, on the same fixed, per-vehicle terms."}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/private-shuttle"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sunset-red via-sunset-orange to-sunset-gold px-7 py-3.5 text-sm font-bold text-white shadow-lg transition hover:scale-[1.02]"
              >
                Search every route
              </Link>
              <a
                href={WHATSAPP_URL}
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                {`WhatsApp ${WHATSAPP_DISPLAY}`}
              </a>
            </div>
          </div>
        </section>

        {/* ─── FAQ (plain HTML, mirrors the FAQPage JSON-LD) ─── */}
        <section aria-labelledby="price-faq">
          <h2 id="price-faq" className="text-2xl font-bold text-foreground sm:text-3xl">
            Questions about prices
          </h2>
          <dl className="mt-6 divide-y divide-black/5 rounded-3xl border border-black/5 bg-white shadow-sm">
            {PRICE_FAQS.map((f) => (
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
                <Link href="/" className="transition hover:text-sunset-orange">Home</Link>
                <Link href="/private-shuttle" className="transition hover:text-sunset-orange">All routes</Link>
                <Link href="/faq" className="transition hover:text-sunset-orange">FAQ</Link>
                <a href={WHATSAPP_URL} className="transition hover:text-sunset-orange">WhatsApp</a>
              </div>
              <SocialLinks />
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
