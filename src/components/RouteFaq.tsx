import type { RouteFaq } from "@/lib/routeFaqs";

/**
 * Route-specific Q&A, collapsed by default so it stays out of the booking
 * flow. Questions and answers are all in the HTML (a native <details>), so
 * crawlers and AI assistants read them; the matching FAQPage JSON-LD lives
 * in the route page's graph.
 */
export default function RouteFaqSection({
  faqs,
  originName,
  destinationName,
}: {
  faqs: RouteFaq[];
  originName: string;
  destinationName: string;
}) {
  if (!faqs.length) return null;
  return (
    <section
      aria-labelledby="route-faq"
      className="mx-auto max-w-5xl px-6 pb-16"
    >
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
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                />
              </svg>
            </span>
            <span className="min-w-0">
              <span id="route-faq" className="block text-sm font-bold text-foreground">
                Questions about {originName} to {destinationName}
              </span>
              <span className="block truncate text-xs text-foreground/50">
                Duration, price, meeting point, stops, child seats, delays and cancellations
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

        <dl className="divide-y divide-black/5 border-t border-black/5 px-6 sm:px-10">
          {faqs.map((f) => (
            <div key={f.q} className="py-5">
              <dt className="text-base font-semibold text-foreground">{f.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-foreground/75">
                {f.a}
              </dd>
            </div>
          ))}
        </dl>
      </details>
    </section>
  );
}
