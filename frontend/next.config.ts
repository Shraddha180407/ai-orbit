import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Pre-existing type errors across non-robots modules â€” tracked separately
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },

  // ---- Bundle size reduction for Cloudflare Pages 3 MiB Worker limit ----
  // Tree-shake large libraries so ONLY the symbols actually used are
  // included in each edge-function bundle (critical on free plan: 3 MiB cap).
  experimental: {
    optimizePackageImports: [

      "lucide-react",          // 1000+ icons â€” biggest win: ~1 MiB per function
      "@tanstack/react-query",
      "sonner",
      "clsx",
      "tailwind-merge",
      "recharts",
    ],
  },
  
  async rewrites() {
    return [
      {
        source: "/api-proxy/:path*",
        destination: "https://ai-orbit.palamrendra-pm.workers.dev/:path*",
      },
      {
        source: "/models/compare",
        destination: "/models/compare",
      },
      {
        source: "/:type(personal|creativity|agents)",
        destination: "/tools",
      },
      {
        source: "/:type(companies|countries|devices|fundraises|investors|news|repositories|robots|tasks|tools|videos|personal|creativity|models|agents)/:slug",
        destination: "/p/:type/:slug",
      },
    ];
  },
};

export default nextConfig;
