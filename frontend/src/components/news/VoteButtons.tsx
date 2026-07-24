"use client";

import { useEffect, useState } from "react";
import ArrowUp from "lucide-react/dist/esm/icons/arrow-up";
import ArrowDown from "lucide-react/dist/esm/icons/arrow-down";
import { API_URL } from "@/lib/api";
import { getClientId } from "@/lib/clientId";
import { cn } from "@/lib/utils";

type Vote = "up" | "down" | null;

interface VoteButtonsProps {
  up: number;
  down: number;
  id: string;
  layout?: "row" | "col";
  fluid?: boolean;
}

/**
 * Real, persisted voting via POST /api/news/:slug/vote. Same button
 * treatment as the homepage listing's Compare button (rounded-md border,
 * bg-surface, active state uses var(--color-signal)) instead of the old
 * purple accent — see ArticleDetail.tsx for where this renders.
 */
export function VoteButtons({ up, down, id, layout = "row", fluid = false }: VoteButtonsProps) {
  const key = "tas_vote_" + id;
  const [vote, setVote] = useState<Vote>(null);
  const [counts, setCounts] = useState({ up, down });
  const [pending, setPending] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored === "up" || stored === "down") setVote(stored);
    } catch {
      // localStorage unavailable — ignore
    }
  }, [key]);

  const cast = async (dir: "up" | "down") => {
    if (pending) return;
    setPending(true);
    try {
      const res = await fetch(`${API_URL}/api/news/${encodeURIComponent(id)}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: getClientId(), value: dir === "up" ? 1 : -1 }),
      });
      if (!res.ok) throw new Error(`vote failed: ${res.status}`);
      const data: { upvotes: number; downvotes: number; myVote: 1 | -1 | null } = await res.json();
      setCounts({ up: data.upvotes, down: data.downvotes });
      const nextVote: Vote = data.myVote === 1 ? "up" : data.myVote === -1 ? "down" : null;
      setVote(nextVote);
      try {
        if (nextVote) window.localStorage.setItem(key, nextVote);
        else window.localStorage.removeItem(key);
      } catch {
        // localStorage unavailable — ignore
      }
    } catch (err) {
      console.error("Vote failed:", err);
    } finally {
      setPending(false);
    }
  };

  const renderButton = (dir: "up" | "down", count: number, ArrowIcon: typeof ArrowUp) => {
    const on = vote === dir;
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          cast(dir);
        }}
        disabled={pending}
        aria-pressed={on}
        aria-label={dir === "up" ? "Upvote" : "Downvote"}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 rounded-md border px-3 h-9 text-xs font-mono font-semibold transition-colors",
          fluid && "w-full",
          on ? "border-transparent text-black" : "border-[#232326]/60 bg-[#18181C] text-[#A1A1AA] hover:border-[#3a3a3d] hover:text-white",
          pending && "opacity-70 cursor-default"
        )}
        style={on ? { backgroundColor: "var(--color-signal)" } : undefined}
      >
        <ArrowIcon size={14} />
        <span className="min-w-[1.5ch]">{count.toLocaleString()}</span>
      </button>
    );
  };

  if (fluid) {
    return (
      <div className="grid grid-cols-2 gap-3 w-full" onClick={(e) => e.stopPropagation()}>
        {renderButton("up", counts.up, ArrowUp)}
        {renderButton("down", counts.down, ArrowDown)}
      </div>
    );
  }

  return (
    <div className={cn("inline-flex gap-2", layout === "col" ? "flex-col" : "flex-row")} onClick={(e) => e.stopPropagation()}>
      {renderButton("up", counts.up, ArrowUp)}
      {renderButton("down", counts.down, ArrowDown)}
    </div>
  );
}
