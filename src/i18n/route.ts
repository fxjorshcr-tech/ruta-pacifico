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
    metaTitle: (origen: string, destino: string, price: number) =>
      `${origen} to ${destino} Private Shuttle (from $${price})`,
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
      /** Split around the two <strong> route names. */
      summary: {
        before: "Direct, non-stop service from ",
        between: " to ",
        after:
          ", operated by a professional bilingual driver in a modern air-conditioned private vehicle.",
        airport:
          " Arrival flights are monitored in real time and pickups are adjusted automatically to match your actual landing.",
      },
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
    metaTitle: (origen: string, destino: string, price: number) =>
      `Shuttle privado de ${origen} a ${destino} (desde $${price})`,
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
      /** Split around the two <strong> route names. */
      summary: {
        before: "Servicio directo y sin paradas de ",
        between: " a ",
        after:
          ", con un chofer profesional bilingüe en un vehículo privado moderno con aire acondicionado.",
        airport:
          " Monitoreamos los vuelos de llegada en tiempo real y ajustamos la recogida automáticamente a la hora real de aterrizaje.",
      },
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
