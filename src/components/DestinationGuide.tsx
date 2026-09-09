import Link from "next/link";
import { marked } from "marked";
import type { Destination } from "@/lib/destinations";
import type { Route } from "@/lib/routes";
import { routeSlug } from "@/lib/slug";

/**
 * Unique, per-destination copy rendered on index-able route pages so each
 * URL says something the other 300 do not. Server component: Markdown is
 * converted once at render time, no client JS.
 */
const PROSE =
  "text-sm leading-relaxed text-foreground/75 [&_p]:mb-4 [&_p:last-child]:mb-0 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_ul:last-child]:mb-0 [&_strong]:font-semibold [&_strong]:text-foreground";

function md(src: string): string {
  return marked.parse(src, { async: false }) as string;
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
      className="mx-auto max-w-5xl px-6 pt-14"
    >
      <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-10">
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
    </section>
  );
}
