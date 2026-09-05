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
  Star
} from 'lucide-react';

export default function RobotCardGrid({ 
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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
            {status}
          </span>
        );
      case 'amber':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F5A623]/15 text-[#FBBF24] border border-[#F5A623]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623]"></span>
            {status}
          </span>
        );
      case 'orbit-purple':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#6E56CF]/20 text-[#C4B5FD] border border-[#6E56CF]/40">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6E56CF]"></span>
            {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#00E5FF]/15 text-[#67E8F9] border border-[#00E5FF]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]"></span>
            {status}
          </span>
        );
    }
  };

  return (
    <div className="group relative flex flex-col rounded-2xl border border-[#232326] bg-[#131316] hover:border-[#3b3b44] transition-all duration-300 overflow-hidden hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#6E56CF]/10">
      {/* Top Image & Floating Badges */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0A0A0D]">
        <img
          src={robot.media.primaryImage}
          alt={robot.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />

        {/* Gradient vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#131316] via-transparent to-black/60 pointer-events-none"></div>

        {/* Top Floating Left: Category / Status */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
          {getStatusBadge(robot.status, robot.statusVariant)}
        </div>

        {/* Top Floating Right: Quick actions (Bookmark, Compare, Quickview) */}
        <div className="absolute top-3 right-3 flex items-center gap-1 z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(robot);
            }}
            className="w-7 h-7 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/80 transition-all cursor-pointer"
            title="Quick view specs"
          >
            <Eye size={13} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleBookmark(robot.id);
            }}
            className={`w-7 h-7 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all cursor-pointer ${
              isBookmarked ? 'text-[#A78BFA] border-[#6E56CF]/50' : 'text-white/80 hover:text-white hover:bg-black/80'
            }`}
            title="Bookmark"
          >
            <Bookmark size={13} className={isBookmarked ? "fill-[#A78BFA]" : ""} />
          </button>
        </div>

        {/* Bottom Floating Bar inside image: Manufacturer & Rating */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs z-10">
          <span className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
            {robot.manufacturer}
          </span>
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 text-white font-mono text-[11px]">
            <Star size={11} className="text-[#F5A623] fill-[#F5A623]" />
            <span>{robot.rating}</span>
            <span className="text-[#71717A]">({robot.reviewsCount})</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        {/* Name and Tagline */}
        <div className="mb-3">
          <Link to={`/robots/${robot.slug}`} className="block group-hover:text-[#A78BFA] transition-colors">
            <h3 className="text-[17px] font-bold text-white tracking-tight leading-snug flex items-center justify-between">
              <span>{robot.name}</span>
              <ArrowUpRight size={16} className="text-[#71717A] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-1" />
            </h3>
          </Link>
          <p className="text-[12.5px] text-[#A1A1AA] leading-relaxed line-clamp-2 mt-1 font-normal">
            {robot.tagLine}
          </p>
        </div>

        {/* Clean metadata line: Category & Mobility */}
        <div className="flex items-center gap-2 text-[12px] text-[#A1A1AA] my-3">
          <span>{robot.category}</span>
          <span className="text-[#3F3F46]">•</span>
          <span>{robot.specs.dof}</span>
        </div>

        {/* Bottom Actions & Price */}
        <div className="mt-auto pt-3 border-t border-[#1C1C1F] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-[#71717A] font-semibold">Pricing</span>
            <span className="text-[13px] font-bold text-white font-mono">
              {robot.pricing.startingPrice}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Compare checkbox */}
            <button
              onClick={() => onToggleCompare(robot)}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                isSelectedForCompare
                  ? 'bg-[#6E56CF] text-white border-[#6E56CF]'
                  : 'bg-[#18181c] text-[#A1A1AA] border-[#27272e] hover:text-white hover:border-[#3f3f46]'
              }`}
              title="Add to compare table"
            >
              <GitCompare size={12} />
              <span>{isSelectedForCompare ? 'Added' : 'Compare'}</span>
            </button>

            {/* Direct Link to Detail */}
            <Link
              to={`/robots/${robot.slug}`}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-semibold bg-white text-black hover:bg-[#E4E4E7] active:scale-95 transition-all"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
