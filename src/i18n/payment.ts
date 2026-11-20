import { defineCopy } from "@/lib/i18n";

/** Card step of the checkout (src/components/PowertranzHostedPayment.tsx). */
export const PAYMENT = defineCopy({
  en: {
    loading: "Opening the secure payment page…",
    trustHeader: "3-D Secure · PCI DSS Level 1 · BAC Credomatic",
    hostedNote:
      "You are paying on a secure page hosted by Powertranz (BAC Credomatic). We never see your card number.",
    unavailable:
      "Card payments are temporarily unavailable. Tap below and we will email you a secure payment link instead.",
    failedTitle: "The payment did not go through",
    bankTip:
      'Tip: many banks block the first online or international charge on a card. A quick approval in your banking app, or a call to your bank, usually fixes it — then tap "Try again".',
    retry: "Try again",
    payLater: "Still not working? Email me a secure payment link",
    payLaterUnavailable: "Email me a secure payment link",
    payLaterSent: "Done — check your inbox. We hold your spot while you pay.",
    payLaterFailed: "We could not send the email. Contact us on WhatsApp +506 7080-5578.",
    sending: "Sending…",
    amount: (amt: string) => `Amount to pay: $${amt} USD`,
    approved: "Payment approved — taking you to your confirmation…",
    checking: "Checking the result of your payment…",
    dontRefresh: "Please don\u2019t refresh or close this page: confirming can take a few seconds.",
    afterSubmit: "After you tap \"Confirm payment\", give it a few seconds and don\u2019t refresh the page.",
    expiredTitle: "Your secure payment session expired",
    expiredBody: "For your protection the card page is only valid for 5 minutes. Nothing was charged. Open a new session to continue.",
    reopen: "Open a new payment session",
    expiresIn: (mmss: string) => `This secure session expires in ${mmss}`,
    badges: { caption: "Secure card payments · 3-D Secure", visa: "Visa Secure", mc: "Mastercard ID Check", ptz: "Powered by Powertranz" },
  },
  es: {
    loading: "Abriendo la página de pago segura…",
    trustHeader: "3-D Secure · PCI DSS Nivel 1 · BAC Credomatic",
    hostedNote:
      "Estás pagando en una página segura alojada por Powertranz (BAC Credomatic). Nunca vemos tu número de tarjeta.",
    unavailable:
      "El pago con tarjeta no está disponible por el momento. Toca abajo y te enviamos un enlace de pago seguro por correo.",
    failedTitle: "El pago no se completó",
    bankTip:
      'Consejo: muchos bancos bloquean el primer cobro en línea o internacional de una tarjeta. Una aprobación rápida en la app de tu banco, o una llamada, suele resolverlo. Luego toca "Intentar de nuevo".',
    retry: "Intentar de nuevo",
    payLater: "¿Sigue sin funcionar? Envíenme un enlace de pago seguro por correo",
    payLaterUnavailable: "Envíenme un enlace de pago seguro por correo",
    payLaterSent: "Listo, revisa tu correo. Apartamos tu lugar mientras pagas.",
    payLaterFailed: "No pudimos enviar el correo. Escríbenos por WhatsApp al +506 7080-5578.",
    sending: "Enviando…",
    amount: (amt: string) => `Monto a pagar: $${amt} USD`,
    approved: "Pago aprobado, te llevamos a tu confirmación…",
    checking: "Verificando el resultado de tu pago…",
    dontRefresh: "No actualices ni cierres esta página: la confirmación puede tardar unos segundos.",
    afterSubmit: "Después de tocar \"Confirmar pago\", espera unos segundos y no actualices la página.",
    expiredTitle: "Tu sesión de pago segura venció",
    expiredBody: "Por tu seguridad, la página de tarjeta solo vale 5 minutos. No se cobró nada. Abre una sesión nueva para continuar.",
    reopen: "Abrir una nueva sesión de pago",
    expiresIn: (mmss: string) => `Esta sesión segura vence en ${mmss}`,
    badges: { caption: "Pagos seguros con tarjeta · 3-D Secure", visa: "Visa Secure", mc: "Mastercard ID Check", ptz: "Powered by Powertranz" },
  },
});
