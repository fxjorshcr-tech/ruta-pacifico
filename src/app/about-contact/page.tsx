import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";

const HERO_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/hero-ruta-pacifico.webp";
const LOGO_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/Logo%20Transparente.png";

const WHATSAPP_NUMBER_DISPLAY = "+506 8596-2438";
const WHATSAPP_NUMBER_RAW = "50685962438";
const RESERVATIONS_EMAIL = "reservations@rutapacifico.com";
const ICT_LICENSE = "#4121-2025";

export const metadata: Metadata = {
  title: "About & Contact Us",
  description:
    "Ruta Pacifico is a licensed private ground transportation operator in Guanacaste, Costa Rica. Contact us via WhatsApp or email for reservations and inquiries.",
  alternates: {
    canonical: "/about-contact",
  },
  openGraph: {
    title: "About & Contact Us | Ruta Pacifico",
    description:
      "Get in touch with Ruta Pacifico — licensed ICT operator for private shuttles across Guanacaste and Costa Rica.",
    url: "/about-contact",
  },
};

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

export default function AboutContactPage() {
  return (
    <main className="min-h-screen bg-light-surface">
      <SiteNav transparent />

      {/* ─── HERO ─── */}
      <section className="relative flex min-h-[45vh] items-center overflow-hidden">
        <Image
          src={HERO_URL}
          alt="Ruta Pacifico — Costa Rica"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-light-surface via-transparent to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-4xl px-6 pt-24 pb-20 text-center">
          <span className="inline-block rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            About &amp; Contact
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Your private ride across{" "}
            <span className="bg-gradient-to-r from-sunset-gold via-sunset-orange to-sunset-red bg-clip-text text-transparent">
              Costa Rica
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/75">
            Licensed ICT operator {ICT_LICENSE}, based in Guanacaste. Reach us any day
            of the week — we reply fast on WhatsApp.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 pb-24 pt-12">
        {/* ─── ABOUT ─── */}
        <section className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <span className="inline-block rounded-full border border-sunset-orange/20 bg-sunset-orange/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sunset-orange">
              The Company
            </span>
            <h2 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl">
              Private ground transportation, done right
            </h2>
            <p className="mt-4 leading-relaxed text-foreground/70">
              Ruta Pacifico is a fully licensed and insured ground transportation
              operator headquartered in Guanacaste. We specialize in private airport
              transfers from Liberia International Airport (LIR) and point-to-point
              shuttle service to beach towns, resorts, volcanoes, and cities
              throughout Costa Rica.
            </p>
            <p className="mt-4 leading-relaxed text-foreground/70">
              Every ride is operated by a professional bilingual driver in a modern
              air-conditioned vehicle. Incoming flights are monitored in real time,
              pricing is fixed in advance and inclusive of all taxes and tolls, and
              each reservation is exclusive to your party — no sharing, no detours.
            </p>

            <ul className="mt-6 grid gap-3 text-sm text-foreground/75 sm:grid-cols-2">
              {[
                "ICT Licensed — certified by the Costa Rica Tourism Board",
                "Fully insured operator",
                "Professional bilingual drivers",
                "Modern, air-conditioned fleet",
                "Real-time flight monitoring",
                "Fixed, all-inclusive pricing",
                "24/7 bilingual support",
                "Door-to-door private service",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <svg
                      className="h-3 w-3"
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
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Credentials card */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-7">
              <Image
                src={LOGO_URL}
                alt="Ruta Pacifico"
                width={280}
                height={90}
                className="h-14 w-auto"
                unoptimized
              />
              <div className="mt-5 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
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
                        d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-foreground/40">
                      ICT License
                    </div>
                    <div className="mt-0.5 font-bold text-foreground">
                      {ICT_LICENSE}
                    </div>
                    <div className="text-xs text-foreground/50">
                      Costa Rica Tourism Board
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sunset-orange/10 text-sunset-orange">
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
                        d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-foreground/40">
                      Based in
                    </div>
                    <div className="mt-0.5 font-bold text-foreground">
                      Liberia, Guanacaste
                    </div>
                    <div className="text-xs text-foreground/50">Costa Rica</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-600">
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
                    <div className="text-xs font-semibold uppercase tracking-wider text-foreground/40">
                      Hours
                    </div>
                    <div className="mt-0.5 font-bold text-foreground">
                      7 days a week
                    </div>
                    <div className="text-xs text-foreground/50">
                      Pickups any hour
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── DIVIDER ─── */}
        <div className="mt-20 text-center">
          <StarDivider />
          <h2 className="mt-6 text-3xl font-bold text-foreground sm:text-4xl">
            Get in{" "}
            <span className="bg-gradient-to-r from-sunset-gold to-sunset-orange bg-clip-text text-transparent">
              touch
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-foreground/60">
            For reservations, changes, or questions — WhatsApp is the fastest.
            You&apos;ll hear back within minutes during daytime hours.
          </p>
        </div>

        {/* ─── CONTACT METHODS ─── */}
        <section className="mt-10 grid gap-5 lg:grid-cols-2">
          {/* WhatsApp */}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER_RAW}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-3xl border border-black/5 bg-white p-7 shadow-sm transition hover:-translate-y-0.5 hover:border-green-500/30 hover:shadow-lg"
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-green-500/5 blur-2xl transition group-hover:bg-green-500/10" />
            <div className="relative flex items-start gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-500 text-white shadow-md shadow-green-500/20">
                <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.553 4.116 1.519 5.848L.058 23.306a.5.5 0 00.636.636l5.458-1.461A11.948 11.948 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.94 0-3.753-.563-5.28-1.532l-.368-.224-3.821 1.023 1.023-3.821-.224-.368A9.935 9.935 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-green-600">
                    WhatsApp
                  </span>
                  <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-green-600">
                    Fastest
                  </span>
                </div>
                <div className="mt-1 text-xl font-bold text-foreground transition group-hover:text-green-600 sm:text-2xl">
                  {WHATSAPP_NUMBER_DISPLAY}
                </div>
                <p className="mt-2 text-sm text-foreground/60">
                  Tap to open a chat — reservations, changes, and real-time driver
                  updates.
                </p>
              </div>
              <svg
                className="mt-2 h-5 w-5 shrink-0 text-foreground/30 transition group-hover:translate-x-1 group-hover:text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </div>
          </a>

          {/* Email */}
          <a
            href={`mailto:${RESERVATIONS_EMAIL}`}
            className="group relative overflow-hidden rounded-3xl border border-black/5 bg-white p-7 shadow-sm transition hover:-translate-y-0.5 hover:border-sunset-orange/30 hover:shadow-lg"
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-sunset-orange/5 blur-2xl transition group-hover:bg-sunset-orange/10" />
            <div className="relative flex items-start gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sunset-orange text-white shadow-md shadow-sunset-orange/20">
                <svg
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-sunset-orange">
                  Email
                </span>
                <div className="mt-1 break-all text-xl font-bold text-foreground transition group-hover:text-sunset-orange sm:text-2xl">
                  {RESERVATIONS_EMAIL}
                </div>
                <p className="mt-2 text-sm text-foreground/60">
                  For reservations, invoices, and detailed itinerary requests.
                </p>
              </div>
              <svg
                className="mt-2 h-5 w-5 shrink-0 text-foreground/30 transition group-hover:translate-x-1 group-hover:text-sunset-orange"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </div>
          </a>
        </section>

        {/* ─── CTA ─── */}
        <section className="mt-14 overflow-hidden rounded-3xl bg-gradient-to-br from-sunset-red via-sunset-orange to-sunset-gold p-[1px]">
          <div className="relative rounded-[calc(1.5rem-1px)] bg-foreground p-8 text-center sm:p-12">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sunset-orange/20 blur-3xl" />
            <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-sunset-gold/15 blur-3xl" />
            <h2 className="relative text-2xl font-bold text-white sm:text-3xl">
              Ready to book your private shuttle?
            </h2>
            <p className="relative mx-auto mt-3 max-w-xl text-sm text-white/70">
              Instant pricing, flight monitoring included, no hidden fees. Pay via
              secure link once your reservation is confirmed.
            </p>
            <div className="relative mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/private-shuttle"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-sunset-red via-sunset-orange to-sunset-gold px-8 py-4 text-base font-bold text-white shadow-lg shadow-sunset-orange/25 transition hover:shadow-xl hover:shadow-sunset-orange/40 hover:scale-[1.01]"
              >
                Book your shuttle
                <svg
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
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
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER_RAW}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/25 hover:bg-white/10"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.553 4.116 1.519 5.848L.058 23.306a.5.5 0 00.636.636l5.458-1.461A11.948 11.948 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.94 0-3.753-.563-5.28-1.532l-.368-.224-3.821 1.023 1.023-3.821-.224-.368A9.935 9.935 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* ─── ICT BADGE FOOTER ─── */}
        <div className="mt-10 flex items-center justify-center">
          <div className="inline-flex items-center gap-3 rounded-2xl border border-black/5 bg-white px-5 py-3 shadow-sm">
            <svg
              className="h-5 w-5 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
              />
            </svg>
            <div className="text-left leading-tight">
              <div className="text-sm font-bold text-foreground">
                ICT Licensed {ICT_LICENSE}
              </div>
              <div className="text-xs text-foreground/50">
                Costa Rica Tourism Board
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
