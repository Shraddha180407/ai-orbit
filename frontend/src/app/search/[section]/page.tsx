import { Suspense } from "react";
import { notFound } from "next/navigation";
import { LoadingState } from "@/components/search/states/LoadingState";
import { getSectionBySlug } from "@/lib/sections";
import { SectionPageContent } from "./SectionPageContent";

export const runtime = "edge";

export default async function SectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const config = getSectionBySlug(section);
  if (!config) notFound();

  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <LoadingState />
        </main>
      }
    >
      <SectionPageContent slug={config.slug} />
    </Suspense>
  );
}
