import type { Metadata } from "next";
export const dynamic = "force-dynamic";
export const runtime = "edge";
import { getCollections } from "@/lib/collections";
import { CategoryMenu } from "@/components/CategoryMenu";
import { CollectionGrid } from "@/components/CollectionGrid";
import { CollectionsClosingCTA } from "@/components/CollectionsClosingCTA";
import type { CollectionsSearchParams } from "@/lib/types";

export const metadata: Metadata = {
  title: "Collections — The AI Signal",
  description:
    "Curated bundles of the best AI tools, agents and models, hand-picked by category.",
};

type PageProps = {
  searchParams: Promise<CollectionsSearchParams>;
};

export default async function CollectionsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { items, pagination, categoryCounts } = await getCollections(params);

  return (
    <main className="collections-scope min-h-screen pb-20">
      {/* Sticky bar sits flush at the very top (top-0), matching the
          prototype exactly — not offset, since this page owns its own
          header here rather than stacking below a separate global one. */}
      <div className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-container items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-background">
              S
            </span>
            <span className="text-base font-bold text-foreground">The AI Signal</span>
          </div>
          <CategoryMenu categoryCounts={categoryCounts ?? {}} />
        </div>
      </div>

      <div className="mx-auto max-w-container px-6 pt-6">
        <div className="max-w-2xl">
          <span className="font-mono text-xs uppercase tracking-widest text-accent">
            Collections
          </span>
          <h1 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
            Curated bundles of the best AI tools
          </h1>
          <p className="mt-3 text-foreground-muted">
            Hand-picked sets of tools for a specific job — from shipping code faster to
            scaling a marketing team. {pagination.total} collections and counting. Browse
            by category using the menu above.
          </p>
        </div>

        <div className="mt-8">
          <CollectionGrid collections={items} />
        </div>

        <CollectionsClosingCTA />
      </div>
    </main>
  );
}
