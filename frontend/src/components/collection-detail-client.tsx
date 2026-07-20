'use client';

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import Star from 'lucide-react/dist/esm/icons/star';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';
import { CollectionGrid } from "@/components/collections/CollectionGrid";
import { API_URL } from "@/lib/api";

export function CollectionDetailClient() {
  const params = useParams();
  const slug = params.slug as string;

  const [collection, setCollection] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    async function fetchCollection() {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/v1/collections/${slug}`);
        if (!res.ok) {
          setNotFoundState(true);
          return;
        }
        const data = await res.json();
        if (!data?.collection) {
          setNotFoundState(true);
          return;
        }
        setCollection(data.collection);
        setRelated(data.related || []);
      } catch (error) {
        console.error("Failed to fetch collection:", error);
        setNotFoundState(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCollection();
  }, [slug]);

  // Update page title
  useEffect(() => {
    if (collection) {
      document.title = `${collection.title} — Collections | The AI Signal`;
    }
  }, [collection]);

  if (notFoundState) {
    notFound();
  }

  if (isLoading || !collection) {
    return (
      <main className="mx-auto max-w-container px-6 py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-4 w-24 rounded bg-[#232326]" />
          <div className="h-8 w-64 rounded bg-[#232326]" />
          <div className="h-4 w-96 rounded bg-[#232326]" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 rounded-lg border border-border bg-surface" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-container px-6 py-10">
      <Link
        href="/collections"
        className="inline-flex items-center gap-1.5 text-sm text-foreground-muted hover:text-accent transition-colors"
      >
        <ArrowLeft size={15} />
        All collections
      </Link>

      <div className="mt-6 border-b border-border pb-8">
        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">{collection.title}</h1>
        <p className="mt-3 max-w-2xl text-foreground-muted">{collection.description}</p>
        <div className="mt-4 flex items-center gap-4 text-xs text-foreground-muted">
          <span>{collection.curatedBy}</span>
          <span>{collection.toolCount} tools</span>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {collection.tools.map((tool: any) => (
          <div
            key={tool.id}
            className="flex flex-col rounded-lg border border-border bg-surface p-5"
          >
            <div className="flex items-center gap-3">
              {tool.logoUrl && (
                <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-surface-raised">
                  <Image src={tool.logoUrl} alt="" fill sizes="40px" className="object-contain p-1" unoptimized />
                </div>
              )}
              <div>
                <h4 className="font-medium text-foreground">{tool.name}</h4>
                {tool.avgRating != null && (
                  <div className="flex items-center gap-1 text-xs text-foreground-muted">
                    <Star size={11} className="fill-current" />
                    {tool.avgRating.toFixed(1)}
                  </div>
                )}
              </div>
            </div>
            <p className="mt-3 line-clamp-2 text-sm text-foreground-muted">{tool.description}</p>
            <a
              href={tool.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-foreground-muted transition-colors hover:border-accent/50 hover:text-accent"
            >
              Visit website
              <ExternalLink size={12} />
            </a>
          </div>
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
