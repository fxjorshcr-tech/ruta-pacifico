import { notFound } from "next/navigation";

/**
 * Anything under /[lang] that no page claims (e.g. /es/does-not-exist, or
 * /does-not-exist after the rewrite prefixes it) renders the localised
 * not-found page instead of Next's bare default.
 */
export default function CatchAll() {
  notFound();
}
