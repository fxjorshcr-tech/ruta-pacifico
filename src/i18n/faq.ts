import { defineCopy } from "@/lib/i18n";

/** Copy for the FAQ page (/faq). */
export const FAQ = defineCopy({
  en: {
    metaTitle: "Frequently Asked Questions",
    metaDescription:
      "Answers about booking a private shuttle with Ruta Pacifico: pickup, pricing, cancellation, car seats, luggage and airport transfers.",
    ogDescription:
      "Answers about booking, pricing, cancellation, airport pickup, luggage, child seats and more.",
    /** Human-friendly labels for the database category slugs. */
    categories: {
      airports: "Airports",
      booking: "Booking",
      cancellation: "Cancellation & Refunds",
      car_seats: "Car Seats",
      drivers: "Our Drivers",
      groups: "Groups & Large Parties",
      luggage: "Luggage",
      pickup: "Pickup & Drop-off",
      pricing: "Pricing & Payment",
      routes: "Routes & Travel",
      safety: "Safety & Insurance",
      travel_tips: "Travel Tips",
      vehicles: "Vehicles",
      website: "Website & Support",
    },
    jsonLd: {
      breadcrumbHome: "Home",
      breadcrumbFaq: "FAQ",
    },
    hero: {
      imageAlt: "Private shuttle along the Guanacaste coast",
      eyebrow: "Help Center",
      titleBefore: "Frequently Asked",
      titleHighlight: "Questions",
      intro: "Answers about airport pickups, car seats, luggage, payment and cancellations.",
    },
    jumpLabel: "Jump to a topic",
    empty: {
      before: "No FAQs available right now. Please",
      link: "contact us on WhatsApp",
      after: "and we will get back to you.",
    },
    count: (n: number) => `${n} ${n === 1 ? "question" : "questions"}`,
    cta: {
      heading: "Still have questions?",
      body: "Write to us on WhatsApp. We answer in English or Spanish, seven days a week.",
      whatsapp: "WhatsApp us",
      email: "Email us",
    },
    footer: {
      home: "Home",
      allRoutes: "All routes",
      faq: "FAQ",
      whatsapp: "WhatsApp",
      rights: "All rights reserved.",
    },
  },
  es: {
    metaTitle: "Preguntas frecuentes sobre traslados privados en Costa Rica",
    metaDescription:
      "Respuestas sobre cómo reservar un shuttle privado con Ruta Pacifico: recogida, precios, cancelaciones, sillas para niños, equipaje y traslados al aeropuerto.",
    ogDescription:
      "Respuestas sobre reservas, precios, cancelaciones, recogida en el aeropuerto, equipaje, sillas para niños y más.",
    categories: {
      airports: "Aeropuertos",
      booking: "Reservas",
      cancellation: "Cancelaciones y reembolsos",
      car_seats: "Sillas para niños",
      drivers: "Nuestros choferes",
      groups: "Grupos grandes",
      luggage: "Equipaje",
      pickup: "Recogida y entrega",
      pricing: "Precios y pagos",
      routes: "Rutas y viajes",
      safety: "Seguridad y seguros",
      travel_tips: "Consejos de viaje",
      vehicles: "Vehículos",
      website: "Sitio web y soporte",
    },
    jsonLd: {
      breadcrumbHome: "Inicio",
      breadcrumbFaq: "Preguntas frecuentes",
    },
    hero: {
      imageAlt: "Shuttle privado por la costa de Guanacaste",
      eyebrow: "Centro de ayuda",
      titleBefore: "Preguntas",
      titleHighlight: "Frecuentes",
      intro:
        "Respuestas sobre recogidas en el aeropuerto, sillas para niños, equipaje, pagos y cancelaciones.",
    },
    jumpLabel: "Ir a un tema",
    empty: {
      before: "No hay preguntas frecuentes disponibles por ahora. Por favor",
      link: "escríbenos por WhatsApp",
      after: "y te responderemos pronto.",
    },
    count: (n: number) => `${n} ${n === 1 ? "pregunta" : "preguntas"}`,
    cta: {
      heading: "¿Todavía tienes preguntas?",
      body: "Escríbenos por WhatsApp. Respondemos en español o en inglés, los siete días de la semana.",
      whatsapp: "Escríbenos por WhatsApp",
      email: "Envíanos un correo",
    },
    footer: {
      home: "Inicio",
      allRoutes: "Todas las rutas",
      faq: "Preguntas frecuentes",
      whatsapp: "WhatsApp",
      rights: "Todos los derechos reservados.",
    },
  },
});

/** Labels of the client-side accordion (`FaqAccordion`), shared by every page that embeds it. */
export const FAQ_ACCORDION = defineCopy({
  en: {
    empty: "No FAQs available right now.",
  },
  es: {
    empty: "No hay preguntas frecuentes disponibles por ahora.",
  },
});
