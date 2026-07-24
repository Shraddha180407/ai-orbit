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

  return (
    <>
      <CollectionsHeader />

      <main className="mx-auto max-w-7xl px-6 pb-16">
        <div className="mb-6 flex items-center gap-3">
          <CollectionSearch value={search} onChange={setSearch} />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-10 rounded-lg border border-[#232326] bg-[#18181B] px-3 text-xs text-white"
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
            className="h-10 rounded-lg border border-[#232326] bg-[#18181B] px-4 text-xs font-semibold text-white"
          >
            Filters
          </button>
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
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-sm text-[#A1A1AA]">
            Loading collections…
          </div>
        ) : (
          <CollectionGrid collections={items} />
        )}

        {cursor && !loading && (
          <LoadMoreButton
            loading={loadingMore}
            disabled={loadingMore}
            onClick={handleLoadMore}
          />
        )}

        <CollectionsClosingCTA />
      </main>
    </>
  );
}