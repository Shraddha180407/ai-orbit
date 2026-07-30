'use client';

import React from "react";

interface Props {
  viewMode: "list" | "grid";
  setViewMode: (val: "list" | "grid") => void;
  hasActiveFilters: boolean;
  clearAllFilters: () => void;
}

export function CollectionToolbar({
  viewMode,
  setViewMode,
  hasActiveFilters,
  clearAllFilters,
}: Props) {
  return (
    <div className="flex items-center justify-end gap-3 mb-4">
      <div className="flex items-center gap-2">
        {hasActiveFilters && (
          <button onClick={clearAllFilters}
            className="text-xs text-[#A1A1AA] hover:text-white border border-[#232326] hover:border-[#6E56CF] px-3 py-1.5 rounded-lg transition-colors">
            Clear filters
          </button>
        )}
        <button onClick={() => setViewMode("list")}
          className={`p-2 rounded-lg border transition-colors ${viewMode === "list" ? "border-[#6E56CF] bg-[#6E56CF]/10 text-[#6E56CF]" : "border-[#232326] text-[#52525B] hover:text-white"}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
        </button>
        <button onClick={() => setViewMode("grid")}
          className={`p-2 rounded-lg border transition-colors ${viewMode === "grid" ? "border-[#6E56CF] bg-[#6E56CF]/10 text-[#6E56CF]" : "border-[#232326] text-[#52525B] hover:text-white"}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
        </button>
      </div>
    </div>
  );
}
