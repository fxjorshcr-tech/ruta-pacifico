import { FACEBOOK_URL, INSTAGRAM_URL } from "@/lib/contact";

type Props = {
  /** "light" for dark footers, "dark" for white sections. */
  tone?: "light" | "dark";
  className?: string;
};

const ICON_BASE =
  "flex h-10 w-10 items-center justify-center rounded-full border transition";
const TONES = {
  light:
    "border-white/15 bg-white/5 text-white/70 hover:border-sunset-orange hover:text-sunset-orange",
  dark:
    "border-black/10 bg-white text-foreground/60 hover:border-sunset-orange hover:text-sunset-orange",
};

export function InstagramIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1z" />
    </svg>
  );
}

export default function SocialLinks({ tone = "light", className = "" }: Props) {
  const iconClass = `${ICON_BASE} ${TONES[tone]}`;
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Ruta Pacifico on Instagram"
        title="Instagram @rutapacificocr"
        className={iconClass}
      >
        <InstagramIcon />
      </a>
      <a
        href={FACEBOOK_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Ruta Pacifico on Facebook"
        title="Facebook"
        className={iconClass}
      >
        <FacebookIcon />
      </a>
    </div>
  );
}
