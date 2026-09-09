import React from 'react';
import { 
  X, 
  ExternalLink, 
  TrendingUp, 
  DollarSign, 
  Gem, 
  Users, 
  Building2, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  ArrowUpRight 
} from 'lucide-react';

export default function CompanyProfileModal({ company, isOpen, onClose }) {
  if (!isOpen || !company) return null;

  const getSignalBadge = (signal) => {
    switch (signal) {
      case 'Strong':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25';
      case 'Emerging':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/25';
      case 'Watch':
      default:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/25';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl border border-[#27272a] bg-[#111114] shadow-2xl p-5 sm:p-8 my-auto text-white max-h-[92vh] overflow-y-auto scrollbar-none">
        {/* Top Header: Logo, Name, Category, Close */}
        <div className="flex items-start justify-between pb-6 border-b border-[#232326]">
          <div className="flex items-start gap-4">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl border border-white/10 shrink-0 font-mono shadow-md"
              style={{ backgroundColor: `${company.logoColor}20`, color: company.logoColor }}
            >
              {company.logoText?.slice(0, 3) || company.name.slice(0, 3)}
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  {company.name}
                </h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded-lg bg-[#1a1a20] border border-[#27272e] text-[#A1A1AA]">
                  Rank #{company.rank}
                </span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getSignalBadge(company.marketSignal)}`}>
                  Signal: {company.marketSignal}
                </span>
              </div>

              <div className="flex items-center gap-3 mt-1.5 text-xs text-[#71717A] flex-wrap">
                <span className="flex items-center gap-1 text-[#A1A1AA]">
                  <Building2 size={12} />
                  <span>{company.category}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin size={12} />
                  <span>{company.headquarters}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>Founded {company.foundedYear}</span>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl border border-[#232326] bg-[#16161a] flex items-center justify-center text-[#A1A1AA] hover:text-white cursor-pointer transition-colors shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* Executive Overview */}
        <div className="py-5 border-b border-[#1F1F24]">
          <p className="text-sm text-[#D4D4D8] leading-relaxed">
            {company.fullDescription || company.shortDescription}
          </p>

          <div className="mt-3 flex items-center gap-3">
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-[#E4E4E7] transition-all"
            >
              <span>Visit Website</span>
              <ArrowUpRight size={13} />
            </a>
            <span className="text-xs text-[#71717A] font-mono">
              Web Momentum: <strong className="text-white font-mono">{company.webVisits}</strong>
            </span>
          </div>
        </div>

        {/* Financial Breakdown Grid */}
        <div className="py-5 border-b border-[#1F1F24]">
          <h3 className="text-xs uppercase tracking-wider font-bold text-[#71717A] mb-3">
            Financial & Capital Metrics
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <div className="p-3 rounded-xl bg-[#16161c] border border-[#232328]">
              <span className="text-[10px] text-[#71717A] uppercase tracking-wider block font-sans">
                Valuation
              </span>
              <span className="text-lg font-bold text-white block mt-0.5">
                {company.valuation}
              </span>
              <span className="text-[10px] text-[#10B981]">
                {company.verificationStatus}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#16161c] border border-[#232328]">
              <span className="text-[10px] text-[#71717A] uppercase tracking-wider block font-sans">
                Total Funding
              </span>
              <span className="text-lg font-bold text-white block mt-0.5">
                {company.funding}
              </span>
              <span className="text-[10px] text-[#71717A]">
                Disclosed
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#16161c] border border-[#232328]">
              <span className="text-[10px] text-[#71717A] uppercase tracking-wider block font-sans">
                Growth Trajectory
              </span>
              <span className="text-lg font-bold text-emerald-400 block mt-0.5">
                {company.growthRate}
              </span>
              <span className="text-[10px] text-[#71717A]">
                Headcount & Traffic
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#16161c] border border-[#232328]">
              <span className="text-[10px] text-[#71717A] uppercase tracking-wider block font-sans">
                Team Size
              </span>
              <span className="text-lg font-bold text-white block mt-0.5">
                {company.teamSize}
              </span>
              <span className="text-[10px] text-[#A78BFA]">
                {company.hiringVelocity}
              </span>
            </div>
          </div>

          {/* Latest Funding Round Sub-card */}
          {company.latestRound && (
            <div className="mt-3 p-3 rounded-xl bg-[#18181f] border border-[#27272e] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-[#6E56CF]/20 text-[#C4B5FD] font-semibold text-[11px]">
                  Latest Round: {company.latestRound.round}
                </span>
                <span className="text-white font-mono font-bold">
                  {company.latestRound.amount}
                </span>
                <span className="text-[#71717A]">({company.latestRound.date})</span>
              </div>
              <span className="text-[#71717A] text-[11px] font-mono">
                Source: {company.latestRound.source}
              </span>
            </div>
          )}
        </div>

        {/* Investors & Key Leadership */}
        <div className="py-5 border-b border-[#1F1F24] grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Major Investors */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-bold text-[#71717A] mb-2.5">
              Major Venture Backers
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {company.majorInvestors.map((inv, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-[#18181f] border border-[#27272e] text-xs text-[#E4E4E7] font-medium"
                >
                  {inv}
                </span>
              ))}
            </div>
          </div>

          {/* Leadership */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-bold text-[#71717A] mb-2.5">
              Key Leadership & Founders
            </h3>
            <div className="space-y-1.5">
              {company.leadership.map((ldr, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-[#1c1c22]">
                  <span className="text-white font-semibold">{ldr.name}</span>
                  <span className="text-[#71717A] font-mono">{ldr.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Signals & Milestones */}
        <div className="py-5 border-b border-[#1F1F24]">
          <h3 className="text-xs uppercase tracking-wider font-bold text-[#71717A] mb-3">
            Market Signals & Activity Milestones
          </h3>
          <div className="space-y-2">
            {company.signals.map((sig, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#16161c] border border-[#232328] text-xs"
              >
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase font-mono bg-[#1f1f26] text-[#A78BFA] shrink-0">
                  {sig.type}
                </span>
                <span className="text-[#D4D4D8] leading-relaxed">{sig.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer: Data Source & Last Updated (Trust Anchor) */}
        <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#71717A]">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={13} className="text-[#10B981]" />
            <span>
              Data Source: <strong>Norgard X & Disclosed SEC Filings</strong>
            </span>
            <span className="opacity-40">•</span>
            <span>Last Updated: <strong className="text-white">{company.lastUpdated}</strong></span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-[#232326] text-white hover:bg-[#2e2e33] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
