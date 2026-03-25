"use client";

import { useState } from "react";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#services"
            className="text-sm font-medium text-white/80 transition hover:text-sunset-orange"
          >
            Services
          </a>
          <a
            href="#guanacaste"
            className="text-sm font-medium text-white/80 transition hover:text-sunset-orange"
          >
            Guanacaste
          </a>
          <a
            href="#airport"
            className="text-sm font-medium text-white/80 transition hover:text-sunset-orange"
          >
            Airport
          </a>
        </div>

        {/* Hamburger button — mobile only */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col justify-center items-center gap-1.5 w-10 h-10"
          aria-label="Toggle menu"
        >
          <span
            className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
              open ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
              open ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>

        <a
          href="#book"
          className="rounded-full bg-sunset-orange px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-sunset-gold"
        >
          Book Now
        </a>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-60 border-b border-white/10" : "max-h-0"
        } bg-black/90 backdrop-blur-md`}
      >
        <div className="flex flex-col gap-1 px-6 py-4">
          <a
            href="#services"
            onClick={() => setOpen(false)}
            className="py-3 text-sm font-medium text-white/80 transition hover:text-sunset-orange"
          >
            Services
          </a>
          <a
            href="#guanacaste"
            onClick={() => setOpen(false)}
            className="py-3 text-sm font-medium text-white/80 transition hover:text-sunset-orange"
          >
            Guanacaste
          </a>
          <a
            href="#airport"
            onClick={() => setOpen(false)}
            className="py-3 text-sm font-medium text-white/80 transition hover:text-sunset-orange"
          >
            Airport
          </a>
        </div>
      </div>
    </nav>
  );
}
