"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { VideoPlayer } from "@/components/videos/VideoPlayer";
import { getVideoBySlug, Video } from "@/lib/videos-data";

import { getChannelUrl } from "@/lib/video-types";
export function VideoDetailsClient() {
  const params = useParams();
  const slug = params.slug as string;

  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVideoBySlug(slug).then((data) => {
      if (!data) notFound();
      setVideo(data);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <main className="flex h-[100dvh] items-center justify-center overflow-hidden bg-[#050506]">
        <div
          className="flex flex-col rounded-[22px] border border-white/[0.07] bg-[#0d0d10] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.7)]"
          style={{ width: "81vw", aspectRatio: "16 / 9" }}
        >
          <div className="h-full w-full animate-pulse bg-white/5 rounded-[22px]" />
        </div>
      </main>
    );
  }

  if (!video) return null;

  return (
    <main className="flex h-[100dvh] items-center justify-center overflow-hidden bg-[#050506]">
      {/*
        Width-first layout: the card's width is a fixed share of the viewport
        (81vw) and is never derived from available height. The player inside
        is width-driven too (aspect-ratio: 16/9), so its height always
        follows its width — it never gets squeezed, cropped, or clipped by
        the surrounding chrome. The card is simply centered, with equal
        margin left and right, and never touches the viewport edges.
      */}
      <div
        className="flex flex-col rounded-[22px] border border-white/[0.07] bg-[#0d0d10] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.7)]"
        style={{ width: "81vw" }}
      >
        {/* Title bar */}
        <div className="flex h-14 shrink-0 items-center justify-between gap-4 px-5 sm:px-7">
          <p className="line-clamp-1 text-[15px] font-semibold text-white sm:text-[17px]">
            {video.title}
          </p>
          <Link
            href="/videos"
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </Link>
        </div>

        {/* Player — width-bound (81vw, from the card), height derives from 16:9 */}
        <div className="px-3 sm:px-4">
          <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
            <VideoPlayer youtubeId={video.youtubeId} title={video.title} />
          </div>
        </div>

        {/* Bottom bar — mirrors the title bar so the card reads as a closed, complete frame */}
        <div className="flex h-14 shrink-0 items-center justify-between gap-4 px-5 sm:px-7">
          <a
            href={getChannelUrl(video.channelId, video.author.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex shrink-0 items-center gap-1.5 rounded-full py-1 pl-1 pr-2 text-[12.5px] text-white/60 transition-colors hover:bg-white/5 hover:text-white"
            style={{ maxWidth: "60%" }}
          >
            <span className="truncate">{video.author.name}</span>
            <svg
              width="13"
              height="13"
              viewBox="0 0 16 16"
              fill="none"
              style={{ flexShrink: 0, display: "block" }}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              <path
                d="M4 12L12 4M12 4H5.5M12 4V10.5"
                stroke="#ffffff"
                strokeOpacity="0.6"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <p className="shrink-0 text-[12.5px] uppercase tracking-[0.06em] text-white/40">
            {video.toolCategory}
          </p>
        </div>
      </div>
    </main>
  );
}
