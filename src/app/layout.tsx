import type { Metadata } from "next";
import FloatingCart from "@/components/FloatingCart";
import "./globals.css";

const BASE_URL = "https://rutapacificocr.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Ruta Pacifico | Private Shuttles from Liberia Airport (LIR)",
    template: "%s | Ruta Pacifico",
  },
  description:
    "Private airport shuttles from Liberia Airport (LIR) to Tamarindo, Flamingo, Papagayo, Nosara and every beach on Costa Rica's Golden Coast. Fixed prices, bilingual drivers, flight tracking.",
  keywords: [
    "Liberia airport shuttle",
    "LIR airport transfer",
    "Guanacaste private shuttle",
    "Tamarindo shuttle",
    "Flamingo shuttle",
    "Nosara shuttle",
    "Papagayo shuttle",
    "Conchal shuttle",
    "Costa Rica airport transfer",
    "private shuttle Costa Rica",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Ruta Pacifico",
    title: "Ruta Pacifico | Private Shuttles from Liberia Airport (LIR)",
    description:
      "Private airport shuttles from Liberia Airport (LIR) to Tamarindo, Flamingo, Papagayo, Nosara and every beach on Costa Rica's Golden Coast.",
    images: [
      {
        url: "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/hero-ruta-pacifico.webp",
        width: 1200,
        height: 630,
        alt: "Ruta Pacifico — Private Shuttles in Guanacaste, Costa Rica",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ruta Pacifico | Private Shuttles from Liberia Airport (LIR)",
    description:
      "Private airport shuttles from LIR to every beach in Guanacaste. Fixed prices, flight tracking, bilingual drivers.",
    images: [
      "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/hero-ruta-pacifico.webp",
    ],
  },
};

// JSON-LD structured data for Google
function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Ruta Pacifico",
    description:
      "Private airport shuttle service from Liberia Airport (LIR) to beaches, resorts, and destinations across Guanacaste and Costa Rica.",
    url: BASE_URL,
    telephone: "+50685962438",
    email: "mybooking@rutapacificocr.com",
    image:
      "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/Logo%20Transparente.png",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Liberia",
      addressRegion: "Guanacaste",
      addressCountry: "CR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 10.5933,
      longitude: -85.5444,
    },
    areaServed: {
      "@type": "State",
      name: "Guanacaste",
      containedInPlace: { "@type": "Country", name: "Costa Rica" },
    },
    priceRange: "$$",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      bestRating: "5",
      worstRating: "1",
      ratingCount: "50",
      reviewCount: "50",
    },
    sameAs: [`https://wa.me/50685962438`],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <JsonLd />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <FloatingCart />
      </body>
    </html>
  );
}
