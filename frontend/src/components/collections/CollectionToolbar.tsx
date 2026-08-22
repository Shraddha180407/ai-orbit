'use client';

import React from "react";

interface Props {
  viewMode: "list" | "grid";
  setViewMode: (val: "list" | "grid") => void;
  hasActiveFilters: boolean;
  clearAllFilters: () => void;
}

export function CollectionToolbar({
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
        
      </div>
    </div>
  );
}
