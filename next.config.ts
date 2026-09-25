import type { NextConfig } from "next";

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
      // English is canonical at the root: an explicit /en/... is sent to
      // /... so the same page never exists at two addresses.
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
    ];
  },
  async rewrites() {
    return {
      // Locale routing lives here, in Vercel's routing layer, instead of in a
      // proxy.ts: a proxy runs as a Node function on EVERY request, cached
      // pages included, and after the site went bilingual that alone was
      // most of the project's Vercel CPU. These rewrites cost nothing.
      //
      // afterFiles: real files, _next assets and non-dynamic routes
      // (sitemap.xml, robots.txt, llms.txt, /api/*) are served first; only
      // what is left is prefixed with /en so it lands in app/[lang].
      // /es and /es/... are excluded and pass straight through.
      afterFiles: [
        { source: "/", destination: "/en" },
        { source: "/:path((?!es(?:/|$)).*)", destination: "/en/:path" },
      ],
    };
  },
};

export default nextConfig;
