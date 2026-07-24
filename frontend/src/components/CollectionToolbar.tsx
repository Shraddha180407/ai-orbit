"use client";

import { LayoutGrid, List, SlidersHorizontal, Eye } from "lucide-react";

interface CollectionToolbarProps {
  density: "compact" | "comfortable";
  setDensity: (density: "compact" | "comfortable") => void;
  visibleColumns: Record<string, boolean>;
  toggleColumn: (column: string) => void;
  totalCount: number;
}

export function CollectionToolbar({
  density,
  setDensity,
  visibleColumns,
  toggleColumn,
  totalCount
}: CollectionToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border border-border bg-surface-raised/40 p-4 rounded-xl mb-6 text-sm">
      <div className="text-foreground-muted font-medium">
        Showing <span className="font-mono text-foreground font-semibold">{totalCount}</span> curated bundles
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {/* Density Selectors (44x44px hit bounds matching interaction rules) */}
        <div className="flex items-center gap-1 border border-border bg-background p-1 rounded-lg">
          <button
            onClick={() => setDensity("compact")}
            className={`h-9 px-3 flex items-center gap-1.5 rounded-md font-medium transition-colors ${
              density === "compact"
                ? "bg-surface border border-border text-foreground shadow-sm"
                : "text-foreground-muted hover:text-foreground"
            }`}
            title="Compact row view"
          >
            <List size={15} />
            <span className="hidden md:inline">Compact</span>
          </button>
          <button
            onClick={() => setDensity("comfortable")}
            className={`h-9 px-3 flex items-center gap-1.5 rounded-md font-medium transition-colors ${
              density === "comfortable"
                ? "bg-surface border border-border text-foreground shadow-sm"
                : "text-foreground-muted hover:text-foreground"
            }`}
            title="Comfortable row view"
          >
            <LayoutGrid size={15} />
            <span className="hidden md:inline">Comfortable</span>
          </button>
        </div>

        {/* Dynamic Meta Column Toggles */}
        <div className="relative group">
          <button className="h-11 px-4 flex items-center gap-2 rounded-lg border border-border bg-background text-foreground hover:bg-surface/50 font-medium transition-colors">
            <Eye size={15} className="text-foreground-muted" />
            <span>Visible Columns</span>
          </button>

          {/* Hover Dropdown Pane */}
          <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-border bg-background p-2 shadow-xl opacity-0 scale-95 pointer-events-none group-focus-within:opacity-100 group-focus-within:scale-100 group-focus-within:pointer-events-auto group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-150 z-50">
            <div className="px-2 py-1.5 text-xs font-semibold text-foreground-muted uppercase tracking-wider">
              Toggle Metadata
            </div>
            <label className="flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-surface-raised cursor-pointer text-foreground select-none">
              <input
                type="checkbox"
                checked={visibleColumns.category}
                onChange={() => toggleColumn("category")}
                className="rounded border-border text-accent focus:ring-accent"
              />
              <span>Category tags</span>
            </label>
            <label className="flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-surface-raised cursor-pointer text-foreground select-none">
              <input
                type="checkbox"
                checked={visibleColumns.tools}
                onChange={() => toggleColumn("tools")}
                className="rounded border-border text-accent focus:ring-accent"
              />
              <span>Included tools</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}