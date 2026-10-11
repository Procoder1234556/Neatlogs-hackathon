import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "https://neatlogs-hackathon.p03490978.workers.dev/api/v1/:path*",
      },
      {
        source: "/health",
        destination: "https://neatlogs-hackathon.p03490978.workers.dev/health",
      },
    ];
  },
};

export default nextConfig;
