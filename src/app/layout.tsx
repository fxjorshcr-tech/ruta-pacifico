import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import FloatingCart from "@/components/FloatingCart";
import "./globals.css";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GOOGLE_SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

const BASE_URL = "https://rutapacificocr.com";
const OG_IMAGE =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/hero-ruta-pacifico.webp";
const LOGO_IMAGE =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/Logo%20Transparente.png";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Accessibility: allow pinch-zoom up to 5×.
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Ruta Pacifico | Private Shuttles from Liberia Airport (LIR)",
    template: "%s | Ruta Pacifico",
  },
  description:
    "Private airport shuttles from Liberia Airport (LIR) to Tamarindo, Flamingo, Papagayo, Nosara and every beach on Costa Rica's Golden Coast. Fixed prices, bilingual drivers, real-time flight tracking.",
  applicationName: "Ruta Pacifico",
  generator: "Next.js",
  authors: [{ name: "Ruta Pacifico", url: BASE_URL }],
  creator: "Ruta Pacifico",
  publisher: "Ruta Pacifico",
  category: "Travel",
  classification: "Travel & Transportation",
  referrer: "origin-when-cross-origin",
  keywords: [
    "Liberia airport shuttle",
    "LIR airport transfer",
    "Liberia Costa Rica airport transfer",
    "Daniel Oduber airport shuttle",
    "Guanacaste private shuttle",
    "Costa Rica private shuttle",
    "Tamarindo shuttle",
    "Tamarindo airport transfer",
    "Flamingo shuttle Costa Rica",
    "Conchal shuttle",
    "Nosara shuttle",
    "Samara shuttle",
    "Papagayo shuttle",
    "Playas del Coco shuttle",
    "Las Catalinas transfer",
    "La Fortuna Arenal shuttle",
    "Monteverde shuttle",
    "Manuel Antonio shuttle",
    "San Jose Costa Rica shuttle",
    "bilingual driver Costa Rica",
    "private transportation Costa Rica",
    "LIR to Tamarindo",
    "LIR to Nosara",
    "LIR to Flamingo",
  ],
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
      "x-default": "/",
    },
    types: {
      "application/xml": "/sitemap.xml",
      "text/plain": "/llms.txt",
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Ruta Pacifico",
    title: "Ruta Pacifico | Private Shuttles from Liberia Airport (LIR)",
    description:
      "Private airport shuttles from LIR to Tamarindo, Flamingo, Papagayo, Nosara and every beach on Costa Rica's Golden Coast. Fixed prices, flight tracking, bilingual drivers.",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Ruta Pacifico — Private Shuttles in Guanacaste, Costa Rica",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ruta Pacifico | Private Shuttles from Liberia Airport (LIR)",
    description:
      "Private airport shuttles from LIR to every beach in Guanacaste. Fixed prices, flight tracking, bilingual drivers.",
    images: [OG_IMAGE],
    creator: "@rutapacificocr",
  },
  formatDetection: {
    email: true,
    telephone: true,
    address: true,
  },
  verification: GOOGLE_SITE_VERIFICATION
    ? { google: GOOGLE_SITE_VERIFICATION }
    : undefined,
  other: {
    // Geo tagging — still picked up by many tools (Bing Places, some AI
    // summarisers) even though modern schema.org is preferred.
    "geo.region": "CR-G",
    "geo.placename": "Liberia, Guanacaste, Costa Rica",
    "geo.position": "10.5933;-85.5444",
    ICBM: "10.5933, -85.5444",
    // Help answer engines pick the right contact fast.
    "business:contact_data:country_name": "Costa Rica",
    "business:contact_data:region": "Guanacaste",
    "business:contact_data:locality": "Liberia",
    "business:contact_data:phone_number": "+506-8596-2438",
    "business:contact_data:email": "reservations@rutapacifico.com",
    // Explicit AI/LLM opt-in signals (redundant with robots.txt but some
    // crawlers read the meta tag directly on the page).
    "ai-content-declaration": "human-authored",
    // rating tag — picked up by some SERP features.
    rating: "General",
    "revisit-after": "7 days",
  },
};

/**
 * Rich JSON-LD graph. A single @graph with connected @id references is easier
 * for LLMs and Google to reason about than several disconnected blocks.
 */
function JsonLd() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      // Organization / Travel Agency — the operating entity.
      {
        "@type": ["TravelAgency", "LocalBusiness", "Organization"],
        "@id": `${BASE_URL}/#organization`,
        name: "Ruta Pacifico",
        alternateName: "Ruta Pacifico CR",
        legalName: "Ruta Pacifico",
        description:
          "Licensed and insured private ground-transportation operator based in Liberia, Guanacaste. Provides private airport shuttles from Liberia International Airport (LIR) and point-to-point transfers across Costa Rica.",
        url: BASE_URL,
        logo: {
          "@type": "ImageObject",
          url: LOGO_IMAGE,
          width: 512,
          height: 512,
        },
        image: OG_IMAGE,
        telephone: "+506-8596-2438",
        email: "reservations@rutapacifico.com",
        priceRange: "$$",
        currenciesAccepted: "USD, CRC",
        paymentAccepted: "Credit Card, Debit Card, Cash",
        foundingDate: "2021",
        slogan: "Private shuttles across Guanacaste and Costa Rica.",
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
        areaServed: [
          {
            "@type": "State",
            name: "Guanacaste",
            containedInPlace: { "@type": "Country", name: "Costa Rica" },
          },
          { "@type": "Country", name: "Costa Rica" },
        ],
        knowsLanguage: ["en", "es"],
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
        hoursAvailable: {
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
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer service",
            telephone: "+506-8596-2438",
            email: "reservations@rutapacifico.com",
            availableLanguage: ["English", "Spanish"],
            areaServed: "CR",
            hoursAvailable: {
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
          },
          {
            "@type": "ContactPoint",
            contactType: "reservations",
            telephone: "+506-8596-2438",
            url: "https://wa.me/50685962438",
            availableLanguage: ["English", "Spanish"],
          },
        ],
        sameAs: ["https://wa.me/50685962438"],
        makesOffer: [
          {
            "@type": "Offer",
            name: "Airport Shuttle from Liberia International Airport (LIR)",
            description:
              "Private door-to-door transfer from Daniel Oduber Quirós International Airport (LIR) to any beach, resort or destination in Costa Rica. Includes real-time flight tracking.",
            priceCurrency: "USD",
            eligibleRegion: { "@type": "Country", name: "Costa Rica" },
            availability: "https://schema.org/InStock",
            itemOffered: {
              "@type": "Service",
              name: "Private Airport Shuttle",
              serviceType: "Ground transportation",
              areaServed: "Costa Rica",
            },
          },
          {
            "@type": "Offer",
            name: "Inter-Beach Private Shuttle",
            description:
              "Private rides between coastal towns in Guanacaste — Tamarindo, Flamingo, Conchal, Nosara, Papagayo, Sámara, Playas del Coco and more.",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            itemOffered: {
              "@type": "Service",
              name: "Inter-Beach Shuttle",
              serviceType: "Ground transportation",
              areaServed: "Guanacaste, Costa Rica",
            },
          },
          {
            "@type": "Offer",
            name: "Cross-Country Private Shuttle",
            description:
              "Long-distance private transfers from Guanacaste to La Fortuna / Arenal, Monteverde, Manuel Antonio, San José and beyond.",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            itemOffered: {
              "@type": "Service",
              name: "Cross-Country Shuttle",
              serviceType: "Ground transportation",
              areaServed: "Costa Rica",
            },
          },
        ],
      },

      // WebSite — enables Sitelinks search box and declares the search action
      // target that some AI assistants use to navigate into the site.
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        url: BASE_URL,
        name: "Ruta Pacifico",
        description:
          "Private shuttle service from Liberia Airport (LIR) to every beach in Guanacaste and destinations across Costa Rica.",
        inLanguage: "en-US",
        publisher: { "@id": `${BASE_URL}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${BASE_URL}/private-shuttle?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },

      // Home page WebPage
      {
        "@type": "WebPage",
        "@id": `${BASE_URL}/#webpage`,
        url: BASE_URL,
        name: "Ruta Pacifico | Private Shuttles from Liberia Airport (LIR)",
        isPartOf: { "@id": `${BASE_URL}/#website` },
        about: { "@id": `${BASE_URL}/#organization` },
        primaryImageOfPage: OG_IMAGE,
        inLanguage: "en-US",
        breadcrumb: { "@id": `${BASE_URL}/#breadcrumb` },
      },

      // Root breadcrumb
      {
        "@type": "BreadcrumbList",
        "@id": `${BASE_URL}/#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: BASE_URL,
          },
        ],
      },

      // LIR airport — declaring it as a known place helps LLMs link queries
      // like "airport transfer from Liberia Costa Rica" to this business.
      {
        "@type": "Airport",
        "@id": `${BASE_URL}/#lir-airport`,
        name: "Daniel Oduber Quirós International Airport",
        alternateName: "Liberia International Airport",
        iataCode: "LIR",
        icaoCode: "MRLB",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Liberia",
          addressRegion: "Guanacaste",
          addressCountry: "CR",
        },
        geo: { "@type": "GeoCoordinates", latitude: 10.5933, longitude: -85.5444 },
      },
    ],
  };

  return (
    <Script
      id="ld-json-organization"
      type="application/ld+json"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
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
        {/* Performance: pre-warm the origins we always hit first. */}
        <link
          rel="preconnect"
          href="https://mmlbslwljvmscbgsqkkq.supabase.co"
          crossOrigin=""
        />
        <link rel="dns-prefetch" href="https://mmlbslwljvmscbgsqkkq.supabase.co" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Pointer the LLM-facing docs — non-standard but harmless, and some
            crawlers honour it to find llms.txt without scanning robots.txt. */}
        <link
          rel="alternate"
          type="text/markdown"
          href="/llms.txt"
          title="llms.txt — summary for language models"
        />
        <link
          rel="alternate"
          type="text/markdown"
          href="/llms-full.txt"
          title="llms-full.txt — full context for language models"
        />
        <JsonLd />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground overflow-x-hidden">
        {children}
        <FloatingCart />
      </body>
      {GA_ID ? <GoogleAnalytics gaId={GA_ID} /> : null}
    </html>
  );
}
