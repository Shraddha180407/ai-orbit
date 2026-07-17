'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/SearchBar";
import { TopFilters } from "@/components/TopFilters";
import { SortDropdown } from "@/components/SortDropdown";
import { ToolGrid } from "@/components/ToolGrid";
import { Pagination } from "@/components/Pagination";
import { API_URL } from "@/lib/api";
import type { SortOption } from "@/lib/types";

export function ToolsClient() {
  const searchParams = useSearchParams();

  const [tools, setTools] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const params = {
    q: searchParams.get("q") || undefined,
    category: searchParams.get("category") || undefined,
    pricing: searchParams.get("pricing") || undefined,
    sort: (searchParams.get("sort") || undefined) as SortOption | undefined,
    page: searchParams.get("page") || undefined,
  };

  useEffect(() => {
    async function fetchTools() {
      setIsLoading(true);
      try {
        const query = new URLSearchParams();
        if (params.q) query.set("q", params.q);
        if (params.category) query.set("category", params.category);
        if (params.pricing) query.set("pricing", params.pricing);
        if (params.sort) query.set("sort", params.sort);
        if (params.page) query.set("page", params.page);

        const res = await fetch(`${API_URL}/api/v1/tools?${query.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setTools(data.tools || []);
          setTotal(data.total || 0);
          setPage(data.page || 1);
          setTotalPages(data.totalPages || 1);
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error("Failed to fetch tools:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTools();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  return (
    <main className="mx-auto max-w-[1070px] px-6 py-10">
      <header className="mb-8 flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">AI Tools</h1>
          <p className="mt-1 text-sm text-foreground-muted">
            {total} tool{total === 1 ? "" : "s"} across every category
          </p>
        </div>
        <SearchBar defaultValue={params.q} />
      </header>

      <TopFilters categories={categories} params={params} />

      <div className="space-y-6">
        <div className="flex items-center justify-end">
          <SortDropdown />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1,2,3,4,5,6,7,8].map((i) => (
              <div key={i} className="h-48 animate-pulse rounded-xl border border-[#232326] bg-[#131316]" />
            ))}
          </div>
        ) : (
          <>
            <ToolGrid tools={tools} />
            <Pagination page={page} totalPages={totalPages} params={params} />
          </>
        )}
      </div>
    </main>
  );
}
