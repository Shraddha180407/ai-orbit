'use client';

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, usePathname } from "next/navigation";

import { ToolListView } from "@/components/ToolListView";
import { API_URL } from "@/lib/api";
import type { SortOption } from "@/lib/types";

type DirectoryMode = "tools" | "personal" | "creativity";

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
    { name: "Education", slug: "education" }
  ],
  personal: [
    { name: "All", slug: "" },
    { name: "Productivity", slug: "productivity" },
    { name: "Chatbots", slug: "chatbots" },
    { name: "Writing", slug: "writing" },
    { name: "Audio", slug: "audio" },
    { name: "Customer Support", slug: "customer-support" },
    { name: "Video", slug: "video" },
    { name: "Image Generation", slug: "image-generation" },
    { name: "Marketing", slug: "marketing" }
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

  const [mode, setMode] = useState<DirectoryMode>(() => {
    if (defaultMode) return defaultMode;
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      if (path.includes("personal")) return "personal";
      if (path.includes("creativity")) return "creativity";
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
    } else {
      setMode("tools");
    }
  }, [defaultMode, pathname]);

  const [activeCategory, setActiveCategory] = useState<string>(() => {
    return defaultCategory || searchParams.get("category") || "";
  });

  const [tools, setTools] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Build params object from URL search params
  const params = {
    q: searchParams.get("q") || undefined,
    category: activeCategory || undefined,
    pricing: searchParams.get("pricing") || undefined,
    sort: (searchParams.get("sort") || undefined) as SortOption | undefined,
  };

  const filterKey = `${params.q || ''}-${params.category || ''}-${params.pricing || ''}-${params.sort || ''}`;

  // Reset page and tools when filters change
  useEffect(() => {
    setTools([]);
    setPage(1);
    setTotalPages(1);
  }, [filterKey]);

  useEffect(() => {
    async function fetchData() {
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsFetchingMore(true);
      }
      try {
        const query = new URLSearchParams();
        if (params.q) query.set("q", params.q);
        if (params.category) query.set("category", params.category);
        if (params.pricing) query.set("pricing", params.pricing);
        if (params.sort) query.set("sort", params.sort);
        query.set("page", page.toString());

        const toolsRes = await fetch(`${API_URL}/api/v1/tools?${query.toString()}`);

        if (toolsRes.ok) {
          const toolsData = await toolsRes.json();
          if (page === 1) {
            setTools(toolsData.tools || []);
          } else {
            setTools(prev => [...prev, ...(toolsData.tools || [])]);
          }
          setTotalPages(toolsData.totalPages || 1);
        }
      } catch (error) {
        console.error("Failed to fetch tools data:", error);
      } finally {
        setIsLoading(false);
        setIsFetchingMore(false);
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey, page]);

  // IntersectionObserver for endless scrolling
  useEffect(() => {
    if (isLoading || isFetchingMore || page >= totalPages) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage(prev => prev + 1);
      }
    }, { threshold: 0.1 });

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [isLoading, isFetchingMore, page, totalPages]);

  const categories = CATEGORY_MAP[mode] || CATEGORY_MAP.tools;

  return (
    <div id="tools" className="scroll-mt-28 w-full px-4 sm:px-6 lg:px-8 pt-2 pb-2">
      <div className="mx-auto w-full max-w-[1600px] space-y-3">
        {/* Top Sliding Category Row */}
        <div className="mb-2 flex items-center justify-start md:justify-center gap-1.5 overflow-x-auto pb-2.5 scrollbar-none w-full">
          {categories.map((topic) => {
            const isSelected = activeCategory === topic.slug;
            return (
              <button
                key={topic.name}
                onClick={(e) => {
                  setActiveCategory(topic.slug);
                  const targetPath = topic.slug ? `/${mode}/${topic.slug}` : `/${mode}`;
                  window.history.pushState(null, "", targetPath);
                  e.currentTarget.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "center"
                  });
                }}
                className={`rounded-full px-3 py-1 text-[10px] font-bold whitespace-nowrap transition-all duration-200 border ${
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
          loading={isLoading && page === 1}
        />

        {/* Sentinel for infinite scroll */}
        {tools.length > 0 && page < totalPages && (
          <div ref={sentinelRef} className="h-20 flex items-center justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          </div>
        )}
      </div>
    </div>
  );
}
