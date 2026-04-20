import Image from "next/image";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import GuanacasteGallery from "@/components/GuanacasteGallery";

const LOGO_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/Logo%20Transparente.png";
const HERO_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/hero-ruta-pacifico.webp";
const BEACH_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/guanacaste-beach.webp";
const TAMARINDO_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/playa_tamarindo_kristen_brown.jpg";
const WATERFALL_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/llanos-de-cortes-waterfall-drone-.jpg";
const CULTURE_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/costa_rica_guanacaste_annexation_day_celebration_01-1024x574.png";
const AIRPORT_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/Panorama-Frente-ultimo-111.jpg";
const STARIA_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/staria-smallMobile.webp";
const HIACE_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/hiace-van-cwt.png";
const MAXUS_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/maxus-deviver-9-cwt-removebg-preview.png";
const LIR_AIRPORT_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/aeropuerto-LIR-guanacaste.webp";
const TAMARINDO_BEACH_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/tamarindo-Costa-rica.jpg";
const CONCHAL_BEACH_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/Conchal-beach-guanacaste.webp";
const NOSARA_BEACH_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/nosara-beach-surf-guanacaste.jpg";

function GoogleReviewBadge() {
  return (
    <div className="inline-flex items-center gap-2.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 px-5 py-2.5">
      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
      <div className="flex items-center gap-1">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-sm font-semibold text-white">5.0</span>
        <span className="text-sm text-white/60">on Google Reviews</span>
      </div>
    </div>
  );
}

function GoogleReviewBadgeLight() {
  return (
    <div className="inline-flex items-center gap-2.5 rounded-full bg-white border border-black/10 px-5 py-2.5 shadow-sm">
      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
      <div className="flex items-center gap-1">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-sm font-semibold text-foreground">5.0</span>
        <span className="text-sm text-foreground/50">on Google Reviews</span>
      </div>
    </div>
  );
}

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

export default function Home() {
  return (
    <main>
      {/* ─── NAV ─── */}
      <SiteNav transparent />

      {/* ─── HERO ─── */}
      <section className="relative flex min-h-screen items-center overflow-hidden">
        <Image src={AIRPORT_URL} alt="Daniel Oduber Quirós International Airport (LIR), Liberia, Costa Rica" fill className="object-cover" priority unoptimized />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 pt-28 pb-16 lg:grid-cols-2 lg:gap-12 lg:pt-0 lg:pb-0">
          <div>
            <div className="mb-6"><GoogleReviewBadge /></div>
            <h1 className="text-[2rem] font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Private Shuttles from{" "}
              <span className="bg-gradient-to-r from-sunset-gold via-sunset-orange to-sunset-red bg-clip-text text-transparent">
                Liberia Airport
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-base text-white/80 sm:text-lg">
              Private airport shuttles from LIR to Tamarindo, Flamingo, Papagayo, Nosara &amp; every beach on the Golden Coast of Costa Rica.
            </p>
            {/* Mobile / tablet CTA — the desktop CTA lives next to the logo. */}
            <Link
              href="/private-shuttle"
              className="mt-7 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-sunset-red via-sunset-orange to-sunset-gold px-8 py-4 text-base font-bold text-white shadow-lg shadow-sunset-orange/25 transition hover:shadow-xl hover:shadow-sunset-orange/40 sm:px-10 sm:py-4 lg:hidden"
            >
              Book Your Shuttle
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
          <div className="hidden lg:flex flex-col items-center justify-center gap-8">
            <Image src={LOGO_URL} alt="Ruta Pacifico" width={500} height={300} className="w-full max-w-md drop-shadow-2xl" unoptimized />
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
                Book Your Shuttle
                <svg className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </Link>
          </div>
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
              Where Are You{" "}
              <span className="bg-gradient-to-r from-sunset-gold to-sunset-orange bg-clip-text text-transparent">
                Headed
              </span>
              ?
            </h2>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {[
              {
                title: "From LIR Airport",
                desc: "We pick you up at Liberia Airport (LIR) and drive you straight to any beach, resort, or town in Guanacaste — and also to La Fortuna, Monteverde, or anywhere else your trip takes you. We track your flight in real time and your driver is waiting at arrivals.",
                tags: ["Tamarindo", "Flamingo", "Papagayo", "Nosara", "Conchal", "La Fortuna", "Monteverde"],
                gradient: "from-sunset-orange to-sunset-red",
                shadowColor: "hover:shadow-sunset-orange/20",
                tagBg: "bg-sunset-orange/10",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                ),
              },
              {
                title: "Between Beaches",
                desc: "Private rides connecting every coastal town in Guanacaste. Tamarindo to Flamingo, Conchal to Nosara, Papagayo to S\u00e1mara — one-way transfers, round trips, or full-day trips along the coast. Same driver, same vehicle, at your own pace.",
                tags: ["One-way", "Round-trip", "Full-day", "Tamarindo", "Flamingo", "Nosara", "Conchal"],
                gradient: "from-sunset-gold to-sunset-orange",
                shadowColor: "hover:shadow-sunset-gold/20",
                tagBg: "bg-sunset-gold/10",
                icon: (
                  <>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </>
                ),
              },
              {
                title: "Across Costa Rica",
                desc: "Long-distance private shuttles from Guanacaste to La Fortuna, Monteverde, Manuel Antonio, San Jos\u00e9, and other regions of Costa Rica. Also available between destinations — La Fortuna to Manuel Antonio, Monteverde to Arenal, and any combination.",
                tags: ["La Fortuna", "Monteverde", "Manuel Antonio", "San Jos\u00e9", "Arenal"],
                gradient: "from-foreground to-foreground/80",
                shadowColor: "hover:shadow-foreground/10",
                tagBg: "bg-foreground/5",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
                ),
              },
            ].map((card) => (
              <div key={card.title} className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${card.gradient} p-[1px] transition hover:shadow-xl ${card.shadowColor}`}>
                <div className="relative flex h-full flex-col rounded-[calc(1.5rem-1px)] bg-white p-8">
                  {/* Icon */}
                  <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} text-white shadow-md`}>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      {card.icon}
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
                      <span key={tag} className={`rounded-full ${card.tagBg} px-3 py-1 text-xs font-semibold text-sunset-orange`}>{tag}</span>
                    ))}
                  </div>
                  {/* CTA */}
                  <Link href="/private-shuttle" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-sunset-orange transition hover:text-sunset-red">
                    Book this shuttle
                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHAT'S YOUR PLAN? ─── */}
      <section className="border-t border-black/5 bg-light-surface py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <StarDivider />
            <h2 className="mt-6 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              What&apos;s Your Plan in{" "}
              <span className="bg-gradient-to-r from-sunset-gold via-sunset-orange to-sunset-red bg-clip-text text-transparent">
                Guanacaste
              </span>
              ?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-foreground/60">
              World-class surf, white-sand hideaways, or vibrant beach-town nights — wherever you&apos;re headed, we&apos;ll get you there from the airport.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Tamarindo */}
            <div className="group relative overflow-hidden rounded-3xl shadow-lg transition hover:-translate-y-1 hover:shadow-2xl">
              <div className="relative aspect-[3/4]">
                <Image src={TAMARINDO_BEACH_URL} alt="Tamarindo Beach, Guanacaste" fill className="object-cover transition duration-500 group-hover:scale-105" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6">
                <span className="inline-block rounded-full bg-sunset-orange/90 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-white">
                  ~50 min from LIR
                </span>
                <h3 className="mt-3 text-2xl font-bold text-white">Tamarindo</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/80">
                  The beating heart of Guanacaste nightlife. Great surf by day, craft cocktails by night, and a beach-town energy that keeps people coming back year after year.
                </p>
                <Link href="/private-shuttle" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-sunset-gold transition hover:text-white">
                  Book a shuttle
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Conchal */}
            <div className="group relative overflow-hidden rounded-3xl shadow-lg transition hover:-translate-y-1 hover:shadow-2xl">
              <div className="relative aspect-[3/4]">
                <Image src={CONCHAL_BEACH_URL} alt="Playa Conchal, Guanacaste" fill className="object-cover transition duration-500 group-hover:scale-105" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6">
                <span className="inline-block rounded-full bg-sunset-orange/90 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-white">
                  ~1 hr from LIR
                </span>
                <h3 className="mt-3 text-2xl font-bold text-white">Conchal</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/80">
                  Crushed-shell shores and crystal-clear turquoise water. A peaceful paradise surrounded by luxury resorts — perfect for those who want beauty without the crowds.
                </p>
                <Link href="/private-shuttle" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-sunset-gold transition hover:text-white">
                  Book a shuttle
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Nosara */}
            <div className="group relative overflow-hidden rounded-3xl shadow-lg transition hover:-translate-y-1 hover:shadow-2xl sm:col-span-2 lg:col-span-1">
              <div className="relative aspect-[3/4]">
                <Image src={NOSARA_BEACH_URL} alt="Nosara Beach, Guanacaste" fill className="object-cover transition duration-500 group-hover:scale-105" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6">
                <span className="inline-block rounded-full bg-sunset-orange/90 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-white">
                  ~2 hrs from LIR
                </span>
                <h3 className="mt-3 text-2xl font-bold text-white">Nosara</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/80">
                  Where the jungle meets world-class surf breaks. A haven for yogis, surfers, and anyone looking to reconnect with nature on Costa Rica&apos;s wildest coast.
                </p>
                <Link href="/private-shuttle" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-sunset-gold transition hover:text-white">
                  Book a shuttle
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHY US ─── */}
      <section className="border-t border-black/5 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <StarDivider />
            <h2 className="mt-6 text-3xl font-bold text-foreground sm:text-4xl">
              What&apos;s Included in Every Private Shuttle
            </h2>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Experienced Drivers", desc: "Professional drivers with years of experience on Guanacaste roads and mountain routes." },
              { title: "Comfortable Vehicles", desc: "Air-conditioned SUVs and vans with Wi-Fi and cold water on board." },
              { title: "Fixed Rates", desc: "The price you see when you book is the price you pay. Fuel, tolls, and taxes included." },
              { title: "Real-Time Flight Tracking", desc: "We monitor your flight status and adjust the pickup time if it arrives early or late." },
              { title: "English & Spanish", desc: "All drivers are bilingual and happy to share tips about the region." },
              { title: "Door-to-Door", desc: "Pickup at the terminal exit, drop-off at your accommodation entrance." },
            ].map((feature) => (
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
              Our Fleet
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-foreground/60">
              Modern, air-conditioned vehicles for every group size. All units equipped with Wi-Fi, cold water, and plenty of luggage space.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Staria */}
            <div className="group rounded-3xl border border-black/5 bg-white p-6 text-center shadow-sm transition hover:shadow-lg">
              <div className="relative mx-auto h-48 w-full">
                <Image src={STARIA_URL} alt="Hyundai Staria or similar" fill className="object-contain" unoptimized />
              </div>
              <div className="mt-4">
                <span className="inline-block rounded-full bg-sunset-orange/10 px-4 py-1 text-sm font-semibold text-sunset-orange">
                  1 – 6 passengers
                </span>
                <h3 className="mt-3 text-xl font-bold text-foreground">Hyundai Staria</h3>
                <p className="text-sm text-foreground/50">or similar</p>
              </div>
            </div>

            {/* Hiace */}
            <div className="group rounded-3xl border border-black/5 bg-white p-6 text-center shadow-sm transition hover:shadow-lg">
              <div className="relative mx-auto h-48 w-full">
                <Image src={HIACE_URL} alt="Toyota Hiace or similar" fill className="object-contain" unoptimized />
              </div>
              <div className="mt-4">
                <span className="inline-block rounded-full bg-sunset-orange/10 px-4 py-1 text-sm font-semibold text-sunset-orange">
                  7 – 9 passengers
                </span>
                <h3 className="mt-3 text-xl font-bold text-foreground">Toyota Hiace</h3>
                <p className="text-sm text-foreground/50">or similar</p>
              </div>
            </div>

            {/* Maxus */}
            <div className="group rounded-3xl border border-black/5 bg-white p-6 text-center shadow-sm transition hover:shadow-lg">
              <div className="relative mx-auto h-48 w-full">
                <Image src={MAXUS_URL} alt="Maxus V90 or similar" fill className="object-contain" unoptimized />
              </div>
              <div className="mt-4">
                <span className="inline-block rounded-full bg-sunset-orange/10 px-4 py-1 text-sm font-semibold text-sunset-orange">
                  10 – 12 passengers
                </span>
                <h3 className="mt-3 text-xl font-bold text-foreground">Maxus V90</h3>
                <p className="text-sm text-foreground/50">or similar</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LIBERIA AIRPORT ─── */}
      <section id="airport" className="relative overflow-hidden bg-white border-t border-black/5 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <StarDivider />
            <h2 className="mt-6 text-3xl font-bold text-foreground sm:text-4xl">
              Your Gateway to{" "}
              <span className="bg-gradient-to-r from-sunset-gold to-sunset-orange bg-clip-text text-transparent">
                Guanacaste
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-foreground/60">
              Liberia International Airport (LIR) — the closest airport to Costa Rica&apos;s best Pacific beaches. We&apos;ll be waiting for you right outside the terminal.
            </p>
          </div>

          <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
            {/* Airport photo */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lg">
              <Image
                src={LIR_AIRPORT_URL}
                alt="Liberia International Airport (LIR), Guanacaste, Costa Rica"
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
                  Daniel Oduber Quir&oacute;s International
                </span>
              </div>
            </div>

            {/* Airport info */}
            <div>
              <span className="inline-block rounded-full border border-sunset-orange/20 bg-sunset-orange/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sunset-orange">
                Liberia Airport (LIR)
              </span>
              <h3 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl">
                Direct flights from the US &amp; Canada
              </h3>
              <p className="mt-4 leading-relaxed text-foreground/70">
                United, Delta, American, JetBlue, Southwest, and Air Canada fly into LIR year-round from major cities. Just 15 minutes from the city of Liberia, the airport puts you within a short ride of every beach in Guanacaste.
              </p>
              <p className="mt-3 leading-relaxed text-foreground/70">
                We monitor every incoming flight in real time and adjust your pickup if you land early or late. Your driver will be waiting with a sign right at the arrivals exit.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  { route: "LIR → Tamarindo", time: "~50 min" },
                  { route: "LIR → Flamingo / Conchal", time: "~1 hr" },
                  { route: "LIR → Papagayo Peninsula", time: "~30 min" },
                  { route: "LIR → Nosara / Sámara", time: "~2 hrs" },
                ].map((item) => (
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
              Discover{" "}
              <span className="bg-gradient-to-r from-sunset-gold via-sunset-orange to-sunset-red bg-clip-text text-transparent">
                Guanacaste
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-foreground/60">
              Costa Rica&apos;s sunniest province — 600+ km of Pacific coastline, 300+ days of sunshine, volcanoes, and a culture unlike anywhere else.
            </p>
          </div>

          {/* Stats row */}
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {[
              { value: "300+", label: "Sunny days / year" },
              { value: "25–35°C", label: "Avg. temperature" },
              { value: "600+", label: "km of coastline" },
              { value: "4", label: "National parks" },
            ].map((stat) => (
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
                Pacific Paradise
              </span>
              <h3 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl">
                Where the jungle meets the sea
              </h3>
              <p className="mt-4 leading-relaxed text-foreground/70">
                The dry season from November to April makes Guanacaste the perfect winter escape — white-sand coves, surf towns, luxury resorts, and quiet fishing villages, all within a short private-shuttle ride from Liberia Airport (LIR).
              </p>
              <p className="mt-4 leading-relaxed text-foreground/70">
                Inland, you&apos;ll find the Rinc&oacute;n de la Vieja volcano, tropical dry forests, and waterfalls like Llanos de Cort&eacute;s. The only province that celebrates its own annexation day on July 25th — with parades, traditional music, and horseback shows.
              </p>
              <p className="mt-4 leading-relaxed text-foreground/70">
                A top destination for surfing, sport fishing, and diving at the Catalinas Islands.
              </p>
            </div>
          </div>

          {/* Beaches we serve */}
          <div className="mt-24">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground sm:text-3xl">
                Every Beach &amp;{" "}
                <span className="bg-gradient-to-r from-sunset-gold to-sunset-orange bg-clip-text text-transparent">
                  Resort in Guanacaste
                </span>
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-sm text-foreground/60">
                Private shuttle service from LIR to every coastal town, resort, and beach in the province.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { name: "Tamarindo", tag: "Surf & nightlife", from: "~50 min from LIR" },
                { name: "Flamingo / Conchal", tag: "White-sand bays", from: "~1 hr from LIR" },
                { name: "Papagayo Peninsula", tag: "Luxury resorts", from: "~30 min from LIR" },
                { name: "Nosara / Sámara", tag: "Yoga & surf", from: "~2 hrs from LIR" },
                { name: "Playas del Coco", tag: "Lively beach town", from: "~25 min from LIR" },
                { name: "Las Catalinas", tag: "Walkable village", from: "~1 hr from LIR" },
              ].map((beach) => (
                <div
                  key={beach.name}
                  className="group relative overflow-hidden rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-sunset-orange/30 hover:shadow-lg"
                >
                  <div className="absolute right-4 top-4 text-sunset-orange/20 transition group-hover:text-sunset-orange/40">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                  </div>
                  <div className="text-lg font-bold text-foreground">{beach.name}</div>
                  <div className="mt-1 text-sm font-medium text-sunset-orange">{beach.tag}</div>
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-foreground/40">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    {beach.from}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/private-shuttle"
                className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-sunset-red via-sunset-orange to-sunset-gold px-8 py-4 text-base font-bold text-white shadow-lg shadow-sunset-orange/25 transition hover:shadow-xl hover:shadow-sunset-orange/40 hover:scale-[1.01]"
              >
                Find your route &amp; price
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <p className="mt-3 text-xs text-foreground/40">
                Search any destination on our booking page.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ABOUT & CONTACT ─── */}
      <section id="about" className="border-t border-black/5 bg-light-surface py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <StarDivider />
            <h2 className="mt-6 text-3xl font-bold text-foreground sm:text-4xl">
              About{" "}
              <span className="bg-gradient-to-r from-sunset-gold to-sunset-orange bg-clip-text text-transparent">
                Ruta Pacifico
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-foreground/60">
              Professional private ground transportation for travelers visiting Costa Rica.
            </p>
          </div>

          <div className="mt-16 grid gap-10 lg:grid-cols-2">
            {/* About copy */}
            <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm sm:p-10">
              <span className="inline-block rounded-full border border-sunset-orange/20 bg-sunset-orange/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sunset-orange">
                The Company
              </span>
              <h3 className="mt-4 text-2xl font-bold text-foreground">
                Private ground transportation across Costa Rica
              </h3>
              <p className="mt-4 leading-relaxed text-foreground/70">
                Ruta Pacifico is a licensed and fully insured ground transportation operator based in Guanacaste. We provide private airport transfers and point-to-point shuttle service from Liberia International Airport (LIR) to destinations throughout Costa Rica.
              </p>
              <p className="mt-4 leading-relaxed text-foreground/70">
                Every trip is operated by a professional bilingual driver in a modern, air-conditioned vehicle. Incoming flights are monitored in real time, pricing is fixed in advance and inclusive of all taxes and tolls, and each reservation is exclusive to your party.
              </p>
              <ul className="mt-6 grid gap-3 text-sm text-foreground/70 sm:grid-cols-2">
                {[
                  "Licensed & fully insured operator",
                  "Professional bilingual drivers",
                  "Modern, air-conditioned fleet",
                  "Real-time flight monitoring",
                  "Fixed, all-inclusive pricing",
                  "24/7 bilingual support",
                ].map((item) => (
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
                      WhatsApp — fastest response
                    </div>
                    <a
                      href="https://wa.me/50685962438"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block text-lg font-bold text-foreground transition hover:text-sunset-orange"
                    >
                      +506 8596 2438
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
                      Email
                    </div>
                    <a
                      href="mailto:mybooking@cantwaittravelcr.com"
                      className="mt-1 block break-all text-lg font-bold text-foreground transition hover:text-sunset-orange"
                    >
                      mybooking@cantwaittravelcr.com
                    </a>
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
                    Hours
                  </div>
                  <div className="mt-1 text-sm font-bold text-foreground">
                    7 days a week
                  </div>
                  <div className="text-xs text-foreground/50">
                    Pickups any hour
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
                    Based in
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
                Book your private shuttle
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-black/5 bg-foreground text-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <Image src={LOGO_URL} alt="Ruta Pacifico" width={400} height={130} className="h-32 w-auto" unoptimized />
              <p className="mt-4 text-sm leading-relaxed text-white/50">Private shuttles across Guanacaste and Costa Rica.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">Services</h4>
              <ul className="mt-4 space-y-3 text-sm text-white/50">
                <li><a href="#services" className="transition hover:text-sunset-orange">Airport Shuttles</a></li>
                <li><a href="#services" className="transition hover:text-sunset-orange">Inter-Beach Shuttles</a></li>
                <li><a href="#services" className="transition hover:text-sunset-orange">Inter-Destination Shuttles</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">Popular Routes</h4>
              <ul className="mt-4 space-y-3 text-sm text-white/50">
                <li>LIR to Tamarindo</li>
                <li>LIR to Papagayo</li>
                <li>LIR to Flamingo</li>
                <li>LIR to Nosara</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">Contact</h4>
              <ul className="mt-4 space-y-3 text-sm text-white/50">
                <li><a href="https://wa.me/50600000000" className="transition hover:text-sunset-orange">WhatsApp</a></li>
                <li><a href="mailto:info@rutapacifico.com" className="transition hover:text-sunset-orange">info@rutapacifico.com</a></li>
                <li>Guanacaste, Costa Rica</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center gap-4 border-t border-white/10 pt-8 sm:flex-row sm:justify-between">
            <p className="text-xs text-white/30">&copy; 2025 Ruta Pacifico. All rights reserved.</p>
            <GoogleReviewBadgeLight />
          </div>
        </div>
      </footer>
    </main>
  );
}
