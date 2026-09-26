import React from 'react';
import { 
  Search, 
  X, 
  SlidersHorizontal, 
  LayoutGrid, 
  List, 
  ChevronDown, 
  RotateCcw,
  Sparkles,
  GitCompare
} from 'lucide-react';
import { CATEGORIES, STATUS_FILTERS, SORT_OPTIONS } from '../data/robotsData';

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  selectedForCompareCount = 0,
  onOpenCompare,
  totalResults = 0,
  onResetFilters
}) {
  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'All' || selectedStatus !== 'All Statuses';

  return (
    <div className="w-full bg-[#000000] border-b border-[#1C1C1F] sticky top-[57px] z-40 backdrop-blur-md bg-black/90 py-3 sm:py-4">
      <div className="mx-auto max-w-[1440px] px-3.5 sm:px-8 space-y-3">
        {/* Top Row: Category Pills Scrollbar */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-none pb-1">
          <div className="flex items-center gap-1.5 shrink-0">
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-3.5 py-1 text-[12px] font-semibold whitespace-nowrap transition-all duration-200 border cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-white text-black border-white shadow-md shadow-white/10'
                      : 'text-[#A1A1AA] hover:text-white bg-[#131316]/60 border-[#232326] hover:border-white/20'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Reset Filters Shortcut */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 text-[11px] font-medium text-[#A78BFA] hover:text-white px-2 py-1 rounded bg-[#6E56CF]/10 border border-[#6E56CF]/20 shrink-0 cursor-pointer transition-colors"
            >
              <RotateCcw size={11} />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Bottom Row: Search, Dropdowns, View Switcher & Compare */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A] pointer-events-none" />
            <input
              id="filter-search-input"
              name="filterSearch"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search robots by name, specs, actuators, company..."
              className="w-full rounded-xl border border-[#232326] bg-[#131316] pl-9 pr-8 text-[13px] text-white placeholder:text-[#71717A] hover:border-[#3a3a40] focus:border-[#6E56CF] focus:outline-none transition-all h-9"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Dropdowns & View Mode */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-end">
            {/* Status Filter */}
            <div className="relative inline-flex items-center">
              <select
                id="filter-status-select"
                name="filterStatus"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none rounded-xl border border-[#232326] bg-[#131316] pl-3 pr-8 py-1 text-[12px] font-medium text-[#E4E4E7] hover:border-[#3a3a40] focus:outline-none focus:border-[#6E56CF] transition-all cursor-pointer h-9"
              >
                {STATUS_FILTERS.map((status) => (
                  <option key={status} value={status} className="bg-[#131316] text-white">
                    {status}
                  </option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71717A] pointer-events-none" />
            </div>

            {/* Sort Dropdown */}
            <div className="relative inline-flex items-center">
              <select
                id="filter-sort-select"
                name="filterSortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none rounded-xl border border-[#232326] bg-[#131316] pl-3 pr-8 py-1 text-[12px] font-medium text-[#E4E4E7] hover:border-[#3a3a40] focus:outline-none focus:border-[#6E56CF] transition-all cursor-pointer h-9"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#131316] text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71717A] pointer-events-none" />
            </div>

            {/* Compare Trigger Button if items selected */}
            {selectedForCompareCount > 0 && (
              <button
                onClick={onOpenCompare}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-[12px] font-semibold text-white bg-[#6E56CF] hover:bg-[#7C66DC] rounded-xl transition-all shadow-md shadow-[#6E56CF]/20 h-9 cursor-pointer active:scale-95"
              >
                <GitCompare size={14} />
                <span>Compare ({selectedForCompareCount})</span>
              </button>
            )}

            {/* View Mode Switcher (Grid vs List) */}
            <div className="flex items-center border border-[#232326] bg-[#131316] rounded-xl p-0.5 h-9">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center justify-center w-8 h-7.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#232326] text-white shadow-sm'
                    : 'text-[#71717A] hover:text-white'
                }`}
                title="Grid View"
                aria-label="Grid View"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center justify-center w-8 h-7.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-[#232326] text-white shadow-sm'
                    : 'text-[#71717A] hover:text-white'
                }`}
                title="List View"
                aria-label="List View"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between text-[11px] text-[#71717A] pt-0.5">
          <span>
            Showing <strong className="text-[#E4E4E7] font-semibold">{totalResults}</strong> robotics platforms
          </span>
          <span className="hidden sm:inline">
            Click any card to inspect full telemetry, kinematics &amp; pilot cases
          </span>
        </div>
      </div>
    </div>
  );
}
