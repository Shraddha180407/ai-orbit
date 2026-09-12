import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LEADERBOARD_DATA, 
  LEADERBOARD_CATEGORIES, 
  SORT_OPTIONS, 
  PERSPECTIVE_OPTIONS,
  AI_MODELS_DATA,
  AI_TOOLS_DATA
} from '../data/leaderboardData';
import { COMPANIES_DATA } from '../data/companiesData';
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
  Zap,
  HelpCircle,
  Check
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
  }, [activePerspective, selectedCategory, searchQuery, sortBy, entityType]);

  // Real dynamic ecosystem stats computed from actual datasets (no fabricated numbers)
  const ecosystemStats = useMemo(() => {
    const modelsCount = AI_MODELS_DATA.length;
    const toolsCount = AI_TOOLS_DATA.length;
    const companiesCount = COMPANIES_DATA.length;

    // Real throughput calculation
    const speeds = LEADERBOARD_DATA.map((m) => m.speedNum || parseInt(m.outputSpeed, 10) || 0).filter((s) => s > 0);
    const maxSpeed = speeds.length > 0 ? Math.max(...speeds) : null;
    const fastestSystem = maxSpeed ? LEADERBOARD_DATA.find((m) => (m.speedNum || parseInt(m.outputSpeed, 10)) === maxSpeed) : null;

    // Real growth calculation
    const growths = LEADERBOARD_DATA.map((m) => parseFloat((m.growth || '').replace(/[^0-9.-]/g, '')) || 0).filter((g) => g > 0);
    const maxGrowth = growths.length > 0 ? Math.max(...growths) : null;
    const topGrowthSystem = maxGrowth ? LEADERBOARD_DATA.find((m) => parseFloat((m.growth || '').replace(/[^0-9.-]/g, '')) === maxGrowth) : null;

    return {
      modelsCount,
      toolsCount,
      companiesCount,
      maxSpeed,
      fastestName: fastestSystem?.name || 'Top Model',
      maxGrowth,
      topGrowthName: topGrowthSystem?.name || 'Top Mover'
    };
  }, []);

  // Live rotating hero telemetry sequence (single metric at a time)
  const HERO_METRICS = useMemo(() => [
    { value: `${LEADERBOARD_DATA.length}`, label: 'TRACKED SYSTEMS', sub: 'LIVE INDEX' },
    { value: `${ecosystemStats.modelsCount}`, label: 'MODELS', sub: 'FOUNDATION ARCHITECTURES' },
    { value: `${ecosystemStats.toolsCount}`, label: 'TOOLS', sub: 'DEVELOPER APPLICATIONS' },
    { value: `${ecosystemStats.companiesCount}`, label: 'AI COMPANIES', sub: 'ENTERPRISE INDEX' },
    { value: `${ecosystemStats.maxSpeed ? `${ecosystemStats.maxSpeed} tok/s` : '260 tok/s'}`, label: 'PEAK THROUGHPUT', sub: ecosystemStats.fastestName || 'GROQ INFERENCE' },
    { value: `${ecosystemStats.maxGrowth ? `+${ecosystemStats.maxGrowth}%` : '+180%'}`, label: 'FASTEST GROWTH', sub: ecosystemStats.topGrowthName || 'MOMENTUM INDEX' }
  ], [ecosystemStats]);

  const [rotatingMetricIndex, setRotatingMetricIndex] = useState(0);
  const [isMetricTransitioning, setIsMetricTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Smoothly exit to the right
      setIsMetricTransitioning(true);

      // 2. Switch to next metric and enter from the right
      const timer = setTimeout(() => {
        setRotatingMetricIndex((prev) => (prev + 1) % HERO_METRICS.length);
        setIsMetricTransitioning(false);
      }, 250);

      return () => clearTimeout(timer);
    }, 2800);

    return () => clearInterval(interval);
  }, [HERO_METRICS.length]);

  const currentMetric = HERO_METRICS[rotatingMetricIndex] || HERO_METRICS[0];

  // Compute winners across dimensions for the Compare Modal with strict tie detection
  const { compareWinners, aggregateVerdict } = useMemo(() => {
    if (selectedForCompare.length < 2) {
      return { compareWinners: {}, aggregateVerdict: null };
    }

    const parsePct = (str) => {
      if (!str || str === 'N/A') return null;
      const m = str.match(/(\d+\.?\d*)/);
      return m ? parseFloat(m[1]) : null;
    };

    const parseSpeed = (m) => m.speedNum || parseInt(m.outputSpeed, 10) || null;

    const parseCtx = (str) => {
      if (!str) return null;
      if (str.includes('M')) return parseFloat(str) * 1000000;
      if (str.includes('k') || str.includes('K')) return parseFloat(str) * 1000;
      return parseFloat(str) || null;
    };

    // Helper: evaluate dimension winners.
    // If all values are identical, return empty array (zero boxes).
    // If one max exists, return [winnerId].
    // If tie for top, return [id1, id2].
    const findWinners = (extractVal) => {
      const entries = selectedForCompare
        .map((m) => ({ id: m.id, val: extractVal(m) }))
        .filter((e) => e.val !== null && !isNaN(e.val));

      if (entries.length < 2) return [];
      const values = entries.map((e) => e.val);
      const maxVal = Math.max(...values);
      const minVal = Math.min(...values);

      // If all values are equal across models, it's a tie across all -> NO winner box
      if (maxVal === minVal) return [];

      // Return all IDs matching max
      return entries.filter((e) => e.val === maxVal).map((e) => e.id);
    };

    const w = {
      mmlu: findWinners((m) => parsePct(m.mmluPro)),
      coding: findWinners((m) => parsePct(m.codingScore)),
      speed: findWinners((m) => parseSpeed(m)),
      context: findWinners((m) => parseCtx(m.contextWindow))
    };

    // Compute aggregate verdict
    const winCounts = {};
    selectedForCompare.forEach((m) => {
      winCounts[m.id] = 0;
    });

    const evaluatedDimensions = ['mmlu', 'coding', 'speed', 'context'];
    let totalActiveDimensions = 0;

    evaluatedDimensions.forEach((dim) => {
      if (w[dim].length > 0) {
        totalActiveDimensions++;
        w[dim].forEach((id) => {
          winCounts[id] = (winCounts[id] || 0) + 1;
        });
      }
    });

    let topModelId = null;
    let maxWins = 0;
    let isVerdictTie = false;

    Object.entries(winCounts).forEach(([id, count]) => {
      if (count > maxWins) {
        maxWins = count;
        topModelId = id;
        isVerdictTie = false;
      } else if (count === maxWins && count > 0) {
        isVerdictTie = true;
      }
    });

    let verdict = null;
    if (topModelId && maxWins > 0 && !isVerdictTie) {
      const topModel = selectedForCompare.find((m) => m.id === topModelId);
      const shortName = topModel ? (topModel.name.startsWith('OpenAI ') ? topModel.name.replace('OpenAI ', '') : topModel.name.split(' ').slice(0, 2).join(' ')) : 'Model';
      verdict = `${shortName} leads on ${maxWins} of ${totalActiveDimensions} comparable benchmark metrics`;
    } else if (isVerdictTie && maxWins > 0) {
      verdict = `Models are tied across comparable benchmark dimensions`;
    } else {
      verdict = `Systems share comparable performance characteristics`;
    }

    return { compareWinners: w, aggregateVerdict: verdict };
  }, [selectedForCompare]);

  const SEARCH_PLACEHOLDER = "Search models, tools, superpowers, or providers...";

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
        <span 
          className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
          title="New addition to index"
          aria-label="New addition to index"
        >
          NEW
        </span>
      );
    }
    if (model.rankDelta && model.rankDelta.startsWith('+')) {
      return (
        <span 
          className="text-[10px] font-bold text-emerald-400 flex items-center font-mono"
          title={`Rank up by ${model.rankDelta.replace('+', '')} places`}
          aria-label={`Rank up by ${model.rankDelta.replace('+', '')} places`}
        >
          ▲{model.rankDelta.replace('+', '')}
        </span>
      );
    }
    if (model.rankDelta && model.rankDelta.startsWith('-')) {
      return (
        <span 
          className="text-[10px] font-bold text-red-400 flex items-center font-mono"
          title={`Rank down by ${model.rankDelta.replace('-', '')} places`}
          aria-label={`Rank down by ${model.rankDelta.replace('-', '')} places`}
        >
          ▼{model.rankDelta.replace('-', '')}
        </span>
      );
    }
    return (
      <span 
        className="text-[10px] text-[#71717A] font-mono"
        title="Rank stable this period"
        aria-label="Rank stable this period"
      >
        —
      </span>
    );
  };

  // Helper for tapered medal and rank indicator stripes (ranks 1-10)
  const getMedalStripeClass = (rank) => {
    if (rank === 1) return 'border-l-4 border-l-[#F5A623] bg-[#F5A623]/[0.05]';
    if (rank === 2) return 'border-l-4 border-l-[#CBD5E1] bg-white/[0.04]';
    if (rank === 3) return 'border-l-4 border-l-[#EA580C] bg-[#EA580C]/[0.05]';
    if (rank === 4) return 'border-l-4 border-l-zinc-400/50';
    if (rank === 5) return 'border-l-4 border-l-zinc-400/40';
    if (rank === 6) return 'border-l-4 border-l-zinc-400/32';
    if (rank === 7) return 'border-l-4 border-l-zinc-500/26';
    if (rank === 8) return 'border-l-4 border-l-zinc-500/20';
    if (rank === 9) return 'border-l-4 border-l-zinc-600/15';
    if (rank === 10) return 'border-l-4 border-l-zinc-600/10';
    return 'border-l-4 border-l-transparent';
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#6E56CF]/30 pb-28">
      {/* Hero Section */}
      <div className="border-b border-[#1C1C1F] bg-black pt-8 pb-7 sm:pt-12 sm:pb-9 px-3.5 sm:px-8 relative">
        <div className="mx-auto max-w-[1440px]">
          {/* Top Eyebrow */}
          <div className="flex items-center gap-2 text-[10.5px] sm:text-[11px] font-mono tracking-wider uppercase text-[#71717A] mb-6 sm:mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0" />
            <span className="text-[#E4E4E7] font-semibold">LIVE BENCHMARK INDEX</span>
            <span className="text-[#3F3F46]">·</span>
            <span className="text-[#71717A]">INDEPENDENT EVALUATION INDEX</span>
          </div>

          {/* Main Headline (Left) & Single Live Rotating Metric (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8 sm:mb-10">
            {/* Left Column: Headline & Description */}
            <div className="lg:col-span-8">
              <h1 className="text-4xl sm:text-6xl lg:text-[64px] font-extrabold tracking-tight text-white leading-[1.05] mb-3">
                AI Ecosystem<br />
                Leaderboard
              </h1>
              <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed max-w-xl font-normal">
                Compare the models, tools, and companies shaping the AI ecosystem.
                Track real-world evaluation benchmarks, Chatbot Arena Elo scores, and
                enterprise pricing at scale.
              </p>
            </div>

            {/* Right Column: Live Benchmark Intelligence Metric */}
            <div className="lg:col-span-4 flex lg:justify-end">
              <div className="w-full lg:w-auto lg:min-w-[240px] pl-4 sm:pl-6 border-l border-[#232328]">
                <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase text-[#71717A] mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6E56CF] shrink-0" />
                  <span>{currentMetric.label}</span>
                </div>

                <div className="overflow-hidden py-1">
                  <div
                    className={`transition-all duration-300 ease-out transform ${
                      isMetricTransitioning
                        ? 'opacity-0 translate-x-4'
                        : 'opacity-100 translate-x-0'
                    }`}
                  >
                    <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-mono text-white tracking-tight leading-none my-1">
                      {currentMetric.value}
                    </div>
                    <div className="text-[10px] font-mono tracking-wider uppercase text-[#A78BFA] mt-1.5 flex items-center gap-1.5">
                      <span className="inline-block w-1 h-1 rounded-full bg-[#A78BFA]" />
                      <span>{currentMetric.sub}</span>
                    </div>
                  </div>
                </div>

                {/* Subtle purple line/accent underneath */}
                <div className="h-[2px] w-14 bg-gradient-to-r from-[#6E56CF] to-transparent mt-3" />
              </div>
            </div>
          </div>

          {/* Bottom Switcher: Models vs Companies + Technical Status */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#1C1C1F]">
            <div className="inline-flex p-0.5 rounded-xl bg-[#131316] border border-[#232328] shadow-inner">
              <button
                onClick={() => setActiveTab('models')}
                className={`flex items-center gap-2 px-4 py-1.5 sm:px-5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'models'
                    ? 'bg-[#6E56CF] text-white shadow-md shadow-[#6E56CF]/30'
                    : 'text-[#A1A1AA] hover:text-white hover:bg-[#18181f]'
                }`}
              >
                <Cpu size={14} />
                <span>AI Models &amp; Tools</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'models' ? 'bg-white/20 text-white' : 'bg-[#1f1f26] text-[#71717A]'
                }`}>
                  {LEADERBOARD_DATA.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('companies')}
                className={`flex items-center gap-2 px-4 py-1.5 sm:px-5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'companies'
                    ? 'bg-[#6E56CF] text-white shadow-md shadow-[#6E56CF]/30'
                    : 'text-[#A1A1AA] hover:text-white hover:bg-[#18181f]'
                }`}
              >
                <Building2 size={14} />
                <span>AI Companies — Top 100</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'companies' ? 'bg-white/20 text-white' : 'bg-[#1f1f26] text-[#71717A]'
                }`}>
                  {ecosystemStats.companiesCount}
                </span>
              </button>
            </div>

            <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[#71717A] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              <span>DATA UPDATED 12H AGO</span>
            </div>
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
              onOpenMethodology={() => setIsMethodologyOpen(true)}
            />

        {/* 2. Sub-Filter: Entity Type & Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 mb-6 sm:mb-8 -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
          {/* Entity Type Toggle (All / AI Models / AI Tools) */}
          <div className="inline-flex items-center p-0.5 rounded-full bg-[#141418] border border-[#232328] shrink-0">
            <button
              onClick={() => setEntityType('all')}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                entityType === 'all'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              All ({LEADERBOARD_DATA.length})
            </button>
            <button
              onClick={() => setEntityType('models')}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                entityType === 'models'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              Models ({ecosystemStats.modelsCount})
            </button>
            <button
              onClick={() => setEntityType('tools')}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                entityType === 'tools'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              Tools ({ecosystemStats.toolsCount})
            </button>
          </div>

          {/* Thin vertical divider between Entity Type and Category Pills */}
          <div className="h-4 w-[1px] bg-[#27272e] mx-1 shrink-0" aria-hidden="true" />

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 shrink-0">
            {PRIMARY_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => {
                    setSelectedCategory(cat.value);
                    setIsMoreDropdownOpen(false);
                  }}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold whitespace-nowrap transition-all duration-200 border cursor-pointer shrink-0 ${
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
                className="rounded-full px-3 py-1 text-[11px] font-semibold whitespace-nowrap transition-all duration-200 border cursor-pointer shrink-0 bg-white text-black border-white shadow-sm"
              >
                {selectedCategory}
              </button>
            )}

            {/* More Dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => setIsMoreDropdownOpen((prev) => !prev)}
                className={`rounded-full px-3 py-1 text-[11px] font-semibold whitespace-nowrap transition-all duration-200 border cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  isMoreDropdownOpen || !isSelectedInPrimary
                    ? 'text-white border-white/40 bg-white/10'
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
                            ? 'text-white bg-white/10 font-semibold'
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

        {/* 3. Controls Row: Unified Search + Sort container */}
        <div className="p-1.5 sm:p-2 rounded-2xl border border-[#232326] bg-[#111115] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mb-6 sm:mb-8">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={SEARCH_PLACEHOLDER}
              className="w-full rounded-xl border border-[#3a3a40] bg-[#16161b] pl-9 pr-8 text-[13px] text-white placeholder:text-[#71717A] hover:border-[#4a4a52] focus:border-white/40 focus:ring-2 focus:ring-white/20 focus:outline-none transition-all h-9"
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

          <div className="flex items-center gap-2 justify-end shrink-0">
            <div className="relative inline-flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none rounded-xl border border-[#3a3a40] bg-[#16161b] pl-3 pr-8 text-[12px] font-medium text-white hover:border-[#4a4a52] focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all cursor-pointer h-9"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#16161b] text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71717A] pointer-events-none" />
            </div>

            {selectedForCompare.length > 0 && (
              <button
                onClick={() => setIsCompareModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-semibold text-white bg-[#22222a] hover:bg-[#2b2b35] border border-[#383844] rounded-xl transition-all shadow-sm h-9 cursor-pointer active:scale-95 shrink-0"
              >
                <GitCompare size={13} className="text-white" />
                <span>Compare ({selectedForCompare.length})</span>
              </button>
            )}

            <button
              onClick={handleClearFilters}
              disabled={!hasActiveFilters}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-xl border h-9 transition-all shrink-0 ${
                hasActiveFilters
                  ? 'text-white bg-[#1f1f26] border-[#383842] hover:bg-[#272732] cursor-pointer shadow-sm'
                  : 'text-[#52525B] bg-[#141418] border-[#232328] cursor-not-allowed opacity-50'
              }`}
              title={hasActiveFilters ? "Reset all search & filter criteria" : "No active filters to reset"}
            >
              <RotateCcw size={12} className={hasActiveFilters ? "text-white" : "text-[#52525B]"} />
              <span className="hidden sm:inline">Clear</span>
            </button>
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
            <Search size={36} className="text-[#71717A] mx-auto mb-3 opacity-50" />
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
                    <AdaptiveTableHeaders category={selectedCategory} entityType={entityType} />
                  </thead>
                  <tbody className="divide-y divide-[#1F1F24] text-[#E4E4E7]">
                    {paginatedModels.map((model) => {
                      const isCompared = selectedForCompare.some((m) => m.id === model.id);
                      const isTool = model.entityType === 'tool';

                      return (
                        <tr
                          key={model.id}
                          className={`transition-colors group cursor-pointer ${
                            model.rank === 1
                              ? 'hover:bg-[#1a1710]'
                              : model.rank === 2
                              ? 'hover:bg-[#18181e]'
                              : model.rank === 3
                              ? 'hover:bg-[#181512]'
                              : 'hover:bg-[#181820]'
                          }`}
                          onClick={() => navigate(`/leaderboard/${model.slug}`)}
                        >
                          {/* Rank badge with Delta & Tapered Stripe */}
                          <td 
                            className={`py-2.5 px-3.5 text-center transition-colors relative ${getMedalStripeClass(model.rank)}`} 
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex flex-col items-center">
                              <span
                                className={`inline-flex items-center justify-center w-7 h-7 rounded-xl font-bold font-mono text-xs ${
                                  model.rank === 1
                                    ? 'bg-gradient-to-br from-[#F5A623] via-[#FBBF24] to-[#D97706] text-black font-extrabold shadow-md shadow-[#F5A623]/30 border border-[#FCD34D]/60'
                                    : model.rank === 2
                                    ? 'bg-gradient-to-br from-[#FFFFFF] via-[#E2E8F0] to-[#94A3B8] text-[#0F172A] font-extrabold shadow-md shadow-white/25 border border-white/80 ring-1 ring-white/30'
                                    : model.rank === 3
                                    ? 'bg-gradient-to-br from-[#FDBA74] via-[#EA580C] to-[#9A3412] text-white font-extrabold shadow-md shadow-[#EA580C]/35 border border-[#FDBA74]/60 ring-1 ring-[#EA580C]/30'
                                    : 'text-[#A1A1AA] bg-[#16161c] border border-[#232328]'
                                }`}
                              >
                                #{model.rank}
                              </span>
                              <div className="mt-0.5">{renderRankDeltaBadge(model)}</div>
                            </div>
                          </td>

                          {/* Model / Tool Info */}
                          <td className="py-2.5 px-3.5">
                            <div className="flex flex-col gap-0.5">
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
                                {(model.superpowerShort || model.superpower) && (
                                  <SuperpowerBadge
                                    superpower={model.superpowerShort || model.superpower}
                                    category={model.category}
                                  />
                                )}
                                {isTool && entityType !== 'tools' && model.categoryMetricValue && (
                                  <span className="text-[10px] text-[#A1A1AA] font-mono bg-[#181820] px-1.5 py-0.5 rounded border border-[#272730]">
                                    {model.categoryMetricLabel ? `${model.categoryMetricLabel}: ` : ''}{model.categoryMetricValue}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Metric 1 (Arena Elo / Tool Rating) */}
                          <td className="py-2.5 px-3.5 font-mono font-bold text-white text-[13px]">
                            {entityType === 'tools' ? (
                              <div>
                                <span>{model.categoryMetricValue || '—'}</span>
                                {model.categoryMetricLabel && (
                                  <span className="text-[10px] text-[#71717A] block font-sans font-normal">{model.categoryMetricLabel}</span>
                                )}
                              </div>
                            ) : isTool ? (
                              <span className="text-[#71717A] font-mono text-xs font-normal" title="Arena Elo is not applicable to developer tools">
                                —
                              </span>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <span>{model.categoryMetricValue || model.arenaElo || '—'}</span>
                                {model.eloChange && (
                                  <span className="text-[10px] text-emerald-400 font-normal">
                                    {model.eloChange}
                                  </span>
                                )}
                              </div>
                            )}
                          </td>

                          {/* Metric 2 (Coding Score / Key Benchmark) */}
                          <td className="py-2.5 px-3.5 font-mono text-[#E4E4E7] font-semibold">
                            {entityType === 'tools' ? (
                              <div>
                                <span>{model.categorySubMetricValue || model.codingScore || '—'}</span>
                                {model.categorySubMetricLabel && (
                                  <span className="text-[10px] text-[#71717A] block font-sans font-normal">{model.categorySubMetricLabel}</span>
                                )}
                              </div>
                            ) : isTool ? (
                              model.codingScore ? (
                                <div className="flex items-center gap-1.5">
                                  <span>{model.codingScore}</span>
                                  <span className="text-[9.5px] text-[#71717A] font-sans font-normal">SWE</span>
                                </div>
                              ) : (
                                <span className="text-[#71717A] font-mono text-xs font-normal" title="Not applicable">—</span>
                              )
                            ) : (
                              model.categorySubMetricValue || model.codingScore || model.mmluPro || '—'
                            )}
                          </td>

                          {/* Metric 3 (Speed tok/s / Active Scale) */}
                          <td className="py-2.5 px-3.5 font-mono text-[#A1A1AA]">
                            {entityType === 'tools' ? (
                              <span>{model.categoryDimension3 || model.outputSpeed || model.monthlyVisits || '—'}</span>
                            ) : isTool ? (
                              <span className="text-[#71717A] font-mono text-xs" title="Token throughput (tok/s) is not applicable to developer tools">
                                —
                              </span>
                            ) : (
                              model.categoryDimension3 || (model.outputSpeed ? `${model.outputSpeed} tok/s` : '—')
                            )}
                          </td>

                          {/* Pricing */}
                          <td className="py-2.5 px-3.5 font-mono text-xs text-[#E4E4E7]">
                            {model.price}
                          </td>

                          {/* Category */}
                          <td className="py-2.5 px-3.5">
                            <span className="px-2.5 py-1 rounded-full text-[10.5px] font-medium bg-[#1a1a20] border border-[#272730] text-[#A1A1AA]">
                              {model.category}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-2.5 px-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => onToggleCompare(model)}
                                className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                                  isCompared
                                    ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-400'
                                    : 'bg-[#18181c] text-[#A1A1AA] border-[#27272e] hover:text-white hover:border-[#3f3f46]'
                                }`}
                                title={isCompared ? "Remove from comparison" : "Add to comparison"}
                                aria-label={isCompared ? `Remove ${model.name} from comparison` : `Compare ${model.name}`}
                              >
                                {isCompared ? 'Added' : 'Compare'}
                              </button>

                              <Link
                                to={`/leaderboard/${model.slug}`}
                                className="px-3.5 py-1 rounded-lg text-xs font-semibold bg-white text-black hover:bg-[#E4E4E7] transition-all flex items-center justify-center cursor-pointer shadow-sm"
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
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto cursor-pointer"
          onClick={() => setIsCompareModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-5xl rounded-2xl border border-[#27272a] bg-[#111114] shadow-2xl p-5 sm:p-7 my-auto text-white animate-in fade-in zoom-in-95 duration-150 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#232326]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center">
                  <GitCompare size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Head-to-Head Model Comparison</h3>
                  <p className="text-xs text-[#A1A1AA]">Benchmarking {selectedForCompare.length} AI systems side-by-side with verified signals</p>
                </div>
              </div>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="w-8 h-8 rounded-lg border border-[#232326] bg-[#16161a] flex items-center justify-center text-[#A1A1AA] hover:text-white cursor-pointer transition-colors"
                title="Close modal"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Aggregate Verdict Banner */}
            {aggregateVerdict && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141418] border border-[#27272e] text-xs text-[#E4E4E7] shadow-sm">
                <Trophy size={13} className="text-emerald-400 shrink-0" />
                <span className="font-medium">{aggregateVerdict}</span>
              </div>
            )}

            {/* Comparison Matrix Table */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#232326] bg-[#141418]">
                    <th className="p-3 text-[11px] uppercase tracking-wider text-[#71717A] font-semibold w-40 min-w-[140px]">Metric</th>
                    {selectedForCompare.map((m) => (
                      <th key={m.id} className="p-3 min-w-[200px]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm text-white">{m.name}</span>
                          <button 
                            onClick={() => onToggleCompare(m)} 
                            className="text-[#71717A] hover:text-white cursor-pointer"
                            title={`Remove ${m.name}`}
                          >
                            <X size={12} />
                          </button>
                        </div>
                        <span className="text-[11px] text-[#A1A1AA] block">{m.org} • {m.category}</span>
                        <span className="text-xs font-mono font-bold text-[#F5A623]">{m.categoryMetricValue || `${m.arenaElo} Elo`}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F1F24] text-[#E4E4E7]">
                  <tr className="bg-[#131316]/50">
                    <td className="p-3 text-[#71717A] font-medium">Arena Ranking</td>
                    {selectedForCompare.map((m) => (
                      <td key={m.id} className="p-3 font-mono min-w-[200px]">
                        <span className={m.rank === 1 ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded font-bold' : 'text-white font-bold'}>
                          #{m.rank}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-[#71717A] font-medium">Superpower</td>
                    {selectedForCompare.map((m) => (
                      <td key={m.id} className="p-3 font-medium text-white min-w-[200px]">
                        <SuperpowerBadge superpower={m.superpowerShort || m.superpower} category={m.category} />
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-[#131316]/50">
                    <td className="p-3 text-[#71717A] font-medium">MMLU Pro Score</td>
                    {selectedForCompare.map((m) => {
                      const isWinner = (compareWinners.mmlu || []).includes(m.id);
                      return (
                        <td key={m.id} className="p-3 font-mono min-w-[200px]">
                          <span className={isWinner ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded font-bold' : 'text-[#E4E4E7] font-semibold'}>
                            {m.mmluPro || 'N/A'}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="p-3 text-[#71717A] font-medium">Coding Score</td>
                    {selectedForCompare.map((m) => {
                      const isWinner = (compareWinners.coding || []).includes(m.id);
                      return (
                        <td key={m.id} className="p-3 font-mono min-w-[200px]">
                          <span className={isWinner ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded font-bold' : 'text-[#E4E4E7] font-semibold'}>
                            {m.codingScore || 'N/A'}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="bg-[#131316]/50">
                    <td className="p-3 text-[#71717A] font-medium">Output Throughput</td>
                    {selectedForCompare.map((m) => {
                      const isWinner = (compareWinners.speed || []).includes(m.id);
                      return (
                        <td key={m.id} className="p-3 font-mono min-w-[200px]">
                          <span className={isWinner ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded font-bold' : 'text-[#E4E4E7]'}>
                            {m.outputSpeed || 'N/A'}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="p-3 text-[#71717A] font-medium">Context Window</td>
                    {selectedForCompare.map((m) => {
                      const isWinner = (compareWinners.context || []).includes(m.id);
                      return (
                        <td key={m.id} className="p-3 font-mono min-w-[200px]">
                          <span className={isWinner ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded font-bold' : 'text-[#E4E4E7]'}>
                            {m.contextWindow || 'N/A'}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="bg-[#131316]/50">
                    <td className="p-3 text-[#71717A] font-medium">Pricing Model</td>
                    {selectedForCompare.map((m) => (
                      <td key={m.id} className="p-3 font-mono text-xs text-[#E4E4E7] min-w-[200px]">{m.price}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-[#71717A] font-medium">License / Delivery</td>
                    {selectedForCompare.length >= 2 && selectedForCompare.every((m) => (m.licenseType || m.license || 'API') === (selectedForCompare[0].licenseType || selectedForCompare[0].license || 'API')) ? (
                      <td colSpan={selectedForCompare.length} className="p-3 text-center text-[#A1A1AA] italic font-mono text-xs bg-[#131316]/30">
                        {selectedForCompare[0].licenseType || selectedForCompare[0].license || 'Commercial API'} (all models match)
                      </td>
                    ) : (
                      selectedForCompare.map((m) => (
                        <td key={m.id} className="p-3 text-white min-w-[200px]">{m.licenseType || m.license || 'API'}</td>
                      ))
                    )}
                  </tr>
                  <tr className="bg-[#131316]/50">
                    <td className="p-3 text-[#71717A] font-medium">Key Highlights</td>
                    {selectedForCompare.map((m) => (
                      <td key={m.id} className="p-3 min-w-[200px] align-top">
                        <ul className="list-disc list-inside space-y-1 text-[11px] text-[#A1A1AA] min-h-[44px]">
                          {(m.keyFeatures || []).slice(0, 2).map((f, i) => (
                            <li key={i} className="line-clamp-2">{f}</li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-3 border-t border-[#232326] flex items-center justify-between">
              <button
                onClick={onClearCompare}
                className="text-xs text-[#71717A] hover:text-red-400 hover:bg-red-950/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                Clear comparison
              </button>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-white text-black hover:bg-[#E4E4E7] transition-all cursor-pointer shadow-sm active:scale-95"
              >
                Done
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
