import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

const LOGO_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/Logo%20Transparente.png";
const HERO_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/hero-ruta-pacifico.webp";

export const metadata: Metadata = {
  title: "Blog | Ruta Pacifico — Guanacaste Travel Tips & Guides",
  description:
    "Travel tips, destination guides, and insider knowledge about Guanacaste and Costa Rica from the Ruta Pacifico team.",
};

export default function BlogPage() {
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
            <span className="bg-gradient-to-r from-sunset-gold via-sunset-orange to-sunset-red bg-clip-text text-transparent">
              Blog
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">
            Travel tips, destination guides, and insider knowledge about Guanacaste.
          </p>
        </div>
      </section>

      {/* ─── COMING SOON ─── */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <div className="rounded-3xl border border-black/5 bg-white p-12 shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sunset-orange/10">
            <svg className="h-8 w-8 text-sunset-orange" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6V7.5Z" />
            </svg>
          </div>
          <h2 className="mt-6 text-2xl font-bold text-foreground">Coming Soon</h2>
          <p className="mx-auto mt-3 max-w-md text-foreground/60">
            We&apos;re working on guides about the best beaches in Guanacaste, travel tips for Costa Rica, and insider recommendations from our drivers. Stay tuned.
          </p>
          <div className="mt-8">
            <a
              href="/book/transfer"
              className="inline-flex items-center gap-2 rounded-full bg-sunset-orange px-8 py-3 text-sm font-semibold text-white transition hover:bg-sunset-gold"
            >
              Book a Transfer
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
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
              <Link href="/about" className="transition hover:text-sunset-orange">About</Link>
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
