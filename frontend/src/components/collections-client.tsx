"use client";

import React from "react";
import { Bookmark, ChevronDown, ChevronUp } from "lucide-react";
import type { CollectionListItem } from "@/lib/types";

interface CollectionRowProps {
  item: CollectionListItem;
  density: "compact" | "comfortable";
  isBookmarked: boolean;
  isExpanded: boolean;
  onToggleBookmark: (id: string) => void;
  onToggleExpand: (id: string) => void;
  /** Ref callback used by the virtualizer to measure row height. */
  measureRef?: (el: HTMLElement | null) => void;
}

export default function CollectionRow({
  item,
  density,
  isBookmarked,
  isExpanded,
  onToggleBookmark,
  onToggleExpand,
  measureRef,
}: CollectionRowProps) {
  return (
    <div
      data-index={item.id}
      ref={measureRef}
      className={`w-full flex flex-col border-b border-[#232326]/60 last:border-0 hover:bg-[#121214] transition-colors ${
        density === "compact" ? "p-3" : "p-5"
      }`}
    >
      <div className="flex items-center justify-between gap-4 min-h-[44px]">
        {/* Left: Avatar & Info */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {item.creator.image ? (
            <img
              src={item.creator.image}
              alt={item.creator.name}
              className="w-10 h-10 rounded-full border border-[#232326] object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#18181B] border border-[#232326] flex items-center justify-center font-bold text-white text-xs flex-shrink-0">
              {item.creator.name.charAt(0)}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <a
                href={`/collections/${item.slug}`}
                className="font-bold text-white text-sm md:text-base hover:underline truncate"
              >
                {item.name}
              </a>
              {item.isFeatured && (
                <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded font-bold uppercase">
                  Featured
                </span>
              )}
            </div>

            {density === "comfortable" && item.description && (
              <p className="text-xs text-[#A1A1AA] line-clamp-1 mb-1">
                {item.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 text-xs text-[#71717A]">
              <span>
                by <strong className="text-white">{item.creator.name}</strong>
              </span>
              <span>•</span>
              <span className="text-white font-medium">{item.toolCount} tools</span>
              {item.categories.length > 0 && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    {item.categories.map((cat, i) => (
                      <span
                        key={i}
                        className="text-[#A1A1AA] bg-[#18181B] px-1.5 py-0.5 rounded text-[10px]"
                      >
                        {cat.categoryName}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleBookmark(item.id)}
            title={isBookmarked ? "Remove Bookmark" : "Bookmark Collection"}
            className={`p-2.5 rounded-xl border flex items-center justify-center transition-colors ${
              isBookmarked
                ? "bg-white text-black border-white"
                : "border-[#232326] text-[#A1A1AA] hover:text-white hover:border-neutral-500"
            }`}
          >
            <Bookmark className="h-4 w-4" fill={isBookmarked ? "currentColor" : "none"} />
          </button>

          <button
            onClick={() => onToggleExpand(item.id)}
            className="p-2 md:hidden text-[#A1A1AA] hover:text-white"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Expanded Drawer View */}
      {isExpanded && item.description && (
        <div className="mt-3 pt-3 border-t border-[#232326]/40 text-xs text-[#A1A1AA] bg-[#040405] p-3 rounded-lg md:hidden">
          {item.description}
        </div>
      )}
    </div>
  );
}