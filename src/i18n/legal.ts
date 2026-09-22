import { defineCopy } from "@/lib/i18n";
import { ICT_LICENSE_NUMBER, RESERVATIONS_EMAIL, WHATSAPP_DISPLAY } from "@/lib/contact";

/**
 * Terms & Conditions, Privacy Policy and Refund Policy
 * (src/app/[lang]/{terms-and-conditions,privacy-policy,refund-policy}).
 *
 * The three documents share one shape so a single LegalPage component
 * renders them. Facts that also appear elsewhere on the site (48-hour
 * cancellation window, 13 % non-refundable share, 30-minute no-show,
 * contact channels) must stay in step with src/i18n/faq.ts, the live FAQ
 * rows and src/lib/llms.ts.
 */

export interface LegalSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface LegalDoc {
  metaTitle: string;
  metaDescription: string;
  title: string;
  updatedLabel: string;
  /** ISO date of the last substantive change. */
  updated: string;
  intro?: string;
  sections: LegalSection[];
}

export interface LegalCopy {
  terms: LegalDoc;
  privacy: LegalDoc;
  refund: LegalDoc;
  help: {
    heading: string;
    body: string;
    whatsapp: string;
    email: string;
    backHome: string;
  };
}

const UPDATED = "2026-09-22";
const CONTACT_EN = `${RESERVATIONS_EMAIL} or WhatsApp ${WHATSAPP_DISPLAY}`;
const CONTACT_ES = `${RESERVATIONS_EMAIL} o WhatsApp ${WHATSAPP_DISPLAY}`;

export const LEGAL = defineCopy<LegalCopy>({
  en: {
    help: {
      heading: "Questions about these policies?",
      body: "Write to us and a real person answers, usually within the hour during the day.",
      whatsapp: "WhatsApp us",
      email: "Email us",
      backHome: "Back to home",
    },
    terms: {
      metaTitle: "Terms & Conditions",
      metaDescription:
        "Terms and conditions for booking a private shuttle with Ruta Pacifico: bookings, payment, cancellations, changes, liability and customer conduct.",
      title: "Terms & Conditions",
      updatedLabel: "Last updated",
      updated: UPDATED,
      intro:
        "Ruta Pacifico (\"we\", \"us\", \"our\") provides private shuttle transfers in Guanacaste and across Costa Rica. By booking a transfer through rutapacifico.com (the \"Site\"), by WhatsApp or by email, you agree to the terms below. Please read them before you book.",
      sections: [
        {
          heading: "1. Who we are",
          paragraphs: [
            `Ruta Pacifico is a Costa Rican tourism transport operator licensed by the Costa Rican Tourism Board (ICT licence #${ICT_LICENSE_NUMBER}), based in Liberia, Guanacaste. You can reach us at ${CONTACT_EN}.`,
          ],
        },
        {
          heading: "2. Services",
          paragraphs: [
            "We provide private, door-to-door shuttle transfers from Liberia International Airport (LIR), San José International Airport (SJO), and between beaches, towns and destinations in Costa Rica. Every transfer is for your group only. Vehicles are driven by licensed drivers and insured as Costa Rican law requires.",
          ],
        },
        {
          heading: "3. Bookings and confirmation",
          bullets: [
            "When you book online you receive a reservation email with a confirmation code. Shortly afterwards we send a secure payment link. The booking is final once payment has been received.",
            "Prices are quoted in United States dollars, per vehicle, and include Costa Rica's 13 % VAT, tolls, fuel, the driver, flight tracking and child seats. There is no per-person charge and no surcharge for night, holiday or airport pickups.",
            "You are responsible for giving us accurate pickup details: address or hotel, flight number, date and time, and the number of passengers and bags. Delays or missed pickups caused by incorrect details may lead to additional charges or loss of the service.",
          ],
        },
        {
          heading: "4. Payment",
          paragraphs: [
            "Payment is by credit or debit card through a secure payment link processed by our card payment provider. Card details are entered on the provider's own PCI-compliant page; we never see or store full card numbers. By paying you authorise us to charge the total shown, in United States dollars.",
          ],
        },
        {
          heading: "5. Cancellations and refunds",
          paragraphs: [
            "Full details are in our Refund Policy. In short: cancellations made at least 48 hours before the scheduled pickup are refunded in full minus a non-refundable 13 % that covers VAT and payment processing. Cancellations made less than 48 hours before pickup, no-shows and unused services are not refundable.",
          ],
        },
        {
          heading: "6. Changes requested by you",
          paragraphs: [
            `Changes to the date, time or pickup location are subject to availability and should be requested by email or WhatsApp at least 24 hours before pickup. We do our best to accommodate later requests but cannot guarantee them. Requests within 24 hours should also be sent by WhatsApp to ${WHATSAPP_DISPLAY} so we see them in time.`,
          ],
        },
        {
          heading: "7. Flight delays",
          paragraphs: [
            "We track every arriving flight and adjust the pickup to the actual landing time at no charge. If your flight is cancelled or rerouted, contact us as soon as you know and we will rebook the transfer for the new arrival wherever we can.",
          ],
        },
        {
          heading: "8. Changes or cancellation by us",
          paragraphs: [
            "In rare cases such as a vehicle breakdown, a road closure, a natural event or other circumstances beyond our control, we may need to reschedule or cancel a transfer. If we cancel, you receive a full refund or, if you prefer, a replacement service of equal value.",
          ],
        },
        {
          heading: "9. Liability",
          paragraphs: [
            "Our liability is limited to the amount paid for the transfer in question. We are not responsible for missed flights or connections, or for losses caused by traffic, weather, road conditions or events outside our reasonable control. We recommend that every traveller carries personal travel insurance.",
          ],
        },
        {
          heading: "10. Conduct in the vehicle",
          paragraphs: [
            "Smoking, illegal substances and behaviour that puts the driver or other passengers at risk are not permitted. The driver may refuse or end the service if a passenger's conduct compromises safety, and no refund is issued in that case.",
          ],
        },
        {
          heading: "11. Children and child seats",
          paragraphs: [
            "Costa Rican law requires an appropriate restraint for every minor. Child seats and boosters are included at no charge; tell us the age of each child when you book so the right seat is installed before pickup.",
          ],
        },
        {
          heading: "12. Luggage",
          paragraphs: [
            "Each vehicle has a stated luggage capacity. If you are travelling with more bags, surfboards or oversized items than usual, let us know when you book so we can assign a suitable vehicle. Luggage that cannot be carried safely in the assigned vehicle may not be transported.",
          ],
        },
        {
          heading: "13. Governing law",
          paragraphs: [
            "These terms are governed by the laws of the Republic of Costa Rica. Any dispute will be resolved before the competent courts of Costa Rica.",
          ],
        },
        {
          heading: "14. Contact",
          paragraphs: [`Questions about these terms can be sent to ${CONTACT_EN}.`],
        },
      ],
    },
    privacy: {
      metaTitle: "Privacy Policy",
      metaDescription:
        "How Ruta Pacifico collects, uses and protects the personal data of travellers who book a private shuttle, and the rights you have under Costa Rican Law 8968.",
      title: "Privacy Policy",
      updatedLabel: "Last updated",
      updated: UPDATED,
      intro:
        "Ruta Pacifico respects the privacy of everyone who visits rutapacifico.com (the \"Site\") or books a transfer with us. This policy explains what personal data we collect, why, how we protect it, and the rights you have under Costa Rica's Personal Data Protection Law (Law 8968).",
      sections: [
        {
          heading: "1. Data controller",
          paragraphs: [
            `Ruta Pacifico, ICT licence #${ICT_LICENSE_NUMBER}, Liberia, Guanacaste, Costa Rica. Contact: ${CONTACT_EN}. We are responsible for handling your personal data in line with Law 8968 and its regulations.`,
          ],
        },
        {
          heading: "2. What we collect",
          bullets: [
            "Booking details: first and last name, email address, phone number, pickup and drop-off addresses or hotels, flight number, dates and times, number of passengers, children's ages and any special requests.",
            "Payment details are handled by our card payment provider on its own secure page. We do not store full card numbers, CVV codes or expiry dates. We keep only the transaction reference and approval code for accounting and dispute purposes.",
            "Technical data: IP address, browser, device type, pages visited and approximate location, collected through cookies and analytics tools.",
            "Communications: the messages you send us by email, WhatsApp or the contact form.",
          ],
        },
        {
          heading: "3. Why we use your data",
          bullets: [
            "To confirm, operate and invoice your transfer, including sharing your name and pickup details with the assigned driver.",
            "To register your driver and vehicle with gated resorts and communities that require it before arrival.",
            "To send you the reservation email, the payment link, pickup reminders and messages after the trip.",
            "To meet our tax, accounting and ICT regulatory obligations.",
            "To prevent fraud and abuse, and to improve the Site and our service.",
            "Only with your consent: to send occasional offers and travel tips. You can withdraw that consent at any time.",
          ],
        },
        {
          heading: "4. Who has access",
          paragraphs: [
            "Your data is shared only with the providers we need to deliver the service: our card payment provider, the email service (Resend), the reservation database (Supabase), web analytics (Google), the driver assigned to your transfer, and the resort or gated community that asks for the driver's details before you arrive. We do not sell personal data.",
          ],
        },
        {
          heading: "5. International transfers",
          paragraphs: [
            "Some of these providers store data on servers outside Costa Rica. We work only with providers whose security standards are comparable to those required by Law 8968, including encryption in transit and at rest and restricted access.",
          ],
        },
        {
          heading: "6. How long we keep it",
          paragraphs: [
            "Booking and accounting records are kept for the period required by Costa Rican tax law. Marketing data is kept until you withdraw consent. Technical logs are kept for up to twelve months.",
          ],
        },
        {
          heading: "7. Your rights",
          paragraphs: [
            `Under Law 8968 you can ask at any time to access, correct, delete or object to the processing of your personal data, and you can withdraw consent for marketing. Write to ${RESERVATIONS_EMAIL} and we will answer within the legal deadline.`,
          ],
        },
        {
          heading: "8. Cookies",
          paragraphs: [
            "The Site uses functional cookies to keep your booking in progress and analytics cookies (Google Analytics) to understand how visitors use it. You can disable cookies in your browser; some parts of the booking flow may then not work fully.",
          ],
        },
        {
          heading: "9. Security",
          paragraphs: [
            "The Site is served over HTTPS, the database is encrypted, service keys have restricted access and card payments are taken on PCI-compliant pages. No system is completely immune to attack, but we apply the safeguards the industry considers standard.",
          ],
        },
        {
          heading: "10. Children",
          paragraphs: [
            "The Site is not directed at children under 13, and we do not knowingly collect data from minors except the age we need to install the right child seat, which is given by the adult who books.",
          ],
        },
        {
          heading: "11. Changes to this policy",
          paragraphs: [
            "We may update this policy from time to time. The date at the top always shows the current version, and material changes are announced by email where appropriate.",
          ],
        },
      ],
    },
    refund: {
      metaTitle: "Refund Policy",
      metaDescription:
        "Ruta Pacifico's cancellation and refund policy for private shuttles: the 48-hour rule, no-shows, changes, refund timing and what happens when we cancel.",
      title: "Refund Policy",
      updatedLabel: "Last updated",
      updated: UPDATED,
      intro:
        "This policy applies to every private shuttle transfer booked through rutapacifico.com, by WhatsApp or by email. By paying for a transfer you accept the terms below.",
      sections: [
        {
          heading: "1. Cancellation by you",
          bullets: [
            "More than 48 hours before pickup: we refund the full amount paid minus a non-refundable 13 %. That share covers Costa Rica's VAT and the card processing fees, which are not returned to us by the payment provider.",
            "Less than 48 hours before pickup: no refund. By then the vehicle, driver and route have been reserved for you and cannot be reassigned.",
            "No-show: if nobody is at the pickup point within 30 minutes of the scheduled time and we cannot reach you by phone, WhatsApp or email, the transfer is treated as completed and is not refundable.",
          ],
        },
        {
          heading: "2. How to cancel",
          paragraphs: [
            `Send your cancellation in writing to ${RESERVATIONS_EMAIL} or by WhatsApp to ${WHATSAPP_DISPLAY}, quoting your confirmation code. The cancellation takes effect on the date and time we receive it.`,
          ],
        },
        {
          heading: "3. How refunds are paid",
          paragraphs: [
            "Approved refunds go back to the card used for payment. We start the refund as soon as it is approved, normally within 24 hours, and send you an email confirmation. The money usually appears on your statement within 5 to 10 business days, depending on your bank.",
          ],
        },
        {
          heading: "4. Changes instead of cancellation",
          paragraphs: [
            "If you need a different date, time or pickup point rather than a cancellation, write to us. Changes requested at least 24 hours before pickup are free, subject to availability. Within 24 hours we do what we can, but a change is not guaranteed.",
          ],
        },
        {
          heading: "5. Flight delays and cancellations",
          paragraphs: [
            "A delayed flight never costs you anything: we track it and the driver adjusts. If your flight is cancelled, tell us as soon as you know and we will move the transfer to your new arrival. If no new date works, the cancellation rules above apply from the time we receive your message.",
          ],
        },
        {
          heading: "6. Cancellation by us",
          paragraphs: [
            "If we cancel a transfer for a reason on our side, such as a vehicle problem or a scheduling error, you receive a full refund within 5 business days or, if you prefer, a replacement service of equal value.",
          ],
        },
        {
          heading: "7. Events beyond anyone's control",
          paragraphs: [
            "If a transfer cannot be operated because of a natural event, a road closure or a government restriction, we will reschedule it with you at no extra cost. If rescheduling is not possible, we refund the amount paid minus any costs we have already incurred and cannot recover.",
          ],
        },
        {
          heading: "8. Disputes and chargebacks",
          paragraphs: [
            "Before opening a chargeback with your bank, please write to us so we can look into it and resolve it directly. Chargebacks that are not justified may be contested with the booking record, the confirmation email and proof that the service was provided.",
          ],
        },
        {
          heading: "9. Questions",
          paragraphs: [`Anything about refunds can be sent to ${CONTACT_EN}.`],
        },
      ],
    },
  },
  es: {
    help: {
      heading: "¿Dudas sobre estas políticas?",
      body: "Escríbenos y te responde una persona real, normalmente en menos de una hora durante el día.",
      whatsapp: "Escríbenos por WhatsApp",
      email: "Escríbenos por correo",
      backHome: "Volver al inicio",
    },
    terms: {
      metaTitle: "Términos y Condiciones",
      metaDescription:
        "Términos y condiciones para reservar un shuttle privado con Ruta Pacifico: reservas, pago, cancelaciones, cambios, responsabilidad y conducta del pasajero.",
      title: "Términos y Condiciones",
      updatedLabel: "Última actualización",
      updated: UPDATED,
      intro:
        "Ruta Pacifico (\"nosotros\", \"nuestro\") presta servicios de traslado privado en Guanacaste y en toda Costa Rica. Al reservar un traslado a través de rutapacifico.com (el \"Sitio\"), por WhatsApp o por correo, usted acepta los términos siguientes. Le pedimos leerlos antes de reservar.",
      sections: [
        {
          heading: "1. Quiénes somos",
          paragraphs: [
            `Ruta Pacifico es un operador costarricense de transporte turístico con licencia del Instituto Costarricense de Turismo (licencia ICT #${ICT_LICENSE_NUMBER}), con base en Liberia, Guanacaste. Puede contactarnos en ${CONTACT_ES}.`,
          ],
        },
        {
          heading: "2. Servicios",
          paragraphs: [
            "Prestamos traslados privados puerta a puerta desde el Aeropuerto Internacional de Liberia (LIR), el Aeropuerto Internacional de San José (SJO), y entre playas, pueblos y destinos de Costa Rica. Cada traslado es exclusivo para su grupo. Los vehículos son conducidos por choferes con licencia y están asegurados conforme a la ley costarricense.",
          ],
        },
        {
          heading: "3. Reservas y confirmación",
          bullets: [
            "Al reservar en línea recibe un correo de reserva con un código de confirmación. Poco después le enviamos un enlace de pago seguro. La reserva queda en firme una vez recibido el pago.",
            "Los precios se indican en dólares de los Estados Unidos, por vehículo, e incluyen el 13 % de IVA de Costa Rica, peajes, combustible, chofer, seguimiento de vuelo y sillas para niños. No hay cobro por persona ni recargo por recogidas nocturnas, en feriados o en el aeropuerto.",
            "Usted es responsable de darnos datos de recogida correctos: dirección u hotel, número de vuelo, fecha y hora, y cantidad de pasajeros y maletas. Los retrasos o recogidas fallidas por datos incorrectos pueden generar cargos adicionales o la pérdida del servicio.",
          ],
        },
        {
          heading: "4. Pago",
          paragraphs: [
            "El pago es con tarjeta de crédito o débito mediante un enlace de pago seguro procesado por nuestro proveedor de pagos con tarjeta. Los datos de la tarjeta se ingresan en la página del proveedor, que cumple con la norma PCI; nosotros nunca vemos ni almacenamos números de tarjeta completos. Al pagar, usted nos autoriza a cobrar el total mostrado, en dólares de los Estados Unidos.",
          ],
        },
        {
          heading: "5. Cancelaciones y reembolsos",
          paragraphs: [
            "El detalle está en nuestra Política de Reembolso. En resumen: las cancelaciones hechas con al menos 48 horas de anticipación a la recogida se reembolsan en su totalidad menos un 13 % no reembolsable que cubre el IVA y el procesamiento del pago. Las cancelaciones con menos de 48 horas, los no-shows y los servicios no utilizados no son reembolsables.",
          ],
        },
        {
          heading: "6. Cambios solicitados por usted",
          paragraphs: [
            `Los cambios de fecha, hora o lugar de recogida están sujetos a disponibilidad y deben solicitarse por correo o WhatsApp con al menos 24 horas de anticipación. Hacemos lo posible por atender solicitudes posteriores, pero no podemos garantizarlas. Las solicitudes con menos de 24 horas deben enviarse también por WhatsApp al ${WHATSAPP_DISPLAY} para que las veamos a tiempo.`,
          ],
        },
        {
          heading: "7. Retrasos de vuelo",
          paragraphs: [
            "Monitoreamos cada vuelo de llegada y ajustamos la recogida a la hora real de aterrizaje sin costo. Si su vuelo se cancela o se desvía, avísenos apenas lo sepa y reprogramaremos el traslado para la nueva llegada siempre que sea posible.",
          ],
        },
        {
          heading: "8. Cambios o cancelación por parte nuestra",
          paragraphs: [
            "En casos excepcionales, como una avería del vehículo, un cierre de vía, un evento natural u otras circunstancias fuera de nuestro control, podríamos tener que reprogramar o cancelar un traslado. Si la cancelación es nuestra, usted recibe el reembolso completo o, si lo prefiere, un servicio de reemplazo de igual valor.",
          ],
        },
        {
          heading: "9. Responsabilidad",
          paragraphs: [
            "Nuestra responsabilidad se limita al monto pagado por el traslado en cuestión. No respondemos por vuelos o conexiones perdidas, ni por pérdidas causadas por tráfico, clima, condiciones de la vía o eventos fuera de nuestro control razonable. Recomendamos que cada viajero cuente con un seguro de viaje personal.",
          ],
        },
        {
          heading: "10. Conducta en el vehículo",
          paragraphs: [
            "No se permite fumar, consumir sustancias ilegales ni tener conductas que pongan en riesgo al chofer o a otros pasajeros. El chofer puede negar o terminar el servicio si la conducta de un pasajero compromete la seguridad, y en ese caso no procede reembolso.",
          ],
        },
        {
          heading: "11. Menores y sillas de seguridad",
          paragraphs: [
            "La ley costarricense exige un sistema de retención adecuado para cada menor. Las sillas para niños y los boosters están incluidos sin costo; indíquenos la edad de cada menor al reservar para que la silla correcta esté instalada antes de la recogida.",
          ],
        },
        {
          heading: "12. Equipaje",
          paragraphs: [
            "Cada vehículo tiene una capacidad de equipaje indicada. Si viaja con más maletas, tablas de surf o artículos voluminosos de lo habitual, avísenos al reservar para asignar un vehículo adecuado. El equipaje que no pueda transportarse con seguridad en el vehículo asignado podría no ser transportado.",
          ],
        },
        {
          heading: "13. Ley aplicable",
          paragraphs: [
            "Estos términos se rigen por las leyes de la República de Costa Rica. Cualquier disputa se resolverá ante los tribunales competentes de Costa Rica.",
          ],
        },
        {
          heading: "14. Contacto",
          paragraphs: [`Las consultas sobre estos términos pueden enviarse a ${CONTACT_ES}.`],
        },
      ],
    },
    privacy: {
      metaTitle: "Política de Privacidad",
      metaDescription:
        "Cómo Ruta Pacifico recolecta, usa y protege los datos personales de quienes reservan un shuttle privado, y los derechos que usted tiene bajo la Ley 8968 de Costa Rica.",
      title: "Política de Privacidad",
      updatedLabel: "Última actualización",
      updated: UPDATED,
      intro:
        "Ruta Pacifico respeta la privacidad de todas las personas que visitan rutapacifico.com (el \"Sitio\") o reservan un traslado con nosotros. Esta política explica qué datos personales recolectamos, para qué, cómo los protegemos y los derechos que usted tiene bajo la Ley 8968 de Protección de la Persona frente al Tratamiento de sus Datos Personales.",
      sections: [
        {
          heading: "1. Responsable de los datos",
          paragraphs: [
            `Ruta Pacifico, licencia ICT #${ICT_LICENSE_NUMBER}, Liberia, Guanacaste, Costa Rica. Contacto: ${CONTACT_ES}. Somos responsables del tratamiento de sus datos personales conforme a la Ley 8968 y su reglamento.`,
          ],
        },
        {
          heading: "2. Qué recolectamos",
          bullets: [
            "Datos de reserva: nombre y apellido, correo electrónico, teléfono, direcciones u hoteles de recogida y destino, número de vuelo, fechas y horas, cantidad de pasajeros, edades de los menores y solicitudes especiales.",
            "Los datos de pago los gestiona nuestro proveedor de pagos con tarjeta en su propia página segura. No almacenamos números de tarjeta completos, códigos CVV ni fechas de vencimiento. Conservamos solo la referencia de la transacción y el código de aprobación para fines contables y de disputas.",
            "Datos técnicos: dirección IP, navegador, tipo de dispositivo, páginas visitadas y ubicación aproximada, recolectados mediante cookies y herramientas de analítica.",
            "Comunicaciones: los mensajes que nos envía por correo, WhatsApp o el formulario de contacto.",
          ],
        },
        {
          heading: "3. Para qué usamos sus datos",
          bullets: [
            "Para confirmar, operar y facturar su traslado, lo que incluye compartir su nombre y datos de recogida con el chofer asignado.",
            "Para registrar a su chofer y vehículo en los resorts y comunidades con portón que lo exigen antes de la llegada.",
            "Para enviarle el correo de reserva, el enlace de pago, recordatorios de recogida y mensajes posteriores al viaje.",
            "Para cumplir con nuestras obligaciones tributarias, contables y regulatorias ante el ICT.",
            "Para prevenir fraude y abuso, y para mejorar el Sitio y nuestro servicio.",
            "Solo con su consentimiento: para enviarle ofertas ocasionales y recomendaciones de viaje. Puede retirar ese consentimiento en cualquier momento.",
          ],
        },
        {
          heading: "4. Quién tiene acceso",
          paragraphs: [
            "Sus datos se comparten únicamente con los proveedores que necesitamos para prestar el servicio: nuestro proveedor de pagos con tarjeta, el servicio de correo (Resend), la base de datos de reservas (Supabase), la analítica web (Google), el chofer asignado a su traslado, y el resort o comunidad con portón que solicita los datos del chofer antes de su llegada. No vendemos datos personales.",
          ],
        },
        {
          heading: "5. Transferencias internacionales",
          paragraphs: [
            "Algunos de estos proveedores almacenan datos en servidores fuera de Costa Rica. Trabajamos solo con proveedores cuyos estándares de seguridad son comparables a los que exige la Ley 8968, incluidos el cifrado en tránsito y en reposo y el acceso restringido.",
          ],
        },
        {
          heading: "6. Cuánto tiempo los conservamos",
          paragraphs: [
            "Los registros de reservas y contables se conservan durante el plazo que exige la legislación tributaria costarricense. Los datos de marketing se conservan hasta que usted retire su consentimiento. Los registros técnicos se conservan hasta doce meses.",
          ],
        },
        {
          heading: "7. Sus derechos",
          paragraphs: [
            `Bajo la Ley 8968 usted puede solicitar en cualquier momento el acceso, la rectificación, la eliminación o la oposición al tratamiento de sus datos personales, y puede retirar el consentimiento para marketing. Escriba a ${RESERVATIONS_EMAIL} y le responderemos dentro del plazo legal.`,
          ],
        },
        {
          heading: "8. Cookies",
          paragraphs: [
            "El Sitio usa cookies funcionales para mantener su reserva en curso y cookies analíticas (Google Analytics) para entender cómo lo usan los visitantes. Puede desactivar las cookies en su navegador; algunas partes del proceso de reserva podrían entonces no funcionar por completo.",
          ],
        },
        {
          heading: "9. Seguridad",
          paragraphs: [
            "El Sitio se sirve por HTTPS, la base de datos está cifrada, las llaves de servicio tienen acceso restringido y los pagos con tarjeta se realizan en páginas que cumplen con la norma PCI. Ningún sistema es completamente inmune a un ataque, pero aplicamos las salvaguardas que la industria considera estándar.",
          ],
        },
        {
          heading: "10. Menores",
          paragraphs: [
            "El Sitio no está dirigido a menores de 13 años, y no recolectamos a sabiendas datos de menores, salvo la edad que necesitamos para instalar la silla correcta, que la indica el adulto que reserva.",
          ],
        },
        {
          heading: "11. Cambios a esta política",
          paragraphs: [
            "Podemos actualizar esta política de vez en cuando. La fecha en la parte superior muestra siempre la versión vigente, y los cambios materiales se anuncian por correo cuando corresponde.",
          ],
        },
      ],
    },
    refund: {
      metaTitle: "Política de Reembolso",
      metaDescription:
        "Política de cancelación y reembolso de Ruta Pacifico para shuttles privados: la regla de 48 horas, no-shows, cambios, plazos de reembolso y qué pasa si cancelamos nosotros.",
      title: "Política de Reembolso",
      updatedLabel: "Última actualización",
      updated: UPDATED,
      intro:
        "Esta política aplica a todos los traslados privados reservados a través de rutapacifico.com, por WhatsApp o por correo. Al pagar un traslado, usted acepta los términos siguientes.",
      sections: [
        {
          heading: "1. Cancelación por parte de usted",
          bullets: [
            "Más de 48 horas antes de la recogida: reembolsamos el monto total pagado menos un 13 % no reembolsable. Ese porcentaje cubre el IVA de Costa Rica y las comisiones de procesamiento de la tarjeta, que el proveedor de pagos no nos devuelve.",
            "Menos de 48 horas antes de la recogida: no hay reembolso. Para entonces el vehículo, el chofer y la ruta ya están reservados para usted y no pueden reasignarse.",
            "No-show: si nadie está en el punto de recogida dentro de los 30 minutos siguientes a la hora programada y no logramos contactarle por teléfono, WhatsApp o correo, el traslado se considera realizado y no es reembolsable.",
          ],
        },
        {
          heading: "2. Cómo cancelar",
          paragraphs: [
            `Envíe su cancelación por escrito a ${RESERVATIONS_EMAIL} o por WhatsApp al ${WHATSAPP_DISPLAY}, indicando su código de confirmación. La cancelación surte efecto en la fecha y hora en que la recibimos.`,
          ],
        },
        {
          heading: "3. Cómo se pagan los reembolsos",
          paragraphs: [
            "Los reembolsos aprobados se acreditan a la tarjeta usada para el pago. Iniciamos el reembolso apenas se aprueba, normalmente en menos de 24 horas, y le enviamos una confirmación por correo. El dinero suele aparecer en su estado de cuenta en 5 a 10 días hábiles, según su banco.",
          ],
        },
        {
          heading: "4. Cambios en lugar de cancelación",
          paragraphs: [
            "Si necesita otra fecha, hora o punto de recogida en lugar de cancelar, escríbanos. Los cambios solicitados con al menos 24 horas de anticipación son gratuitos, sujetos a disponibilidad. Con menos de 24 horas hacemos lo posible, pero el cambio no está garantizado.",
          ],
        },
        {
          heading: "5. Retrasos y cancelaciones de vuelo",
          paragraphs: [
            "Un vuelo retrasado nunca le cuesta nada: lo monitoreamos y el chofer se ajusta. Si su vuelo se cancela, avísenos apenas lo sepa y moveremos el traslado a su nueva llegada. Si ninguna fecha nueva funciona, aplican las reglas de cancelación anteriores desde el momento en que recibimos su mensaje.",
          ],
        },
        {
          heading: "6. Cancelación por parte nuestra",
          paragraphs: [
            "Si cancelamos un traslado por una causa de nuestro lado, como un problema con el vehículo o un error de programación, usted recibe el reembolso completo en un plazo de 5 días hábiles o, si lo prefiere, un servicio de reemplazo de igual valor.",
          ],
        },
        {
          heading: "7. Eventos fuera del control de todos",
          paragraphs: [
            "Si un traslado no puede realizarse por un evento natural, un cierre de vía o una restricción gubernamental, lo reprogramaremos con usted sin costo adicional. Si no es posible reprogramarlo, reembolsamos el monto pagado menos los costos que ya hayamos incurrido y no podamos recuperar.",
          ],
        },
        {
          heading: "8. Disputas y contracargos",
          paragraphs: [
            "Antes de abrir un contracargo con su banco, le pedimos escribirnos para revisar el caso y resolverlo directamente. Los contracargos no justificados podrán ser disputados con el registro de la reserva, el correo de confirmación y la prueba de que el servicio se prestó.",
          ],
        },
        {
          heading: "9. Consultas",
          paragraphs: [`Cualquier consulta sobre reembolsos puede enviarse a ${CONTACT_ES}.`],
        },
      ],
    },
  },
});

export type LegalDocKey = "terms" | "privacy" | "refund";

export const LEGAL_PATHS: Record<LegalDocKey, string> = {
  terms: "/terms-and-conditions",
  privacy: "/privacy-policy",
  refund: "/refund-policy",
};
