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

import { Header } from "@/components/Header";
import { GlobalHero } from "@/components/GlobalHero";
import { Footer } from "@/components/Footer";

export default function NewsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white">
      <Header />
      <Suspense fallback={<div className="h-[300px]" />}><GlobalHero /></Suspense>
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        </div>
      }>
        <NewsPageClient />
      </Suspense>
      <Footer />
    </div>
  );
}
