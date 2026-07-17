"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCollectionDetail } from "@/lib/collections";
import { CollectionGrid } from "@/components/CollectionGrid";
import { StackedLogos } from "@/components/StackedLogos";
import { DetailToolCard } from "@/components/DetailToolCard";

export function CollectionDetailClient() {
  const params = useParams();
  const slug = params.slug as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCollectionDetail(slug).then((res) => {
      if (!res?.collection) notFound();
      setData(res);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <main className="collections-scope mx-auto max-w-container px-6 py-10">
        <div className="h-[60vh] animate-pulse rounded-xl border border-border bg-surface" />
      </main>
    );
  }

  if (!data?.collection) return null;

  const { collection, related } = data;
  const previewTools = collection.tools
    .slice(0, 4)
    .map((t: any) => ({ logoUrl: t.logoUrl, name: t.name }));
  const formattedDate = new Date(collection.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="collections-scope mx-auto max-w-container px-6 py-10">
      <Link
        href="/collections"
        className="inline-flex items-center gap-1.5 text-sm text-foreground-muted transition-colors hover:text-accent"
      >
        <ArrowLeft size={15} />
        All collections
      </Link>

      <div className="mt-6 border-b border-border pb-8">
        {collection.featured && (
          <span
            className="mb-3 inline-block rounded-full px-2.5 py-1 text-xs font-medium"
            style={{ color: "var(--collections-gold)", backgroundColor: "var(--collections-gold-muted)" }}
          >
            Featured
          </span>
        )}

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">{collection.title}</h1>
            <p className="mt-3 max-w-2xl text-foreground-muted">{collection.description}</p>
            <div className="mt-5 flex flex-wrap items-center gap-4 font-mono text-xs text-foreground-muted">
              <span>{collection.curatedBy}</span>
              <span>Updated {formattedDate}</span>
              <span>{collection.toolCount} tools</span>
            </div>
          </div>
          <StackedLogos tools={previewTools} size={56} />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {collection.tools.map((tool: any) => (
          <DetailToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="text-lg font-semibold text-foreground">Related collections</h2>
          <div className="mt-4">
            <CollectionGrid collections={related} />
          </div>
        </section>
      )}
    </main>
  );
}
