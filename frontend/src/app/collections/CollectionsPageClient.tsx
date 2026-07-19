"use client";

import { useState, useMemo } from "react";
import { CollectionSearch } from "@/components/CollectionSearch";
import { CollectionToolbar } from "@/components/CollectionToolbar";
import { CollectionListContainer } from "@/components/CollectionListContainer";
import type { CollectionListItem } from "@/lib/types";

interface CollectionsPageClientProps {
  initialCollections: CollectionListItem[];
}

export default function CollectionsPageClient({ 
  initialCollections 
}: CollectionsPageClientProps) {
  // 1. Layout View Settings State
  const [density, setDensity] = useState<"compact" | "comfortable">("comfortable");
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    category: true,
    tools: true,
  });

  // 2. Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");

  const toggleColumn = (column: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  // 3. Client-Side Filtering Engine
  // Fast, memoized evaluations matching title, curating author, or internal asset titles
  const filteredCollections = useMemo(() => {
    const target = searchTerm.trim().toLowerCase();
    if (!target) return initialCollections;

    return initialCollections.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(target);
      const matchCurator = item.curatedBy.toLowerCase().includes(target);
      const matchCategory = item.category.toLowerCase().includes(target);
      const matchTools = item.previewTools?.some((tool) => 
        tool.name.toLowerCase().includes(target)
      );

      return matchTitle || matchCurator || matchCategory || matchTools;
    });
  }, [searchTerm, initialCollections]);

  // 4. Derive Live Autosuggest Items
  // Pulls matching title structures dynamically to feed our dropdown options panel
  const searchSuggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return initialCollections
      .filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
      .map((item) => item.title)
      .slice(0, 4);
  }, [searchTerm, initialCollections]);

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 lg:px-8">
      {/* Page Header Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Curated Tool Collections
        </h1>
        <p className="mt-2 text-sm text-foreground-muted sm:text-base max-w-2xl">
          Discover hand-crafted directories and architecture blueprints assembled by domain specialists.
        </p>
      </div>

      {/* Control Deck Zone */}
      <div className="flex flex-col gap-2">
        <CollectionSearch 
          onSearchChange={setSearchTerm} 
          suggestions={searchSuggestions} 
        />
        
        <CollectionToolbar 
          density={density}
          setDensity={setDensity}
          visibleColumns={visibleColumns}
          toggleColumn={toggleColumn}
          totalCount={filteredCollections.length}
        />
      </div>

      {/* Main Virtualized Render Output Window */}
      {filteredCollections.length > 0 ? (
        <CollectionListContainer 
          collections={filteredCollections}
          density={density}
          visibleColumns={visibleColumns}
        />
      ) : (
        <div className="flex flex-col items-center justify-center border border-dashed border-border rounded-xl p-16 text-center bg-surface-raised/10">
          <div className="rounded-full bg-surface p-3 text-foreground-muted mb-4 border border-border">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-foreground">No collections found</h3>
          <p className="mt-1 text-xs text-foreground-muted max-w-xs">
            We couldn&apos;t find anything matching &ldquo;{searchTerm}&rdquo;. Try refining your search query or selecting another metadata focus.
          </p>
        </div>
      )}
    </div>
  );
}