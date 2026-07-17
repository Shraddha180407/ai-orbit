import { CollectionCard } from "@/components/CollectionCard";
import { EmptyState } from "@/components/EmptyState";
import type { CollectionListItem } from "@/lib/types";

export function CollectionGrid({ collections }: { collections: CollectionListItem[] }) {
  if (collections.length === 0) {
    return (
      <EmptyState
        title="No collections match this filter"
        description="Try a different category, or check back later — new collections are added regularly."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {collections.map((c) => (
        <CollectionCard key={c.id} collection={c} />
      ))}
    </div>
  );
}
