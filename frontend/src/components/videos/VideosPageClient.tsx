"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Video } from "@/lib/video-types";
import {
  getVideosPage,
  getVideosCount,
  type VideoSortBy,
  type VideoSortDir,
} from "@/lib/videos-data";
import { VideoTable } from "./VideoTable";
import { Pagination } from "./Pagination";
import { scrollChipIntoView } from "@/lib/utils";

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
  { name: "Prompting", slug: "prompting" },
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

  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [currentPageSize, setCurrentPageSize] = useState<number>(initialPageSize || 100);

  const [activeCategory, setActiveCategory] = useState<string>(
    defaultCategory || searchParams?.get("category") || ""
  );

  const subCatContainerRef = useRef<HTMLDivElement>(null);
  const subCatRefs = useRef<Record<string, HTMLButtonElement | null>>({});



  const [sortBy, setSortBy] = useState<VideoSortBy>("posted");
  const [sortDir, setSortDir] = useState<VideoSortDir>("desc");

  // Page-based pagination (replaces the previous infinite-scroll approach).
  // 1-indexed for the UI/URL; converted to a 0-indexed offset when fetching.
  const initialPage = Math.max(1, Number(searchParams?.get("page")) || 1);
  const [page, setPage] = useState<number>(initialPage);

  useEffect(() => {
    if (defaultCategory !== undefined) {
      setActiveCategory(defaultCategory);
    }
  }, [defaultCategory]);

  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);

  const didMountRef = useRef(false);

  const totalPages = Math.max(1, Math.ceil(total / currentPageSize));

  // Whenever category or sort changes, jump back to page 1 — a filter/sort
  // change on page 5 of the old result set doesn't make sense on the new one.
  // Skipped on initial mount so it doesn't clobber a page number that came
  // in via the URL (e.g. a bookmarked/shared /videos?page=3 link).
  useEffect(() => {
    if (!didMountRef.current) return;
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, sortBy, sortDir]);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    let cancelled = false;

    (async () => {
      setLoading(true);

      try {
        const offset = (page - 1) * currentPageSize;
        const [pageVideos, count] = await Promise.all([
          getVideosPage(currentPageSize, offset, activeCategory || undefined, sortBy, sortDir),
          getVideosCount(activeCategory || undefined),
        ]);

        if (cancelled) return;

        setVideos(pageVideos);
        setTotal(count);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeCategory, sortBy, sortDir, page, currentPageSize]);

  function handleSortChange(key: VideoSortBy) {
    if (key === sortBy) {
      setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDir("desc");
    }
  }

  function goToPage(next: number) {
    const clamped = Math.min(Math.max(1, next), totalPages);
    setPage(clamped);

    const params = new URLSearchParams(searchParams?.toString());
    if (clamped > 1) {
      params.set("page", String(clamped));
    } else {
      params.delete("page");
    }
    const qs = params.toString();
    router.push(`/videos${qs ? `?${qs}` : ""}`, { scroll: false });

    // Jump back to the top of the list, not the top of the whole page —
    // otherwise switching pages while scrolled down feels disorienting.
    document.getElementById("videos-list-top")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="w-full">
      <div className="w-full flex flex-col gap-0.5">
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
                ref={(el) => { subCatRefs.current[topic.slug] = el; }}
                onClick={() => {
                  setActiveCategory(topic.slug);

                  const params = new URLSearchParams(searchParams?.toString());
                  if (topic.slug) {
                    params.set("category", topic.slug);
                  } else {
                    params.delete("category");
                  }
                  params.delete("page"); // category change resets to page 1
                  const qs = params.toString();
                  router.push(`/videos${qs ? `?${qs}` : ""}`, { scroll: false });

                  const btn = e.currentTarget;
                  const container = btn.parentElement;
                  if (container && window.innerWidth < 768) {
                    requestAnimationFrame(() => {
                      const cRect = container.getBoundingClientRect();
                      const bRect = btn.getBoundingClientRect();
                      const bLeft = bRect.left - cRect.left + container.scrollLeft;
                      const bRight = bLeft + bRect.width;

                      if (bLeft < container.scrollLeft) {
                        container.scrollTo({ left: bLeft - 16, behavior: "smooth" });
                      } else if (bRight > container.scrollLeft + container.clientWidth) {
                        container.scrollTo({ left: bRight - container.clientWidth + 16, behavior: "smooth" });
                      }
                    });
                  }
                }}
                className={`rounded-full px-4 py-2 text-[11.5px] font-medium whitespace-nowrap transition-all duration-200 border active:scale-95 cursor-pointer shrink-0 ${isSelected
                    ? "bg-white text-black border-white shadow-lg shadow-white/5"
                    : "text-neutral-400 hover:text-white bg-[#131316]/50 border-[#232326]/60 hover:border-white/[0.15]"
                  }`}
              >
                {topic.name}
              </button>
            );
          })}
        </div>

        <VideoTable
          videos={videos}
          sortBy={sortBy}
          sortDir={sortDir}
          onSortChange={handleSortChange}
        />

        {!loading && videos.length === 0 && (
          <div className="flex items-center justify-center py-16">
            <span className="font-mono text-[12.5px] text-muted">
              No videos found in this category.
            </span>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-16">
            <span className="font-mono text-[12.5px] text-muted">Loading…</span>
          </div>
        )}

        {!loading && videos.length > 0 && (
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
    </div>
  );
}