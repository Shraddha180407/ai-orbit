"use client";
import React from "react";
import type { CreatorType } from "@/lib/types";
import { X } from "lucide-react";

export interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  creatorType?: CreatorType;
  onCreatorTypeChange: (type: CreatorType | undefined) => void;
  updatedWithin: string;
  onUpdatedWithinChange: (value: string) => void;
  featuredOnly: boolean;
  onFeaturedOnlyChange: (value: boolean) => void;
  hasRelatedModels: boolean;
  onHasRelatedModelsChange: (value: boolean) => void;
  hasRelatedCompanies: boolean;
  onHasRelatedCompaniesChange: (value: boolean) => void;
  selectedCategories?: string[];
  onCategoriesChange?: (categories: string[]) => void;
  availableCategories?: string[];
  onReset: () => void;
}

const CREATOR_TYPES: { label: string; value: CreatorType | undefined }[] = [
  { label: "All", value: undefined },
  { label: "Editorial", value: "EDITORIAL" },
  { label: "Community", value: "COMMUNITY" },
];

export default function CollectionFilters({
  isOpen,
  onClose,
  creatorType,
  onCreatorTypeChange,
  updatedWithin,
  onUpdatedWithinChange,
  featuredOnly,
  onFeaturedOnlyChange,
  hasRelatedModels,
  onHasRelatedModelsChange,
  hasRelatedCompanies,
  onHasRelatedCompaniesChange,
  selectedCategories = [],
  onCategoriesChange,
  availableCategories = [],
  onReset,
}: FilterDrawerProps) {
  if (!isOpen) return null;

  const toggleCategory = (cat: string) => {
    if (!onCategoriesChange) return;
    if (selectedCategories.includes(cat)) {
      onCategoriesChange(selectedCategories.filter((c) => c !== cat));
    } else {
      onCategoriesChange([...selectedCategories, cat]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
      <div className="w-full max-w-md h-full bg-[#09090B] border-l border-[#232326] p-6 flex flex-col justify-between overflow-y-auto">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-[#232326] mb-6">
            <h2 className="text-lg font-bold text-white">Filters</h2>
            <button
              onClick={onClose}
              className="p-2 text-[#A1A1AA] hover:text-white hover:bg-[#18181B] rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {/* Creator Type */}
            <div>
              <label className="text-xs font-bold text-[#71717A] uppercase tracking-wider mb-2 block">
                Creator Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {CREATOR_TYPES.map((type) => (
                  <button
                    key={type.label}
                    onClick={() => onCreatorTypeChange(type.value)}
                    className={`h-9 text-xs rounded-lg border font-semibold capitalize ${
                      creatorType === type.value
                        ? "bg-white text-black border-white"
                        : "bg-[#18181B] border-[#232326] text-[#A1A1AA] hover:border-neutral-500"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories Selection (if categories list passed) */}
            {availableCategories.length > 0 && (
              <div>
                <label className="text-xs font-bold text-[#71717A] uppercase tracking-wider mb-2 block">
                  Categories
                </label>
                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
                  {availableCategories.map((cat) => {
                    const isSelected = selectedCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        onClick={() => toggleCategory(cat)}
                        className={`px-3 py-1.5 text-xs rounded-lg border font-medium transition-colors ${
                          isSelected
                            ? "bg-white text-black border-white"
                            : "bg-[#18181B] border-[#232326] text-[#A1A1AA] hover:border-neutral-500"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Updated Within */}
            <div>
              <label className="text-xs font-bold text-[#71717A] uppercase tracking-wider mb-2 block">
                Updated Within
              </label>
              <select
                value={updatedWithin}
                onChange={(e) => onUpdatedWithinChange(e.target.value)}
                className="w-full h-10 bg-[#18181B] border border-[#232326] rounded-lg px-3 text-xs text-white outline-none"
              >
                <option value="">Anytime</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
            </div>

            {/* Checkboxes */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-bold text-[#71717A] uppercase tracking-wider block">
                Attributes
              </label>

              <label className="flex items-center gap-3 text-xs text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={featuredOnly}
                  onChange={(e) => onFeaturedOnlyChange(e.target.checked)}
                  className="rounded border-[#232326] bg-[#18181B] h-4 w-4"
                />
                <span>Featured Collections Only</span>
              </label>

              <label className="flex items-center gap-3 text-xs text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasRelatedModels}
                  onChange={(e) => onHasRelatedModelsChange(e.target.checked)}
                  className="rounded border-[#232326] bg-[#18181B] h-4 w-4"
                />
                <span>Has AI Models Linked</span>
              </label>

              <label className="flex items-center gap-3 text-xs text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasRelatedCompanies}
                  onChange={(e) => onHasRelatedCompaniesChange(e.target.checked)}
                  className="rounded border-[#232326] bg-[#18181B] h-4 w-4"
                />
                <span>Has Companies Linked</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-6 border-t border-[#232326] mt-6">
          <button
            onClick={onReset}
            className="flex-1 h-11 bg-[#18181B] border border-[#232326] text-white font-semibold text-xs rounded-xl hover:border-neutral-500"
          >
            Reset All
          </button>
          <button
            onClick={onClose}
            className="flex-1 h-11 bg-white text-black font-semibold text-xs rounded-xl hover:bg-neutral-200"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}