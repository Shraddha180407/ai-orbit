"use client";

import { useEffect, useState } from "react";

import { CollectionGrid } from "@/components/collections/CollectionGrid";
import { CollectionSearch } from "@/components/collections/CollectionSearch";
import CollectionFilters from "@/components/collections/CollectionFilter";
import { CollectionsHeader } from "@/components/collections/CollectionHeader";
import { CollectionsClosingCTA } from "@/components/CollectionsClosingCTA";
import { LoadMoreButton } from "@/components/collections/LoadMoreButton";

import type { CollectionListItem } from "@/lib/types";

interface Props {
  initialItems: CollectionListItem[];
  initialNextCursor: string | null;
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8787/api/v1";

export default function CollectionsPageClient({
  initialItems,
  initialNextCursor,
}: Props) {
  const [items, setItems] = useState(initialItems);

  const [nextCursor, setNextCursor] =
    useState<string | null>(initialNextCursor);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [sort, setSort] =
    useState("recently_updated");

  const [creatorType, setCreatorType] =
    useState("");

  // ----------------------------
  // Search / Filter
  // ----------------------------

  useEffect(() => {
    async function fetchCollections() {
      setLoading(true);

      try {
        const params = new URLSearchParams();

        if (search.trim()) {
          params.set("search", search);
        }

        if (creatorType) {
          params.set("creatorType", creatorType);
        }

        params.set("sort", sort);

        const res = await fetch(
          `${API_BASE}/collections?${params.toString()}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch collections");
        }

        const data = await res.json();

        setItems(data.items);
        setNextCursor(data.nextCursor);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCollections();
  }, [search, creatorType, sort]);

  // ----------------------------
  // Pagination
  // ----------------------------

  async function fetchMore() {
    if (!nextCursor) return;

    setLoading(true);

    try {
      const params = new URLSearchParams();

      params.set("cursor", nextCursor);
      params.set("sort", sort);

      if (search) {
        params.set("search", search);
      }

      if (creatorType) {
        params.set("creatorType", creatorType);
      }

      const res = await fetch(
        `${API_BASE}/collections?${params.toString()}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch more collections");
      }

      const data = await res.json();

      setItems((prev) => [...prev, ...data.items]);

      setNextCursor(data.nextCursor);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

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

        {/* Loading */}
        {loading && items.length === 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-64 animate-pulse rounded-2xl border border-border bg-surface"
              />
            ))}
          </div>
        ) : (
          <>
            <CollectionGrid collections={items} />

            {nextCursor && (
              <LoadMoreButton
                loading={loading}
                disabled={loading}
                onClick={fetchMore}
              />
            )}
          </>
        )}

        <CollectionsClosingCTA />

      </main>
    </>
  );
}