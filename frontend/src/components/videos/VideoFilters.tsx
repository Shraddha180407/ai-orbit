"use client";

import { useState } from "react";
import { TOOL_CATEGORIES, CATEGORY_LABELS, CATEGORY_COLORS, type ToolCategory } from "@/lib/video-types";

const categories: ("All" | ToolCategory)[] = ["All", ...TOOL_CATEGORIES];

const DEFAULT_COLOR = "#5e6ad2";

export function VideoFilters({
  onChange,
}: {
  onChange?: (state: { category: "All" | ToolCategory; query: string }) => void;
}) {
  const [active, setActive] = useState<"All" | ToolCategory>("All");
  const [query, setQuery] = useState("");

  function update(next: { category?: "All" | ToolCategory; query?: string }) {
    const category = next.category ?? active;
    const q = next.query ?? query;
    if (next.category) setActive(next.category);
    if (next.query !== undefined) setQuery(next.query);
    onChange?.({ category, query: q });
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none]">
        {categories.map((c) => {
          const color = c === "All" ? DEFAULT_COLOR : CATEGORY_COLORS[c];
          const label = c === "All" ? "All" : CATEGORY_LABELS[c];
          const isActive = active === c;
          return (
            <button
              key={c}
              onClick={() => update({ category: c })}
              className="flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-all duration-200"
              style={
                isActive
                  ? {
                      borderColor: `${color}80`,
                      backgroundColor: `${color}26`,
                      color,
                    }
                  : {
                      borderColor: "var(--border)",
                      color: "var(--text-secondary)",
                    }
              }
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.borderColor = "var(--border-strong)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              {c !== "All" && (
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: color }}
                />
              )}
              {label}
            </button>
          );
        })}
      </div>
      <div className="relative w-full sm:w-64">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          width="15"
          height="15"
          viewBox="0 0 16 16"
          fill="none"
        >
          <circle cx="7" cy="7" r="5.25" stroke="currentColor" strokeWidth="1.4" />
          <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <input
          value={query}
          onChange={(e) => update({ query: e.target.value })}
          placeholder="Search videos or tools"
          className="w-full rounded-lg border border-border bg-bg-elevated py-2 pl-9 pr-3 text-[13.5px] text-primary placeholder:text-muted outline-none transition-colors focus:border-border-strong"
        />
      </div>
    </div>
  );
}