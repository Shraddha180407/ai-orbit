import { Suspense } from "react";
import { GlobalHero } from "@/components/GlobalHero";
import { ToolsClient } from "@/components/tools-client";

export function BusinessDirectory({
  defaultCategory,
}: {
  defaultCategory?: string;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="relative z-[60]">
        <Suspense fallback={<div className="h-[300px]" />}>
          <GlobalHero searchAction="/business" />
        </Suspense>
      </div>

      <section
        aria-labelledby="business-directory-heading"
        className="relative z-10 flex flex-1 flex-col"
      >
        <div className="mx-auto w-full max-w-[1600px] px-4 pb-2 pt-5 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A78BFA]">
            Business AI
          </p>
          <h1
            id="business-directory-heading"
            className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl"
          >
            AI tools for every business function
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-400">
            Explore tools for growth, sales, support, finance, operations,
            people teams, and the workflows that connect them.
          </p>
        </div>

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
