'use client';

import React from "react";
import Search from 'lucide-react/dist/esm/icons/search';
import X from 'lucide-react/dist/esm/icons/x';

type TaskSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export function TaskSearchBar({ value, onChange }: TaskSearchBarProps) {
  return (
    <div className="relative flex-1 min-w-[240px] max-w-md">
      <Search
        className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#71717A] pointer-events-none"
        aria-hidden="true"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search tasks…"
        aria-label="Search tasks"
        className="w-full rounded-lg bg-[#131316] border border-[#232326] text-sm text-white placeholder:text-[#71717A] pl-10 pr-10 py-2.5 outline-none focus:ring-2 focus:ring-[#6E56CF]/60 focus:border-[#6E56CF]/60 transition-all"
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-md flex items-center justify-center text-[#71717A] hover:text-white hover:bg-[#232326] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF]/60"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}