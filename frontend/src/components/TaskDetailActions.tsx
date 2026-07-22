'use client';

import React, { useState, useCallback } from "react";
import Bell from 'lucide-react/dist/esm/icons/bell';
import BellRing from 'lucide-react/dist/esm/icons/bell-ring';
import Copy from 'lucide-react/dist/esm/icons/copy';
import Check from 'lucide-react/dist/esm/icons/check';
import Share2 from 'lucide-react/dist/esm/icons/share-2';
import Heart from 'lucide-react/dist/esm/icons/heart';
import { toggleBookmark, toggleLike, toggleSubscribe } from "@/lib/tasks-api";

type TaskDetailActionsProps = {
  slug: string;
  taskId: string;
  taskTitle: string;
  initialLiked: boolean;
  initialSubscribed: boolean;
  initialBookmarked: boolean;
  initialLikes: number;
  initialSaves: number;
};

export function TaskDetailActions({
  slug,
  taskId,
  taskTitle,
  initialLiked,
  initialSubscribed,
  initialBookmarked,
  initialLikes,
  initialSaves,
}: TaskDetailActionsProps) {
  const [subscribed, setSubscribed] = useState(initialSubscribed);
  const [liked, setLiked] = useState(initialLiked);
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [saveCount, setSaveCount] = useState(initialSaves);
  const [copied, setCopied] = useState(false);

  const handleSubscribe = useCallback(async () => {
    const next = !subscribed;
    setSubscribed(next);
    try {
      const res = await toggleSubscribe(slug);
      setSubscribed(res.subscribed);
    } catch (e) {
      console.error("Failed to toggle subscribe:", e);
      setSubscribed(!next);
    }
  }, [subscribed, slug]);

  const handleLike = useCallback(async () => {
    const next = !liked;
    setLiked(next);
    setLikeCount((prev) => prev + (next ? 1 : -1));
    try {
      const res = await toggleLike(slug);
      setLiked(res.liked);
    } catch (e) {
      console.error("Failed to toggle like:", e);
      setLiked(!next);
      setLikeCount((prev) => prev + (next ? -1 : 1));
    }
  }, [liked, slug]);

  const handleBookmark = useCallback(async () => {
    const next = !bookmarked;
    setBookmarked(next);
    setSaveCount((prev) => prev + (next ? 1 : -1));
    try {
      const res = await toggleBookmark(slug, taskId);
      setBookmarked(res.bookmarked);
    } catch (e) {
      console.error("Failed to toggle bookmark:", e);
      setBookmarked(!next);
      setSaveCount((prev) => prev + (next ? -1 : 1));
    }
  }, [bookmarked, slug, taskId]);

  const getShareUrl = useCallback(() => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return `/tasks/${slug}`;
  }, [slug]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy link:", e);
    }
  }, [getShareUrl]);

  const handleShare = useCallback(async () => {
    const url = getShareUrl();
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title: taskTitle, url });
        return;
      } catch {
        // User cancelled the native share sheet — not an error worth logging.
        return;
      }
    }
    handleCopy();
  }, [getShareUrl, taskTitle, handleCopy]);

  return (
    <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
      <button
        type="button"
        onClick={handleLike}
        aria-pressed={liked}
        aria-label="Like this task"
        className={`inline-flex items-center gap-1.5 rounded-lg transition-all duration-200 text-xs font-semibold px-3.5 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF]/60 ${
          liked
            ? "bg-red-500/10 ring-1 ring-red-500/30 text-red-400"
            : "bg-[#18181C]/80 ring-1 ring-[#232326]/70 text-[#A1A1AA] hover:text-white hover:ring-[#3A3A3E]"
        }`}
      >
        <Heart className={`h-3.5 w-3.5 ${liked ? "fill-red-400" : ""}`} aria-hidden="true" />
        {likeCount.toLocaleString()}
      </button>

      <button
        type="button"
        onClick={handleBookmark}
        aria-pressed={bookmarked}
        aria-label="Bookmark this task"
        className={`inline-flex items-center gap-1.5 rounded-lg transition-all duration-200 text-xs font-semibold px-3.5 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF]/60 ${
          bookmarked
            ? "bg-[#6E56CF]/10 ring-1 ring-[#6E56CF]/30 text-[#A78BFA]"
            : "bg-[#18181C]/80 ring-1 ring-[#232326]/70 text-[#A1A1AA] hover:text-white hover:ring-[#3A3A3E]"
        }`}
      >
        {saveCount.toLocaleString()} saves
      </button>

      <button
        type="button"
        onClick={handleSubscribe}
        aria-pressed={subscribed}
        className={`inline-flex items-center gap-1.5 rounded-lg transition-all duration-200 text-xs font-semibold px-4 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
          subscribed
            ? "bg-[#18181C]/80 ring-1 ring-[#3A3A3E] text-white"
            : "bg-gradient-to-b from-[#7C63E0] to-[#6E56CF] hover:from-[#8A73EA] hover:to-[#7C63E0] text-white shadow-[0_4px_16px_-4px_rgba(110,86,207,0.5)]"
        }`}
      >
        {subscribed ? (
          <BellRing className="h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <Bell className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        {subscribed ? "Subscribed" : "Subscribe"}
      </button>

      <button
        type="button"
        onClick={handleShare}
        aria-label="Share this task"
        className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-[#18181C]/80 ring-1 ring-[#232326]/70 text-[#A1A1AA] hover:text-white hover:ring-[#3A3A3E] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF]/60"
      >
        <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy link"
        className="relative inline-flex items-center justify-center h-9 w-9 rounded-lg bg-[#18181C]/80 ring-1 ring-[#232326]/70 text-[#A1A1AA] hover:text-white hover:ring-[#3A3A3E] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF]/60"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
        ) : (
          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        {copied && (
          <span className="absolute -bottom-8 right-0 whitespace-nowrap rounded-md bg-[#18181C] ring-1 ring-[#232326] px-2 py-1 text-[10px] text-white">
            Copied!
          </span>
        )}
      </button>
    </div>
  );
}