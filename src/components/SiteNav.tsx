"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LOGO_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/Logo%20Transparente.png";

interface Props {
  /**
   * When true, nav is absolutely positioned over a hero with a transparent
   * background and light text. When false, nav is solid white with dark text.
   */
  transparent?: boolean;
}

export default function SiteNav({ transparent = true }: Props) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);

  const containerClass = transparent
    ? "absolute top-0 z-50 w-full"
    : "sticky top-0 z-50 w-full border-b border-black/5 bg-white/95 backdrop-blur-sm";

  const linkClass = transparent
    ? "text-white/90 hover:text-sunset-gold"
    : "text-foreground/80 hover:text-sunset-orange";

  const hamburgerBar = transparent ? "bg-white" : "bg-foreground";

  const mobileMenuClass = transparent
    ? "bg-black/90 backdrop-blur-md"
    : "bg-white border-b border-black/5";

  const mobileLinkClass = transparent
    ? "text-white/90 hover:bg-white/5 hover:text-sunset-gold"
    : "text-foreground/80 hover:bg-sunset-orange/5 hover:text-sunset-orange";

  return (
    <nav className={containerClass}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 sm:py-5">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center" aria-label="Ruta Pacifico — Home">
          <Image
            src={LOGO_URL}
            alt="Ruta Pacifico"
            width={360}
            height={120}
            className="h-12 w-auto sm:h-14 lg:h-16"
            priority
            unoptimized
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 lg:flex xl:gap-10">
          {!isHome && (
            <Link
              href="/"
              className={`text-[0.95rem] font-bold tracking-wide transition ${linkClass}`}
            >
              Home
            </Link>
          )}
          <Link
            href="/book/transfer"
            className={`text-[0.95rem] font-bold tracking-wide transition ${linkClass}`}
          >
            Private Shuttles
          </Link>
          <Link
            href={isHome ? "#about" : "/#about"}
            className={`text-[0.95rem] font-bold tracking-wide transition ${linkClass}`}
          >
            About &amp; Contact Us
          </Link>
          <Link
            href="/book/transfer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sunset-red via-sunset-orange to-sunset-gold px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-sunset-orange/25 transition hover:shadow-xl hover:shadow-sunset-orange/40 hover:scale-[1.02]"
          >
            Book Now
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className={`block h-0.5 w-7 transition-all duration-300 ${hamburgerBar} ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block h-0.5 w-7 transition-all duration-300 ${hamburgerBar} ${open ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-7 transition-all duration-300 ${hamburgerBar} ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-96" : "max-h-0"
        } ${mobileMenuClass}`}
      >
        <div className="flex flex-col gap-1 px-6 py-4">
          {!isHome && (
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className={`rounded-xl px-4 py-3 text-base font-semibold transition ${mobileLinkClass}`}
            >
              Home
            </Link>
          )}
          <Link
            href="/book/transfer"
            onClick={() => setOpen(false)}
            className={`rounded-xl px-4 py-3 text-base font-semibold transition ${mobileLinkClass}`}
          >
            Private Shuttles
          </Link>
          <Link
            href={isHome ? "#about" : "/#about"}
            onClick={() => setOpen(false)}
            className={`rounded-xl px-4 py-3 text-base font-semibold transition ${mobileLinkClass}`}
          >
            About &amp; Contact Us
          </Link>
          <Link
            href="/book/transfer"
            onClick={() => setOpen(false)}
            className="mt-2 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sunset-red via-sunset-orange to-sunset-gold px-6 py-3 text-sm font-bold text-white shadow-lg shadow-sunset-orange/25"
          >
            Book Now
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </nav>
  );
}
