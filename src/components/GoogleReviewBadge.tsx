import { getGoogleRating } from "@/lib/googleRating";
import { defineCopy, type Locale } from "@/lib/i18n";

type Props = {
  /** "dark" for photo heroes, "light" for white sections and footers. */
  tone?: "dark" | "light";
  locale?: Locale;
};

const COPY = defineCopy({
  en: {
    suffix: "on Google Reviews",
    label: (value: string, count: number) =>
      `Rated ${value} on Google Reviews from ${count} reviews. Read them on Google (opens in a new tab)`,
  },
  es: {
    suffix: "en reseñas de Google",
    label: (value: string, count: number) =>
      `Calificación ${value} en reseñas de Google con ${count} reseñas. Léelas en Google (se abre en una pestaña nueva)`,
  },
});

const TONES = {
  dark: {
    pill:
      "bg-black/60 backdrop-blur-sm border-white/10 hover:border-sunset-orange/60 hover:bg-black/70",
    rating: "text-white",
    label: "text-white/60",
  },
  light: {
    pill: "bg-white border-black/10 shadow-sm hover:border-sunset-orange/60 hover:shadow-md",
    rating: "text-foreground",
    label: "text-foreground/50",
  },
};

/**
 * "5.0 on Google Reviews" pill with the live rating of the Google Business
 * Profile. Links to the profile so a visitor can read the reviews
 * themselves (and leave one).
 */
export default async function GoogleReviewBadge({ tone = "dark", locale = "en" }: Props) {
  const t = TONES[tone];
  const c = COPY[locale];
  const rating = await getGoogleRating();
  return (
    <a
      href={rating.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={c.label(rating.value, rating.reviewCount)}
      className={`inline-flex items-center gap-2.5 rounded-full border px-5 py-2.5 transition ${t.pill}`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
      <span className="flex items-center gap-1">
        <span className="flex" aria-hidden="true">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </span>
        <span className={`text-sm font-semibold ${t.rating}`}>{rating.value}</span>
        <span className={`text-sm ${t.label}`}>{c.suffix}</span>
      </span>
    </a>
  );
}
