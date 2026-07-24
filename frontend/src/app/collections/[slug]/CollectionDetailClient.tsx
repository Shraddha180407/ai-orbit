"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Tag, Clock } from "lucide-react";
import { StackedLogos } from "@/components/StackedLogos";
import { ToolGrid } from "@/components/ToolGrid";
import { EmptyState } from "@/components/EmptyState";
import { API_URL } from "@/lib/api";
import type { CollectionDetailData } from "@/lib/types";

export function CollectionDetailClient({ slug }: { slug: string }) {
  const [collection, setCollection] = useState<CollectionDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchCollection() {
      setIsLoading(true);
      setNotFound(false);
      try {
        const res = await fetch(`${API_URL}/api/v1/collections/${slug}`);
        if (cancelled) return;
        if (res.status === 404) {
          setNotFound(true);
          setCollection(null);
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setCollection(data);
        }
      } catch (error) {
        console.error("Failed to fetch collection:", error);
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchCollection();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <main className="collections-scope min-h-screen pb-20">
      <div className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-container items-center justify-between px-6 py-3">
          <Link href="/collections" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-background">
              S
            </span>
            <span className="text-base font-bold text-foreground">The AI Signal</span>
          </Link>
          <Link
            href="/collections"
            className="flex items-center gap-1.5 text-sm text-foreground-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft size={15} />
            All collections
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-container px-6 pt-6">
        {isLoading ? (
          <>
            <div className="h-8 w-64 animate-pulse rounded bg-[#131316]" />
            <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded bg-[#131316]" />
            <div className="mt-10 h-40 animate-pulse rounded-xl border border-[#232326] bg-[#131316]/50" />
          </>
        ) : notFound || !collection ? (
          <EmptyState
            title="Collection not found"
            description="This collection may have been renamed or removed. Browse all collections instead."
            action={
              <Link
                href="/collections"
                className="rounded-md bg-white px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                Browse collections
              </Link>
            }
          />
        ) : (
          <>
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs uppercase tracking-widest text-accent">
                  {collection.category}
                </span>
                {collection.featured && (
                  <span
                    className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
                    style={{ color: "var(--collections-gold)", backgroundColor: "var(--collections-gold-muted)" }}
                  >
                    <Sparkles size={11} />
                    Featured
                  </span>
                )}
              </div>
              <h1 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">{collection.title}</h1>
              <p className="mt-3 text-foreground-muted">{collection.description}</p>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-foreground-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Tag size={13} />
                  Curated by {collection.curatedBy}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={13} />
                  Updated{" "}
                  {new Date(collection.updatedAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span>{collection.toolCount} tools</span>
              </div>

              {collection.tools.length > 0 && (
                <div className="mt-6">
                  <StackedLogos tools={collection.tools} size={48} />
                </div>
              )}
            </div>

            <div className="mt-10">
              <ToolGrid tools={collection.tools} />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
