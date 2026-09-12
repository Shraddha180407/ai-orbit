import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SuperpowerBadge from './SuperpowerBadge';
import { ChevronDown, ChevronUp, ExternalLink, Zap, ArrowRight, TrendingUp } from 'lucide-react';

export default function MobileLeaderboardCard({
  model,
  isCompared = false,
  onToggleCompare
}) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  // Render rank delta pill
  const renderRankDelta = () => {
    if (model.rankDelta === 'NEW') {
      return (
        <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
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

  const parsedGrowth = parseFloat((model.growth || '').replace(/[^0-9.-]/g, '')) || 0;

  return (
    <div
      onClick={() => navigate(`/leaderboard/${model.slug}`)}
      className="p-4 rounded-2xl border border-[#232326] bg-[#111115] hover:border-[#3b3b44] transition-all cursor-pointer text-white"
    >
      {/* Top Header: Rank + Delta, Name, Primary Metric */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex flex-col items-center shrink-0">
            <span
              className={`inline-flex items-center justify-center w-7 h-7 rounded-xl font-bold font-mono text-xs ${
                model.rank === 1
                  ? 'bg-gradient-to-br from-[#F5A623] via-[#FBBF24] to-[#D97706] text-black font-extrabold shadow-md shadow-[#F5A623]/30 border border-[#FCD34D]/60'
                  : model.rank === 2
                  ? 'bg-gradient-to-br from-[#FFFFFF] via-[#E2E8F0] to-[#94A3B8] text-[#0F172A] font-extrabold shadow-md shadow-white/25 border border-white/80 ring-1 ring-white/30'
                  : model.rank === 3
                  ? 'bg-gradient-to-br from-[#FDBA74] via-[#EA580C] to-[#9A3412] text-white font-extrabold shadow-md shadow-[#EA580C]/35 border border-[#FDBA74]/60 ring-1 ring-[#EA580C]/30'
                  : 'text-[#A1A1AA] bg-[#1a1a20] border border-[#27272e]'
              }`}
            >
              #{model.rank}
            </span>
            <div className="mt-1">{renderRankDelta()}</div>
          </div>

          <div className="min-w-0">
            <h4 className="font-bold text-sm text-white truncate group-hover:text-[#A78BFA] transition-colors">
              {model.name}
            </h4>
            <span className="text-[11px] text-[#71717A] font-mono block">
              {model.org} • {model.category}
            </span>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="flex items-center justify-end gap-1">
            <span className="text-sm font-mono font-bold text-white block">
              {model.categoryMetricValue || (model.arenaElo ? `${model.arenaElo} Elo` : model.price.split('/')[0])}
            </span>
            {parsedGrowth > 25 && (
              <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono">
                ▲{model.growth}
              </span>
            )}
          </div>
          <span className="text-[10px] font-mono text-[#10B981] block">
            {model.eloChange ? `${model.eloChange} this wk` : 'Rank stable'}
          </span>
        </div>
      </div>

      {/* Superpower Badge Row */}
      {(model.superpowerShort || model.superpower) && (
        <div className="mb-2.5">
          <SuperpowerBadge
            superpower={model.superpowerShort || model.superpower}
            category={model.category}
            compact={true}
          />
        </div>
      )}

      {/* 3 Core Glanceable Metrics Grid */}
      <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-[#171720] border border-[#272733] mb-3 text-center">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#71717A] block font-semibold">
            {model.categorySubMetricLabel || (model.entityType === 'tool' ? 'Benchmark' : 'Coding SWE')}
          </span>
          <span className="text-xs font-mono font-bold text-white truncate block">
            {model.categorySubMetricValue || model.codingScore || model.mmluPro || 'N/A'}
          </span>
        </div>

        <div className="border-x border-[#272733]">
          <span className="text-[10px] uppercase tracking-wider text-[#71717A] block font-semibold">
            Speed
          </span>
          <span className="text-xs font-mono font-bold text-[#A1A1AA] truncate block">
            {model.outputSpeed || 'API'}
          </span>
        </div>

        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#71717A] block font-semibold">
            Cost
          </span>
          <span className="text-xs font-mono font-semibold text-[#E4E4E7] truncate block">
            {model.price ? model.price.split('/')[0] : 'N/A'}
          </span>
        </div>
      </div>

      {/* Expandable Accordion for full technical specifications with smooth transition */}
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isExpanded ? 'max-h-96 opacity-100 mb-3' : 'max-h-0 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pt-2 pb-1 border-t border-[#1F1F24] space-y-2 text-xs">
          <p className="text-[#A1A1AA] text-xs leading-relaxed">
            {model.shortDescription}
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
            <div className="p-2 rounded-lg bg-[#18181f] border border-[#23232a]">
              <span className="text-[#71717A] block text-[10px]">Context Window</span>
              <span className="text-white font-semibold">{model.contextWindow || 'N/A'}</span>
            </div>
            <div className="p-2 rounded-lg bg-[#18181f] border border-[#23232a]">
              <span className="text-[#71717A] block text-[10px]">License</span>
              <span className="text-white font-semibold">{model.licenseType || model.license || 'Proprietary'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Row */}
      <div
        className="flex items-center justify-between pt-2.5 border-t border-[#1F1F24]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="flex items-center gap-1 text-xs text-[#71717A] hover:text-white transition-colors cursor-pointer"
        >
          <span>{isExpanded ? 'Less' : 'More specs'}</span>
          {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleCompare(model)}
            className={`text-xs px-2.5 py-1 rounded-xl border font-semibold transition-all cursor-pointer ${
              isCompared
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                : 'bg-[#18181c] text-[#A1A1AA] border-[#27272e] hover:text-white'
            }`}
          >
            {isCompared ? '✓ Added' : '+ Compare'}
          </button>

          <Link
            to={`/leaderboard/${model.slug}`}
            className="text-xs px-3 py-1 rounded-xl bg-white text-black font-semibold hover:bg-[#E4E4E7] transition-all flex items-center gap-1"
          >
            <span>Details</span>
            <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </div>
  );
}
