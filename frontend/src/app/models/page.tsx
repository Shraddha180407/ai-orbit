import type { Metadata } from "next";
import { Suspense } from "react";
import { GlobalHero } from "@/components/GlobalHero";
import { ModelsClient } from "@/components/models-client";

export const metadata: Metadata = {
  title: "AI Models Directory",
  description:
    "Explore state-of-the-art Large Language Models, neural architectures, parameter sizes, and release histories.",
};

// Mirrors ModelListView's own 8-column grid (logo, name, company, type,
// primary task, released, open source, compare) so the Suspense fallback
// and the real table line up with no layout shift when the client
// component mounts.
const SKELETON_COL_TEMPLATE =
  "grid-cols-[40px_minmax(180px,2.2fr)_minmax(110px,1fr)_minmax(90px,0.85fr)_minmax(110px,1fr)_minmax(100px,0.9fr)_minmax(90px,0.8fr)_minmax(100px,0.85fr)]";
const SKELETON_COL_MIN_WIDTH = "min-w-[960px]";

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
                <div className="overflow-x-auto touch-scroll-x rounded-lg border border-[#232326]/60 bg-[#131316]/10">
                  <div className="flex flex-col divide-y divide-[#232326]/60">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`grid ${SKELETON_COL_TEMPLATE} ${SKELETON_COL_MIN_WIDTH} items-center gap-3 px-4 py-2.5`}
                      >
                        <div className="h-10 w-10 animate-pulse rounded-lg bg-[#18181C]" />
                        <div className="space-y-1.5">
                          <div className="h-3 w-40 animate-pulse rounded bg-[#18181C]" />
                          <div className="h-2 w-64 animate-pulse rounded bg-[#18181C]" />
                        </div>
                        <div className="h-3 w-20 animate-pulse rounded bg-[#18181C]" />
                        <div className="h-4 w-16 animate-pulse rounded bg-[#18181C]" />
                        <div className="h-3 w-24 animate-pulse rounded bg-[#18181C]" />
                        <div className="h-3 w-20 animate-pulse rounded bg-[#18181C]" />
                        <div className="h-4 w-12 animate-pulse rounded-full bg-[#18181C]" />
                        <div className="ml-auto h-5 w-16 animate-pulse rounded-md bg-[#18181C]" />
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
