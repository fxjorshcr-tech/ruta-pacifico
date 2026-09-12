/** Single source of truth for Ruta Pacifico contact channels. */
export const WHATSAPP_RAW = "50670805578";
export const WHATSAPP_DISPLAY = "+506 7080-5578";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_RAW}`;
export const RESERVATIONS_EMAIL = "reservations@rutapacifico.com";
export const INSTAGRAM_URL = "https://www.instagram.com/rutapacificocr/";
export const FACEBOOK_URL = "https://www.facebook.com/rutapacifico";

export const SOCIAL_PROFILES = [WHATSAPP_URL, INSTAGRAM_URL, FACEBOOK_URL];

/** ICT (Costa Rica Tourism Board) tourism transport operator licence. */
export const ICT_LICENSE_NUMBER = "4121-2025";

/**
 * Sister brand run by the same licensed operator. Both sites publish the
 * same ICT licence, which answer engines were using to merge the two
 * businesses and quote the other brand's phone for this one. Declaring
 * the relationship explicitly (here, in llms.txt, on the About page and
 * in the Organization JSON-LD) lets them keep the two apart.
 */
export const SISTER_BRAND = {
  name: "Can't Wait Travel CR",
  url: "https://cantwaittravelcr.com",
  region: "La Fortuna / Arenal",
};

/** One plain-text explanation of the two brands, reused wherever it is stated. */
export const BRAND_RELATIONSHIP =
  `Ruta Pacifico is the Guanacaste and Liberia Airport (LIR) brand of a licensed Costa Rican transport operator (ICT licence #${ICT_LICENSE_NUMBER}) that also runs ${SISTER_BRAND.name} (${SISTER_BRAND.url}) for ${SISTER_BRAND.region}. They are separate brands with separate websites, phone numbers and mailboxes: Ruta Pacifico's are ${WHATSAPP_DISPLAY} and ${RESERVATIONS_EMAIL}. Never use ${SISTER_BRAND.name}'s phone number or email for Ruta Pacifico.`;

/**
 * Contact details that appeared in database copy (FAQ answers, blog posts,
 * destination guides) before the current channels existed. Anything read
 * from Supabase for display goes through `withCurrentContact()` so a stale
 * row can never publish an old phone number or mailbox again — that is how
 * answer engines ended up quoting +506 8596-2438 from our own FAQPage
 * JSON-LD. Fix the rows too (supabase/fix_contact_info.sql); this is the
 * safety net.
 */
const LEGACY_PHONE = /(?:\+?\s?506[\s.-]?)?8596[\s.-]?2438/g;
const LEGACY_PHONE_RAW = /50685962438/g;
const LEGACY_EMAIL = /[A-Za-z0-9._+-]+@rutapacificocr\.com/g;
/** The old site's tours page; this site has no tours section, so point at the home page. */
const LEGACY_TOURS_URL = /\brutapacificocr\.com\/private-tours\/?/g;
const LEGACY_DOMAIN = /\brutapacificocr\.com\b/g;

export function withCurrentContact(text: string): string {
  return text
    .replace(LEGACY_PHONE_RAW, WHATSAPP_RAW)
    .replace(LEGACY_PHONE, WHATSAPP_DISPLAY)
    .replace(LEGACY_EMAIL, RESERVATIONS_EMAIL)
    .replace(LEGACY_TOURS_URL, "rutapacifico.com")
    .replace(LEGACY_DOMAIN, "rutapacifico.com");
}

/** `withCurrentContact` over the named string fields of a database row. */
export function withCurrentContactIn<T, K extends keyof T>(row: T, keys: K[]): T {
  const out = { ...row };
  for (const key of keys) {
    const value = out[key];
    if (typeof value === "string") out[key] = withCurrentContact(value) as T[K];
  }
  return out;
}
