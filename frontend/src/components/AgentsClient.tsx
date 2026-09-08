"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import { AgentListView } from "@/components/AgentListView";
import { API_URL } from "@/lib/api";

type AgentCategory = {
  name: string;
  slug: string;
};

export function AgentsClient() {
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );

  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("category") || ""
  );

  const subCatRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    setActiveCategory(searchParams.get("category") || "");
    setCurrentPage(Number(searchParams.get("page")) || 1);
  }, [searchParams]);

  const { data: categoriesData } = useQuery<AgentCategory[]>({
    queryKey: ["agent-categories"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/v1/agents/categories`);

      if (!res.ok) return [];

      return res.json();
    },
    staleTime: 10 * 60 * 1000,
  });

  const q = searchParams.get("q") || undefined;
  const pricing = searchParams.get("pricing") || undefined;
  const sort = searchParams.get("sort") || undefined;

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: [
      "agents",
      activeCategory,
      q,
      pricing,
      sort,
      currentPage,
    ],

    queryFn: async () => {
      const params = new URLSearchParams();

      if (activeCategory) {
        params.set("category", activeCategory);
      }

      if (q) {
        params.set("q", q);
      }

      if (pricing) {
        params.set("pricing", pricing);
      }

      if (sort) {
        params.set("sort", sort);
      }

      params.set("page", String(currentPage));
      params.set("limit", "200");

      const res = await fetch(
        `${API_URL}/api/v1/agents?${params.toString()}`
      );

      if (!res.ok) {
        return {
          tools: [],
          totalPages: 1,
        };
      }

      return res.json();
    },

    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });

  const agents = data?.tools || [];
  const totalPages = data?.totalPages || 1;

  const categories = useMemo(
    () => [
      {
        name: "All",
        slug: "",
      },
      ...(Array.isArray(categoriesData) ? categoriesData : []),
    ],
    [categoriesData]
  );

  const handleCategoryChange = (slug: string) => {
    setActiveCategory(slug);
    setCurrentPage(1);

    const params = new URLSearchParams(searchParams.toString());

    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }

    params.delete("page");

    const query = params.toString();

    window.history.pushState(
      null,
      "",
      query ? `/agents?${query}` : "/agents"
    );

    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);

    document
      .getElementById("agents")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      id="agents"
      className="scroll-mt-28 w-full px-4 sm:px-6 lg:px-8 pt-2 pb-6"
    >
      <div className="mx-auto w-full max-w-[1600px] space-y-4">

        <div className="mb-2 -mx-4 sm:mx-0 px-4 sm:px-0 flex items-center justify-start gap-1.5 touch-scroll-x pb-2.5 scrollbar-none w-auto sm:w-full overflow-x-auto">
          {categories.map((category) => {
            const selected = activeCategory === category.slug;

            return (
              <button
                key={category.slug || "all"}
                ref={(el) => {
                  subCatRefs.current[category.slug] = el;
                }}
                onClick={() => handleCategoryChange(category.slug)}
                className={`rounded-full px-3.5 py-1 text-[12px] font-semibold whitespace-nowrap transition-all duration-200 border ${
                  selected
                    ? "bg-white text-black border-white shadow-lg shadow-white/5"
                    : "text-neutral-400 hover:text-white bg-[#131316]/50 border-[#232326]/60 hover:border-white/[0.15]"
                }`}
              >
                {category.name}
              </button>
            );
          })}
        </div>

        <AgentListView
          agents={agents}
          loading={isLoading || isPlaceholderData}
        />

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2 pt-4 border-t border-[#232326]">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-lg px-3 py-1.5 text-xs font-medium border border-[#232326] bg-[#131316] text-neutral-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex items-center gap-1 px-2">
              <span className="text-xs text-neutral-400">
                Page <strong className="text-white">{currentPage}</strong> of{" "}
                <strong className="text-white">{totalPages}</strong>
              </span>
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="rounded-lg px-3 py-1.5 text-xs font-medium border border-[#232326] bg-[#131316] text-neutral-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}