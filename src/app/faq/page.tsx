import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getSupabase } from "@/lib/supabase";
import SiteNav from "@/components/SiteNav";
import FaqAccordion, { type Faq } from "@/components/FaqAccordion";

const LOGO_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/Logo%20Transparente.png";
const HERO_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/hero-ruta-pacifico.webp";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Ruta Pacifico",
  description:
    "Everything you need to know about booking a private shuttle with Ruta Pacifico: pickup, pricing, cancellation, car seats, luggage, airport transfers and more.",
  alternates: { canonical: "/faq" },
  openGraph: {
    type: "website",
    url: "https://rutapacificocr.com/faq",
    title: "Frequently Asked Questions | Ruta Pacifico",
    description:
      "Answers about booking, pricing, cancellation, airport pickup, luggage, child seats and more.",
  },
};

// Human-friendly labels for the database category slugs.
const CATEGORY_LABELS: Record<string, string> = {
  airports: "Airports",
  booking: "Booking",
  cancellation: "Cancellation & Refunds",
  car_seats: "Car Seats",
  drivers: "Our Drivers",
  groups: "Groups & Large Parties",
  luggage: "Luggage",
  pickup: "Pickup & Drop-off",
  pricing: "Pricing & Payment",
  routes: "Routes & Travel",
  safety: "Safety & Insurance",
  travel_tips: "Travel Tips",
  vehicles: "Vehicles",
  website: "Website & Support",
};

// Fixed order so categories don't jump around between renders.
const CATEGORY_ORDER = [
  "booking",
  "pricing",
  "cancellation",
  "airports",
  "pickup",
  "routes",
  "vehicles",
  "drivers",
  "luggage",
  "car_seats",
  "groups",
  "safety",
  "travel_tips",
  "website",
];

function categoryLabel(key: string): string {
  return (
    CATEGORY_LABELS[key] ??
    key
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  );
}

function categoryAnchor(key: string): string {
  return `cat-${key}`;
}

async function getFaqs(): Promise<Faq[]> {
  const { data, error } = await getSupabase()
    .from("faqs_ruta_pacifico")
    .select("id, category, question, answer, display_order, is_featured")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch FAQs:", error.message);
    return [];
  }

  return (data ?? []) as Faq[];
}

function groupByCategory(faqs: Faq[]): Map<string, Faq[]> {
  const groups = new Map<string, Faq[]>();
  for (const faq of faqs) {
    const list = groups.get(faq.category);
    if (list) {
      list.push(faq);
    } else {
      groups.set(faq.category, [faq]);
    }
  }
  return groups;
}

const BASE = "https://rutapacificocr.com";

function FaqJsonLd({ faqs }: { faqs: Faq[] }) {
  if (faqs.length === 0) return null;
  // Google only indexes the first handful of Q&A pairs anyway, but we provide
  // them all — downstream LLMs (Claude, GPT, Perplexity) parse the whole list.
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "@id": `${BASE}/faq#faq`,
        url: `${BASE}/faq`,
        inLanguage: "en-US",
        isPartOf: { "@id": `${BASE}/#website` },
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.answer,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${BASE}/faq#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE },
          {
            "@type": "ListItem",
            position: 2,
            name: "FAQ",
            item: `${BASE}/faq`,
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

export default async function FaqPage() {
  const faqs = await getFaqs();
  const grouped = groupByCategory(faqs);

  // Respect CATEGORY_ORDER but also include any unknown categories at the end.
  const orderedCategories = [
    ...CATEGORY_ORDER.filter((c) => grouped.has(c)),
    ...Array.from(grouped.keys()).filter((c) => !CATEGORY_ORDER.includes(c)),
  ];

  return (
    <main className="bg-light-surface min-h-screen">
      <FaqJsonLd faqs={faqs} />
      {/* ─── NAV ─── */}
      <SiteNav transparent />

      {/* ─── HERO ─── */}
      <section className="relative flex min-h-[38vh] items-center overflow-hidden">
        <Image
          src={HERO_URL}
          alt="Private shuttle along the Guanacaste coast"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-light-surface via-transparent to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-4xl px-6 pt-24 pb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            Help Center
          </div>
          <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-sunset-gold via-sunset-orange to-sunset-red bg-clip-text text-transparent">
              Questions
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-white/80 sm:text-base">
            Everything you need to know about booking a private shuttle with
            Ruta Pacifico — from airport pickups to car seats, luggage, and
            cancellations.
          </p>
        </div>
      </section>

      {/* ─── CATEGORY NAV (quick jump) ─── */}
      {orderedCategories.length > 0 && (
        <section className="relative -mt-10 z-20 mx-auto max-w-5xl px-6">
          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-xl sm:p-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-foreground/40">
              Jump to a topic
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {orderedCategories.map((cat) => (
                <a
                  key={cat}
                  href={`#${categoryAnchor(cat)}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-black/5 bg-light-surface px-4 py-2 text-xs font-semibold text-foreground/70 transition hover:border-sunset-orange/30 hover:bg-sunset-orange/5 hover:text-sunset-orange sm:text-sm"
                >
                  {categoryLabel(cat)}
                  <span className="text-foreground/30">
                    ({grouped.get(cat)?.length ?? 0})
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── FAQ CONTENT ─── */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        {faqs.length === 0 ? (
          <div className="rounded-2xl border border-black/5 bg-white p-10 text-center shadow-sm">
            <p className="text-foreground/60">
              No FAQs available right now. Please{" "}
              <a
                href="https://wa.me/50685962438"
                className="font-semibold text-sunset-orange hover:text-sunset-gold"
              >
                contact us on WhatsApp
              </a>{" "}
              and we will get back to you.
            </p>
          </div>
        ) : (
          <div className="space-y-14">
            {orderedCategories.map((cat) => {
              const list = grouped.get(cat) ?? [];
              return (
                <div
                  key={cat}
                  id={categoryAnchor(cat)}
                  className="scroll-mt-24"
                >
                  <div className="mb-5 flex items-baseline justify-between gap-4">
                    <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                      {categoryLabel(cat)}
                    </h2>
                    <span className="text-xs text-foreground/40">
                      {list.length} {list.length === 1 ? "question" : "questions"}
                    </span>
                  </div>
                  <FaqAccordion faqs={list} />
                </div>
              );
            })}
          </div>
        )}

        {/* ─── CONTACT CTA ─── */}
        <div className="mt-16 rounded-3xl border border-sunset-orange/20 bg-gradient-to-br from-sunset-gold/5 via-sunset-orange/5 to-sunset-red/5 p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">
            Still have questions?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-foreground/60">
            Our bilingual team is ready to help before, during, and after your
            ride — 7 days a week.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="https://wa.me/50685962438"
              className="inline-flex items-center gap-2 rounded-full bg-sunset-orange px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-sunset-red"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.553 4.116 1.519 5.848L.058 23.306a.5.5 0 00.636.636l5.458-1.461A11.948 11.948 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.94 0-3.753-.563-5.28-1.532l-.368-.224-3.821 1.023 1.023-3.821-.224-.368A9.935 9.935 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
              </svg>
              WhatsApp us
            </a>
            <a
              href="mailto:mybooking@rutapacificocr.com"
              className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-white px-6 py-3 text-sm font-bold text-foreground transition hover:border-sunset-orange/30 hover:text-sunset-orange"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                />
              </svg>
              Email us
            </a>
          </div>
        </div>
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
