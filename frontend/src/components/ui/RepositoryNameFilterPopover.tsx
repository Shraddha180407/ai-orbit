'use client';

import React, { useEffect, useRef } from "react";

interface RepositoryNameFilterPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onChangeSearchQuery: (query: string) => void;
  onApply: () => void;
  onReset: () => void;
}

export function RepositoryNameFilterPopover({
  isOpen,
  onClose,
  searchQuery,
  onChangeSearchQuery,
  onApply,
  onReset,
}: RepositoryNameFilterPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  // Capture active trigger element and focus search input on open
  useEffect(() => {
    if (isOpen) {
      triggerElementRef.current = document.activeElement as HTMLElement;
      inputRef.current?.focus();
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
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
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

  // Handle keyboard close triggers
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
      e.preventDefault();
    }
  };

  // Handle enter key press to apply
  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      onApply();
    }
  }

  if (!isOpen) return null;

  return (
    <div
      ref={popoverRef}
      id="repo-name-filter-popover"
      role="dialog"
      aria-label="Filter repositories by name"
      onKeyDown={handleKeyDown}
      className="absolute top-full left-0 mt-2 z-50 w-64 bg-[#131316] border border-[#232326] rounded-lg shadow-2xl p-3 select-none flex flex-col gap-2"
    >
      <span className="text-[10px] uppercase font-bold tracking-wider text-[#71717A]">
        Filter by Name
      </span>

      {/* Text Input */}
      <input
        ref={inputRef}
        type="text"
        placeholder="Filter by repository name..."
        value={searchQuery}
        onChange={(e) => onChangeSearchQuery(e.target.value)}
        onKeyDown={handleInputKeyDown}
        aria-label="Filter by repository name"
        className="w-full px-3 py-1.5 text-xs bg-[#000000] border border-[#232326] rounded text-white focus:outline-none focus:border-[#71717A] placeholder-[#71717A] font-medium"
      />


      {/* Buttons */}
      <div className="flex justify-end gap-2">
        <button
          onClick={onReset}
          className="px-3 py-1.5 text-xs font-semibold text-[#A1A1AA] hover:text-white border border-[#232326] bg-transparent hover:bg-[#18181C]/40 rounded transition-colors focus:outline-none"
        >
          Reset
        </button>
        <button
          onClick={onApply}
          className="px-3 py-1.5 text-xs font-bold text-black bg-white hover:bg-neutral-200 rounded transition-colors focus:outline-none"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
