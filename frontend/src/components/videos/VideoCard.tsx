"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Video, formatDuration, formatViews, formatRelativeDate } from "@/lib/video-types";
import { ThumbImage } from "./ThumbImage";

const HOVER_DELAY = 280; // ms — long enough to skip accidental mouse-passes, short enough to feel responsive

export function VideoCard({
  video,
  variant = "grid",
  rank,
  index = 0,
}: {
  video: Video;
  variant?: "grid" | "rail" | "row";
  rank?: number;
  index?: number;
}) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function open() {
    timer.current = setTimeout(() => setPreviewOpen(true), HOVER_DELAY);
  }
  function close() {
    if (timer.current) clearTimeout(timer.current);
    setPreviewOpen(false);
  }

  if (variant === "row") {
    return (
      <Link
        href={`/videos/${video.slug}`}
        className="group relative flex items-center gap-3 rounded-lg border border-transparent p-2.5 -mx-2.5 transition-colors duration-200 active:bg-bg-hover hover:border-border hover:bg-bg-hover sm:gap-4 sm:p-3 sm:-mx-3"
        style={{ ["--tool-accent" as string]: video.accent }}
      >
        <span
          className="absolute left-0 top-1/2 h-0 w-[3px] -translate-y-1/2 rounded-full transition-all duration-200 group-hover:h-[70%]"
          style={{ background: video.accent }}
        />
        <div className="relative w-[90px] shrink-0 overflow-hidden rounded-none aspect-video bg-bg-elevated sm:w-32">
          <ThumbImage
            src={video.thumbnail}
            alt=""
            toolName={video.toolName}
            accent={video.accent}
            sizes="(max-width: 640px) 112px, 160px"
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            style={{ boxShadow: `inset 0 0 0 1.5px ${video.accent}99` }}
          />
          <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1 py-0.5 text-[10px] font-medium text-white font-mono sm:bottom-1.5 sm:right-1.5 sm:text-[11px]">
            {formatDuration(video.durationSeconds)}
          </span>
        </div>
        <div className="min-w-0">
          <p className="truncate text-[13.5px] font-medium leading-snug text-primary transition-colors group-hover:text-[var(--tool-accent)] sm:text-[14px]">
            {video.title}
          </p>
          <p className="mt-1 flex items-center gap-1.5 truncate text-[12px] text-secondary sm:text-[12.5px]">
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: video.accent }}
            />
            {video.toolName} <span className="text-muted">·</span>{" "}
            <span className="font-mono">{formatViews(video.views)}</span>
          </p>
        </div>
      </Link>
    );
  }

  return (
    <div
      className={`relative animate-fadeUp ${variant === "rail" ? "w-[280px] shrink-0" : ""}`}
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
      onMouseEnter={open}
      onMouseLeave={close}
    >
      <Link
        href={`/videos/${video.slug}`}
        className="group relative block"
        style={{ ["--tool-accent" as string]: video.accent }}
      >
        <div className="relative overflow-hidden rounded-none border border-border bg-bg-elevated aspect-video">
          <ThumbImage
            src={video.thumbnail}
            alt=""
            toolName={video.toolName}
            accent={video.accent}
            sizes="(max-width: 768px) 100vw, 360px"
            priority={index < 4}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
          <div
            className="pointer-events-none absolute inset-0 rounded-none opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              boxShadow: `inset 0 0 0 1.5px ${video.accent}b3, 0 16px 36px -16px ${video.accent}66`,
            }}
          />
          <span className="absolute bottom-2 right-2 z-10 rounded bg-black/70 px-1.5 py-0.5 text-[11px] font-medium text-white font-mono">
            {formatDuration(video.durationSeconds)}
          </span>
          {typeof rank === "number" && (
            <span
              className="absolute left-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full text-[13px] font-semibold text-white backdrop-blur-sm"
              style={{
                background: `${video.accent}e6`,
                boxShadow: `0 4px 14px -2px ${video.accent}80`,
              }}
            >
              {rank}
            </span>
          )}
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-bg shadow-lg">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M3 1.7a.7.7 0 0 1 1.06-.6l10.6 6.3a.7.7 0 0 1 0 1.2L4.06 14.9A.7.7 0 0 1 3 14.3V1.7Z" />
              </svg>
            </span>
          </span>
        </div>
        <div className="mt-[9.6px] flex gap-[9.6px]">
          <div
            className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold"
            style={{ background: `${video.accent}26`, color: video.accent }}
          >
            {video.author.avatar}
          </div>
          <div className="min-w-0">
            <p
              className="truncate text-[14.5px] font-medium leading-snug text-primary transition-colors group-hover:text-[var(--tool-accent)]"
            >
              {video.title}
            </p>
            <p className="mt-1.5 text-[12.5px] text-secondary">
              {video.toolName} <span className="mx-1 text-muted">·</span>{" "}
              <span className="font-mono">{formatViews(video.views)}</span>
              <span className="mx-1 text-muted">·</span> {formatRelativeDate(video.publishedAt)}
            </p>
          </div>
        </div>
      </Link>

      {/* Hover preview: floats above the card, doesn't shift layout of neighbors */}
      {previewOpen && variant === "grid" && (
        <div
          className="absolute left-0 top-0 z-30 w-full animate-popIn origin-top overflow-hidden rounded-card border bg-surface shadow-2xl"
          style={{
            borderColor: `${video.accent}4d`,
            boxShadow: `0 24px 48px -12px rgba(0,0,0,0.55), 0 0 0 1px ${video.accent}26`,
          }}
        >
          <Link href={`/videos/${video.slug}`} className="block">
            <div className="relative overflow-hidden rounded-none aspect-video">
              <ThumbImage
                src={video.thumbnail}
                alt=""
                toolName={video.toolName}
                accent={video.accent}
                sizes="360px"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-bg shadow-lg">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M3 1.7a.7.7 0 0 1 1.06-.6l10.6 6.3a.7.7 0 0 1 0 1.2L4.06 14.9A.7.7 0 0 1 3 14.3V1.7Z" />
                  </svg>
                </span>
              </div>
              <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[11px] font-medium text-white font-mono">
                {formatDuration(video.durationSeconds)}
              </span>
            </div>
          </Link>
          <div className="p-[12.8px]">
            <div
              className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.05em]"
              style={{ color: video.accent }}
            >
              {video.toolCategory}
            </div>
            <Link href={`/videos/${video.slug}`}>
              <p className="mt-1.5 truncate text-[14px] font-medium leading-snug text-primary hover:text-accent-hover">
                {video.title}
              </p>
            </Link>
            <p className="mt-2 line-clamp-2 text-[12.5px] leading-relaxed text-secondary">
              {video.description}
            </p>
            <div className="mt-[9.6px] flex flex-wrap gap-2.5">
              {video.tags.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border px-2.5 py-0.5 text-[11px] text-secondary"
                >
                  #{t}
                </span>
              ))}
            </div>
            <div className="mt-[9.6px] flex items-center justify-between border-t border-border pt-[9.6px]">
              <span className="text-[12px] text-muted">
                <span className="font-mono">{formatViews(video.views)}</span> ·{" "}
                {formatRelativeDate(video.publishedAt)}
              </span>
              <Link
                href={`/videos/${video.slug}`}
                className="rounded-md px-2.5 py-1 text-[12px] font-medium text-white transition-colors"
                style={{ background: video.accent }}
              >
                Watch
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}