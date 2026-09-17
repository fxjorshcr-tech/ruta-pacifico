import { defineCopy } from "@/lib/i18n";

/**
 * Home page copy. Section objects mirror the order of the page; the card
 * arrays (`services.cards`, `plan.cards`, `beaches.cards`) are read by index
 * against the page-side style / image / slug arrays, so keep the order.
 */
export const HOME = defineCopy({
  en: {
    hero: {
      imageAlt: "Playa Conchal, Guanacaste, Costa Rica",
      photoCaption: "Playa Conchal, Guanacaste",
      titleLead: "Private Shuttles from",
      titleAccent: "Liberia Airport",
      subtitle:
        "A private driver from Liberia Airport (LIR) to Tamarindo, Flamingo, Papagayo, Nosara or any other beach in Guanacaste. Fixed price, flight tracked, name sign at arrivals.",
      cta: "Book Your Shuttle",
    },
    services: {
      titleLead: "Where Are You",
      titleAccent: "Headed",
      titleTail: "?",
      cards: [
        {
          title: "From LIR Airport",
          desc: "Pickup at Liberia Airport (LIR) and a direct drive to your hotel, villa or resort anywhere in Guanacaste, or on to La Fortuna and Monteverde. We track the flight, so the driver is at arrivals when you walk out.",
          tags: ["Tamarindo", "Flamingo", "Papagayo", "Nosara", "Conchal", "La Fortuna", "Monteverde"],
        },
        {
          title: "Between Beaches",
          desc: "Rides between the coastal towns of Guanacaste: Tamarindo to Flamingo, Conchal to Nosara, Papagayo to Sámara. One way, round trip, or a full day with the same driver and vehicle.",
          tags: ["One-way", "Round-trip", "Full-day", "Tamarindo", "Flamingo", "Nosara", "Conchal"],
        },
        {
          title: "Across Costa Rica",
          desc: "Long-distance transfers from Guanacaste to La Fortuna, Monteverde, Manuel Antonio, San José and the rest of the country, plus legs between those places, such as La Fortuna to Manuel Antonio.",
          tags: ["La Fortuna", "Monteverde", "Manuel Antonio", "San José", "Arenal"],
        },
      ],
      cta: "Book this shuttle",
    },
    plan: {
      titleLead: "What's Your Plan in",
      titleAccent: "Guanacaste",
      titleTail: "?",
      subtitle:
        "Three of the places we drive to most often. Every other beach, hotel and town in the province is on the booking page.",
      cards: [
        {
          alt: "Tamarindo Beach, Guanacaste",
          badge: "~50 min from LIR",
          name: "Tamarindo",
          desc: "The busiest beach town in Guanacaste: surf lessons every morning, a walkable centre full of restaurants, and sunset watched from the sand. About 50 minutes from the airport on paved road.",
        },
        {
          alt: "Playa Conchal, Guanacaste",
          badge: "~1 hr from LIR",
          name: "Conchal",
          desc: "A beach of crushed shells with the clearest water on this coast, next to the Reserva Conchal resorts. Quiet, good for snorkelling, and an hour from the airport.",
        },
        {
          alt: "Nosara Beach, Guanacaste",
          badge: "~2 hrs from LIR",
          name: "Nosara",
          desc: "A long surf beach with yoga studios and lodges set back in the trees, and no buildings on the sand. The last stretch of road is gravel, which is why most visitors arrive with a driver.",
        },
      ],
      cta: "Book a shuttle",
    },
    included: {
      title: "What's Included in Every Private Shuttle",
      features: [
        { title: "Drivers who know the roads", desc: "Local drivers who do these routes every week, including the mountain road to Monteverde and the gravel into Nosara." },
        { title: "Comfortable vehicles", desc: "Air-conditioned vans with Wi-Fi and cold water on board." },
        { title: "Fixed rates", desc: "The price you see when you book is the price you pay. Fuel, tolls and taxes included." },
        { title: "Flight tracking", desc: "We follow your flight and move the pickup if it lands early or late. No extra charge for delays." },
        { title: "English and Spanish", desc: "All drivers speak both languages. Ask them where to eat." },
        { title: "Door to door", desc: "Pickup at the terminal exit, drop-off at the door of your hotel or villa." },
      ],
    },
    fleet: {
      title: "Our Fleet",
      subtitle:
        "Air-conditioned vans sized for 1 to 12 passengers, with Wi-Fi, cold water and room for everyone's luggage.",
      imageAlt: (name: string) => `${name} or similar`,
      orSimilar: "or similar",
    },
    airport: {
      titleLead: "Flying into",
      titleAccent: "Liberia (LIR)",
      subtitle:
        "Liberia is the closest international airport to the Guanacaste beaches. Your driver waits right outside the terminal.",
      imageAlt: "Liberia International Airport (LIR), Guanacaste, Costa Rica",
      photoName: "Daniel Oduber Quirós International",
      pill: "Liberia Airport (LIR)",
      heading: "Direct flights from the US & Canada",
      p1: "United, Delta, American, JetBlue, Southwest and Air Canada fly into LIR year-round. The airport is 15 minutes from Liberia town and between 25 minutes and 2 hours from the beaches.",
      p2: "We follow every incoming flight and adjust the pickup if you land early or late. The driver waits at the arrivals exit with a sign with your name.",
      times: [
        { route: "LIR → Tamarindo", time: "~50 min" },
        { route: "LIR → Flamingo / Conchal", time: "~1 hr" },
        { route: "LIR → Papagayo Peninsula", time: "~30 min" },
        { route: "LIR → Nosara / Sámara", time: "~2 hrs" },
      ],
    },
    guanacaste: {
      titleLead: "About",
      titleAccent: "Guanacaste",
      subtitle:
        "The driest, sunniest province in Costa Rica: 600 km of Pacific coast, volcanoes inland, and its own traditions.",
      stats: [
        { value: "300+", label: "Sunny days / year" },
        { value: "25–35°C", label: "Avg. temperature" },
        { value: "600+", label: "km of coastline" },
        { value: "4", label: "National parks" },
      ],
      pill: "The region",
      heading: "What to expect",
      p1: "From November to April it barely rains, which is why the province fills with winter visitors. The coast mixes surf towns, resort bays and small fishing villages, all between 25 minutes and 2 hours from the airport.",
      p2: "Inland there is the Rincón de la Vieja volcano, dry tropical forest and waterfalls like Llanos de Cortés. On 25 July the province celebrates its annexation with parades, marimba music and horse shows.",
      p3: "Surfing, sport fishing out of Flamingo and Papagayo, and diving at the Catalina Islands are the main draws.",
    },
    beaches: {
      titleLead: "Every Beach &",
      titleAccent: "Resort in Guanacaste",
      subtitle:
        "Private shuttle service from LIR to every coastal town, resort, and beach in the province.",
      /** `slug` is the slug of the `routes.destino` value, used to find the live LIR price. */
      cards: [
        { slug: "tamarindo-guanacaste", name: "Tamarindo", tag: "Surf & nightlife", from: "~50 min from LIR" },
        { slug: "flamingo-guanacaste", name: "Flamingo / Conchal", tag: "White-sand bays", from: "~1 hr from LIR" },
        { slug: "papagayo-peninsula-guanacaste", name: "Papagayo Peninsula", tag: "Luxury resorts", from: "~30 min from LIR" },
        { slug: "nosara-playa-guiones-area", name: "Nosara / Sámara", tag: "Yoga & surf", from: "~2 hrs from LIR" },
        { slug: "playas-del-coco-guanacaste", name: "Playas del Coco", tag: "Lively beach town", from: "~25 min from LIR" },
        { slug: "las-catalinas-guanacaste", name: "Las Catalinas", tag: "Walkable village", from: "~1 hr from LIR" },
      ],
      fromLabel: "from ",
      perVehicle: "per vehicle, taxes incl.",
      cardLabel: (name: string, price: number | null) =>
        `Private shuttle from Liberia Airport to ${name}${price ? `, from $${price} per vehicle` : ""}`,
      cta: "Find your route & price",
      priceListLead: "Search any destination on our booking page, or see the",
      priceListLink: "full price list",
      priceListTail: ".",
    },
    faq: {
      title: "Questions before you book",
      subtitle: "What travellers ask us most. The full list is on the FAQ page.",
      cta: "See all questions",
    },
    about: {
      titleLead: "About",
      titleAccent: "Ruta Pacifico",
      subtitle: "A licensed transport operator based in Liberia, Guanacaste.",
      pill: "The Company",
      heading: "Who we are",
      p1: "Ruta Pacifico is a licensed and insured ground transportation company based in Guanacaste. We do private airport transfers from Liberia International Airport (LIR) and point-to-point shuttles anywhere in Costa Rica.",
      p2: "Each trip has a bilingual driver and an air-conditioned vehicle reserved only for your group. We track incoming flights, and the price you are quoted includes taxes and tolls.",
      bullets: [
        "Licensed & fully insured operator",
        "Professional bilingual drivers",
        "Modern, air-conditioned fleet",
        "Real-time flight monitoring",
        "Fixed, all-inclusive pricing",
        "24/7 bilingual support",
      ],
      whatsapp: "WhatsApp (fastest)",
      email: "Email",
      follow: "Follow us",
      hours: "Hours",
      hoursValue: "7 days a week",
      hoursNote: "Pickups any hour",
      basedIn: "Based in",
      cta: "Book your private shuttle",
    },
    footer: {
      tagline: "Private shuttles across Guanacaste and Costa Rica.",
      services: "Services",
      serviceLinks: ["Airport Shuttles", "Inter-Beach Shuttles", "Inter-Destination Shuttles"],
      popularRoutes: "Popular Routes",
      routes: ["LIR to Tamarindo", "LIR to Papagayo", "LIR to Flamingo", "LIR to Nosara"],
      contact: "Contact",
      aboutLink: "About & Contact Us",
      follow: "Follow us",
      rights: "All rights reserved.",
    },
  },
  es: {
    hero: {
      imageAlt: "Playa Conchal, Guanacaste, Costa Rica",
      photoCaption: "Playa Conchal, Guanacaste",
      titleLead: "Shuttle Privado desde el",
      titleAccent: "Aeropuerto de Liberia",
      subtitle:
        "Un chofer privado desde el aeropuerto de Liberia (LIR) a Tamarindo, Flamingo, Papagayo, Nosara o cualquier otra playa de Guanacaste. Precio fijo, seguimiento de vuelo y un rótulo con tu nombre en llegadas.",
      cta: "Reserva tu shuttle",
    },
    services: {
      titleLead: "¿Cuál es tu",
      titleAccent: "destino",
      titleTail: "?",
      cards: [
        {
          title: "Desde el aeropuerto LIR",
          desc: "Te recogemos en el aeropuerto de Liberia (LIR) y te llevamos directo a tu hotel, villa o resort en cualquier punto de Guanacaste, o hasta La Fortuna y Monteverde. Hacemos seguimiento del vuelo para que el chofer esté en llegadas cuando salgas.",
          tags: ["Tamarindo", "Flamingo", "Papagayo", "Nosara", "Conchal", "La Fortuna", "Monteverde"],
        },
        {
          title: "Entre playas",
          desc: "Traslados entre los pueblos costeros de Guanacaste: de Tamarindo a Flamingo, de Conchal a Nosara, de Papagayo a Sámara. Solo ida, ida y vuelta o un día completo con el mismo chofer y vehículo.",
          tags: ["Solo ida", "Ida y vuelta", "Día completo", "Tamarindo", "Flamingo", "Nosara", "Conchal"],
        },
        {
          title: "Por toda Costa Rica",
          desc: "Traslados de larga distancia desde Guanacaste a La Fortuna, Monteverde, Manuel Antonio, San José y el resto del país, además de tramos entre esos destinos, como de La Fortuna a Manuel Antonio.",
          tags: ["La Fortuna", "Monteverde", "Manuel Antonio", "San José", "Arenal"],
        },
      ],
      cta: "Reservar este shuttle",
    },
    plan: {
      titleLead: "¿Cuál es tu plan en",
      titleAccent: "Guanacaste",
      titleTail: "?",
      subtitle:
        "Tres de los lugares a los que más viajamos. Todas las demás playas, hoteles y pueblos de la provincia están en la página de reservas.",
      cards: [
        {
          alt: "Playa Tamarindo, Guanacaste",
          badge: "~50 min desde LIR",
          name: "Tamarindo",
          desc: "El pueblo de playa más animado de Guanacaste: clases de surf cada mañana, un centro caminable lleno de restaurantes y atardeceres vistos desde la arena. A unos 50 minutos del aeropuerto por carretera asfaltada.",
        },
        {
          alt: "Playa Conchal, Guanacaste",
          badge: "~1 h desde LIR",
          name: "Conchal",
          desc: "Una playa de conchas trituradas con el agua más clara de esta costa, junto a los resorts de Reserva Conchal. Tranquila, ideal para snorkel y a una hora del aeropuerto.",
        },
        {
          alt: "Playa Nosara, Guanacaste",
          badge: "~2 h desde LIR",
          name: "Nosara",
          desc: "Una playa larga de surf con estudios de yoga y lodges escondidos entre los árboles, sin construcciones sobre la arena. El último tramo del camino es de lastre, por eso la mayoría de los visitantes llega con chofer.",
        },
      ],
      cta: "Reservar un shuttle",
    },
    included: {
      title: "Qué incluye cada shuttle privado",
      features: [
        { title: "Choferes que conocen las rutas", desc: "Choferes locales que hacen estas rutas cada semana, incluida la carretera de montaña a Monteverde y el lastre hasta Nosara." },
        { title: "Vehículos cómodos", desc: "Vans con aire acondicionado, Wi-Fi y agua fría a bordo." },
        { title: "Tarifas fijas", desc: "El precio que ves al reservar es el precio que pagas. Combustible, peajes e impuestos incluidos." },
        { title: "Seguimiento de vuelo", desc: "Seguimos tu vuelo y movemos la recogida si aterriza antes o después. Sin cargo extra por retrasos." },
        { title: "Inglés y español", desc: "Todos los choferes hablan ambos idiomas. Pregúntales dónde comer." },
        { title: "Puerta a puerta", desc: "Te recogemos a la salida de la terminal y te dejamos en la puerta de tu hotel o villa." },
      ],
    },
    fleet: {
      title: "Nuestra flota",
      subtitle:
        "Vans con aire acondicionado para 1 a 12 pasajeros, con Wi-Fi, agua fría y espacio para el equipaje de todos.",
      imageAlt: (name: string) => `${name} o similar`,
      orSimilar: "o similar",
    },
    airport: {
      titleLead: "Si vuelas a",
      titleAccent: "Liberia (LIR)",
      subtitle:
        "Liberia es el aeropuerto internacional más cercano a las playas de Guanacaste. Tu chofer te espera justo afuera de la terminal.",
      imageAlt: "Aeropuerto Internacional de Liberia (LIR), Guanacaste, Costa Rica",
      photoName: "Aeropuerto Internacional Daniel Oduber Quirós",
      pill: "Aeropuerto de Liberia (LIR)",
      heading: "Vuelos directos desde Estados Unidos y Canadá",
      p1: "United, Delta, American, JetBlue, Southwest y Air Canada vuelan a LIR todo el año. El aeropuerto está a 15 minutos de la ciudad de Liberia y entre 25 minutos y 2 horas de las playas.",
      p2: "Seguimos cada vuelo que llega y ajustamos la recogida si aterrizas antes o después. El chofer te espera a la salida de llegadas con un rótulo con tu nombre.",
      times: [
        { route: "LIR → Tamarindo", time: "~50 min" },
        { route: "LIR → Flamingo / Conchal", time: "~1 h" },
        { route: "LIR → Península de Papagayo", time: "~30 min" },
        { route: "LIR → Nosara / Sámara", time: "~2 h" },
      ],
    },
    guanacaste: {
      titleLead: "Conoce",
      titleAccent: "Guanacaste",
      subtitle:
        "La provincia más seca y soleada de Costa Rica: 600 km de costa pacífica, volcanes tierra adentro y tradiciones propias.",
      stats: [
        { value: "300+", label: "Días de sol al año" },
        { value: "25–35°C", label: "Temperatura promedio" },
        { value: "600+", label: "km de costa" },
        { value: "4", label: "Parques nacionales" },
      ],
      pill: "La región",
      heading: "Qué esperar",
      p1: "De noviembre a abril casi no llueve, por eso la provincia se llena de visitantes que escapan del invierno. La costa mezcla pueblos de surf, bahías con resorts y pequeños pueblos de pescadores, todos entre 25 minutos y 2 horas del aeropuerto.",
      p2: "Tierra adentro están el volcán Rincón de la Vieja, el bosque seco tropical y cataratas como Llanos de Cortés. El 25 de julio la provincia celebra su anexión con desfiles, música de marimba y topes.",
      p3: "El surf, la pesca deportiva desde Flamingo y Papagayo, y el buceo en las Islas Catalinas son los principales atractivos.",
    },
    beaches: {
      titleLead: "Todas las playas y",
      titleAccent: "resorts de Guanacaste",
      subtitle:
        "Servicio de shuttle privado desde LIR a cada pueblo costero, resort y playa de la provincia.",
      cards: [
        { slug: "tamarindo-guanacaste", name: "Tamarindo", tag: "Surf y vida nocturna", from: "~50 min desde LIR" },
        { slug: "flamingo-guanacaste", name: "Flamingo / Conchal", tag: "Bahías de arena blanca", from: "~1 h desde LIR" },
        { slug: "papagayo-peninsula-guanacaste", name: "Península de Papagayo", tag: "Resorts de lujo", from: "~30 min desde LIR" },
        { slug: "nosara-playa-guiones-area", name: "Nosara / Sámara", tag: "Yoga y surf", from: "~2 h desde LIR" },
        { slug: "playas-del-coco-guanacaste", name: "Playas del Coco", tag: "Pueblo de playa animado", from: "~25 min desde LIR" },
        { slug: "las-catalinas-guanacaste", name: "Las Catalinas", tag: "Pueblo caminable", from: "~1 h desde LIR" },
      ],
      fromLabel: "desde ",
      perVehicle: "por vehículo, impuestos incl.",
      cardLabel: (name: string, price: number | null) =>
        `Shuttle privado desde el aeropuerto de Liberia a ${name}${price ? `, desde $${price} por vehículo` : ""}`,
      cta: "Encuentra tu ruta y precio",
      priceListLead: "Busca cualquier destino en nuestra página de reservas o revisa la",
      priceListLink: "lista completa de precios",
      priceListTail: ".",
    },
    faq: {
      title: "Preguntas antes de reservar",
      subtitle: "Lo que más nos preguntan los viajeros. La lista completa está en la página de preguntas frecuentes.",
      cta: "Ver todas las preguntas",
    },
    about: {
      titleLead: "Sobre",
      titleAccent: "Ruta Pacifico",
      subtitle: "Una empresa de transporte con licencia, ubicada en Liberia, Guanacaste.",
      pill: "La empresa",
      heading: "Quiénes somos",
      p1: "Ruta Pacifico es una empresa de transporte terrestre con licencia y seguro, ubicada en Guanacaste. Hacemos traslados privados desde el Aeropuerto Internacional de Liberia (LIR) y shuttles punto a punto a cualquier lugar de Costa Rica.",
      p2: "Cada viaje incluye un chofer bilingüe y un vehículo con aire acondicionado reservado solo para tu grupo. Hacemos seguimiento de los vuelos y el precio que te cotizamos incluye impuestos y peajes.",
      bullets: [
        "Empresa con licencia y seguro completo",
        "Choferes profesionales bilingües",
        "Flota moderna con aire acondicionado",
        "Seguimiento de vuelo en tiempo real",
        "Precio fijo, todo incluido",
        "Soporte bilingüe 24/7",
      ],
      whatsapp: "WhatsApp (más rápido)",
      email: "Correo",
      follow: "Síguenos",
      hours: "Horario",
      hoursValue: "7 días a la semana",
      hoursNote: "Recogidas a cualquier hora",
      basedIn: "Ubicados en",
      cta: "Reserva tu shuttle privado",
    },
    footer: {
      tagline: "Shuttles privados por Guanacaste y toda Costa Rica.",
      services: "Servicios",
      serviceLinks: ["Shuttles de aeropuerto", "Shuttles entre playas", "Shuttles entre destinos"],
      popularRoutes: "Rutas populares",
      routes: ["LIR a Tamarindo", "LIR a Papagayo", "LIR a Flamingo", "LIR a Nosara"],
      contact: "Contacto",
      aboutLink: "Nosotros y Contacto",
      follow: "Síguenos",
      rights: "Todos los derechos reservados.",
    },
  },
});
