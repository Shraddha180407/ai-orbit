'use client';

import React from "react";

interface Props {
  nameInput: string;
  setNameInput: (val: string) => void;
  setNameSearch: (val: string) => void;
  setCurrentPage: (val: number) => void;
  viewMode: "list" | "grid";
  setViewMode: (val: "list" | "grid") => void;
  hasActiveFilters: boolean;
  clearAllFilters: () => void;
}

export function CollectionToolbar({
  nameInput,
  setNameInput,
  setNameSearch,
  setCurrentPage,
  viewMode,
  setViewMode,
  hasActiveFilters,
  clearAllFilters,
}: Props) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="relative flex-1 max-w-md">
        <input
          type="text"
          placeholder="Search collections..."
          value={nameInput}
          onChange={(e) => { setNameInput(e.target.value); setNameSearch(e.target.value); setCurrentPage(1); }}
          className="w-full bg-[#131316] border border-[#232326] text-white text-sm rounded-lg px-3 py-2 pr-9 placeholder:text-[#52525B] focus:outline-none focus:border-[#6E56CF] transition-colors"
        />
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52525B]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
      </div>

      <div className="flex items-center gap-2 ml-auto">
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
