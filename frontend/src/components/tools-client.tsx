'use client';

import React, { useEffect, useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import { ToolListView } from "@/components/ToolListView";
import { API_URL } from "@/lib/api";
import type { SortOption } from "@/lib/types";

type DirectoryMode = "tools" | "personal" | "creativity" | "agents";

const CATEGORY_MAP = {
  tools: [
    { name: "All", slug: "" },
    { name: "Writing", slug: "writing" },
    { name: "Image Generation", slug: "image-generation" },
    { name: "Video Generation", slug: "video" },
    { name: "Audio", slug: "audio" },
    { name: "Chatbots", slug: "chatbots" },
    { name: "Coding", slug: "coding" },
    { name: "Marketing", slug: "marketing" },
    { name: "Productivity", slug: "productivity" },
    { name: "Business", slug: "business" },
    { name: "Education", slug: "education" },
    { name: "Agents", slug: "agents" },
    { name: "Presentations", slug: "presentations" },
    { name: "3D Generation", slug: "3d-generation" },
    { name: "No-Code AI Builders", slug: "no-code" },
    { name: "Workflow Automation", slug: "workflow-automation" }
  ],
  personal: [
    { name: "All", slug: "" },
    { name: "Relationships", slug: "relationships" },
    { name: "Education", slug: "education" },
    { name: "Learning", slug: "learning" },
    { name: "Health & Wellness", slug: "health-wellness" },
    { name: "Personal Development", slug: "personal-development" },
    { name: "Travel", slug: "travel" },
    { name: "Finance & Wealth", slug: "finance-wealth" },
    { name: "Entertainment", slug: "entertainment" },
    { name: "Food & Nutrition", slug: "food-nutrition" },
    { name: "Shopping", slug: "shopping" },
    { name: "Fashion & Style", slug: "fashion-style" },
    { name: "Mindfulness", slug: "mindfulness" },
    { name: "Life Coaching", slug: "life-coaching" },
    { name: "Home Decor", slug: "home-decor" },
    { name: "Insurance Advisor", slug: "insurance-advisor" }
  ],
  creativity: [
    { name: "All", slug: "" },
    { name: "Image Generation", slug: "image-generation" },
    { name: "Writing", slug: "writing" },
    { name: "Software Development", slug: "software-development" },
    { name: "Video Creation", slug: "video-creation" },
    { name: "Music", slug: "music" },
    { name: "Graphic Design", slug: "graphic-design" },
    { name: "Digital Art", slug: "digital-art" },
    { name: "Brainstorming", slug: "brainstorming" },
    { name: "3D Creation", slug: "3d-creation" },
    { name: "Presentation Design", slug: "presentation-design" },
    { name: "Storytelling", slug: "storytelling" },
    { name: "Content Creation", slug: "content-creation" },
    { name: "Branding", slug: "branding" },
    { name: "Motion Graphics", slug: "motion-graphics" },
    { name: "Game Creation", slug: "game-creation" }
  ],
  agents: [
    { name: "All", slug: "" },
    { name: "Content Creation", slug: "content-creation" },
    { name: "Research Assistance", slug: "research-assistance" },
    { name: "Customer Support", slug: "customer-support" },
    { name: "Software Development", slug: "software-development" },
    { name: "Business Automation", slug: "business-automation" },
    { name: "Data Analysis", slug: "data-analysis" },
    { name: "Knowledge Management", slug: "knowledge-management" },
    { name: "Personal Productivity", slug: "personal-productivity" },
    { name: "Sales Automation", slug: "sales-automation" },
    { name: "Workflow Automation", slug: "workflow-automation" },
    { name: "Autonomous Agents", slug: "autonomous-agents" }
  ]
} as const;

export function ToolsClient({ 
  defaultMode, 
  defaultCategory 
}: { 
  defaultMode?: DirectoryMode; 
  defaultCategory?: string; 
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Page state for pagination
  const [currentPage, setCurrentPage] = useState<number>(() => {
    const pageFromUrl = searchParams.get("page");
    return pageFromUrl ? parseInt(pageFromUrl, 10) : 1;
  });

  const [mode, setMode] = useState<DirectoryMode>(() => {
    if (defaultMode) return defaultMode;
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      if (path.includes("personal")) return "personal";
      if (path.includes("creativity")) return "creativity";
      if (path.includes("agents")) return "agents";
    }
    return "tools";
  });

  const [activeCategory, setActiveCategory] = useState<string>(() => {
    return defaultCategory || searchParams.get("category") || "";
  });

  // Reset to page 1 whenever active category or mode changes
  const handleCategoryChange = (slug: string) => {
    setActiveCategory(slug);
    setCurrentPage(1);

    const base = mode === "personal" ? "/personal" : mode === "creativity" ? "/creativity" : mode === "agents" ? "/agents" : "/tools";
    const url = slug ? `${base}/${slug}` : base;
    window.history.pushState(null, "", url);
  };

  const q = searchParams.get("q") || undefined;
  const pricing = searchParams.get("pricing") || undefined;
  const sort = (searchParams.get("sort") || undefined) as SortOption | undefined;

  // Dynamic categories query for Agents mode
  const { data: agentCategoriesData } = useQuery({
    queryKey: ["agent-categories"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/v1/agents/categories`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: mode === "agents",
    staleTime: 10 * 60 * 1000,
  });

  // Single page Query
  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ["tools", mode, activeCategory, q, pricing, sort, currentPage],
    queryFn: async () => {
      const query = new URLSearchParams();
      if (q) query.set("q", q);
      if (pricing) query.set("pricing", pricing);
      if (sort) query.set("sort", sort);
      query.set("page", String(currentPage));

      if (mode === "agents") {
        if (activeCategory) query.set("category", activeCategory);
        const res = await fetch(`${API_URL}/api/v1/agents?${query.toString()}`);
        if (!res.ok) return { tools: [], totalPages: 1 };
        return res.json();
      }

      const endpoint = activeCategory
        ? `${API_URL}/api/v1/tools/category/${activeCategory}`
        : `${API_URL}/api/v1/tools`;

      const res = await fetch(`${endpoint}?${query.toString()}`);
      if (!res.ok) return { tools: [], totalPages: 1 };
      return res.json();
    },
    placeholderData: keepPreviousData,
    staleTime: 10 * 60 * 1000,
  });

  const tools = data?.tools || [];
  const totalPages = data?.totalPages || 1;

  const categories = React.useMemo(() => {
    if (mode === "agents" && Array.isArray(agentCategoriesData) && agentCategoriesData.length > 0) {
      return [
        { name: "All", slug: "" },
        ...agentCategoriesData.map((c: { name: string; slug: string }) => ({
          name: c.name,
          slug: c.slug,
        })),
      ];
    }
    return CATEGORY_MAP[mode] || CATEGORY_MAP.tools;
  }, [mode, agentCategoriesData]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    
    // Scroll smoothly to top of grid
    const target = document.getElementById("tools");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div id="tools" className="scroll-mt-28 w-full px-4 sm:px-6 lg:px-8 pt-2 pb-6">
      <div className={`mx-auto w-full max-w-[1600px] space-y-4 transition-opacity duration-150 ${isPlaceholderData ? "opacity-60" : "opacity-100"}`}>
        
        {/* Category Row */}
        <div className="mb-2 -mx-4 sm:mx-0 px-4 sm:px-0 flex items-center justify-start gap-1.5 overflow-x-auto pb-2.5 scrollbar-none w-auto sm:w-full">
          {categories.map((topic) => {
            const isSelected = activeCategory === topic.slug;
            return (
              <button
                key={topic.name}
                onClick={(e) => {
                  handleCategoryChange(topic.slug);
                  e.currentTarget.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "center"
                  });
                }}
                className={`rounded-full px-3 py-1 text-[12px] font-semibold whitespace-nowrap transition-all duration-200 border cursor-pointer shrink-0 ${
                  isSelected
                    ? "bg-white text-black border-white shadow-lg shadow-white/5"
                    : "text-neutral-400 hover:text-white bg-[#131316]/50 border-[#232326]/60 hover:border-white/[0.15]"
                }`}
              >
                {topic.name}
              </button>
            );
          })}
        </div>

        {/* List Grid */}
        <ToolListView tools={tools} loading={isLoading} />

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2 pt-4 border-t border-[#232326]">
            {/* Prev Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-lg px-3 py-1.5 text-xs font-medium border border-[#232326] bg-[#131316] text-neutral-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {/* Page Indicator */}
            <div className="flex items-center gap-1 px-2">
              <span className="text-xs text-neutral-400">
                Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong>
              </span>
            </div>

            {/* Next Button */}
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