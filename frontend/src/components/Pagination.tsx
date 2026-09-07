'use client';

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import { buildToolsUrl, cn } from "@/lib/utils";
import type { ToolsSearchParams } from "@/lib/types";

export type PaginationProps = {
  page: number;
  totalPages: number;
  pageSize?: number;
  totalCount?: number;
  pageSizeOptions?: number[];
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  params?: ToolsSearchParams;
  buildUrl?: (page: number, pageSize?: number) => string;
  className?: string;
  itemLabel?: string;
};

export function Pagination({
  page,
  totalPages,
  pageSize = 100,
  totalCount,
  pageSizeOptions = [10, 20, 50, 100],
  onPageChange,
  onPageSizeChange,
  params,
  buildUrl,
  className,
}: PaginationProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  if (totalPages <= 1 && (!totalCount || totalCount <= pageSize) && !onPageSizeChange) {
    return null;
  }

  const effectiveTotalPages = Math.max(1, totalPages);
  const pageNumbers = getPageWindow(page, effectiveTotalPages);

  const getHref = (targetPage: number) => {
    if (buildUrl) return buildUrl(targetPage, pageSize);
    if (params) return buildToolsUrl(params, { page: String(targetPage) });
    return `#page-${targetPage}`;
  };

  const handlePageClick = (e: React.MouseEvent, targetPage: number) => {
    if (targetPage < 1 || targetPage > effectiveTotalPages || targetPage === page) {
      if (!onPageChange && targetPage === page) e.preventDefault();
      return;
    }
    if (onPageChange) {
      e.preventDefault();
      onPageChange(targetPage);
    }
  };

  const handleSizeSelect = (newSize: number) => {
    setIsDropdownOpen(false);
    if (onPageSizeChange) {
      onPageSizeChange(newSize);
    }
  };

  const prevDisabled = page <= 1;
  const nextDisabled = page >= effectiveTotalPages;

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex flex-col sm:flex-row items-center justify-center gap-3 py-6 w-full", className)}
    >
      {/* Floating Pill Container matching exact reference screenshot */}
      <div className="inline-flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-full border border-[#232326] bg-[#131316]/95 backdrop-blur-md shadow-xl text-xs text-[#A1A1AA]">
        
        {/* Previous Button */}
        {onPageChange || !params ? (
          <button
            type="button"
            onClick={(e) => handlePageClick(e, Math.max(1, page - 1))}
            disabled={prevDisabled}
            aria-disabled={prevDisabled}
            aria-label="Previous page"
            className={cn(
              "flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-[#A1A1AA] hover:text-white hover:bg-[#1A1A1E] transition-all cursor-pointer",
              prevDisabled && "pointer-events-none opacity-30 cursor-not-allowed"
            )}
          >
            <ChevronLeft size={15} aria-hidden="true" />
          </button>
        ) : (
          <Link
            href={getHref(Math.max(1, page - 1))}
            aria-disabled={prevDisabled}
            aria-label="Previous page"
            className={cn(
              "flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-[#A1A1AA] hover:text-white hover:bg-[#1A1A1E] transition-all",
              prevDisabled && "pointer-events-none opacity-30"
            )}
          >
            <ChevronLeft size={15} aria-hidden="true" />
          </Link>
        )}

        {/* Numbered Page List with Circular Indicator */}
        <div className="flex items-center gap-1 px-1">
          {pageNumbers.map((n, i) => {
            if (n === "ellipsis") {
              return (
                <span key={`e-${i}`} className="px-1 text-xs text-[#71717A] select-none font-mono">
                  …
                </span>
              );
            }

            const isCurrent = n === page;

            if (onPageChange || !params) {
              return (
                <button
                  key={n}
                  type="button"
                  onClick={(e) => handlePageClick(e, n)}
                  aria-current={isCurrent ? "page" : undefined}
                  className={cn(
                    "flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-xs font-semibold transition-all cursor-pointer",
                    isCurrent
                      ? "bg-[#6E56CF]/25 text-[#A78BFA] border border-[#6E56CF]/60 font-bold shadow-sm"
                      : "text-[#A1A1AA] hover:text-white hover:bg-[#1A1A1E]"
                  )}
                >
                  {n}
                </button>
              );
            }

            return (
              <Link
                key={n}
                href={getHref(n)}
                aria-current={isCurrent ? "page" : undefined}
                className={cn(
                  "flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-xs font-semibold transition-all",
                  isCurrent
                    ? "bg-[#6E56CF]/25 text-[#A78BFA] border border-[#6E56CF]/60 font-bold shadow-sm"
                    : "text-[#A1A1AA] hover:text-white hover:bg-[#1A1A1E]"
                )}
              >
                {n}
              </Link>
            );
          })}
        </div>

        {/* Next Button */}
        {onPageChange || !params ? (
          <button
            type="button"
            onClick={(e) => handlePageClick(e, Math.min(effectiveTotalPages, page + 1))}
            disabled={nextDisabled}
            aria-disabled={nextDisabled}
            aria-label="Next page"
            className={cn(
              "flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-[#A1A1AA] hover:text-white hover:bg-[#1A1A1E] transition-all cursor-pointer",
              nextDisabled && "pointer-events-none opacity-30 cursor-not-allowed"
            )}
          >
            <ChevronRight size={15} aria-hidden="true" />
          </button>
        ) : (
          <Link
            href={getHref(Math.min(effectiveTotalPages, page + 1))}
            aria-disabled={nextDisabled}
            aria-label="Next page"
            className={cn(
              "flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-[#A1A1AA] hover:text-white hover:bg-[#1A1A1E] transition-all",
              nextDisabled && "pointer-events-none opacity-30"
            )}
          >
            <ChevronRight size={15} aria-hidden="true" />
          </Link>
        )}

        {/* Rows per page dropdown selector */}
        {(onPageSizeChange || pageSizeOptions.length > 0) && (
          <div className="relative ml-1 pl-1.5 border-l border-[#232326]" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              aria-label="Items per page"
              className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#232326] bg-[#0A0A0C] text-[#D4D4D8] hover:text-white hover:border-[#3A3A3E] text-[11px] sm:text-[11.5px] font-medium transition-all cursor-pointer"
            >
              <span>{pageSize} / page</span>
              <ChevronDown size={11} className={cn("text-[#71717A] transition-transform", isDropdownOpen && "rotate-180")} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 bottom-full mb-2 w-28 rounded-xl border border-[#232326] bg-[#131316] p-1 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100">
                {pageSizeOptions.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeSelect(size)}
                    className={cn(
                      "w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-between",
                      pageSize === size
                        ? "bg-[#6E56CF]/20 text-[#A78BFA] font-bold"
                        : "text-[#A1A1AA] hover:bg-[#1A1A1E] hover:text-white"
                    )}
                  >
                    <span>{size} / page</span>
                    {pageSize === size && <span className="w-1.5 h-1.5 rounded-full bg-[#A78BFA]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

function getPageWindow(page: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [];

  if (page <= 4) {
    for (let i = 1; i <= 5; i++) {
      pages.push(i);
    }
    pages.push("ellipsis");
    pages.push(totalPages);
  } else if (page >= totalPages - 3) {
    pages.push(1);
    pages.push("ellipsis");
    for (let i = totalPages - 4; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);
    pages.push("ellipsis");
    pages.push(page - 1);
    pages.push(page);
    pages.push(page + 1);
    pages.push("ellipsis");
    pages.push(totalPages);
  }

  return pages;
}
