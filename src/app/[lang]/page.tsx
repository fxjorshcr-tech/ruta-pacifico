import Image from "next/image";
import Link from "@/components/LocaleLink";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import GoogleReviewBadge from "@/components/GoogleReviewBadge";
import GuanacasteGallery from "@/components/GuanacasteGallery";
import { VEHICLE_TIERS, vehicleTierCopy } from "@/lib/vehicles";
import { FACEBOOK_URL, INSTAGRAM_URL } from "@/lib/contact";
import { LOGO_URL } from "@/lib/brand";
import FaqAccordion from "@/components/FaqAccordion";
import { faqPageJsonLd, getFeaturedFaqs } from "@/lib/faqs";
import { getRoutes, type Route } from "@/lib/routes";
import { PRICE_LIST_PATH, lowestPrice } from "@/lib/pricing";
import { routeSlug, toSlug } from "@/lib/slug";
import { IN_LANGUAGE, localeFromParams, localeUrl } from "@/lib/i18n";
import { HOME } from "@/i18n/home";

/**
 * The LIR pickup route for a destination slug, if it is sold. The home page
 * beach cards (HOME[locale].beaches.cards) carry the slug of their
 * `routes.destino` value so each can show the live "from $X" price.
 */
function lirRouteTo(routes: Route[], slug: string): Route | undefined {
  return routes.find((r) => /\bLIR\b/.test(r.origen) && toSlug(r.destino) === slug);
}

/** FAQs come from Supabase; re-render at most hourly instead of per request. */
export const revalidate = 3600;

const HERO_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/hero-ruta-pacifico.webp";
const LIR_AIRPORT_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/aeropuerto-LIR-guanacaste.webp";
const TAMARINDO_BEACH_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/tamarindo-Costa-rica.jpg";
const CONCHAL_BEACH_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/Conchal-beach-guanacaste.webp";
const NOSARA_BEACH_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/nosara-beach-surf-guanacaste.jpg";

/**
 * Styling and icons of the three service cards; their copy lives in
 * HOME[locale].services.cards, in the same order.
 */
const SERVICE_CARD_STYLES = [
  {
    gradient: "from-sunset-orange to-sunset-red",
    shadowColor: "hover:shadow-sunset-orange/20",
    tagBg: "bg-sunset-orange/10",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
    ) },
  {
    gradient: "from-sunset-gold to-sunset-orange",
    shadowColor: "hover:shadow-sunset-gold/20",
    tagBg: "bg-sunset-gold/10",
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </>
    ) },
  {
    gradient: "from-foreground to-foreground/80",
    shadowColor: "hover:shadow-foreground/10",
    tagBg: "bg-foreground/5",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
    ) },
];

/**
 * Photos of the three "What's your plan" cards; their copy lives in
 * HOME[locale].plan.cards, in the same order. The last card spans two
 * columns on tablet so the row stays balanced.
 */
const PLAN_CARD_MEDIA = [
  { image: TAMARINDO_BEACH_URL, wide: false },
  { image: CONCHAL_BEACH_URL, wide: false },
  { image: NOSARA_BEACH_URL, wide: true },
];

function StarDivider() {
  return (
    <div className="flex items-center justify-center gap-3 text-sunset-orange/40">
      <div className="h-px w-12 bg-sunset-orange/30" />
      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <div className="h-px w-12 bg-sunset-orange/30" />
    </div>
  );
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const locale = await localeFromParams(params);
  const t = HOME[locale];
  const [faqs, routes] = await Promise.all([getFeaturedFaqs(8, locale), getRoutes()]);
  return (
    <main>
      {/* ─── NAV ─── */}
      <SiteNav transparent />

      {/* ─── HERO ─── */}
      <section className="relative flex min-h-screen items-center overflow-hidden">
        <Image src={HERO_URL} alt={t.hero.imageAlt} fill className="object-cover" priority unoptimized />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 pt-28 pb-16 lg:grid-cols-2 lg:gap-12 lg:pt-0 lg:pb-0">
          <div>
            <div className="mb-6"><GoogleReviewBadge locale={locale} /></div>
            <h1 className="text-[2rem] font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t.hero.titleLead}{" "}
              <span className="bg-gradient-to-r from-sunset-gold via-sunset-orange to-sunset-red bg-clip-text text-transparent">
                {t.hero.titleAccent}
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-base text-white/80 sm:text-lg">
              {t.hero.subtitle}
            </p>
            {/* Mobile / tablet CTA — the desktop CTA lives next to the logo. */}
            <Link
              href="/private-shuttle"
              className="mt-7 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-sunset-red via-sunset-orange to-sunset-gold px-8 py-4 text-base font-bold text-white shadow-lg shadow-sunset-orange/25 transition hover:shadow-xl hover:shadow-sunset-orange/40 sm:px-10 sm:py-4 lg:hidden"
            >
              {t.hero.cta}
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
          <div className="hidden lg:flex flex-col items-center justify-center gap-8">
            <Image src={LOGO_URL} alt="Ruta Pacifico" width={480} height={200} className="w-full max-w-md drop-shadow-2xl" unoptimized />
            <Link
              href="/private-shuttle"
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-sunset-red via-sunset-orange to-sunset-gold px-14 py-5 text-lg font-bold text-white shadow-lg shadow-sunset-orange/25 transition-all duration-300 hover:shadow-2xl hover:shadow-sunset-orange/40 hover:scale-105"
            >
              {/* Layered wave decoration */}
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 300 60" preserveAspectRatio="none">
                <path d="M0 45 C40 55, 80 35, 120 45 C160 55, 200 35, 240 45 C260 50, 280 40, 300 45 L300 60 L0 60 Z" fill="white" opacity="0.08" />
                <path d="M0 50 C50 40, 100 55, 150 48 C200 40, 250 55, 300 50 L300 60 L0 60 Z" fill="white" opacity="0.06" />
              </svg>
              {/* Sun circle accent */}
              <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full bg-sunset-gold/20 blur-xl transition-all duration-300 group-hover:bg-sunset-gold/30 group-hover:scale-150" />
              <span className="relative flex items-center gap-3">
                {t.hero.cta}
                <svg className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </Link>
          </div>
        </div>


        {/* Photo caption */}
        <div className="pointer-events-none absolute bottom-5 right-5 z-10 flex items-center gap-2 rounded-full border border-white/20 bg-black/35 px-3.5 py-2 text-xs font-medium tracking-wide text-white/90 backdrop-blur-sm sm:bottom-6 sm:right-6 sm:text-sm">
          <svg className="h-4 w-4 text-sunset-gold" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
          {t.hero.photoCaption}
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      <section id="services" className="relative overflow-hidden bg-white py-16 sm:py-24">
        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-sunset-orange/5 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-sunset-gold/5 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="text-center">
            <StarDivider />
            <h2 className="mt-6 text-3xl font-bold text-foreground sm:text-4xl">
              {t.services.titleLead}{" "}
              <span className="bg-gradient-to-r from-sunset-gold to-sunset-orange bg-clip-text text-transparent">
                {t.services.titleAccent}
              </span>
              {t.services.titleTail}
            </h2>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {t.services.cards.map((card, i) => {
              const style = SERVICE_CARD_STYLES[i];
              return (
                <div key={card.title} className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${style.gradient} p-[1px] transition hover:shadow-xl ${style.shadowColor}`}>
                  <div className="relative flex h-full flex-col rounded-[calc(1.5rem-1px)] bg-white p-8">
                    {/* Icon */}
                    <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${style.gradient} text-white shadow-md`}>
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        {style.icon}
                      </svg>
                    </div>
                    {/* Title */}
                    <h3 className="text-xl font-bold text-foreground">{card.title}</h3>
                    {/* Description — flex-1 so all cards align tags at the same height */}
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/60">
                      {card.desc}
                    </p>
                    {/* Tags */}
                    <div className="mt-6 flex flex-wrap gap-2">
                      {card.tags.map((tag) => (
                        <span key={tag} className={`rounded-full ${style.tagBg} px-3 py-1 text-xs font-semibold text-sunset-orange`}>{tag}</span>
                      ))}
                    </div>
                    {/* CTA */}
                    <Link href="/private-shuttle" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-sunset-orange transition hover:text-sunset-red">
                      {t.services.cta}
                      <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── WHAT'S YOUR PLAN? ─── */}
      <section className="border-t border-black/5 bg-light-surface py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <StarDivider />
            <h2 className="mt-6 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              {t.plan.titleLead}{" "}
              <span className="bg-gradient-to-r from-sunset-gold via-sunset-orange to-sunset-red bg-clip-text text-transparent">
                {t.plan.titleAccent}
              </span>
              {t.plan.titleTail}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-foreground/60">
              {t.plan.subtitle}
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {t.plan.cards.map((card, i) => {
              const media = PLAN_CARD_MEDIA[i];
              return (
                <div
                  key={card.name}
                  className={`group relative overflow-hidden rounded-3xl shadow-lg transition hover:-translate-y-1 hover:shadow-2xl${media.wide ? " sm:col-span-2 lg:col-span-1" : ""}`}
                >
                  <div className="relative aspect-[3/4]">
                    <Image src={media.image} alt={card.alt} fill className="object-cover transition duration-500 group-hover:scale-105" unoptimized />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <span className="inline-block rounded-full bg-sunset-orange/90 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-white">
                      {card.badge}
                    </span>
                    <h3 className="mt-3 text-2xl font-bold text-white">{card.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/80">
                      {card.desc}
                    </p>
                    <Link href="/private-shuttle" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-sunset-gold transition hover:text-white">
                      {t.plan.cta}
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── WHY US ─── */}
      <section className="border-t border-black/5 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <StarDivider />
            <h2 className="mt-6 text-3xl font-bold text-foreground sm:text-4xl">
              {t.included.title}
            </h2>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {t.included.features.map((feature) => (
              <div key={feature.title} className="flex gap-4 rounded-xl border border-black/5 bg-white p-6 shadow-sm">
                <div className="mt-0.5 shrink-0 text-sunset-orange">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-1 text-sm text-foreground/60">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FLEET ─── */}
      <section className="bg-light-surface py-16 sm:py-24 border-t border-black/5">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <StarDivider />
            <h2 className="mt-6 text-3xl font-bold text-foreground sm:text-4xl">
              {t.fleet.title}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-foreground/60">
              {t.fleet.subtitle}
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {VEHICLE_TIERS.map((tier) => (
              <div
                key={tier.key}
                className="group rounded-3xl border border-black/5 bg-white p-6 text-center shadow-sm transition hover:shadow-lg"
              >
                <div className="relative mx-auto h-48 w-full">
                  <Image
                    src={tier.image}
                    alt={t.fleet.imageAlt(tier.name)}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <div className="mt-4">
                  <span className="inline-block rounded-full bg-sunset-orange/10 px-4 py-1 text-sm font-semibold text-sunset-orange">
                    {vehicleTierCopy(tier.key, locale).paxLabel}
                  </span>
                  <h3 className="mt-3 text-xl font-bold text-foreground">
                    {tier.name}
                  </h3>
                  <p className="text-sm text-foreground/50">{t.fleet.orSimilar}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LIBERIA AIRPORT ─── */}
      <section id="airport" className="relative overflow-hidden bg-white border-t border-black/5 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <StarDivider />
            <h2 className="mt-6 text-3xl font-bold text-foreground sm:text-4xl">
              {t.airport.titleLead}{" "}
              <span className="bg-gradient-to-r from-sunset-gold to-sunset-orange bg-clip-text text-transparent">
                {t.airport.titleAccent}
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-foreground/60">
              {t.airport.subtitle}
            </p>
          </div>

          <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
            {/* Airport photo */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lg">
              <Image
                src={LIR_AIRPORT_URL}
                alt={t.airport.imageAlt}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <span className="rounded-full bg-sunset-orange px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                  LIR
                </span>
                <span className="text-sm font-semibold text-white drop-shadow-md">
                  {t.airport.photoName}
                </span>
              </div>
            </div>

            {/* Airport info */}
            <div>
              <span className="inline-block rounded-full border border-sunset-orange/20 bg-sunset-orange/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sunset-orange">
                {t.airport.pill}
              </span>
              <h3 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl">
                {t.airport.heading}
              </h3>
              <p className="mt-4 leading-relaxed text-foreground/70">
                {t.airport.p1}
              </p>
              <p className="mt-3 leading-relaxed text-foreground/70">
                {t.airport.p2}
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {t.airport.times.map((item) => (
                  <div key={item.route} className="flex items-center justify-between rounded-lg border border-black/5 bg-light-surface px-4 py-3">
                    <span className="text-sm font-medium text-foreground">{item.route}</span>
                    <span className="text-sm font-semibold text-sunset-orange">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── GUANACASTE + BEACHES (merged mega section) ─── */}
      <section
        id="guanacaste"
        className="relative overflow-hidden border-t border-black/5 bg-gradient-to-b from-white via-light-surface to-white py-16 sm:py-24"
      >
        {/* Decorative beach backdrop */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-[0.08]">
          <Image src={HERO_URL} alt="" fill className="object-cover" unoptimized />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
        </div>
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-sunset-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-1/4 h-72 w-72 rounded-full bg-sunset-orange/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6">
          {/* Header */}
          <div className="text-center">
            <StarDivider />
            <h2 className="mt-6 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              {t.guanacaste.titleLead}{" "}
              <span className="bg-gradient-to-r from-sunset-gold via-sunset-orange to-sunset-red bg-clip-text text-transparent">
                {t.guanacaste.titleAccent}
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-foreground/60">
              {t.guanacaste.subtitle}
            </p>
          </div>

          {/* Stats row */}
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {t.guanacaste.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-black/5 bg-white/70 p-4 text-center shadow-sm backdrop-blur-sm"
              >
                <div className="text-2xl font-bold text-sunset-orange">{stat.value}</div>
                <div className="mt-1 text-xs text-foreground/50">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Gallery + narrative */}
          <div className="mt-16 grid items-center gap-10 lg:grid-cols-2">
            <GuanacasteGallery />

            <div>
              <span className="inline-block rounded-full border border-sunset-orange/20 bg-sunset-orange/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sunset-orange">
                {t.guanacaste.pill}
              </span>
              <h3 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl">
                {t.guanacaste.heading}
              </h3>
              <p className="mt-4 leading-relaxed text-foreground/70">
                {t.guanacaste.p1}
              </p>
              <p className="mt-4 leading-relaxed text-foreground/70">
                {t.guanacaste.p2}
              </p>
              <p className="mt-4 leading-relaxed text-foreground/70">
                {t.guanacaste.p3}
              </p>
            </div>
          </div>

          {/* Beaches we serve */}
          <div className="mt-24">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground sm:text-3xl">
                {t.beaches.titleLead}{" "}
                <span className="bg-gradient-to-r from-sunset-gold to-sunset-orange bg-clip-text text-transparent">
                  {t.beaches.titleAccent}
                </span>
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-sm text-foreground/60">
                {t.beaches.subtitle}
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {t.beaches.cards.map((beach) => {
                const route = lirRouteTo(routes, beach.slug);
                const price = route ? lowestPrice(route) : null;
                const card = (
                  <>
                    <div className="absolute right-4 top-4 text-sunset-orange/20 transition group-hover:text-sunset-orange/40">
                      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                      </svg>
                    </div>
                    <div className="text-lg font-bold text-foreground">{beach.name}</div>
                    <div className="mt-1 text-sm font-medium text-sunset-orange">{beach.tag}</div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5 text-xs text-foreground/40">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        {beach.from}
                      </div>
                      {price ? (
                        <div className="text-right leading-none">
                          <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-foreground/40">{t.beaches.fromLabel}</span>
                          <span className="text-lg font-extrabold text-foreground">{`$${price}`}</span>
                          <span className="block text-[0.6rem] text-foreground/40">{t.beaches.perVehicle}</span>
                        </div>
                      ) : null}
                    </div>
                  </>
                );
                const className =
                  "group relative block overflow-hidden rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-sunset-orange/30 hover:shadow-lg";
                return route ? (
                  <Link
                    key={beach.name}
                    href={`/private-shuttle/${routeSlug(route.origen, route.destino)}`}
                    className={className}
                    aria-label={t.beaches.cardLabel(beach.name, price)}
                  >
                    {card}
                  </Link>
                ) : (
                  <div key={beach.name} className={className}>
                    {card}
                  </div>
                );
              })}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/private-shuttle"
                className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-sunset-red via-sunset-orange to-sunset-gold px-8 py-4 text-base font-bold text-white shadow-lg shadow-sunset-orange/25 transition hover:shadow-xl hover:shadow-sunset-orange/40 hover:scale-[1.01]"
              >
                {t.beaches.cta}
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <p className="mt-3 text-xs text-foreground/40">
                {t.beaches.priceListLead}{" "}
                <Link href={PRICE_LIST_PATH} className="font-semibold text-sunset-orange hover:text-sunset-red">
                  {t.beaches.priceListLink}
                </Link>
                {t.beaches.priceListTail}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      {faqs.length ? (
        <section className="border-t border-black/5 bg-white py-16 sm:py-24">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                ...faqPageJsonLd(`${localeUrl(locale, "/")}#faq`, faqs),
                inLanguage: IN_LANGUAGE[locale] }) }}
          />
          <div className="mx-auto max-w-3xl px-6">
            <div className="text-center">
              <StarDivider />
              <h2 className="mt-6 text-3xl font-bold text-foreground sm:text-4xl">
                {t.faq.title}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-foreground/60">
                {t.faq.subtitle}
              </p>
            </div>
            <div className="mt-10">
              <FaqAccordion faqs={faqs} />
            </div>
            <div className="mt-6 text-center">
              <Link
                href="/faq"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-sunset-orange transition hover:text-sunset-red"
              >
                {t.faq.cta}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* ─── ABOUT & CONTACT ─── */}
      <section id="about" className="border-t border-black/5 bg-light-surface py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <StarDivider />
            <h2 className="mt-6 text-3xl font-bold text-foreground sm:text-4xl">
              {t.about.titleLead}{" "}
              <span className="bg-gradient-to-r from-sunset-gold to-sunset-orange bg-clip-text text-transparent">
                {t.about.titleAccent}
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-foreground/60">
              {t.about.subtitle}
            </p>
          </div>

          <div className="mt-16 grid gap-10 lg:grid-cols-2">
            {/* About copy */}
            <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm sm:p-10">
              <span className="inline-block rounded-full border border-sunset-orange/20 bg-sunset-orange/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sunset-orange">
                {t.about.pill}
              </span>
              <h3 className="mt-4 text-2xl font-bold text-foreground">
                {t.about.heading}
              </h3>
              <p className="mt-4 leading-relaxed text-foreground/70">
                {t.about.p1}
              </p>
              <p className="mt-4 leading-relaxed text-foreground/70">
                {t.about.p2}
              </p>
              <ul className="mt-6 grid gap-3 text-sm text-foreground/70 sm:grid-cols-2">
                {t.about.bullets.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact methods */}
            <div className="space-y-4">
              <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm transition hover:shadow-md sm:p-7">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-500 text-white">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.553 4.116 1.519 5.848L.058 23.306a.5.5 0 00.636.636l5.458-1.461A11.948 11.948 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.94 0-3.753-.563-5.28-1.532l-.368-.224-3.821 1.023 1.023-3.821-.224-.368A9.935 9.935 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold uppercase tracking-wider text-foreground/40">
                      {t.about.whatsapp}
                    </div>
                    <a
                      href="https://wa.me/50670805578"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block text-lg font-bold text-foreground transition hover:text-sunset-orange"
                    >
                      +506 7080 5578
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm transition hover:shadow-md sm:p-7">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sunset-orange text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold uppercase tracking-wider text-foreground/40">
                      {t.about.email}
                    </div>
                    <a
                      href="mailto:reservations@rutapacifico.com"
                      className="mt-1 block break-all text-lg font-bold text-foreground transition hover:text-sunset-orange"
                    >
                      reservations@rutapacifico.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm transition hover:shadow-md sm:p-7">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sunset-gold to-sunset-orange text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold uppercase tracking-wider text-foreground/40">
                      {t.about.follow}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-base font-bold text-foreground">
                      <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="transition hover:text-sunset-orange">
                        Instagram
                      </a>
                      <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="transition hover:text-sunset-orange">
                        Facebook
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sunset-orange/10 text-sunset-orange">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-foreground/40">
                    {t.about.hours}
                  </div>
                  <div className="mt-1 text-sm font-bold text-foreground">
                    {t.about.hoursValue}
                  </div>
                  <div className="text-xs text-foreground/50">
                    {t.about.hoursNote}
                  </div>
                </div>
                <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sunset-orange/10 text-sunset-orange">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-foreground/40">
                    {t.about.basedIn}
                  </div>
                  <div className="mt-1 text-sm font-bold text-foreground">
                    Liberia, Guanacaste
                  </div>
                  <div className="text-xs text-foreground/50">Costa Rica</div>
                </div>
              </div>

              <Link
                href="/private-shuttle"
                className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-sunset-red via-sunset-orange to-sunset-gold px-8 py-4 text-base font-bold text-white shadow-lg shadow-sunset-orange/25 transition hover:shadow-xl hover:shadow-sunset-orange/40 hover:scale-[1.01]"
              >
                {t.about.cta}
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <SiteFooter locale={locale} />
    </main>
  );
}
