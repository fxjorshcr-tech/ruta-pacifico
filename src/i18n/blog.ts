import { defineCopy } from "@/lib/i18n";

/** "trip-planning" → "Trip Planning": the label a category slug gets when nothing better is known. */
function titleCase(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Spanish labels for the blog category slugs in use; anything else falls back to the title-cased slug. */
const CATEGORY_ES: Record<string, string> = {
  "trip-planning": "Planificación del viaje",
  "getting-around": "Cómo moverse",
  "travel-tips": "Consejos de viaje",
  "travel-guide": "Guía de viaje",
  destinations: "Destinos",
};

/** Copy for the blog index (/blog) and the article pages (/blog/[slug]). */
export const BLOG = defineCopy({
  en: {
    breadcrumbHome: "Home",
    breadcrumbBlog: "Blog",
    categoryLabel: (slug: string) => titleCase(slug),
    footer: {
      home: "Home",
      blog: "Blog",
      allRoutes: "All routes",
      faq: "FAQ",
      whatsapp: "WhatsApp",
      rights: "All rights reserved.",
    },
    list: {
      metaTitle: "Guanacaste Travel Guide & Blog | Ruta Pacifico",
      metaDescription:
        "Local travel guides for Guanacaste, Costa Rica: getting around from Liberia Airport (LIR), beach town comparisons, driving times, weather and trip planning — written by the team that drives these roads every day.",
      ogDescription:
        "Local travel guides for Guanacaste, Costa Rica: airport transfers, beach towns, driving times and trip planning.",
      ogImageAlt: "Guanacaste, Costa Rica",
      blogName: "Ruta Pacifico — Guanacaste Travel Guide",
      blogDescription:
        "Local travel guides for Guanacaste, Costa Rica, written by a licensed ground-transportation operator based in Liberia.",
      hero: {
        imageAlt: "Guanacaste, Costa Rica",
        eyebrow: "Local knowledge · Written in Guanacaste",
        titleBefore: "Guanacaste",
        titleHighlight: "Travel Guide",
        intro:
          "Practical notes on getting around Guanacaste, written by the people who drive these roads.",
      },
      empty: {
        title: "New guides are on the way.",
        before: "Meanwhile, check our",
        faq: "FAQ",
        or: "or",
        book: "book a private shuttle",
      },
      readMore: "Read the guide",
      cta: {
        heading: "Need a ride?",
        body: "Private shuttles anywhere in Costa Rica at a fixed price, with flight tracking and free child seats.",
        button: "See routes & prices",
      },
    },
    post: {
      notFoundTitle: "Article not found | Ruta Pacifico",
      back: "← All guides",
      updated: (date: string) => `· Updated ${date}`,
      faqHeading: "Frequently asked questions",
      cta: {
        heading: "Book your private shuttle",
        body: "Door to door anywhere in Costa Rica at a fixed price, with flight tracking and free child seats.",
        seeRoutes: "See routes & prices",
        whatsapp: "WhatsApp us",
      },
    },
  },
  es: {
    breadcrumbHome: "Inicio",
    breadcrumbBlog: "Blog",
    categoryLabel: (slug: string) => CATEGORY_ES[slug] ?? titleCase(slug),
    footer: {
      home: "Inicio",
      blog: "Blog",
      allRoutes: "Todas las rutas",
      faq: "Preguntas frecuentes",
      whatsapp: "WhatsApp",
      rights: "Todos los derechos reservados.",
    },
    list: {
      metaTitle: "Guía de viaje y blog de Guanacaste | Ruta Pacifico",
      metaDescription:
        "Guías locales de viaje para Guanacaste, Costa Rica: cómo moverte desde el Aeropuerto de Liberia (LIR), comparativas de pueblos de playa, tiempos de manejo, clima y planificación del viaje, escritas por el equipo que recorre estas carreteras todos los días.",
      ogDescription:
        "Guías locales de viaje para Guanacaste, Costa Rica: traslados al aeropuerto, pueblos de playa, tiempos de manejo y planificación del viaje.",
      ogImageAlt: "Guanacaste, Costa Rica",
      blogName: "Ruta Pacifico — Guía de viaje de Guanacaste",
      blogDescription:
        "Guías locales de viaje para Guanacaste, Costa Rica, escritas por un operador de transporte terrestre con licencia y sede en Liberia.",
      hero: {
        imageAlt: "Guanacaste, Costa Rica",
        eyebrow: "Conocimiento local · Escrito en Guanacaste",
        titleBefore: "Guía de viaje de",
        titleHighlight: "Guanacaste",
        intro:
          "Notas prácticas para moverte por Guanacaste, escritas por quienes recorren estas carreteras.",
      },
      empty: {
        title: "Nuevas guías en camino.",
        before: "Mientras tanto, revisa nuestras",
        faq: "preguntas frecuentes",
        or: "o",
        book: "reserva un shuttle privado",
      },
      readMore: "Leer la guía",
      cta: {
        heading: "¿Necesitas un traslado?",
        body: "Shuttles privados a cualquier lugar de Costa Rica a precio fijo, con seguimiento de vuelo y sillas para niños gratis.",
        button: "Ver rutas y precios",
      },
    },
    post: {
      notFoundTitle: "Artículo no encontrado | Ruta Pacifico",
      back: "← Todas las guías",
      updated: (date: string) => `· Actualizado ${date}`,
      faqHeading: "Preguntas frecuentes",
      cta: {
        heading: "Reserva tu shuttle privado",
        body: "Puerta a puerta a cualquier lugar de Costa Rica a precio fijo, con seguimiento de vuelo y sillas para niños gratis.",
        seeRoutes: "Ver rutas y precios",
        whatsapp: "Escríbenos por WhatsApp",
      },
    },
  },
});
