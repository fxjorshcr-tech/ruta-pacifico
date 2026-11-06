import { defineCopy } from "@/lib/i18n";

/**
 * Copy for the destination hub pages (/tamarindo-shuttle, /es/tamarindo-shuttle…).
 * Every figure comes from the live `routes` table; this file only holds the
 * prose and the sentence shapes it is poured into. Server-side only:
 * `DESTINATION_HUB[locale]` after `localeFromParams`.
 *
 * Voice: a Liberia transport operator who drives this road every week.
 * Plain statements, concrete details, no sales adjectives.
 */

/** What the FAQ and answer-line builders need to know about one hub. */
export interface HubFacts {
  /** "Tamarindo" */
  name: string;
  /** Region label from the destinations table, e.g. "Guanacaste". */
  region: string;
  /** LIR → destination price for 1–5 passengers, when sold. */
  lirPrice: number | null;
  /** "about 50 minutes" / "aprox. 50 minutos", when sold. */
  lirTime: string | null;
  /** Cheapest published price on any route from or to the destination. */
  lowest: number | null;
  /** How many priced routes leave from and arrive at the destination. */
  fromCount: number;
  toCount: number;
  /** Short names of the nearby hub destinations, may be empty. */
  nearby: string[];
}

export interface HubFaq {
  q: string;
  a: string;
}

function joinEn(parts: string[]): string {
  if (parts.length <= 1) return parts.join("");
  return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
}

function joinEs(parts: string[]): string {
  if (parts.length <= 1) return parts.join("");
  return `${parts.slice(0, -1).join(", ")} y ${parts[parts.length - 1]}`;
}

export const DESTINATION_HUB = defineCopy({
  en: {
    metaTitle: (name: string, price: number | null) =>
      price
        ? `${name} Shuttle — Private Transfers from Liberia Airport (LIR) from $${price}`
        : `${name} Shuttle — Private Transfers from Liberia Airport (LIR)`,
    metaDescription: (f: HubFacts) =>
      f.lirPrice && f.lirTime
        ? `Private shuttle from Liberia Airport (LIR) to ${f.name}: $${f.lirPrice} per vehicle for up to 5 passengers, taxes included, ${f.lirTime} door to door. Every shuttle from and to ${f.name} with prices, drive times and what is included. Ruta Pacifico, Liberia.`
        : `Every private shuttle from and to ${f.name}, Costa Rica, with prices per vehicle, drive times and what is included. Flight tracking on airport pickups, name sign at arrivals. Ruta Pacifico, Liberia.`,
    keywords: (name: string) => [
      `${name} shuttle`,
      `${name} private shuttle`,
      `Liberia airport to ${name}`,
      `LIR to ${name} shuttle`,
      `${name} airport transfer`,
      `${name} transportation`,
      `shuttle to ${name} Costa Rica`,
      `private driver ${name}`,
    ],
    heroAltFallback: (name: string) => `${name}, Costa Rica`,
    hero: {
      eyebrow: (region: string) => `${region} · ICT license 4121-2025 · Insured`,
      titleLead: "Private shuttle to",
      /** The answer-first paragraph under the title. */
      answer: (f: HubFacts) =>
        f.lirPrice && f.lirTime
          ? `A private shuttle from Liberia Airport (LIR) to ${f.name} with Ruta Pacifico costs $${f.lirPrice} per vehicle for up to 5 passengers, USD, 13% VAT included, and takes ${f.lirTime} door to door. Your driver tracks the flight and waits at the arrivals exit with your name on a sign. We also run ${f.fromCount + f.toCount} other priced routes from and to ${f.name}, listed below.`
          : `Ruta Pacifico runs ${f.fromCount + f.toCount} priced private shuttle routes from and to ${f.name}${f.lowest ? `, from $${f.lowest} per vehicle with taxes included` : ""}. Door-to-door, your group only, driver and fuel included, nothing paid at pickup.`,
      /** The one line under the title on phones: price, time, origin. */
      dataLine: (f: HubFacts) =>
        f.lirPrice && f.lirTime
          ? `From $${f.lirPrice} per vehicle · ${f.lirTime} from Liberia Airport (LIR)`
          : f.lowest
            ? `From $${f.lowest} per vehicle · ${f.fromCount + f.toCount} routes from and to ${f.name}`
            : `${f.fromCount + f.toCount} routes from and to ${f.name}`,
      book: "Book a shuttle",
      whatsapp: "WhatsApp us",
      badges: {
        private: "Private, your group only",
        fixed: "One price, taxes included",
        tracking: "Flight tracked at LIR",
      },
    },
    facts: {
      heading: (name: string) => `${name} shuttle at a glance`,
      routes: (n: number) => `${n} priced routes`,
      routesHint: (name: string) => `from and to ${name}, every one bookable online`,
      lowest: "Lowest fare",
      lowestHint: "any route, 1–5 passengers",
      lirHub: "Every Liberia Airport route",
    },
    intro: {
      readMore: (name: string) => `Read the ${name} guide`,
    },
    fold: {
      nearby: "Other destinations nearby",
      vehicles: "The vehicles and prices by group size",
      faq: (name: string) => `Questions about shuttles to ${name}`,
    },
    from: {
      heading: (name: string) => `Shuttles from ${name}`,
      body: (name: string) =>
        `Pickup at the door of your hotel, villa or rental in ${name}, at the time you choose. Prices are per vehicle, taxes included; a trip to the airport is timed so you check in about three hours before an international departure.`,
    },
    to: {
      heading: (name: string) => `Shuttles to ${name}`,
      body: (name: string) =>
        `From the airports, the other beaches and the rest of the country to your accommodation in ${name}. Airport pickups include flight tracking and a driver with your name on a sign at the arrivals exit.`,
    },
    table: {
      route: "Route",
      travelTime: "Drive time",
      pax: (min: number, max: number) => `${min}–${max} pax`,
      onRequest: "on request",
      book: "Book",
      bookColumn: "Book",
      caption: (heading: string) => `${heading}: price per vehicle by passenger count, in US dollars, taxes included.`,
    },
    guide: {
      about: (name: string) => `About ${name}`,
      arrival: (name: string) => `Arriving in ${name}`,
      tips: "Good to know before you go",
      bestFor: "Best for",
    },
    nearby: {
      heading: (region: string) => `Other destinations in ${region}`,
      body: "Each one has its own page with every shuttle from and to it.",
      cta: (name: string) => `${name} shuttles`,
    },
    vehicles: {
      heading: "The vehicles",
      body: "One price per vehicle, by group size. Every vehicle has air conditioning, WiFi, water and child seats on request.",
      pax: (min: number, max: number) => `${min}–${max} passengers`,
    },
    faqHeading: (name: string) => `Questions about shuttles to ${name}`,
    faqs: (f: HubFacts): HubFaq[] => {
      const out: HubFaq[] = [];
      if (f.lirPrice && f.lirTime) {
        out.push({
          q: `How long is the shuttle from Liberia Airport to ${f.name}?`,
          a: `${f.lirTime[0].toUpperCase()}${f.lirTime.slice(1)} door to door, on the real roads, not the fastest time a map app shows. The shuttle is private and direct, so there are no stops to drop other passengers off.`,
        });
        out.push({
          q: `How much does a private shuttle from Liberia Airport (LIR) to ${f.name} cost?`,
          a: `$${f.lirPrice} per vehicle for up to 5 passengers, USD, 13% VAT included. Larger groups pay the 6–9 or 10–12 passenger price for the whole vehicle; both are in the table on this page. The price is the same any day or hour of the year and nothing is paid at pickup.`,
        });
      } else if (f.lowest) {
        out.push({
          q: `How much does a private shuttle to ${f.name} cost?`,
          a: `Prices start at $${f.lowest} per vehicle for up to 5 passengers, taxes included, depending on where you start. Every route from and to ${f.name} is in the tables on this page with its price for each vehicle size.`,
        });
      }
      out.push({
        q: `Where does the driver meet me for the ride to ${f.name}?`,
        a: `At Liberia Airport, just outside the arrivals doors with a Ruta Pacifico sign carrying your name; we follow your flight number, so a delay moves the pickup, never cancels it. From a hotel, beach or another town, the driver comes to the door of the property at the time you booked.`,
      });
      out.push({
        q: `Can I get a shuttle from ${f.name} back to the airport or to another beach?`,
        a: `Yes. Every departure from ${f.name} we sell online is in the "Shuttles from ${f.name}" table above: the airports${f.nearby.length ? `, ${joinEn(f.nearby)}` : ""} and the rest of the country. Airport drop-offs are timed so you check in about three hours before an international flight.`,
      });
      out.push({
        q: `Do you have child seats for the trip to ${f.name}?`,
        a: `Yes, and they are free. Costa Rican law requires a car seat or booster for children under 12 or shorter than 1.45 m (4 ft 9 in), so tell us the ages when you book and the right seats are installed before pickup.`,
      });
      out.push({
        q: `What is the cancellation policy for a ${f.name} shuttle?`,
        a: `Cancel more than 48 hours before pickup for a full refund minus the 13% tax. Within 48 hours the trip is non-refundable. Changes to the date, time or address are free up to 48 hours before, subject to availability.`,
      });
      return out;
    },
    cta: {
      heading: (name: string) => `Book your ${name} shuttle`,
      body: "Pick the route, check the price for your group size and book in a couple of minutes. Nothing is paid at pickup.",
      book: "Book now",
      whatsapp: "Ask on WhatsApp",
      allPrices: "Every route and price",
    },
    jsonLd: {
      pageName: (name: string) => `${name} private shuttle: every route, price and drive time`,
      serviceName: (name: string) => `Private shuttle service to and from ${name}`,
      listName: (name: string) => `Private shuttle routes from and to ${name}`,
      routeName: (origin: string, destination: string) => `${origin} to ${destination}`,
      itemName: (origin: string, destination: string) => `Private Shuttle: ${origin} to ${destination}`,
      home: "Home",
      hub: (name: string) => `${name} shuttle`,
    },
  },
  es: {
    metaTitle: (name: string, price: number | null) =>
      price
        ? `Shuttle a ${name} — Traslados privados desde el Aeropuerto de Liberia (LIR) desde $${price}`
        : `Shuttle a ${name} — Traslados privados desde el Aeropuerto de Liberia (LIR)`,
    metaDescription: (f: HubFacts) =>
      f.lirPrice && f.lirTime
        ? `Shuttle privado del Aeropuerto de Liberia (LIR) a ${f.name}: $${f.lirPrice} por vehículo para hasta 5 pasajeros, impuestos incluidos, ${f.lirTime} de puerta a puerta. Todos los shuttles desde y hacia ${f.name} con precios, tiempos de viaje y lo que incluyen. Ruta Pacifico, Liberia.`
        : `Todos los shuttles privados desde y hacia ${f.name}, Costa Rica, con precios por vehículo, tiempos de viaje y lo que incluyen. Seguimiento de vuelo en recogidas de aeropuerto, rótulo con tu nombre en llegadas. Ruta Pacifico, Liberia.`,
    keywords: (name: string) => [
      `shuttle ${name}`,
      `shuttle privado ${name}`,
      `aeropuerto Liberia a ${name}`,
      `shuttle LIR a ${name}`,
      `traslado aeropuerto ${name}`,
      `transporte ${name}`,
      `shuttle a ${name} Costa Rica`,
      `chofer privado ${name}`,
    ],
    heroAltFallback: (name: string) => `${name}, Costa Rica`,
    hero: {
      eyebrow: (region: string) => `${region} · Licencia ICT 4121-2025 · Asegurados`,
      titleLead: "Shuttle privado a",
      answer: (f: HubFacts) =>
        f.lirPrice && f.lirTime
          ? `Un shuttle privado del Aeropuerto de Liberia (LIR) a ${f.name} con Ruta Pacifico cuesta $${f.lirPrice} por vehículo para hasta 5 pasajeros, en dólares, con el 13% de IVA incluido, y toma ${f.lirTime} de puerta a puerta. Tu chofer sigue el vuelo y te espera en la salida de llegadas con un rótulo con tu nombre. También operamos ${f.fromCount + f.toCount} rutas más con precio desde y hacia ${f.name}; están abajo.`
          : `Ruta Pacifico opera ${f.fromCount + f.toCount} rutas de shuttle privado con precio desde y hacia ${f.name}${f.lowest ? `, desde $${f.lowest} por vehículo con impuestos incluidos` : ""}. De puerta a puerta, solo tu grupo, chofer y combustible incluidos, sin pagar nada en la recogida.`,
      dataLine: (f: HubFacts) =>
        f.lirPrice && f.lirTime
          ? `Desde $${f.lirPrice} por vehículo · ${f.lirTime} desde el Aeropuerto de Liberia (LIR)`
          : f.lowest
            ? `Desde $${f.lowest} por vehículo · ${f.fromCount + f.toCount} rutas desde y hacia ${f.name}`
            : `${f.fromCount + f.toCount} rutas desde y hacia ${f.name}`,
      book: "Reservar un shuttle",
      whatsapp: "Escríbenos por WhatsApp",
      badges: {
        private: "Privado, solo tu grupo",
        fixed: "Un precio, impuestos incluidos",
        tracking: "Seguimiento de vuelo en LIR",
      },
    },
    facts: {
      heading: (name: string) => `Shuttle a ${name} en un vistazo`,
      routes: (n: number) => `${n} rutas con precio`,
      routesHint: (name: string) => `desde y hacia ${name}, todas reservables en línea`,
      lowest: "Tarifa más baja",
      lowestHint: "cualquier ruta, 1–5 pasajeros",
      lirHub: "Todas las rutas del Aeropuerto de Liberia",
    },
    intro: {
      readMore: (name: string) => `Leer la guía de ${name}`,
    },
    fold: {
      nearby: "Otros destinos cerca",
      vehicles: "Los vehículos y precios por tamaño de grupo",
      faq: (name: string) => `Preguntas sobre los shuttles a ${name}`,
    },
    from: {
      heading: (name: string) => `Shuttles desde ${name}`,
      body: (name: string) =>
        `Recogida en la puerta de tu hotel, villa o alquiler en ${name}, a la hora que elijas. Los precios son por vehículo, impuestos incluidos; un viaje al aeropuerto se programa para que hagas el check-in unas tres horas antes de un vuelo internacional.`,
    },
    to: {
      heading: (name: string) => `Shuttles hacia ${name}`,
      body: (name: string) =>
        `Desde los aeropuertos, las otras playas y el resto del país hasta tu alojamiento en ${name}. Las recogidas en aeropuerto incluyen seguimiento del vuelo y un chofer con tu nombre en un rótulo a la salida de llegadas.`,
    },
    table: {
      route: "Ruta",
      travelTime: "Tiempo de viaje",
      pax: (min: number, max: number) => `${min}–${max} pax`,
      onRequest: "a consultar",
      book: "Reservar",
      bookColumn: "Reservar",
      caption: (heading: string) => `${heading}: precio por vehículo según cantidad de pasajeros, en dólares, impuestos incluidos.`,
    },
    guide: {
      about: (name: string) => `Sobre ${name}`,
      arrival: (name: string) => `Llegar a ${name}`,
      tips: "Lo que conviene saber antes de ir",
      bestFor: "Ideal para",
    },
    nearby: {
      heading: (region: string) => `Otros destinos en ${region}`,
      body: "Cada uno tiene su propia página con todos los shuttles desde y hacia él.",
      cta: (name: string) => `Shuttles a ${name}`,
    },
    vehicles: {
      heading: "Los vehículos",
      body: "Un precio por vehículo, según el tamaño del grupo. Todos tienen aire acondicionado, WiFi, agua y sillas para niños a solicitud.",
      pax: (min: number, max: number) => `${min}–${max} pasajeros`,
    },
    faqHeading: (name: string) => `Preguntas sobre los shuttles a ${name}`,
    faqs: (f: HubFacts): HubFaq[] => {
      const out: HubFaq[] = [];
      if (f.lirPrice && f.lirTime) {
        out.push({
          q: `¿Cuánto dura el shuttle del Aeropuerto de Liberia a ${f.name}?`,
          a: `Alrededor de ${f.lirTime.replace(/^aprox\. /, "")} de puerta a puerta, en las carreteras reales, no el tiempo más rápido que muestra una app de mapas. El shuttle es privado y directo, así que no hay paradas para dejar a otros pasajeros.`,
        });
        out.push({
          q: `¿Cuánto cuesta un shuttle privado del Aeropuerto de Liberia (LIR) a ${f.name}?`,
          a: `$${f.lirPrice} por vehículo para hasta 5 pasajeros, en dólares, con el 13% de IVA incluido. Los grupos más grandes pagan el precio de 6–9 o 10–12 pasajeros por todo el vehículo; ambos están en la tabla de esta página. El precio es el mismo cualquier día y hora del año y no se paga nada en la recogida.`,
        });
      } else if (f.lowest) {
        out.push({
          q: `¿Cuánto cuesta un shuttle privado a ${f.name}?`,
          a: `Los precios empiezan en $${f.lowest} por vehículo para hasta 5 pasajeros, impuestos incluidos, según desde dónde salgas. Todas las rutas desde y hacia ${f.name} están en las tablas de esta página con su precio para cada tamaño de vehículo.`,
        });
      }
      out.push({
        q: `¿Dónde me espera el chofer para el viaje a ${f.name}?`,
        a: `En el Aeropuerto de Liberia, justo afuera de las puertas de llegadas con un rótulo de Ruta Pacifico con tu nombre; seguimos tu número de vuelo, así que un atraso mueve la recogida, nunca la cancela. Desde un hotel, una playa u otro pueblo, el chofer llega a la puerta de la propiedad a la hora que reservaste.`,
      });
      out.push({
        q: `¿Puedo tomar un shuttle desde ${f.name} de regreso al aeropuerto o a otra playa?`,
        a: `Sí. Todas las salidas desde ${f.name} que vendemos en línea están en la tabla "Shuttles desde ${f.name}" de arriba: los aeropuertos${f.nearby.length ? `, ${joinEs(f.nearby)}` : ""} y el resto del país. Las llegadas al aeropuerto se programan para que hagas el check-in unas tres horas antes de un vuelo internacional.`,
      });
      out.push({
        q: `¿Tienen sillas para niños para el viaje a ${f.name}?`,
        a: `Sí, y son gratis. La ley costarricense exige silla de carro o booster para menores de 12 años o de menos de 1,45 m, así que dinos las edades al reservar y las sillas correctas van instaladas antes de la recogida.`,
      });
      out.push({
        q: `¿Cuál es la política de cancelación de un shuttle a ${f.name}?`,
        a: `Cancela con más de 48 horas de anticipación y recibes el reembolso completo menos el 13% de impuesto. Dentro de las 48 horas el viaje no es reembolsable. Los cambios de fecha, hora o dirección son gratis hasta 48 horas antes, sujetos a disponibilidad.`,
      });
      return out;
    },
    cta: {
      heading: (name: string) => `Reserva tu shuttle a ${name}`,
      body: "Elige la ruta, revisa el precio para tu grupo y reserva en un par de minutos. No se paga nada en la recogida.",
      book: "Reservar ahora",
      whatsapp: "Preguntar por WhatsApp",
      allPrices: "Todas las rutas y precios",
    },
    jsonLd: {
      pageName: (name: string) => `Shuttle privado a ${name}: todas las rutas, precios y tiempos de viaje`,
      serviceName: (name: string) => `Servicio de shuttle privado desde y hacia ${name}`,
      listName: (name: string) => `Rutas de shuttle privado desde y hacia ${name}`,
      routeName: (origin: string, destination: string) => `${origin} a ${destination}`,
      itemName: (origin: string, destination: string) => `Shuttle privado: ${origin} a ${destination}`,
      home: "Inicio",
      hub: (name: string) => `Shuttle a ${name}`,
    },
  },
});

/** /destinations: the index of every destination hub. */
export const DESTINATIONS_INDEX = defineCopy({
  en: {
    metaTitle: "Shuttle destinations in Guanacaste & Costa Rica | Ruta Pacifico",
    metaDescription:
      "Private shuttles to every main destination from Liberia Airport (LIR): Tamarindo, Flamingo, Conchal, Papagayo, Nosara, Sámara, La Fortuna, Monteverde and more. Fixed per-vehicle prices, book online.",
    heroAlt: "Private shuttle on the Guanacaste coast, Costa Rica",
    eyebrow: "Where are you headed?",
    title: "Shuttle destinations",
    intro:
      "Pick your destination to see every private shuttle to and from it: fixed prices per vehicle with 13% VAT included, travel time from Liberia Airport, the destination guide and the questions travellers ask before booking.",
    home: "Home",
    lirName: "Liberia Airport (LIR)",
    lirTag: "Every airport route",
    from: (price: number) => `from $${price}`,
    fromLir: (price: number) => `from LIR $${price}`,
    routes: (n: number) => `${n} route${n === 1 ? "" : "s"}`,
    view: "See all shuttles",
    finderHeading: "Find your place and book",
    finderBody:
      "Every place we drive to or from, hotels and small beaches included, not only the destinations with their own page. Type a name, pick it, and choose your route.",
    hubsHeading: "Destination guides",
    hubsBody: "The main destinations, each with every shuttle to and from it, the local guide and the questions travellers ask.",
    finder: {
      headingFirst: "Where does your first shuttle start?",
      headingNext: "Where does your next shuttle start?",
      body: "Pick the place, see every route from it with the price, and book. After each shuttle you can add the next one or go to checkout.",
      gridFrom: (place: string) => `Shuttles from ${place}`,
      gridTo: (place: string) => `Shuttles to ${place}`,
      routesCount: (n: number) => `${n} route${n === 1 ? "" : "s"}`,
      directionLabel: "Direction",
      fromPlace: (place: string) => `From ${place}`,
      toPlace: (place: string) => `To ${place}`,
      book: "Book",
      onRequest: "on request",
      label: "Type where you are staying or where you want to go",
      placeholder: "e.g. Playa Hermosa, Nosara, LIR…",
      count: (n: number, total: number) =>
        n === total ? `${total} places, every one bookable online` : `${n} of ${total} places`,
      noMatch: "No place with that name. Try another spelling, or write to us on WhatsApp and we will quote it.",
      allPlaces: "Every place we drive to",
      loading: "Loading prices…",
      error: "The prices did not load. Reload the page or search your route on the booking page.",
      noRoutes: (place: string) => `No priced route touches ${place} right now.`,
      hubLink: (place: string) => `See the full ${place} page: tables, guide and questions`,
    },
  },
  es: {
    metaTitle: "Destinos de shuttle en Guanacaste y Costa Rica | Ruta Pacifico",
    metaDescription:
      "Shuttles privados a los principales destinos desde el Aeropuerto de Liberia (LIR): Tamarindo, Flamingo, Conchal, Papagayo, Nosara, Sámara, La Fortuna, Monteverde y más. Precios fijos por vehículo, reserva en línea.",
    heroAlt: "Shuttle privado en la costa de Guanacaste, Costa Rica",
    eyebrow: "¿Hacia dónde vas?",
    title: "Destinos de shuttle",
    intro:
      "Elige tu destino para ver todos los shuttles privados que llegan y salen de ahí: precios fijos por vehículo con el 13% de IVA incluido, tiempo de viaje desde el Aeropuerto de Liberia, la guía del destino y las preguntas que la gente hace antes de reservar.",
    home: "Inicio",
    lirName: "Aeropuerto de Liberia (LIR)",
    lirTag: "Todas las rutas del aeropuerto",
    from: (price: number) => `desde $${price}`,
    fromLir: (price: number) => `desde LIR $${price}`,
    routes: (n: number) => `${n} ruta${n === 1 ? "" : "s"}`,
    view: "Ver todos los shuttles",
    finderHeading: "Encuentra tu lugar y reserva",
    finderBody:
      "Todos los lugares desde o hacia los que manejamos, hoteles y playas pequeñas incluidos, no solo los destinos con página propia. Escribe un nombre, elígelo y escoge tu ruta.",
    hubsHeading: "Guías de destino",
    hubsBody: "Los destinos principales, cada uno con todos los shuttles desde y hacia él, la guía local y las preguntas que hace la gente.",
    finder: {
      headingFirst: "¿Dónde empieza tu primer shuttle?",
      headingNext: "¿Dónde empieza tu siguiente shuttle?",
      body: "Elige el lugar, mira todas las rutas que salen de ahí con su precio y reserva. Después de cada shuttle puedes agregar el siguiente o ir al pago.",
      gridFrom: (place: string) => `Shuttles desde ${place}`,
      gridTo: (place: string) => `Shuttles hacia ${place}`,
      routesCount: (n: number) => `${n} ruta${n === 1 ? "" : "s"}`,
      directionLabel: "Sentido",
      fromPlace: (place: string) => `Desde ${place}`,
      toPlace: (place: string) => `Hacia ${place}`,
      book: "Reservar",
      onRequest: "a consultar",
      label: "Escribe dónde te hospedas o adónde quieres ir",
      placeholder: "p. ej. Playa Hermosa, Nosara, LIR…",
      count: (n: number, total: number) =>
        n === total ? `${total} lugares, todos reservables en línea` : `${n} de ${total} lugares`,
      noMatch: "No hay ningún lugar con ese nombre. Prueba otra forma de escribirlo o escríbenos por WhatsApp y te lo cotizamos.",
      allPlaces: "Todos los lugares a los que manejamos",
      loading: "Cargando precios…",
      error: "No cargaron los precios. Recarga la página o busca tu ruta en la página de reservas.",
      noRoutes: (place: string) => `Ninguna ruta con precio toca ${place} por ahora.`,
      hubLink: (place: string) => `Ver la página completa de ${place}: tablas, guía y preguntas`,
    },
  },
});

/** The route picker on the hub pages (src/components/HubRoutePicker.tsx). */
export const HUB_ROUTE_PICKER = defineCopy({
  en: {
    label: "Pick your route and book",
    heading: "Pick your route",
    directionLabel: "Direction",
    fromPlace: (place: string) => `From ${place}`,
    toPlace: (place: string) => `To ${place}`,
    from: "From",
    to: "To",
    selectLabel: "Choose the other end of the route",
    book: "Book",
    bookRoute: "Book this route",
    perVehicle: "per vehicle, 1–5 pax",
    perVehicleShort: "per vehicle",
    onRequest: "price on request",
    pax: (min: number, max: number) => `${min}–${max} pax`,
    allRoutes: "All routes",
  },
  es: {
    label: "Elige tu ruta y reserva",
    heading: "Elige tu ruta",
    directionLabel: "Sentido",
    fromPlace: (place: string) => `Desde ${place}`,
    toPlace: (place: string) => `Hacia ${place}`,
    from: "Desde",
    to: "Hacia",
    selectLabel: "Elige el otro extremo de la ruta",
    book: "Reservar",
    bookRoute: "Reservar esta ruta",
    perVehicle: "por vehículo, 1–5 pax",
    perVehicleShort: "por vehículo",
    onRequest: "precio a consultar",
    pax: (min: number, max: number) => `${min}–${max} pax`,
    allRoutes: "Todas las rutas",
  },
});
