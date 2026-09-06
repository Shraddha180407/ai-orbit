"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Video } from "@/lib/video-types";
import {
  getVideosPage,
  getVideosCount,
  getCachedVideosPage,
  getCachedVideosCount,
  prefetchVideosCategory,
  buildVideosPageUrl,
  buildVideosCountUrl,
  setInCache,
  type VideoSortBy,
  type VideoSortDir,
} from "@/lib/videos-data";
import { VideoTable, VideoTableSkeleton } from "./VideoTable";
import { VideoDetailsModal } from "./VideoDetailsModal";
import { Pagination } from "./Pagination";
import { scrollChipIntoView } from "@/lib/utils";

export const VIDEO_CATEGORIES = [
  { name: "All", slug: "" },
  { name: "General AI", slug: "general-ai" },
  { name: "LLMs", slug: "llm" },
  { name: "AI Agents", slug: "agents" },
  { name: "Multimodal AI", slug: "multimodal-ai" },
  { name: "Robotics", slug: "robotics" },
  { name: "Educational Content", slug: "educational-content" },
  { name: "Coding", slug: "coding" },
  { name: "Model Showcases", slug: "model-showcases" },
  { name: "Tutorials", slug: "tutorials" },
  { name: "Podcasts", slug: "podcasts" },
  { name: "AI Trends", slug: "ai-trends" },
  { name: "Comparisons", slug: "comparisons" },
  { name: "Prompting", slug: "prompting" },
  { name: "Product Demos", slug: "product-demos" },
  { name: "Case Studies", slug: "case-studies" },
];

export function VideosPageClient({
  initialVideos,
  initialTotal,
  pageSize: initialPageSize = 100,
  defaultCategory,
}: {
  initialVideos: Video[];
  initialTotal: number;
  pageSize: number;
  defaultCategory?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [currentPageSize, setCurrentPageSize] = useState<number>(initialPageSize || 100);

  const initialCat = defaultCategory || searchParams?.get("category") || "";
  const [activeCategory, setActiveCategory] = useState<string>(initialCat);

  const [sortBy, setSortBy] = useState<VideoSortBy>("posted");
  const [sortDir, setSortDir] = useState<VideoSortDir>("desc");

  const initialPage = Math.max(1, Number(searchParams?.get("page")) || 1);
  const [page, setPage] = useState<number>(initialPage);

  // Synchronous cache lookup on initial render if initialVideos was empty
  const [videos, setVideos] = useState<Video[]>(() => {
    if (initialVideos && initialVideos.length > 0) return initialVideos;
    const cached = getCachedVideosPage(initialPageSize, 0, initialCat || undefined, "posted", "desc");
    if (cached && cached.length > 0) return cached;
    return [];
  });

  const [total, setTotal] = useState<number>(() => {
    if (initialTotal > 0) return initialTotal;
    const cachedTotal = getCachedVideosCount(initialCat || undefined);
    return cachedTotal !== null ? cachedTotal : 0;
  });

  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  function handleVideoSelect(video: Video) {
    setSelectedVideo(video);
    if (typeof window !== "undefined") {
      window.history.pushState({ videoSlug: video.slug }, "", `/videos/${video.slug}`);
    }
  }

  function handleCloseModal() {
    setSelectedVideo(null);
    if (typeof window !== "undefined") {
      const currentQuery = searchParams?.toString();
      const returnUrl = `/videos${currentQuery ? `?${currentQuery}` : ""}`;
      window.history.pushState(null, "", returnUrl);
    }
  }

  // Seed initial SSR data into cache immediately
  useEffect(() => {
    if (initialVideos && initialVideos.length > 0) {
      const pageUrl = buildVideosPageUrl(currentPageSize, 0, initialCat || undefined, sortBy, sortDir);
      setInCache(pageUrl, initialVideos, 15 * 60 * 1000);
      if (initialTotal > 0) {
        const countUrl = buildVideosCountUrl(initialCat || undefined);
        setInCache(countUrl, { total: initialTotal }, 15 * 60 * 1000);
      }
    }
  }, []);

  // Handle browser back/forward navigation for video modal and categories
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state?.videoSlug) {
        const found = videos.find((v) => v.slug === e.state.videoSlug);
        if (found) {
          setSelectedVideo(found);
          return;
        }
      }
      setSelectedVideo(null);

      // Handle category popstate
      const urlParams = new URLSearchParams(window.location.search);
      const catInUrl = urlParams.get("category") || "";
      if (catInUrl !== activeCategory) {
        setActiveCategory(catInUrl);
        setPage(1);
        const cached = getCachedVideosPage(currentPageSize, 0, catInUrl || undefined, sortBy, sortDir);
        if (cached && cached.length > 0) {
          setVideos(cached);
          const cachedCount = getCachedVideosCount(catInUrl || undefined);
          if (cachedCount !== null) setTotal(cachedCount);
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [videos, activeCategory, currentPageSize, sortBy, sortDir]);

  const subCatContainerRef = useRef<HTMLDivElement>(null);
  const subCatRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const initialFetchDoneRef = useRef(Boolean(initialVideos && initialVideos.length > 0));

  const totalPages = Math.max(1, Math.ceil(total / currentPageSize));

  // Sync with defaultCategory prop changes (e.g. dynamic route change)
  useEffect(() => {
    if (defaultCategory !== undefined && defaultCategory !== activeCategory) {
      setActiveCategory(defaultCategory);
      setPage(1);
    }
  }, [defaultCategory]);

  // Scroll active chip into view on mount or category change
  useEffect(() => {
    const container = subCatContainerRef.current;
    const activeBtn = subCatRefs.current[activeCategory];
    if (container && activeBtn) {
      scrollChipIntoView(container, activeBtn, true);
    }
  }, [activeCategory]);

  // Pre-cache all categories immediately on mount so clicking any tab is 0ms
  useEffect(() => {
    VIDEO_CATEGORIES.forEach((cat) => {
      if (cat.slug !== activeCategory) {
        prefetchVideosCategory(cat.slug || undefined, currentPageSize, 0, sortBy, sortDir);
      }
    });
  }, [currentPageSize, sortBy, sortDir]);

  // Fetch or revalidate videos whenever category, page, sort, or size changes
  useEffect(() => {
    // If we already have SSR data for the initial render, skip redundant duplicate fetch
    if (initialFetchDoneRef.current) {
      initialFetchDoneRef.current = false;
      return;
    }

    let cancelled = false;

    // Check synchronous cache first for 0ms instant display
    const offset = (page - 1) * currentPageSize;
    const cached = getCachedVideosPage(currentPageSize, offset, activeCategory || undefined, sortBy, sortDir);
    const cachedCount = getCachedVideosCount(activeCategory || undefined);

    if (cached && cached.length > 0) {
      setVideos(cached);
      if (cachedCount !== null) setTotal(cachedCount);
      setIsFetching(true); // background silent revalidation
    } else {
      setLoading(true);
    }

    (async () => {
      try {
        const [pageVideos, count] = await Promise.all([
          getVideosPage(currentPageSize, offset, activeCategory || undefined, sortBy, sortDir),
          getVideosCount(activeCategory || undefined),
        ]);

        if (cancelled) return;

        setVideos(pageVideos);
        setTotal(count);
      } finally {
        if (!cancelled) {
          setLoading(false);
          setIsFetching(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeCategory, sortBy, sortDir, page, currentPageSize]);

  function handleCategorySelect(categorySlug: string, targetButton?: HTMLButtonElement | null) {
    if (activeCategory === categorySlug && page === 1) return;

    setActiveCategory(categorySlug);
    setPage(1);

    // Instant synchronous cache swap if available
    const cached = getCachedVideosPage(currentPageSize, 0, categorySlug || undefined, sortBy, sortDir);
    const cachedCount = getCachedVideosCount(categorySlug || undefined);
    if (cached && cached.length > 0) {
      setVideos(cached);
      if (cachedCount !== null) setTotal(cachedCount);
      setLoading(false);
      setIsFetching(true);
    } else {
      setLoading(true);
    }

    // Update URL query parameters without unmounting component or triggering server actions
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (categorySlug) {
        params.set("category", categorySlug);
      } else {
        params.delete("category");
      }
      params.delete("page");
      const qs = params.toString();
      const newUrl = `/videos${qs ? `?${qs}` : ""}`;
      window.history.pushState({ category: categorySlug }, "", newUrl);
    }

    // Smooth scroll chip into view on mobile/tablet
    if (targetButton && subCatContainerRef.current) {
      scrollChipIntoView(subCatContainerRef.current, targetButton, true);
    }
  }

  function handleSortChange(key: VideoSortBy) {
    if (key === sortBy) {
      setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDir("desc");
    }
    setPage(1);
  }

  function goToPage(next: number) {
    const clamped = Math.min(Math.max(1, next), totalPages);
    setPage(clamped);

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (clamped > 1) {
        params.set("page", String(clamped));
      } else {
        params.delete("page");
      }
      const qs = params.toString();
      const newUrl = `/videos${qs ? `?${qs}` : ""}`;
      window.history.pushState({ page: clamped }, "", newUrl);
    }

    document.getElementById("videos-list-top")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="w-full">
      <div className="w-full flex flex-col gap-0.5">
        {/* Horizontal Category Scroll Row */}
        <div
          id="videos-list-top"
          ref={subCatContainerRef}
          className="mb-2 flex flex-nowrap items-center justify-start gap-2 overflow-x-auto pb-2.5 scrollbar-none w-full px-4 md:px-0 scroll-smooth touch-scroll-x"
        >
          {VIDEO_CATEGORIES.map((topic) => {
            const isSelected = activeCategory === topic.slug;

            return (
              <button
                key={topic.name}
                ref={(el) => {
                  subCatRefs.current[topic.slug] = el;
                }}
                onMouseEnter={() => {
                  prefetchVideosCategory(topic.slug || undefined, currentPageSize, 0, sortBy, sortDir);
                }}
                onTouchStart={() => {
                  prefetchVideosCategory(topic.slug || undefined, currentPageSize, 0, sortBy, sortDir);
                }}
                onClick={(e) => {
                  handleCategorySelect(topic.slug, e.currentTarget);
                }}
                className={`rounded-full px-4 py-2 text-[11.5px] font-medium whitespace-nowrap transition-all duration-200 border active:scale-95 cursor-pointer shrink-0 ${
                  isSelected
                    ? "bg-white text-black border-white shadow-lg shadow-white/5 font-semibold"
                    : "text-neutral-400 hover:text-white bg-[#131316]/50 border-[#232326]/60 hover:border-white/[0.15]"
                }`}
              >
                {topic.name}
              </button>
            );
          })}
        </div>

        {/* Subtle background fetching progress bar */}
        <div className="h-[2px] w-full overflow-hidden mb-1">
          {isFetching && (
            <div className="h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
          )}
        </div>

        {/* Table content or high-tech skeleton */}
        {loading && videos.length === 0 ? (
          <VideoTableSkeleton rowCount={10} />
        ) : (
          <VideoTable
            videos={videos}
            sortBy={sortBy}
            sortDir={sortDir}
            onSortChange={handleSortChange}
            onVideoSelect={handleVideoSelect}
          />
        )}

        {/* Empty state */}
        {!loading && videos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <span className="font-mono text-[13px] text-white/70">
              No videos found in this category.
            </span>
            <button
              onClick={() => handleCategorySelect("")}
              className="text-xs text-blue-400 hover:text-blue-300 underline underline-offset-4 cursor-pointer"
            >
              Browse all videos
            </button>
          </div>
        )}

        {/* Pagination */}
        {videos.length > 0 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            pageSize={currentPageSize}
            totalCount={total}
            onPageChange={goToPage}
            onPageSizeChange={(s) => {
              setCurrentPageSize(s);
              setPage(1);
            }}
          />
        )}
      </div>

      {/* Instant 0ms Video Details Playback Modal */}
      <VideoDetailsModal video={selectedVideo} onClose={handleCloseModal} />
    </div>
  );
}