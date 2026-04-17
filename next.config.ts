import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
    ];
  },
};

export default nextConfig;
