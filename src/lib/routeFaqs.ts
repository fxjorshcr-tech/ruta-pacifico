import type { Route } from "@/lib/routes";
import type { Destination } from "@/lib/destinations";
import type { Locale } from "@/lib/i18n";
import { isAirportOrigin } from "@/lib/slug";
import { VEHICLE_TIERS } from "@/lib/vehicles";

/**
 * Route-specific questions and answers, generated from the data we already
 * hold (duration, per-tier prices, airport at either end). These are the
 * questions travellers put to search engines and AI assistants before they
 * book ("how long", "how much", "where does the driver meet me", "child
 * seats", "delayed flight"). Rendered collapsed on the route page and
 * emitted as FAQPage JSON-LD so answer engines can quote them directly.
 *
 * Answers are plain text (no Markdown) so the same string works in HTML and
 * in JSON-LD.
 */
export interface RouteFaq {
  q: string;
  a: string;
}

/** Parse the free-form `duracion` column ("4,5 H", "45 min", "1h 30min") to minutes. */
export function durationMinutes(raw: string | null | undefined): number | null {
  if (!raw) return null;
  const s = raw.trim().toLowerCase().replace(",", ".");
  let m = s.match(/^(\d+(?:\.\d+)?)\s*h(?:ours?)?(?:\s*(\d+)\s*min)?$/);
  if (m) {
    const hours = parseFloat(m[1]);
    const extra = m[2] ? parseInt(m[2], 10) : 0;
    // "1.15 H" in this dataset means 1 h 15 min, not 1.15 h.
    const frac = hours - Math.floor(hours);
    const fracMinutes =
      frac > 0 && Math.abs(frac - 0.5) > 0.01 ? Math.round(frac * 100) : Math.round(frac * 60);
    return Math.floor(hours) * 60 + fracMinutes + extra;
  }
  m = s.match(/^(\d+)\s*min/);
  if (m) return parseInt(m[1], 10);
  return null;
}

/** "about 1 hour 30 minutes", "about 45 minutes". */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const min = minutes % 60;
  if (h === 0) return `about ${min} minutes`;
  const hours = `${h} hour${h === 1 ? "" : "s"}`;
  return min ? `about ${hours} ${min} minutes` : `about ${hours}`;
}

/**
 * "1 hora y 30 minutos", "45 minutos": the bare Spanish duration, without
 * "about", so each sentence below can pick its own qualifier ("alrededor
 * de", "aproximadamente").
 */
function formatDurationEs(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const min = minutes % 60;
  if (h === 0) return `${min} minutos`;
  const hours = `${h} hora${h === 1 ? "" : "s"}`;
  return min ? `${hours} y ${min} minutos` : hours;
}

function priceSentence(route: Route): string {
  const parts: string[] = [];
  for (const tier of VEHICLE_TIERS) {
    const price = route[tier.priceField];
    if (typeof price === "number" && price > 0) {
      parts.push(`$${price} for ${tier.minPax} to ${tier.maxPax} passengers`);
    }
  }
  if (!parts.length) return "";
  if (parts.length === 1) return `${parts[0]}, per vehicle.`;
  return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}, per vehicle.`;
}

function priceSentenceEs(route: Route): string {
  const parts: string[] = [];
  for (const tier of VEHICLE_TIERS) {
    const price = route[tier.priceField];
    if (typeof price === "number" && price > 0) {
      parts.push(`$${price} para ${tier.minPax} a ${tier.maxPax} pasajeros`);
    }
  }
  if (!parts.length) return "";
  if (parts.length === 1) return `${parts[0]}, por vehículo.`;
  return `${parts.slice(0, -1).join(", ")} y ${parts[parts.length - 1]}, por vehículo.`;
}

interface Context {
  origin?: Destination;
  destination?: Destination;
}

/**
 * The seven questions for one route. English output is unchanged from the
 * original implementation; Spanish is a separate branch so the two never
 * drift into literal translations of each other.
 */
export function buildRouteFaqs(
  route: Route,
  ctx: Context = {},
  locale: Locale = "en",
): RouteFaq[] {
  if (locale === "es") return buildRouteFaqsEs(route, ctx);

  const O = ctx.origin?.short_name ?? route.origen;
  const D = ctx.destination?.short_name ?? route.destino;
  const airportPickup = isAirportOrigin(route.origen);
  const airportDropoff = isAirportOrigin(route.destino);
  const minutes = durationMinutes(route.duracion);
  const faqs: RouteFaq[] = [];

  // 1. Duration
  faqs.push({
    q: `How long does the private shuttle from ${O} to ${D} take?`,
    a: minutes
      ? `${formatDuration(minutes).replace(/^about/, "About")} door to door. That is a realistic figure for Costa Rican roads, not the fastest time a map app shows. The service is direct, with no other passengers, so there are no detours to drop anyone else off.`
      : `The driving time depends on your exact pickup and drop-off points in ${O} and ${D}; we confirm it with your quote. The service is direct, with no other passengers and no detours.`,
  });

  // 2. Price
  const prices = priceSentence(route);
  faqs.push({
    q: `How much does a private shuttle from ${O} to ${D} cost?`,
    a: prices
      ? `${prices} The price is per vehicle, not per person, and includes the driver, fuel, tolls and 13% VAT. There is nothing to pay at pickup.`
      : `Prices are per vehicle, not per person, and include the driver, fuel, tolls and 13% VAT. Search the route on the booking page to see the exact figure for your group size.`,
  });

  // 3. Meeting point
  if (airportPickup) {
    faqs.push({
      q: `Where does the driver meet me at ${O}?`,
      a: `At the arrivals exit, holding a sign with the lead passenger's name. We track your flight, so if it lands early or late the pickup moves with it at no charge. From the exit to the vehicle is a short walk.`,
    });
  } else if (airportDropoff) {
    const lead = minutes ? minutes + 180 : null;
    faqs.push({
      q: `What time should I leave ${O} for a flight from ${D}?`,
      a: lead
        ? `We schedule the pickup so you reach ${D} about 3 hours before an international departure, which means leaving ${O} roughly ${formatDuration(lead).replace(/^about /, "")} before your flight. If you prefer a different margin, tell us when booking.`
        : `We schedule the pickup so you reach ${D} about 3 hours before an international departure. Give us the flight time when booking and we set the departure from ${O} accordingly.`,
    });
  } else {
    faqs.push({
      q: `Where does the driver pick me up in ${O}?`,
      a: `At the door of your hotel, villa or rental in ${O}, at the time you choose. Give us the property name or a map pin when you book and the driver comes to the entrance.`,
    });
  }

  // 4. Stops
  faqs.push({
    q: `Can we stop along the way from ${O} to ${D}?`,
    a: `Yes. Short stops for food, a supermarket, an ATM or photos are part of the service. Longer detours, such as a waterfall or a second town, are quoted in advance so there are no surprises.`,
  });

  // 5. Child seats
  faqs.push({
    q: `Do you have child seats for the trip to ${D}?`,
    a: `Yes, and they are free. Costa Rican law requires a car seat or booster for children under 12 or shorter than 1.45 m (4 ft 9 in), so tell us the ages when you book and the right seats are installed before pickup.`,
  });

  // 6. Delays / night travel
  if (airportPickup) {
    faqs.push({
      q: `What happens if my flight into ${O} is delayed?`,
      a: `Nothing changes for you. We follow the flight number you give us and adjust the pickup to the actual landing time. There is no waiting charge for delays, and the same driver meets you.`,
    });
  } else {
    faqs.push({
      q: `Can I travel from ${O} to ${D} at night or very early?`,
      a: `Yes. We run 24 hours a day, every day of the year, with no night surcharge. Early departures for morning flights and late arrivals are routine.`,
    });
  }

  // 7. Cancellation
  faqs.push({
    q: `What is the cancellation policy for this shuttle?`,
    a: `Cancel more than 48 hours before pickup for a full refund minus the 13% tax. Within 48 hours the trip is non-refundable. Changes to date, time or address are free up to 48 hours before, subject to availability.`,
  });

  return faqs;
}

/**
 * Spanish twin of the block above, written as the answers a Costa Rican
 * operator would give (tú form), not as a translation. Same seven topics in
 * the same order so both FAQPage graphs describe the same page.
 */
function buildRouteFaqsEs(route: Route, ctx: Context): RouteFaq[] {
  const O = ctx.origin?.short_name ?? route.origen;
  const D = ctx.destination?.short_name ?? route.destino;
  const airportPickup = isAirportOrigin(route.origen);
  const airportDropoff = isAirportOrigin(route.destino);
  const minutes = durationMinutes(route.duracion);
  const faqs: RouteFaq[] = [];

  // 1. Duración
  faqs.push({
    q: `¿Cuánto dura el shuttle privado de ${O} a ${D}?`,
    a: minutes
      ? `Alrededor de ${formatDurationEs(minutes)} de puerta a puerta. Es un tiempo realista para las carreteras de Costa Rica, no el más rápido que muestra una app de mapas. El servicio es directo y sin otros pasajeros, así que no hay desvíos para dejar a nadie más.`
      : `El tiempo de viaje depende de los puntos exactos de recogida y llegada en ${O} y ${D}; te lo confirmamos con tu cotización. El servicio es directo, sin otros pasajeros ni desvíos.`,
  });

  // 2. Precio
  const prices = priceSentenceEs(route);
  faqs.push({
    q: `¿Cuánto cuesta un shuttle privado de ${O} a ${D}?`,
    a: prices
      ? `${prices} El precio es por vehículo, no por persona, e incluye el chofer, el combustible, los peajes y el 13% de IVA. No tienes que pagar nada al momento de la recogida.`
      : `Los precios son por vehículo, no por persona, e incluyen el chofer, el combustible, los peajes y el 13% de IVA. Busca la ruta en la página de reservas para ver el monto exacto según el tamaño de tu grupo.`,
  });

  // 3. Punto de encuentro
  if (airportPickup) {
    faqs.push({
      q: `¿Dónde me espera el chofer en ${O}?`,
      a: `En la salida de llegadas, con un rótulo con el nombre del pasajero principal. Hacemos seguimiento de tu vuelo, así que si aterriza antes o después, la recogida se ajusta sin costo adicional. De la salida al vehículo es una caminata corta.`,
    });
  } else if (airportDropoff) {
    const lead = minutes ? minutes + 180 : null;
    faqs.push({
      q: `¿A qué hora debo salir de ${O} para un vuelo desde ${D}?`,
      a: lead
        ? `Programamos la recogida para que llegues a ${D} unas 3 horas antes de un vuelo internacional, es decir, saliendo de ${O} aproximadamente ${formatDurationEs(lead)} antes de tu vuelo. Si prefieres otro margen, dinos al reservar.`
        : `Programamos la recogida para que llegues a ${D} unas 3 horas antes de un vuelo internacional. Indícanos la hora del vuelo al reservar y fijamos la salida desde ${O} de acuerdo con eso.`,
    });
  } else {
    faqs.push({
      q: `¿Dónde me recoge el chofer en ${O}?`,
      a: `En la puerta de tu hotel, villa o alquiler en ${O}, a la hora que elijas. Danos el nombre de la propiedad o un pin en el mapa al reservar y el chofer llega hasta la entrada.`,
    });
  }

  // 4. Paradas
  faqs.push({
    q: `¿Podemos hacer paradas en el camino de ${O} a ${D}?`,
    a: `Sí. Las paradas cortas para comer, pasar por un supermercado o un cajero automático, o tomar fotos, son parte del servicio. Los desvíos más largos, como una catarata o un segundo pueblo, se cotizan por adelantado para que no haya sorpresas.`,
  });

  // 5. Sillas para niños
  faqs.push({
    q: `¿Tienen sillas para niños para el viaje a ${D}?`,
    a: `Sí, y son gratis. La ley de Costa Rica exige silla de carro o booster para menores de 12 años o que midan menos de 1,45 m, así que dinos las edades al reservar y las sillas correctas van instaladas antes de recogerte.`,
  });

  // 6. Atrasos / viajes de noche
  if (airportPickup) {
    faqs.push({
      q: `¿Qué pasa si mi vuelo a ${O} viene atrasado?`,
      a: `Nada cambia para ti. Seguimos el número de vuelo que nos das y ajustamos la recogida a la hora real de aterrizaje. No cobramos tiempo de espera por atrasos, y te recibe el mismo chofer.`,
    });
  } else {
    faqs.push({
      q: `¿Puedo viajar de ${O} a ${D} de noche o muy temprano?`,
      a: `Sí. Trabajamos las 24 horas, todos los días del año, sin recargo nocturno. Las salidas de madrugada para vuelos matutinos y las llegadas tarde son parte de la rutina.`,
    });
  }

  // 7. Cancelación
  faqs.push({
    q: `¿Cuál es la política de cancelación de este shuttle?`,
    a: `Si cancelas con más de 48 horas de anticipación, te reembolsamos el total menos el 13% de impuesto. Dentro de las 48 horas el viaje no es reembolsable. Los cambios de fecha, hora o dirección son gratis hasta 48 horas antes, sujetos a disponibilidad.`,
  });

  return faqs;
}
