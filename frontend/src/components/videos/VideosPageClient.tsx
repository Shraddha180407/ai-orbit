"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Video } from "@/lib/video-types";
import { getVideosPage, getVideosCount } from "@/lib/videos-data";
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [activeCategory, setActiveCategory] = useState<string>(searchParams?.get("category") || "");
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  // Guards the very first render so we don't immediately re-fetch the
  // category we were already given via SSR initialVideos/initialTotal.
  const didMountRef = useRef(false);

  const hasMore = videos.length < total;

  const rawSort = searchParams?.get("sort") ?? "newest";

  // NOTE: category filtering now happens server-side, via the category
  // param passed to getVideosPage/getVideosCount below — this used to
  // filter the in-memory `videos` slice client-side, which broke down for
  // categories with few matches: with ~8000 total videos and 24 per page,
  // the sentinel could trigger hundreds of sequential fetches before
  // `hasMore` ever went false, looking like the page was stuck on
  // "Loading more videos…" indefinitely.
  const activeVideos = videos.slice().sort((a, b) => {
    if (rawSort === "name-asc")  return a.title.localeCompare(b.title);
    if (rawSort === "name-desc") return b.title.localeCompare(a.title);
    if (rawSort === "oldest")    return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const next = await getVideosPage(pageSize, videos.length, activeCategory || undefined);
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
  }, [loading, hasMore, pageSize, videos.length, activeCategory]);

  // Re-fetch from the start whenever the category changes, instead of
  // filtering whatever happens to already be loaded in memory.
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setVideos([]);
      try {
        const [firstPage, count] = await Promise.all([
          getVideosPage(pageSize, 0, activeCategory || undefined),
          getVideosCount(activeCategory || undefined),
        ]);
        if (cancelled) return;
        setVideos(firstPage);
        setTotal(count);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, pageSize]);

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
    <div className="flex flex-col gap-0.5">
      {/* Top Sliding Category Row */}
      <div className="mb-2 flex items-center justify-start gap-1.5 overflow-x-auto pb-2.5 scrollbar-none w-full">
        {VIDEO_CATEGORIES.map((topic) => {
          const isSelected = activeCategory === topic.slug;
          return (
            <button
              key={topic.name}
              onClick={(e) => {
  setActiveCategory(topic.slug);
  const params = new URLSearchParams(searchParams.toString());
  if (topic.slug) params.set("category", topic.slug);
  else params.delete("category");
  router.push(`/videos?${params.toString()}`);
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

      {!loading && activeVideos.length === 0 && (
        <div className="flex items-center justify-center py-16">
          <span className="font-mono text-[12.5px] text-muted">No videos found in this category.</span>
        </div>
      )}

      <div ref={sentinelRef} className="flex items-center justify-center py-8">
        {loading && (
          <span className="font-mono text-[12.5px] text-muted">Loading more videos…</span>
        )}
        {!loading && !hasMore && videos.length > 0 && (
          <span className="font-mono text-[12.5px] text-muted">You've reached the end.</span>
        )}
      </div>
    </div>
  );
}