import { CollectionCard } from "./CollectionCard";
import type { CollectionListItem } from "@/lib/types";

interface Props {
  collections: CollectionListItem[];
}

export function CollectionGrid({ collections }: Props) {
  if (collections.length === 0) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-border bg-surface">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground">
            No collections found
          </h3>

          <p className="mt-2 text-sm text-foreground-muted">
            Try changing your search or filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      {collections.map((collection) => (
        <CollectionCard
          key={collection.id}
          collection={collection}
        />
      ))}
    </section>
  );
}