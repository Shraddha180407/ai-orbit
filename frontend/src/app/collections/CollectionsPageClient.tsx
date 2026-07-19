'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CategoryMenu } from "@/components/CategoryMenu";
import { CollectionGrid } from "@/components/CollectionGrid";
import { CollectionsClosingCTA } from "@/components/CollectionsClosingCTA";
import { API_URL } from "@/lib/api";

export function CollectionsPageClient() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCollections() {
      setIsLoading(true);
      try {
        const query = new URLSearchParams(searchParams.toString());
        const res = await fetch(`${API_URL}/api/v1/collections?${query.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setItems(data.items || []);
          setTotal(data.pagination?.total || 0);
          setCategoryCounts(data.categoryCounts || {});
        }
      } catch (error) {
        console.error("Failed to fetch collections:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCollections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  return (
    <main className="collections-scope min-h-screen pb-20">
      <div className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-container items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-background">
              S
            </span>
            <span className="text-base font-bold text-foreground">The AI Signal</span>
          </div>
          <CategoryMenu categoryCounts={categoryCounts} />
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
            scaling a marketing team. {total} collections and counting. Browse
            by category using the menu above.
          </p>
        </div>

        <div className="mt-8">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-40 animate-pulse rounded-xl border border-[#232326] bg-[#131316]" />
              ))}
            </div>
          ) : (
            <CollectionGrid collections={items} />
          )}
        </div>

        <CollectionsClosingCTA />
      </div>
    </main>
  );
}
