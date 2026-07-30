"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Video } from "@/lib/video-types";
import { getVideosPage } from "@/lib/videos-data";
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

  return (
    <div className="flex flex-col gap-5">
      <VideoTable videos={videos} />

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