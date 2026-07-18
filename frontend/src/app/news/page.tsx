import type { Metadata } from "next";
import { Suspense } from "react";
import { NewsPageClient } from "@/components/news-page-client";

export const metadata: Metadata = {
  title: "AI News — The AI Signal",
  description: "AI news across the AI ecosystem — models, research, funding, and policy.",
  openGraph: {
    title: "AI News — The AI Signal",
    description: "AI news across the AI ecosystem — models, research, funding, and policy.",
    siteName: "AIOrbit",
    type: "website",
  },
};

export default function NewsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#000000]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    }>
      <NewsPageClient />
    </Suspense>
  );
}
