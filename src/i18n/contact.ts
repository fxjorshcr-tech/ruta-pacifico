import { defineCopy } from "@/lib/i18n";

/** Contact form (client component). */
export const CONTACT_FORM = defineCopy({
  en: {
    title: "Send us a message",
    subtitle: "We'll reply within a few hours during the day.",
    name: "Full name",
    email: "Email",
    phone: "Phone / WhatsApp",
    optional: "(optional)",
    subject: "Subject",
    subjectPlaceholder: "Reservation question, custom itinerary, group quote…",
    message: "Message",
    messagePlaceholder: "Tell us about your trip, dates, and number of travelers…",
    sending: "Sending…",
    submit: "Send message",
    successTitle: "Message sent",
    successBody:
      "Thanks — we've received your message and will reply shortly. Check your inbox for a confirmation.",
    sendAnother: "Send another message",
    /** Shown when the API rejects the message without a reason of its own. */
    errorGeneric: "Could not send your message.",
    /** Shown when the request itself fails for a reason that is not an Error. */
    errorNetwork: "Could not send your message. Please try WhatsApp instead.",
  },
  es: {
    title: "Envíanos un mensaje",
    subtitle: "Durante el día te respondemos en pocas horas.",
    name: "Nombre completo",
    email: "Correo electrónico",
    phone: "Teléfono / WhatsApp",
    optional: "(opcional)",
    subject: "Asunto",
    subjectPlaceholder: "Consulta sobre una reserva, itinerario a medida, cotización para grupos…",
    message: "Mensaje",
    messagePlaceholder: "Cuéntanos sobre tu viaje, las fechas y cuántas personas viajan…",
    sending: "Enviando…",
    submit: "Enviar mensaje",
    successTitle: "Mensaje enviado",
    successBody:
      "Gracias, recibimos tu mensaje y te responderemos pronto. Revisa tu correo: te enviamos una confirmación.",
    sendAnother: "Enviar otro mensaje",
    errorGeneric: "No pudimos enviar tu mensaje.",
    errorNetwork: "No pudimos enviar tu mensaje. Escríbenos por WhatsApp.",
  },
});

/** Error messages returned by `POST /api/contact` (the form shows them verbatim). */
export const CONTACT_API = defineCopy({
  en: {
    invalidFields: "Missing or invalid fields",
    notConfigured: "Server email not configured",
    sendFailed: "Could not send your message. Please try WhatsApp instead.",
    /** One line in the internal (English) notification so the team replies in the right language. */
    adminLanguageLine: "Customer language: English",
  },
  es: {
    invalidFields: "Faltan campos o hay datos inválidos",
    notConfigured: "El correo del servidor no está configurado",
    sendFailed: "No pudimos enviar tu mensaje. Escríbenos por WhatsApp.",
    adminLanguageLine: "Idioma del cliente: Español",
  },
});

/**
 * Customer acknowledgement email sent by `POST /api/contact`. Values are
 * HTML fragments (entities and <strong> included); `firstName` arrives
 * already escaped.
 */
export const CONTACT_EMAIL = defineCopy({
  en: {
    subject: "We received your message · Ruta Pacifico",
    preheader: (firstName: string) =>
      `Pura vida, ${firstName}! Thanks for reaching out — we'll get back to you within a few hours.`,
    badge: "Message received",
    greeting: (firstName: string) => `¡Pura vida, ${firstName}!`,
    heroSub: "Thanks for reaching out &mdash; we&rsquo;ve got your message.",
    body1:
      "Our team is right here in beautiful Guanacaste and we usually reply in <strong>under 10 minutes</strong> — unless it&rsquo;s late night or early morning in Costa Rica, in which case you&rsquo;ll hear from us first thing.",
    body2:
      "In the meantime, save this email — it has all our contact info if you need to reach us faster.",
    yourMessage: "Your message",
    needNow: "Need an answer right now?",
    whatsappUs: "WhatsApp us",
    licensedInsured: "Licensed &amp; Insured",
    tourismBoard: "Costa Rica Tourism Board",
    trustLine: "Professional bilingual drivers &middot; Modern fleet",
    browseRoutes: "Browse our routes",
    footerNote: "You&rsquo;re receiving this because you contacted us through our website.",
  },
  es: {
    subject: "Recibimos tu mensaje · Ruta Pacifico",
    preheader: (firstName: string) =>
      `¡Pura vida, ${firstName}! Gracias por escribirnos — te respondemos en pocas horas.`,
    badge: "Mensaje recibido",
    greeting: (firstName: string) => `¡Pura vida, ${firstName}!`,
    heroSub: "Gracias por escribirnos &mdash; ya tenemos tu mensaje.",
    body1:
      "Nuestro equipo está aquí mismo, en la hermosa Guanacaste, y normalmente respondemos en <strong>menos de 10 minutos</strong>, salvo que sea de madrugada o muy temprano en Costa Rica; en ese caso te escribimos a primera hora.",
    body2:
      "Mientras tanto, guarda este correo: tiene toda nuestra información de contacto por si necesitas comunicarte más rápido.",
    yourMessage: "Tu mensaje",
    needNow: "¿Necesitas una respuesta ahora mismo?",
    whatsappUs: "Escríbenos por WhatsApp",
    licensedInsured: "Con licencia y seguro",
    tourismBoard: "Instituto Costarricense de Turismo",
    trustLine: "Choferes profesionales bilingües &middot; Flota moderna",
    browseRoutes: "Ver nuestras rutas",
    footerNote: "Recibes este correo porque nos contactaste a través de nuestro sitio web.",
  },
});

/** Instagram / Facebook icon links in page footers. */
export const SOCIAL_LINKS = defineCopy({
  en: {
    instagramLabel: "Ruta Pacifico on Instagram",
    instagramTitle: "Instagram @rutapacificocr",
    facebookLabel: "Ruta Pacifico on Facebook",
    facebookTitle: "Facebook",
  },
  es: {
    instagramLabel: "Ruta Pacifico en Instagram",
    instagramTitle: "Instagram @rutapacificocr",
    facebookLabel: "Ruta Pacifico en Facebook",
    facebookTitle: "Facebook",
  },
});
