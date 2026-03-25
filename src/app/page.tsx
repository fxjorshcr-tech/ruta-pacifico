import Image from "next/image";
import MobileNav from "@/components/MobileNav";

const LOGO_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/Logo%20Transparente.png";
const HERO_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/hero-ruta-pacifico.webp";
const BEACH_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/guanacaste-beach.webp";
const AIRPORT_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/Panorama-Frente-ultimo-111.jpg";

function GoogleReviewBadge() {
  return (
    <div className="inline-flex items-center gap-2.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 px-5 py-2.5">
      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
      <div className="flex items-center gap-1">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className="h-4 w-4 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
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
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
      <div className="flex items-center gap-1">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className="h-4 w-4 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
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
        <Image
          src={HERO_URL}
          alt="Guanacaste coast"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-black/20" />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
          {/* Left — text */}
          <div>
            <div className="mb-6">
              <GoogleReviewBadge />
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Private Transfers in{" "}
              <span className="bg-gradient-to-r from-sunset-gold via-sunset-orange to-sunset-red bg-clip-text text-transparent">
                Guanacaste
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-lg text-white/70">
              Airport pickups, resort shuttles, and custom routes across Costa
              Rica&apos;s golden coast.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#book"
                className="inline-flex items-center gap-2 rounded-full bg-sunset-orange px-8 py-3.5 text-base font-semibold text-white transition hover:bg-sunset-gold"
              >
                Reserve Your Transfer
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
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </a>
              <a
                href="#services"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-3.5 text-base font-medium text-white/90 transition hover:border-white/40 hover:text-white"
              >
                View Services
              </a>
            </div>
          </div>

          {/* Right — big logo */}
          <div className="hidden lg:flex items-center justify-center">
            <Image
              src={LOGO_URL}
              alt="Ruta Pacifico"
              width={500}
              height={300}
              className="w-full max-w-md drop-shadow-2xl"
              unoptimized
            />
          </div>
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      <section id="services" className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <StarDivider />
            <h2 className="mt-6 text-3xl font-bold text-foreground sm:text-4xl">
              Our Transfer Services
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-foreground/60">
              From Liberia Airport to every corner of Guanacaste.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Airport Transfers",
                desc: "Door-to-door from LIR Airport to your hotel, resort, or vacation rental.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                  />
                ),
              },
              {
                title: "Inter-Beach Private Transfers",
                desc: "Direct rides between Tamarindo, Flamingo, Papagayo, Nosara, Conchal, and all coastal towns in Guanacaste.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                ),
              },
              {
                title: "Inter-Destination Transfers",
                desc: "Connect Guanacaste with La Fortuna, San Jos&eacute;, Monteverde, Manuel Antonio, and other key destinations across Costa Rica.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
                  />
                ),
              },
            ].map((service) => (
              <div
                key={service.title}
                className="group rounded-2xl border border-black/5 bg-light-surface p-8 transition hover:border-sunset-orange/20 hover:shadow-lg"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-sunset-orange/10 text-sunset-orange">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    {service.icon}
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/60">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── GUANACASTE ─── */}
      <section id="guanacaste" className="relative overflow-hidden">
        <div className="grid lg:grid-cols-2">
          {/* Image half */}
          <div className="relative min-h-[400px] lg:min-h-[700px]">
            <Image
              src={BEACH_URL}
              alt="Guanacaste beach"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-light-surface hidden lg:block" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-light-surface lg:hidden" />
          </div>

          {/* Text half */}
          <div className="relative flex items-center bg-light-surface px-8 py-16 lg:px-16 lg:py-24">
            <div className="max-w-lg">
              <StarDivider />
              <h2 className="mt-6 text-3xl font-bold text-foreground sm:text-4xl">
                Discover{" "}
                <span className="bg-gradient-to-r from-sunset-gold to-sunset-orange bg-clip-text text-transparent">
                  Guanacaste
                </span>
              </h2>

              <p className="mt-6 leading-relaxed text-foreground/70">
                Guanacaste is Costa Rica&apos;s driest and sunniest province,
                with over 300 days of sunshine per year. The dry season runs from
                November to April, making it the perfect winter escape.
              </p>

              <p className="mt-4 leading-relaxed text-foreground/70">
                The region stretches along the Pacific coast with world-class
                beaches like Tamarindo, Flamingo, Conchal, and the exclusive
                Papagayo Peninsula. Inland, you&apos;ll find the Rinc&oacute;n
                de la Vieja volcano, tropical dry forests, and hot springs fed by
                geothermal activity.
              </p>

              <p className="mt-4 leading-relaxed text-foreground/70">
                Beyond the beaches, Guanacaste is known for its ranching culture,
                traditional sabanero cowboys, and some of the best sunsets in
                Central America. It&apos;s also a major hub for surfing, sport
                fishing, and diving at the Catalinas Islands.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-6">
                <div>
                  <div className="text-2xl font-bold text-sunset-orange">
                    300+
                  </div>
                  <div className="mt-1 text-sm text-foreground/50">
                    Sunny days per year
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-sunset-orange">
                    25&ndash;35&deg;C
                  </div>
                  <div className="mt-1 text-sm text-foreground/50">
                    Average temperature
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-sunset-orange">
                    600+
                  </div>
                  <div className="mt-1 text-sm text-foreground/50">
                    km of Pacific coastline
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-sunset-orange">4</div>
                  <div className="mt-1 text-sm text-foreground/50">
                    National parks &amp; reserves
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── AIRPORT ─── */}
      <section id="airport" className="relative overflow-hidden">
        <div className="grid lg:grid-cols-2">
          {/* Text half — left on desktop */}
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
                Daniel Oduber Quir&oacute;s International Airport is the gateway
                to Guanacaste and northwestern Costa Rica. Located just 15
                minutes from the city of Liberia, it receives direct flights from
                major US and Canadian cities year-round.
              </p>

              <p className="mt-4 leading-relaxed text-foreground/70">
                Airlines like United, Delta, American, JetBlue, Southwest, and
                Air Canada operate regular routes to LIR. The airport recently
                expanded its terminal, making arrivals and departures faster and
                more comfortable.
              </p>

              <p className="mt-4 leading-relaxed text-foreground/70">
                From LIR, the most popular destinations are 45 minutes to 2 hours
                away. We monitor every incoming flight, so even if your plane
                lands early or late, your driver is already waiting.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  { route: "LIR to Tamarindo", time: "~50 min" },
                  { route: "LIR to Flamingo / Conchal", time: "~1 hr" },
                  { route: "LIR to Papagayo Peninsula", time: "~30 min" },
                  { route: "LIR to Nosara / Samara", time: "~2 hrs" },
                ].map((item) => (
                  <div
                    key={item.route}
                    className="flex items-center justify-between rounded-lg border border-black/5 bg-light-surface px-5 py-3"
                  >
                    <span className="text-sm font-medium text-foreground">
                      {item.route}
                    </span>
                    <span className="text-sm text-sunset-orange font-semibold">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Image half — right on desktop */}
          <div className="relative min-h-[400px] lg:min-h-[700px] order-1 lg:order-2">
            <Image
              src={AIRPORT_URL}
              alt="Liberia International Airport LIR"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white hidden lg:block" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white lg:hidden" />
          </div>
        </div>
      </section>

      {/* ─── WHY US ─── */}
      <section className="border-t border-black/5 bg-light-surface py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <StarDivider />
            <h2 className="mt-6 text-3xl font-bold text-foreground sm:text-4xl">
              What&apos;s Included in Every Transfer
            </h2>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Experienced Drivers",
                desc: "Professional drivers with years of experience on Guanacaste roads and mountain routes.",
              },
              {
                title: "Comfortable Vehicles",
                desc: "Air-conditioned SUVs and vans with Wi-Fi and cold water on board.",
              },
              {
                title: "Fixed Rates",
                desc: "The price you see when you book is the price you pay. Fuel, tolls, and taxes included.",
              },
              {
                title: "Real-Time Flight Tracking",
                desc: "We monitor your flight status and adjust the pickup time if it arrives early or late.",
              },
              {
                title: "English & Spanish",
                desc: "All drivers are bilingual and happy to share tips about the region.",
              },
              {
                title: "Door-to-Door",
                desc: "Pickup at the terminal exit, drop-off at your accommodation entrance.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="flex gap-4 rounded-xl border border-black/5 bg-white p-6 shadow-sm"
              >
                <div className="mt-0.5 shrink-0 text-sunset-orange">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-sm text-foreground/60">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA / BOOK ─── */}
      <section id="book" className="bg-white py-24 border-t border-black/5">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <StarDivider />
          <h2 className="mt-6 text-3xl font-bold text-foreground sm:text-4xl">
            Book Your Transfer
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-foreground/60">
            Send us your flight details and destination. We&apos;ll confirm
            availability and pricing within minutes.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="https://wa.me/50600000000"
              className="inline-flex items-center gap-3 rounded-full bg-green-600 px-8 py-3.5 text-base font-semibold text-white transition hover:bg-green-500"
            >
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
              </svg>
              WhatsApp Us
            </a>
            <a
              href="mailto:info@rutapacifico.com"
              className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-8 py-3.5 text-base font-medium text-foreground/80 transition hover:border-foreground/40 hover:text-foreground"
            >
              Send an Email
            </a>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-black/5 bg-foreground text-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Image
                src={LOGO_URL}
                alt="Ruta Pacifico"
                width={160}
                height={50}
                className="h-12 w-auto"
                unoptimized
              />
              <p className="mt-4 text-sm leading-relaxed text-white/50">
                Private transportation across Guanacaste and Costa Rica.
              </p>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">
                Services
              </h4>
              <ul className="mt-4 space-y-3 text-sm text-white/50">
                <li>
                  <a
                    href="#services"
                    className="transition hover:text-sunset-orange"
                  >
                    Airport Transfers
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="transition hover:text-sunset-orange"
                  >
                    Inter-Beach Transfers
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="transition hover:text-sunset-orange"
                  >
                    Inter-Destination Transfers
                  </a>
                </li>
              </ul>
            </div>

            {/* Popular Routes */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">
                Popular Routes
              </h4>
              <ul className="mt-4 space-y-3 text-sm text-white/50">
                <li>LIR to Tamarindo</li>
                <li>LIR to Papagayo</li>
                <li>LIR to Flamingo</li>
                <li>LIR to Nosara</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">
                Contact
              </h4>
              <ul className="mt-4 space-y-3 text-sm text-white/50">
                <li>
                  <a
                    href="https://wa.me/50600000000"
                    className="transition hover:text-sunset-orange"
                  >
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@rutapacifico.com"
                    className="transition hover:text-sunset-orange"
                  >
                    info@rutapacifico.com
                  </a>
                </li>
                <li>Guanacaste, Costa Rica</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center gap-4 border-t border-white/10 pt-8 sm:flex-row sm:justify-between">
            <p className="text-xs text-white/30">
              &copy; 2025 Ruta Pacifico. All rights reserved.
            </p>
            <GoogleReviewBadgeLight />
          </div>
        </div>
      </footer>
    </main>
  );
}
