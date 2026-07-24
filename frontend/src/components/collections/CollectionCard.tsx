import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bookmark, Boxes, Building2, Cpu } from "lucide-react";
import type { CollectionListItem } from "@/lib/types";
import { toggleBookmark } from "@/lib/collections";



interface Props {
  collection: CollectionListItem;
}

export function CollectionCard({ collection }: Props) {
  const [bookmarked, setBookmarked] = useState(collection.isBookmarked ?? false);
  const [pending, setPending] = useState(false);

  const categoryLabel = collection.categories
    .slice(0, 3)
    .map((c) => c.categoryName)
    .join(" • ");

  const handleBookmark = async () => {
    if (pending) return;
    const next = !bookmarked;
    setBookmarked(next); // optimistic
    setPending(true);
    try {
      const confirmed = await toggleBookmark(collection.id, bookmarked);
      setBookmarked(confirmed);
    } catch {
      setBookmarked(!next); // revert on failure
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="group relative rounded-xl border border-border bg-surface px-5 py-4 transition-all hover:border-accent/30 hover:bg-surface/70">
      <Link
        href={`/collections/${collection.slug}`}
        className="flex items-start justify-between gap-4"
      >
        <div className="min-w-0 flex-1">
          {/* Title */}
          <div className="flex items-center gap-2">
            <h2 className="truncate text-base font-semibold text-foreground group-hover:text-accent">
              {collection.name}
            </h2>

            {collection.isFeatured && (
              <span className="shrink-0 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent">
                Featured
              </span>
            )}
          </div>

          {/* Description */}
          {collection.description && (
            <p className="mt-1 line-clamp-1 text-sm text-foreground-muted">
              {collection.description}
            </p>
          )}

          {/* Creator + categories */}
          <div className="mt-2 flex items-center gap-2 text-sm">
            {collection.creator.image ? (
              <Image
                src={collection.creator.image}
                alt=""
                width={20}
                height={20}
                className="rounded-full"
              />
            ) : (
              <div className="h-5 w-5 shrink-0 rounded-full bg-muted" />
            )}

            <span className="font-medium text-foreground">
              {collection.creator.name}
            </span>

            {categoryLabel && (
              <>
                <span className="text-foreground-muted">•</span>
                <span className="truncate text-foreground-muted">
                  {categoryLabel}
                </span>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="mt-3 flex flex-wrap gap-5 text-xs text-foreground-muted">
            <span className="flex items-center gap-1">
              <Boxes size={14} />
              {collection.toolCount} Tools
            </span>

            <span className="flex items-center gap-1">
              <Cpu size={14} />
              {collection._count.relatedModels} Models
            </span>

            <span className="flex items-center gap-1">
              <Building2 size={14} />
              {collection._count.relatedCompanies} Companies
            </span>
          </div>
        </div>
      </Link>

      <button
        type="button"
        aria-label={`Bookmark ${collection.name}`}
        onClick={() => {
          // handle bookmark logic here
        }}
        className="absolute right-4 top-4 rounded-lg p-2 text-foreground-muted transition-colors hover:bg-muted hover:text-accent"
      >
        <Bookmark size={18} />
      </button>
    </div>
  );
}