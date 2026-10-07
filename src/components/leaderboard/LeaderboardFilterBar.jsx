import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Search, 
  X, 
  RotateCcw, 
  ChevronDown, 
  ShieldCheck, 
  Building2, 
  Lock, 
  Globe, 
  Cpu, 
  SlidersHorizontal,
  Check,
  Sparkles,
  GitCompare
} from 'lucide-react';
import { SORT_OPTIONS } from '../../data/leaderboardData';

export const ADAPTIVE_CATEGORIES = {
  models: [
    { value: 'All', label: 'All Categories' },
    { value: 'Chat', label: 'Chat / LLM' },
    { value: 'Code', label: 'Code & Dev' },
    { value: 'Reasoning', label: 'Reasoning' },
    { value: 'Image', label: 'Image' },
    { value: 'Video', label: 'Video' },
    { value: 'Research', label: 'Research' }
  ],
  agents: [
    { value: 'All', label: 'All Categories' },
    { value: 'Coding', label: 'Coding & SWE' },
    { value: 'DevOps & Cloud', label: 'DevOps & Cloud' },
    { value: 'Browser & Workflow', label: 'Browser & Workflow' },
    { value: 'Multi-Agent', label: 'Multi-Agent' },
    { value: 'Enterprise & Productivity', label: 'Enterprise Automation' }
  ],
  mcp: [
    { value: 'All', label: 'All Categories' },
    { value: 'Databases & Storage', label: 'Databases & Storage' },
    { value: 'DevOps & Cloud', label: 'DevOps & Cloud' },
    { value: 'Productivity & Workspace', label: 'Productivity' },
    { value: 'Code & IDE', label: 'Developer Tools' },
    { value: 'Communication', label: 'Communication' }
  ],
  tools: [
    { value: 'All', label: 'All Categories' },
    { value: 'Code & IDE', label: 'Code & IDE' },
    { value: 'Search & Knowledge', label: 'Search & Knowledge' },
    { value: 'Vision & Design', label: 'Vision & Design' },
    { value: 'Audio & Speech', label: 'Audio & Speech' },
    { value: 'Productivity & Workspace', label: 'Productivity' }
  ],
  companies: [
    { value: 'All', label: 'All Categories' },
    { value: 'Foundation Models', label: 'Foundation Models' },
    { value: 'AI Infrastructure', label: 'AI Infrastructure' },
    { value: 'AI Code & DevTools', label: 'AI Code & DevTools' },
    { value: 'AI Search & Assistants', label: 'AI Search & Assistants' },
    { value: 'Voice & Multimodal', label: 'Voice & Multimodal' },
    { value: 'Enterprise & Productivity', label: 'Enterprise & Productivity' },
    { value: 'Creative & Video AI', label: 'Creative & Video AI' }
  ],
  all: [
    { value: 'All', label: 'All Categories' },
    { value: 'Chat', label: 'Chat & Reasoning' },
    { value: 'Code', label: 'Code & Dev' },
    { value: 'Agents', label: 'Agents' },
    { value: 'Image', label: 'Vision & Creative' },
    { value: 'Databases & Storage', label: 'MCP & Protocols' }
  ]
};

export const CURATED_PROVIDERS = [
  'OpenAI',
  'Anthropic',
  'Google',
  'Google DeepMind',
  'Meta',
  'DeepSeek',
  'Mistral',
  'Microsoft Research',
  'Alibaba (Qwen)',
  'xAI',
  'Cohere',
  'Allen Institute',
  'MIT CSAIL',
  'UC Berkeley SkyLab'
];

export const ACCESS_FILTER_OPTIONS = [
  { value: 'all', label: 'All Access' },
  { value: 'open_weights', label: 'Open Weights' },
  { value: 'api', label: 'API Deployable' },
  { value: 'proprietary', label: 'Proprietary' }
];

export default function LeaderboardFilterBar({
  filters,
  updateFilters,
  onClearFilters,
  totalMatched = 0,
  totalInDomain = 500,
  facetCounts = {},
  activeEntityType = 'models',
  selectedForCompareCount = 0,
  onOpenCompare
}) {
  const [isProviderOpen, setIsProviderOpen] = useState(false);
  const [providerSearch, setProviderSearch] = useState('');
  const providerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close provider dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (providerRef.current && !providerRef.current.contains(event.target)) {
        setIsProviderOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === '/' && document.activeElement !== searchInputRef.current && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const categories = useMemo(() => {
    return ADAPTIVE_CATEGORIES[activeEntityType] || ADAPTIVE_CATEGORIES.models;
  }, [activeEntityType]);

  const filteredProviders = useMemo(() => {
    if (!providerSearch.trim()) return CURATED_PROVIDERS;
    const q = providerSearch.toLowerCase().trim();
    return CURATED_PROVIDERS.filter((p) => p.toLowerCase().includes(q));
  }, [providerSearch]);

  const isAccessApplicable = activeEntityType !== 'companies';

  const hasActiveFilters = 
    Boolean(filters.searchQuery) ||
    filters.category !== 'All' ||
    (isAccessApplicable && filters.accessFilter !== 'all') ||
    filters.verificationFilter === 'verified_only' ||
    filters.providerFilter !== 'all' ||
    filters.sortBy !== 'rank';

  const placeholderText = useMemo(() => {
    switch (activeEntityType) {
      case 'agents': return 'Search 500 AI Agents by framework, benchmarks, org... (Press /)';
      case 'mcp': return 'Search 500 MCP Servers by protocol, tool, stack... (Press /)';
      case 'tools': return 'Search 500 AI Tools by use case, features, creator... (Press /)';
      case 'companies': return 'Search AI Companies by enterprise, valuation, sector... (Press /)';
      case 'all': return 'Search 2,175 verified ecosystem systems... (Press /)';
      default: return 'Search 500 AI Models by name, provider, modality... (Press /)';
    }
  }, [activeEntityType]);

  const accessCounts = facetCounts?.accessCounts || {};
  const verificationCounts = facetCounts?.verificationCounts || {};

  return (
    <div className="space-y-3.5 mb-6 sm:mb-8">
      {/* 1. Main Controls Bar: Search & Primary Facets */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
        {/* Left: Instant Search Input */}
        <div className="relative flex-1 min-w-[280px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A] pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={filters.searchQuery || ''}
            onChange={(e) => updateFilters({ searchQuery: e.target.value })}
            placeholder={placeholderText}
            className="w-full rounded-xl border border-[#2D2D38] bg-[#121217] pl-9 pr-14 text-[13px] text-white placeholder:text-[#71717A] hover:border-[#3E3E4D] focus:border-[#6E56CF] focus:outline-none transition-all h-9.5 shadow-sm"
          />
          {filters.searchQuery ? (
            <button
              onClick={() => updateFilters({ searchQuery: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-white p-1"
              title="Clear search"
            >
              <X size={13} />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#52525B] bg-[#1B1B22] border border-[#272732] px-1.5 py-0.5 rounded">
              /
            </kbd>
          )}
        </div>

        {/* Right: Facet Selectors & Sort Dropdown */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-end shrink-0">
          {/* Provider / Organization Filter Popover */}
          <div className="relative" ref={providerRef}>
            <button
              onClick={() => setIsProviderOpen(!isProviderOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[12px] font-medium transition-all h-9.5 cursor-pointer ${
                filters.providerFilter !== 'all'
                  ? 'bg-[#6E56CF]/15 text-[#A78BFA] border-[#6E56CF]/40 font-semibold'
                  : 'bg-[#141418] text-[#D4D4D8] border-[#2A2A33] hover:border-[#3E3E4D]'
              }`}
            >
              <Building2 size={13} className={filters.providerFilter !== 'all' ? 'text-[#A78BFA]' : 'text-[#71717A]'} />
              <span className="max-w-[110px] truncate">
                {filters.providerFilter !== 'all' ? filters.providerFilter : 'Provider'}
              </span>
              <ChevronDown size={12} className="text-[#71717A]" />
            </button>

            {isProviderOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-64 bg-[#141419] border border-[#2C2C36] rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-1">
                <div className="relative mb-2">
                  <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#71717A]" />
                  <input
                    type="text"
                    value={providerSearch}
                    onChange={(e) => setProviderSearch(e.target.value)}
                    placeholder="Search providers..."
                    className="w-full rounded-lg bg-[#0E0E12] border border-[#23232C] pl-7 pr-2 py-1 text-[11px] text-white placeholder:text-[#52525B] focus:border-[#6E56CF] focus:outline-none"
                    autoFocus
                  />
                </div>

                <div className="max-h-56 overflow-y-auto space-y-0.5 scrollbar-thin">
                  <button
                    onClick={() => {
                      updateFilters({ providerFilter: 'all' });
                      setIsProviderOpen(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between cursor-pointer ${
                      filters.providerFilter === 'all'
                        ? 'bg-[#6E56CF]/20 text-white font-semibold'
                        : 'text-[#A1A1AA] hover:bg-[#1C1C24] hover:text-white'
                    }`}
                  >
                    <span>All Providers</span>
                    {filters.providerFilter === 'all' && <Check size={12} className="text-[#A78BFA]" />}
                  </button>

                  {filteredProviders.map((prov) => {
                    const isSelected = filters.providerFilter.toLowerCase() === prov.toLowerCase();
                    return (
                      <button
                        key={prov}
                        onClick={() => {
                          updateFilters({ providerFilter: prov });
                          setIsProviderOpen(false);
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-[#6E56CF]/20 text-white font-semibold'
                            : 'text-[#A1A1AA] hover:bg-[#1C1C24] hover:text-white'
                        }`}
                      >
                        <span className="truncate">{prov}</span>
                        {isSelected && <Check size={12} className="text-[#A78BFA]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Access Filter (Entity-Aware) */}
          {isAccessApplicable && (
            <div className="relative inline-flex items-center">
              <select
                id="filter-access-select"
                name="accessFilter"
                value={filters.accessFilter}
                onChange={(e) => updateFilters({ accessFilter: e.target.value })}
                className={`appearance-none rounded-xl border pl-3 pr-7 py-1 text-[12px] font-medium transition-all cursor-pointer h-9.5 ${
                  filters.accessFilter !== 'all'
                    ? 'bg-[#6E56CF]/15 text-[#A78BFA] border-[#6E56CF]/40 font-semibold'
                    : 'bg-[#141418] text-[#D4D4D8] border-[#2A2A33] hover:border-[#3E3E4D]'
                }`}
              >
                {ACCESS_FILTER_OPTIONS.map((opt) => {
                  const count = opt.value === 'all' ? accessCounts.all : accessCounts[opt.value];
                  const labelWithCount = typeof count === 'number' ? `${opt.label} (${count})` : opt.label;
                  return (
                    <option key={opt.value} value={opt.value} className="bg-[#141419] text-white">
                      {labelWithCount}
                    </option>
                  );
                })}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71717A] pointer-events-none" />
            </div>
          )}

          {/* Verification Shield Toggle */}
          <button
            onClick={() => updateFilters({
              verificationFilter: filters.verificationFilter === 'verified_only' ? 'all' : 'verified_only'
            })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[12px] font-medium transition-all h-9.5 cursor-pointer ${
              filters.verificationFilter === 'verified_only'
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/35 font-semibold shadow-sm'
                : 'bg-[#141418] text-[#A1A1AA] border-[#2A2A33] hover:text-white hover:border-[#3E3E4D]'
            }`}
            title="Show only independently benchmarked & registry-verified systems"
          >
            <ShieldCheck size={14} className={filters.verificationFilter === 'verified_only' ? 'text-emerald-400' : 'text-[#71717A]'} />
            <span className="hidden sm:inline">Verified Only</span>
            <span className="sm:hidden">Verified</span>
            {typeof verificationCounts.verified_only === 'number' && filters.verificationFilter === 'verified_only' && (
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded">
                {verificationCounts.verified_only}
              </span>
            )}
          </button>

          {/* Compare Trigger Button */}
          {selectedForCompareCount > 0 && (
            <button
              onClick={onOpenCompare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#22222a] hover:bg-[#2b2b35] border border-[#383844] rounded-xl transition-all shadow-sm h-9.5 cursor-pointer active:scale-95 shrink-0"
            >
              <GitCompare size={13} className="text-white" />
              <span>Compare ({selectedForCompareCount})</span>
            </button>
          )}

          {/* Sort Dropdown */}
          <div className="relative inline-flex items-center">
            <select
              id="leaderboard-sort-select"
              name="sortBy"
              value={filters.sortBy}
              onChange={(e) => updateFilters({ sortBy: e.target.value })}
              className="appearance-none rounded-xl border border-[#2A2A33] bg-[#141418] pl-3 pr-7 py-1 text-[12px] font-medium text-white hover:border-[#3E3E4D] focus:outline-none focus:border-[#6E56CF] transition-all cursor-pointer h-9.5"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#141419] text-white">
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71717A] pointer-events-none" />
          </div>

          {/* Reset Filters Shortcut */}
          <button
            onClick={onClearFilters}
            disabled={!hasActiveFilters}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-xl border h-9.5 transition-all shrink-0 ${
              hasActiveFilters
                ? 'text-white bg-[#1f1f26] border-[#383842] hover:bg-[#272732] cursor-pointer shadow-sm'
                : 'text-[#52525B] bg-[#141418] border-[#232328] cursor-not-allowed opacity-50'
            }`}
            title={hasActiveFilters ? 'Reset all filter criteria' : 'No active filters to reset'}
          >
            <RotateCcw size={12} className={hasActiveFilters ? 'text-white' : 'text-[#52525B]'} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* 2. Adaptive Category Pills (Horizontally Scrollable) */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5 -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
        {categories.map((cat) => {
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

      {/* 3. Active Filter Chips & Match Telemetry */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between gap-2 pt-1 text-[11.5px] border-t border-[#1C1C22]">
          {/* Active Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[#71717A] text-[11px] font-mono mr-1">Active:</span>

            {filters.searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#6E56CF]/15 text-[#A78BFA] border border-[#6E56CF]/30 font-medium">
                q: "{filters.searchQuery}"
                <button onClick={() => updateFilters({ searchQuery: '' })} className="hover:text-white cursor-pointer">
                  <X size={11} />
                </button>
              </span>
            )}

            {filters.category !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-zinc-800 text-zinc-200 border border-zinc-700 font-medium">
                {filters.category}
                <button onClick={() => updateFilters({ category: 'All' })} className="hover:text-white cursor-pointer">
                  <X size={11} />
                </button>
              </span>
            )}

            {isAccessApplicable && filters.accessFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-zinc-800 text-zinc-200 border border-zinc-700 font-medium capitalize">
                Access: {filters.accessFilter.replace('_', ' ')}
                <button onClick={() => updateFilters({ accessFilter: 'all' })} className="hover:text-white cursor-pointer">
                  <X size={11} />
                </button>
              </span>
            )}

            {filters.verificationFilter === 'verified_only' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-medium">
                Verified Provenance
                <button onClick={() => updateFilters({ verificationFilter: 'all' })} className="hover:text-white cursor-pointer">
                  <X size={11} />
                </button>
              </span>
            )}

            {filters.providerFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-zinc-800 text-zinc-200 border border-zinc-700 font-medium">
                Provider: {filters.providerFilter}
                <button onClick={() => updateFilters({ providerFilter: 'all' })} className="hover:text-white cursor-pointer">
                  <X size={11} />
                </button>
              </span>
            )}

            <button
              onClick={onClearFilters}
              className="text-[#A78BFA] hover:text-white text-[11px] underline ml-1 cursor-pointer"
            >
              Clear all
            </button>
          </div>

          {/* Result Count Badge */}
          <div className="text-[11px] font-mono text-[#71717A] shrink-0">
            Showing <strong className="text-white font-semibold">{totalMatched}</strong> of {totalInDomain}
          </div>
        </div>
      )}
    </div>
  );
}
