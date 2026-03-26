"use client";

import Image from "next/image";
import { useState } from "react";

const images = [
  { src: "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/guanacaste-beach.webp", alt: "White sand beach in Guanacaste" },
  { src: "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/playa_tamarindo_kristen_brown.jpg", alt: "Playa Tamarindo sunset" },
  { src: "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/llanos-de-cortes-waterfall-drone-.jpg", alt: "Llanos de Cortés waterfall" },
  { src: "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/costa_rica_guanacaste_annexation_day_celebration_01-1024x574.png", alt: "Guanacaste Annexation Day celebration" },
];

export default function GuanacasteGallery() {
  const [current, setCurrent] = useState(0);

  return (
    <>
      {/* Mobile: carousel */}
      <div className="lg:hidden">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
          <Image
            src={images[current].src}
            alt={images[current].alt}
            fill
            className="object-cover transition-opacity duration-500"
            unoptimized
          />
        </div>
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-foreground/60 transition hover:text-foreground"
            aria-label="Previous image"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div className="flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all ${
                  i === current ? "w-6 bg-sunset-orange" : "w-2 bg-black/15"
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() => setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-foreground/60 transition hover:text-foreground"
            aria-label="Next image"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Desktop: 2x2 grid */}
      <div className="hidden lg:grid grid-cols-2 gap-4">
        {images.map((img, i) => (
          <div key={i} className="relative h-56 overflow-hidden rounded-2xl">
            <Image src={img.src} alt={img.alt} fill className="object-cover" unoptimized />
          </div>
        ))}
      </div>
    </>
  );
}
