/**
 * Single source of truth for Ruta Pacifico brand assets.
 *
 * The files live in /public/brand so they are served from our own domain
 * (no third-party dependency, cacheable, and usable from emails / JSON-LD
 * through the absolute variants). To swap the logo again, replace the files
 * and update the dimensions here — nothing else needs to change.
 */
const SITE_URL = "https://rutapacifico.com";

/** Transparent wordmark, trimmed to the artwork (teal text + orange emblem). */
export const LOGO_URL = "/brand/logo.png";
export const LOGO_WIDTH = 1600;
export const LOGO_HEIGHT = 668;

/** All-white version of the wordmark for dark or photographic backgrounds. */
export const LOGO_WHITE_URL = "/brand/logo-white.png";

/** Absolute URLs for contexts that cannot resolve site-relative paths (emails). */
export const LOGO_ABSOLUTE_URL = `${SITE_URL}${LOGO_URL}`;
export const LOGO_WHITE_ABSOLUTE_URL = `${SITE_URL}${LOGO_WHITE_URL}`;

/** Square composition (logo centred on a transparent 1:1 canvas) for structured data. */
export const LOGO_SQUARE_ABSOLUTE_URL = `${SITE_URL}/brand/logo-square.png`;
export const LOGO_SQUARE_SIZE = 512;
