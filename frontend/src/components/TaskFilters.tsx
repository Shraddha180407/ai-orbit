'use client';

import React from "react";
import { TaskSearchBar } from "./TaskSearchBar";
import type { Category, Difficulty, PricingModel, SortOption } from "@/lib/tasks-api";

export type ShowFilter = "All Tasks" | "For You" | "Following";

type TaskFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  showFilter: ShowFilter;
  onShowFilterChange: (value: ShowFilter) => void;
  categories: Category[];
  category: string;
  onCategoryChange: (value: string) => void;
  difficulty: Difficulty | "ALL";
  onDifficultyChange: (value: Difficulty | "ALL") => void;
  pricing: PricingModel | "ALL";
  onPricingChange: (value: PricingModel | "ALL") => void;
  featuredOnly: boolean;
  onFeaturedOnlyChange: (value: boolean) => void;
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
};

// Backend now supports ?filter=all|for-you|following — all three enabled.
const SHOW_OPTIONS: ShowFilter[] = ["All Tasks", "For You", "Following"];

const selectClasses =
  "rounded-lg bg-[#0A0A0C]/60 ring-1 ring-[#232326]/60 text-xs text-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#6E56CF]/60 transition-all duration-200 appearance-none cursor-pointer hover:ring-[#3A3A3E]";

export function TaskFilters({
  search,
  onSearchChange,
  showFilter,
  onShowFilterChange,
  categories,
  category,
  onCategoryChange,
  difficulty,
  onDifficultyChange,
  pricing,
  onPricingChange,
  featuredOnly,
  onFeaturedOnlyChange,
  sort,
  onSortChange,
}: TaskFiltersProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs text-[#71717A] font-mono uppercase tracking-[0.08em]">Show:</span>
        <div className="flex items-center gap-1.5 rounded-full bg-[#0A0A0C]/60 ring-1 ring-[#232326]/60 p-1">
          {SHOW_OPTIONS.map((value) => {
            const isActive = value === showFilter;
            return (
              <button
                key={value}
                type="button"
                onClick={() => onShowFilterChange(value)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF]/60 ${
                  isActive
                    ? "bg-white text-black shadow-[0_2px_10px_-2px_rgba(255,255,255,0.3)]"
                    : "text-[#A1A1AA] hover:text-white"
                }`}
              >
                {value}
              </button>
            );
          })}
        </div>

        <div className="ml-auto">
          <TaskSearchBar value={search} onChange={onSearchChange} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          aria-label="Filter by category"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className={selectClasses}
        >
          <option value="">Category: All</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter by difficulty"
          value={difficulty}
          onChange={(e) => onDifficultyChange(e.target.value as Difficulty | "ALL")}
          className={selectClasses}
        >
          <option value="ALL">Difficulty: All</option>
          <option value="EASY">Easy</option>
          <option value="MEDIUM">Medium</option>
          <option value="ADVANCED">Advanced</option>
        </select>

        <select
          aria-label="Filter by pricing"
          value={pricing}
          onChange={(e) => onPricingChange(e.target.value as PricingModel | "ALL")}
          className={selectClasses}
        >
          <option value="ALL">Pricing: All</option>
          <option value="FREE">Free</option>
          <option value="FREEMIUM">Freemium</option>
          <option value="PAID">Paid</option>
          <option value="FREE_TRIAL">Free Trial</option>
        </select>

        <label className="flex items-center gap-2 text-xs text-[#A1A1AA] cursor-pointer select-none">
          <input
            type="checkbox"
            checked={featuredOnly}
            onChange={(e) => onFeaturedOnlyChange(e.target.checked)}
            className="h-3.5 w-3.5 rounded border-[#232326] bg-[#131316] accent-[#6E56CF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF]/60"
          />
          Featured Only
        </label>

        <select
          aria-label="Sort tasks"
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className={`ml-auto ${selectClasses}`}
        >
          <option value="newest">Sort: Newest</option>
          <option value="oldest">Oldest</option>
          <option value="alphabetical">Alphabetical</option>
          <option value="popular">Popular</option>
        </select>
      </div>
    </div>
  );
}