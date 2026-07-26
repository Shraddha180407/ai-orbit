"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CollectionGrid } from "@/components/collections/CollectionGrid";
import { CollectionSearch } from "@/components/collections/CollectionSearch";
import CollectionFilters from "@/components/collections/CollectionFilters";
import { CollectionsHeader } from "@/components/collections/CollectionHeader";
import { CollectionsClosingCTA } from "@/components/collections/CollectionsClosingCTA";
import { LoadMoreButton } from "@/components/collections/LoadMoreButton";
import { fetchCollections } from "@/lib/collections";
import type { CollectionListItem, CreatorType } from "@/lib/types";

// Delay before firing a search request, so we don't hit the API on every keystroke
const SEARCH_DEBOUNCE_MS = 350;

interface Props {
  initialItems?: CollectionListItem[];
  initialNextCursor?: string | null;
}

export default function CollectionsPageClient({ initialItems, initialNextCursor }: Props = {}) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("recently_updated");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [creatorType, setCreatorType] = useState<CreatorType | undefined>(undefined);
  const [updatedWithin, setUpdatedWithin] = useState("");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [hasRelatedModels, setHasRelatedModels] = useState(false);
  const [hasRelatedCompanies, setHasRelatedCompanies] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [items, setItems] = useState<CollectionListItem[]>(initialItems ?? []);
  const [cursor, setCursor] = useState<string | null>(initialNextCursor ?? null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const hasInitialData = useRef(initialItems != null);

  // Debounce search input
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [search]);

  const filterParams = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      creatorType,
      hasRelatedModels: hasRelatedModels || undefined,
      hasRelatedCompanies: hasRelatedCompanies || undefined,
      featured: featuredOnly || undefined,
      updatedWithin: updatedWithin || undefined,
      category: selectedCategories.length ? selectedCategories : undefined,
      sort,
    }),
    [
      debouncedSearch,
      creatorType,
      hasRelatedModels,
      hasRelatedCompanies,
      featuredOnly,
      updatedWithin,
      selectedCategories,
      sort,
    ]
  );

  // Fetch first page whenever filters/search/sort change
  useEffect(() => {
    // Skip the initial fetch when server-provided data already covers the defaults
    if (hasInitialData.current) {
      hasInitialData.current = false;
      return;
    }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);
    fetchCollections(filterParams, controller.signal)
      .then((data) => {
        setItems(data.items);
        setCursor(data.nextCursor);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [filterParams]);

  const handleLoadMore = async () => {
    if (!cursor) return;
    setLoadingMore(true);
    setError(null);
    try {
      const data = await fetchCollections({ ...filterParams, cursor });
      setItems((prev) => [...prev, ...data.items]);
      setCursor(data.nextCursor);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  };

  const resetFilters = () => {
    setCreatorType(undefined);
    setUpdatedWithin("");
    setFeaturedOnly(false);
    setHasRelatedModels(false);
    setHasRelatedCompanies(false);
    setSelectedCategories([]);
  };

  const hasActiveFilters =
    !!creatorType ||
    !!updatedWithin ||
    featuredOnly ||
    hasRelatedModels ||
    hasRelatedCompanies ||
    selectedCategories.length > 0;

  const activeFilterCount =
    (creatorType ? 1 : 0) +
    (updatedWithin ? 1 : 0) +
    (featuredOnly ? 1 : 0) +
    (hasRelatedModels ? 1 : 0) +
    (hasRelatedCompanies ? 1 : 0) +
    selectedCategories.length;

  return (
    <>
      <CollectionsHeader />

      <main className="w-full px-4 sm:px-6 lg:px-8 pb-16 max-w-7xl mx-auto">
        {/* Controls row */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex-1 min-w-[240px]">
            <CollectionSearch value={search} onChange={setSearch} />
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-11 rounded-xl border border-[#232326] bg-[#0D0D0F] px-3 text-xs text-white focus:outline-none focus:border-[#6E56CF] transition-colors"
          >
            <option value="recently_updated">Recently Updated</option>
            <option value="oldest_updated">Oldest Updated</option>
            <option value="name_asc">Name A–Z</option>
            <option value="name_desc">Name Z–A</option>
            <option value="most_tools">Most Tools</option>
            <option value="fewest_tools">Fewest Tools</option>
            <option value="most_bookmarked">Most Bookmarked</option>
            <option value="featured_first">Featured First</option>
          </select>

          <button
            onClick={() => setIsFilterOpen(true)}
            className={`h-11 flex items-center gap-2 rounded-xl border px-4 text-xs font-semibold transition-colors ${
              hasActiveFilters
                ? "border-[#6E56CF] bg-[#6E56CF]/10 text-[#6E56CF]"
                : "border-[#232326] bg-[#0D0D0F] text-white hover:border-[#6E56CF]/60"
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="11" y1="18" x2="13" y2="18" />
            </svg>
            Filters
            {activeFilterCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#6E56CF] px-1 text-[10px] text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="h-11 rounded-xl border border-[#232326] bg-[#0D0D0F] px-3 text-xs text-[#A1A1AA] hover:text-white hover:border-[#6E56CF]/60 transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        <CollectionFilters
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          creatorType={creatorType}
          onCreatorTypeChange={setCreatorType}
          updatedWithin={updatedWithin}
          onUpdatedWithinChange={setUpdatedWithin}
          featuredOnly={featuredOnly}
          onFeaturedOnlyChange={setFeaturedOnly}
          hasRelatedModels={hasRelatedModels}
          onHasRelatedModelsChange={setHasRelatedModels}
          hasRelatedCompanies={hasRelatedCompanies}
          onHasRelatedCompaniesChange={setHasRelatedCompanies}
          selectedCategories={selectedCategories}
          onCategoriesChange={setSelectedCategories}
          onReset={resetFilters}
        />

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 animate-pulse bg-[#131316] rounded-xl border border-[#232326]/60" />
            ))}
          </div>
        ) : (
          <CollectionGrid collections={items} />
        )}

        {cursor && !loading && (
          <div className="flex justify-center mt-6">
            <LoadMoreButton loading={loadingMore} disabled={loadingMore} onClick={handleLoadMore} />
          </div>
        )}

        <CollectionsClosingCTA />
      </main>
    </>
  );
}