"use client";

import { useEffect, useState } from "react";
import Bookmark from "lucide-react/dist/esm/icons/bookmark";
import { API_URL } from "@/lib/api";
import { getClientId } from "@/lib/clientId";
import { cn } from "@/lib/utils";

interface SaveButtonProps {
  id: string;
  fluid?: boolean;
  initialBookmarked?: boolean;
}

/**
 * Real, persisted bookmarking via POST/DELETE /api/news/:slug/bookmark.
 * Same button treatment as VoteButtons.tsx now — bg-[#18181C]/border-
 * [#232326] resting, var(--color-signal) active — matching the homepage's
 * accent color instead of the old purple theme.
 */
export function SaveButton({ id, fluid, initialBookmarked }: SaveButtonProps) {
  const key = "tas_bm_" + id;
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (initialBookmarked !== undefined) {
      setSaved(initialBookmarked);
      try {
        if (initialBookmarked) window.localStorage.setItem(key, "1");
        else window.localStorage.removeItem(key);
      } catch {
        // localStorage unavailable — ignore
      }
      return;
    }
    try {
      setSaved(window.localStorage.getItem(key) === "1");
    } catch {
      // localStorage unavailable — ignore
    }
  }, [key, initialBookmarked]);

  const toggle = async () => {
    if (pending) return;
    setPending(true);
    const next = !saved;
    try {
      const clientId = getClientId();
      const res = next
        ? await fetch(`${API_URL}/api/news/${encodeURIComponent(id)}/bookmark`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ clientId }),
          })
        : await fetch(`${API_URL}/api/news/${encodeURIComponent(id)}/bookmark?clientId=${encodeURIComponent(clientId)}`, {
            method: "DELETE",
          });
      if (!res.ok) throw new Error(`bookmark failed: ${res.status}`);
      setSaved(next);
      try {
        if (next) window.localStorage.setItem(key, "1");
        else window.localStorage.removeItem(key);
      } catch {
        // localStorage unavailable — ignore
      }
    } catch (err) {
      console.error("Bookmark failed:", err);
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={saved}
      className={cn(
        "inline-flex items-center gap-2 rounded-md border h-10 px-4 text-sm font-medium transition-colors",
        fluid ? "w-full justify-center" : "justify-start",
        saved ? "border-transparent text-black" : "border-[#232326]/60 bg-[#18181C] text-[#A1A1AA] hover:border-[#3a3a3d] hover:text-white",
        pending && "opacity-70 cursor-default"
      )}
      style={saved ? { backgroundColor: "var(--color-signal)" } : undefined}
    >
      <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
      {saved ? "Saved" : "Save"}
    </button>
  );
}
