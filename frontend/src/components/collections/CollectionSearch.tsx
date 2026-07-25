"use client";

import React, { useRef } from "react";
import { Search, X } from "lucide-react";

interface CollectionSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
}

export function CollectionSearch({
  value,
  onChange,
  onSearch,
}: CollectionSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) {
      e.preventDefault();
      onSearch(value);
    }
  };

  return (
    <div className="relative w-full max-w-[900px] mx-auto mb-[22px]">
      <div className="relative w-full rounded-lg border border-[#232326] bg-[#111113] h-[48px] flex items-center px-5 pr-20 focus-within:border-neutral-500 transition-all duration-300">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search collections..."
          className="w-full bg-transparent text-sm text-white placeholder:text-[#71717A] focus:outline-none"
        />

        <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {value ? (
            <button
              type="button"
              onClick={() => {
                onChange("");
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="text-[#71717A] hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-[#232326] bg-[#18181C] px-1.5 font-mono text-[9px] text-[#71717A] pointer-events-none">
              <span>⌘</span>K
            </kbd>
          )}

          <button
            type="button"
            onClick={() => onSearch && onSearch(value)}
            className="text-[#71717A] hover:text-white transition-colors"
            aria-label="Search"
          >
            <Search size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}