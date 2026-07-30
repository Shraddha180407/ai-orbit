import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

      "lucide-react",          // 1000+ icons — biggest win: ~1 MiB per function
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
        source: "/:type(personal|creativity)",
        destination: "/tools",
      },
      {
        // `models` intentionally omitted — real routes live at app/models/[id] and app/models/compare
        source: "/:type(collections|companies|countries|devices|fundraises|investors|news|repositories|robots|tasks|tools|videos|personal|creativity)/:slug",
        destination: "/p/:type/:slug",
      },
    ];
  },
};

export default nextConfig;