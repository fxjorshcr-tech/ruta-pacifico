import { defineCopy } from "@/lib/i18n";

/**
 * Copy for the ~1,400 route pages (`/private-shuttle/[slug]`), the
 * destination guide and the route FAQ block. Route names, hotel names,
 * prices and the raw `duracion` column come from the database and are never
 * translated; they are interpolated through the functions below.
 */
export const ROUTE = defineCopy({
  en: {
    notFoundTitle: "Route not found",
    /**
     * Written to match the sub-questions answer engines generate for a route
     * ("how much", "how long", "where is the pickup") and dated so the page
     * reads as current. Short destination names where the guide has them.
     */
    metaTitle: (origen: string, destino: string, price: number, year: number) =>
      `${origen} to ${destino} Private Shuttle: from $${price}, Duration & Pickup (${year})`,
    metaDescription: (origen: string, destino: string, duracion: string, price: number) =>
      `Private shuttle from ${origen} to ${destino}${
        duracion ? ` (${duracion})` : ""
      }. Fixed price from $${price} per vehicle, door-to-door, bilingual driver, flight tracking. Book online.`,
    keywords: (origen: string, destino: string) => [
      `${origen} to ${destino} shuttle`,
      `${origen} ${destino} transfer`,
      `private shuttle ${destino}`,
      `${destino} Costa Rica transfer`,
      "Costa Rica private shuttle",
      "Guanacaste shuttle",
    ],
    ogImageAlt: (origen: string, destino: string) =>
      `Private shuttle from ${origen} to ${destino}`,

    jsonLd: {
      offerName: (origen: string, destino: string, minPax: number, maxPax: number) =>
        `${origen} → ${destino} — ${minPax} to ${maxPax} passengers`,
      passengers: "passengers",
      serviceName: (origen: string, destino: string) =>
        `Private Shuttle: ${origen} to ${destino}`,
      serviceDescription: (
        origen: string,
        destino: string,
        duracion: string,
        airportPickup: boolean,
      ) =>
        `Private, direct shuttle service from ${origen} to ${destino}${
          duracion ? ` — approximately ${duracion}` : ""
        }. Includes a professional bilingual driver, air-conditioned vehicle, WiFi, water${
          airportPickup ? " and real-time flight tracking" : ""
        }.`,
      serviceTypeAirport: "Airport transfer",
      serviceTypeGround: "Private ground transportation",
      category: "Ground transportation",
      tripName: (origen: string, destino: string) => `${origen} to ${destino}`,
      tripDescription: (origen: string, destino: string) =>
        `Private transfer from ${origen} to ${destino}.`,
      breadcrumbHome: "Home",
      breadcrumbShuttles: "Private Shuttles",
      breadcrumbRoute: (origen: string, destino: string) => `${origen} → ${destino}`,
    },

    hero: {
      imageAlt: "Private shuttle in Costa Rica",
      badge: (duracion: string) => `Private Shuttle · ${duracion || "Direct"}`,
      startingFrom: "Starting from",
      perVehicle: (minPax: number, maxPax: number) =>
        `per vehicle (${minPax}–${maxPax} pax) · all taxes included`,
      perks: ["Private vehicle", "Fixed price", "Free cancellation"],
      continueCta: "Continue to book",
      continueHint: "Next: pick vehicle, date, passengers & pickup details",
    },

    info: {
      travelTimeLabel: "Travel time",
      travelTimeFallback: "Varies by traffic",
      privateServiceLabel: "Private service",
      privateServiceValue: (maxPax: number) => `Just your group — up to ${maxPax} pax`,
      includedLabel: "What's included",
      includedValue: "WiFi, water, child seats",
    },

    /**
     * The direct answer, first prose after the hero: price per vehicle and
     * tier, drive time, pickup, what is included. Assembled in
     * src/lib/routeAnswer.ts; the same text is served in the Markdown
     * version so what an assistant quotes is what the visitor reads.
     */
    answer: {
      intro: (origen: string, destino: string) =>
        `A private shuttle from ${origen} to ${destino} with Ruta Pacifico costs `,
      tier: (price: number, minPax: number, maxPax: number) =>
        `$${price} per vehicle for ${minPax}–${maxPax} passengers`,
      listSeparator: ", ",
      lastSeparator: " and ",
      priceSuffix: ", USD, 13% VAT included.",
      duration: (time: string) => ` The drive takes ${time}, door to door.`,
      pickupAirport: (origen: string) =>
        ` Your driver meets you at the ${origen} arrivals exit holding a sign with your name and tracks your flight, so a delay never costs you the ride.`,
      pickupToAirport: (origen: string, destino: string) =>
        ` Pickup is at your hotel door in ${origen}, timed so you reach ${destino} about 3 hours before an international departure.`,
      pickupHotel: (origen: string) =>
        ` Pickup is at the door of your hotel, villa or rental in ${origen}, at the time you choose.`,
      closing:
        " The price is the same any day or hour of the year and includes the driver, fuel, tolls, WiFi, bottled water and child seats. Book online; nothing is paid at pickup.",
      /** "Prices updated October 2026": visible freshness stamp. */
      pricesUpdated: (date: string) => `Prices updated ${date}`,
    },

    /** Visible comparison table; qualitative on purpose (no invented competitor prices). */
    compare: {
      heading: (origen: string, destino: string) =>
        `Private shuttle vs. shared shuttle, taxi and rental car: ${origen} to ${destino}`,
      intro:
        "How the four ways of making this trip compare. Only the private shuttle column is a price we publish and guarantee.",
      columns: ["", "Private shuttle (this page)", "Shared shuttle", "Taxi / ride-hailing", "Rental car"],
      rows: (price: number, minPax: number, maxPax: number) => [
        [
          "Price",
          `$${price} per vehicle (${minPax}–${maxPax} passengers), fixed and published`,
          "Per seat: the total grows with every passenger",
          "Metered or negotiated at the curb; not fixed",
          "Daily rate plus insurance, fuel, deposit and parking",
        ],
        [
          "Departure time",
          "Your time, 24/7, no night surcharge",
          "Fixed timetable",
          "On availability",
          "Yours",
        ],
        [
          "Route",
          "Direct, door to door",
          "Several hotel stops or a change of van at a hub",
          "Direct",
          "Self-drive: navigation and road conditions are on you",
        ],
        ["Who is on board", "Only your group", "Other travellers", "Only your group", "Only your group"],
        ["Flight tracking", "Included", "Not usually", "No", "Not applicable"],
        ["Child seats", "Free, installed before pickup", "Varies", "Rarely available", "Daily surcharge"],
      ],
    },

    /** Headings of the Markdown version (app/[lang]/md/private-shuttle/[slug]). */
    markdown: {
      title: (origen: string, destino: string) => `Private shuttle from ${origen} to ${destino}`,
      summary: "Summary",
      htmlVersion: "This page as HTML",
      otherLanguage: "Versión en español",
      book: "Book online",
      whatsapp: "WhatsApp",
      travelTime: "Travel time",
      prices: "Prices (USD per vehicle, all taxes included)",
      priceColumns: ["Passengers", "Vehicle", "Price", "Book"],
      bookLink: "Book this size",
      included: "What is included in every ride",
      includedItems: [
        "Private vehicle: only your group on board, direct route, no detours",
        "Door-to-door pickup and drop-off",
        "Professional bilingual (English / Spanish) driver",
        "Fuel, tolls and 13% VAT",
        "Air conditioning, free WiFi, bottled water, phone chargers",
        "Child and booster seats on request, free",
        "Real-time flight tracking on airport pickups",
        "Free changes and cancellation up to 48 hours before pickup",
      ],
      related: "Related routes",
      returnTrip: "Return trip",
      from: (price: number) => `from $${price}`,
      about: "About Ruta Pacifico",
      aboutText:
        "Ruta Pacifico is a licensed and insured Costa Rican ground-transportation operator (ICT licence #4121-2025) based in Liberia, Guanacaste, specialised in private airport shuttles from Liberia International Airport (LIR) and private transfers across Costa Rica. Prices are per vehicle, fixed and published; nothing is paid at pickup.",
      allPrices: "Every route and price",
      generated: "Markdown version of the route page; identical content, generated from the same data.",
    },

    booking: {
      step: "Step 2 of 3 · Trip details",
      title: "Choose vehicle & trip details",
      intro: "Pick the vehicle for your group, the date and time, and tell us where to meet you.",
    },

    footer: {
      home: "Home",
      allRoutes: "All routes",
      faq: "FAQ",
      rights: "All rights reserved.",
    },
  },
  es: {
    notFoundTitle: "Ruta no encontrada",
    metaTitle: (origen: string, destino: string, price: number, year: number) =>
      `Shuttle privado de ${origen} a ${destino}: desde $${price}, duración y recogida (${year})`,
    metaDescription: (origen: string, destino: string, duracion: string, price: number) =>
      `Traslado privado de ${origen} a ${destino}${
        duracion ? ` (${duracion})` : ""
      }. Precio fijo desde $${price} por vehículo, puerta a puerta, chofer bilingüe, seguimiento de vuelo. Reserva en línea.`,
    keywords: (origen: string, destino: string) => [
      `shuttle ${origen} ${destino}`,
      `traslado ${origen} a ${destino}`,
      `shuttle privado ${destino}`,
      `transporte privado ${destino} Costa Rica`,
      "shuttle privado Costa Rica",
      "shuttle Guanacaste",
    ],
    ogImageAlt: (origen: string, destino: string) =>
      `Shuttle privado de ${origen} a ${destino}`,

    jsonLd: {
      offerName: (origen: string, destino: string, minPax: number, maxPax: number) =>
        `${origen} → ${destino} — ${minPax} a ${maxPax} pasajeros`,
      passengers: "pasajeros",
      serviceName: (origen: string, destino: string) =>
        `Shuttle privado: ${origen} a ${destino}`,
      serviceDescription: (
        origen: string,
        destino: string,
        duracion: string,
        airportPickup: boolean,
      ) =>
        `Servicio de shuttle privado y directo de ${origen} a ${destino}${
          duracion ? ` — aproximadamente ${duracion}` : ""
        }. Incluye chofer profesional bilingüe, vehículo con aire acondicionado, WiFi, agua${
          airportPickup ? " y seguimiento de vuelo en tiempo real" : ""
        }.`,
      serviceTypeAirport: "Traslado de aeropuerto",
      serviceTypeGround: "Transporte terrestre privado",
      category: "Transporte terrestre",
      tripName: (origen: string, destino: string) => `${origen} a ${destino}`,
      tripDescription: (origen: string, destino: string) =>
        `Traslado privado de ${origen} a ${destino}.`,
      breadcrumbHome: "Inicio",
      breadcrumbShuttles: "Shuttles privados",
      breadcrumbRoute: (origen: string, destino: string) => `${origen} → ${destino}`,
    },

    hero: {
      imageAlt: "Shuttle privado en Costa Rica",
      badge: (duracion: string) => `Shuttle privado · ${duracion || "Directo"}`,
      startingFrom: "Desde",
      perVehicle: (minPax: number, maxPax: number) =>
        `por vehículo (${minPax}–${maxPax} pax) · impuestos incluidos`,
      perks: ["Vehículo privado", "Precio fijo", "Cancelación gratuita"],
      continueCta: "Continuar con la reserva",
      continueHint: "Siguiente: elige vehículo, fecha, pasajeros y datos de recogida",
    },

    info: {
      travelTimeLabel: "Tiempo de viaje",
      travelTimeFallback: "Depende del tráfico",
      privateServiceLabel: "Servicio privado",
      privateServiceValue: (maxPax: number) => `Solo tu grupo — hasta ${maxPax} pax`,
      includedLabel: "Qué incluye",
      includedValue: "WiFi, agua, sillas para niños",
    },

    answer: {
      intro: (origen: string, destino: string) =>
        `Un shuttle privado de ${origen} a ${destino} con Ruta Pacifico cuesta `,
      tier: (price: number, minPax: number, maxPax: number) =>
        `$${price} por vehículo para ${minPax}–${maxPax} pasajeros`,
      listSeparator: ", ",
      lastSeparator: " y ",
      priceSuffix: ", en dólares, con el 13% de IVA incluido.",
      duration: (time: string) => ` El viaje dura ${time}, de puerta a puerta.`,
      pickupAirport: (origen: string) =>
        ` Tu chofer te espera en la salida de llegadas de ${origen} con un rótulo con tu nombre y sigue tu vuelo, así que un atraso nunca te cuesta el viaje.`,
      pickupToAirport: (origen: string, destino: string) =>
        ` Te recogemos en la puerta de tu hotel en ${origen}, a una hora calculada para que llegues a ${destino} unas 3 horas antes de un vuelo internacional.`,
      pickupHotel: (origen: string) =>
        ` Te recogemos en la puerta de tu hotel, villa o alquiler en ${origen}, a la hora que elijas.`,
      closing:
        " El precio es el mismo cualquier día y hora del año e incluye el chofer, el combustible, los peajes, WiFi, agua embotellada y sillas para niños. Reserva en línea; no se paga nada en la recogida.",
      pricesUpdated: (date: string) => `Precios actualizados: ${date}`,
    },

    compare: {
      heading: (origen: string, destino: string) =>
        `Shuttle privado vs. shuttle compartido, taxi y carro de alquiler: ${origen} a ${destino}`,
      intro:
        "Así se comparan las cuatro formas de hacer este trayecto. Solo la columna del shuttle privado es un precio que publicamos y garantizamos.",
      columns: ["", "Shuttle privado (esta página)", "Shuttle compartido", "Taxi / app de transporte", "Carro de alquiler"],
      rows: (price: number, minPax: number, maxPax: number) => [
        [
          "Precio",
          `$${price} por vehículo (${minPax}–${maxPax} pasajeros), fijo y publicado`,
          "Por asiento: el total sube con cada pasajero",
          "Con taxímetro o negociado en la calle; no es fijo",
          "Tarifa diaria más seguro, combustible, depósito y parqueo",
        ],
        [
          "Hora de salida",
          "La que elijas, 24/7, sin recargo nocturno",
          "Horario fijo",
          "Según disponibilidad",
          "La tuya",
        ],
        [
          "Recorrido",
          "Directo, de puerta a puerta",
          "Varias paradas en hoteles o cambio de buseta en un punto de conexión",
          "Directo",
          "Manejas tú: la navegación y el estado de la carretera corren por tu cuenta",
        ],
        ["Quién va a bordo", "Solo tu grupo", "Otros viajeros", "Solo tu grupo", "Solo tu grupo"],
        ["Seguimiento de vuelo", "Incluido", "Normalmente no", "No", "No aplica"],
        ["Sillas para niños", "Gratis, instaladas antes de la recogida", "Depende", "Rara vez disponibles", "Recargo diario"],
      ],
    },

    markdown: {
      title: (origen: string, destino: string) => `Shuttle privado de ${origen} a ${destino}`,
      summary: "Resumen",
      htmlVersion: "Esta página en HTML",
      otherLanguage: "English version",
      book: "Reservar en línea",
      whatsapp: "WhatsApp",
      travelTime: "Tiempo de viaje",
      prices: "Precios (USD por vehículo, impuestos incluidos)",
      priceColumns: ["Pasajeros", "Vehículo", "Precio", "Reservar"],
      bookLink: "Reservar este tamaño",
      included: "Qué incluye cada viaje",
      includedItems: [
        "Vehículo privado: solo tu grupo a bordo, ruta directa, sin desvíos",
        "Recogida y entrega de puerta a puerta",
        "Chofer profesional bilingüe (español / inglés)",
        "Combustible, peajes y 13% de IVA",
        "Aire acondicionado, WiFi gratis, agua embotellada, cargadores",
        "Sillas de carro y boosters para niños a solicitud, gratis",
        "Seguimiento del vuelo en tiempo real en recogidas de aeropuerto",
        "Cambios y cancelación gratis hasta 48 horas antes de la recogida",
      ],
      related: "Rutas relacionadas",
      returnTrip: "Viaje de regreso",
      from: (price: number) => `desde $${price}`,
      about: "Sobre Ruta Pacifico",
      aboutText:
        "Ruta Pacifico es un operador costarricense de transporte terrestre con licencia y seguro (licencia ICT #4121-2025), con base en Liberia, Guanacaste, especializado en shuttles privados desde el Aeropuerto Internacional de Liberia (LIR) y traslados privados en toda Costa Rica. Los precios son por vehículo, fijos y publicados; no se paga nada en la recogida.",
      allPrices: "Todas las rutas y precios",
      generated: "Versión en Markdown de la página de la ruta; mismo contenido, generado con los mismos datos.",
    },

    booking: {
      step: "Paso 2 de 3 · Detalles del viaje",
      title: "Elige el vehículo y los detalles del viaje",
      intro: "Elige el vehículo para tu grupo, la fecha y la hora, y dinos dónde recogerte.",
    },

    footer: {
      home: "Inicio",
      allRoutes: "Todas las rutas",
      faq: "Preguntas frecuentes",
      rights: "Todos los derechos reservados.",
    },
  },
});

/** `src/components/DestinationGuide.tsx` headings and link labels. */
export const DESTINATION_GUIDE = defineCopy({
  en: {
    about: (name: string) => `About ${name}`,
    travelNotes: (name: string) => `Travel notes: ${name}`,
    summaryHint: (originName: string) =>
      `What to expect, the ride from ${originName}, local tips and related routes`,
    rideFrom: (originName: string) => `The ride from ${originName}`,
    goodToKnow: "Good to know before you arrive",
    related: "Related private shuttles",
    returnTrip: (origen: string, destino: string) => `Return trip: ${origen} → ${destino}`,
    from: (price: number) => `from $${price}`,
  },
  es: {
    about: (name: string) => `Sobre ${name}`,
    travelNotes: (name: string) => `Notas de viaje: ${name}`,
    summaryHint: (originName: string) =>
      `Qué esperar, el trayecto desde ${originName}, consejos locales y rutas relacionadas`,
    rideFrom: (originName: string) => `El trayecto desde ${originName}`,
    goodToKnow: "Lo que conviene saber antes de llegar",
    related: "Shuttles privados relacionados",
    returnTrip: (origen: string, destino: string) => `Viaje de regreso: ${origen} → ${destino}`,
    from: (price: number) => `desde $${price}`,
  },
});

/** `src/components/RouteFaq.tsx` heading and hint. */
export const ROUTE_FAQ = defineCopy({
  en: {
    heading: (originName: string, destinationName: string) =>
      `Questions about ${originName} to ${destinationName}`,
    hint: "Duration, price, meeting point, stops, child seats, delays and cancellations",
  },
  es: {
    heading: (originName: string, destinationName: string) =>
      `Preguntas sobre el shuttle de ${originName} a ${destinationName}`,
    hint: "Duración, precio, punto de encuentro, paradas, sillas para niños, atrasos y cancelaciones",
  },
});
