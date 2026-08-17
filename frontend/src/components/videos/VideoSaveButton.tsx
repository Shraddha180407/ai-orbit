"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { ICONS } from "@/lib/icons";

/**
 * Frontend-only bookmark toggle for videos — localStorage, no API call.
 * Unlike components/news/SaveButton.tsx (which persists to the backend via
 * /api/news/:slug/bookmark), this is intentionally client-side only for now;
 * wire up a real /api/videos/:slug/bookmark endpoint + call here later if/when
 * this needs to persist across devices.
 */
export function VideoSaveButton({ id, className }: { id: string; className?: string }) {
  const key = "aiorbit_video_saved_" + id;
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      setTimeout(() => setSaved(window.localStorage.getItem(key) === "1"), 0);
    } catch {
      // localStorage unavailable — ignore
    }
  }, [key]);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !saved;
    setSaved(next);
    try {
      if (next) window.localStorage.setItem(key, "1");
      else window.localStorage.removeItem(key);
    } catch {
      // localStorage unavailable — ignore
    }
  };

  return (
    <button
      onClick={toggle}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved videos" : "Save video"}
      title={saved ? "Saved" : "Save"}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
        saved ? "text-[var(--row-accent,theme(colors.accent.DEFAULT))]" : "text-muted hover:text-secondary"
      } hover:bg-white/5 ${className ?? ""}`}
    >
      <Icon path={ICONS.bookmark} size={16} fill={saved} />
    </button>
  );
}