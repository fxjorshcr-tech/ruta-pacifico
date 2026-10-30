import { defineCopy } from "@/lib/i18n";

/**
 * Copy for the Liberia Airport (LIR) hub page (/liberia-airport-shuttle):
 * the page that should rank for "Liberia airport shuttle", "LIR transfer",
 * "Liberia airport to Tamarindo" and the rest of the airport queries. Every
 * figure on the page comes from the live `routes` table; this file only
 * holds the prose. Server-side only: the page reads it with
 * `LIBERIA_AIRPORT[locale]` after `localeFromParams`.
 */
export const LIBERIA_AIRPORT = defineCopy({
  en: {
    metaTitle: "Liberia Airport (LIR) Shuttle — Private Transfers to Every Beach in Guanacaste",
    metaDescription:
      "Private shuttle from Liberia Airport (LIR) to Tamarindo, Flamingo, Papagayo, Playas del Coco, Nosara, La Fortuna and Monteverde. Fixed price per vehicle, taxes included, flight tracking and a name sign at arrivals. Ruta Pacifico, based in Liberia.",
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
      "Private transfers from LIR to every beach in Guanacaste and on to La Fortuna and Monteverde. Fixed price per vehicle, flight tracking, name sign at arrivals.",
    heroAlt: "Daniel Oduber Quirós International Airport (LIR), Liberia, Guanacaste, Costa Rica",
    hero: {
      eyebrow: "Based in Liberia · ICT licensed · Insured",
      titleLead: "Private shuttle from",
      titleAccent: "Liberia Airport (LIR)",
      intro: (count: number, low: number) =>
        `Ruta Pacifico is a Liberia company: our vans and drivers start the day 15 minutes from the airport. We drive ${count} routes from and to LIR, from $${low} per vehicle with taxes included, and the driver is at the arrivals exit with your name when you walk out.`,
      introFallback:
        "Ruta Pacifico is a Liberia company: our vans and drivers start the day 15 minutes from the airport. Fixed price per vehicle with taxes included, and the driver is at the arrivals exit with your name when you walk out.",
      book: "Book a shuttle",
      prices: "See all prices",
      whatsapp: "WhatsApp us",
      badges: {
        tracking: "Flight tracking",
        sign: "Name sign at arrivals",
        fixed: "Fixed price, taxes included",
      },
    },
    why: {
      heading: "Why book your LIR shuttle with a company that lives in Liberia",
      items: [
        {
          title: "The van is already at the airport",
          body: "Most shuttle companies send a van up from San José or across from the beaches to meet your flight. Ours starts in Liberia, 15 minutes from the terminal, so a 6 am landing or a midnight delay never leaves you waiting at the curb.",
        },
        {
          title: "We watch your flight, not the clock",
          body: "You give us the flight number and we follow it. Lands early, the driver is already there; lands two hours late, the driver moves with it. No extra charge for delays, ever.",
        },
        {
          title: "Door to door, anywhere in Guanacaste",
          body: "Hotel, resort, villa, Airbnb or a surf camp down a dirt road in Nosara: give us the name and we find it. One vehicle for your group only, with WiFi, cold water and child seats included.",
        },
        {
          title: "One fixed price, every day of the year",
          body: "The price on this page is per vehicle, includes the 13% VAT, fuel, tolls and the driver, and is the same in December as in June. Nothing is charged at pickup and nothing gets added on the way.",
        },
      ],
    },
    quick: {
      heading: "Quick answers: Liberia airport shuttle prices",
      body: "The routes travellers ask about most, each answered in one line straight from our live price list. Prices per vehicle, in US dollars, taxes included.",
      answer: (destination: string, price: number, time: string) =>
        `From Liberia Airport (LIR) to ${destination}: $${price} per vehicle for 1–5 passengers, ${time}.`,
      book: "Book this route",
    },
    arrival: {
      heading: "What happens when you land at LIR",
      steps: [
        {
          title: "You clear immigration and customs",
          body: "LIR is small and quick: on most days you are out in 20 to 30 minutes. We already know your flight landed, so the driver is in position.",
        },
        {
          title: "Your driver is at the arrivals exit",
          body: "Walk out of the terminal, past the taxi rank, and look for a Ruta Pacifico sign with your name. The driver helps with the luggage and walks you to the van.",
        },
        {
          title: "Straight to your hotel door",
          body: "Playas del Coco in 25 minutes, Tamarindo in about 50, Nosara in about 2 hours. Ask for a stop at a supermarket or an ATM on the way if you need one.",
        },
      ],
      guideHeading: "Arriving at Liberia Airport: what to expect",
      tipsHeading: "Tips from our drivers",
    },
    destinations: {
      heading: "Where LIR takes you",
      body: "The beaches and towns we drive to most from Liberia Airport, with the real drive time and the live price for 1–5 passengers. Tap one to see every detail and book.",
      from: "from",
      perVehicle: "per vehicle",
      quote: "Ask for a price",
    },
    table: {
      heading: "Every shuttle from and to Liberia Airport",
      body: "All the routes we publish from LIR, cheapest first, with the price for each van size. The same price applies back to the airport unless a return fare is shown under the route.",
      count: (n: number) => `${n} route${n === 1 ? "" : "s"}`,
      unavailable:
        "Our live prices are not loading right now. Search any route on the booking page or write to us on WhatsApp and we will send you the price.",
    },
    airports: {
      heading: "Liberia (LIR) or San José (SJO): which airport should you fly into?",
      body: "If your trip is Guanacaste beaches, fly into Liberia: the terminal is small, and most beaches are under an hour away. San José makes sense when your first nights are in the Central Valley, La Fortuna or the Central Pacific. These are the drive times and prices we actually charge from each airport, for 1–5 passengers.",
      destination: "Destination",
      fromLir: "From Liberia (LIR)",
      fromSjo: "From San José (SJO)",
      noRoute: "—",
      verdict:
        "The short version: for Tamarindo, Flamingo, Papagayo, Playas del Coco, Nosara and Sámara, Liberia is between 3 and 4 hours closer. For La Fortuna and Monteverde both airports are about the same drive, so pick the one with the better flight.",
    },
    vehicles: {
      heading: "The van your group rides in",
      body: "Count everyone in your group, adults and children. That number puts you in one of these three vehicles, and that is the price you pay. Reserved for your group only.",
      pax: (min: number, max: number) => `${min}–${max} passengers`,
    },
    faqHeading: "Liberia airport shuttle questions",
    faqs: [
      {
        q: "Where do I meet my driver at Liberia Airport?",
        a: "Just outside the arrivals doors, past the taxi rank. The driver holds a Ruta Pacifico sign with your name. If you cannot see it, write to us on WhatsApp at +506 7080-5578 and we will connect you in a minute.",
      },
      {
        q: "What if my flight is delayed or lands early?",
        a: "We track every incoming flight by its number and move the pickup with it. There is no extra charge for delays, and the driver is never sent away because a flight is late.",
      },
      {
        q: "How much is a shuttle from Liberia Airport to Tamarindo?",
        a: "The live price is in the table on this page and on the route page, per vehicle for up to 5 passengers, taxes included. The drive takes about 50 minutes. Larger groups pay the 6–9 or 10–12 passenger price for the whole vehicle.",
      },
      {
        q: "Is the price per person or per vehicle?",
        a: "Per vehicle. One price covers everyone in your group within its size tier (1–5, 6–9 or 10–12 passengers) and already includes the 13% VAT, fuel, tolls, the driver, WiFi, bottled water and child seats. Groups of 13 or more get a quote on WhatsApp.",
      },
      {
        q: "Do you provide car seats for children?",
        a: "Yes, at no charge. Tell us the ages of the children when you book and the right seats are installed before the driver leaves for the airport.",
      },
      {
        q: "Can we stop at a supermarket or an ATM on the way from the airport?",
        a: "Of course. A short stop for groceries, cash or a bathroom is part of every transfer; there is a supermarket a few minutes from LIR on the way to every beach. Longer stops, such as lunch, are welcome if you tell us when you book.",
      },
      {
        q: "How early should I leave for my flight home from LIR?",
        a: "We schedule the pickup so you are at the terminal about 3 hours before an international departure: for example, leaving Tamarindo about 4 hours before the flight. You can change the time with us on WhatsApp up to the day before.",
      },
      {
        q: "Do you also drive from Liberia Airport to La Fortuna, Monteverde or San José?",
        a: "Yes. La Fortuna and Monteverde are about 3 hours from LIR, San José about 3.5 to 4, and the same fixed, per-vehicle prices apply. You will find all of them in the table on this page.",
      },
    ],
    cta: {
      heading: "Ready to book your Liberia airport shuttle?",
      body: "Search your route, see the fixed price and book in a couple of minutes. No payment at pickup, free cancellation up to 24 hours before.",
      book: "Book now",
      whatsapp: "Ask on WhatsApp",
    },
    jsonLd: {
      pageName: "Private shuttle from Liberia Airport (LIR), Costa Rica",
      pageDescription:
        "Private, door-to-door airport transfers from Daniel Oduber Quirós International Airport (LIR), Liberia, to every beach in Guanacaste and destinations across Costa Rica. Fixed price per vehicle, taxes included, flight tracking.",
      serviceName: "Liberia Airport (LIR) private shuttle service",
      listName: "Private shuttle routes from Liberia Airport (LIR)",
      routeName: (origin: string, destination: string) => `${origin} to ${destination}`,
      itemName: (origin: string, destination: string) => `Private Shuttle: ${origin} to ${destination}`,
      home: "Home",
      hub: "Liberia Airport shuttle",
    },
  },
  es: {
    metaTitle: "Shuttle Aeropuerto de Liberia (LIR) — Traslados privados a todas las playas de Guanacaste",
    metaDescription:
      "Shuttle privado desde el Aeropuerto de Liberia (LIR) a Tamarindo, Flamingo, Papagayo, Playas del Coco, Nosara, La Fortuna y Monteverde. Precio fijo por vehículo, impuestos incluidos, seguimiento de vuelo y rótulo con tu nombre en llegadas. Ruta Pacifico, con base en Liberia.",
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
      "Traslados privados desde LIR a todas las playas de Guanacaste y hasta La Fortuna y Monteverde. Precio fijo por vehículo, seguimiento de vuelo, rótulo con tu nombre en llegadas.",
    heroAlt: "Aeropuerto Internacional Daniel Oduber Quirós (LIR), Liberia, Guanacaste, Costa Rica",
    hero: {
      eyebrow: "Con base en Liberia · Licencia ICT · Asegurados",
      titleLead: "Shuttle privado desde el",
      titleAccent: "Aeropuerto de Liberia (LIR)",
      intro: (count: number, low: number) =>
        `Ruta Pacifico es una empresa de Liberia: nuestras vans y choferes empiezan el día a 15 minutos del aeropuerto. Manejamos ${count} rutas desde y hacia LIR, desde $${low} por vehículo con impuestos incluidos, y el chofer te espera a la salida de llegadas con tu nombre cuando sales.`,
      introFallback:
        "Ruta Pacifico es una empresa de Liberia: nuestras vans y choferes empiezan el día a 15 minutos del aeropuerto. Precio fijo por vehículo con impuestos incluidos, y el chofer te espera a la salida de llegadas con tu nombre cuando sales.",
      book: "Reservar un shuttle",
      prices: "Ver todos los precios",
      whatsapp: "Escríbenos por WhatsApp",
      badges: {
        tracking: "Seguimiento de vuelo",
        sign: "Rótulo con tu nombre en llegadas",
        fixed: "Precio fijo, impuestos incluidos",
      },
    },
    why: {
      heading: "Por qué reservar tu shuttle de LIR con una empresa que vive en Liberia",
      items: [
        {
          title: "La van ya está en el aeropuerto",
          body: "La mayoría de las empresas de shuttle mandan una van desde San José o desde las playas para recibir tu vuelo. La nuestra sale de Liberia, a 15 minutos de la terminal, así que un aterrizaje a las 6 am o un atraso a medianoche nunca te deja esperando en la acera.",
        },
        {
          title: "Seguimos tu vuelo, no el reloj",
          body: "Nos das el número de vuelo y lo monitoreamos. Si aterriza antes, el chofer ya está ahí; si llega dos horas tarde, el chofer se mueve con él. Nunca cobramos extra por atrasos.",
        },
        {
          title: "Puerta a puerta, en cualquier punto de Guanacaste",
          body: "Hotel, resort, villa, Airbnb o un surf camp al final de un camino de lastre en Nosara: dinos el nombre y lo encontramos. Un vehículo solo para tu grupo, con WiFi, agua fría y sillas para niños incluidas.",
        },
        {
          title: "Un solo precio fijo, todos los días del año",
          body: "El precio de esta página es por vehículo, incluye el 13% de IVA, combustible, peajes y chofer, y es el mismo en diciembre que en junio. No se cobra nada en la recogida ni se agrega nada en el camino.",
        },
      ],
    },
    quick: {
      heading: "Respuestas rápidas: precios de shuttle desde el aeropuerto de Liberia",
      body: "Las rutas por las que más nos preguntan, cada una respondida en una línea directo de nuestra lista de precios en vivo. Precios por vehículo, en dólares, impuestos incluidos.",
      answer: (destination: string, price: number, time: string) =>
        `Del Aeropuerto de Liberia (LIR) a ${destination}: $${price} por vehículo para 1–5 pasajeros, ${time}.`,
      book: "Reservar esta ruta",
    },
    arrival: {
      heading: "Qué pasa cuando aterrizas en LIR",
      steps: [
        {
          title: "Pasas migración y aduana",
          body: "LIR es pequeño y rápido: la mayoría de los días sales en 20 a 30 minutos. Nosotros ya sabemos que tu vuelo aterrizó, así que el chofer está en posición.",
        },
        {
          title: "Tu chofer te espera a la salida de llegadas",
          body: "Sal de la terminal, pasa la fila de taxis y busca un rótulo de Ruta Pacifico con tu nombre. El chofer te ayuda con el equipaje y te acompaña a la van.",
        },
        {
          title: "Directo a la puerta de tu hotel",
          body: "Playas del Coco en 25 minutos, Tamarindo en unos 50, Nosara en unas 2 horas. Si necesitas parar en un supermercado o un cajero en el camino, solo pídelo.",
        },
      ],
      guideHeading: "Llegar al Aeropuerto de Liberia: qué esperar",
      tipsHeading: "Consejos de nuestros choferes",
    },
    destinations: {
      heading: "Adónde te lleva LIR",
      body: "Las playas y pueblos a los que más manejamos desde el aeropuerto de Liberia, con el tiempo real de viaje y el precio en vivo para 1–5 pasajeros. Toca uno para ver todos los detalles y reservar.",
      from: "desde",
      perVehicle: "por vehículo",
      quote: "Pedir precio",
    },
    table: {
      heading: "Todos los shuttles desde y hacia el aeropuerto de Liberia",
      body: "Todas las rutas que publicamos desde LIR, de la más barata a la más cara, con el precio de cada tamaño de van. El mismo precio aplica de regreso al aeropuerto salvo que se muestre una tarifa de regreso bajo la ruta.",
      count: (n: number) => `${n} ruta${n === 1 ? "" : "s"}`,
      unavailable:
        "Nuestros precios en vivo no están cargando en este momento. Busca cualquier ruta en la página de reservas o escríbenos por WhatsApp y te mandamos el precio.",
    },
    airports: {
      heading: "¿Liberia (LIR) o San José (SJO)? ¿A qué aeropuerto te conviene llegar?",
      body: "Si tu viaje es de playas de Guanacaste, llega a Liberia: la terminal es pequeña y la mayoría de las playas quedan a menos de una hora. San José tiene sentido cuando tus primeras noches son en el Valle Central, La Fortuna o el Pacífico Central. Estos son los tiempos y precios reales que cobramos desde cada aeropuerto, para 1–5 pasajeros.",
      destination: "Destino",
      fromLir: "Desde Liberia (LIR)",
      fromSjo: "Desde San José (SJO)",
      noRoute: "—",
      verdict:
        "En resumen: para Tamarindo, Flamingo, Papagayo, Playas del Coco, Nosara y Sámara, Liberia queda entre 3 y 4 horas más cerca. Para La Fortuna y Monteverde los dos aeropuertos quedan a un viaje parecido, así que elige el que tenga el mejor vuelo.",
    },
    vehicles: {
      heading: "La van en la que viaja tu grupo",
      body: "Cuenta a todos los de tu grupo, adultos y niños. Ese número te ubica en uno de estos tres vehículos, y ese es el precio que pagas. Reservado solo para tu grupo.",
      pax: (min: number, max: number) => `${min}–${max} pasajeros`,
    },
    faqHeading: "Preguntas sobre el shuttle del aeropuerto de Liberia",
    faqs: [
      {
        q: "¿Dónde encuentro a mi chofer en el Aeropuerto de Liberia?",
        a: "Justo afuera de las puertas de llegadas, pasando la fila de taxis. El chofer sostiene un rótulo de Ruta Pacifico con tu nombre. Si no lo ves, escríbenos por WhatsApp al +506 7080-5578 y te conectamos en un minuto.",
      },
      {
        q: "¿Qué pasa si mi vuelo se atrasa o aterriza antes?",
        a: "Monitoreamos cada vuelo de llegada por su número y movemos la recogida con él. No hay cargo extra por atrasos, y nunca retiramos al chofer porque un vuelo venga tarde.",
      },
      {
        q: "¿Cuánto cuesta un shuttle del Aeropuerto de Liberia a Tamarindo?",
        a: "El precio en vivo está en la tabla de esta página y en la página de la ruta, por vehículo para hasta 5 pasajeros, impuestos incluidos. El viaje toma unos 50 minutos. Los grupos más grandes pagan el precio de 6–9 o 10–12 pasajeros por todo el vehículo.",
      },
      {
        q: "¿El precio es por persona o por vehículo?",
        a: "Por vehículo. Un solo precio cubre a todos los de tu grupo dentro de su tarifa (1–5, 6–9 o 10–12 pasajeros) y ya incluye el 13% de IVA, combustible, peajes, chofer, WiFi, agua embotellada y sillas para niños. Los grupos de 13 o más reciben una cotización por WhatsApp.",
      },
      {
        q: "¿Tienen sillas para niños?",
        a: "Sí, sin costo. Dinos las edades de los niños al reservar y las sillas correctas van instaladas antes de que el chofer salga hacia el aeropuerto.",
      },
      {
        q: "¿Podemos parar en un supermercado o un cajero saliendo del aeropuerto?",
        a: "Claro. Una parada corta para compras, efectivo o baño es parte de todos los traslados; hay un supermercado a pocos minutos de LIR camino a todas las playas. Las paradas más largas, como un almuerzo, son bienvenidas si nos avisas al reservar.",
      },
      {
        q: "¿Con cuánto tiempo debo salir para mi vuelo de regreso desde LIR?",
        a: "Programamos la recogida para que estés en la terminal unas 3 horas antes de un vuelo internacional: por ejemplo, saliendo de Tamarindo unas 4 horas antes del vuelo. Puedes cambiar la hora con nosotros por WhatsApp hasta el día anterior.",
      },
      {
        q: "¿También manejan del Aeropuerto de Liberia a La Fortuna, Monteverde o San José?",
        a: "Sí. La Fortuna y Monteverde quedan a unas 3 horas de LIR, San José a unas 3.5 a 4, y aplican los mismos precios fijos por vehículo. Los encuentras todos en la tabla de esta página.",
      },
    ],
    cta: {
      heading: "¿Listo para reservar tu shuttle del aeropuerto de Liberia?",
      body: "Busca tu ruta, mira el precio fijo y reserva en un par de minutos. Sin pago en la recogida y cancelación gratis hasta 24 horas antes.",
      book: "Reservar ahora",
      whatsapp: "Preguntar por WhatsApp",
    },
    jsonLd: {
      pageName: "Shuttle privado desde el Aeropuerto de Liberia (LIR), Costa Rica",
      pageDescription:
        "Traslados privados puerta a puerta desde el Aeropuerto Internacional Daniel Oduber Quirós (LIR), Liberia, a todas las playas de Guanacaste y destinos en toda Costa Rica. Precio fijo por vehículo, impuestos incluidos, seguimiento de vuelo.",
      serviceName: "Servicio de shuttle privado del Aeropuerto de Liberia (LIR)",
      listName: "Rutas de shuttle privado desde el Aeropuerto de Liberia (LIR)",
      routeName: (origin: string, destination: string) => `${origin} a ${destination}`,
      itemName: (origin: string, destination: string) => `Shuttle privado: ${origin} a ${destination}`,
      home: "Inicio",
      hub: "Shuttle Aeropuerto de Liberia",
    },
  },
});
