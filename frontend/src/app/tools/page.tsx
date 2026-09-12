import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { GlobalHero } from "@/components/GlobalHero";
import { Footer } from "@/components/Footer";
import { ToolsClient } from "@/components/tools-client";

export const metadata: Metadata = {
  title: "AI Tools — Browse the Full Directory",
  description:
    "Search and filter AI tools by category, pricing, and rating. Find the right tool for writing, coding, image generation, and more.",
  openGraph: {
    title: "AI Tools — Browse the Full Directory",
    description:
      "Search and filter AI tools by category, pricing, and rating.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "AI Tools — Browse the Full Directory",
    description: "Search and filter AI tools by category, pricing, and rating.",
  },  
  alternates: {
    canonical: "/tools",
  },
};

export default function ToolsPage() {
  return (
    <div className="flex flex-col flex-1">

      
      {/* FIXED: Elevated GlobalHero z-index specifically for the Tools page */}
      <div className="relative z-[60]">
        <Suspense fallback={<div className="h-[300px]" />}><GlobalHero /></Suspense>
      </div>
      
      {/* FIXED: Confined the Tools table to a lower z-index (z-10) so it can never overlap the dropdown above it */}
      <div className="relative z-10 flex-1 flex flex-col">
        <Suspense fallback={
          <main className="mx-auto max-w-container px-6 py-10 flex-1 w-full">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1,2,3,4,5,6,7,8].map((i) => (
                <div key={i} className="h-48 animate-pulse rounded-xl border border-[#232326] bg-[#131316]" />
              ))}
            </div>
          </main>
        }>
          <div className="flex-1">
            <ToolsClient />
          </div>
        </Suspense>
      </div>
      

    </div>
  );
}