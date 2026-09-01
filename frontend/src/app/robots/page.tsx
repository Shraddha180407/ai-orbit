import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { GlobalHero } from "@/components/GlobalHero";
import { Footer } from "@/components/Footer";
import { RobotsClient } from "@/components/robots-client";

export const metadata: Metadata = {
  title: "Humanoid & Autonomous Robotics Directory",
  description:
    "Explore advanced bipedal, wheeled, and multi-joint humanoid agents and custom autonomous robots.",
};

export default function RobotsPage() {
  return (
    <div className="flex flex-col flex-1">

      <div className="relative z-[60]">
        <Suspense fallback={<div className="h-[300px]" />}><GlobalHero /></Suspense>
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
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
          <RobotsClient />
        </Suspense>
      </div>

    </div>
  );
}
