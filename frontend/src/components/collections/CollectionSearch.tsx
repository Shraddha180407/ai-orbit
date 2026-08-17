"use client";

import React, { useRef } from "react";
import { Search, X } from "lucide-react";

interface CollectionSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
}

export function CollectionSearch({ value, onChange, onSearch }: CollectionSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) {
      e.preventDefault();
      onSearch(value);
    }
  };

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search collections..."
        className="w-full h-11 bg-[#0D0D0F] border border-[#232326] text-white text-sm rounded-xl pl-4 pr-20 placeholder:text-[#52525B] focus:outline-none focus:border-[#6E56CF] transition-colors"
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {value ? (
          <button
            type="button"
            onClick={() => {
              onChange("");
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="text-[#52525B] hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        ) : (
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-[#232326] bg-[#18181C] px-1.5 font-mono text-[9px] text-[#52525B] pointer-events-none">
            <span>⌘</span>K
          </kbd>
        )}
        <button
          type="button"
          onClick={() => onSearch && onSearch(value)}
          aria-label="Search"
          className="text-[#52525B] hover:text-white transition-colors"
        >
          <Search size={16} />
        </button>
      </div>
    </div>
  );
}
