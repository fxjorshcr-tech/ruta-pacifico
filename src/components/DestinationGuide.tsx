import Link from "next/link";
import { marked } from "marked";
import type { Destination } from "@/lib/destinations";
import type { Route } from "@/lib/routes";
import { routeSlug } from "@/lib/slug";
import { withCurrentContact } from "@/lib/contact";

/**
 * Unique, per-destination copy rendered on index-able route pages so each
 * URL says something the other 300 do not. Server component: Markdown is
 * converted once at render time, no client JS.
 */
const PROSE =
  "text-sm leading-relaxed text-foreground/75 [&_p]:mb-4 [&_p:last-child]:mb-0 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_ul:last-child]:mb-0 [&_strong]:font-semibold [&_strong]:text-foreground";

function md(src: string): string {
  return marked.parse(withCurrentContact(src), { async: false }) as string;
}

interface Props {
  route: Route;
  origin: Destination | undefined;
  destination: Destination;
  /** Other index-able routes worth linking to (same origin or destination). */
  related: Route[];
  /** The opposite direction of this route, if it is sold. */
  reverse: Route | undefined;
}

export default function DestinationGuide({
  route,
  origin,
  destination,
  related,
  reverse,
}: Props) {
  const originName = origin?.short_name ?? route.origen;
  const heading = `About ${destination.short_name}`;

  return (
    <section
      aria-labelledby="destination-guide"
      className="mx-auto max-w-5xl px-6 pb-16"
    >
      {/* Native <details>: closed by default so the guide never gets in the way
          of booking, yet the full text is in the DOM for crawlers and LLMs
          (collapsed content is indexed normally; it is not hidden-text
          cloaking). No client JS needed. */}
      <details className="group rounded-3xl border border-black/5 bg-white shadow-sm">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 sm:px-8 [&::-webkit-details-marker]:hidden">
          <span className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sunset-orange/10 text-sunset-orange">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                />
              </svg>
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold text-foreground">
                Travel notes: {heading.replace(/^About /, "")}
              </span>
              <span className="block truncate text-xs text-foreground/50">
                What to expect, the ride from {originName}, local tips and related routes
              </span>
            </span>
          </span>
          <svg
            className="h-5 w-5 shrink-0 text-foreground/40 transition-transform group-open:rotate-180"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </summary>

        <div className="border-t border-black/5 px-6 pb-8 pt-6 sm:px-10 sm:pb-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-sunset-orange/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sunset-orange">
            {destination.region}
          </span>
          {destination.best_for.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-foreground/60"
            >
              {tag}
            </span>
          ))}
        </div>

        <h2
          id="destination-guide"
          className="mt-4 text-2xl font-bold text-foreground sm:text-3xl"
        >
          {heading}
        </h2>
        <div
          className={`mt-4 ${PROSE}`}
          dangerouslySetInnerHTML={{ __html: md(destination.intro_md) }}
        />

        {destination.arrival_md.trim() ? (
          <>
            <h3 className="mt-8 text-lg font-bold text-foreground">
              The ride from {originName}
            </h3>
            <div
              className={`mt-3 ${PROSE}`}
              dangerouslySetInnerHTML={{ __html: md(destination.arrival_md) }}
            />
          </>
        ) : null}

        {destination.tips_md.trim() ? (
          <>
            <h3 className="mt-8 text-lg font-bold text-foreground">
              Good to know before you arrive
            </h3>
            <div
              className={`mt-3 ${PROSE}`}
              dangerouslySetInnerHTML={{ __html: md(destination.tips_md) }}
            />
          </>
        ) : null}

        {reverse || related.length ? (
          <div className="mt-8 border-t border-black/5 pt-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/50">
              Related private shuttles
            </h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {reverse ? (
                <li key="reverse">
                  <Link
                    href={`/private-shuttle/${routeSlug(reverse.origen, reverse.destino)}`}
                    className="flex items-center justify-between rounded-xl border border-black/10 px-4 py-2.5 text-sm font-medium text-foreground transition hover:border-sunset-orange hover:text-sunset-orange"
                  >
                    <span>
                      Return trip: {reverse.origen} → {reverse.destino}
                    </span>
                    <span className="text-xs text-foreground/50">
                      from ${reverse.precio1a5}
                    </span>
                  </Link>
                </li>
              ) : null}
              {related.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/private-shuttle/${routeSlug(r.origen, r.destino)}`}
                    className="flex items-center justify-between rounded-xl border border-black/10 px-4 py-2.5 text-sm font-medium text-foreground transition hover:border-sunset-orange hover:text-sunset-orange"
                  >
                    <span>
                      {r.origen} → {r.destino}
                    </span>
                    <span className="text-xs text-foreground/50">
                      from ${r.precio1a5}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        </div>
      </details>
    </section>
  );
}
