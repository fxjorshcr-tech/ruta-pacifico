import { defineCopy } from "@/lib/i18n";
import { travelTime } from "@/lib/pricing";
import { durationMinutes } from "@/lib/routeFaqs";
import type { Route } from "@/lib/routes";

/**
 * Copy for the booking search page (/private-shuttle) and the server-rendered
 * "popular routes" block it shows. Server-side only: the page reads it with
 * `SHUTTLE[locale]` after `localeFromParams`.
 */

/** "aprox. 1 h 30 min", "aprox. 45 min" — Spanish twin of pricing.travelTime. */
function travelTimeEs(route: Route): string {
  const minutes = durationMinutes(route.duracion);
  if (!minutes) return route.duracion || "variable";
  const h = Math.floor(minutes / 60);
  const min = minutes % 60;
  if (h === 0) return `aprox. ${min} min`;
  return min ? `aprox. ${h} h ${min} min` : `aprox. ${h} h`;
}

export const SHUTTLE = defineCopy({
  en: {
    metaTitle: "Book a Private Shuttle",
    metaDescription:
      "Private shuttles from Liberia Airport (LIR) to every beach and destination in Costa Rica. Fixed prices, flight tracking, bilingual drivers. Book in minutes.",
    ogTitle: "Book a Private Shuttle | Ruta Pacifico",
    ogDescription:
      "Private shuttles from LIR to every beach and destination in Costa Rica. Fixed prices, flight tracking, bilingual drivers.",
    twitterDescription:
      "Private shuttles from LIR to every beach in Guanacaste. Fixed prices, flight tracking.",
    heroAlt: "Private shuttle along the Guanacaste coast",
    jsonLd: {
      pageName: "Book a Private Shuttle",
      pageDescription: "Search every private shuttle route Ruta Pacifico offers in Costa Rica.",
      listName: "Private shuttle routes",
      routeName: (origin: string, destination: string) => `${origin} to ${destination}`,
      serviceName: (origin: string, destination: string) =>
        `Private Shuttle: ${origin} to ${destination}`,
      home: "Home",
      shuttles: "Private Shuttles",
    },
    hero: {
      before: "Private Shuttles in",
      highlight: "Guanacaste",
      connector: "&",
      after: "all of Costa Rica",
      intro:
        "Private door-to-door shuttles from Liberia Airport (LIR) to every beach and destination in Costa Rica.",
      badges: {
        airport: "Airport Shuttles",
        beach: "Inter-Beach Shuttles",
        destination: "Inter-Destination Shuttles",
      },
    },
    popular: {
      eyebrow: "From Liberia Airport (LIR)",
      heading: "Popular routes and prices",
      intro: (minPax: number, maxPax: number) =>
        `Fixed prices in USD per vehicle for ${minPax}–${maxPax} passengers, 13% VAT included. Same price on any date of the year.`,
      from: "from",
      quote: "Quote",
      perVehicle: "per vehicle",
      seeAll: "See the full price list",
      seeAllCount: (count: number) => `See the full price list (${count} routes)`,
      travelTime: (route: Route) => travelTime(route),
    },
    goodToKnow: {
      heading: "Good to Know",
      intro: "Before you book: prices, changes and cancellations.",
      cancellation: {
        title: "Cancellation",
        before: { strong: "48+ hours before:", text: "Full refund (minus 13% tax)" },
        within: { strong: "Within 48 hours:", text: "Non-refundable" },
        email: "Email:",
      },
      changes: {
        title: "Changes & Modifications",
        items: [
          "Free changes up to 48 hours before pickup",
          "Change time, date, or location (subject to availability)",
          "Route changes may affect price",
        ],
      },
      help: {
        title: "Need Help?",
        items: [
          "WhatsApp support before, during & after your ride",
          "Bilingual team available 7 days a week",
        ],
        reachUs: "Reach us at",
      },
      pricing: {
        title: "Pricing",
        items: [
          "Price is per vehicle, not per person",
          "No hidden fees, the price you see is final",
          "All taxes included (13% VAT)",
        ],
      },
    },
    faq: {
      eyebrow: "Help Center",
      heading: "Frequently Asked Questions",
      intro: "The questions we get asked most before a booking.",
      seeAll: "See all FAQs",
    },
    footer: {
      home: "Home",
      prices: "Prices",
      faq: "FAQ",
      whatsapp: "WhatsApp",
      email: "Email",
      rights: "All rights reserved.",
    },
  },
  es: {
    metaTitle: "Reserva tu Shuttle Privado desde Liberia (LIR)",
    metaDescription:
      "Shuttles privados desde el aeropuerto de Liberia (LIR) a todas las playas y destinos de Costa Rica. Precio fijo, seguimiento de vuelo y choferes bilingües. Reserva en minutos.",
    ogTitle: "Reserva tu Shuttle Privado desde Liberia (LIR) | Ruta Pacifico",
    ogDescription:
      "Shuttles privados desde LIR a todas las playas y destinos de Costa Rica. Precio fijo, seguimiento de vuelo, choferes bilingües.",
    twitterDescription:
      "Shuttles privados desde LIR a todas las playas de Guanacaste. Precio fijo y seguimiento de vuelo.",
    heroAlt: "Shuttle privado por la costa de Guanacaste",
    jsonLd: {
      pageName: "Reserva tu shuttle privado",
      pageDescription:
        "Busca todas las rutas de shuttle privado que Ruta Pacifico ofrece en Costa Rica.",
      listName: "Rutas de shuttle privado",
      routeName: (origin: string, destination: string) => `${origin} a ${destination}`,
      serviceName: (origin: string, destination: string) =>
        `Shuttle privado: ${origin} a ${destination}`,
      home: "Inicio",
      shuttles: "Shuttles Privados",
    },
    hero: {
      before: "Shuttles privados en",
      highlight: "Guanacaste",
      connector: "y",
      after: "toda Costa Rica",
      intro:
        "Traslados privados puerta a puerta desde el aeropuerto de Liberia (LIR) a todas las playas y destinos de Costa Rica.",
      badges: {
        airport: "Shuttles de aeropuerto",
        beach: "Shuttles entre playas",
        destination: "Shuttles entre destinos",
      },
    },
    popular: {
      eyebrow: "Desde el aeropuerto de Liberia (LIR)",
      heading: "Rutas populares y precios",
      intro: (minPax: number, maxPax: number) =>
        `Precios fijos en USD por vehículo para ${minPax}–${maxPax} pasajeros, 13% de IVA incluido. Mismo precio cualquier día del año.`,
      from: "desde",
      quote: "Cotizar",
      perVehicle: "por vehículo",
      seeAll: "Ver la lista completa de precios",
      seeAllCount: (count: number) => `Ver la lista completa de precios (${count} rutas)`,
      travelTime: travelTimeEs,
    },
    goodToKnow: {
      heading: "Lo que debes saber",
      intro: "Antes de reservar: precios, cambios y cancelaciones.",
      cancellation: {
        title: "Cancelación",
        before: {
          strong: "Con más de 48 horas:",
          text: "Reembolso completo (menos el 13% de impuesto)",
        },
        within: { strong: "Con menos de 48 horas:", text: "No reembolsable" },
        email: "Correo:",
      },
      changes: {
        title: "Cambios y modificaciones",
        items: [
          "Cambios gratis hasta 48 horas antes de la recogida",
          "Cambia la hora, la fecha o el lugar (sujeto a disponibilidad)",
          "Un cambio de ruta puede afectar el precio",
        ],
      },
      help: {
        title: "¿Necesitas ayuda?",
        items: [
          "Soporte por WhatsApp antes, durante y después de tu viaje",
          "Equipo bilingüe disponible los 7 días de la semana",
        ],
        reachUs: "Escríbenos al",
      },
      pricing: {
        title: "Precios",
        items: [
          "El precio es por vehículo, no por persona",
          "Sin cargos ocultos: el precio que ves es el final",
          "Todos los impuestos incluidos (13% de IVA)",
        ],
      },
    },
    faq: {
      eyebrow: "Centro de ayuda",
      heading: "Preguntas frecuentes",
      intro: "Las preguntas que más nos hacen antes de reservar.",
      seeAll: "Ver todas las preguntas",
    },
    footer: {
      home: "Inicio",
      prices: "Precios",
      faq: "Preguntas frecuentes",
      whatsapp: "WhatsApp",
      email: "Correo",
      rights: "Todos los derechos reservados.",
    },
  },
});
