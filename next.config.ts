import type { NextConfig } from "next";
import { CONTENT_USAGE } from "./src/lib/aiPolicy";

/**
 * Content negotiation for AI agents: a client that asks for
 * `Accept: text/markdown` gets the page as Markdown instead of HTML (the
 * convention Cloudflare's "Markdown for Agents", Vercel and OpenAI's own
 * docs follow). Matched with the same regex Next uses for `has` values.
 */
const WANTS_MARKDOWN = { type: "header", key: "accept", value: "(.*)text/markdown(.*)" } as const;

const nextConfig: NextConfig = {
  // The email routes read the brand logo from disk to embed it inline;
  // make sure the file is bundled with those serverless functions.
  outputFileTracingIncludes: {
    "/api/bookings": ["./public/brand/logo-white.png"],
    "/api/contact": ["./public/brand/logo-white.png"],
  },
  images: {
    // Optimized variants are cached for 31 days (Supabase Storage only sends
    // max-age=3600, which Lighthouse flags as a short cache lifetime). The
    // source files never change in place: a new photo gets a new file name.
    minimumCacheTTL: 2678400,
    qualities: [75],
    // The largest source (the hero) is 1920px wide: anything above that
    // would only add srcset entries and cached variants that never win.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mmlbslwljvmscbgsqkkq.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    return [
      // Legacy URLs from the previous /book/* and /routes/[slug] structure.
      // 301 so search engines update their indexes.
      { source: "/book/transfer", destination: "/private-shuttle", permanent: true },
      { source: "/book/review", destination: "/private-shuttle/checkout", permanent: true },
      { source: "/book/payment", destination: "/private-shuttle/checkout", permanent: true },
      { source: "/book/confirmation", destination: "/private-shuttle/confirmation", permanent: true },
      { source: "/routes/:slug", destination: "/private-shuttle/:slug", permanent: true },
      // Dreams Las Mareas (Playa El Jobo, La Cruz) reopened as JW Marriott
      // Costa Elena and its route point was renamed, so the old slugs are
      // gone (dynamicParams = false). 301 them to the new pages, both
      // languages. The regex absorbs whatever suffix the old name produced.
      ...["", "/es"].flatMap((prefix) => [
        {
          source: `${prefix}/private-shuttle/:slug(lir-liberia-int-airport-to-dreams-las-mareas.*)`,
          destination: `${prefix}/private-shuttle/lir-liberia-int-airport-to-jw-marriott-costa-elena-la-cruz`,
          permanent: true,
        },
        {
          source: `${prefix}/private-shuttle/:slug(dreams-las-mareas.*-to-lir-liberia-int-airport)`,
          destination: `${prefix}/private-shuttle/jw-marriott-costa-elena-la-cruz-to-lir-liberia-int-airport`,
          permanent: true,
        },
      ]),
      // English is canonical at the root: an explicit /en/... is sent to
      // /... so the same page never exists at two addresses.
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
      // The FAQ page lives at /faq; the plural that people (and the sister
      // site) use lands there instead of on a 404.
      { source: "/faqs", destination: "/faq", permanent: true },
      { source: "/es/faqs", destination: "/es/faq", permanent: true },
      // Destination hubs live at app/[lang]/shuttle/[destination] but are
      // published as /<destination>-shuttle (see the rewrite below). The
      // internal path 301s to the public one so each hub has one address.
      { source: "/shuttle/:destination", destination: "/:destination-shuttle", permanent: true },
      { source: "/es/shuttle/:destination", destination: "/es/:destination-shuttle", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        // IETF AI Preferences (draft-ietf-aipref-attach): the same statement
        // robots.txt carries, attached to every response for clients that
        // never read robots.txt. Static config: no function runs for it.
        source: "/:path*",
        headers: [{ key: "Content-Usage", value: CONTENT_USAGE }],
      },
    ];
  },
  async rewrites() {
    return {
      // beforeFiles: resolved before anything else, so these win over the
      // /[lang] pages. Markdown versions of the route pages for AI agents:
      //   - `Accept: text/markdown` on a route URL (RFC 9110 negotiation);
      //   - or the same URL with `.md` appended, for clients that cannot set
      //     headers. Both land on app/[lang]/md/private-shuttle/[slug]/route.ts.
      // The home page negotiates to /llms.txt, which already is its Markdown
      // summary. The rewritten paths start with /en or /es, so the afterFiles
      // prefixing below leaves them alone.
      beforeFiles: [
        {
          source: "/private-shuttle/:slug",
          has: [WANTS_MARKDOWN],
          destination: "/en/md/private-shuttle/:slug",
        },
        {
          source: "/es/private-shuttle/:slug",
          has: [WANTS_MARKDOWN],
          destination: "/es/md/private-shuttle/:slug",
        },
        {
          source: "/private-shuttle/:slug([a-z0-9-]+)\\.md",
          destination: "/en/md/private-shuttle/:slug",
        },
        {
          source: "/es/private-shuttle/:slug([a-z0-9-]+)\\.md",
          destination: "/es/md/private-shuttle/:slug",
        },
        { source: "/", has: [WANTS_MARKDOWN], destination: "/llms.txt" },
        { source: "/es", has: [WANTS_MARKDOWN], destination: "/llms.txt" },
        // Markdown twins of the hubs for AI agents, same two doors as the
        // route pages: `Accept: text/markdown` on the hub URL, or `.md`
        // appended. The airport hub first, so the generic pattern below
        // never swallows it.
        { source: "/liberia-airport-shuttle", has: [WANTS_MARKDOWN], destination: "/en/md/liberia-airport-shuttle" },
        { source: "/es/liberia-airport-shuttle", has: [WANTS_MARKDOWN], destination: "/es/md/liberia-airport-shuttle" },
        { source: "/liberia-airport-shuttle.md", destination: "/en/md/liberia-airport-shuttle" },
        { source: "/es/liberia-airport-shuttle.md", destination: "/es/md/liberia-airport-shuttle" },
        {
          source: "/:destination((?!liberia-airport-shuttle$|private-shuttle$)[a-z0-9-]+)-shuttle",
          has: [WANTS_MARKDOWN],
          destination: "/en/md/shuttle/:destination",
        },
        {
          source: "/es/:destination((?!liberia-airport-shuttle$|private-shuttle$)[a-z0-9-]+)-shuttle",
          has: [WANTS_MARKDOWN],
          destination: "/es/md/shuttle/:destination",
        },
        {
          source: "/:destination((?!liberia-airport-shuttle\\.md$|private-shuttle\\.md$)[a-z0-9-]+)-shuttle\\.md",
          destination: "/en/md/shuttle/:destination",
        },
        {
          source: "/es/:destination((?!liberia-airport-shuttle\\.md$|private-shuttle\\.md$)[a-z0-9-]+)-shuttle\\.md",
          destination: "/es/md/shuttle/:destination",
        },
        // Destination hubs: /tamarindo-shuttle → app/[lang]/shuttle/tamarindo.
        // The Liberia Airport hub and the /private-shuttle booking page are
        // their own pages and are excluded. Only the slugs generateStaticParams
        // returns exist; the rest are static 404s.
        {
          source: "/:destination((?!liberia-airport-shuttle$|private-shuttle$)[a-z0-9-]+)-shuttle",
          destination: "/en/shuttle/:destination",
        },
        {
          source: "/es/:destination((?!liberia-airport-shuttle$|private-shuttle$)[a-z0-9-]+)-shuttle",
          destination: "/es/shuttle/:destination",
        },
      ],
      // Locale routing lives here, in Vercel's routing layer, instead of in a
      // proxy.ts: a proxy runs as a Node function on EVERY request, cached
      // pages included, and after the site went bilingual that alone was
      // most of the project's Vercel CPU. These rewrites cost nothing.
      //
      // afterFiles: real files, _next assets and non-dynamic routes
      // (sitemap.xml, robots.txt, llms.txt, /api/*) are served first; only
      // what is left is prefixed with /en so it lands in app/[lang].
      // /es and /es/... are excluded and pass straight through, as are paths
      // already under /en (the Markdown rewrites above produce those; a
      // public /en URL never gets here because the redirect above wins).
      afterFiles: [
        { source: "/", destination: "/en" },
        { source: "/:path((?!es(?:/|$)|en(?:/|$)).*)", destination: "/en/:path" },
      ],
    };
  },
};

export default nextConfig;
