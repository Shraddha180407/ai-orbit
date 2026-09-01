import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { GlobalHero } from "@/components/GlobalHero";
import { Footer } from "@/components/Footer";
import { ModelsClient } from "@/components/models-client";

export const metadata: Metadata = {
  title: "AI Models Directory",
  description:
    "Explore state-of-the-art Large Language Models, neural architectures, parameter sizes, and release histories.",
};

export default function ModelsPage() {
  return (
    <div className="flex flex-col flex-1">

      <div className="relative z-[60]">
        <Suspense fallback={<div className="h-[300px]" />}><GlobalHero /></Suspense>
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        <Suspense
          fallback={
            <div className="w-full px-4 sm:px-6 lg:px-8 pt-6 pb-2 flex-1">
              <div className="mx-auto w-full max-w-[1600px]">
                <div className="overflow-x-auto rounded-lg border border-[#232326]/60 bg-[#131316]/10">
                  <div className="flex flex-col divide-y divide-[#232326]/60">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="grid grid-cols-[40px_minmax(220px,2.4fr)_minmax(130px,1.1fr)_minmax(110px,1fr)_minmax(130px,1.1fr)_minmax(110px,1fr)_minmax(110px,0.9fr)] min-w-[900px] items-center gap-4 px-4 py-2.5"
                      >
                        <div className="h-11 w-11 animate-pulse rounded-lg bg-[#18181C]" />
                        <div className="space-y-1.5">
                          <div className="h-3 w-40 animate-pulse rounded bg-[#18181C]" />
                          <div className="h-2 w-64 animate-pulse rounded bg-[#18181C]" />
                        </div>
                        <div className="h-3 w-20 animate-pulse rounded bg-[#18181C]" />
                        <div className="h-4 w-16 animate-pulse rounded bg-[#18181C]" />
                        <div className="h-3 w-24 animate-pulse rounded bg-[#18181C]" />
                        <div className="h-3 w-20 animate-pulse rounded bg-[#18181C]" />
                        <div className="h-4 w-12 animate-pulse rounded-full bg-[#18181C]" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          }
        >
          <ModelsClient />
        </Suspense>
      </div>

    </div>
  );
}
