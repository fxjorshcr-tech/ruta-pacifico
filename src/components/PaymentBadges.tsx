import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import { PAYMENT } from "@/i18n/payment";

/**
 * Card-scheme and gateway marks Powertranz requires on the home page and the
 * payment page: Visa Secure, Mastercard ID Check and "Powered by Powertranz"
 * (with the 3-D Secure marks present, the plain Visa / Mastercard symbols
 * are not required). Assets in public/payment, shared with the sister site.
 * Each mark sits on a white chip so it reads on dark and light backgrounds.
 */
interface Props {
  locale: Locale;
  /** 'footer' = centred row with caption on the dark footer; 'checkout' = inline row. */
  variant?: "footer" | "checkout";
  className?: string;
}

export default function PaymentBadges({ locale, variant = "footer", className = "" }: Props) {
  const t = PAYMENT[locale].badges;
  const chip = "inline-flex items-center justify-center rounded-md bg-white px-2.5 py-1.5 shadow-sm ring-1 ring-black/5";
  const isFooter = variant === "footer";
  return (
    <div className={`${isFooter ? "flex flex-col items-center gap-3" : "flex flex-wrap items-center gap-2"} ${className}`}>
      {isFooter && <p className="text-xs text-white/40">{t.caption}</p>}
      <div className={`flex flex-wrap items-center gap-2 ${isFooter ? "justify-center" : ""}`}>
        <span className={chip} title={t.visa}>
          <Image src="/payment/visa-secure.png" alt={t.visa} width={36} height={32} className="h-7 w-auto" />
        </span>
        <span className={chip} title={t.mc}>
          <Image src="/payment/mastercard-id-check.png" alt={t.mc} width={120} height={26} className="h-5 w-auto" />
        </span>
        <span className={chip} title={t.ptz}>
          <Image src="/payment/powered-by-powertranz.png" alt={t.ptz} width={110} height={31} className="h-6 w-auto" />
        </span>
      </div>
    </div>
  );
}
