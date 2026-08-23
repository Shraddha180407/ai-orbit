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
  id?: string;
  searchAliases?: Record<string, string[]>;
  searchKeys?: Record<string, string>;
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
  id,
  searchAliases,
  searchKeys,
}: FilterDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [displayLimit, setDisplayLimit] = useState(100);

  // Debounce input value changes to search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 120);
    return () => clearTimeout(timer);
  }, [inputValue]);

  // Reset display limit when query updates
  useEffect(() => {
    setDisplayLimit(100);
  }, [searchQuery]);

  // Capture active trigger element and focus search input on open
  useEffect(() => {
    if (isOpen) {
      triggerElementRef.current = document.activeElement as HTMLElement;
      searchInputRef.current?.focus();
    } else {
      if (triggerElementRef.current) {
        triggerElementRef.current.focus();
        triggerElementRef.current = null;
      }
    }
  }, [isOpen]);

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

  // Reset search query when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setInputValue("");
      setSearchQuery("");
      setDisplayLimit(100);
    }
  }, [isOpen]);

  // Keyboard navigation logic
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
      e.preventDefault();
      return;
    }

    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!dropdownRef.current) return;

      // Select all interactive focusable elements
      const focusables = Array.from(
        dropdownRef.current.querySelectorAll("input, button")
      ) as HTMLElement[];

      if (focusables.length === 0) return;

      const currentIndex = focusables.indexOf(document.activeElement as HTMLElement);

      if (e.key === "ArrowDown") {
        const nextIndex = (currentIndex + 1) % focusables.length;
        focusables[nextIndex]?.focus();
      } else {
        const prevIndex = (currentIndex - 1 + focusables.length) % focusables.length;
        focusables[prevIndex]?.focus();
      }
    }
  };

  // Filter items based on search query
  const filteredItems = React.useMemo(() => {
    const entries = Object.entries(itemsCounts);
    if (!searchQuery) return entries;
    const query = searchQuery.toLowerCase();
    return entries.filter(([item]) => {
      // Always match against the displayed label first
      if (item.toLowerCase().includes(query)) return true;
      // Then check precomputed search keys (owner slug, company slug, etc.)
      if (searchKeys) {
        const precomputed = searchKeys[item];
        if (precomputed && precomputed.includes(query)) return true;
      }
      // Finally check aliases
      const aliases = searchAliases?.[item];
      if (aliases && aliases.some((a) => a.toLowerCase().includes(query))) return true;
      return false;
    });
  }, [itemsCounts, searchQuery, searchAliases, searchKeys]);

  const visibleItems = React.useMemo(() => {
    return filteredItems.slice(0, displayLimit);
  }, [filteredItems, displayLimit]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 20) {
      setDisplayLimit((prev) => Math.min(prev + 150, filteredItems.length));
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      id={id}
      role="dialog"
      aria-label={`${searchPlaceholder.replace("Search ", "")} filter dropdown`}
      onKeyDown={handleKeyDown}
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
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          aria-label={searchPlaceholder}
          aria-autocomplete="list"
          aria-controls={`${id || 'filter'}-options-list`}
          className="w-full pl-7 pr-3 py-1.5 text-xs bg-[#000000] border border-[#232326] rounded text-white focus:outline-none focus:border-[#71717A] placeholder-[#71717A] font-medium"
        />
      </div>

      {/* Options List */}
      <div
        role="listbox"
        id={`${id || 'filter'}-options-list`}
        aria-label="Available filter options"
        onScroll={handleScroll}
        className="max-h-52 overflow-y-auto flex flex-col gap-0.5 custom-scrollbar"
      >
        {/* All Items option */}
        <button
          onClick={() => {
            onSelectItem(null);
            onClose();
          }}
          role="option"
          aria-selected={selectedItem === null}
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
        {visibleItems.map(([item, count]) => (
          <button
            key={item}
            onClick={() => {
              onSelectItem(item);
              onClose();
            }}
            role="option"
            aria-selected={selectedItem === item}
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
