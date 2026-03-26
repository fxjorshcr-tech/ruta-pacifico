"use client";

import { useState } from "react";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="absolute top-0 z-50 w-full">
      <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-4">
        {/* Desktop links — centered */}
        <div className="hidden md:flex items-center gap-10">
          <a
            href="#services"
            className="text-sm font-medium text-white/80 transition hover:text-sunset-orange"
          >
            Private Transfers
          </a>
          <a
            href="/book/transfer"
            className="text-sm font-medium text-white/80 transition hover:text-sunset-orange"
          >
            Routes &amp; Prices
          </a>
          <a
            href="#about"
            className="text-sm font-medium text-white/80 transition hover:text-sunset-orange"
          >
            About &amp; Contact Us
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
            Private Transfers
          </a>
          <a
            href="/book/transfer"
            onClick={() => setOpen(false)}
            className="py-3 text-sm font-medium text-white/80 transition hover:text-sunset-orange"
          >
            Routes &amp; Prices
          </a>
          <a
            href="#about"
            onClick={() => setOpen(false)}
            className="py-3 text-sm font-medium text-white/80 transition hover:text-sunset-orange"
          >
            About &amp; Contact Us
          </a>
        </div>
      </div>
    </nav>
  );
}
