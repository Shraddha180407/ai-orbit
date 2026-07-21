"use client";

import { useMemo, useState } from "react";

import { CollectionGrid } from "@/components/collections/CollectionGrid";
import { CollectionSearch } from "@/components/collections/CollectionSearch";
import CollectionFilters from "@/components/collections/CollectionFilters";
import { CollectionsHeader } from "@/components/collections/CollectionHeader";
import { CollectionsClosingCTA } from "@/components/collections/CollectionsClosingCTA";
import { LoadMoreButton } from "@/components/collections/LoadMoreButton";
import { mockCollections } from "@/lib/mockCollections";
import type { CollectionListItem } from "@/lib/types";


export default function CollectionsPageClient() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recently_updated");
  const [creatorType, setCreatorType] = useState("");

  // Mock data (replace with API later)
  const items: CollectionListItem[] = useMemo(() => {
    let filtered = [...mockCollections];

    // Search
    if (search.trim()) {
      const query = search.toLowerCase();

      filtered = filtered.filter((collection) => {
        return (
          collection.name.toLowerCase().includes(query) ||
          collection.description?.toLowerCase().includes(query) ||
          collection.creator.name.toLowerCase().includes(query)
        );
      });
    }

    // Creator Type
    if (creatorType) {
      filtered = filtered.filter(
        (collection) => collection.creatorType === creatorType
      );
    }

    // Sort
    switch (sort) {
      case "name_asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;

      case "name_desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;

      case "most_tools":
        filtered.sort((a, b) => b.toolCount - a.toolCount);
        break;

      case "fewest_tools":
        filtered.sort((a, b) => a.toolCount - b.toolCount);
        break;

      case "oldest_updated":
        filtered.sort(
          (a, b) =>
            new Date(a.updatedAt).getTime() -
            new Date(b.updatedAt).getTime()
        );
        break;

      case "recently_updated":
      default:
        filtered.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() -
            new Date(a.updatedAt).getTime()
        );
    }

    return filtered;
  }, [search, sort, creatorType]);

  return (
    <>
      <CollectionsHeader />

      <main className="mx-auto max-w-7xl px-6 pb-16">
        {/* Search */}
        <div className="mb-6">
          <CollectionSearch
            value={search}
            onChange={setSearch}
          />
        </div>

        {/* Filters */}
        <div className="mb-10">
          <CollectionFilters
            sort={sort}
            setSort={setSort}
            creatorType={creatorType}
            setCreatorType={setCreatorType}
          />
        </div>

        {/* Grid */}
        <CollectionGrid collections={items} />

        {/* Hidden for mock data */}
        {false && (
          <LoadMoreButton
            loading={false}
            disabled={false}
            onClick={() => {}}
          />
        )}

        <CollectionsClosingCTA />
      </main>
    </>
  );
}