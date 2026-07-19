import type { Metadata } from "next";
import { Suspense } from "react";
import { CollectionsPageClient } from "./CollectionsPageClient";

export const metadata: Metadata = {
  title: "Collections — The AI Signal",
  description:
    "Curated bundles of the best AI tools, agents and models, hand-picked by category.",
};

export default function CollectionsPage() {
  return (
    <Suspense fallback={
      <main className="collections-scope min-h-screen pb-20">
        <div className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-container items-center justify-between px-6 py-3">
             <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-background">
                  S
                </span>
                <span className="text-base font-bold text-foreground">The AI Signal</span>
             </div>
          </div>
        </div>
        <div className="mx-auto max-w-container px-6 pt-6">
          <div className="h-60 animate-pulse rounded-xl border border-[#232326] bg-[#131316]/50" />
        </div>
      </main>
    }>
      <CollectionsPageClient />
    </Suspense>
  );
}
