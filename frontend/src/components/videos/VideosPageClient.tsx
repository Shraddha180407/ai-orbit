"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Video, ToolCategory } from "@/lib/video-types";
import { getVideosPage } from "@/lib/videos-data";
import { VideoFilters } from "./VideoFilters";
import { VideoTable } from "./VideoTable";

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
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<"All" | ToolCategory>("All");
  const [query, setQuery] = useState("");
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const hasMore = videos.length < total;

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

  const channelCount = useMemo(
    () => new Set(videos.map((v) => v.channelId).filter((id): id is string => Boolean(id))).size,
    [videos]
  );
  const totalViews = useMemo(() => videos.reduce((sum, v) => sum + v.views, 0), [videos]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return videos.filter((v) => {
      const matchesCategory = category === "All" || v.toolCategory === category;
      const matchesQuery =
        q.length === 0 ||
        v.title.toLowerCase().includes(q) ||
        v.toolName.toLowerCase().includes(q) ||
        v.author.name.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [videos, category, query]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 border-b border-border px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none" className="shrink-0 text-primary">
            <rect x="1.5" y="3.5" width="9.5" height="9" rx="1.3" stroke="currentColor" strokeWidth="1.3" />
            <path d="M11 6.3 14.5 4v8L11 9.7Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
          </svg>
          <h1 className="text-[22px] font-bold tracking-[-0.01em] text-primary">Videos</h1>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-[13.5px] text-secondary">
          <span className="text-muted">
            Loaded <span className="font-semibold text-primary">{videos.length.toLocaleString()}</span>
            {" / "}
            <span className="font-semibold text-primary">{total.toLocaleString()}</span>
          </span>
          <span className="text-muted">
            Channels <span className="font-semibold text-primary">{channelCount}</span>
          </span>
          <span className="text-muted">
            Views <span className="font-semibold text-primary">{totalViews.toLocaleString()}</span>
          </span>
        </div>
      </div>

      <div className="px-5">
        <VideoFilters onChange={(state) => { setCategory(state.category); setQuery(state.query); }} />
      </div>

      {filtered.length === 0 ? (
        <div className="px-5 pb-10 pt-2 text-center text-[13.5px] text-muted">
          No videos match that filter.
        </div>
      ) : (
        <>
          <VideoTable videos={filtered} />

          {/* Only show the scroll-loader when no client-side filter/search is
              active — otherwise "loading more" would silently pull in videos
              that don't even match the current filter until user scrolls
              further, which reads as broken filtering. */}
          {category === "All" && query.trim().length === 0 && (
            <div ref={sentinelRef} className="flex items-center justify-center py-8">
              {loading && (
                <span className="font-mono text-[12.5px] text-muted">Loading more videos…</span>
              )}
              {!hasMore && videos.length > 0 && (
                <span className="font-mono text-[12.5px] text-muted">You've reached the end.</span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}