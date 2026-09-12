import type { Metadata } from "next";
import { Suspense } from "react";
import { GlobalHero } from "@/components/GlobalHero";
import { LeaderboardClient } from "@/components/LeaderboardClient";

export const metadata: Metadata = {
  title: "AI Ecosystem Leaderboard — AI Orbit",
  description:
    "Discover and track the top-ranked AI tools, language models, and leading companies in the global AI ecosystem.",
};

export default function LeaderboardPage() {
  return (
    <div className="flex flex-col flex-1">

      <div className="relative z-[60]">
        <Suspense fallback={<div className="h-[300px]" />}><GlobalHero /></Suspense>
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        <Suspense fallback={
          <main className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8 py-12 flex-1">
            <div className="mb-10 h-16 animate-pulse bg-[#131316] rounded-xl border border-[#232326]" />
            <div className="h-96 animate-pulse rounded-2xl border border-[#232326] bg-[#131316]/50" />
          </main>
        }>
          <LeaderboardClient />
        </Suspense>
      </div>

    </div>
  );
}
