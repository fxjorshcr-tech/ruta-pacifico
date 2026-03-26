import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

const LOGO_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/Logo%20Transparente.png";
const HERO_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/hero-ruta-pacifico.webp";

export const metadata: Metadata = {
  title: "About & Contact | Ruta Pacifico — Private Transfers in Guanacaste",
  description:
    "Learn about Ruta Pacifico, your trusted private transfer service in Guanacaste, Costa Rica. Contact us for bookings and inquiries.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-light-surface">
      {/* ─── NAV ─── */}
      <nav className="absolute top-0 z-50 w-full">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={LOGO_URL}
              alt="Ruta Pacifico"
              width={480}
              height={160}
              className="h-32 w-auto"
              unoptimized
            />
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/#services"
              className="text-sm font-medium text-white/80 transition hover:text-sunset-orange"
            >
              Private Transfers
            </Link>
            <Link
              href="/blog"
              className="hidden text-sm font-medium text-white/80 transition hover:text-sunset-orange sm:block"
            >
              Blog
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-white/80 transition hover:text-sunset-orange"
            >
              About &amp; Contact Us
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative flex min-h-[40vh] items-center overflow-hidden">
        <Image
          src={HERO_URL}
          alt="Guanacaste coast"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-light-surface via-transparent to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-4xl px-6 pt-40 pb-24 text-center">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            About{" "}
            <span className="bg-gradient-to-r from-sunset-gold via-sunset-orange to-sunset-red bg-clip-text text-transparent">
              Ruta Pacifico
            </span>
          </h1>
        </div>
      </section>

      {/* ─── ABOUT ─── */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="space-y-6 text-foreground/70 leading-relaxed">
          <p>
            Ruta Pacifico is a private transportation company based in Guanacaste, Costa Rica. We specialize in airport transfers from Liberia International Airport (LIR), inter-beach rides across Guanacaste&apos;s coastline, and long-distance transfers to destinations throughout Costa Rica.
          </p>
          <p>
            Our fleet of modern, air-conditioned vehicles — including the Hyundai Staria, Toyota Hiace, and Maxus V90 — accommodates groups from 1 to 12 passengers. Every ride includes complimentary Wi-Fi, cold water, phone chargers, and bilingual drivers who know every road in the region.
          </p>
          <p>
            We monitor all incoming flights in real time and adjust pickup times if your plane arrives early or late. Our fixed-rate pricing means no surprises — the price you see is the price you pay, with fuel, tolls, and taxes included.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { value: "1,000+", label: "Routes" },
            { value: "5.0", label: "Google Rating" },
            { value: "24/7", label: "Service" },
            { value: "12", label: "Max Passengers" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-black/5 bg-white p-5 text-center shadow-sm">
              <div className="text-2xl font-bold text-sunset-orange">{stat.value}</div>
              <div className="mt-1 text-xs text-foreground/50">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CONTACT ─── */}
      <section className="border-t border-black/5 bg-white py-16">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center text-3xl font-bold text-foreground">
            Contact Us
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-foreground/60">
            Ready to book or have questions? Reach out through any of these channels.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {/* WhatsApp */}
            <a
              href="https://wa.me/50600000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 rounded-2xl border border-black/5 bg-light-surface p-6 transition hover:border-sunset-orange/30 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sunset-orange text-white">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-foreground">WhatsApp</span>
              <span className="text-xs text-foreground/50">Chat with us</span>
            </a>

            {/* Email */}
            <a
              href="mailto:info@rutapacifico.com"
              className="flex flex-col items-center gap-3 rounded-2xl border border-black/5 bg-light-surface p-6 transition hover:border-sunset-orange/30 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sunset-orange text-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-foreground">Email</span>
              <span className="text-xs text-foreground/50">info@rutapacifico.com</span>
            </a>

            {/* Location */}
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-black/5 bg-light-surface p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sunset-orange text-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-foreground">Location</span>
              <span className="text-xs text-foreground/50">Guanacaste, Costa Rica</span>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <a
              href="/book/transfer"
              className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-sunset-red via-sunset-orange to-sunset-gold px-10 py-4 text-base font-bold text-white shadow-lg shadow-sunset-orange/25 transition hover:shadow-2xl hover:shadow-sunset-orange/40 hover:scale-105"
            >
              Book Your Transfer
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-black/5 bg-foreground text-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <Image src={LOGO_URL} alt="Ruta Pacifico" width={200} height={65} className="h-16 w-auto" unoptimized />
            <div className="flex items-center gap-6 text-sm text-white/50">
              <Link href="/" className="transition hover:text-sunset-orange">Home</Link>
              <Link href="/book/transfer" className="transition hover:text-sunset-orange">Book</Link>
              <Link href="/blog" className="transition hover:text-sunset-orange">Blog</Link>
              <a href="mailto:info@rutapacifico.com" className="transition hover:text-sunset-orange">Email</a>
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
