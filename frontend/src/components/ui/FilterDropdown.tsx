'use client';

import React, { useEffect, useRef, useState } from "react";
import Search from "lucide-react/dist/esm/icons/search";

interface FilterDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  itemsCounts: Record<string, number>;
  totalCount: number;
  selectedItem: string | null;
  onSelectItem: (item: string | null) => void;
  searchPlaceholder?: string;
  allLabel?: string;
}

export function FilterDropdown({
  isOpen,
  onClose,
  itemsCounts,
  totalCount,
  selectedItem,
  onSelectItem,
  searchPlaceholder = "Search...",
  allLabel = "All items",
}: FilterDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Reset search and autofocus on open
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Filter items based on search query
  const filteredItems = React.useMemo(() => {
    const entries = Object.entries(itemsCounts);
    if (!searchQuery) return entries;
    return entries.filter(([item]) =>
      item.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [itemsCounts, searchQuery]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 mt-2 z-50 w-56 bg-[#131316] border border-[#232326] rounded-lg shadow-2xl p-2 select-none"
    >
      {/* Search Input */}
      <div className="relative mb-2">
        <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[#71717A]">
          <Search size={12} />
        </span>
        <input
          ref={searchInputRef}
          type="text"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-7 pr-3 py-1.5 text-xs bg-[#000000] border border-[#232326] rounded text-white focus:outline-none focus:border-[#71717A] placeholder-[#71717A] font-medium"
        />
      </div>

      {/* Options List */}
      <div className="max-h-52 overflow-y-auto flex flex-col gap-0.5 custom-scrollbar">
        {/* All Items option */}
        <button
          onClick={() => {
            onSelectItem(null);
            onClose();
          }}
          className={`w-full text-left px-2.5 py-1.5 text-xs rounded transition-colors flex justify-between items-center font-medium focus:outline-none focus:bg-neutral-800 ${
            selectedItem === null
              ? "text-white bg-[#18181C]"
              : "text-[#A1A1AA] hover:text-white hover:bg-[#18181C]/40"
          }`}
        >
          <span>{allLabel}</span>
          <span className="text-[10px] text-[#71717A] font-mono">({totalCount})</span>
        </button>

        {/* Dynamic items list */}
        {filteredItems.map(([item, count]) => (
          <button
            key={item}
            onClick={() => {
              onSelectItem(item);
              onClose();
            }}
            className={`w-full text-left px-2.5 py-1.5 text-xs rounded transition-colors flex justify-between items-center font-medium focus:outline-none focus:bg-neutral-800 ${
              selectedItem === item
                ? "text-white bg-[#18181C]"
                : "text-[#A1A1AA] hover:text-white hover:bg-[#18181C]/40"
            }`}
          >
            <span>{item}</span>
            <span className="text-[10px] text-[#71717A] font-mono">({count})</span>
          </button>
        ))}

        {filteredItems.length === 0 && (
          <div className="text-center py-4 text-xs text-[#71717A]">
            No items match search.
          </div>
        )}
      </div>
    </div>
  );
}
