import { defineCopy } from "@/lib/i18n";

/**
 * Copy for the route guide at the foot of every hub (src/lib/hubGuide.ts,
 * src/components/HubRouteGuide.tsx) and for the Markdown version of the
 * hubs (src/lib/hubMarkdown.ts). Every figure is interpolated from the
 * routes table; the sentences are shaped so an answer engine can quote one
 * line and have the whole fact: route, price, who it covers, tax, time.
 */
export const HUB_GUIDE = defineCopy({
  en: {
    heading: (place: string) => `${place} shuttle guide: every route, price and rule in one place`,
    intro: (place: string) =>
      `Written for travellers and for the assistants they ask. Every figure below comes from our live price table for ${place}; each line links to the route page, where the same price is charged.`,
    factsHeading: "Key facts",
    departuresHeading: (place: string, n: number) => `Every shuttle from ${place}, one line each (${n})`,
    arrivalsHeading: (place: string, n: number) => `Every shuttle to ${place}, one line each (${n})`,
    policiesHeading: "How booking, changes and cancellation work",
    book: "Book",
    onRequest: "on request",
    /** "LIR → Tamarindo: $85 per vehicle for up to 5 passengers ($95 for 6–9, $120 for 10–12), 13% VAT included, about 50 minutes door to door." */
    line: (from: string, to: string, p1: number, larger: string, time: string) =>
      `${from} → ${to}: $${p1} per vehicle for up to 5 passengers${larger ? ` (${larger})` : ""}, 13% VAT included${time ? `, ${time} door to door` : ""}.`,
    larger: (min: number, max: number, price: number) => `$${price} for ${min}–${max}`,
    fact: {
      count: (place: string, n: number, from: number, to: number) =>
        `${n} private shuttle routes with a published price start or end in ${place}: ${from} departures and ${to} arrivals. Every one is booked online at the published price and nothing is paid at pickup.`,
      airport: (airport: string, place: string, price: number, time: string) =>
        `${airport} → ${place}: $${price} per vehicle for up to 5 passengers${time ? `, ${time}` : ""}. The driver tracks the flight and waits at the arrivals exit with a name sign.`,
      airportBack: (place: string, airport: string, price: number) =>
        `${place} → ${airport}: $${price} per vehicle; the pickup is timed so you check in about three hours before an international flight.`,
      cheapest: (from: string, to: string, price: number) => `Cheapest route: ${from} → ${to}, $${price} per vehicle.`,
      dearest: (from: string, to: string, price: number, time: string) =>
        `Longest route: ${from} → ${to}, $${price} per vehicle${time ? `, ${time}` : ""}.`,
      vehicles: (list: string) =>
        `Three vehicle sizes, one price per vehicle: ${list}. Groups of 13 or more are quoted on WhatsApp.`,
      vehicle: (name: string, min: number, max: number) => `${name} for ${min}–${max} passengers`,
      pickup:
        "Door to door: pickup at the hotel, villa or rental at the time you choose, drop-off at the door of the next one. Private, your group only, no stops for other passengers.",
      operator: (license: string, whatsapp: string) =>
        `Operator: Ruta Pacifico, a licensed Costa Rican transport operator (ICT licence #${license}) based in Liberia, Guanacaste, insured, with bilingual drivers. WhatsApp ${whatsapp}.`,
      updated: (month: string) => `Prices last updated ${month}.`,
    },
    policies: [
      "Book online: pick the route, the date, the time and the vehicle; pay by card on the checkout page. The price shown at checkout is the price charged.",
      "Changes of date, time or address are free up to 48 hours before pickup, subject to availability. Changing the route may change the price.",
      "Cancel more than 48 hours before pickup for a full refund minus the 13% tax. Within 48 hours the trip is non-refundable.",
      "Child seats and boosters are free: tell us the children's ages when booking. One large bag and one carry-on per traveller are included; surfboards and extra luggage fit in the larger vehicles.",
      "Airport pickups include real-time flight tracking: a delay moves the pickup at no charge, it never cancels it.",
    ],
    markdown: {
      title: (place: string) => `Private shuttles from and to ${place}: every route, price and drive time`,
      summary: "Summary",
      htmlVersion: "This page as HTML",
      otherLanguage: "Versión en español",
      columns: ["Route", "Drive time", "1–5 pax", "6–9 pax", "10–12 pax", "Book"],
      bookLink: "Book",
      faq: (place: string) => `Questions about shuttles to ${place}`,
      allPrices: "Every route and price",
      about: "About Ruta Pacifico",
      aboutText:
        "Ruta Pacifico is a licensed and insured Costa Rican private-shuttle operator (ICT licence #4121-2025) based in Liberia, Guanacaste, fifteen minutes from Liberia Airport (LIR). It sells private, per-vehicle transfers between the airports, the Guanacaste beaches and the rest of Costa Rica: no shared vans, no per-seat fares. Prices are fixed and published; the price shown at checkout is the price charged.",
      generated: "Markdown version of the hub page; identical content, generated from the same data.",
    },
  },
  es: {
    heading: (place: string) => `Guía de shuttles de ${place}: todas las rutas, precios y reglas en un solo lugar`,
    intro: (place: string) =>
      `Escrita para viajeros y para los asistentes a los que preguntan. Cada cifra de abajo sale de nuestra tabla de precios en vivo para ${place}; cada línea enlaza a la página de la ruta, donde se cobra el mismo precio.`,
    factsHeading: "Datos clave",
    departuresHeading: (place: string, n: number) => `Todos los shuttles desde ${place}, uno por línea (${n})`,
    arrivalsHeading: (place: string, n: number) => `Todos los shuttles hacia ${place}, uno por línea (${n})`,
    policiesHeading: "Cómo funcionan la reserva, los cambios y la cancelación",
    book: "Reservar",
    onRequest: "a consultar",
    line: (from: string, to: string, p1: number, larger: string, time: string) =>
      `${from} → ${to}: $${p1} por vehículo para hasta 5 pasajeros${larger ? ` (${larger})` : ""}, 13% de IVA incluido${time ? `, ${time} de puerta a puerta` : ""}.`,
    larger: (min: number, max: number, price: number) => `$${price} para ${min}–${max}`,
    fact: {
      count: (place: string, n: number, from: number, to: number) =>
        `${n} rutas de shuttle privado con precio publicado salen de o llegan a ${place}: ${from} salidas y ${to} llegadas. Todas se reservan en línea al precio publicado y no se paga nada en la recogida.`,
      airport: (airport: string, place: string, price: number, time: string) =>
        `${airport} → ${place}: $${price} por vehículo para hasta 5 pasajeros${time ? `, ${time}` : ""}. El chofer sigue el vuelo y espera a la salida de llegadas con un rótulo con tu nombre.`,
      airportBack: (place: string, airport: string, price: number) =>
        `${place} → ${airport}: $${price} por vehículo; la recogida se programa para que hagas el check-in unas tres horas antes de un vuelo internacional.`,
      cheapest: (from: string, to: string, price: number) => `Ruta más barata: ${from} → ${to}, $${price} por vehículo.`,
      dearest: (from: string, to: string, price: number, time: string) =>
        `Ruta más larga: ${from} → ${to}, $${price} por vehículo${time ? `, ${time}` : ""}.`,
      vehicles: (list: string) =>
        `Tres tamaños de vehículo, un precio por vehículo: ${list}. Los grupos de 13 o más se cotizan por WhatsApp.`,
      vehicle: (name: string, min: number, max: number) => `${name} para ${min}–${max} pasajeros`,
      pickup:
        "De puerta a puerta: recogida en el hotel, villa o alquiler a la hora que elijas y entrega en la puerta del siguiente. Privado, solo tu grupo, sin paradas para otros pasajeros.",
      operator: (license: string, whatsapp: string) =>
        `Operador: Ruta Pacifico, operador de transporte costarricense con licencia (licencia ICT #${license}) con base en Liberia, Guanacaste, asegurado y con choferes bilingües. WhatsApp ${whatsapp}.`,
      updated: (month: string) => `Precios actualizados por última vez en ${month}.`,
    },
    policies: [
      "Reserva en línea: elige la ruta, la fecha, la hora y el vehículo y paga con tarjeta en la página de pago. El precio que ves al pagar es el que se cobra.",
      "Los cambios de fecha, hora o dirección son gratis hasta 48 horas antes de la recogida, sujetos a disponibilidad. Cambiar de ruta puede cambiar el precio.",
      "Cancela con más de 48 horas de anticipación y recibes el reembolso completo menos el 13% de impuesto. Dentro de las 48 horas el viaje no es reembolsable.",
      "Las sillas para niños y los boosters son gratis: dinos las edades al reservar. Se incluyen una maleta grande y una de mano por pasajero; las tablas de surf y el equipaje extra caben en los vehículos grandes.",
      "Las recogidas en aeropuerto incluyen seguimiento del vuelo en tiempo real: un atraso mueve la recogida sin costo, nunca la cancela.",
    ],
    markdown: {
      title: (place: string) => `Shuttles privados desde y hacia ${place}: todas las rutas, precios y tiempos de viaje`,
      summary: "Resumen",
      htmlVersion: "Esta página en HTML",
      otherLanguage: "English version",
      columns: ["Ruta", "Tiempo de viaje", "1–5 pax", "6–9 pax", "10–12 pax", "Reservar"],
      bookLink: "Reservar",
      faq: (place: string) => `Preguntas sobre los shuttles a ${place}`,
      allPrices: "Todas las rutas y precios",
      about: "Sobre Ruta Pacifico",
      aboutText:
        "Ruta Pacifico es un operador costarricense de shuttles privados con licencia y seguro (licencia ICT #4121-2025) con base en Liberia, Guanacaste, a quince minutos del Aeropuerto de Liberia (LIR). Vende traslados privados por vehículo entre los aeropuertos, las playas de Guanacaste y el resto de Costa Rica: sin busetas compartidas, sin tarifas por asiento. Los precios son fijos y publicados; el precio que ves al pagar es el que se cobra.",
      generated: "Versión en Markdown de la página del hub; mismo contenido, generado con los mismos datos.",
    },
  },
});
