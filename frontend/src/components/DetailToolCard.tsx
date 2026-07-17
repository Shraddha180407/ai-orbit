"use client";

import { useState } from "react";
import { Bookmark, ExternalLink, Star } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

// NOTE: bookmarking currently persists to localStorage as a placeholder,
// same as the design prototype. Replace with the real bookmarks API
// (POST /api/v1/tools/:slug/bookmark — already exists in Module 3) once
// this module has access to real user auth/session, instead of the demo
// user pattern used elsewhere in the backend.
function toggleLocalBookmark(toolId: string): boolean {
  const key = "aiorbit:bookmarked-tools";
  const raw = window.localStorage.getItem(key);
  const saved: string[] = raw ? JSON.parse(raw) : [];
  const isBookmarked = saved.includes(toolId);
  const next = isBookmarked ? saved.filter((id) => id !== toolId) : [...saved, toolId];
  window.localStorage.setItem(key, JSON.stringify(next));
  return !isBookmarked;
}

const PRICING_LABELS: Record<string, string> = {
  FREE: "Free",
  FREEMIUM: "Freemium",
  PAID: "Paid",
  FREE_TRIAL: "Free Trial",
};

export function DetailToolCard({ tool }: { tool: any }) {
  const [bookmarked, setBookmarked] = useState(false);
  const categoryName = tool.categories?.[0]?.category?.name;
  const pricingLabel = PRICING_LABELS[tool.pricingModel] ?? tool.pricingModel;

  return (
    <div className="flex flex-col rounded-lg border border-border bg-surface p-5 transition-colors hover:border-accent/40">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-surface-raised">
            <Logo src={tool.logoUrl} name={tool.name} size={40} className="p-1" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">{tool.name}</h4>
            {tool.avgRating != null && (
              <div className="flex items-center gap-1 text-xs text-foreground-muted">
                <Star size={11} style={{ fill: "var(--collections-gold)", color: "var(--collections-gold)" }} />
                {tool.avgRating.toFixed(1)}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => setBookmarked(toggleLocalBookmark(tool.id))}
          aria-pressed={bookmarked}
          aria-label={bookmarked ? `Remove ${tool.name} from saved tools` : `Save ${tool.name}`}
          className="rounded-lg p-1.5 text-foreground-muted transition-colors hover:bg-surface-raised hover:text-accent"
        >
          <Bookmark
            size={16}
            className={cn(bookmarked && "fill-current")}
            style={bookmarked ? { color: "var(--color-accent)" } : undefined}
          />
        </button>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-foreground-muted">{tool.description}</p>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {categoryName && (
          <span className="rounded-full border border-border px-2.5 py-1 text-xs text-foreground-muted">
            {categoryName}
          </span>
        )}
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-xs",
            tool.pricingModel === "FREE"
              ? "bg-accent/10 text-accent"
              : "border border-border text-foreground-muted"
          )}
        >
          {pricingLabel}
        </span>
      </div>

      <a
        href={tool.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex items-center justify-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-foreground-muted transition-colors hover:border-accent/50 hover:text-accent"
      >
        Visit website
        <ExternalLink size={12} />
      </a>
    </div>
  );
}
