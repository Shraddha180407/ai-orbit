"use client";

import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import { CollectionRow } from "./CollectionRow";
import type { CollectionListItem } from "@/lib/types";

interface CollectionListContainerProps {
  collections: CollectionListItem[];
  density: "compact" | "comfortable";
  visibleColumns: Record<string, boolean>;
}

export function CollectionListContainer({ collections, density, visibleColumns }: CollectionListContainerProps) {
  const listRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useWindowVirtualizer({
    count: collections.length,
    estimateSize: () => (density === "compact" ? 68 : 88),
    scrollMargin: listRef.current?.offsetTop ?? 0,
    overscan: 6,
  });

  return (
    <div ref={listRef} className="w-full border border-border rounded-xl overflow-hidden bg-background">
      <div
        className="relative w-full"
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const item = collections[virtualRow.index];
          return (
            <div
              key={item.id}
              data-index={virtualRow.index}
              ref={rowVirtualizer.measureElement}
              className="absolute left-0 top-0 w-full"
              style={{
                transform: `translateY(${virtualRow.start - rowVirtualizer.options.scrollMargin}px)`,
              }}
            >
              <CollectionRow 
                collection={item} 
                density={density} 
                visibleColumns={visibleColumns} 
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}