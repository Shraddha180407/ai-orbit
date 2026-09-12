import type { Metadata } from "next";
import { Suspense } from "react";
import { HomeClient } from "@/components/home-client";

export const metadata: Metadata = {
  title: "The AI Signal — Discover the AI Ecosystem",
  description:
    "Discover, compare, and explore the best AI tools, companies, models, and repositories in the global ecosystem.",
};

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center bg-[#000000]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    }>
      <HomeClient />
    </Suspense>
  );
}
