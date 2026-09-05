import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LEADERBOARD_DATA, LEADERBOARD_CATEGORIES, SORT_OPTIONS } from '../data/leaderboardData';
import LeaderboardSkeleton from '../components/leaderboard/LeaderboardSkeleton';
import { 
  Trophy, 
  Search, 
  X, 
  RotateCcw, 
  ChevronDown, 
  ArrowRight, 
  GitCompare, 
  Bookmark, 
  ExternalLink, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  RefreshCw,
  Sparkles,
  ChevronLeft
} from 'lucide-react';

export default function LeaderboardPage({ 
  bookmarks = [], 
  onToggleBookmark,
  selectedForCompare = [],
  onToggleCompare,
  onClearCompare
}) {
  const navigate = useNavigate();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  // Category selection & More dropdown state
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const [sortBy, setSortBy] = useState('rank');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Loading & Error states
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Compare Modal state
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Simulate realistic network data load on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  const handleRetry = () => {
    setIsError(false);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 400);
  };

  // Reset page when category or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

  // Primary categories to show directly as pills
  // Mapping of category value to concise display label
  const PRIMARY_CATEGORIES = [
    { value: 'All', label: 'All' },
    { value: 'Chatbot', label: 'Chat' },
    { value: 'Code Assistant', label: 'Code' },
    { value: 'Image Generation', label: 'Image' },
    { value: 'Video Editing', label: 'Video' }
  ];

  // If the user selected a category from "More", elevate it into the visible row
  const isSelectedInPrimary = PRIMARY_CATEGORIES.some((c) => c.value === selectedCategory);
  const overflowCategories = LEADERBOARD_CATEGORIES.filter(
    (cat) => !PRIMARY_CATEGORIES.some((pc) => pc.value === cat)
  );

  // Filtering & Sorting
  const filteredModels = useMemo(() => {
    return LEADERBOARD_DATA.filter((model) => {
      if (selectedCategory !== 'All' && model.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = model.name.toLowerCase().includes(q);
        const matchesOrg = model.org.toLowerCase().includes(q);
        const matchesDesc = model.shortDescription.toLowerCase().includes(q);
        const matchesCat = model.category.toLowerCase().includes(q);
        if (!matchesName && !matchesOrg && !matchesDesc && !matchesCat) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'visits': {
          const vA = parseFloat(a.monthlyVisits) || 0;
          const vB = parseFloat(b.monthlyVisits) || 0;
          return vB - vA;
        }
        case 'growth': {
          const gA = parseFloat(a.growth.replace(/[^0-9.-]/g, '')) || 0;
          const gB = parseFloat(b.growth.replace(/[^0-9.-]/g, '')) || 0;
          return gB - gA;
        }
        case 'newest':
          return b.id.localeCompare(a.id);
        case 'rank':
        default:
          return a.rank - b.rank;
      }
    });
  }, [searchQuery, selectedCategory, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredModels.length / itemsPerPage) || 1;
  const paginatedModels = filteredModels.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const hasActiveFilters = searchQuery.trim() !== '' || selectedCategory !== 'All';

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortBy('rank');
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#6E56CF]/30 pb-20">
      {/* Header Banner - Intentional rhythm and breathing room */}
      <div className="border-b border-[#1C1C1F] bg-[#000000] pt-10 pb-12 sm:pt-14 sm:pb-14 px-3.5 sm:px-8 relative overflow-hidden">
        {/* Subtle atmospheric glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-gradient-to-b from-[#6E56CF]/15 via-transparent to-transparent blur-3xl pointer-events-none -z-0"></div>

        <div className="mx-auto max-w-[1440px] relative z-10">
          {/* Breadcrumb Tag */}
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-[#6E56CF]/15 text-[#A78BFA] border border-[#6E56CF]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
              Live Benchmark Index
            </span>
            <span className="text-xs text-[#71717A] hidden sm:inline font-mono">
              Updated Hourly • LMSYS Arena Grounded
            </span>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
              AI Ecosystem Leaderboard
            </h1>
            <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed max-w-2xl font-normal mb-8">
              Track real-world evaluation benchmarks, Chatbot Arena Elo scores, inference speeds, and enterprise pricing across top AI foundation models and developer tools.
            </p>
          </div>

          {/* Inline Stats Strip with subtle pipe separators (Quiet, premium, no heavy boxes) */}
          <div className="flex flex-wrap items-center gap-y-3 gap-x-6 sm:gap-x-8 pt-1">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#71717A] font-semibold block mb-0.5">
                Tracked Models
              </span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-white">
                {LEADERBOARD_DATA.length} Systems
              </span>
            </div>

            <div className="hidden sm:block w-[1px] h-8 bg-[#27272A]" />

            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#71717A] font-semibold block mb-0.5">
                Highest Elo
              </span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-white">
                1,388 Elo
              </span>
            </div>

            <div className="hidden sm:block w-[1px] h-8 bg-[#27272A]" />

            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#71717A] font-semibold block mb-0.5">
                Top Speed
              </span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-white">
                142 tok/s
              </span>
            </div>

            <div className="hidden sm:block w-[1px] h-8 bg-[#27272A]" />

            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#71717A] font-semibold block mb-0.5">
                Fastest Growth
              </span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-white">
                +142% MoM
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container with generous breathing room */}
      <div className="mx-auto max-w-[1440px] px-3.5 sm:px-8 pt-8 sm:pt-10">
        {/* Category Pills Bar: 5 Primary + Selected Overflow + Clean "More ▾" Dropdown */}
        <div className="relative mb-6 sm:mb-8">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
            {/* Primary 5 pills */}
            {PRIMARY_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => {
                    setSelectedCategory(cat.value);
                    setIsMoreDropdownOpen(false);
                  }}
                  className={`rounded-full px-3.5 py-1 text-[12px] font-semibold whitespace-nowrap transition-all duration-200 border cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-white text-black border-white shadow-sm'
                      : 'text-[#A1A1AA] hover:text-white bg-[#131316]/60 border-[#232326] hover:border-white/20'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}

            {/* If a category from "More" is currently selected, show it prominently inline */}
            {!isSelectedInPrimary && (
              <button
                onClick={() => setIsMoreDropdownOpen(false)}
                className="rounded-full px-3.5 py-1 text-[12px] font-semibold whitespace-nowrap transition-all duration-200 border cursor-pointer shrink-0 bg-white text-black border-white shadow-sm"
              >
                {selectedCategory}
              </button>
            )}

            {/* More ▾ Button */}
            <div className="relative shrink-0">
              <button
                onClick={() => setIsMoreDropdownOpen((prev) => !prev)}
                className={`rounded-full px-3.5 py-1 text-[12px] font-semibold whitespace-nowrap transition-all duration-200 border cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  isMoreDropdownOpen || !isSelectedInPrimary
                    ? 'text-white border-[#6E56CF] bg-[#1a1a24]'
                    : 'text-[#A1A1AA] hover:text-white bg-[#131316]/60 border-[#232326] hover:border-white/20'
                }`}
              >
                <span>More</span>
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${isMoreDropdownOpen ? 'rotate-180 text-white' : 'text-[#71717A]'}`}
                />
              </button>

              {/* Extremely clean, distraction-free dropdown menu */}
              {isMoreDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setIsMoreDropdownOpen(false)}
                  />
                  <div className="absolute left-0 top-full mt-2 z-30 w-48 rounded-xl border border-[#27272A] bg-[#121215] shadow-2xl py-1.5">
                    {overflowCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setIsMoreDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-[12px] transition-colors cursor-pointer ${
                          selectedCategory === cat
                            ? 'text-white bg-[#1F1F24] font-semibold'
                            : 'text-[#A1A1AA] hover:text-white hover:bg-[#18181C]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Filter Controls Row: Search + Sort + Compare Trigger */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-8 sm:mb-10">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search models, tools, or providers..."
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

          {/* Right: Sort + Compare Button */}
          <div className="flex items-center gap-2 justify-end">
            {/* Sort Selector */}
            <div className="relative inline-flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none rounded-xl border border-[#232326] bg-[#131316] pl-3 pr-8 text-[12px] font-medium text-white hover:border-[#3a3a40] focus:outline-none focus:border-[#6E56CF] transition-all cursor-pointer h-9"
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
            {selectedForCompare.length > 0 && (
              <button
                onClick={() => setIsCompareModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-semibold text-white bg-[#6E56CF] hover:bg-[#7C66DC] rounded-xl transition-all shadow-md shadow-[#6E56CF]/20 h-9 cursor-pointer active:scale-95 shrink-0"
              >
                <GitCompare size={13} />
                <span>Compare ({selectedForCompare.length})</span>
              </button>
            )}

            {/* Clear Filters if active */}
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-1 text-xs text-[#A78BFA] hover:text-white px-2.5 py-1 rounded-xl bg-[#6E56CF]/10 border border-[#6E56CF]/20 h-9 cursor-pointer transition-colors shrink-0"
              >
                <RotateCcw size={12} />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* State 1: ERROR STATE */}
        {isError && (
          <div className="p-8 rounded-2xl border border-red-900/40 bg-red-950/20 text-center max-w-md mx-auto my-12">
            <AlertCircle size={36} className="text-red-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">Couldn't load the leaderboard</h3>
            <p className="text-xs text-[#A1A1AA] mb-4">
              Unable to reach the live evaluation telemetry API. Please check your connection and try again.
            </p>
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white text-black hover:bg-[#E4E4E7] transition-all cursor-pointer"
            >
              <RefreshCw size={13} />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* State 2: LOADING SKELETON */}
        {!isError && isLoading && (
          <LeaderboardSkeleton />
        )}

        {/* State 3: EMPTY STATE */}
        {!isError && !isLoading && filteredModels.length === 0 && (
          <div className="p-12 rounded-2xl border border-[#232326] bg-[#111115] text-center max-w-md mx-auto my-8">
            <Trophy size={36} className="text-[#71717A] mx-auto mb-3 opacity-50" />
            <h3 className="text-base font-bold text-white mb-1">No results found</h3>
            <p className="text-xs text-[#A1A1AA] mb-5">
              Try removing a filter or searching for another model or category.
            </p>
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white text-black hover:bg-[#E4E4E7] transition-all cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>Clear filters</span>
            </button>
          </div>
        )}

        {/* State 4: LOADED CONTENT */}
        {!isError && !isLoading && filteredModels.length > 0 && (
          <div className="space-y-4">
            {/* Desktop Table (hidden on phone screens <= 640px) */}
            <div className="hidden sm:block rounded-2xl border border-[#232326] bg-[#111115] overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#16161c] border-b border-[#232326] text-[#71717A] uppercase font-semibold text-[11px] tracking-wider">
                      <th className="p-3.5 w-12 text-center">Rank</th>
                      <th className="p-3.5">Model / Tool</th>
                      <th className="p-3.5">Arena Elo</th>
                      <th className="p-3.5">MMLU Pro</th>
                      <th className="p-3.5">Speed</th>
                      <th className="p-3.5">Pricing</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1F1F24] text-[#E4E4E7]">
                    {paginatedModels.map((model) => {
                      const isCompared = selectedForCompare.some((m) => m.id === model.id);
                      return (
                        <tr 
                          key={model.id}
                          className="hover:bg-[#181820] transition-colors group cursor-pointer"
                          onClick={() => navigate(`/leaderboard/${model.slug}`)}
                        >
                          {/* Rank badge */}
                          <td className="p-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold font-mono text-xs ${
                              model.rank === 1 ? 'bg-[#F5A623] text-black shadow-sm shadow-[#F5A623]/30' :
                              model.rank === 2 ? 'bg-[#E4E4E7] text-black' :
                              model.rank === 3 ? 'bg-[#CD7F32] text-black' :
                              'text-[#71717A] bg-[#16161c]'
                            }`}>
                              {model.rank}
                            </span>
                          </td>

                          {/* Model info */}
                          <td className="p-3.5">
                            <div className="flex items-center gap-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-sm text-white group-hover:text-[#A78BFA] transition-colors">
                                    {model.name}
                                  </span>
                                  {model.badge && (
                                    <span className="text-[9.5px] font-semibold px-1.5 py-0.2 rounded bg-[#1e1e26] border border-[#2e2e38] text-[#A1A1AA]">
                                      {model.badge}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[11px] text-[#71717A] font-mono block">
                                  {model.org} • {model.shortDescription.slice(0, 55)}...
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Arena Elo */}
                          <td className="p-3.5 font-mono font-bold text-white text-[13px]">
                            <div className="flex items-center gap-1.5">
                              <span>{model.arenaElo}</span>
                              <span className="text-[10px] text-[#10B981] font-normal">{model.eloChange}</span>
                            </div>
                          </td>

                          {/* MMLU */}
                          <td className="p-3.5 font-mono text-[#10B981] font-semibold">
                            {model.mmluPro}
                          </td>

                          {/* Speed */}
                          <td className="p-3.5 font-mono text-[#A1A1AA]">
                            {model.outputSpeed}
                          </td>

                          {/* Pricing */}
                          <td className="p-3.5 font-mono text-xs text-[#E4E4E7]">
                            {model.price}
                          </td>

                          {/* Category Tag */}
                          <td className="p-3.5">
                            <span className="px-2.5 py-1 rounded-full text-[10.5px] font-medium bg-[#1a1a20] border border-[#272730] text-[#A1A1AA]">
                              {model.category}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="p-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Compare button */}
                              <button
                                onClick={() => onToggleCompare(model)}
                                className={`px-2 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                                  isCompared
                                    ? 'bg-[#6E56CF] text-white border-[#6E56CF]'
                                    : 'bg-[#18181c] text-[#A1A1AA] border-[#27272e] hover:text-white'
                                }`}
                                title="Compare"
                              >
                                {isCompared ? 'Added' : 'Compare'}
                              </button>

                              {/* View detail link */}
                              <Link
                                to={`/leaderboard/${model.slug}`}
                                className="px-3 py-1 rounded-lg text-[11px] font-semibold bg-white text-black hover:bg-[#E4E4E7] transition-all inline-block"
                              >
                                Details
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards View (displayed on <= 640px phones like 375px) */}
            <div className="sm:hidden space-y-3">
              {paginatedModels.map((model) => {
                const isCompared = selectedForCompare.some((m) => m.id === model.id);
                return (
                  <div
                    key={model.id}
                    onClick={() => navigate(`/leaderboard/${model.slug}`)}
                    className="p-4 rounded-2xl border border-[#232326] bg-[#111115] hover:border-[#3b3b44] transition-all active:scale-[0.99] cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold font-mono text-xs shrink-0 ${
                          model.rank === 1 ? 'bg-[#F5A623] text-black' :
                          model.rank === 2 ? 'bg-[#E4E4E7] text-black' :
                          model.rank === 3 ? 'bg-[#CD7F32] text-black' :
                          'text-[#71717A] bg-[#16161c]'
                        }`}>
                          {model.rank}
                        </span>
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm text-white truncate">{model.name}</h4>
                          <span className="text-[11px] text-[#71717A] font-mono block">{model.org}</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#F5A623] shrink-0">
                        {model.arenaElo} Elo
                      </span>
                    </div>

                    <p className="text-xs text-[#A1A1AA] line-clamp-2 mb-3">
                      {model.shortDescription}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-[#1F1F24]" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onToggleCompare(model)}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-semibold ${
                          isCompared ? 'bg-[#6E56CF] text-white border-[#6E56CF]' : 'bg-[#18181c] text-[#A1A1AA] border-[#27272e]'
                        }`}
                      >
                        {isCompared ? 'Added to Compare' : 'Compare'}
                      </button>

                      <Link
                        to={`/leaderboard/${model.slug}`}
                        className="text-xs px-3 py-1 rounded-lg bg-white text-black font-semibold"
                      >
                        Full Details →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#71717A]">
              <span>
                Showing <strong className="text-white font-mono">{(currentPage - 1) * itemsPerPage + 1}</strong> to{' '}
                <strong className="text-white font-mono">
                  {Math.min(currentPage * itemsPerPage, filteredModels.length)}
                </strong>{' '}
                of <strong className="text-white font-mono">{filteredModels.length}</strong> systems
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#232326] bg-[#131316] text-xs font-medium transition-all ${
                    currentPage === 1 ? 'text-[#52525B] cursor-not-allowed' : 'text-white hover:bg-[#1a1a20]'
                  }`}
                >
                  <ChevronLeft size={13} />
                  <span>Prev</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    onClick={() => setCurrentPage(pg)}
                    className={`w-8 h-8 rounded-xl text-xs font-semibold font-mono border transition-all ${
                      currentPage === pg
                        ? 'bg-white text-black border-white'
                        : 'bg-[#131316] border-[#232326] text-[#A1A1AA] hover:text-white'
                    }`}
                  >
                    {pg}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#232326] bg-[#131316] text-xs font-medium transition-all ${
                    currentPage === totalPages ? 'text-[#52525B] cursor-not-allowed' : 'text-white hover:bg-[#1a1a20]'
                  }`}
                >
                  <span>Next</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Compare Dock (at bottom if models are selected) */}
      {selectedForCompare.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-2xl">
          <div className="flex items-center justify-between gap-3 p-2.5 sm:p-3 rounded-2xl border border-[#3b3b44] bg-[#131316]/95 backdrop-blur-xl shadow-2xl shadow-[#6E56CF]/20 text-white">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#6E56CF]/20 text-[#C4B5FD] text-xs font-semibold shrink-0">
                <GitCompare size={14} />
                <span>{selectedForCompare.length}/3 Compare</span>
              </div>
              {selectedForCompare.map((m) => (
                <div key={m.id} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#1a1a20] border border-[#27272e] shrink-0 text-xs">
                  <span className="text-white max-w-[110px] truncate">{m.name}</span>
                  <button
                    onClick={() => onToggleCompare(m)}
                    className="text-[#71717A] hover:text-white"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onClearCompare}
                className="text-[#71717A] hover:text-white text-xs px-2 py-1 transition-colors hidden sm:inline"
              >
                Clear
              </button>
              <button
                onClick={() => setIsCompareModalOpen(true)}
                disabled={selectedForCompare.length < 2}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md ${
                  selectedForCompare.length >= 2
                    ? 'bg-[#6E56CF] hover:bg-[#7C66DC] text-white shadow-[#6E56CF]/30 active:scale-95'
                    : 'bg-[#232326] text-[#71717A] cursor-not-allowed'
                }`}
              >
                <span>Compare</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Direct Comparison Modal */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-5xl rounded-2xl border border-[#27272a] bg-[#111114] shadow-2xl p-5 sm:p-7 my-auto text-white">
            <div className="flex items-center justify-between pb-4 border-b border-[#232326]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#6E56CF]/20 text-[#A78BFA] flex items-center justify-center">
                  <GitCompare size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Head-to-Head Model Comparison</h3>
                  <p className="text-xs text-[#A1A1AA]">Benchmarking {selectedForCompare.length} AI systems side-by-side</p>
                </div>
              </div>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="w-8 h-8 rounded-lg border border-[#232326] bg-[#16161a] flex items-center justify-center text-[#A1A1AA] hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Comparison Matrix Table */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#232326]">
                    <th className="p-3 text-[11px] uppercase tracking-wider text-[#71717A] font-semibold w-1/4">Metric</th>
                    {selectedForCompare.map((m) => (
                      <th key={m.id} className="p-3 w-1/3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm text-white">{m.name}</span>
                          <button onClick={() => onToggleCompare(m)} className="text-[#71717A] hover:text-red-400">
                            <X size={12} />
                          </button>
                        </div>
                        <span className="text-[11px] text-[#A1A1AA] block">{m.org} • {m.category}</span>
                        <span className="text-xs font-mono font-bold text-[#F5A623]">{m.arenaElo} Elo</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F1F24] text-[#E4E4E7]">
                  <tr>
                    <td className="p-3 text-[#71717A]">Arena Ranking</td>
                    {selectedForCompare.map((m) => (
                      <td key={m.id} className="p-3 font-mono font-bold text-white">#{m.rank}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-[#71717A]">MMLU Pro Score</td>
                    {selectedForCompare.map((m) => (
                      <td key={m.id} className="p-3 font-mono text-[#10B981] font-semibold">{m.mmluPro}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-[#71717A]">Coding Score</td>
                    {selectedForCompare.map((m) => (
                      <td key={m.id} className="p-3 font-mono text-[#A78BFA] font-bold">{m.codingScore}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-[#71717A]">Output Throughput</td>
                    {selectedForCompare.map((m) => (
                      <td key={m.id} className="p-3 font-mono">{m.outputSpeed}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-[#71717A]">Context Window</td>
                    {selectedForCompare.map((m) => (
                      <td key={m.id} className="p-3 font-mono">{m.contextWindow}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-[#71717A]">Pricing</td>
                    {selectedForCompare.map((m) => (
                      <td key={m.id} className="p-3 font-mono text-xs">{m.price}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-[#71717A]">License Model</td>
                    {selectedForCompare.map((m) => (
                      <td key={m.id} className="p-3">{m.license}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-[#71717A]">Key Highlights</td>
                    {selectedForCompare.map((m) => (
                      <td key={m.id} className="p-3">
                        <ul className="list-disc list-inside space-y-1 text-[11px] text-[#A1A1AA]">
                          {m.keyFeatures.slice(0, 2).map((f, i) => (
                            <li key={i}>{f}</li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 pt-4 border-t border-[#232326] flex items-center justify-between">
              <button onClick={onClearCompare} className="text-xs text-[#71717A] hover:text-white">
                Clear all
              </button>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#232326] text-white hover:bg-[#2e2e33]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
