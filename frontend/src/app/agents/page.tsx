import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { GlobalHero } from "@/components/GlobalHero";
import { Footer } from "@/components/Footer";
import { ToolsClient } from "@/components/tools-client";

export const metadata: Metadata = {
  title: "AI Agents — Browse Autonomous Agents Directory",
  description:
    "Discover and filter autonomous AI agents for content creation, research, software development, customer support, and business automation.",
  openGraph: {
    title: "AI Agents — Browse Autonomous Agents Directory",
    description:
      "Discover and filter autonomous AI agents for content creation, research, software development, customer support, and business automation.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "AI Agents — Browse Autonomous Agents Directory",
    description:
      "Discover and filter autonomous AI agents for content creation, research, software development, customer support, and business automation.",
  },
  alternates: {
    canonical: "/agents",
  },
};

export default function AgentsPage() {
  return (
    <div className="flex flex-col flex-1">
      
      {/* FIXED: Elevated GlobalHero z-index to prevent the dropdown from being overlapped */}
      <div className="relative z-[60]">
        <Suspense fallback={<div className="h-[300px]" />}>
          <GlobalHero />
        </Suspense>
      </div>

      {/* FIXED: Confined the list table to a lower z-index (z-10) so it stays beneath the dropdown */}
      <div className="relative z-10 flex-1 flex flex-col">
        <Suspense
          fallback={
            <main className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6 flex-1">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div
                    key={i}
                    className="h-48 animate-pulse rounded-xl border border-[#232326] bg-[#131316]"
                  />
                ))}
              </div>
            </main>
          }
        >
          <div className="flex-1 w-full">
            <ToolsClient defaultMode="agents" />
          </div>
        </Suspense>
      </div>

    </div>
  );
}