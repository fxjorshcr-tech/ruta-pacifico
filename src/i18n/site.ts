import { defineCopy } from "@/lib/i18n";

/** Site-wide metadata, JSON-LD strings and navigation labels. */
export const SITE = defineCopy({
  en: {
    title: "Ruta Pacifico | Private Shuttles from Liberia Airport (LIR)",
    template: "%s | Ruta Pacifico",
    description:
      "Private airport shuttles from Liberia Airport (LIR) to Tamarindo, Flamingo, Papagayo, Nosara and every beach in Guanacaste, Costa Rica. Fixed prices, bilingual drivers, flight tracking.",
    ogDescription:
      "Private airport shuttles from LIR to Tamarindo, Flamingo, Papagayo, Nosara and every beach in Guanacaste. Fixed prices, flight tracking, bilingual drivers.",
    twitterDescription:
      "Private airport shuttles from LIR to every beach in Guanacaste. Fixed prices, flight tracking, bilingual drivers.",
    ogImageAlt: "Ruta Pacifico — Private Shuttles in Guanacaste, Costa Rica",
    websiteDescription:
      "Private shuttle service from Liberia Airport (LIR) to every beach in Guanacaste and destinations across Costa Rica.",
    home: "Home",
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
  },
  es: {
    title: "Ruta Pacifico | Shuttle Privado desde el Aeropuerto de Liberia (LIR)",
    template: "%s | Ruta Pacifico",
    description:
      "Traslados privados desde el Aeropuerto de Liberia (LIR) a Tamarindo, Flamingo, Papagayo, Nosara y todas las playas de Guanacaste, Costa Rica. Precio fijo, choferes bilingües y seguimiento de vuelos.",
    ogDescription:
      "Traslados privados desde LIR a Tamarindo, Flamingo, Papagayo, Nosara y todas las playas de Guanacaste. Precio fijo, seguimiento de vuelos, choferes bilingües.",
    twitterDescription:
      "Traslados privados desde LIR a todas las playas de Guanacaste. Precio fijo, seguimiento de vuelos, choferes bilingües.",
    ogImageAlt: "Ruta Pacifico — Shuttles privados en Guanacaste, Costa Rica",
    websiteDescription:
      "Servicio de shuttle privado desde el Aeropuerto de Liberia (LIR) a todas las playas de Guanacaste y destinos en toda Costa Rica.",
    home: "Inicio",
    keywords: [
      "shuttle aeropuerto Liberia",
      "traslado aeropuerto Liberia Costa Rica",
      "transporte aeropuerto Daniel Oduber",
      "shuttle privado Guanacaste",
      "shuttle privado Costa Rica",
      "transporte privado Costa Rica",
      "shuttle Tamarindo",
      "traslado Liberia Tamarindo",
      "shuttle Flamingo Costa Rica",
      "shuttle Conchal",
      "shuttle Nosara",
      "shuttle Sámara",
      "shuttle Papagayo",
      "shuttle Playas del Coco",
      "traslado Las Catalinas",
      "shuttle La Fortuna Arenal",
      "shuttle Monteverde",
      "shuttle Manuel Antonio",
      "shuttle San José Costa Rica",
      "chofer bilingüe Costa Rica",
      "LIR a Tamarindo",
      "LIR a Nosara",
      "LIR a Flamingo",
    ],
  },
});

export const NAV = defineCopy({
  en: {
    logoLabel: "Ruta Pacifico — Home",
    home: "Home",
    shuttles: "Private Shuttles",
    prices: "Prices",
    blog: "Blog",
    faq: "FAQ",
    about: "About & Contact Us",
    toggleMenu: "Toggle menu",
    language: "Language",
  },
  es: {
    logoLabel: "Ruta Pacifico — Inicio",
    home: "Inicio",
    shuttles: "Shuttles Privados",
    prices: "Precios",
    blog: "Blog",
    faq: "Preguntas Frecuentes",
    about: "Nosotros y Contacto",
    toggleMenu: "Abrir menú",
    language: "Idioma",
  },
});

export const NOT_FOUND = defineCopy({
  en: {
    eyebrow: "Error 404",
    title: "Page not found",
    body: "The link you followed no longer exists or has a typo. These are the pages people usually want.",
    links: [
      { href: "/private-shuttle", label: "Search all shuttle routes" },
      {
        href: "/private-shuttle/lir-liberia-int-airport-to-tamarindo-guanacaste",
        label: "Liberia Airport (LIR) → Tamarindo",
      },
      { href: "/faq", label: "Frequently asked questions" },
      { href: "/blog", label: "Guanacaste travel guide" },
      { href: "/about-contact", label: "Contact us" },
    ],
  },
  es: {
    eyebrow: "Error 404",
    title: "Página no encontrada",
    body: "El enlace que seguiste ya no existe o tiene un error. Estas son las páginas que la gente suele buscar.",
    links: [
      { href: "/private-shuttle", label: "Buscar todas las rutas de shuttle" },
      {
        href: "/private-shuttle/lir-liberia-int-airport-to-tamarindo-guanacaste",
        label: "Aeropuerto de Liberia (LIR) → Tamarindo",
      },
      { href: "/faq", label: "Preguntas frecuentes" },
      { href: "/blog", label: "Guía de viaje de Guanacaste" },
      { href: "/about-contact", label: "Contáctanos" },
    ],
  },
});
