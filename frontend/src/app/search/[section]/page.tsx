import { Suspense } from "react";
import { notFound } from "next/navigation";
import { LoadingState } from "@/components/search/states/LoadingState";
import { getSectionBySlug, SECTIONS } from "@/lib/sections";
import { SectionPageContent } from "./SectionPageContent";

export async function generateStaticParams() {
  return SECTIONS.map((section) => ({
    section: section.slug,
  }));
}

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
