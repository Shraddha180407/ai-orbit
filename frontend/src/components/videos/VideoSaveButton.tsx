"use client";

import { useEffect, useState } from "react";
import Bookmark from "lucide-react/dist/esm/icons/bookmark";

/**
 * Frontend-only bookmark toggle for videos — localStorage, no API call.
 * Restyled to match NewsRowActions' save button in NewsTable.tsx (same
 * bordered-square shape, sizing, and saved-state fill) so the Videos and
 * News tables read as the same design system. Unlike News' fixed
 * --color-signal, the saved fill uses each row's own --row-accent so it
 * still matches that video's tool color.
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
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved videos" : "Save video"}
      title={saved ? "Saved" : "Save"}
      className={`inline-flex items-center justify-center rounded-md border p-1.5 transition-colors ${
        saved
          ? "border-transparent text-black bg-[var(--row-accent)]"
          : "border-[#232326]/60 bg-[#18181C] text-[#A1A1AA] hover:border-[var(--row-accent)] hover:text-white"
      } ${className ?? ""}`}
    >
      <Bookmark size={12} fill={saved ? "currentColor" : "none"} />
    </button>
  );
}