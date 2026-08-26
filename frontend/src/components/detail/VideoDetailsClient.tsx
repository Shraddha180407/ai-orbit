'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { VideoPlayer } from "@/components/videos/VideoPlayer";
import { getVideoBySlug, Video } from "@/lib/videos-data";
import { API_URL, getFromCache } from "@/lib/api";
import { getChannelUrl } from "@/lib/video-types";

export function VideoDetailsClient() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: video = null, isLoading: loading, isError } = useQuery<Video | null>({
    queryKey: ["video-detail", slug],
    queryFn: () => getVideoBySlug(slug),
    initialData: () => {
      if (!slug) return undefined;
      return getFromCache<Video>(`${API_URL}/api/videos/${encodeURIComponent(slug)}`) || undefined;
    },
    staleTime: 15 * 60 * 1000,
    enabled: Boolean(slug),
  });

  if (isError && !video) {
    notFound();
  }

  if (loading && !video) {
    return (
      <main className="flex h-[100dvh] items-center justify-center overflow-hidden bg-[#050506]">
        <div
          className="flex w-[94vw] flex-col rounded-[14px] border border-white/[0.07] bg-[#0d0d10] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.7)] sm:w-[81vw] sm:rounded-[22px]"
          style={{ aspectRatio: "16 / 9" }}
        >
          <div className="h-full w-full animate-pulse bg-white/5 rounded-[14px] sm:rounded-[22px]" />
        </div>
      </main>
    );
  }

  if (!video) return null;

return (
<main className="flex h-[100dvh] items-center justify-center overflow-hidden bg-[#050506]">
{/*
Width-first layout: the card's width is a fixed share of the viewport
(94vw on mobile, 81vw from sm and up) and is never derived from
available height. The player inside is width-driven too
(aspect-ratio: 16/9), so its height always follows its width — it
never gets squeezed, cropped, or clipped by the surrounding chrome.
The card is simply centered, with equal margin left and right, and
never touches the viewport edges. 94vw on mobile (vs. 81vw on
desktop) because a big fixed side margin makes little sense on a
narrow phone screen — it would leave the actual video tiny.
*/}
<div
className="flex w-[94vw] flex-col rounded-[14px] border border-white/[0.07] bg-[#0d0d10] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.7)] sm:w-[81vw] sm:rounded-[22px]"
>
{/*
Close-only bar. This used to also render the video title as text
here, but YouTube's own embed already shows the title natively
(on load, and again on pause/hover) — the two together read as a
duplicate title on screen. VideoPlayer.tsx's own design comment is
explicit about this: trust YouTube's native chrome for title
rather than recreating it. Only the close button stays here.
*/}
<div className="flex h-12 shrink-0 items-center justify-end gap-4 px-4 sm:h-14 sm:px-7">
<Link
href="/videos"
aria-label="Close"
className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white sm:h-9 sm:w-9"
>
<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
<path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
</svg>
</Link>
</div>

{/* Player — width-bound (94vw mobile / 81vw sm+, from the card), height derives from 16:9 */}
<div className="px-2 sm:px-4">
<div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
<VideoPlayer youtubeId={video.youtubeId} title={video.title} />
</div>
</div>

{/* Bottom bar — channel + category. Neither duplicates YouTube's own chrome (it doesn't show category, and this channel link is clickable, not decorative), so this stays as-is. */}
<div className="flex h-12 shrink-0 items-center justify-between gap-4 px-4 sm:h-14 sm:px-7">
<a
href={getChannelUrl(video.channelId, video.author.name)}
target="_blank"
rel="noopener noreferrer"
className="group flex shrink-0 items-center gap-1.5 rounded-full py-1 pl-1 pr-2 text-[12px] text-white/60 transition-colors hover:bg-white/5 hover:text-white sm:text-[12.5px]"
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
<p className="shrink-0 text-[11px] uppercase tracking-[0.06em] text-white/40 sm:text-[12.5px]">
{video.toolCategory}
</p>
</div>
</div>
</main>
);
}