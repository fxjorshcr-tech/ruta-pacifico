import { defineCopy } from "@/lib/i18n";
import { VEHICLE_TIERS, type VehicleTier } from "@/lib/vehicles";
import { WHATSAPP_DISPLAY } from "@/lib/contact";

/** "1–5, 6–9, 10–12" and "1–5", straight from the fleet definition. */
const TIER_RANGES = VEHICLE_TIERS.map((t) => `${t.minPax}–${t.maxPax}`).join(", ");
const FIRST_TIER = `${VEHICLE_TIERS[0].minPax}–${VEHICLE_TIERS[0].maxPax}`;

/**
 * Spanish "who usually books this size" per tier. The English strings come
 * from `VEHICLE_TIERS` itself (`typicalUse`, `paxLabel`), which llms.txt
 * also reads, so only the Spanish twin lives here.
 */
const TYPICAL_USE_ES: Record<VehicleTier["key"], string> = {
  staria: "Familias, parejas, viajeros solos",
  hiace: "Grupos medianos, equipaje extra o tablas de surf",
  maxus: "Grupos grandes, bodas, grupos corporativos",
};

/** Copy for the public price list (/prices). */
export const PRICES = defineCopy({
  en: {
    metaTitle: "Private Shuttle Prices in Costa Rica — Full Price List (USD)",
    metaDescription:
      "Every Ruta Pacifico private shuttle price, published: Liberia Airport (LIR) to Tamarindo, Flamingo, Papagayo, Nosara, La Fortuna and 300+ more routes. Fixed USD prices per vehicle, taxes included, same price all year.",
    keywords: [
      "Liberia airport shuttle prices",
      "LIR shuttle cost",
      "Costa Rica private shuttle prices",
      "Liberia airport to Tamarindo shuttle price",
      "Guanacaste airport transfer cost",
      "how much is a private shuttle in Costa Rica",
      "Ruta Pacifico prices",
      "Ruta Pacifico rates",
    ],
    ogImageAlt: "Ruta Pacifico private shuttle price list",
    /** Plain HTML on the page and the FAQPage node in JSON-LD. */
    faqs: [
      {
        q: "Are Ruta Pacifico's prices per person or per vehicle?",
        a: `Per vehicle. The figure in the table is the total for the whole group, whatever the number of passengers within the tier (${TIER_RANGES} passengers). Two people and five people pay the same price in the ${FIRST_TIER} tier.`,
      },
      {
        q: "Do prices go up in high season, at Christmas or New Year?",
        a: "No. The price published here is the price on any date of the year, including Christmas, New Year, Easter week and the December–April high season. There is no night surcharge and no airport fee either.",
      },
      {
        q: "What is included in the price?",
        a: "The private vehicle and professional bilingual driver, fuel, tolls, 13% VAT, WiFi, bottled water, child or booster seats on request and, on airport pickups, real-time flight tracking with a name sign at arrivals. The only optional extra is a driver gratuity.",
      },
      {
        q: "My route is not in the list. How do I get a price?",
        a: `The list shows the most requested routes. More than 1,000 origin/destination pairs are priced on the booking page, and any other pickup or drop-off in Costa Rica is quoted on WhatsApp (${WHATSAPP_DISPLAY}) within minutes at the same fixed, per-vehicle terms.`,
      },
      {
        q: "How do I pay, and when?",
        a: "Book online with a credit or debit card, or confirm on WhatsApp and pay by card or cash. Nothing is charged at pickup beyond the price shown. Cancellations more than 48 hours before pickup are refunded in full minus the 13% tax.",
      },
    ],
    jsonLd: {
      serviceName: (origin: string, destination: string) =>
        `Private Shuttle: ${origin} to ${destination}`,
      catalogName: "Ruta Pacifico private shuttle price list",
      catalogDescription: (count: number, low: number, high: number) =>
        `${count} private shuttle routes in Costa Rica priced from $${low} to $${high} per vehicle, USD, 13% VAT included.`,
      breadcrumbHome: "Home",
      breadcrumbPrices: "Prices",
    },
    hero: {
      imageAlt: "Private shuttle on the Guanacaste coast",
      eyebrow: "Public price list · USD · per vehicle",
      titleBefore: "Private Shuttle",
      titleHighlight: "Prices",
      titleAfter: "in Costa Rica",
      intro: (count: number, low: number) =>
        `Every price we charge, published: ${count} routes from Liberia Airport (LIR), San José Airport (SJO) and between beaches. Airport transfers from Liberia start at $${low} per vehicle, 13% VAT included, and the price is the same on any date of the year.`,
      introFallback:
        "Every price we charge, published: fixed, per vehicle, taxes included, the same on any date of the year.",
    },
    facts: {
      heading: "How our pricing works",
    },
    tiers: {
      heading: "Price tiers by group size",
      hint: "Count everyone, adults and children. Your group falls into exactly one tier.",
      passengers: "Passengers",
      vehicle: "Vehicle",
      typicalUse: "Typical use",
      paxLabel: (tier: VehicleTier) => tier.paxLabel,
      vehicleLabel: (tier: VehicleTier) => `${tier.name} or similar`,
      typicalUseOf: (tier: VehicleTier) => tier.typicalUse,
    },
    jumpNav: {
      label: "Jump to a price group",
      item: (title: string, count: number) => `${title} (${count})`,
      count: (n: number) => `${n} route${n === 1 ? "" : "s"}`,
    },
    table: {
      caption: (title: string) =>
        `${title}: private shuttle prices in USD per vehicle, 13% VAT included`,
      route: "Route",
      travelTime: "Travel time",
      pax: (min: number, max: number) => `${min}–${max} pax`,
      bookColumn: "Book",
      book: "Book",
      onRequest: "on request",
      returnLabel: "Return",
    },
    unavailable: {
      heading: "Prices are loading",
      before: "The live price list is temporarily unavailable. Search any route on the",
      bookingPage: "booking page",
      between: "or ask on",
      whatsapp: "WhatsApp",
    },
    notListed: {
      heading: "Need a route that is not listed?",
      body: (count: number) =>
        `This page lists the ${count} routes travellers ask about most. More than 1,000 other origin/destination pairs are already priced on the booking page, and any other address in Costa Rica is quoted on WhatsApp within minutes, on the same fixed, per-vehicle terms.`,
      bodyFallback:
        "More than 1,000 origin/destination pairs are priced on the booking page, and any other address in Costa Rica is quoted on WhatsApp within minutes, on the same fixed, per-vehicle terms.",
      searchAll: "Search every route",
      whatsapp: (display: string) => `WhatsApp ${display}`,
    },
    faqHeading: "Questions about prices",
    footer: {
      home: "Home",
      allRoutes: "All routes",
      faq: "FAQ",
      whatsapp: "WhatsApp",
      rights: "All rights reserved.",
    },
  },
  es: {
    metaTitle: "Precios de shuttle privado desde el Aeropuerto de Liberia — Lista completa (USD)",
    metaDescription:
      "Todos los precios de shuttle privado de Ruta Pacifico, publicados: Aeropuerto de Liberia (LIR) a Tamarindo, Flamingo, Papagayo, Nosara, La Fortuna y más de 300 rutas. Precio fijo en USD por vehículo, impuestos incluidos, el mismo todo el año.",
    keywords: [
      "precios shuttle aeropuerto Liberia",
      "cuánto cuesta shuttle Liberia Tamarindo",
      "precio traslado aeropuerto Liberia",
      "precios shuttle privado Costa Rica",
      "precio transporte aeropuerto Guanacaste",
      "cuánto cuesta un shuttle privado en Costa Rica",
      "Ruta Pacifico precios",
      "Ruta Pacifico tarifas",
    ],
    ogImageAlt: "Lista de precios de shuttle privado de Ruta Pacifico",
    faqs: [
      {
        q: "¿Los precios de Ruta Pacifico son por persona o por vehículo?",
        a: `Por vehículo. La cifra de la tabla es el total para todo el grupo, sin importar cuántos pasajeros viajen dentro de la categoría (${TIER_RANGES} pasajeros). Dos personas y cinco personas pagan el mismo precio en la categoría de ${FIRST_TIER}.`,
      },
      {
        q: "¿Suben los precios en temporada alta, en Navidad o en Año Nuevo?",
        a: "No. El precio publicado aquí es el precio en cualquier fecha del año, incluidos Navidad, Año Nuevo, Semana Santa y la temporada alta de diciembre a abril. Tampoco hay recargo nocturno ni tarifa de aeropuerto.",
      },
      {
        q: "¿Qué incluye el precio?",
        a: "El vehículo privado y un chofer profesional bilingüe, combustible, peajes, 13% de IVA, WiFi, agua embotellada, sillas para niños o boosters a solicitud y, en las recogidas en el aeropuerto, seguimiento de vuelo en tiempo real con un rótulo con tu nombre en llegadas. El único extra opcional es la propina para el chofer.",
      },
      {
        q: "Mi ruta no está en la lista. ¿Cómo obtengo un precio?",
        a: `La lista muestra las rutas más solicitadas. Más de mil combinaciones de origen y destino ya tienen precio en la página de reservas, y cualquier otro punto de recogida o entrega en Costa Rica se cotiza por WhatsApp (${WHATSAPP_DISPLAY}) en cuestión de minutos, con las mismas condiciones: precio fijo y por vehículo.`,
      },
      {
        q: "¿Cómo y cuándo pago?",
        a: "Reserva en línea con tarjeta de crédito o débito, o confirma por WhatsApp y paga con tarjeta o en efectivo. En la recogida no se cobra nada además del precio mostrado. Las cancelaciones con más de 48 horas de anticipación se reembolsan por completo, menos el 13% de impuesto.",
      },
    ],
    jsonLd: {
      serviceName: (origin: string, destination: string) =>
        `Shuttle privado: ${origin} a ${destination}`,
      catalogName: "Lista de precios de shuttle privado de Ruta Pacifico",
      catalogDescription: (count: number, low: number, high: number) =>
        `${count} rutas de shuttle privado en Costa Rica con precios desde $${low} hasta $${high} por vehículo, en USD, 13% de IVA incluido.`,
      breadcrumbHome: "Inicio",
      breadcrumbPrices: "Precios",
    },
    hero: {
      imageAlt: "Shuttle privado en la costa de Guanacaste",
      eyebrow: "Lista de precios pública · USD · por vehículo",
      titleBefore: "Precios de",
      titleHighlight: "Shuttle Privado",
      titleAfter: "en Costa Rica",
      intro: (count: number, low: number) =>
        `Todos los precios que cobramos, publicados: ${count} rutas desde el Aeropuerto de Liberia (LIR), el Aeropuerto de San José (SJO) y entre playas. Los traslados desde el Aeropuerto de Liberia empiezan en $${low} por vehículo, con el 13% de IVA incluido, y el precio es el mismo en cualquier fecha del año.`,
      introFallback:
        "Todos los precios que cobramos, publicados: fijos, por vehículo, con impuestos incluidos y los mismos en cualquier fecha del año.",
    },
    facts: {
      heading: "Cómo funcionan nuestros precios",
    },
    tiers: {
      heading: "Precios según el tamaño del grupo",
      hint: "Cuenta a todos, adultos y niños. Tu grupo cae en una sola categoría.",
      passengers: "Pasajeros",
      vehicle: "Vehículo",
      typicalUse: "Uso típico",
      paxLabel: (tier: VehicleTier) => `${tier.minPax} – ${tier.maxPax} pasajeros`,
      vehicleLabel: (tier: VehicleTier) => `${tier.name} o similar`,
      typicalUseOf: (tier: VehicleTier) => TYPICAL_USE_ES[tier.key] ?? tier.typicalUse,
    },
    jumpNav: {
      label: "Ir a un grupo de precios",
      item: (title: string, count: number) => `${title} (${count})`,
      count: (n: number) => `${n} ruta${n === 1 ? "" : "s"}`,
    },
    table: {
      caption: (title: string) =>
        `${title}: precios de shuttle privado en USD por vehículo, 13% de IVA incluido`,
      route: "Ruta",
      travelTime: "Tiempo de viaje",
      pax: (min: number, max: number) => `${min}–${max} pax`,
      bookColumn: "Reservar",
      book: "Reservar",
      onRequest: "consultar",
      returnLabel: "Regreso",
    },
    unavailable: {
      heading: "Los precios se están cargando",
      before:
        "La lista de precios en vivo no está disponible por el momento. Busca cualquier ruta en la",
      bookingPage: "página de reservas",
      between: "o pregúntanos por",
      whatsapp: "WhatsApp",
    },
    notListed: {
      heading: "¿Necesitas una ruta que no está en la lista?",
      body: (count: number) =>
        `Esta página muestra las ${count} rutas que más consultan los viajeros. Más de mil combinaciones de origen y destino ya tienen precio en la página de reservas, y cualquier otra dirección en Costa Rica se cotiza por WhatsApp en cuestión de minutos, con las mismas condiciones: precio fijo y por vehículo.`,
      bodyFallback:
        "Más de mil combinaciones de origen y destino ya tienen precio en la página de reservas, y cualquier otra dirección en Costa Rica se cotiza por WhatsApp en cuestión de minutos, con las mismas condiciones: precio fijo y por vehículo.",
      searchAll: "Buscar todas las rutas",
      whatsapp: (display: string) => `WhatsApp ${display}`,
    },
    faqHeading: "Preguntas sobre precios",
    footer: {
      home: "Inicio",
      allRoutes: "Todas las rutas",
      faq: "Preguntas frecuentes",
      whatsapp: "WhatsApp",
      rights: "Todos los derechos reservados.",
    },
  },
});
