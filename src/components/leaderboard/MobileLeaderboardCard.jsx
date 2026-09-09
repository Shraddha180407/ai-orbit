import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SuperpowerBadge from './SuperpowerBadge';
import { ChevronDown, ChevronUp, ExternalLink, Zap, ArrowRight } from 'lucide-react';

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

  return (
    <div
      onClick={() => navigate(`/leaderboard/${model.slug}`)}
      className="p-4 rounded-2xl border border-[#232326] bg-[#111115] hover:border-[#3b3b44] transition-all cursor-pointer text-white"
    >
      {/* Top Header: Rank + Delta, Name, Elo */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex flex-col items-center shrink-0">
            <span
              className={`inline-flex items-center justify-center w-7 h-7 rounded-xl font-bold font-mono text-xs ${
                model.rank === 1
                  ? 'bg-[#F5A623] text-black shadow-md shadow-[#F5A623]/25'
                  : model.rank === 2
                  ? 'bg-[#E4E4E7] text-black'
                  : model.rank === 3
                  ? 'bg-[#CD7F32] text-black'
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
          <span className="text-sm font-mono font-bold text-white block">
            {model.categoryMetricValue || `${model.arenaElo} Elo`}
          </span>
          <span className="text-[10px] font-mono text-[#10B981]">
            {model.eloChange} this wk
          </span>
        </div>
      </div>

      {/* Superpower Badge Row */}
      {model.superpower && (
        <div className="mb-3">
          <SuperpowerBadge
            superpower={model.superpower}
            category={model.category}
            detail={model.superpowerDetail}
            compact={false}
          />
        </div>
      )}

      {/* 3 Core Glanceable Metrics Grid */}
      <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-[#16161c] border border-[#232328] mb-3 text-center">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#71717A] block font-semibold">
            {model.categorySubMetricLabel || 'Coding SWE'}
          </span>
          <span className="text-xs font-mono font-bold text-white">
            {model.categorySubMetricValue || model.codingScore || 'N/A'}
          </span>
        </div>

        <div className="border-x border-[#232328]">
          <span className="text-[10px] uppercase tracking-wider text-[#71717A] block font-semibold">
            Speed
          </span>
          <span className="text-xs font-mono font-bold text-[#A1A1AA]">
            {model.outputSpeed}
          </span>
        </div>

        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#71717A] block font-semibold">
            Cost
          </span>
          <span className="text-xs font-mono font-semibold text-[#E4E4E7] truncate block">
            {model.price.split('/')[0]}
          </span>
        </div>
      </div>

      {/* Expandable Accordion for full technical specifications */}
      {isExpanded && (
        <div
          className="pt-3 pb-1 border-t border-[#1F1F24] space-y-2 text-xs"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-[#A1A1AA] text-xs leading-relaxed">
            {model.shortDescription}
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
            <div className="p-2 rounded-lg bg-[#18181f] border border-[#23232a]">
              <span className="text-[#71717A] block text-[10px]">Context Window</span>
              <span className="text-white font-semibold">{model.contextWindow}</span>
            </div>
            <div className="p-2 rounded-lg bg-[#18181f] border border-[#23232a]">
              <span className="text-[#71717A] block text-[10px]">License</span>
              <span className="text-white font-semibold">{model.licenseType || model.license}</span>
            </div>
          </div>
        </div>
      )}

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
                ? 'bg-[#6E56CF] text-white border-[#6E56CF]'
                : 'bg-[#18181c] text-[#A1A1AA] border-[#27272e] hover:text-white'
            }`}
          >
            {isCompared ? 'Added' : '+ Compare'}
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
