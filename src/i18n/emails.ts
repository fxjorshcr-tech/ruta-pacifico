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
    subject: (code: string) => `Your Ruta Pacifico reservation ${code}`,
    title: (code: string) => `Reservation confirmed · ${code}`,
    preheader: (code: string, firstName: string) =>
      `Reservation ${code} confirmed for ${firstName}. We&#39;ll send your secure payment link shortly.`,
    badge: "✓ Reservation confirmed",
    greeting: (firstName: string) => `¡Pura vida, ${firstName}!`,
    codeLabel: "Confirmation code",
    intro1:
      "Thank you so much for choosing <strong>Ruta Pacifico</strong>. Your seat is officially held — and we&rsquo;ve already added your trip to our schedule.",
    intro2:
      "In a few minutes you&rsquo;ll get a separate message with your <strong>secure payment link</strong>. As soon as payment clears, the booking becomes final and we&rsquo;ll start monitoring your itinerary.",
    paymentTitle: "💳 &nbsp;Payment link on the way",
    paymentBody: (email: string, phone: string) =>
      `Watch your inbox at <strong>${email}</strong> and your WhatsApp at <strong>${phone}</strong>. Your reservation is held in the meantime.`,
    shuttles: (count: number) => (count === 1 ? "Your shuttle" : `Your ${count} shuttles`),
    pax: paxEn,
    labels: {
      vehicle: "Vehicle",
      travelers: "Travelers",
      flight: "Flight",
      pickup: "Pickup",
      dropoff: "Drop-off",
    },
    notesTitle: "Special requests",
    total: (count: number) => `Total &middot; ${count} shuttle${count !== 1 ? "s" : ""}`,
    vat: "13% VAT included",
    nextTitle: "What happens next",
    steps: [
      {
        title: "Pay with the secure link",
        body: "We send it to your email + WhatsApp within minutes.",
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
    whatsappMessage: (code: string) => `Hi! Booking ${code} — could you send me the payment link?`,
    whatsappCta: (display: string) => `💬 &nbsp;Message us on WhatsApp &middot; ${display}`,
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
    footerCode: "Confirmation code",
    footerKeep: "Keep this email for your records.",
    /** One line on the internal copy so staff reply in the customer's language. */
    customerLanguage: "Customer language: English",
  },
  es: {
    subject: (code: string) => `Tu reserva con Ruta Pacifico ${code}`,
    title: (code: string) => `Reserva confirmada · ${code}`,
    preheader: (code: string, firstName: string) =>
      `Reserva ${code} confirmada para ${firstName}. En breve te enviamos tu enlace de pago seguro.`,
    badge: "✓ Reserva confirmada",
    greeting: (firstName: string) => `¡Pura vida, ${firstName}!`,
    codeLabel: "Código de confirmación",
    intro1:
      "¡Gracias por reservar con <strong>Ruta Pacifico</strong>! Tu lugar ya quedó apartado y tu viaje está en nuestra agenda.",
    intro2:
      "En unos minutos recibirás un mensaje aparte con tu <strong>enlace de pago seguro</strong>. En cuanto se acredite el pago, la reserva queda en firme y empezamos a dar seguimiento a tu itinerario.",
    paymentTitle: "💳 &nbsp;Tu enlace de pago va en camino",
    paymentBody: (email: string, phone: string) =>
      `Revisa tu correo <strong>${email}</strong> y tu WhatsApp <strong>${phone}</strong>. Mientras tanto, tu reserva queda apartada.`,
    shuttles: (count: number) => (count === 1 ? "Tu shuttle" : `Tus ${count} shuttles`),
    pax: paxEs,
    labels: {
      vehicle: "Vehículo",
      travelers: "Pasajeros",
      flight: "Vuelo",
      pickup: "Recogida",
      dropoff: "Llegada",
    },
    notesTitle: "Solicitudes especiales",
    total: (count: number) => `Total &middot; ${count} shuttle${count !== 1 ? "s" : ""}`,
    vat: "Incluye 13% de IVA",
    nextTitle: "¿Qué sigue?",
    steps: [
      {
        title: "Paga con el enlace seguro",
        body: "Te lo enviamos por correo y WhatsApp en cuestión de minutos.",
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
    whatsappMessage: (code: string) => `¡Hola! Reserva ${code} — ¿me pueden enviar el enlace de pago?`,
    whatsappCta: (display: string) => `💬 &nbsp;Escríbenos por WhatsApp &middot; ${display}`,
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
    footerCode: "Código de confirmación",
    footerKeep: "Guarda este correo para tus registros.",
    customerLanguage: "Idioma del cliente: Español",
  },
});
