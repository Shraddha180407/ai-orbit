import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Bookmark, 
  GitCompare, 
  Eye, 
  ArrowUpRight, 
  Weight, 
  Battery, 
  Layers, 
  Cpu, 
  ShieldCheck,
  Star,
  Zap
} from 'lucide-react';

export default function RobotCardList({ 
  robot, 
  isBookmarked, 
  onToggleBookmark, 
  isSelectedForCompare, 
  onToggleCompare, 
  onQuickView,
  onOpenInquiry
}) {
  const getStatusBadge = (status, variant) => {
    switch (variant) {
      case 'emerald':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
            {status}
          </span>
        );
      case 'amber':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#F5A623]/15 text-[#FBBF24] border border-[#F5A623]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623]"></span>
            {status}
          </span>
        );
      case 'orbit-purple':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#6E56CF]/20 text-[#C4B5FD] border border-[#6E56CF]/40">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6E56CF]"></span>
            {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#00E5FF]/15 text-[#67E8F9] border border-[#00E5FF]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]"></span>
            {status}
          </span>
        );
    }
  };

  return (
    <div className="group relative flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl border border-[#232326] bg-[#131316] hover:border-[#3b3b44] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#6E56CF]/5">
      {/* Left: Thumbnail & Info */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#0A0A0D] shrink-0 border border-[#232326]">
          <img
            src={robot.media.primaryImage}
            alt={robot.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
              {robot.manufacturer}
            </span>
            <span className="text-[#3F3F46]">•</span>
            {getStatusBadge(robot.status, robot.statusVariant)}
            <span className="hidden sm:inline text-[#3F3F46]">•</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-[#71717A]">
              <Star size={11} className="text-[#F5A623] fill-[#F5A623]" /> {robot.rating}
            </span>
          </div>

          <Link to={`/robots/${robot.slug}`} className="block">
            <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#A78BFA] transition-colors truncate">
              {robot.name}
            </h3>
          </Link>
          <p className="text-[12px] text-[#A1A1AA] line-clamp-1 mt-0">
            {robot.tagLine}
          </p>

          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {robot.capabilities.slice(0, 3).map((cap, i) => (
              <span key={i} className="text-[10px] font-medium text-[#71717A] bg-[#1a1a20] px-2 py-0.5 rounded border border-[#27272e]">
                {cap}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Center: Key Specs Columns */}
      <div className="hidden lg:grid grid-cols-3 gap-6 px-4 border-x border-[#1F1F24] shrink-0 text-center">
        <div>
          <span className="text-[10px] uppercase font-semibold text-[#71717A] block">Payload</span>
          <span className="text-[13px] font-bold text-white font-mono mt-0.5 block truncate">
            {robot.specs.payload.split(' ')[0]} {robot.specs.payload.split(' ')[1]}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-semibold text-[#71717A] block">Battery</span>
          <span className="text-[13px] font-bold text-white font-mono mt-0.5 block truncate">
            {robot.specs.runTime.split(' ')[0]} {robot.specs.runTime.split(' ')[1]}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-semibold text-[#71717A] block">Degrees of Freedom</span>
          <span className="text-[13px] font-bold text-white font-mono mt-0.5 block truncate">
            {robot.specs.dof.split(' ')[0]}
          </span>
        </div>
      </div>

      {/* Right: Pricing & Actions */}
      <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#1C1C1F]">
        <div className="flex flex-col text-left md:text-right">
          <span className="text-[10px] uppercase tracking-wider text-[#71717A] font-semibold">Pricing</span>
          <span className="text-[14px] font-bold text-white font-mono">
            {robot.pricing.startingPrice}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Quick view button */}
          <button
            onClick={() => onQuickView(robot)}
            className="w-8 h-8 rounded-lg border border-[#232326] bg-[#1a1a20] flex items-center justify-center text-[#A1A1AA] hover:text-white hover:border-[#3a3a40] transition-all cursor-pointer"
            title="Quick view"
          >
            <Eye size={14} />
          </button>

          {/* Bookmark */}
          <button
            onClick={() => onToggleBookmark(robot.id)}
            className={`w-8 h-8 rounded-lg border border-[#232326] bg-[#1a1a20] flex items-center justify-center transition-all cursor-pointer ${
              isBookmarked ? 'text-[#A78BFA] border-[#6E56CF]/40' : 'text-[#A1A1AA] hover:text-white'
            }`}
            title="Bookmark"
          >
            <Bookmark size={14} className={isBookmarked ? "fill-[#A78BFA]" : ""} />
          </button>

          {/* Compare toggle */}
          <button
            onClick={() => onToggleCompare(robot)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              isSelectedForCompare
                ? 'bg-[#6E56CF] text-white border-[#6E56CF]'
                : 'bg-[#18181c] text-[#A1A1AA] border-[#27272e] hover:text-white hover:border-[#3f3f46]'
            }`}
          >
            <GitCompare size={12} />
            <span className="hidden sm:inline">{isSelectedForCompare ? 'Added' : 'Compare'}</span>
          </button>

          {/* Details Link */}
          <Link
            to={`/robots/${robot.slug}`}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white text-black hover:bg-[#E4E4E7] active:scale-95 transition-all"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
