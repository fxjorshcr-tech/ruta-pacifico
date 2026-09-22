import Image from "next/image";
import Link from "@/components/LocaleLink";
import SocialLinks from "@/components/SocialLinks";
import GoogleReviewBadge from "@/components/GoogleReviewBadge";
import { LOGO_WHITE_URL } from "@/lib/brand";
import {
  ICT_LICENSE_NUMBER,
  RESERVATIONS_EMAIL,
  WHATSAPP_DISPLAY,
  WHATSAPP_URL,
} from "@/lib/contact";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { FOOTER } from "@/i18n/site";
import { LEGAL_PATHS } from "@/i18n/legal";

/**
 * Membership badges. Same public bucket as the rest of the site's images;
 * the files are shared with the sister brand, which holds the same ICT
 * licence and Marca País membership.
 */
const BADGES_DIR =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos";
const ESENCIAL_LOGO = `${BADGES_DIR}/esencial%20costa%20rica.webp`;
const ICT_LOGO = `${BADGES_DIR}/ICT%20LOGO.webp`;

const LINK = "transition hover:text-sunset-orange";
const HEADING = "text-sm font-semibold uppercase tracking-wider text-white/80";

/** The one footer every page renders: links, legal pages, contact and the ICT / Esencial badges. */
export default function SiteFooter({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const t = FOOTER[locale];
  return (
    <footer className="border-t border-black/5 bg-foreground text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Image
              src={LOGO_WHITE_URL}
              alt="Ruta Pacifico"
              width={480}
              height={200}
              className="h-24 w-auto"
              unoptimized
            />
            <p className="mt-4 text-sm leading-relaxed text-white/50">{t.tagline}</p>
            <p className="mt-4 text-xs text-white/40">
              {t.license}: {ICT_LICENSE_NUMBER}
            </p>
            <p className="mt-1 text-xs text-white/40">WhatsApp: {WHATSAPP_DISPLAY}</p>
            <h4 className={`mt-8 ${HEADING}`}>{t.follow}</h4>
            <SocialLinks className="mt-4" locale={locale} />
          </div>

          <div>
            <h4 className={HEADING}>{t.quickLinks}</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/50">
              <li><Link href="/private-shuttle" className={LINK}>{t.links.shuttles}</Link></li>
              <li><Link href="/prices" className={LINK}>{t.links.prices}</Link></li>
              <li><Link href="/blog" className={LINK}>{t.links.blog}</Link></li>
              <li><Link href="/faq" className={LINK}>{t.links.faq}</Link></li>
              <li><Link href="/about-contact" className={LINK}>{t.links.about}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className={HEADING}>{t.legal}</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/50">
              <li><Link href={LEGAL_PATHS.terms} className={LINK}>{t.legalLinks.terms}</Link></li>
              <li><Link href={LEGAL_PATHS.privacy} className={LINK}>{t.legalLinks.privacy}</Link></li>
              <li><Link href={LEGAL_PATHS.refund} className={LINK}>{t.legalLinks.refund}</Link></li>
            </ul>
            <h4 className={`mt-8 ${HEADING}`}>{t.contact}</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/50">
              <li><a href={WHATSAPP_URL} className={LINK}>WhatsApp {WHATSAPP_DISPLAY}</a></li>
              <li><a href={`mailto:${RESERVATIONS_EMAIL}`} className={LINK}>{RESERVATIONS_EMAIL}</a></li>
              <li>{t.location}</li>
            </ul>
          </div>

          <div>
            <h4 className={HEADING}>{t.popularRoutes}</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/50">
              {t.routes.map((r) => (
                <li key={r.slug}>
                  <Link href={`/private-shuttle/${r.slug}`} className={LINK}>{r.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 border-t border-white/10 pt-8 sm:flex-row sm:justify-between">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} Ruta Pacifico. {t.rights}
          </p>
          <GoogleReviewBadge tone="light" locale={locale} />
        </div>

        <div className="mt-8 border-t border-white/10 pt-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">{t.membersOf}</p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <span className="flex h-14 items-center rounded-lg bg-white px-4">
              <Image src={ESENCIAL_LOGO} alt={t.esencialAlt} width={120} height={48} className="h-9 w-auto object-contain sm:h-10" />
            </span>
            <span className="flex h-14 items-center rounded-lg bg-white px-4">
              <Image src={ICT_LOGO} alt={t.ictAlt} width={120} height={48} className="h-9 w-auto object-contain sm:h-10" />
            </span>
          </div>
          <p className="mx-auto mt-4 max-w-xl text-xs leading-relaxed text-white/40">{t.membersLine}</p>
        </div>
      </div>
    </footer>
  );
}
