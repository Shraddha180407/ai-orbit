"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Video } from "@/lib/video-types";
import {
  getVideosPageWithCount,
  getCachedVideosPage,
  getCachedVideosCount,
  prefetchVideosCategory,
  buildVideosPageWithCountUrl,
  setInCache,
  type VideoSortBy,
  type VideoSortDir,
} from "@/lib/videos-data";
import { VideoTable, VideoTableSkeleton } from "./VideoTable";
import { VideoDetailsModal } from "./VideoDetailsModal";
import { Pagination } from "./Pagination";
import { scrollChipIntoView } from "@/lib/utils";

// Builds the /videos URL for a given category + page without touching
// Next's router - see the pushState usage below for why.
function buildVideosListUrl(category: string, pageNum: number): string {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (pageNum > 1) params.set("page", String(pageNum));
  const qs = params.toString();
  return `/videos${qs ? `?${qs}` : ""}`;
}

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
  const searchParams = useSearchParams();

  const [currentPageSize, setCurrentPageSize] = useState<number>(
    initialPageSize || 100
  );

  const initialCat =
    defaultCategory || searchParams?.get("category") || "";
  const [activeCategory, setActiveCategory] =
    useState<string>(initialCat);

  const [sortBy, setSortBy] =
    useState<VideoSortBy>("posted");
  const [sortDir, setSortDir] =
    useState<VideoSortDir>("desc");

  const initialPage = Math.max(
    1,
    Number(searchParams?.get("page")) || 1
  );
  const [page, setPage] = useState<number>(initialPage);

  // Synchronous cache lookup on initial render if initialVideos was empty
  const [videos, setVideos] = useState<Video[]>(() => {
    if (initialVideos && initialVideos.length > 0) {
      return initialVideos;
    }

    const cached = getCachedVideosPage(
      initialPageSize,
      0,
      initialCat || undefined,
      "posted",
      "desc"
    );

    if (cached && cached.length > 0) {
      return cached;
    }

    return [];
  });

  const [total, setTotal] = useState<number>(() => {
    if (initialTotal > 0) {
      return initialTotal;
    }

    const cachedTotal = getCachedVideosCount(
      initialPageSize,
      0,
      initialCat || undefined,
      "posted",
      "desc"
    );

    return cachedTotal !== null ? cachedTotal : 0;
  });

  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedVideo, setSelectedVideo] =
    useState<Video | null>(null);

  const subCatContainerRef =
    useRef<HTMLDivElement>(null);

  const subCatRefs =
    useRef<Record<string, HTMLButtonElement | null>>({});

  const isInitialMount = useRef(true);

  // Tracks which category the videos currently in state
  // actually belong to, so we can tell a same-category
  // revalidation (safe to keep old rows visible) apart
  // from a category switch (must never show the previous
  // category's videos, even briefly).
  const loadedCategoryRef = useRef<string>(initialCat);

  const totalPages = Math.max(
    1,
    Math.ceil(total / currentPageSize)
  );

  // Seed initial SSR data into cache immediately
  useEffect(() => {
    if (initialVideos && initialVideos.length > 0) {
      const pageUrl = buildVideosPageWithCountUrl(
        currentPageSize,
        0,
        initialCat || undefined,
        sortBy,
        sortDir
      );

      setInCache(
        pageUrl,
        { videos: initialVideos, total: initialTotal > 0 ? initialTotal : 0 },
        15 * 60 * 1000
      );
    }
  }, []);

  // Synchronize state when server props update
  useEffect(() => {
    if (initialVideos && initialVideos.length > 0) {
      setVideos(initialVideos);
    }
  }, [initialVideos]);

  useEffect(() => {
    if (
      typeof initialTotal === "number" &&
      initialTotal > 0
    ) {
      setTotal(initialTotal);
    }
  }, [initialTotal]);

  // NOTE: Category/page changes are now applied via window.history
  // .pushState (see handleCategorySelect / goToPage below), not
  // router.push - that's what stops every chip click from triggering
  // a full Next.js page navigation (GET /videos?category=... hitting
  // the server). Because of that, Next's useSearchParams() no longer
  // reflects back/forward navigation for this page, so syncing state
  // from it here would silently stop working. Back/forward is instead
  // handled by the popstate listener below, which reads
  // window.location.search directly.

  // Scroll active chip into view on mount or category change
  useEffect(() => {
    const container = subCatContainerRef.current;
    const activeBtn = subCatRefs.current[activeCategory];

    if (container && activeBtn) {
      scrollChipIntoView(
        container,
        activeBtn,
        true
      );
    }
  }, [activeCategory]);

  // Handle browser back/forward navigation. Covers two things that can
  // change via popstate: the video modal (pushed as /videos/:slug) and
  // the category/page (pushed via history.pushState in
  // handleCategorySelect/goToPage - Next's router doesn't see these,
  // so we read the URL ourselves instead of relying on useSearchParams).
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state?.videoSlug) {
        const found = videos.find(
          (v) => v.slug === e.state.videoSlug
        );

        if (found) {
          setSelectedVideo(found);
        } else {
          setSelectedVideo(null);
        }
      } else {
        setSelectedVideo(null);
      }

      const params = new URLSearchParams(
        window.location.search
      );

      const catInUrl =
        params.get("category") ??
        defaultCategory ??
        "";

      setActiveCategory((prev) =>
        prev !== catInUrl ? catInUrl : prev
      );

      const pageInUrl = Math.max(
        1,
        Number(params.get("page")) || 1
      );

      setPage(pageInUrl);
    };

    window.addEventListener(
      "popstate",
      handlePopState
    );

    return () =>
      window.removeEventListener(
        "popstate",
        handlePopState
      );
  }, [videos, defaultCategory]);

  // Fetch or revalidate videos whenever category,
  // page, sort, or size changes
  useEffect(() => {
    // If we have initial SSR data on first mount
    // for this category/page, skip duplicate fetch.
    if (isInitialMount.current) {
      isInitialMount.current = false;

      if (
        initialVideos &&
        initialVideos.length > 0
      ) {
        return;
      }
    }

    let cancelled = false;

    const offset =
      (page - 1) * currentPageSize;

    // Check synchronous cache first for instant display.
    const cached = getCachedVideosPage(
      currentPageSize,
      offset,
      activeCategory || undefined,
      sortBy,
      sortDir
    );

    const cachedCount =
      getCachedVideosCount(
        currentPageSize,
        offset,
        activeCategory || undefined,
        sortBy,
        sortDir
      );

    const isCategorySwitch =
      loadedCategoryRef.current !== activeCategory;

    if (cached && cached.length > 0) {
      setVideos(cached);
      loadedCategoryRef.current = activeCategory;

      if (cachedCount !== null) {
        setTotal(cachedCount);
      }

      // Revalidate in the background.
      setLoading(false);
      setIsFetching(true);
    } else if (isCategorySwitch) {
      // Switching to a category with no cached data yet.
      // Never keep the previous category's videos on
      // screen here - that would show the wrong content
      // for the selected chip. Show the skeleton instead.
      setVideos([]);
      setLoading(true);
      setIsFetching(true);
    } else {
      // Same category (e.g. page/sort change) with no
      // cache hit - safe to keep the current rows visible
      // while we revalidate in the background.
      setLoading(true);
      setIsFetching(true);
    }

    // Single request: the backend now runs findMany + count in
    // parallel and returns { videos, total } together, instead of
    // this making two separate HTTP round trips.
    const fetchVideosAndCount = async () => {
      try {
        const { videos: pageVideos, total: pageTotal } =
          await getVideosPageWithCount(
            currentPageSize,
            offset,
            activeCategory || undefined,
            sortBy,
            sortDir
          );

        if (cancelled) {
          return;
        }

        // If the API unexpectedly returns an empty
        // page, don't wipe out the currently visible
        // videos. A genuinely empty initial result
        // is still allowed to show the empty state.
        if (
          pageVideos.length > 0 ||
          videos.length === 0 ||
          isCategorySwitch
        ) {
          setVideos(pageVideos);
        }

        setTotal(pageTotal);
        loadedCategoryRef.current = activeCategory;
        setLoading(false);
      } catch (err) {
        if (!cancelled) {
          console.error(
            "Failed to fetch videos:",
            err
          );

          setLoading(false);
        }
      } finally {
        if (!cancelled) {
          setIsFetching(false);
        }
      }
    };

    fetchVideosAndCount();

    return () => {
      cancelled = true;
    };
  }, [
    activeCategory,
    sortBy,
    sortDir,
    page,
    currentPageSize,
  ]);

  // NOTE: We deliberately do NOT eagerly prefetch every category on
  // mount. With 15 categories x 2 requests (page + count) each, that
  // was firing ~30 concurrent requests before the user clicked
  // anything, which was swamping the API and making the *actual*
  // selected category's request take longer than it should. Category
  // data is now only fetched on real interest: hover/touch-start on a
  // chip, or an actual click (see below).

  function handleVideoSelect(video: Video) {
    setSelectedVideo(video);

    if (typeof window !== "undefined") {
      window.history.pushState(
        { videoSlug: video.slug },
        "",
        `/videos/${video.slug}`
      );
    }
  }

  function handleCloseModal() {
    setSelectedVideo(null);

    if (typeof window !== "undefined") {
      // Built from our own state, not searchParams - Next's router
      // no longer owns this URL (see handleCategorySelect/goToPage),
      // so searchParams can be stale here.
      const returnUrl = buildVideosListUrl(
        activeCategory,
        page
      );

      window.history.pushState(
        null,
        "",
        returnUrl
      );
    }
  }

  function handleCategorySelect(
    categorySlug: string,
    targetButton?: HTMLButtonElement | null
  ) {
    if (
      activeCategory === categorySlug &&
      page === 1
    ) {
      return;
    }

    setActiveCategory(categorySlug);
    setPage(1);

    // Instant synchronous cache swap if available.
    const cached = getCachedVideosPage(
      currentPageSize,
      0,
      categorySlug || undefined,
      sortBy,
      sortDir
    );

    const cachedCount =
      getCachedVideosCount(
        currentPageSize,
        0,
        categorySlug || undefined,
        sortBy,
        sortDir
      );

    if (cached && cached.length > 0) {
      setVideos(cached);
      loadedCategoryRef.current = categorySlug;

      if (cachedCount !== null) {
        setTotal(cachedCount);
      }

      setLoading(false);
      setIsFetching(true);
    } else {
      // No cache for the newly selected category yet.
      // Clear the old category's videos immediately so we
      // never show, say, "General AI" videos under the
      // "Coding" chip while the real data loads - show the
      // skeleton instead. The fetch effect (keyed off
      // activeCategory) picks up the actual request.
      setVideos([]);
      setLoading(true);
      setIsFetching(true);
    }

    // Update the address bar directly via history.pushState - this is
    // the fix for the "GET /videos?category=... 200 in ~1-2s" server
    // navigations we were seeing in the Next.js logs. router.push()
    // always triggers a real Next.js navigation (fetching a fresh
    // RSC payload from the server), even though every bit of data
    // this page needs is already being fetched client-side above.
    // pushState updates the URL/history without asking Next's router
    // to do anything, so the only network activity on a category
    // click is the actual /api/videos request.
    const newUrl = buildVideosListUrl(categorySlug, 1);

    window.history.pushState(
      null,
      "",
      newUrl
    );

    // Smooth scroll chip into view on mobile/tablet.
    if (
      targetButton &&
      subCatContainerRef.current
    ) {
      scrollChipIntoView(
        subCatContainerRef.current,
        targetButton,
        true
      );
    }
  }

  // Sorting remains backend-driven.
  // Clicking the same column toggles ASC/DESC.
  function handleSortChange(
    key: VideoSortBy
  ) {
    if (key === sortBy) {
      setSortDir((dir) =>
        dir === "asc"
          ? "desc"
          : "asc"
      );
    } else {
      setSortBy(key);
      setSortDir("desc");
    }

    setPage(1);
  }

  function goToPage(next: number) {
    const clamped = Math.min(
      Math.max(1, next),
      totalPages
    );

    setPage(clamped);

    const newUrl = buildVideosListUrl(activeCategory, clamped);

    window.history.pushState(
      null,
      "",
      newUrl
    );

    document
      .getElementById("videos-list-top")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
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
          {VIDEO_CATEGORIES.map(
            (topic) => {
              const isSelected =
                activeCategory ===
                topic.slug;

              return (
                <button
                  key={topic.name}
                  ref={(el) => {
                    subCatRefs.current[
                      topic.slug
                    ] = el;
                  }}
                  onMouseEnter={() => {
                    prefetchVideosCategory(
                      topic.slug ||
                        undefined,
                      currentPageSize,
                      0,
                      sortBy,
                      sortDir
                    );
                  }}
                  onTouchStart={() => {
                    prefetchVideosCategory(
                      topic.slug ||
                        undefined,
                      currentPageSize,
                      0,
                      sortBy,
                      sortDir
                    );
                  }}
                  onClick={(e) => {
                    handleCategorySelect(
                      topic.slug,
                      e.currentTarget
                    );
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
            }
          )}
        </div>

        {/* Subtle background fetching progress bar */}
        <div className="h-[2px] w-full overflow-hidden mb-1">
          {isFetching && (
            <div className="h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
          )}
        </div>

        {/* Table content or skeleton */}
        {loading && videos.length === 0 ? (
          <VideoTableSkeleton
            rowCount={10}
          />
        ) : (
          <VideoTable
            videos={videos}
            sortBy={sortBy}
            sortDir={sortDir}
            onSortChange={
              handleSortChange
            }
            onVideoSelect={
              handleVideoSelect
            }
          />
        )}

        {/* Empty state */}
        {!loading &&
          videos.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-2">
              <span className="font-mono text-[13px] text-white/70">
                No videos found in this
                category.
              </span>

              <button
                onClick={() =>
                  handleCategorySelect("")
                }
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
            pageSize={
              currentPageSize
            }
            totalCount={total}
            onPageChange={goToPage}
            onPageSizeChange={(s) => {
              setCurrentPageSize(s);
              setPage(1);
            }}
          />
        )}
      </div>

      {/* Instant Video Details Playback Modal */}
      <VideoDetailsModal
        video={selectedVideo}
        onClose={handleCloseModal}
      />
    </div>
  );
}