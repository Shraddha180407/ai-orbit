"use client";

import { Icon } from "@/components/ui/Icon";
import { ICONS } from "@/lib/icons";
import { useScrollFade } from "@/lib/news/useScrollFade";
import type { NewsFilterChip } from "@/types/news";

interface FilterChipsProps {
  items: NewsFilterChip[];
  value: string;
  onChange: (id: string) => void;
}

/** The only two fixed chip ids (see NewsService.getFilterChips) that warrant their own glyph — dynamic topic chips stay text-only. */
const CHIP_ICON: Record<string, string> = {
  all: ICONS.newspaper,
  trending: ICONS.flame,
};

/**
 * Horizontally-scrolling filter pills. Edge fade (via CSS mask, see
 * .tas-scroll-fade in globals.css) hints there's more to scroll on mobile
 * without needing arrow buttons, and the two fixed chips (All/Trending)
 * get a small glyph so they're scannable at a glance instead of reading
 * identically to the dynamic topic chips next to them.
 */
export function FilterChips({ items, value, onChange }: FilterChipsProps) {
  const { ref, fade } = useScrollFade<HTMLDivElement>(items.length);

  return (
    <div
      ref={ref}
      role="tablist"
      aria-label="News filters"
      className="tas-scroll-x tas-scroll-fade gap-2 sm:gap-2.5 md:gap-3"
      data-fade-start={fade.start ? "" : undefined}
      data-fade-end={fade.end ? "" : undefined}
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "nowrap",
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        padding: "2px 4px",
      }}
    >
      {items.map((it) => {
        const active = it.id === value;
        const icon = CHIP_ICON[it.id];
        return (
          <button
            key={it.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(it.id)}
            className="tas-chip h-8 gap-1.5 px-3 text-xs sm:h-9 sm:gap-[7px] sm:px-3.5 sm:text-sm md:h-[38px] md:px-4"
            data-active={active ? "" : undefined}
            style={{
              display: "inline-flex",
              alignItems: "center",
              flex: "none",
              font: "var(--fw-medium) inherit/1 var(--font-sans)",
              letterSpacing: "-0.006em",
              borderRadius: "var(--radius-pill)",
              whiteSpace: "nowrap",
            }}
          >
            {icon && <Icon path={icon} className="tas-chip-icon" size={13} />}
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
