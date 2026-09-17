import { defineCopy } from "@/lib/i18n";

/** About & Contact page (`/about-contact`). */
export const ABOUT = defineCopy({
  en: {
    metaTitle: "About & Contact Us",
    metaDescription:
      "Ruta Pacifico is a licensed private ground transportation operator in Guanacaste, Costa Rica. Contact us via WhatsApp or email for reservations and inquiries.",
    ogTitle: "About & Contact Us | Ruta Pacifico",
    ogDescription:
      "Contact Ruta Pacifico, a licensed ICT operator for private shuttles across Guanacaste and Costa Rica.",

    heroAlt: "Ruta Pacifico — Costa Rica",
    heroEyebrow: "About & Contact",
    heroTitle: "Your private ride across",
    heroTitleAccent: "Costa Rica",
    heroSub: (license: string) =>
      `Licensed ICT operator ${license}, based in Guanacaste. Reach us any day of the week. WhatsApp gets the fastest reply.`,

    companyEyebrow: "The Company",
    whoWeAre: "Who we are",
    aboutP1:
      "Ruta Pacifico is a fully licensed and insured ground transportation operator headquartered in Guanacaste. We specialize in private airport transfers from Liberia International Airport (LIR) and point-to-point shuttle service to beach towns, resorts, volcanoes, and cities throughout Costa Rica.",
    aboutP2:
      "Every ride is operated by a professional bilingual driver in a modern air-conditioned vehicle. Incoming flights are monitored in real time, pricing is fixed in advance and inclusive of all taxes and tolls, and each reservation is exclusive to your party. No sharing, no detours.",
    /** First-person paragraph by the founder; the sister-brand link sits between the two halves. */
    founderBefore: (name: string, since: number) =>
      `I'm ${name}, the founder. I've been welcoming travellers to Costa Rica since ${since}, and I also run `,
    founderAfter: (region: string, launch: string) =>
      `, our sister brand for ${region}. I opened Ruta Pacifico in ${launch} to bring the same standard of service to Guanacaste and Liberia Airport.`,
    features: [
      "ICT licensed by the Costa Rica Tourism Board",
      "Fully insured operator",
      "Professional bilingual drivers",
      "Modern, air-conditioned fleet",
      "Real-time flight monitoring",
      "Fixed, all-inclusive pricing",
      "24/7 bilingual support",
      "Door-to-door private service",
    ],

    logoAlt: "Ruta Pacifico",
    ictLicense: "ICT License",
    tourismBoard: "Costa Rica Tourism Board",
    basedIn: "Based in",
    basedInValue: "Liberia, Guanacaste",
    basedInCountry: "Costa Rica",
    hours: "Hours",
    hoursValue: "7 days a week",
    hoursNote: "Pickups any hour",

    touchTitle: "Get in",
    touchAccent: "touch",
    touchSub:
      "For reservations, changes or questions, WhatsApp is the fastest. You'll hear back within minutes during daytime hours.",

    whatsapp: {
      label: "WhatsApp",
      badge: "Fastest",
      desc: "Tap to open a chat for reservations, changes and real-time driver updates.",
    },
    email: {
      label: "Email",
      desc: "For reservations, invoices, and detailed itinerary requests.",
    },
    instagram: {
      label: "Instagram",
      handle: "@rutapacificocr",
      desc: "Photos from the road, beach guides, and travel tips.",
    },
    facebook: {
      label: "Facebook",
      name: "Ruta Pacifico",
      desc: "Reviews, updates, and a second way to message us.",
    },

    cta: {
      title: "Ready to book your private shuttle?",
      sub: "See the price on the route page, reserve, and pay by secure link once we confirm.",
      book: "Book your shuttle",
      whatsapp: "Chat on WhatsApp",
    },

    badgeLicensed: (license: string) => `ICT Licensed ${license}`,
    badgeBoard: "Costa Rica Tourism Board",
  },
  es: {
    metaTitle: "Nosotros y Contacto",
    metaDescription:
      "Operador licenciado de transporte privado en Guanacaste, Costa Rica. Escríbenos por WhatsApp o correo para reservar tu shuttle desde el aeropuerto de Liberia (LIR).",
    ogTitle: "Nosotros y Contacto | Ruta Pacifico",
    ogDescription:
      "Contacta a Ruta Pacifico, operador licenciado por el ICT de shuttles privados en Guanacaste y toda Costa Rica.",

    heroAlt: "Ruta Pacifico — Costa Rica",
    heroEyebrow: "Nosotros y Contacto",
    heroTitle: "Tu shuttle privado por toda",
    heroTitleAccent: "Costa Rica",
    heroSub: (license: string) =>
      `Operador licenciado por el ICT ${license}, con base en Guanacaste. Atendemos todos los días de la semana. Por WhatsApp respondemos más rápido.`,

    companyEyebrow: "La empresa",
    whoWeAre: "Quiénes somos",
    aboutP1:
      "Ruta Pacifico es un operador de transporte terrestre con licencia y seguro completos, con sede en Guanacaste. Nos especializamos en traslados privados desde el Aeropuerto Internacional de Liberia (LIR) y en shuttles punto a punto a pueblos de playa, resorts, volcanes y ciudades de toda Costa Rica.",
    aboutP2:
      "Cada viaje lo realiza un chofer profesional bilingüe en un vehículo moderno con aire acondicionado. Monitoreamos los vuelos en tiempo real, el precio es fijo, se acuerda por adelantado e incluye todos los impuestos y peajes, y cada reserva es exclusiva para tu grupo. Sin compartir, sin desvíos.",
    founderBefore: (name: string, since: number) =>
      `Soy ${name}, el fundador. Llevo recibiendo viajeros en Costa Rica desde ${since} y también dirijo `,
    founderAfter: (region: string, launch: string) =>
      `, nuestra marca hermana para ${region}. En ${launch} abrí Ruta Pacifico para llevar ese mismo estándar de servicio a Guanacaste y al aeropuerto de Liberia.`,
    features: [
      "Licencia ICT del Instituto Costarricense de Turismo",
      "Operador con seguro completo",
      "Choferes profesionales bilingües",
      "Flota moderna con aire acondicionado",
      "Seguimiento de vuelo en tiempo real",
      "Precio fijo, todo incluido",
      "Atención bilingüe 24/7",
      "Servicio privado puerta a puerta",
    ],

    logoAlt: "Ruta Pacifico",
    ictLicense: "Licencia ICT",
    tourismBoard: "Instituto Costarricense de Turismo",
    basedIn: "Con base en",
    basedInValue: "Liberia, Guanacaste",
    basedInCountry: "Costa Rica",
    hours: "Horario",
    hoursValue: "7 días a la semana",
    hoursNote: "Recogidas a cualquier hora",

    touchTitle: "Ponte en",
    touchAccent: "contacto",
    touchSub:
      "Para reservas, cambios o consultas, WhatsApp es lo más rápido. Durante el día te respondemos en minutos.",

    whatsapp: {
      label: "WhatsApp",
      badge: "Más rápido",
      desc: "Toca para abrir un chat: reservas, cambios y avisos del chofer en tiempo real.",
    },
    email: {
      label: "Correo",
      desc: "Para reservas, facturas y solicitudes de itinerarios detallados.",
    },
    instagram: {
      label: "Instagram",
      handle: "@rutapacificocr",
      desc: "Fotos del camino, guías de playas y consejos de viaje.",
    },
    facebook: {
      label: "Facebook",
      name: "Ruta Pacifico",
      desc: "Reseñas, novedades y otra forma de escribirnos.",
    },

    cta: {
      title: "¿Listo para reservar tu shuttle privado?",
      sub: "Mira el precio en la página de la ruta, reserva y paga con un enlace seguro cuando te confirmemos.",
      book: "Reservar tu shuttle",
      whatsapp: "Escríbenos por WhatsApp",
    },

    badgeLicensed: (license: string) => `Licencia ICT ${license}`,
    badgeBoard: "Instituto Costarricense de Turismo",
  },
});
