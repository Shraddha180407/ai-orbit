import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { StackedLogos } from "@/components/StackedLogos";
import type { CollectionListItem } from "@/lib/types";

export function CollectionCard({ collection }: { collection: CollectionListItem }) {
  return (
    <Link
      href={`/collections/${collection.slug}`}
      className="group relative flex flex-col justify-between rounded-lg border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[0_12px_32px_-8px_rgba(124,92,252,0.25)]"
    >
      <div>
        <div className="mb-4 flex items-start justify-between">
          <StackedLogos tools={collection.previewTools} />
          {collection.featured && (
            <span
              className="rounded-full px-2.5 py-1 text-xs font-medium"
              style={{ color: "var(--collections-gold)", backgroundColor: "var(--collections-gold-muted)" }}
            >
              Featured
            </span>
          )}
        </div>

        <h3 className="font-semibold text-foreground transition-colors group-hover:text-accent">
          {collection.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-foreground-muted">{collection.description}</p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <span className="font-mono text-xs text-foreground-muted">{collection.toolCount} tools</span>
        <span className="flex items-center gap-1 text-xs font-medium text-foreground-muted transition-colors group-hover:text-accent">
          View collection
          <ArrowUpRight size={13} />
        </span>
      </div>
    </Link>
  );
}
