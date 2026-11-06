import { defineCopy } from "@/lib/i18n";

function paxEn(adults: number, children: number): string {
  return `${adults} adult${adults !== 1 ? "s" : ""}${children > 0 ? `, ${children} child${children !== 1 ? "ren" : ""}` : ""}`;
}

function paxEs(adults: number, children: number): string {
  return `${adults} adulto${adults !== 1 ? "s" : ""}${children > 0 ? `, ${children} niño${children !== 1 ? "s" : ""}` : ""}`;
}

/**
 * Customer-facing booking confirmation email (src/app/api/bookings/route.ts).
 *
 * Values are HTML fragments: entities (&rsquo; &middot; &nbsp;) and <strong>
 * are intentional. Anything the caller interpolates from customer data
 * (name, email, phone, code) must already be passed through escapeHtml().
 */
export const BOOKING_EMAIL = defineCopy({
  en: {
    subject: (code: string) => `Booking ${code} received — payment pending (link on its way)`,
    title: (code: string) => `Reservation received · ${code}`,
    preheader: (code: string, firstName: string) =>
      `Booking ${code} received for ${firstName} — not paid yet. Your secure payment link arrives in a separate message.`,
    badge: "Payment pending",
    greeting: (firstName: string) => `¡Pura vida, ${firstName}!`,
    codeLabel: "Booking code",
    intro1:
      "Thank you so much for choosing <strong>Ruta Pacifico</strong>. We&rsquo;re holding your seat — but your booking is <strong>not confirmed yet</strong>: nothing has been charged.",
    intro2:
      "This email is <strong>not</strong> your payment link. In a few minutes you&rsquo;ll get a separate message with your <strong>secure payment link</strong>. As soon as payment clears, the booking becomes final and we&rsquo;ll start monitoring your itinerary.",
    paymentTitle: "Not paid yet — payment link on the way",
    paymentBody: (email: string) =>
      `Watch your inbox at <strong>${email}</strong> (and the spam folder). Haven&rsquo;t received it within the hour? Tap the WhatsApp button below and we&rsquo;ll resend it to your email.`,
    shuttles: (count: number) => (count === 1 ? "Your shuttle" : `Your ${count} shuttles`),
    pax: paxEn,
    labels: {
      vehicle: "Vehicle",
      travelers: "Travelers",
      flight: "Flight",
      pickup: "Pickup",
      dropoff: "Drop-off",
      notes: "Notes",
    },
    total: (count: number) => `Total &middot; ${count} shuttle${count !== 1 ? "s" : ""}`,
    vat: "13% VAT included",
    nextTitle: "What happens next",
    steps: [
      {
        title: "Pay with the secure link",
        body: "We email it to you within minutes.",
      },
      {
        title: "Driver assignment",
        body: "We&rsquo;ll share your driver&rsquo;s name the day before your pickup.",
      },
      {
        title: "Meet &amp; greet, on time",
        body: "If it&rsquo;s an airport pickup, we monitor your flight in real time. Just look for the sign with your name.",
      },
    ],
    /** Pre-filled WhatsApp message (plain text; the caller URL-encodes it). */
    whatsappMessage: (code: string) => `Hi! Booking ${code} — I haven't received the payment link by email yet. Could you check?`,
    whatsappCta: (display: string) => `Message us on WhatsApp &middot; ${display}`,
    trust: {
      insured: "Insured",
      ict: (license: string) => `ICT ${license}`,
      bilingual: "Bilingual drivers",
    },
    goodToKnow: "Good to know",
    goodToKnowItems: [
      "Free changes up to 48h before pickup",
      "Baby seats &amp; boosters at no extra cost — just reply with ages",
      "1 large bag + 1 carry-on per traveler included",
    ],
    footerAddress: "Liberia, Guanacaste &middot; Costa Rica",
    footerCode: "Booking code",
    footerKeep: "Keep this email for your records.",
    /** One line on the internal copy so staff reply in the customer's language. */
    customerLanguage: "Customer language: English",
  },
  es: {
    subject: (code: string) => `Reserva ${code} recibida: pago pendiente (el enlace va en camino)`,
    title: (code: string) => `Reserva recibida · ${code}`,
    preheader: (code: string, firstName: string) =>
      `Reserva ${code} recibida para ${firstName}: aún sin pagar. Tu enlace de pago seguro llega en un mensaje aparte.`,
    badge: "Pago pendiente",
    greeting: (firstName: string) => `¡Pura vida, ${firstName}!`,
    codeLabel: "Código de reserva",
    intro1:
      "¡Gracias por reservar con <strong>Ruta Pacifico</strong>! Estamos apartando tu lugar, pero tu reserva <strong>todavía no está confirmada</strong>: no se ha cobrado nada.",
    intro2:
      "Este correo <strong>no</strong> es tu enlace de pago. En unos minutos recibirás un mensaje aparte con tu <strong>enlace de pago seguro</strong>. En cuanto se acredite el pago, la reserva queda en firme y empezamos a dar seguimiento a tu itinerario.",
    paymentTitle: "Aún no has pagado: tu enlace de pago va en camino",
    paymentBody: (email: string) =>
      `Revisa tu correo <strong>${email}</strong> (también la carpeta de spam). ¿No te llegó en una hora? Toca el botón de WhatsApp aquí abajo y te lo reenviamos al correo.`,
    shuttles: (count: number) => (count === 1 ? "Tu shuttle" : `Tus ${count} shuttles`),
    pax: paxEs,
    labels: {
      vehicle: "Vehículo",
      travelers: "Pasajeros",
      flight: "Vuelo",
      pickup: "Recogida",
      dropoff: "Llegada",
      notes: "Notas",
    },
    total: (count: number) => `Total &middot; ${count} shuttle${count !== 1 ? "s" : ""}`,
    vat: "Incluye 13% de IVA",
    nextTitle: "¿Qué sigue?",
    steps: [
      {
        title: "Paga con el enlace seguro",
        body: "Te lo enviamos por correo en cuestión de minutos.",
      },
      {
        title: "Asignación de chofer",
        body: "Te compartimos el nombre de tu chofer el día antes de la recogida.",
      },
      {
        title: "Recibimiento puntual",
        body: "Si te recogemos en el aeropuerto, damos seguimiento a tu vuelo en tiempo real. Solo busca el rótulo con tu nombre.",
      },
    ],
    whatsappMessage: (code: string) => `¡Hola! Reserva ${code}: todavía no me llega el enlace de pago al correo. ¿Me lo pueden revisar?`,
    whatsappCta: (display: string) => `Escríbenos por WhatsApp &middot; ${display}`,
    trust: {
      insured: "Asegurados",
      ict: (license: string) => `ICT ${license}`,
      bilingual: "Choferes bilingües",
    },
    goodToKnow: "Ten en cuenta",
    goodToKnowItems: [
      "Cambios gratis hasta 48 h antes de la recogida",
      "Sillas para niños y boosters sin costo extra — solo respóndenos con las edades",
      "1 maleta grande + 1 de mano por pasajero incluidas",
    ],
    footerAddress: "Liberia, Guanacaste &middot; Costa Rica",
    footerCode: "Código de reserva",
    footerKeep: "Guarda este correo para tus registros.",
    customerLanguage: "Idioma del cliente: Español",
  },
});
