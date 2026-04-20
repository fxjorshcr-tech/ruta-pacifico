import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ruta Pacifico — Private Shuttles in Costa Rica",
    short_name: "Ruta Pacifico",
    description:
      "Private airport shuttles from Liberia Airport (LIR) to every beach, resort and destination in Guanacaste and Costa Rica. Fixed prices, flight tracking, bilingual drivers.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#f97316",
    lang: "en",
    dir: "ltr",
    categories: ["travel", "transportation", "tourism"],
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
    shortcuts: [
      {
        name: "Book a Private Shuttle",
        short_name: "Book",
        description: "Find your route and book a private shuttle",
        url: "/private-shuttle",
      },
      {
        name: "FAQs",
        short_name: "FAQ",
        description: "Frequently asked questions",
        url: "/faq",
      },
    ],
  };
}
