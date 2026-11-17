import { defineCopy } from "@/lib/i18n";
import { LEAD_TIME_MESSAGE } from "@/lib/leadTime";

/** Spanish twin of LEAD_TIME_MESSAGE (src/lib/leadTime.ts). */
const LEAD_TIME_MESSAGE_ES =
  "Necesitamos al menos un día de anticipación. Reserva antes de las 12:00 p. m. (hora de Costa Rica) para viajar mañana; después de esa hora, la recogida más cercana es pasado mañana.";

function paxEn(adults: number, children: number): string {
  return `${adults} adult${adults !== 1 ? "s" : ""}${children > 0 ? `, ${children} child${children !== 1 ? "ren" : ""}` : ""}`;
}

function paxEs(adults: number, children: number): string {
  return `${adults} adulto${adults !== 1 ? "s" : ""}${children > 0 ? `, ${children} niño${children !== 1 ? "s" : ""}` : ""}`;
}

/** "What's included" / "Important information" lists, shared by checkout and confirmation. */
const INCLUDED_EN = [
  "Spacious van with full A/C",
  "Personalized meet & greet",
  "Door-to-door private service",
  "Free Wi-Fi & bottled water",
  "Professional bilingual driver",
  "All-inclusive pricing",
];
const INCLUDED_ES = [
  "Van espaciosa con aire acondicionado",
  "Recibimiento personalizado",
  "Servicio privado puerta a puerta",
  "Wi-Fi y agua embotellada gratis",
  "Chofer profesional bilingüe",
  "Precio todo incluido",
];
const IMPORTANT_EN = [
  "1 large bag + 1 carry-on per person",
  "One complimentary 15-min stop",
  "Baby car seats & boosters free",
  "No refund within 48h of pickup",
  "Free changes up to 48h before",
];
const IMPORTANT_ES = [
  "1 maleta grande + 1 de mano por persona",
  "Una parada de 15 min de cortesía",
  "Sillas para niños y boosters gratis",
  "Sin reembolso dentro de las 48 h previas a la recogida",
  "Cambios gratis hasta 48 h antes",
];

/** /private-shuttle/checkout */
export const CHECKOUT = defineCopy({
  en: {
    heroAlt: "Private shuttle in Costa Rica",
    empty: {
      title: "Your trip is empty",
      body: "Add at least one shuttle to continue.",
      cta: "Find a route",
    },
    title: "Checkout",
    intro: (count: number) =>
      `Review your ${count === 1 ? "shuttle" : `${count} shuttles`} and complete your booking.`,
    pax: paxEn,
    labels: {
      vehicle: "Vehicle:",
      travelers: "Travelers:",
      flight: "Flight:",
      pickup: "Pickup:",
      dropoff: "Drop-off:",
      notes: "Notes:",
    },
    addAnother: "+ Add another shuttle",
    details: {
      title: "Complete your details",
      name: "Full name",
      email: "Email",
      phone: "Phone / WhatsApp",
    },
    confirming: "Confirming…",
    confirm: (total: number) => `Confirm Booking — $${total}`,
    payment: {
      title: "How does payment work?",
      before: "After confirming your booking, we will send you a ",
      strong: "secure payment link",
      after:
        " to your email so you can complete the payment safely. Nothing is charged now — your booking is confirmed once you pay through that link, and we hold your spot in the meantime.",
    },
    badges: {
      guaranteed: "Reservation Guaranteed",
      secure: "Secure Payment Link",
      ict: "ICT Licensed",
    },
    /** Card-payment flow (NEXT_PUBLIC_PAYMENT_PROVIDER=powertranz). */
    card: {
      continue: (total: number) => `Continue to secure payment — $${total}`,
      paymentTitle: "How does payment work?",
      paymentBefore: "On the next step you pay by card on a ",
      paymentStrong: "secure page by BAC Credomatic (Powertranz)",
      paymentAfter:
        ", protected with 3-D Secure. Your booking is confirmed the moment the payment is approved, and your voucher is emailed right away.",
      bankTitle: "A heads-up about your bank",
      bankBody:
        "Some banks block the first online or international charge on a card. If that happens, approve it in your banking app or give them a quick call, then try again — your spot stays held.",
      secureBadge: "Secure card payment",
      sidebarNote: "Pay securely by card on the next step — your booking is confirmed instantly.",
      stepTitle: "Payment",
      stepSub: (code: string) => `Booking ${code} held — pay now to confirm it`,
    },
    back: "Back to Trip Details",
    ict: { title: "ICT Licensed #4121-2025", sub: "Costa Rica Tourism Board" },
    total: (count: number) => `Total (${count} shuttle${count !== 1 ? "s" : ""})`,
    vat: "13% VAT included",
    sidebarNote: "Confirm your reservation — we'll email a secure payment link.",
    includedTitle: "What's Included",
    included: INCLUDED_EN,
    importantTitle: "Important Information",
    important: IMPORTANT_EN,
    errors: {
      tooSoon: (date: string, from: string, to: string) =>
        `${date} is too soon for ${from} → ${to}. ${LEAD_TIME_MESSAGE} Please edit that trip and pick a later date.`,
      failed: "Could not confirm your booking.",
      failedRetry: "Could not confirm your booking. Please try again.",
    },
  },
  es: {
    heroAlt: "Shuttle privado en Costa Rica",
    empty: {
      title: "Tu viaje está vacío",
      body: "Agrega al menos un shuttle para continuar.",
      cta: "Buscar una ruta",
    },
    title: "Finalizar reserva",
    intro: (count: number) =>
      `Revisa ${count === 1 ? "tu shuttle" : `tus ${count} shuttles`} y completa tu reserva.`,
    pax: paxEs,
    labels: {
      vehicle: "Vehículo:",
      travelers: "Pasajeros:",
      flight: "Vuelo:",
      pickup: "Recogida:",
      dropoff: "Llegada:",
      notes: "Notas:",
    },
    addAnother: "+ Agregar otro shuttle",
    details: {
      title: "Completa tus datos",
      name: "Nombre completo",
      email: "Correo electrónico",
      phone: "Teléfono / WhatsApp",
    },
    confirming: "Confirmando…",
    confirm: (total: number) => `Confirmar reserva — $${total}`,
    payment: {
      title: "¿Cómo funciona el pago?",
      before: "Después de confirmar tu reserva, te enviaremos un ",
      strong: "enlace de pago seguro",
      after:
        " a tu correo para que completes el pago con total tranquilidad. No se cobra nada ahora: tu reserva queda confirmada cuando pagues con ese enlace, y mientras tanto apartamos tu lugar.",
    },
    badges: {
      guaranteed: "Reserva garantizada",
      secure: "Enlace de pago seguro",
      ict: "Licencia ICT",
    },
    card: {
      continue: (total: number) => `Continuar al pago seguro — $${total}`,
      paymentTitle: "¿Cómo funciona el pago?",
      paymentBefore: "En el siguiente paso pagas con tarjeta en una ",
      paymentStrong: "página segura de BAC Credomatic (Powertranz)",
      paymentAfter:
        ", protegida con 3-D Secure. Tu reserva queda confirmada en cuanto se aprueba el pago y recibes tu voucher por correo al instante.",
      bankTitle: "Un aviso sobre tu banco",
      bankBody:
        "Algunos bancos bloquean el primer cobro en línea o internacional de una tarjeta. Si pasa, apruébalo en la app de tu banco o llámalos, y vuelve a intentar: tu lugar sigue apartado.",
      secureBadge: "Pago seguro con tarjeta",
      sidebarNote: "Paga con tarjeta de forma segura en el siguiente paso: tu reserva queda confirmada al instante.",
      stepTitle: "Pago",
      stepSub: (code: string) => `Reserva ${code} apartada — paga ahora para confirmarla`,
    },
    back: "Volver a los detalles del viaje",
    ict: { title: "Licencia ICT #4121-2025", sub: "Instituto Costarricense de Turismo" },
    total: (count: number) => `Total (${count} shuttle${count !== 1 ? "s" : ""})`,
    vat: "Incluye 13% de IVA",
    sidebarNote: "Confirma tu reserva — te enviaremos un enlace de pago seguro por correo.",
    includedTitle: "Qué incluye",
    included: INCLUDED_ES,
    importantTitle: "Información importante",
    important: IMPORTANT_ES,
    errors: {
      tooSoon: (date: string, from: string, to: string) =>
        `${date} es muy pronto para ${from} → ${to}. ${LEAD_TIME_MESSAGE_ES} Por favor edita ese viaje y elige una fecha posterior.`,
      failed: "No pudimos confirmar tu reserva.",
      failedRetry: "No pudimos confirmar tu reserva. Por favor intenta de nuevo.",
    },
  },
});

/** /private-shuttle/confirmation */
export const CONFIRMATION = defineCopy({
  en: {
    notFound: {
      title: "No booking found",
      body: "Please start a new booking from the routes page.",
      cta: "Find a route",
    },
    title: "Reservation received — payment pending",
    thanks: (name: string) => `Thank you, ${name} — your seat is held while you complete payment.`,
    codeLabel: "Booking code",
    payment: {
      title: "Not paid yet — your secure payment link is on the way",
      p1: "Your reservation is ",
      strong1: "received and held, but not confirmed yet",
      p2: " — nothing has been charged. We'll send a ",
      strong2: "secure payment link",
      p3: " to ",
      p4: " within a few minutes, in a separate email (check your spam folder too). Your booking is confirmed only once that payment is completed.",
      steps: ["Booking received", "Pay with the link", "Booking confirmed"],
      youAreHere: "You are here",
      noLink: "Haven't received the link within the hour? Message us on WhatsApp and we'll resend it to your email.",
    },
    shuttles: (count: number) => (count === 1 ? "Your Shuttle" : `Your ${count} Shuttles`),
    pax: paxEn,
    labels: {
      date: "Date:",
      vehicle: "Vehicle:",
      travelers: "Travelers:",
      flight: "Flight:",
      pickup: "Pickup:",
      dropoff: "Drop-off:",
      notes: "Notes:",
    },
    dateAt: (date: string, time: string) => `${date} at ${time}`,
    total: (count: number) => `Total (${count} shuttle${count !== 1 ? "s" : ""})`,
    vat: "13% VAT included",
    contact: { title: "Contact Information", name: "Name:", email: "Email:", phone: "Phone:" },
    badges: [
      { label: "100% Private", sub: "No shared shuttles" },
      { label: "Fully Insured", sub: "Complete coverage" },
      { label: "Licensed & Vetted", sub: "Certified drivers" },
      { label: "24/7 Support", sub: "Always available" },
    ],
    includedTitle: "What's Included",
    included: INCLUDED_EN,
    importantTitle: "Important Information",
    important: IMPORTANT_EN,
    whatsappText: (code: string, routes: string) =>
      `Hi! I just submitted booking ${code} (${routes}) and haven't received the payment link by email yet. Could you check, please?`,
    whatsappCta: "Haven't received it? Message us on WhatsApp",
    backHome: "Back to home",
    footer: "Free changes up to 48 hours before pickup. Contact us via WhatsApp or email.",
    /** Paid-by-card variant (Powertranz): the booking is final. */
    paid: {
      title: "Booking confirmed — paid",
      thanks: (name: string) => `Thank you, ${name}! Your payment went through and your shuttle is confirmed.`,
      paymentTitle: "Payment received — you're all set",
      p1: "We charged ",
      p2: " to your card via BAC Credomatic (Powertranz). Your receipt and voucher were emailed to ",
      p3: ". Nothing is paid at pickup.",
      steps: ["Booking received", "Payment received", "Booking confirmed"],
      whatsappText: (code: string, routes: string) =>
        `Hi! Booking ${code} (${routes}) is paid — I have a question about my pickup.`,
      whatsappCta: "Questions? Message us on WhatsApp",
    },
  },
  es: {
    notFound: {
      title: "No encontramos ninguna reserva",
      body: "Por favor inicia una nueva reserva desde la página de rutas.",
      cta: "Buscar una ruta",
    },
    title: "Reserva recibida: pago pendiente",
    thanks: (name: string) => `¡Gracias, ${name}! Tu lugar queda apartado mientras completas el pago.`,
    codeLabel: "Código de reserva",
    payment: {
      title: "Aún no has pagado: tu enlace de pago seguro va en camino",
      p1: "Tu reserva está ",
      strong1: "recibida y apartada, pero todavía no está confirmada",
      p2: ": no se ha cobrado nada. Te enviaremos un ",
      strong2: "enlace de pago seguro",
      p3: " a ",
      p4: " en unos minutos, en un correo aparte (revisa también la carpeta de spam). Tu reserva queda confirmada solo cuando ese pago se complete.",
      steps: ["Reserva recibida", "Pagar con el enlace", "Reserva confirmada"],
      youAreHere: "Estás aquí",
      noLink: "¿No te llegó el enlace en una hora? Escríbenos por WhatsApp y te lo reenviamos al correo.",
    },
    shuttles: (count: number) => (count === 1 ? "Tu shuttle" : `Tus ${count} shuttles`),
    pax: paxEs,
    labels: {
      date: "Fecha:",
      vehicle: "Vehículo:",
      travelers: "Pasajeros:",
      flight: "Vuelo:",
      pickup: "Recogida:",
      dropoff: "Llegada:",
      notes: "Notas:",
    },
    // "a la 1:00 p. m." but "a las 2:30 p. m."
    dateAt: (date: string, time: string) =>
      `${date} ${time.startsWith("1:") ? "a la" : "a las"} ${time}`,
    total: (count: number) => `Total (${count} shuttle${count !== 1 ? "s" : ""})`,
    vat: "Incluye 13% de IVA",
    contact: { title: "Datos de contacto", name: "Nombre:", email: "Correo:", phone: "Teléfono:" },
    badges: [
      { label: "100% privado", sub: "Sin shuttles compartidos" },
      { label: "Totalmente asegurado", sub: "Cobertura completa" },
      { label: "Con licencia y verificado", sub: "Choferes certificados" },
      { label: "Soporte 24/7", sub: "Siempre disponibles" },
    ],
    includedTitle: "Qué incluye",
    included: INCLUDED_ES,
    importantTitle: "Información importante",
    important: IMPORTANT_ES,
    whatsappText: (code: string, routes: string) =>
      `¡Hola! Acabo de enviar la reserva ${code} (${routes}) y todavía no me llega el enlace de pago al correo. ¿Me lo pueden revisar, por favor?`,
    whatsappCta: "¿No te llegó? Escríbenos por WhatsApp",
    backHome: "Volver al inicio",
    footer: "Cambios gratis hasta 48 horas antes de la recogida. Contáctanos por WhatsApp o correo.",
    paid: {
      title: "Reserva confirmada: pagada",
      thanks: (name: string) => `¡Gracias, ${name}! Tu pago se procesó y tu shuttle queda confirmado.`,
      paymentTitle: "Pago recibido: todo listo",
      p1: "Cobramos ",
      p2: " a tu tarjeta a través de BAC Credomatic (Powertranz). Tu recibo y voucher van en camino a ",
      p3: ". No se paga nada en la recogida.",
      steps: ["Reserva recibida", "Pago recibido", "Reserva confirmada"],
      whatsappText: (code: string, routes: string) =>
        `¡Hola! La reserva ${code} (${routes}) ya está pagada; tengo una consulta sobre mi recogida.`,
      whatsappCta: "¿Dudas? Escríbenos por WhatsApp",
    },
  },
});
