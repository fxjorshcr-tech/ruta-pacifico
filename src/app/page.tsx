import Image from "next/image";
import MobileNav from "@/components/MobileNav";
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
      <MobileNav />

      {/* ─── HERO ─── */}
      <section className="relative flex min-h-screen items-center overflow-hidden">
        <Image src={HERO_URL} alt="Guanacaste coast" fill className="object-cover" priority unoptimized />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-black/20" />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
          <div>
            <div className="mb-6"><GoogleReviewBadge /></div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Private Transfers in{" "}
              <span className="bg-gradient-to-r from-sunset-gold via-sunset-orange to-sunset-red bg-clip-text text-transparent">
                Guanacaste
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-white/70">
              Airport pickups, resort shuttles, and custom routes across Costa Rica&apos;s golden coast.
            </p>
          </div>
          <div className="hidden lg:flex flex-col items-center justify-center gap-8">
            <Image src={LOGO_URL} alt="Ruta Pacifico" width={500} height={300} className="w-full max-w-md drop-shadow-2xl" unoptimized />
            <a
              href="/book/transfer"
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
                Book Your Transfers
                <svg className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </a>
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="absolute bottom-12 left-0 right-0 z-10 text-center">
          <p className="text-2xl font-extrabold tracking-wide text-white drop-shadow-lg sm:text-3xl md:text-4xl">
            Land. Relax. We&apos;ll get you to the beach.
          </p>
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      <section id="services" className="bg-white py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <StarDivider />
            <h2 className="mt-6 text-3xl font-bold text-foreground sm:text-4xl">
              Our Transfer Services
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-foreground/60">
              Private ground transportation for travelers visiting Guanacaste and Costa Rica. Three types of service, one standard: safe, comfortable, and on time.
            </p>
          </div>

          <div className="mt-16 space-y-6">
            {/* Airport Transfers */}
            <div className="rounded-3xl border border-black/5 bg-light-surface p-8 sm:p-10 text-center transition hover:shadow-lg">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-sunset-orange text-white">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-foreground">Airport Transfers</h3>
              <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-foreground/60">
                Pickup at Liberia International Airport (LIR) with direct transport to your destination. Beaches, resorts, mountain towns, or any other location in Costa Rica. We also handle the return trip from your accommodation back to LIR.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {["Beaches & resorts", "La Fortuna & Arenal", "Monteverde", "San José", "Manuel Antonio"].map((tag) => (
                  <span key={tag} className="rounded-full border border-sunset-orange/20 bg-sunset-orange/5 px-4 py-1.5 text-xs font-medium text-sunset-orange">{tag}</span>
                ))}
              </div>
            </div>

            {/* Inter-Beach Transfers */}
            <div className="rounded-3xl border border-black/5 bg-light-surface p-8 sm:p-10 text-center transition hover:shadow-lg">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-sunset-orange text-white">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-foreground">Inter-Beach Private Transfers</h3>
              <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-foreground/60">
                One-way rides and full-day trips between coastal towns in Guanacaste. Ideal for changing hotels, visiting a different beach for the day, or exploring the coast at your own pace. Available for single trips or round-trip with a set schedule.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {["One-way transfers", "Full-day trips", "Round-trip", "Tamarindo", "Flamingo", "Papagayo", "Nosara", "Conchal", "Sámara"].map((tag) => (
                  <span key={tag} className="rounded-full border border-sunset-orange/20 bg-sunset-orange/5 px-4 py-1.5 text-xs font-medium text-sunset-orange">{tag}</span>
                ))}
              </div>
            </div>

            {/* Inter-Destination Transfers */}
            <div className="rounded-3xl border border-black/5 bg-light-surface p-8 sm:p-10 text-center transition hover:shadow-lg">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-sunset-orange text-white">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-foreground">Inter-Destination Transfers</h3>
              <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-foreground/60">
                Long-distance private transfers from any Guanacaste beach to other regions of Costa Rica. One vehicle, one driver, direct to your next stop — La Fortuna, Manuel Antonio, Monteverde, San Jos&eacute;, or wherever your itinerary takes you.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {["La Fortuna", "Manuel Antonio", "Monteverde", "San José", "Arenal", "Rincón de la Vieja"].map((tag) => (
                  <span key={tag} className="rounded-full border border-sunset-orange/20 bg-sunset-orange/5 px-4 py-1.5 text-xs font-medium text-sunset-orange">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FLEET ─── */}
      <section className="bg-light-surface py-24 border-t border-black/5">
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

      {/* ─── AIRPORT ─── */}
      <section id="airport" className="relative overflow-hidden">
        <div className="grid lg:grid-cols-2">
          <div className="relative flex items-center bg-white px-8 py-16 lg:px-16 lg:py-24 order-2 lg:order-1">
            <div className="max-w-lg ml-auto">
              <StarDivider />
              <h2 className="mt-6 text-3xl font-bold text-foreground sm:text-4xl">
                <span className="bg-gradient-to-r from-sunset-gold to-sunset-orange bg-clip-text text-transparent">
                  Liberia Airport
                </span>{" "}
                (LIR)
              </h2>
              <p className="mt-6 leading-relaxed text-foreground/70">
                Daniel Oduber Quir&oacute;s International Airport is the gateway to Guanacaste and northwestern Costa Rica. Located just 15 minutes from the city of Liberia, it receives direct flights from major US and Canadian cities year-round.
              </p>
              <p className="mt-4 leading-relaxed text-foreground/70">
                Airlines like United, Delta, American, JetBlue, Southwest, and Air Canada operate regular routes to LIR. The airport recently expanded its terminal, making arrivals and departures faster and more comfortable.
              </p>
              <p className="mt-4 leading-relaxed text-foreground/70">
                From LIR, the most popular destinations are 45 minutes to 2 hours away. We monitor every incoming flight and adjust the pickup if your plane lands early or late.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  { route: "LIR to Tamarindo", time: "~50 min" },
                  { route: "LIR to Flamingo / Conchal", time: "~1 hr" },
                  { route: "LIR to Papagayo Peninsula", time: "~30 min" },
                  { route: "LIR to Nosara / Samara", time: "~2 hrs" },
                ].map((item) => (
                  <div key={item.route} className="flex items-center justify-between rounded-lg border border-black/5 bg-light-surface px-5 py-3">
                    <span className="text-sm font-medium text-foreground">{item.route}</span>
                    <span className="text-sm text-sunset-orange font-semibold">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="relative min-h-[400px] lg:min-h-[700px] order-1 lg:order-2">
            <Image src={AIRPORT_URL} alt="Liberia International Airport LIR" fill className="object-cover" unoptimized />
          </div>
        </div>
      </section>

      {/* ─── WHY US ─── */}
      <section className="border-t border-black/5 bg-light-surface py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <StarDivider />
            <h2 className="mt-6 text-3xl font-bold text-foreground sm:text-4xl">
              What&apos;s Included in Every Private Transfer
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

      {/* ─── GUANACASTE ─── */}
      <section id="guanacaste" className="bg-white py-24 border-t border-black/5">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <StarDivider />
            <h2 className="mt-6 text-3xl font-bold text-foreground sm:text-4xl">
              Discover{" "}
              <span className="bg-gradient-to-r from-sunset-gold to-sunset-orange bg-clip-text text-transparent">Guanacaste</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-foreground/60">
              Costa Rica&apos;s sunniest province — over 300 days of sunshine, world-class beaches, volcanoes, and a culture unlike anywhere else.
            </p>
          </div>

          {/* Gallery + text */}
          <div className="mt-16 grid gap-10 lg:grid-cols-2 items-center">
            {/* Gallery — carousel on mobile, 2x2 on desktop */}
            <GuanacasteGallery />

            {/* Text content */}
            <div>
              <p className="leading-relaxed text-foreground/70">
                Costa Rica&apos;s sunniest province with over 300 days of sunshine per year. The dry season from November to April makes it the perfect winter escape.
              </p>
              <p className="mt-4 leading-relaxed text-foreground/70">
                Over 600 km of Pacific coastline with beaches like Tamarindo, Flamingo, Conchal, and the Papagayo Peninsula. Inland, the Rinc&oacute;n de la Vieja volcano, tropical dry forests, and waterfalls like Llanos de Cort&eacute;s.
              </p>
              <p className="mt-4 leading-relaxed text-foreground/70">
                The only province that celebrates its own annexation day on July 25th — with parades, traditional music, and horseback shows. Also a top destination for surfing, sport fishing, and diving at the Catalinas Islands.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-light-surface p-4">
                  <div className="text-xl font-bold text-sunset-orange">300+</div>
                  <div className="text-xs text-foreground/50">Sunny days / year</div>
                </div>
                <div className="rounded-xl bg-light-surface p-4">
                  <div className="text-xl font-bold text-sunset-orange">25&ndash;35&deg;C</div>
                  <div className="text-xs text-foreground/50">Avg. temperature</div>
                </div>
                <div className="rounded-xl bg-light-surface p-4">
                  <div className="text-xl font-bold text-sunset-orange">600+</div>
                  <div className="text-xs text-foreground/50">km of coastline</div>
                </div>
                <div className="rounded-xl bg-light-surface p-4">
                  <div className="text-xl font-bold text-sunset-orange">4</div>
                  <div className="text-xs text-foreground/50">National parks</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA / BOOK ─── */}
      <section id="book" className="bg-white py-20 border-t border-black/5">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Let&apos;s find your transfer
          </h2>
          <div className="mt-8">
            <a href="/book/transfer" className="inline-flex items-center gap-3 rounded-full bg-sunset-orange px-10 py-4 text-base font-semibold text-white transition hover:bg-sunset-gold">
              Book Now
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-black/5 bg-foreground text-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <Image src={LOGO_URL} alt="Ruta Pacifico" width={400} height={130} className="h-32 w-auto" unoptimized />
              <p className="mt-4 text-sm leading-relaxed text-white/50">Private transportation across Guanacaste and Costa Rica.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">Services</h4>
              <ul className="mt-4 space-y-3 text-sm text-white/50">
                <li><a href="#services" className="transition hover:text-sunset-orange">Airport Transfers</a></li>
                <li><a href="#services" className="transition hover:text-sunset-orange">Inter-Beach Transfers</a></li>
                <li><a href="#services" className="transition hover:text-sunset-orange">Inter-Destination Transfers</a></li>
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
