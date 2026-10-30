import { defineCopy } from "@/lib/i18n";

/**
 * Copy for the Liberia Airport (LIR) hub page (/liberia-airport-shuttle):
 * the page that should rank for "Liberia airport shuttle", "LIR transfer",
 * "Liberia airport to Tamarindo" and the rest of the airport queries. Every
 * figure on the page comes from the live `routes` table; this file only
 * holds the prose. Server-side only: the page reads it with
 * `LIBERIA_AIRPORT[locale]` after `localeFromParams`.
 *
 * Voice: a Liberia transport operator who has done this pickup thousands of
 * times. Plain statements, concrete details, no sales adjectives.
 */
export const LIBERIA_AIRPORT = defineCopy({
  en: {
    metaTitle: "Liberia Airport (LIR) Shuttle — Private Transfers to Guanacaste Beaches",
    metaDescription:
      "Private shuttle from Liberia Airport (LIR) to Tamarindo, Flamingo, Papagayo, Playas del Coco, Nosara, La Fortuna and Monteverde. One price per vehicle with taxes included. We track your flight and meet you at arrivals with a name sign. Ruta Pacifico, Liberia.",
    keywords: [
      "Liberia airport shuttle",
      "LIR airport shuttle",
      "LIR airport transfer",
      "Liberia Costa Rica airport transfer",
      "Daniel Oduber airport shuttle",
      "Liberia airport to Tamarindo",
      "Liberia airport to Flamingo",
      "Liberia airport to Papagayo",
      "Liberia airport to Playas del Coco",
      "Liberia airport to Nosara",
      "Liberia airport to La Fortuna",
      "private shuttle Guanacaste",
    ],
    ogTitle: "Liberia Airport (LIR) Private Shuttle | Ruta Pacifico",
    ogDescription:
      "Private transfers from LIR to the Guanacaste beaches, La Fortuna and Monteverde. One price per vehicle, taxes included. Flight tracked, name sign at arrivals.",
    heroAlt: "Daniel Oduber Quirós International Airport (LIR), Liberia, Guanacaste, Costa Rica",
    hero: {
      eyebrow: "Liberia, Guanacaste · ICT license 4121-2025 · Insured",
      titleLead: "Private shuttle from",
      titleAccent: "Liberia Airport (LIR)",
      intro: (count: number, low: number) =>
        `We are based in Liberia, fifteen minutes from the terminal. We run ${count} routes from and to LIR, starting at $${low} per vehicle with taxes included. Your driver tracks the flight and waits at the arrivals exit with your name on a sign.`,
      introFallback:
        "We are based in Liberia, fifteen minutes from the terminal. One price per vehicle with taxes included. Your driver tracks the flight and waits at the arrivals exit with your name on a sign.",
      book: "Book a shuttle",
      whatsapp: "WhatsApp us",
      badges: {
        tracking: "Flight tracked",
        sign: "Name sign at arrivals",
        fixed: "One price, taxes included",
      },
    },
    why: {
      heading: "What you get when the shuttle company lives next to the airport",
      items: [
        {
          title: "Nobody drives three hours to pick you up",
          body: "Most shuttles that serve LIR come up from San José or over from the beaches. Ours are parked in Liberia. A 6 am landing or a midnight delay is a short drive for us, so you are not the passenger waiting at the curb while a van is still on the highway.",
        },
        {
          title: "We go by the flight, not by the booking time",
          body: "Give us the flight number. If you land early, the driver is already there. If you land two hours late, the driver comes two hours later. Delays cost you nothing.",
        },
        {
          title: "We know where your hotel actually is",
          body: "Resorts on the Papagayo peninsula, villas above Flamingo, a surf house at the end of a gravel road in Nosara. Our drivers have been to all of them. You give us the name; we handle the rest.",
        },
        {
          title: "The price you see is the price you pay",
          body: "Per vehicle, with the 13% VAT, fuel, tolls and the driver included. The same in December and in June, at noon and at 4 am. Nothing is collected at pickup.",
        },
      ],
    },
    quick: {
      heading: "Liberia airport shuttle prices at a glance",
      body: "The routes we get asked about most, with the current price and drive time. Prices are per vehicle for up to five passengers, in US dollars, taxes included.",
      answer: (destination: string, price: number, time: string) =>
        `Liberia Airport (LIR) to ${destination}: $${price} per vehicle for 1–5 passengers, ${time}.`,
      book: "Book this route",
    },
    arrival: {
      heading: "What happens when you land",
      steps: [
        {
          title: "Immigration and customs",
          body: "LIR is a small airport. Most days you are through immigration, past the baggage belt and out the door in 20 to 30 minutes. We see the flight land and your driver moves into position.",
        },
        {
          title: "Your driver at the exit",
          body: "Walk out of the terminal and past the taxi line. Your driver is standing there with a Ruta Pacifico sign and your name on it. They take the bags and walk you to the van.",
        },
        {
          title: "To your door",
          body: "Playas del Coco is 25 minutes away, Tamarindo about 50, Nosara about two hours. If you want to stop for groceries, cash or a bathroom on the way, tell the driver.",
        },
      ],
      guideHeading: "Arriving at Liberia Airport",
      tipsHeading: "From our drivers",
    },
    destinations: {
      heading: "Where we drive from LIR",
      body: "The beaches and towns we take people to most often, with the drive time and the current price for up to five passengers. Open any of them for the details and to book.",
      from: "from",
      perVehicle: "per vehicle",
      quote: "Ask us",
    },
    table: {
      heading: "All routes from and to Liberia Airport",
      body: "Every route we publish from LIR, cheapest first, with the price for each van size. The trip back to the airport costs the same unless a return fare is listed under the route.",
      count: (n: number) => `${n} route${n === 1 ? "" : "s"}`,
      unavailable:
        "The price list is not loading at the moment. Search your route on the booking page or send us a WhatsApp and we will reply with the price.",
    },
    airports: {
      heading: "Liberia or San José: which airport to fly into",
      body: "For a beach trip in Guanacaste, fly into Liberia. The airport is small and most beaches are less than an hour away. San José is the better choice when your first nights are in the Central Valley, La Fortuna or on the Central Pacific. Below are our drive times and prices from each airport, for up to five passengers.",
      destination: "Destination",
      fromLir: "From Liberia (LIR)",
      fromSjo: "From San José (SJO)",
      noRoute: "—",
      verdict:
        "For Tamarindo, Flamingo, Papagayo, Playas del Coco, Nosara and Sámara, Liberia saves you three to four hours on the road. For La Fortuna and Monteverde the drive is similar from either airport, so book whichever flight suits you.",
    },
    vehicles: {
      heading: "The vehicle for your group",
      body: "Count everyone travelling, children included. That number decides the vehicle and the price. The van is yours alone for the trip.",
      pax: (min: number, max: number) => `${min}–${max} passengers`,
    },
    faqHeading: "Questions we get about the airport",
    faqs: [
      {
        q: "Where do I find my driver at Liberia Airport?",
        a: "Just outside the arrivals doors, past the taxi line. The driver holds a Ruta Pacifico sign with your name on it. If you do not see it, message us on WhatsApp at +506 7080-5578 and we will point you to each other within a minute.",
      },
      {
        q: "What if my flight is delayed or lands early?",
        a: "We follow the flight by its number and adjust the pickup to the real landing time. Delays do not cost extra, and we never send a driver away because a flight is late.",
      },
      {
        q: "How much is the shuttle from Liberia Airport to Tamarindo?",
        a: "The current price is in the table on this page and on the route page. It is per vehicle for up to five passengers, taxes included, and the drive takes about 50 minutes. Groups of six or more pay the 6–9 or 10–12 passenger price for the whole vehicle.",
      },
      {
        q: "Is the price per person or per vehicle?",
        a: "Per vehicle. The price covers everyone in your group within its size (1–5, 6–9 or 10–12 passengers) and includes the 13% VAT, fuel, tolls, the driver, WiFi, bottled water and child seats. For 13 or more people, write to us on WhatsApp and we will quote it.",
      },
      {
        q: "Do you have car seats for children?",
        a: "Yes, included. Tell us the children's ages when you book and the seats are installed before the driver leaves for the airport.",
      },
      {
        q: "Can we stop at a supermarket or an ATM on the way?",
        a: "Yes. A stop for groceries, cash or a bathroom is part of the trip, and there is a supermarket a few minutes from the airport on the road to every beach. If you want a longer stop, such as lunch, mention it when you book.",
      },
      {
        q: "When should I leave for my flight home from LIR?",
        a: "We set the pickup so you reach the terminal about three hours before an international flight. From Tamarindo that means leaving roughly four hours before departure. You can change the time with us on WhatsApp up to the day before.",
      },
      {
        q: "Do you also go from Liberia Airport to La Fortuna, Monteverde or San José?",
        a: "Yes. La Fortuna and Monteverde are about three hours from LIR, San José about three and a half to four. The same per-vehicle prices apply and all three are in the table on this page.",
      },
    ],
    cta: {
      heading: "Book your Liberia airport shuttle",
      body: "Pick your route, check the price and book in a couple of minutes. Nothing is paid at pickup, and you can cancel free of charge up to 24 hours before.",
      book: "Book now",
      whatsapp: "Ask on WhatsApp",
    },
    jsonLd: {
      pageName: "Private shuttle from Liberia Airport (LIR), Costa Rica",
      pageDescription:
        "Private, door-to-door airport transfers from Daniel Oduber Quirós International Airport (LIR), Liberia, to the Guanacaste beaches and destinations across Costa Rica. One price per vehicle, taxes included, flight tracking.",
      serviceName: "Liberia Airport (LIR) private shuttle service",
      listName: "Private shuttle routes from Liberia Airport (LIR)",
      routeName: (origin: string, destination: string) => `${origin} to ${destination}`,
      itemName: (origin: string, destination: string) => `Private Shuttle: ${origin} to ${destination}`,
      home: "Home",
      hub: "Liberia Airport shuttle",
    },
  },
  es: {
    metaTitle: "Shuttle Aeropuerto de Liberia (LIR) — Traslados privados a las playas de Guanacaste",
    metaDescription:
      "Shuttle privado desde el Aeropuerto de Liberia (LIR) a Tamarindo, Flamingo, Papagayo, Playas del Coco, Nosara, La Fortuna y Monteverde. Un solo precio por vehículo con impuestos incluidos. Seguimos tu vuelo y te esperamos en llegadas con un rótulo con tu nombre. Ruta Pacifico, Liberia.",
    keywords: [
      "shuttle aeropuerto Liberia",
      "shuttle LIR",
      "traslado aeropuerto Liberia",
      "transporte aeropuerto Liberia Costa Rica",
      "shuttle aeropuerto Daniel Oduber",
      "aeropuerto Liberia a Tamarindo",
      "aeropuerto Liberia a Flamingo",
      "aeropuerto Liberia a Papagayo",
      "aeropuerto Liberia a Playas del Coco",
      "aeropuerto Liberia a Nosara",
      "aeropuerto Liberia a La Fortuna",
      "shuttle privado Guanacaste",
    ],
    ogTitle: "Shuttle privado Aeropuerto de Liberia (LIR) | Ruta Pacifico",
    ogDescription:
      "Traslados privados desde LIR a las playas de Guanacaste, La Fortuna y Monteverde. Un solo precio por vehículo, impuestos incluidos. Seguimiento de vuelo y rótulo con tu nombre en llegadas.",
    heroAlt: "Aeropuerto Internacional Daniel Oduber Quirós (LIR), Liberia, Guanacaste, Costa Rica",
    hero: {
      eyebrow: "Liberia, Guanacaste · Licencia ICT 4121-2025 · Asegurados",
      titleLead: "Shuttle privado desde el",
      titleAccent: "Aeropuerto de Liberia (LIR)",
      intro: (count: number, low: number) =>
        `Estamos en Liberia, a quince minutos de la terminal. Manejamos ${count} rutas desde y hacia LIR, desde $${low} por vehículo con impuestos incluidos. Tu chofer sigue el vuelo y te espera a la salida de llegadas con tu nombre en un rótulo.`,
      introFallback:
        "Estamos en Liberia, a quince minutos de la terminal. Un solo precio por vehículo con impuestos incluidos. Tu chofer sigue el vuelo y te espera a la salida de llegadas con tu nombre en un rótulo.",
      book: "Reservar un shuttle",
      whatsapp: "Escríbenos por WhatsApp",
      badges: {
        tracking: "Seguimiento de vuelo",
        sign: "Rótulo con tu nombre en llegadas",
        fixed: "Un solo precio, impuestos incluidos",
      },
    },
    why: {
      heading: "Lo que cambia cuando la empresa de shuttle vive al lado del aeropuerto",
      items: [
        {
          title: "Nadie maneja tres horas para recogerte",
          body: "La mayoría de los shuttles que atienden LIR vienen desde San José o desde las playas. Los nuestros están estacionados en Liberia. Un aterrizaje a las 6 am o un atraso a medianoche es un viaje corto para nosotros, así que no eres el pasajero esperando en la acera mientras una van todavía viene por la carretera.",
        },
        {
          title: "Nos guiamos por el vuelo, no por la hora de la reserva",
          body: "Danos el número de vuelo. Si aterrizas antes, el chofer ya está ahí. Si aterrizas dos horas tarde, el chofer llega dos horas después. Los atrasos no te cuestan nada.",
        },
        {
          title: "Sabemos dónde queda tu hotel de verdad",
          body: "Resorts en la península de Papagayo, villas arriba de Flamingo, una casa de surf al final de un camino de lastre en Nosara. Nuestros choferes han ido a todos. Nos das el nombre y nosotros nos encargamos.",
        },
        {
          title: "El precio que ves es el que pagas",
          body: "Por vehículo, con el 13% de IVA, combustible, peajes y chofer incluidos. El mismo en diciembre y en junio, al mediodía y a las 4 am. No se cobra nada en la recogida.",
        },
      ],
    },
    quick: {
      heading: "Precios del shuttle del aeropuerto de Liberia, de un vistazo",
      body: "Las rutas por las que más nos preguntan, con el precio actual y el tiempo de viaje. Los precios son por vehículo para hasta cinco pasajeros, en dólares, impuestos incluidos.",
      answer: (destination: string, price: number, time: string) =>
        `Aeropuerto de Liberia (LIR) a ${destination}: $${price} por vehículo para 1–5 pasajeros, ${time}.`,
      book: "Reservar esta ruta",
    },
    arrival: {
      heading: "Qué pasa cuando aterrizas",
      steps: [
        {
          title: "Migración y aduana",
          body: "LIR es un aeropuerto pequeño. La mayoría de los días pasas migración, recoges las maletas y sales por la puerta en 20 a 30 minutos. Nosotros vemos aterrizar el vuelo y tu chofer se acomoda en su lugar.",
        },
        {
          title: "Tu chofer en la salida",
          body: "Sal de la terminal y pasa la fila de taxis. Tu chofer está ahí parado con un rótulo de Ruta Pacifico y tu nombre. Toma las maletas y te acompaña a la van.",
        },
        {
          title: "Hasta tu puerta",
          body: "Playas del Coco queda a 25 minutos, Tamarindo a unos 50, Nosara a unas dos horas. Si quieres parar por compras, efectivo o un baño en el camino, díselo al chofer.",
        },
      ],
      guideHeading: "Llegar al Aeropuerto de Liberia",
      tipsHeading: "De parte de nuestros choferes",
    },
    destinations: {
      heading: "Adónde manejamos desde LIR",
      body: "Las playas y pueblos a los que más llevamos gente, con el tiempo de viaje y el precio actual para hasta cinco pasajeros. Abre cualquiera para ver los detalles y reservar.",
      from: "desde",
      perVehicle: "por vehículo",
      quote: "Consúltanos",
    },
    table: {
      heading: "Todas las rutas desde y hacia el Aeropuerto de Liberia",
      body: "Todas las rutas que publicamos desde LIR, de la más barata a la más cara, con el precio de cada tamaño de van. El viaje de regreso al aeropuerto cuesta lo mismo salvo que aparezca una tarifa de regreso bajo la ruta.",
      count: (n: number) => `${n} ruta${n === 1 ? "" : "s"}`,
      unavailable:
        "La lista de precios no está cargando en este momento. Busca tu ruta en la página de reservas o mándanos un WhatsApp y te respondemos con el precio.",
    },
    airports: {
      heading: "Liberia o San José: a qué aeropuerto llegar",
      body: "Para un viaje de playa en Guanacaste, llega a Liberia. El aeropuerto es pequeño y la mayoría de las playas quedan a menos de una hora. San José es mejor opción cuando tus primeras noches son en el Valle Central, La Fortuna o el Pacífico Central. Abajo están nuestros tiempos y precios desde cada aeropuerto, para hasta cinco pasajeros.",
      destination: "Destino",
      fromLir: "Desde Liberia (LIR)",
      fromSjo: "Desde San José (SJO)",
      noRoute: "—",
      verdict:
        "Para Tamarindo, Flamingo, Papagayo, Playas del Coco, Nosara y Sámara, Liberia te ahorra entre tres y cuatro horas de carretera. Para La Fortuna y Monteverde el viaje es parecido desde cualquiera de los dos, así que reserva el vuelo que mejor te sirva.",
    },
    vehicles: {
      heading: "El vehículo para tu grupo",
      body: "Cuenta a todos los que viajan, niños incluidos. Ese número decide el vehículo y el precio. La van es solo para ustedes durante el viaje.",
      pax: (min: number, max: number) => `${min}–${max} pasajeros`,
    },
    faqHeading: "Lo que nos preguntan sobre el aeropuerto",
    faqs: [
      {
        q: "¿Dónde encuentro a mi chofer en el Aeropuerto de Liberia?",
        a: "Justo afuera de las puertas de llegadas, pasando la fila de taxis. El chofer sostiene un rótulo de Ruta Pacifico con tu nombre. Si no lo ves, escríbenos por WhatsApp al +506 7080-5578 y en un minuto los ponemos en contacto.",
      },
      {
        q: "¿Qué pasa si mi vuelo se atrasa o aterriza antes?",
        a: "Seguimos el vuelo por su número y ajustamos la recogida a la hora real de aterrizaje. Los atrasos no cuestan extra, y nunca retiramos a un chofer porque un vuelo venga tarde.",
      },
      {
        q: "¿Cuánto cuesta el shuttle del Aeropuerto de Liberia a Tamarindo?",
        a: "El precio actual está en la tabla de esta página y en la página de la ruta. Es por vehículo para hasta cinco pasajeros, impuestos incluidos, y el viaje toma unos 50 minutos. Los grupos de seis o más pagan el precio de 6–9 o 10–12 pasajeros por todo el vehículo.",
      },
      {
        q: "¿El precio es por persona o por vehículo?",
        a: "Por vehículo. El precio cubre a todos los de tu grupo dentro de su tamaño (1–5, 6–9 o 10–12 pasajeros) e incluye el 13% de IVA, combustible, peajes, chofer, WiFi, agua embotellada y sillas para niños. Para 13 personas o más, escríbenos por WhatsApp y te lo cotizamos.",
      },
      {
        q: "¿Tienen sillas para niños?",
        a: "Sí, incluidas. Dinos las edades de los niños al reservar y las sillas van instaladas antes de que el chofer salga para el aeropuerto.",
      },
      {
        q: "¿Podemos parar en un supermercado o un cajero en el camino?",
        a: "Sí. Una parada por compras, efectivo o baño es parte del viaje, y hay un supermercado a pocos minutos del aeropuerto en la ruta a todas las playas. Si quieres una parada más larga, como un almuerzo, dínoslo al reservar.",
      },
      {
        q: "¿A qué hora debo salir para mi vuelo de regreso desde LIR?",
        a: "Programamos la recogida para que llegues a la terminal unas tres horas antes de un vuelo internacional. Desde Tamarindo eso significa salir más o menos cuatro horas antes de la salida del vuelo. Puedes cambiar la hora con nosotros por WhatsApp hasta el día anterior.",
      },
      {
        q: "¿También van del Aeropuerto de Liberia a La Fortuna, Monteverde o San José?",
        a: "Sí. La Fortuna y Monteverde quedan a unas tres horas de LIR, San José a unas tres horas y media a cuatro. Aplican los mismos precios por vehículo y los tres están en la tabla de esta página.",
      },
    ],
    cta: {
      heading: "Reserva tu shuttle del aeropuerto de Liberia",
      body: "Elige tu ruta, revisa el precio y reserva en un par de minutos. No se paga nada en la recogida y puedes cancelar sin costo hasta 24 horas antes.",
      book: "Reservar ahora",
      whatsapp: "Preguntar por WhatsApp",
    },
    jsonLd: {
      pageName: "Shuttle privado desde el Aeropuerto de Liberia (LIR), Costa Rica",
      pageDescription:
        "Traslados privados puerta a puerta desde el Aeropuerto Internacional Daniel Oduber Quirós (LIR), Liberia, a las playas de Guanacaste y destinos en toda Costa Rica. Un solo precio por vehículo, impuestos incluidos, seguimiento de vuelo.",
      serviceName: "Servicio de shuttle privado del Aeropuerto de Liberia (LIR)",
      listName: "Rutas de shuttle privado desde el Aeropuerto de Liberia (LIR)",
      routeName: (origin: string, destination: string) => `${origin} a ${destination}`,
      itemName: (origin: string, destination: string) => `Shuttle privado: ${origin} a ${destination}`,
      home: "Inicio",
      hub: "Shuttle Aeropuerto de Liberia",
    },
  },
});
