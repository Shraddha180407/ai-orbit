import Link from "next/link";
import { ArrowUpRight, Boxes, Building2, Cpu } from "lucide-react";
import type { CollectionListItem } from "@/lib/types";

interface Props {
  collection: CollectionListItem;
}

export function CollectionCard({ collection }: Props) {
  return (
    <Link
      href={`/collections/${collection.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-all duration-200 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_10px_40px_rgba(124,92,252,0.15)]"
    >
      {/* Featured Badge */}
      {collection.isFeatured && (
        <div className="mb-4">
          <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
            Featured
          </span>
        </div>
      )}

      {/* Title */}
      <h2 className="text-lg font-semibold text-foreground transition-colors group-hover:text-accent">
        {collection.name}
      </h2>

      {/* Description */}
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-foreground-muted">
        {collection.description}
      </p>

      {/* Categories */}
      {collection.categories.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {collection.categories.slice(0, 3).map((category) => (
            <span
              key={category.categoryName}
              className="rounded-full border border-border px-2.5 py-1 text-xs text-foreground-muted"
            >
              {category.categoryName}
            </span>
          ))}
        </div>
      )}

      {/* Creator */}
      <div className="mt-5 text-sm text-foreground-muted">
        Curated by{" "}
        <span className="font-medium text-foreground">
          {collection.creator.name}
        </span>
      </div>

      {/* Spacer */}
      <div className="flex-grow" />

      {/* Stats */}
      <div className="mt-6 flex items-center gap-5 border-t border-border pt-5 text-sm text-foreground-muted">
        <div className="flex items-center gap-1">
          <Boxes size={15} />
          {collection.toolCount}
        </div>

        <div className="flex items-center gap-1">
          <Cpu size={15} />
          {collection._count.relatedModels}
        </div>

        <div className="flex items-center gap-1">
          <Building2 size={15} />
          {collection._count.relatedCompanies}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-5 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground-muted transition-colors group-hover:text-accent">
          View Collection
        </span>

        <ArrowUpRight
          size={18}
          className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
        />
      </div>
    </Link>
  );
}