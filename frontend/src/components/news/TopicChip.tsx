"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TopicChipProps {
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
  large?: boolean;
}

/**
 * Selected-topic/source pill (the "Funding ✕" style removable filter chips
 * in NewsListingClient, and the large topic tag on ArticleDetail). Same
 * classes as TopFilters.tsx's active category chip — solid white pill,
 * black text — since removable/active filters are visually "selected"
 * the same way on /tools.
 */
export function TopicChip({ children, onClick, active, large }: TopicChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-full border font-medium transition-all active:scale-95 whitespace-nowrap",
        large ? "px-4 py-2 text-sm" : "px-3.5 py-1.5 text-xs",
        active
          ? "bg-white text-black border-transparent hover:bg-neutral-200"
          : "bg-surface border-border text-foreground-muted hover:border-accent",
        onClick ? "cursor-pointer" : "cursor-default"
      )}
    >
      {children}
    </button>
  );
}
