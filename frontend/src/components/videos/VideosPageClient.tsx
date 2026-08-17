"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Video } from "@/lib/video-types";
import { getVideosPage } from "@/lib/videos-data";
import { VideoTable } from "./VideoTable";

const VIDEO_CATEGORIES = [
  { name: "All", slug: "" },
  { name: "Product Demos", slug: "product-demos" },
  { name: "Tutorials", slug: "tutorials" },
  { name: "AI News", slug: "ai-news" },
  { name: "Model Showcases", slug: "model-showcases" },
  { name: "Podcasts", slug: "podcasts" },
  { name: "Tool Walkthroughs", slug: "tool-walkthroughs" },
  { name: "Webinars", slug: "webinars" },
  { name: "Conferences", slug: "conferences" },
  { name: "Coding", slug: "coding" },
  { name: "Case Studies", slug: "case-studies" },
  { name: "Comparisons", slug: "comparisons" },
  { name: "Educational Content", slug: "educational-content" },
  { name: "Success Stories", slug: "success-stories" },
  { name: "AI Trends", slug: "ai-trends" },
  { name: "Prompting", slug: "prompting" }
];

export function VideosPageClient({
  initialVideos,
  initialTotal,
  pageSize,
}: {
  initialVideos: Video[];
  initialTotal: number;
  pageSize: number;
}) {
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<string>(searchParams?.get("category") || "");
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const hasMore = videos.length < total;

  const activeVideos = activeCategory
    ? videos.filter(
        (v) => v.toolCategory === activeCategory || v.tags?.includes(activeCategory)
      )
    : videos;

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const next = await getVideosPage(pageSize, videos.length);
      if (next.length === 0) {
        // Backend and our locally-tracked total disagree (e.g. rows were
        // deleted since initial load) — stop trying rather than looping.
        setTotal(videos.length);
        return;
      }
      setVideos((prev) => {
        const seen = new Set(prev.map((v) => v.id));
        const deduped = next.filter((v) => !seen.has(v.id));
        return [...prev, ...deduped];
      });
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, pageSize, videos.length]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "600px" } // start loading well before the user hits bottom
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="flex flex-col gap-5">
      {/* Top Sliding Category Row */}
      <div className="mb-2 flex items-center justify-start gap-1.5 overflow-x-auto pb-2.5 scrollbar-none w-full">
        {VIDEO_CATEGORIES.map((topic) => {
          const isSelected = activeCategory === topic.slug;
          return (
            <button
              key={topic.name}
              onClick={(e) => {
                setActiveCategory(topic.slug);
                const targetPath = topic.slug ? `/videos?category=${topic.slug}` : `/videos`;
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

      <VideoTable videos={activeVideos} />

      <div ref={sentinelRef} className="flex items-center justify-center py-8">
        {loading && (
          <span className="font-mono text-[12.5px] text-muted">Loading more videos…</span>
        )}
        {!hasMore && videos.length > 0 && (
          <span className="font-mono text-[12.5px] text-muted">You've reached the end.</span>
        )}
      </div>
    </div>
  );
}