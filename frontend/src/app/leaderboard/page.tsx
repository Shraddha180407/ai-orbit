import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LeaderboardClient } from "@/components/LeaderboardClient";


export const metadata: Metadata = {
  title: "AI Ecosystem Leaderboard — The AI Signal",
  description:
    "Discover and track the top-ranked AI tools, language models, and leading companies in the global AI ecosystem.",
};

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white">
      <Header />
      <Suspense fallback={
        <main className="mx-auto max-w-[1440px] px-8 py-12 flex-1">
          <div className="mb-10 h-16 animate-pulse bg-[#131316] rounded-xl border border-[#232326]" />
          <div className="h-96 animate-pulse rounded-2xl border border-[#232326] bg-[#131316]/50" />
        </main>
      }>
        <LeaderboardClient />
      </Suspense>
      <Footer />
    </div>
  );
}
