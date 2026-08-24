'use client';

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";

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
  const router = useRouter();

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

  useEffect(() => {
    if (defaultMode) return;
    const path = window.location.pathname;
    if (path.includes("personal")) {
      setMode("personal");
    } else if (path.includes("creativity")) {
      setMode("creativity");
    } else if (path.includes("agents")) {
      setMode("agents");
    } else {
      setMode("tools");
    }
  }, [defaultMode, pathname]);

  const [activeCategory, setActiveCategory] = useState<string>(() => {
    const explicitCategory = defaultCategory || searchParams.get("category");
    if (explicitCategory) return explicitCategory;
    // Creativity always defaults to image-generation
    if (defaultMode === "creativity" || (typeof window !== "undefined" && window.location.pathname.includes("creativity"))) {
      return "image-generation";
    }
    return "";
  });

  // Auto-select image-generation when switching into creativity mode
  useEffect(() => {
    if (mode === "creativity" && !activeCategory) {
      setActiveCategory("image-generation");
    }
  }, [mode]);

  // Synchronize state when URL path or query parameters change
  useEffect(() => {
    const pathParts = pathname.split("/").filter(Boolean);
    let categoryFromPath = "";

    // Extract subcategory slug from /tools/[slug], /personal/[slug], /creativity/[slug], /agents/[slug]
    const modeKeys = ["tools", "personal", "creativity", "agents"];
    const modeIdx = pathParts.findIndex(p => modeKeys.includes(p));
    if (modeIdx !== -1 && pathParts[modeIdx + 1]) {
      categoryFromPath = pathParts[modeIdx + 1];
    }

    const queryCategory = searchParams.get("category") || "";
    const resolvedCategory = categoryFromPath || queryCategory || defaultCategory;

    if (resolvedCategory) {
      setActiveCategory(resolvedCategory);
    } else {
      setActiveCategory(mode === "creativity" ? "image-generation" : "");
    }
  }, [pathname, searchParams, defaultCategory, mode]);

  const sentinelRef = useRef<HTMLDivElement>(null);

  // Build query params
  const q = searchParams.get("q") || undefined;
  const pricing = searchParams.get("pricing") || undefined;
  const sort = (searchParams.get("sort") || undefined) as SortOption | undefined;

  const queryKey = ["tools", mode, activeCategory, q, pricing, sort];

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isPlaceholderData,
  } = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      const query = new URLSearchParams();
      if (q) query.set("q", q);
      if (pricing) query.set("pricing", pricing);
      if (sort) query.set("sort", sort);
      query.set("page", String(pageParam));

      const endpoint = activeCategory
        ? `${API_URL}/api/v1/tools/category/${activeCategory}`
        : `${API_URL}/api/v1/tools`;

      try {
        const res = await fetch(`${endpoint}?${query.toString()}`);
        if (!res.ok) return { tools: [], totalPages: 1, page: pageParam };
        return await res.json();
      } catch {
        return { tools: [], totalPages: 1, page: pageParam };
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      if (lastPage?.page < lastPage?.totalPages) return lastPage.page + 1;
      return undefined;
    },
    placeholderData: keepPreviousData,
    staleTime: 10 * 60 * 1000,
  });

  // Flatten all fetched pages into a single list
  const tools = data?.pages.flatMap((p: any) => p.tools || []) || [];
  const totalPages = data?.pages[data.pages.length - 1]?.totalPages || 1;
  const currentPage = data?.pages.length || 1;

  // IntersectionObserver for endless scrolling
  useEffect(() => {
    if (isLoading || isFetchingNextPage || !hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    }, { threshold: 0.1 });

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) observer.observe(currentSentinel);
    return () => { if (currentSentinel) observer.unobserve(currentSentinel); };
  }, [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);

  const categories = CATEGORY_MAP[mode] || CATEGORY_MAP.tools;

  return (
    <div id="tools" className="scroll-mt-28 w-full px-4 sm:px-6 lg:px-8 pt-2 pb-2">
      <div className={`mx-auto w-full max-w-[1600px] space-y-3 transition-opacity duration-150 ${isPlaceholderData ? "opacity-60" : "opacity-100"}`}>
        {/* Top Sliding Category Row */}
        <div className="mb-2 flex items-center justify-start gap-1.5 overflow-x-auto pb-2.5 scrollbar-none w-full px-4 md:px-0">
          {categories.map((topic) => {
            const isSelected = activeCategory === topic.slug;
            return (
              <button
                key={topic.name}
                onClick={(e) => {
                  setActiveCategory(topic.slug);
                  const base = mode === "personal" ? "/personal" : mode === "creativity" ? "/creativity" : mode === "agents" ? "/agents" : "/tools";
                  const url = topic.slug ? `${base}/${topic.slug}` : base;
                  window.history.pushState(null, "", url);
                  e.currentTarget.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "center"
                  });
                }}
                className={`rounded-full px-3 py-1 text-[12px] font-semibold whitespace-nowrap transition-all duration-200 border cursor-pointer ${
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

        <ToolListView
          tools={tools}
          loading={isLoading && currentPage === 1}
        />

        {/* Sentinel for infinite scroll */}
        {hasNextPage && (
          <div ref={sentinelRef} className="h-20 flex items-center justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          </div>
        )}
      </div>
    </div>
  );
}
