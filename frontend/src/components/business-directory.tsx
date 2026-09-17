import { Suspense } from "react";
import HeroGeometric from "@/components/mvpblocks/geometric-hero";
import { ToolsClient } from "@/components/tools-client";

export function BusinessDirectory({
  defaultCategory,
}: {
  defaultCategory?: string;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <HeroGeometric />

      <section
        aria-label="Business AI tools"
        className="relative z-10 flex flex-1 flex-col"
      >
        <Suspense fallback={<div className="min-h-[400px]" />}>
          <ToolsClient
            defaultMode="business"
            defaultCategory={defaultCategory}
          />
        </Suspense>
      </section>
    </div>
  );
}
