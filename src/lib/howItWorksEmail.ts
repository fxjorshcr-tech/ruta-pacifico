import type { TripItem } from "@/lib/booking";
import { sendEmail, escapeHtml, EMAIL_FONT_STACK, EMAIL_FONT_LINK } from "@/lib/email";
import { INTL_LOCALE, type Locale } from "@/lib/i18n";
import type { BookingEmailInput } from "@/lib/bookingEmails";
import { customerLocale } from "@/lib/bookingEmails";

/**
 * "Your trip, step by step": the follow-up the customer gets ~20 minutes after
 * the booking email. Who is looking after them, where the driver waits (LIR /
 * SJO / hotel), what is included, when the driver's details arrive, how to
 * change the pickup time and the cancellation rules. Customer copy only,
 * scheduled through Resend (no cron).
 */

export const HOW_IT_WORKS_DELAY = "in 20 min";

const WHATSAPP_DISPLAY = "+506 7080-5578";
const WHATSAPP_RAW = "50670805578";
const RESERVATIONS_EMAIL = "reservations@rutapacifico.com";
const SITE_URL = "https://rutapacifico.com";
const PHOTO = "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/aeropuerto-LIR-guanacaste.webp";
const ORANGE = "#e36414";
const DARK = "#1a1a1a";

type LegKind = "arrival_lir" | "arrival_sjo" | "departure" | "hotel";

function airportOf(place: string): "LIR" | "SJO" | null {
  const p = place.toUpperCase();
  if (p.includes("LIR") || p.includes("LIBERIA INT")) return "LIR";
  if (p.includes("SJO") || p.includes("JUAN SANTAMAR")) return "SJO";
  if (p.includes("AIRPORT") || p.includes("AEROPUERTO")) return "LIR";
  return null;
}

export function legKind(trip: Pick<TripItem, "from" | "to" | "isAirportPickup">): LegKind {
  const from = airportOf(trip.from);
  if (from === "LIR" || (trip.isAirportPickup && from !== "SJO")) return "arrival_lir";
  if (from === "SJO") return "arrival_sjo";
  if (airportOf(trip.to)) return "departure";
  return "hotel";
}

function fmtDate(iso: string, locale: Locale): string {
  try {
    return new Date(iso + "T00:00:00").toLocaleDateString(INTL_LOCALE[locale], { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  } catch {
    return iso;
  }
}

function fmtTime(hhmm: string, locale: Locale): string {
  const [h, m] = hhmm.split(":").map(Number);
  if (Number.isNaN(h)) return hhmm;
  const d = new Date();
  d.setHours(h, m ?? 0, 0, 0);
  return d.toLocaleTimeString(INTL_LOCALE[locale], { hour: "numeric", minute: "2-digit", hour12: true });
}

const COPY = {
  en: {
    subject: (code: string) => `Your trip, step by step · ${code}`,
    preheader: "Who is looking after you, where to find your driver, what is included and how to make changes.",
    title: "Your trip, step by step",
    subtitle: "Everything you need to know before the day. Save this email.",
    hello: (name: string) => `¡Pura vida, ${name}!`,
    intro: (code: string) => `Here is how your private shuttle with Ruta Pacifico works, so there are no surprises on the day. Your booking code is <strong>${code}</strong>.`,
    teamTitle: "Our operations team is on it",
    teamBody: `From now until you step out of the van, our team is looking after your trip. One contact for everything: <strong>WhatsApp ${WHATSAPP_DISPLAY}</strong>, always available, or ${RESERVATIONS_EMAIL}.`,
    teamWhy: "For safety we don't share the driver's personal number: drivers don't take calls while driving. Message the company WhatsApp and we relay anything to your driver in seconds.",
    legsTitle: (n: number) => (n > 1 ? `Your ${n} shuttles` : "Your shuttle"),
    legN: (n: number) => `Shuttle ${n}`,
    duration: (d: string) => `Drive time: about ${d}`,
    flight: "Flight",
    pax: (a: number, c: number) => `${a} adult${a !== 1 ? "s" : ""}${c > 0 ? `, ${c} child${c !== 1 ? "ren" : ""}` : ""}`,
    arrivalLirTitle: "Arriving at Liberia (LIR)",
    arrivalLirSteps: [
      "Pick up your luggage and clear customs.",
      "Walk straight on towards the <strong>main exit</strong> of the terminal.",
      "Right there your driver is waiting with a <strong>sign with your name</strong>.",
    ],
    arrivalSjoTitle: "Arriving at San José (SJO)",
    arrivalSjoSteps: [
      "Go through immigration and pick up your luggage.",
      "Walk out through the main exit doors of the terminal.",
      "Right outside, your driver is waiting with a <strong>sign with your name</strong>.",
    ],
    flightTracking: "We track your flight in real time. If it lands late, your pickup moves with it at no charge, and your driver waits. Take your time at immigration.",
    cantFind: `Can’t see your driver? Don’t accept other offers; message us on WhatsApp ${WHATSAPP_DISPLAY} and we guide you to the van.`,
    departureTitle: "Heading to the airport",
    departureBody: (time: string, duration: string | null) =>
      `Your driver meets you at ${time} at your pickup point${duration ? `; the drive takes about ${duration}` : ""}. For international flights we recommend being at the airport <strong>3 hours before departure</strong>. If your flight time is different from what you had in mind, tell us and we adjust the pickup.`,
    hotelTitle: "Door to door",
    hotelBody: (time: string) => `Your driver meets you at ${time} at the reception or at the address you gave us, and takes you straight to your destination. Please be ready <strong>10 minutes before</strong>.`,
    addrPickup: "Pickup",
    addrDropoff: "Drop-off",
    includedTitle: "What’s included",
    includedNote: "Everything listed in your booking confirmation is included exactly as booked. On every trip you also have:",
    noted: "Noted for this trip",
    included: [
      "A private van just for your group, with a bilingual professional driver.",
      "Air conditioning, WiFi and bottled water on board.",
      "One complimentary 15-minute stop to stretch, use the restroom or take a photo. Any longer stop listed in your booking is included as booked.",
      "Luggage: 1 large suitcase + 1 carry-on per person. Surfboards or extra bags? Tell us in advance.",
      "Child seats and boosters free of charge. The ones in your booking are already reserved; tell us if you need another.",
      "Flight tracking on every airport pickup. No surcharge for night or holiday pickups.",
    ],
    driverTitle: "Your driver’s details",
    driverBody: "A few hours before pickup we send you the <strong>driver’s name, the type of vehicle and the licence plate</strong>, by email and WhatsApp, so you know exactly who is coming for you.",
    changesTitle: "Want to move the pickup time?",
    changesBody: "Earlier or later is usually possible. Write to us on WhatsApp with your booking code; changes are free up to 48 hours before pickup, and after that we still do our best.",
    cancelTitle: "Cancellations",
    cancelBody: "Cancel 48 hours or more before pickup and we refund the full amount minus 13% (tax and card processing). Within 48 hours, and no-shows after 30 minutes at the pickup point, are non-refundable.",
    contactTitle: "We are one message away",
    whatsappCta: "Message us on WhatsApp",
    whatsappText: (code: string) => `Hi! I have a question about my booking ${code}.`,
    footer: "Ruta Pacifico · Private shuttles in Guanacaste · ICT licence #4121-2025",
  },
  es: {
    subject: (code: string) => `Tu viaje, paso a paso · ${code}`,
    preheader: "Quién te acompaña, dónde encontrar a tu conductor, qué incluye y cómo hacer cambios.",
    title: "Tu viaje, paso a paso",
    subtitle: "Todo lo que necesitas saber antes del día. Guarda este correo.",
    hello: (name: string) => `¡Pura vida, ${name}!`,
    intro: (code: string) => `Así funciona tu shuttle privado con Ruta Pacifico, para que no haya sorpresas el día del viaje. Tu código de reserva es <strong>${code}</strong>.`,
    teamTitle: "Nuestro equipo de operaciones está pendiente",
    teamBody: `Desde ahora y hasta que te bajes de la van, nuestro equipo cuida tu viaje. Un solo contacto para todo: <strong>WhatsApp ${WHATSAPP_DISPLAY}</strong>, siempre disponible, o ${RESERVATIONS_EMAIL}.`,
    teamWhy: "Por seguridad no compartimos el número personal del conductor: los conductores no atienden llamadas mientras manejan. Escribe al WhatsApp de la empresa y le pasamos cualquier mensaje a tu conductor en segundos.",
    legsTitle: (n: number) => (n > 1 ? `Tus ${n} shuttles` : "Tu shuttle"),
    legN: (n: number) => `Shuttle ${n}`,
    duration: (d: string) => `Duración aproximada: ${d}`,
    flight: "Vuelo",
    pax: (a: number, c: number) => `${a} adulto${a !== 1 ? "s" : ""}${c > 0 ? `, ${c} niño${c !== 1 ? "s" : ""}` : ""}`,
    arrivalLirTitle: "Llegada a Liberia (LIR)",
    arrivalLirSteps: [
      "Recoge tu equipaje y pasa aduanas.",
      "Sigue de frente hacia la <strong>salida principal</strong> de la terminal.",
      "Ahí mismo te espera tu conductor con un <strong>rótulo con tu nombre</strong>.",
    ],
    arrivalSjoTitle: "Llegada a San José (SJO)",
    arrivalSjoSteps: [
      "Pasa migración y recoge tu equipaje.",
      "Sal por las puertas principales de la terminal.",
      "Justo afuera te espera tu conductor con un <strong>rótulo con tu nombre</strong>.",
    ],
    flightTracking: "Seguimos tu vuelo en tiempo real. Si aterriza tarde, la recogida se mueve con él sin costo y tu conductor te espera. Tómate tu tiempo en migración.",
    cantFind: `¿No ves a tu conductor? No aceptes otras ofertas; escríbenos al WhatsApp ${WHATSAPP_DISPLAY} y te guiamos hasta la van.`,
    departureTitle: "Rumbo al aeropuerto",
    departureBody: (time: string, duration: string | null) =>
      `Tu conductor te recoge a las ${time} en tu punto de salida${duration ? `; el trayecto dura aproximadamente ${duration}` : ""}. Para vuelos internacionales recomendamos estar en el aeropuerto <strong>3 horas antes</strong>. Si la hora de tu vuelo es distinta de la que tenías en mente, avísanos y ajustamos la recogida.`,
    hotelTitle: "Puerta a puerta",
    hotelBody: (time: string) => `Tu conductor te recoge a las ${time} en la recepción o en la dirección que nos diste, y te lleva directo a tu destino. Por favor está listo <strong>10 minutos antes</strong>.`,
    addrPickup: "Recogida",
    addrDropoff: "Destino",
    includedTitle: "Qué incluye",
    includedNote: "Todo lo que figura en la confirmación de tu reserva va incluido tal como lo reservaste. En todos los viajes tienes además:",
    noted: "Anotado para este viaje",
    included: [
      "Una van privada solo para tu grupo, con conductor profesional bilingüe.",
      "Aire acondicionado, WiFi y agua embotellada a bordo.",
      "Una parada de cortesía de 15 minutos para estirar las piernas, ir al baño o tomar una foto. Cualquier parada más larga que figure en tu reserva va incluida tal como la reservaste.",
      "Equipaje: 1 maleta grande + 1 de mano por persona. ¿Tablas de surf o maletas extra? Avísanos con tiempo.",
      "Sillas para niños y boosters gratis. Las de tu reserva ya están apartadas; dinos si necesitas otra.",
      "Seguimiento de vuelo en todas las recogidas de aeropuerto. Sin recargo nocturno ni por feriados.",
    ],
    driverTitle: "Los datos de tu conductor",
    driverBody: "Unas horas antes de la recogida te enviamos el <strong>nombre del conductor, el tipo de vehículo y el número de placa</strong>, por correo y WhatsApp, para que sepas exactamente quién llega por ti.",
    changesTitle: "¿Quieres adelantar o atrasar la hora?",
    changesBody: "Casi siempre es posible. Escríbenos por WhatsApp con tu código de reserva; los cambios son gratis hasta 48 horas antes de la recogida, y después igual hacemos lo posible.",
    cancelTitle: "Cancelaciones",
    cancelBody: "Si cancelas 48 horas o más antes de la recogida, reembolsamos el monto completo menos un 13% (impuestos y procesamiento de tarjeta). Dentro de las 48 horas, y si nadie se presenta 30 minutos después de la hora en el punto de recogida, no hay reembolso.",
    contactTitle: "Estamos a un mensaje",
    whatsappCta: "Escríbenos por WhatsApp",
    whatsappText: (code: string) => `¡Hola! Tengo una consulta sobre mi reserva ${code}.`,
    footer: "Ruta Pacifico · Shuttles privados en Guanacaste · Licencia ICT #4121-2025",
  },
} as const;

type Copy = (typeof COPY)["en"] | (typeof COPY)["es"];

function steps(items: readonly string[]): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin-top:10px;">${items
    .map(
      (s, i) => `
      <tr>
        <td style="width:28px;vertical-align:top;padding:4px 0;"><span style="display:inline-block;width:22px;height:22px;line-height:22px;border-radius:50%;background:${ORANGE};color:#fff;font-size:12px;font-weight:700;text-align:center;">${i + 1}</span></td>
        <td style="padding:4px 0;font-size:14px;color:#333;line-height:1.5;">${s}</td>
      </tr>`,
    )
    .join("")}</table>`;
}

function section(title: string, body: string): string {
  return `
    <tr><td style="padding:0 28px 22px;">
      <h2 style="margin:0 0 8px;font-size:17px;color:${DARK};">${title}</h2>
      <div style="font-size:14px;color:#444;line-height:1.6;">${body}</div>
    </td></tr>`;
}

function legCard(trip: TripItem, index: number, total: number, t: Copy, locale: Locale): string {
  const kind = legKind(trip);
  const time = fmtTime(trip.time, locale);
  const duration = trip.duracion ? trip.duracion.replace(/\s*h$/i, " h") : null;
  let how = "";
  if (kind === "arrival_lir" || kind === "arrival_sjo") {
    how = `
      <p style="margin:12px 0 0;font-weight:700;color:${DARK};">✈️ ${kind === "arrival_lir" ? t.arrivalLirTitle : t.arrivalSjoTitle}</p>
      ${steps(kind === "arrival_lir" ? t.arrivalLirSteps : t.arrivalSjoSteps)}
      <p style="margin:10px 0 0;font-size:13px;color:#444;">${t.flightTracking}</p>
      <p style="margin:8px 0 0;font-size:13px;color:#92400e;background:#fef3c7;border-radius:8px;padding:8px 10px;">${t.cantFind}</p>`;
  } else if (kind === "departure") {
    how = `
      <p style="margin:12px 0 0;font-weight:700;color:${DARK};">🛫 ${t.departureTitle}</p>
      <p style="margin:6px 0 0;font-size:14px;color:#444;">${t.departureBody(time, duration)}</p>`;
  } else {
    how = `
      <p style="margin:12px 0 0;font-weight:700;color:${DARK};">🚐 ${t.hotelTitle}</p>
      <p style="margin:6px 0 0;font-size:14px;color:#444;">${t.hotelBody(time)}</p>`;
  }
  return `
    <div style="border:1px solid #ececec;border-left:4px solid ${ORANGE};border-radius:14px;padding:16px 18px;margin-bottom:14px;background:#fff;">
      ${total > 1 ? `<div style="font-size:11px;font-weight:700;letter-spacing:1px;color:${ORANGE};text-transform:uppercase;">${t.legN(index + 1)}</div>` : ""}
      <div style="font-size:16px;font-weight:700;color:${DARK};margin-top:2px;">${escapeHtml(trip.from)} → ${escapeHtml(trip.to)}</div>
      <div style="font-size:13px;color:#888;margin-top:4px;">${escapeHtml(fmtDate(trip.date, locale))} · ${escapeHtml(time)} · ${t.pax(trip.adults, trip.children)}${duration ? ` · ${t.duration(escapeHtml(duration))}` : ""}</div>
      ${trip.flight ? `<div style="font-size:13px;color:#888;margin-top:2px;">${t.flight}: ${escapeHtml(trip.flight)}</div>` : ""}
      ${trip.notes ? `<div style="font-size:13px;color:#222;margin-top:8px;padding:8px 10px;background:#fff7ed;border-radius:8px;"><strong>${t.noted}:</strong> ${escapeHtml(trip.notes)}</div>` : ""}
      ${how}
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin-top:12px;font-size:13px;">
        <tr><td style="color:#888;padding:2px 10px 2px 0;white-space:nowrap;">${t.addrPickup}:</td><td style="color:#222;">${escapeHtml(trip.pickup)}</td></tr>
        <tr><td style="color:#888;padding:2px 10px 2px 0;white-space:nowrap;">${t.addrDropoff}:</td><td style="color:#222;">${escapeHtml(trip.dropoff)}</td></tr>
      </table>
    </div>`;
}

export function renderHowItWorksHtml(b: BookingEmailInput): { subject: string; html: string; locale: Locale } {
  const locale = customerLocale(b);
  const t: Copy = COPY[locale];
  const firstName = b.name.trim().split(/\s+/)[0] || b.name;
  const wa = `https://wa.me/${WHATSAPP_RAW}?text=${encodeURIComponent(t.whatsappText(b.confirmationCode))}`;
  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${EMAIL_FONT_LINK}<title>${t.title}</title></head>
<body style="margin:0;padding:0;background:#f6f3ee;font-family:${EMAIL_FONT_STACK};">
  <div style="display:none;max-height:0;overflow:hidden;color:#f6f3ee;">${t.preheader}</div>
  <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background:#f6f3ee;"><tr><td align="center" style="padding:20px 10px;">
  <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 4px 14px rgba(0,0,0,.06);">
    <tr><td style="background:linear-gradient(135deg,#c2410c 0%,${ORANGE} 60%,#f59e0b 100%);padding:30px 28px;text-align:center;">
      <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.8);">Ruta Pacifico</div>
      <h1 style="margin:8px 0 6px;font-size:26px;color:#fff;">${t.title}</h1>
      <p style="margin:0;color:rgba(255,255,255,.92);font-size:14px;">${t.subtitle}</p>
    </td></tr>
    <tr><td style="padding:0;"><img src="${PHOTO}" alt="" width="600" style="display:block;width:100%;height:auto;max-height:220px;object-fit:cover;"></td></tr>
    <tr><td style="padding:26px 28px 10px;font-size:15px;color:${DARK};line-height:1.6;">
      <p style="margin:0 0 8px;font-weight:700;">${t.hello(escapeHtml(firstName))}</p>
      <p style="margin:0;color:#444;">${t.intro(escapeHtml(b.confirmationCode))}</p>
    </td></tr>
    ${section(`🧭 ${t.teamTitle}`, `<p style="margin:0 0 8px;">${t.teamBody}</p><p style="margin:0;font-size:13px;color:#777;">${t.teamWhy}</p>`)}
    ${section(`📍 ${t.legsTitle(b.trips.length)}`, b.trips.map((tr, i) => legCard(tr, i, b.trips.length, t, locale)).join(""))}
    ${section(`✅ ${t.includedTitle}`, `<p style="margin:0 0 8px;">${t.includedNote}</p><ul style="margin:0;padding-left:18px;">${t.included.map((i) => `<li style="margin:0 0 6px;">${i}</li>`).join("")}</ul>`)}
    ${section(`🪪 ${t.driverTitle}`, `<p style="margin:0;">${t.driverBody}</p>`)}
    ${section(`🕒 ${t.changesTitle}`, `<p style="margin:0 0 10px;">${t.changesBody}</p><p style="margin:0;font-size:13px;color:#777;"><strong style="color:#444;">${t.cancelTitle}:</strong> ${t.cancelBody}</p>`)}
    <tr><td style="padding:4px 28px 30px;text-align:center;">
      <h2 style="margin:0 0 12px;font-size:17px;color:${DARK};">💬 ${t.contactTitle}</h2>
      <a href="${wa}" style="display:inline-block;background:#22c55e;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 22px;border-radius:999px;">${t.whatsappCta} · ${WHATSAPP_DISPLAY}</a>
      <p style="margin:12px 0 0;font-size:13px;color:#777;"><a href="mailto:${RESERVATIONS_EMAIL}" style="color:${ORANGE};text-decoration:none;">${RESERVATIONS_EMAIL}</a> · <a href="${SITE_URL}" style="color:${ORANGE};text-decoration:none;">rutapacifico.com</a></p>
    </td></tr>
  </table>
  <p style="margin:16px 0 0;font-size:12px;color:#9a9a9a;">${t.footer}</p>
  </td></tr></table>
</body></html>`;
  return { subject: t.subject(b.confirmationCode), html, locale };
}

/** Queue the follow-up ~20 minutes after the booking email. Never throws. */
export async function scheduleHowItWorksEmail(b: BookingEmailInput, scheduledAt: string = HOW_IT_WORKS_DELAY): Promise<boolean> {
  if (!b.email || b.trips.length === 0) return false;
  try {
    const { subject, html } = renderHowItWorksHtml(b);
    const r = await sendEmail({ to: b.email, subject, html, scheduledAt });
    if (!r.ok) console.error("[Email] How-it-works schedule failed:", r.error);
    return r.ok;
  } catch (err) {
    console.error("[Email] How-it-works schedule threw:", err);
    return false;
  }
}
