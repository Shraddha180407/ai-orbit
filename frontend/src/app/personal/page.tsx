import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { GlobalHero } from "@/components/GlobalHero";
import { Footer } from "@/components/Footer";
import { ToolsClient } from "@/components/tools-client";

export const metadata: Metadata = {
  title: "Personal AI Tools — Browse the Directory",
  description: "Browse AI tools for personal productivity and everyday life.",
};

export default function PersonalPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white">

      <Suspense fallback={<div className="h-[300px]" />}><GlobalHero /></Suspense>
      <Suspense fallback={
        <main className="mx-auto max-w-container px-6 py-10 flex-1">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1,2,3,4,5,6,7,8].map((i) => (
              <div key={i} className="h-48 animate-pulse rounded-xl border border-[#232326] bg-[#131316]" />
            ))}
          </div>
        </main>
      }>
        <div className="flex-1">
          <ToolsClient defaultMode="personal" />
        </div>
      </Suspense>

    </div>
  );
}

