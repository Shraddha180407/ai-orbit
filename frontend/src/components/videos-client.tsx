'use client';

import React, { useEffect, useState, useRef } from "react";
import Play from 'lucide-react/dist/esm/icons/play';
import { Video } from "@/lib/types";
import { fetchAllVideos } from "@/lib/api";

export function VideosClient() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [visibleCount, setVisibleCount] = useState(15);
  const [isLoading, setIsLoading] = useState(true);

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function getVideos() {
      try {
        const data = await fetchAllVideos();
        setVideos(data || []);
      } catch (e) {
        console.error("Failed to fetch videos:", e);
      } finally {
        setIsLoading(false);
      }
    }
    getVideos();
  }, []);

  // IntersectionObserver for client-side endless scroll
  useEffect(() => {
    if (isLoading || visibleCount >= videos.length) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount(prev => prev + 15);
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
  }, [isLoading, visibleCount, videos.length]);

  const visibleVideos = videos.slice(0, visibleCount);

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white selection:bg-neutral-800 selection:text-white">
      <main className="mx-auto max-w-[1070px] px-8 py-12 flex-1 w-full">
        <div className="mb-10">
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <Play className="text-[#6E56CF]" />
            Trending AI Videos & Tutorials
          </h1>
          <p className="text-sm text-[#A1A1AA] mt-2">
            Learn and master advanced machine learning concepts, tool tutorials, and model breakdowns.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col divide-y divide-[#232326]/60 border border-[#232326]/60 rounded-xl overflow-hidden bg-[#131316]/10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 animate-pulse bg-[#131316]/50" />
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-20 border border-[#232326] bg-[#131316] rounded-xl">
            <p className="text-[#A1A1AA] text-sm">No videos found.</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-[#232326]/60 border border-[#232326]/60 rounded-xl overflow-hidden bg-[#131316]/10">
            {visibleVideos.map((video: Video) => (
              <a
                key={video.id}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid grid-cols-1 sm:grid-cols-[40px_1fr_180px_120px] gap-4 items-center p-4 bg-transparent hover:bg-[#18181C]/40 transition-all w-full focus-visible:bg-[#18181C]/40 focus-visible:outline-none"
              >
                {/* Column 1: Play Icon */}
                <div className="h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-red-600/10 border border-red-600/20 flex text-red-500">
                  <Play size={20} className="fill-red-500" />
                </div>

                {/* Column 2: Title + Channel */}
                <div className="min-w-0">
                  <h3 className="font-bold text-white text-sm truncate group-hover:text-white transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-xs text-[#A1A1AA] truncate mt-0.5">by {video.channel}</p>
                </div>

                {/* Column 3: Duration & Views */}
                <div className="text-xs text-[#A1A1AA] font-mono flex flex-col gap-0.5 sm:block hidden">
                  <div>Duration: <strong className="text-white">{video.duration}</strong></div>
                  <div className="text-[10px] text-[#71717A]">{video.views}</div>
                </div>

                {/* Column 4: Published Date */}
                <div className="text-right sm:block hidden">
                  <span className="text-[10px] font-mono text-[#71717A] block">PUBLISHED</span>
                  <span className="text-xs text-white font-medium">{video.publishedAt}</span>
                </div>
              </a>
            ))}

            {/* Sentinel for infinite scroll */}
            {videos.length > 0 && visibleCount < videos.length && (
              <div ref={sentinelRef} className="h-20 flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
