import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
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
  Check,
  X
} from 'lucide-react';
import {
  buildLeaderboardView,
  createRequestGate,
  DEFAULT_FILTERS,
  logLeaderboard,
  matchesCategory as matchLeaderboardCategory,
  shouldCommitPerspectiveFetch
} from '../lib/leaderboardQuery';

export const matchesCategory = matchLeaderboardCategory;

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

  // 1. Unified Single Filter Object
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // Atomic filter updater
  const updateFilters = useCallback((updates) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({ ...DEFAULT_FILTERS });
  }, []);

  const hasActiveFilters = 
    filters.category !== 'All' || 
    filters.perspective !== 'overall' || 
    filters.entityType !== 'all' || 
    filters.sortBy !== 'rank';

  const [reloadToken, setReloadToken] = useState(0);
  const [perspectivePayload, setPerspectivePayload] = useState({
    perspective: null,
    models: [],
    counts: {
      overall: 500,
      risers: 500,
      adopted: 500,
      speed: 201,
      open_weights: 267
    },
    lastUpdatedText: 'DATA UPDATED JUST NOW',
    status: 'loading'
  });

  // Compare Modal state
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Methodology Drawer state
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

  const perspectiveCacheRef = useRef(new Map());
  const requestGateRef = useRef(createRequestGate());
  const abortControllerRef = useRef(null);
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const resolvedPayload = useMemo(() => {
    if (perspectivePayload.perspective === filters.perspective && perspectivePayload.status === 'ready') {
      return perspectivePayload;
    }
    const cached = perspectiveCacheRef.current.get(filters.perspective);
    if (cached) {
      return { ...cached, perspective: filters.perspective, status: 'ready' };
    }
    return {
      perspective: filters.perspective,
      models: [],
      counts: perspectivePayload.counts,
      lastUpdatedText: perspectivePayload.lastUpdatedText,
      status: perspectivePayload.perspective === filters.perspective ? perspectivePayload.status : 'loading'
    };
  }, [filters.perspective, perspectivePayload]);

  const needsRankedModels = filters.entityType !== 'tools';
  const rankedModelsReady = !needsRankedModels || resolvedPayload.status === 'ready';

  useEffect(() => {
    const targetPerspective = filters.perspective;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const request = requestGateRef.current.start(filters);
    logLeaderboard('FILTER_CHANGE', {
      requestId: request.requestId,
      filter: {
        perspective: targetPerspective,
        type: filters.entityType,
        modality: filters.category
      }
    });

    const cached = perspectiveCacheRef.current.get(targetPerspective);
    if (cached) {
      logLeaderboard('REQUEST_SUCCESS', {
        requestId: request.requestId,
        source: 'cache',
        perspective: targetPerspective,
        entityType: filters.entityType,
        modality: filters.category,
        rowCount: Array.isArray(cached.models) ? cached.models.length : 0
      });
      setPerspectivePayload({ ...cached, perspective: targetPerspective, status: 'ready' });
      return () => controller.abort();
    }

    setPerspectivePayload((prev) => ({
      ...prev,
      perspective: targetPerspective,
      models: [],
      status: 'loading'
    }));

    logLeaderboard('REQUEST_START', {
      requestId: request.requestId,
      perspective: targetPerspective,
      entityType: filters.entityType,
      modality: filters.category
    });

    const commitIfCurrent = (nextPayload, extraLog = {}) => {
      const current = filtersRef.current;
      if (!shouldCommitPerspectiveFetch({
        requestId: request.requestId,
        requestPerspective: targetPerspective,
        currentId: requestGateRef.current.currentId,
        currentPerspective: current.perspective
      })) {
        logLeaderboard('REQUEST_DISCARDED', {
          requestId: request.requestId,
          reason: 'stale request',
          perspective: targetPerspective,
          entityType: request.filters.entityType,
          modality: request.filters.category
        });
        return false;
      }
      perspectiveCacheRef.current.set(targetPerspective, nextPayload);
      setPerspectivePayload({ ...nextPayload, perspective: targetPerspective, status: 'ready' });
      logLeaderboard('REQUEST_SUCCESS', {
        requestId: request.requestId,
        perspective: targetPerspective,
        entityType: current.entityType,
        modality: current.category,
        rowCount: Array.isArray(nextPayload.models) ? nextPayload.models.length : 0,
        ...extraLog
      });
      return true;
    };

    async function loadData() {
      try {
        const res = await fetch(`/api/leaderboard?perspective=${targetPerspective}`, {
          signal: controller.signal
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const models = (data.models && Array.isArray(data.models)) ? data.models : [];
        commitIfCurrent({
          models,
          counts: data.counts,
          lastUpdatedText: data.lastUpdatedText
        });
      } catch (apiErr) {
        if (apiErr.name === 'AbortError') return;

        console.warn('[Leaderboard] API fetch failed, trying static snapshot fallback:', apiErr.message);
        try {
          const snapRes = await fetch('/leaderboard_data.json', { signal: controller.signal });
          if (!snapRes.ok) throw new Error('Snapshot not found');
          const snapData = await snapRes.json();
          const list = snapData.modelsByPerspective?.[targetPerspective]?.models || snapData.models || [];
          let lastUpdatedText = snapData.metadata?.lastUpdated ? 'DATA UPDATED JUST NOW' : null;
          if (snapData.metadata?.lastUpdated) {
            const diffHours = Math.floor((Date.now() - new Date(snapData.metadata.lastUpdated).getTime()) / (1000 * 60 * 60));
            lastUpdatedText = diffHours >= 1 ? `DATA UPDATED ${diffHours}H AGO` : 'DATA UPDATED JUST NOW';
          }
          commitIfCurrent({
            models: list,
            counts: snapData.metadata?.counts,
            lastUpdatedText
          }, { source: 'snapshot' });
        } catch (snapErr) {
          if (snapErr.name === 'AbortError') return;
          if (shouldCommitPerspectiveFetch({
            requestId: request.requestId,
            requestPerspective: targetPerspective,
            currentId: requestGateRef.current.currentId,
            currentPerspective: filtersRef.current.perspective
          })) {
            setPerspectivePayload((prev) => ({
              ...prev,
              perspective: targetPerspective,
              models: [],
              status: 'error'
            }));
          }
        }
      }
    }

    loadData();

    return () => {
      controller.abort();
    };
  }, [filters.perspective, reloadToken]);

  const handleRetry = () => {
    perspectiveCacheRef.current.delete(filters.perspective);
    setPerspectivePayload((prev) => ({
      ...prev,
      perspective: filters.perspective,
      models: [],
      status: 'loading'
    }));
    setReloadToken((token) => token + 1);
  };

  const PRIMARY_CATEGORIES = [
    { value: 'All', label: 'All' },
    { value: 'Chat', label: 'Chat' },
    { value: 'Code', label: 'Code' },
    { value: 'Reasoning', label: 'Reasoning' },
    { value: 'Image', label: 'Image' },
    { value: 'Video', label: 'Video' },
    { value: 'Research', label: 'Research' },
    { value: 'Agents', label: 'Agents' }
  ];

  const view = useMemo(() => {
    const modelPool = resolvedPayload.status === 'ready'
      ? (resolvedPayload.models || [])
      : [];

    const nextView = buildLeaderboardView({
      models: modelPool,
      tools: AI_TOOLS_DATA,
      filters,
      ready: rankedModelsReady
    });

    return nextView;
  }, [filters, resolvedPayload, needsRankedModels, rankedModelsReady]);

  const lastLoggedViewRef = useRef(null);
  useEffect(() => {
    if (view.loading) return;
    const snapshot = {
      perspective: view.appliedFilters.perspective,
      entityType: view.appliedFilters.entityType,
      modality: view.appliedFilters.category,
      rowCount: view.rows.length
    };
    const prev = lastLoggedViewRef.current;
    if (
      !prev ||
      prev.perspective !== snapshot.perspective ||
      prev.entityType !== snapshot.entityType ||
      prev.modality !== snapshot.modality ||
      prev.rowCount !== snapshot.rowCount
    ) {
      logLeaderboard('ROWS_UPDATED', snapshot);
      lastLoggedViewRef.current = snapshot;
    }
  }, [view]);

  const filteredModels = view.rows;
  const entityTypeCounts = view.entityTypeCounts;
  const isLoading = view.loading;
  const isError = needsRankedModels && resolvedPayload.status === 'error';
  const lastUpdatedText = resolvedPayload.lastUpdatedText || 'DATA UPDATED JUST NOW';
  const perspectiveCounts = resolvedPayload.counts || perspectivePayload.counts;
  const tableFilters = view.appliedFilters;

  // Context-aware perspective counts aligned with active entityType (All / Models / Tools)
  const displayPerspectiveCounts = useMemo(() => {
    const openToolsCount = AI_TOOLS_DATA.filter(
      (t) => t.isOpenWeights === true || (t.license && t.license.toLowerCase().includes('open'))
    ).length;
    const totalToolsCount = AI_TOOLS_DATA.length;

    if (filters.entityType === 'models') {
      return {
        overall: perspectiveCounts.overall || 500,
        risers: perspectiveCounts.risers || 500,
        adopted: perspectiveCounts.adopted || 500,
        speed: perspectiveCounts.speed || 201,
        open_weights: perspectiveCounts.open_weights || 267
      };
    } else if (filters.entityType === 'tools') {
      return {
        overall: totalToolsCount,
        risers: totalToolsCount,
        adopted: totalToolsCount,
        speed: totalToolsCount,
        open_weights: openToolsCount
      };
    } else {
      return {
        overall: (perspectiveCounts.overall || 500) + totalToolsCount,
        risers: (perspectiveCounts.risers || 500) + totalToolsCount,
        adopted: (perspectiveCounts.adopted || 500) + totalToolsCount,
        speed: (perspectiveCounts.speed || 201) + totalToolsCount,
        open_weights: (perspectiveCounts.open_weights || 267) + openToolsCount
      };
    }
  }, [filters.entityType, perspectiveCounts]);

  // Real dynamic ecosystem stats computed from actual datasets (stable 595 tracked systems across views)
  const ecosystemStats = useMemo(() => {
    const modelsCount = perspectiveCounts.overall || 500;
    const toolsCount = AI_TOOLS_DATA.length;
    const companiesCount = COMPANIES_DATA.length;
    const totalTrackedSystems = modelsCount + toolsCount;

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
      totalTrackedSystems,
      maxSpeed,
      fastestName: fastestSystem?.name || 'Top Model',
      maxGrowth,
      topGrowthName: topGrowthSystem?.name || 'Top Mover'
    };
  }, [perspectiveCounts.overall]);

  // Live rotating hero telemetry sequence (single metric at a time)
  const HERO_METRICS = useMemo(() => [
    { value: `${ecosystemStats.totalTrackedSystems}`, label: 'TRACKED SYSTEMS', sub: 'LIVE INDEX', delta: '+8', badge: 'LIVE' },
    { value: `${ecosystemStats.modelsCount}`, label: 'MODELS', sub: 'FOUNDATION ARCHITECTURES', delta: '+5', badge: 'Q1 2025' },
    { value: `${ecosystemStats.toolsCount}`, label: 'TOOLS', sub: 'DEVELOPER APPLICATIONS', delta: '+11', badge: 'Q1 2025' },
    { value: `${ecosystemStats.companiesCount}`, label: 'AI COMPANIES', sub: 'ENTERPRISE INDEX', delta: '+12', badge: 'Q1 2025' },
    { value: `${ecosystemStats.maxSpeed ? `${ecosystemStats.maxSpeed} tok/s` : '260 tok/s'}`, label: 'PEAK THROUGHPUT', sub: ecosystemStats.fastestName || 'GROQ INFERENCE', delta: '+18%', badge: 'SPEED' },
    { value: `${ecosystemStats.maxGrowth ? `+${ecosystemStats.maxGrowth}%` : '+180%'}`, label: 'FASTEST GROWTH', sub: ecosystemStats.topGrowthName || 'MOMENTUM INDEX', delta: '▲ TOP', badge: 'TREND' }
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
      <div className="border-b border-[#1C1C1F] bg-black pt-4 pb-3.5 sm:pt-5 sm:pb-4 px-3.5 sm:px-8 relative">
        <div className="mx-auto max-w-[1440px]">
          {/* Top Eyebrow */}
          <div className="flex items-center gap-2 text-[10.5px] sm:text-[11px] font-mono tracking-wider uppercase text-[#71717A] mb-2 sm:mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0" />
            <span className="text-[#E4E4E7] font-semibold">LIVE BENCHMARK INDEX</span>
            <span className="text-[#3F3F46]">·</span>
            <span className="text-[#71717A]">INDEPENDENT EVALUATION INDEX</span>
          </div>

          {/* Main Headline (Left) & Single Live Rotating Metric (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center mb-3.5 sm:mb-4.5">
            {/* Left Column: Headline & Description */}
            <div className="lg:col-span-8">
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-white leading-tight whitespace-nowrap mb-1.5">
                AI Ecosystem Leaderboard
              </h1>
              <p className="text-xs sm:text-sm text-[#A1A1AA] leading-snug font-normal whitespace-nowrap overflow-hidden text-ellipsis">
                Compare the models, tools, and companies shaping the AI ecosystem. Track real-world evaluation benchmarks, Chatbot Arena Elo scores, and enterprise pricing at scale.
              </p>
            </div>


            {/* Right Column: Rotating Metric Card — matches Image 2 design */}
            <div className="lg:col-span-4 flex lg:justify-end">
              <div className="w-full lg:w-auto lg:min-w-[270px] border border-[#2D2D38] rounded-xl bg-[#0D0D12] px-5 py-4 flex flex-col gap-2.5 shadow-xl">
                {/* Header row — label + badge animate with the metric */}
                <div
                  className={`flex items-center justify-between transition-all duration-300 ease-out transform ${
                    isMetricTransitioning ? 'opacity-0 -translate-y-1' : 'opacity-100 translate-y-0'
                  }`}
                >
                  <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase text-white font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#6E56CF] shrink-0" />
                    <span>{currentMetric.label}</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-[#A78BFA] bg-[#6E56CF]/20 border border-[#6E56CF]/50 rounded px-2 py-0.5 shadow-sm">
                    {currentMetric.badge}
                  </span>
                </div>

                {/* Big number + delta */}
                <div
                  className={`transition-all duration-300 ease-out transform ${
                    isMetricTransitioning
                      ? 'opacity-0 translate-x-4'
                      : 'opacity-100 translate-x-0'
                  }`}
                >
                  <div className="flex items-end gap-2.5">
                    <div className="text-5xl sm:text-6xl font-extrabold font-mono text-white tracking-tight leading-none">
                      {currentMetric.value}
                    </div>
                    <div className="flex flex-col gap-0.5 mb-1">
                      <span className="text-[13px] font-extrabold font-mono text-[#10B981] leading-none">▲{currentMetric.delta}</span>
                      <span className="text-[11px] font-mono text-[#D4D4D8] font-bold leading-none">vs last</span>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-[4px] w-full rounded-full bg-[#1C1C24] overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-[#6E56CF] via-[#A78BFA] to-[#10B981] rounded-full" />
                </div>

                {/* Footer row — sub label + "LOAD AUDITED" */}
                <div
                  className={`flex items-center justify-between transition-all duration-300 ease-out transform ${
                    isMetricTransitioning ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'
                  }`}
                >
                  <span className="text-[11px] font-mono tracking-widest uppercase text-[#E4E4E7] font-bold">
                    {currentMetric.sub}
                  </span>
                  <span className="text-[10px] font-mono text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded border border-[#10B981]/35 font-extrabold uppercase tracking-widest shadow-sm">
                    LOAD AUDITED
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Switcher: Models vs Companies + Technical Status */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#1C1C1F]">
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
                  {ecosystemStats.totalTrackedSystems}
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

            <div className="text-[11px] sm:text-[12px] font-mono tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse shrink-0" />
              <span className="text-[#10B981] font-bold">{lastUpdatedText || 'DATA UPDATED JUST NOW'}</span>
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
              activePerspective={filters.perspective}
              onSelectPerspective={(id) => updateFilters({ perspective: id })}
              perspectiveCounts={displayPerspectiveCounts}
              onOpenMethodology={() => setIsMethodologyOpen(true)}
            />

        {/* 2. Sub-Filter & Controls Bar: Entity Type, Categories, Sort, Compare, Clear */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8">
          {/* Left: Entity Type Toggle & Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
            {/* Entity Type Toggle (All / AI Models / AI Tools) */}
            <div className="inline-flex items-center p-0.5 rounded-full bg-[#141418] border border-[#2E2E38] shrink-0">
              <button
                onClick={() => updateFilters({ entityType: 'all' })}
                className={`px-3.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                  filters.entityType === 'all'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-[#E4E4E7] hover:text-white hover:bg-[#1F1F28]'
                }`}
              >
                All ({isLoading ? '—' : entityTypeCounts.all})
              </button>
              <button
                onClick={() => updateFilters({ entityType: 'models' })}
                className={`px-3.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                  filters.entityType === 'models'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-[#E4E4E7] hover:text-white hover:bg-[#1F1F28]'
                }`}
              >
                Models ({isLoading ? '—' : entityTypeCounts.models})
              </button>
              <button
                onClick={() => updateFilters({ entityType: 'tools' })}
                className={`px-3.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                  filters.entityType === 'tools'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-[#E4E4E7] hover:text-white hover:bg-[#1F1F28]'
                }`}
              >
                Tools ({isLoading ? '—' : entityTypeCounts.tools})
              </button>
            </div>

            {/* Thin vertical divider between Entity Type and Category Pills */}
            <div className="h-4 w-[1px] bg-[#3F3F4C] mx-1 shrink-0" aria-hidden="true" />

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 shrink-0">
              {PRIMARY_CATEGORIES.map((cat) => {
                const isSelected = filters.category === cat.value;
                return (
                  <button
                    key={cat.value}
                    onClick={() => updateFilters({ category: cat.value })}
                    className={`rounded-full px-3.5 py-1 text-[11px] font-bold whitespace-nowrap transition-all duration-200 border cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-white text-black border-white shadow-sm'
                        : 'text-[#E4E4E7] hover:text-white bg-[#16161B] border-[#2A2A33] hover:border-white/50 shadow-sm'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Sort + Compare + Clear */}
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            <div className="relative inline-flex items-center">
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilters({ sortBy: e.target.value })}
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
              title={hasActiveFilters ? "Reset all filter criteria" : "No active filters to reset"}
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
            <RotateCcw size={36} className="text-[#71717A] mx-auto mb-3 opacity-50" />
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
                    <AdaptiveTableHeaders category={tableFilters.category} entityType={tableFilters.entityType} />
                  </thead>
                  <tbody className="divide-y divide-[#1F1F24] text-[#E4E4E7]">
                    {filteredModels.map((model) => {
                      const isCompared = selectedForCompare.some((m) => m.id === model.id);
                      const isTool = model.entityType === 'tool';
                      const displayRank = model.displayRank || model.rank;

                      return (
                        <tr
                          key={model.id}
                          className={`transition-colors group cursor-pointer ${
                            displayRank === 1
                              ? 'hover:bg-[#1a1710]'
                              : displayRank === 2
                              ? 'hover:bg-[#18181e]'
                              : displayRank === 3
                              ? 'hover:bg-[#181512]'
                              : 'hover:bg-[#181820]'
                          }`}
                          onClick={() => navigate(`/leaderboard/${model.slug}`)}
                        >
                          {/* Rank badge with Delta & Tapered Stripe */}
                          <td 
                            className={`py-2.5 px-3.5 text-center transition-colors relative ${getMedalStripeClass(displayRank)}`} 
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex flex-col items-center">
                              <span
                                className={`inline-flex items-center justify-center w-7 h-7 rounded-xl font-bold font-mono text-xs ${
                                  displayRank === 1
                                    ? 'bg-gradient-to-br from-[#F5A623] via-[#FBBF24] to-[#D97706] text-black font-extrabold shadow-md shadow-[#F5A623]/30 border border-[#FCD34D]/60'
                                    : displayRank === 2
                                    ? 'bg-gradient-to-br from-[#FFFFFF] via-[#E2E8F0] to-[#94A3B8] text-[#0F172A] font-extrabold shadow-md shadow-white/25 border border-white/80 ring-1 ring-white/30'
                                    : displayRank === 3
                                    ? 'bg-gradient-to-br from-[#FDBA74] via-[#EA580C] to-[#9A3412] text-white font-extrabold shadow-md shadow-[#EA580C]/35 border border-[#FDBA74]/60 ring-1 ring-[#EA580C]/30'
                                    : 'text-[#A1A1AA] bg-[#16161c] border border-[#232328]'
                                }`}
                              >
                                #{displayRank}
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
                                {isTool && tableFilters.entityType !== 'tools' && model.categoryMetricValue && (
                                  <span className="text-[10px] text-[#A1A1AA] font-mono bg-[#181820] px-1.5 py-0.5 rounded border border-[#272730]">
                                    {model.categoryMetricLabel ? `${model.categoryMetricLabel}: ` : ''}{model.categoryMetricValue}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Metric 1 (Arena Elo / Tool Rating) */}
                          <td className="py-2.5 px-3.5 font-mono font-bold text-white text-[13px]">
                            {tableFilters.entityType === 'tools' ? (
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
                            {tableFilters.entityType === 'tools' ? (
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
                            {tableFilters.entityType === 'tools' ? (
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
              {filteredModels.map((model) => {
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
