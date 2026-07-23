import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "yt3.ggpht.com" }, // channel/author avatars
      { protocol: "https", hostname: "picsum.photos" }, // search module mock thumbnails
      {
        protocol: "https",
        hostname: "www.google.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "orbit-ai.example.com",
      },
      {
        protocol: "https",
        hostname: "*.gstatic.com",
      },
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
        source: "/:type(collections|countries|devices|fundraises|investors|models|news|robots|tasks|tools|videos)/:slug",
        destination: "/p/:type/:slug",
      },
    ];
  },
};

export default nextConfig;