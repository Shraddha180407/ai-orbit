import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LEADERBOARD_DATA, 
  LEADERBOARD_CATEGORIES, 
  SORT_OPTIONS, 
  PERSPECTIVE_OPTIONS 
} from '../data/leaderboardData';
import LeaderboardSkeleton from '../components/leaderboard/LeaderboardSkeleton';
import PerspectiveTabs from '../components/leaderboard/PerspectiveTabs';
import SuperpowerBadge from '../components/leaderboard/SuperpowerBadge';
import AdaptiveTableHeaders from '../components/leaderboard/AdaptiveTableHeaders';
import QuickCompareDock from '../components/leaderboard/QuickCompareDock';
import MobileLeaderboardCard from '../components/leaderboard/MobileLeaderboardCard';
import CompaniesLeaderboardSection from '../components/leaderboard/CompaniesLeaderboardSection';
import MethodologyDrawer from '../components/leaderboard/MethodologyDrawer';
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
  ChevronLeft,
  Building2,
  Cpu,
  HelpCircle
} from 'lucide-react';

export default function LeaderboardPage({ 
  bookmarks = [], 
  onToggleBookmark,
  selectedForCompare = [],
  onToggleCompare,
  onClearCompare
}) {
  const navigate = useNavigate();

  // Navigation Mode: 'models' (Part A) vs 'companies' (Part B)
  const [activeTab, setActiveTab] = useState('models');

  // State
  const [entityType, setEntityType] = useState('all'); // 'all' | 'models' | 'tools'
  const [activePerspective, setActivePerspective] = useState('overall');
  const [searchQuery, setSearchQuery] = useState('');
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

  // Methodology Drawer state
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

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

  // Reset page when perspective, category, search, or entityType changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activePerspective, searchQuery, selectedCategory, sortBy, entityType]);

  // Primary categories to show directly as pills
  const PRIMARY_CATEGORIES = [
    { value: 'All', label: 'All' },
    { value: 'Chatbot', label: 'Chat' },
    { value: 'Code Assistant', label: 'Code' },
    { value: 'Reasoning', label: 'Reasoning' },
    { value: 'Image Generation', label: 'Image' },
    { value: 'Video Editing', label: 'Video' },
    { value: 'Research', label: 'Research' },
    { value: 'AI Agents', label: 'Agents' }
  ];

  const isSelectedInPrimary = PRIMARY_CATEGORIES.some((c) => c.value === selectedCategory);
  const overflowCategories = LEADERBOARD_CATEGORIES.filter(
    (cat) => !PRIMARY_CATEGORIES.some((pc) => pc.value === cat)
  );

  // Compute perspective item counts based on entityType
  const perspectiveCounts = useMemo(() => {
    const base = LEADERBOARD_DATA.filter((m) => {
      if (entityType === 'models') return m.entityType === 'model';
      if (entityType === 'tools') return m.entityType === 'tool';
      return true;
    });

    return {
      overall: base.length,
      risers: base.filter((m) => parseFloat(m.growth) > 25).length,
      adopted: base.filter((m) => parseFloat(m.monthlyVisits) >= 50).length,
      speed: base.filter((m) => (m.speedNum || 0) >= 100).length,
      open_weights: base.filter((m) => m.isOpenWeights).length
    };
  }, [entityType]);

  // Multi-Perspective Filtering & Sorting Engine
  const filteredModels = useMemo(() => {
    // 0. Entity Type Filter (All / Models / Tools)
    let list = LEADERBOARD_DATA.filter((item) => {
      if (entityType === 'models') return item.entityType === 'model';
      if (entityType === 'tools') return item.entityType === 'tool';
      return true;
    });

    // 1. Perspective Filter
    list = list.filter((model) => {
      if (activePerspective === 'open_weights') {
        return model.isOpenWeights === true;
      }
      return true;
    });

    // 2. Category Filter
    if (selectedCategory !== 'All') {
      list = list.filter((m) => m.category === selectedCategory);
    }

    // 3. Search Query Filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      list = list.filter((model) => {
        const matchesName = model.name.toLowerCase().includes(q);
        const matchesOrg = model.org.toLowerCase().includes(q);
        const matchesDesc = model.shortDescription.toLowerCase().includes(q);
        const matchesCat = model.category.toLowerCase().includes(q);
        const matchesSuperpower = (model.superpower || '').toLowerCase().includes(q);
        return matchesName || matchesOrg || matchesDesc || matchesCat || matchesSuperpower;
      });
    }

    // 4. Perspective-Specific Sorting
    return [...list].sort((a, b) => {
      // Perspective overrides sort by default unless user explicitly chose a specific sort
      if (activePerspective === 'risers' && sortBy === 'rank') {
        const gA = parseFloat(a.growth.replace(/[^0-9.-]/g, '')) || 0;
        const gB = parseFloat(b.growth.replace(/[^0-9.-]/g, '')) || 0;
        return gB - gA;
      }
      if (activePerspective === 'adopted' && sortBy === 'rank') {
        const vA = parseFloat(a.monthlyVisits) || 0;
        const vB = parseFloat(b.monthlyVisits) || 0;
        return vB - vA;
      }
      if (activePerspective === 'speed' && sortBy === 'rank') {
        const sA = a.speedNum || parseInt(a.outputSpeed, 10) || 0;
        const sB = b.speedNum || parseInt(b.outputSpeed, 10) || 0;
        return sB - sA;
      }

      // Explicit Sort Dropdown
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
  }, [activePerspective, selectedCategory, searchQuery, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredModels.length / itemsPerPage) || 1;
  const paginatedModels = filteredModels.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const hasActiveFilters = searchQuery.trim() !== '' || selectedCategory !== 'All' || activePerspective !== 'overall';

  const handleClearFilters = () => {
    setActivePerspective('overall');
    setSearchQuery('');
    setSelectedCategory('All');
    setSortBy('rank');
  };

  // Helper to render rank delta
  const renderRankDeltaBadge = (model) => {
    if (model.rankDelta === 'NEW') {
      return (
        <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          NEW
        </span>
      );
    }
    if (model.rankDelta && model.rankDelta.startsWith('+')) {
      return (
        <span className="text-[10px] font-bold text-emerald-400 flex items-center font-mono">
          ▲{model.rankDelta.replace('+', '')}
        </span>
      );
    }
    if (model.rankDelta && model.rankDelta.startsWith('-')) {
      return (
        <span className="text-[10px] font-bold text-red-400 flex items-center font-mono">
          ▼{model.rankDelta.replace('-', '')}
        </span>
      );
    }
    return <span className="text-[10px] text-[#71717A] font-mono">—</span>;
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#6E56CF]/30 pb-28">
      {/* Header Banner */}
      <div className="border-b border-[#1C1C1F] bg-[#000000] pt-10 pb-10 sm:pt-14 sm:pb-12 px-3.5 sm:px-8 relative overflow-hidden">
        {/* Subtle atmospheric glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[260px] bg-gradient-to-b from-[#6E56CF]/15 via-transparent to-transparent blur-3xl pointer-events-none -z-0"></div>

        <div className="mx-auto max-w-[1440px] relative z-10">
          {/* Breadcrumb Tag & Methodology Trigger */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-[#6E56CF]/15 text-[#A78BFA] border border-[#6E56CF]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                Live Benchmark Index
              </span>
              <span className="text-xs text-[#71717A] hidden sm:inline font-mono">
                Updated Hourly • LMSYS Arena Grounded
              </span>
            </div>

            <button
              onClick={() => setIsMethodologyOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-[#141418] border border-[#27272A] text-[#A1A1AA] hover:text-white hover:border-[#3F3F46] transition-all cursor-pointer shadow-sm hover:shadow-md"
            >
              <HelpCircle size={13} className="text-[#A78BFA]" />
              <span>Methodology &amp; Trust</span>
            </button>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-2.5">
              AI Ecosystem Leaderboard
            </h1>
            <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed max-w-2xl font-normal mb-6">
              Track real-world evaluation benchmarks, Chatbot Arena Elo scores, inference speeds, and enterprise pricing across top AI foundation models and developer tools.
            </p>
          </div>

          {/* Inline Stats Strip */}
          <div className="flex flex-wrap items-center gap-y-3 gap-x-6 sm:gap-x-8 pt-1 mb-8">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#71717A] font-semibold block mb-0.5">
                Tracked Systems
              </span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-white">
                {LEADERBOARD_DATA.length} Models
              </span>
            </div>

            <div className="hidden sm:block w-[1px] h-8 bg-[#27272A]" />

            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#71717A] font-semibold block mb-0.5">
                Tracked Companies
              </span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-white">
                100 Enterprises
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

          {/* Primary Section Switcher: Part A (Models & Tools) vs Part B (AI Companies Top 100) */}
          <div className="inline-flex p-1 rounded-2xl bg-[#131316] border border-[#232328] shadow-inner">
            <button
              onClick={() => setActiveTab('models')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'models'
                  ? 'bg-white text-black shadow-md shadow-white/10'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-[#18181f]'
              }`}
            >
              <Cpu size={15} />
              <span>AI Models & Tools</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'models' ? 'bg-black/15 text-black' : 'bg-[#1f1f26] text-[#71717A]'
              }`}>
                {LEADERBOARD_DATA.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('companies')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'companies'
                  ? 'bg-[#6E56CF] text-white shadow-md shadow-[#6E56CF]/30'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-[#18181f]'
              }`}
            >
              <Building2 size={15} />
              <span>AI Companies — Top 100</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'companies' ? 'bg-white/20 text-white' : 'bg-[#1f1f26] text-[#71717A]'
              }`}>
                New
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-[1440px] px-3.5 sm:px-8 pt-6 sm:pt-8">
        {/* If Companies Tab is active, render Part B */}
        {activeTab === 'companies' && (
          <CompaniesLeaderboardSection />
        )}

        {/* If Models Tab is active, render Part A */}
        {activeTab === 'models' && (
          <>
            {/* 1. Dynamic Perspective Tabs */}
            <PerspectiveTabs
              perspectives={PERSPECTIVE_OPTIONS}
              activePerspective={activePerspective}
              onSelectPerspective={setActivePerspective}
              perspectiveCounts={perspectiveCounts}
            />

        {/* 2. Sub-Filter: Entity Type & Category Pills Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
          {/* Entity Type Toggle (All / AI Models / AI Tools) */}
          <div className="inline-flex p-1 rounded-xl bg-[#141418] border border-[#232328] shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setEntityType('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                entityType === 'all'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              All ({LEADERBOARD_DATA.length})
            </button>
            <button
              onClick={() => setEntityType('models')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                entityType === 'models'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              AI Models (75)
            </button>
            <button
              onClick={() => setEntityType('tools')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                entityType === 'tools'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              AI Tools (58)
            </button>
          </div>

          {/* Category Pills Bar */}
          <div className="relative min-w-0 flex-1 flex items-center justify-start sm:justify-end">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
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

            {!isSelectedInPrimary && (
              <button
                onClick={() => setIsMoreDropdownOpen(false)}
                className="rounded-full px-3.5 py-1 text-[12px] font-semibold whitespace-nowrap transition-all duration-200 border cursor-pointer shrink-0 bg-white text-black border-white shadow-sm"
              >
                {selectedCategory}
              </button>
            )}

            {/* More Dropdown */}
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
      </div>

        {/* 3. Controls Row: Search + Sort + Compare Trigger */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 sm:mb-8">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search models, superpowers, or providers..."
              className="w-full rounded-xl border border-[#232326] bg-[#131316] pl-9 pr-8 text-[13px] text-white placeholder:text-[#71717A] hover:border-[#3a3a40] focus:border-[#6E56CF] focus:outline-none transition-all h-9"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-white cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 justify-end">
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

            {selectedForCompare.length > 0 && (
              <button
                onClick={() => setIsCompareModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-semibold text-white bg-[#6E56CF] hover:bg-[#7C66DC] rounded-xl transition-all shadow-md shadow-[#6E56CF]/20 h-9 cursor-pointer active:scale-95 shrink-0"
              >
                <GitCompare size={13} />
                <span>Compare ({selectedForCompare.length})</span>
              </button>
            )}

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

        {/* State 1: Error State */}
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

        {/* State 2: Loading Skeleton */}
        {!isError && isLoading && <LeaderboardSkeleton />}

        {/* State 3: Empty State */}
        {!isError && !isLoading && filteredModels.length === 0 && (
          <div className="p-12 rounded-2xl border border-[#232326] bg-[#111115] text-center max-w-md mx-auto my-8">
            <Trophy size={36} className="text-[#71717A] mx-auto mb-3 opacity-50" />
            <h3 className="text-base font-bold text-white mb-1">No results in this view</h3>
            <p className="text-xs text-[#A1A1AA] mb-5">
              Try switching back to the Overall tab or clearing your category filters.
            </p>
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white text-black hover:bg-[#E4E4E7] transition-all cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>Reset all filters</span>
            </button>
          </div>
        )}

        {/* State 4: Loaded Table & Mobile Cards */}
        {!isError && !isLoading && filteredModels.length > 0 && (
          <div className="space-y-4">
            {/* Desktop Table */}
            <div className="hidden sm:block rounded-2xl border border-[#232326] bg-[#111115] overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <AdaptiveTableHeaders category={selectedCategory} />
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
                          {/* Rank badge with Delta */}
                          <td className="p-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                            <div className="flex flex-col items-center">
                              <span
                                className={`inline-flex items-center justify-center w-7 h-7 rounded-xl font-bold font-mono text-xs ${
                                  model.rank === 1
                                    ? 'bg-[#F5A623] text-black shadow-md shadow-[#F5A623]/25'
                                    : model.rank === 2
                                    ? 'bg-[#E4E4E7] text-black'
                                    : model.rank === 3
                                    ? 'bg-[#CD7F32] text-black'
                                    : 'text-[#A1A1AA] bg-[#16161c] border border-[#232328]'
                                }`}
                              >
                                #{model.rank}
                              </span>
                              <div className="mt-1">{renderRankDeltaBadge(model)}</div>
                            </div>
                          </td>

                          {/* Model & Superpower */}
                          <td className="p-3.5">
                            <div className="flex flex-col gap-1">
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
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[11px] text-[#71717A] font-mono">
                                  {model.org}
                                </span>
                                {model.superpower && (
                                  <SuperpowerBadge
                                    superpower={model.superpower}
                                    category={model.category}
                                    detail={model.superpowerDetail}
                                  />
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Metric 1 (Arena Elo or Visual Elo or Voice MOS) */}
                          <td className="p-3.5 font-mono font-bold text-white text-[13px]">
                            <div className="flex items-center gap-1.5">
                              <span>{model.categoryMetricValue || model.arenaElo}</span>
                              {model.eloChange && (
                                <span className="text-[10px] text-[#10B981] font-normal">
                                  {model.eloChange}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Metric 2 (SWE-bench / MMLU / Render Time) */}
                          <td className="p-3.5 font-mono text-[#10B981] font-semibold">
                            {model.categorySubMetricValue || model.codingScore || model.mmluPro || 'N/A'}
                          </td>

                          {/* Metric 3 (Output Speed or Resolution or Languages) */}
                          <td className="p-3.5 font-mono text-[#A1A1AA]">
                            {model.categoryDimension3 || model.outputSpeed}
                          </td>

                          {/* Pricing */}
                          <td className="p-3.5 font-mono text-xs text-[#E4E4E7]">
                            {model.price}
                          </td>

                          {/* Category */}
                          <td className="p-3.5">
                            <span className="px-2.5 py-1 rounded-full text-[10.5px] font-medium bg-[#1a1a20] border border-[#272730] text-[#A1A1AA]">
                              {model.category}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="p-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => onToggleCompare(model)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                                  isCompared
                                    ? 'bg-[#6E56CF] text-white border-[#6E56CF]'
                                    : 'bg-[#18181c] text-[#A1A1AA] border-[#27272e] hover:text-white'
                                }`}
                                title="Compare"
                              >
                                {isCompared ? 'Added' : 'Compare'}
                              </button>

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

            {/* Mobile Cards (<= 640px) */}
            <div className="sm:hidden space-y-3">
              {paginatedModels.map((model) => {
                const isCompared = selectedForCompare.some((m) => m.id === model.id);
                return (
                  <MobileLeaderboardCard
                    key={model.id}
                    model={model}
                    isCompared={isCompared}
                    onToggleCompare={onToggleCompare}
                  />
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
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#232326] bg-[#131316] text-xs font-medium transition-all cursor-pointer ${
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
                    className={`w-8 h-8 rounded-xl text-xs font-semibold font-mono border transition-all cursor-pointer ${
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
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#232326] bg-[#131316] text-xs font-medium transition-all cursor-pointer ${
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
        </>
        )}
      </div>

      {/* Floating Quick Compare Dock with Dimension Winners */}
      <QuickCompareDock
        selectedModels={selectedForCompare}
        onToggleCompare={onToggleCompare}
        onClearCompare={onClearCompare}
        onOpenModal={() => setIsCompareModalOpen(true)}
      />

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
                className="w-8 h-8 rounded-lg border border-[#232326] bg-[#16161a] flex items-center justify-center text-[#A1A1AA] hover:text-white cursor-pointer"
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
                          <button onClick={() => onToggleCompare(m)} className="text-[#71717A] hover:text-red-400 cursor-pointer">
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
                    <td className="p-3 text-[#71717A]">Superpower</td>
                    {selectedForCompare.map((m) => (
                      <td key={m.id} className="p-3 font-medium text-[#A78BFA]">
                        {m.superpower || 'N/A'}
                      </td>
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
                      <td key={m.id} className="p-3">{m.licenseType || m.license}</td>
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
              <button onClick={onClearCompare} className="text-xs text-[#71717A] hover:text-white cursor-pointer">
                Clear all
              </button>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#232326] text-white hover:bg-[#2e2e33] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Methodology & Data Transparency Drawer */}
      <MethodologyDrawer
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />
    </div>
  );
}
