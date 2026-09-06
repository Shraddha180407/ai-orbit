"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Video } from "@/lib/video-types";
import { getChannelUrl } from "@/lib/video-types";
import { VideoPlayer } from "./VideoPlayer";

export function VideoDetailsModal({
  video,
  onClose,
}: {
  video: Video | null;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!video) return;

    // Prevent background scrolling when modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [video, onClose]);

  if (!video || !mounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-lg animate-in fade-in duration-150 p-3 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="relative flex w-[94vw] max-w-[1280px] flex-col rounded-[14px] border border-white/[0.1] bg-[#0d0d10] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] sm:w-[81vw] sm:rounded-[22px] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar with Close button */}
        <div className="flex h-12 shrink-0 items-center justify-between gap-4 px-4 sm:h-14 sm:px-6">
          <p className="line-clamp-1 text-[13px] font-medium text-white/70 max-w-[80%] hidden sm:block">
            {video.title}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close video modal"
            className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white sm:h-9 sm:w-9 cursor-pointer active:scale-95"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M4 4l8 8M12 4l-8 8"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Video Player — aspect-ratio: 16/9 */}
        <div className="px-2 sm:px-5">
          <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
            <VideoPlayer
              youtubeId={video.youtubeId}
              title={video.title}
              thumbnail={video.thumbnail}
              accent={video.accent}
            />
          </div>
        </div>

        {/* Bottom bar — channel link + category */}
        <div className="flex h-12 shrink-0 items-center justify-between gap-4 px-4 sm:h-14 sm:px-6">
          <a
            href={getChannelUrl(video.channelId, video.author.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex shrink-0 items-center gap-1.5 rounded-full py-1 pl-1 pr-2 text-[12px] text-white/70 transition-colors hover:bg-white/5 hover:text-white sm:text-[13px]"
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
          <span className="shrink-0 rounded-full border border-white/[0.08] px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-[0.06em] text-white/50 sm:text-[12px]">
            {video.toolCategory}
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
}
