import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { GlobalHero } from "@/components/GlobalHero";
import { Footer } from "@/components/Footer";
import { RepositoriesClient } from "@/components/repositories-client";

export const metadata: Metadata = {
  title: "Trending AI GitHub Repositories",
  description:
    "Discover trending open-source AI libraries, developer tools, and machine learning repositories on GitHub.",
};

export default function RepositoriesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white">
      <Header />
      <Suspense fallback={<div className="h-[300px]" />}><GlobalHero /></Suspense>
      <Suspense fallback={
        <main className="mx-auto max-w-[1440px] px-8 py-12 flex-1">
          <div className="mb-10 h-16 animate-pulse bg-[#131316] rounded-xl border border-[#232326]" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-44 animate-pulse rounded-2xl border border-[#232326] bg-[#131316]/50" />
            ))}
          </div>
        </main>
      }>
        <RepositoriesClient />
      </Suspense>
      <Footer />
    </div>
  );
}
