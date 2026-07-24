"use client";

import { cn } from "@/lib/utils";
import type { NewsFilterChip } from "@/types/news";

interface FilterChipsProps {
  items: NewsFilterChip[];
  value: string;
  onChange: (id: string) => void;
}

/**
 * Same pill treatment as TopFilters.tsx's category chips on /tools: active
 * = solid white pill with black text, inactive = bg-surface/border-border,
 * rounded-full, text-xs font-medium. Scoped here to reuse for the news
 * filter chips (All News / Trending / dynamic topics) with identical
 * classes, not a separate purple-accent chip style.
 */
export function FilterChips({ items, value, onChange }: FilterChipsProps) {
  return (
    <div role="tablist" aria-label="News filters" className="flex flex-nowrap gap-3 overflow-x-auto scrollbar-none pb-1">
      {items.map((it) => {
        const active = it.id === value;
        return (
          <button
            key={it.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(it.id)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-medium border transition-all active:scale-95 whitespace-nowrap",
              active ? "bg-white text-black border-transparent hover:bg-neutral-200" : "bg-surface border-border text-foreground-muted hover:border-accent"
            )}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
