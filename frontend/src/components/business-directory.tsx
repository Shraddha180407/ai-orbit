import { Suspense } from "react";
import { DirectoryNavStrip } from "@/components/DirectoryNavStrip";
import HeroGeometric from "@/components/mvpblocks/geometric-hero";
import { ToolsClient } from "@/components/tools-client";

export function BusinessDirectory({
  defaultCategory,
}: {
  defaultCategory?: string;
}) {
  return (
    <div
      className="relative isolate flex flex-1 flex-col overflow-hidden bg-[#07070a]"
      style={{
        background:
          "radial-gradient(circle at 8% 18%, rgba(110, 86, 207, 0.18), transparent 30%), radial-gradient(circle at 92% 28%, rgba(34, 211, 238, 0.11), transparent 32%), linear-gradient(180deg, #0b0b10 0%, #050507 100%)",
      }}
    >
      <HeroGeometric />
      <DirectoryNavStrip defaultCategory={defaultCategory} />

      <section
        aria-label="Business AI tools"
        className="relative z-10 flex flex-1 flex-col"
      >
        <Suspense fallback={<div className="min-h-[400px]" />}>
          <ToolsClient
            defaultMode="business"
            defaultCategory={defaultCategory}
            showCategories={false}
          />
        </Suspense>
      </section>
    </div>
  );
}
