import React, { useState, useMemo } from 'react';
import { 
  COMPANIES_DATA, 
  COMPANY_CATEGORIES, 
  COMPANY_PERSPECTIVES 
} from '../../data/companiesData';
import CompanyProfileModal from './CompanyProfileModal';
import { 
  Trophy, 
  DollarSign, 
  Gem, 
  TrendingUp, 
  Search, 
  X, 
  Building2, 
  ArrowUpRight, 
  CheckCircle2, 
  ChevronDown,
  RotateCcw,
  ChevronLeft,
  ArrowRight
} from 'lucide-react';

export default function CompaniesLeaderboardSection() {
  const [activePerspective, setActivePerspective] = useState('overall');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Sorting & Filtering based on Perspective & Category
  const filteredCompanies = useMemo(() => {
    let list = [...COMPANIES_DATA];

    // Category Filter
    if (selectedCategory !== 'All') {
      list = list.filter((c) => c.category === selectedCategory);
    }

    // Search Query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      list = list.filter((c) => {
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesOrg = c.org.toLowerCase().includes(q);
        const matchesCat = c.category.toLowerCase().includes(q);
        const matchesDesc = (c.shortDescription || '').toLowerCase().includes(q);
        const matchesInvestors = (c.majorInvestors || []).some((inv) => inv.toLowerCase().includes(q));
        return matchesName || matchesOrg || matchesCat || matchesDesc || matchesInvestors;
      });
    }

    // Perspective Sorting
    return list.sort((a, b) => {
      switch (activePerspective) {
        case 'funding':
          return b.fundingNum - a.fundingNum;
        case 'valuation':
          return b.valuationNum - a.valuationNum;
        case 'growth':
          return b.growthNum - a.growthNum;
        case 'overall':
        default:
          return a.rank - b.rank;
      }
    });
  }, [activePerspective, selectedCategory, searchQuery]);

  // Reset page when category, search or perspective changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activePerspective, selectedCategory, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage) || 1;
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenProfile = (company) => {
    setSelectedCompany(company);
    setIsProfileModalOpen(true);
  };

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

  const renderRankDelta = (company) => {
    if (company.rankDelta && company.rankDelta.startsWith('+')) {
      return (
        <span className="text-[10px] font-bold text-emerald-400 font-mono">
          ▲{company.rankDelta.replace('+', '')}
        </span>
      );
    }
    if (company.rankDelta && company.rankDelta.startsWith('-')) {
      return (
        <span className="text-[10px] font-bold text-red-400 font-mono">
          ▼{company.rankDelta.replace('-', '')}
        </span>
      );
    }
    return <span className="text-[10px] text-[#71717A] font-mono">—</span>;
  };

  return (
    <div className="space-y-6">
      {/* Contextual Intelligence Header */}
      <div className="border-l-2 border-[#6E56CF] pl-3.5 py-1">
        <div className="flex items-center gap-2">
          <Building2 size={16} className="text-[#A78BFA]" />
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            AI Company Intelligence
          </h2>
        </div>
        <p className="text-xs sm:text-[13px] text-[#A1A1AA] mt-0.5 max-w-2xl font-normal leading-relaxed">
          Track the enterprises shaping the AI economy — funding, valuation, growth, and market signals.
        </p>
      </div>

      {/* 1. Perspective Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        {COMPANY_PERSPECTIVES.map((tab) => {
          const isActive = activePerspective === tab.id;
          let Icon = Trophy;
          if (tab.id === 'funding') Icon = DollarSign;
          if (tab.id === 'valuation') Icon = Gem;
          if (tab.id === 'growth') Icon = TrendingUp;

          return (
            <button
              key={tab.id}
              onClick={() => setActivePerspective(tab.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-white text-black border-white shadow-md shadow-white/10'
                  : 'bg-[#131316]/80 text-[#A1A1AA] hover:text-white border-[#232326] hover:border-white/20 hover:bg-[#18181c]'
              }`}
              title={tab.description}
            >
              <Icon size={13} className={isActive ? 'text-black' : 'text-[#71717A]'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Category Filter Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
        {COMPANY_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3 py-1 text-[11.5px] font-semibold whitespace-nowrap transition-all duration-200 border cursor-pointer shrink-0 ${
                isSelected
                  ? 'bg-[#6E56CF] text-white border-[#6E56CF] shadow-sm shadow-[#6E56CF]/20'
                  : 'text-[#A1A1AA] hover:text-white bg-[#131316]/60 border-[#232326] hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 3. Search & Summary Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search company, category, or backer (e.g. Sequoia, NVIDIA)..."
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

        <div className="flex items-center gap-2 text-xs text-[#71717A]">
          <span>
            Tracking <strong className="text-white font-mono">{filteredCompanies.length}</strong> top AI enterprises
          </span>
          {(searchQuery || selectedCategory !== 'All' || activePerspective !== 'overall') && (
            <button
              onClick={() => {
                setActivePerspective('overall');
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="flex items-center gap-1 text-[#A78BFA] hover:text-white px-2 py-0.5 rounded-lg bg-[#6E56CF]/10 border border-[#6E56CF]/20 cursor-pointer ml-1"
            >
              <RotateCcw size={11} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. Desktop Companies Table */}
      <div className="hidden sm:block rounded-2xl border border-[#232326] bg-[#111115] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#16161c] border-b border-[#232326] text-[#71717A] uppercase font-semibold text-[11px] tracking-wider">
                <th className="p-3.5 w-14 text-center">Rank</th>
                <th className="p-3.5">Company</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Valuation</th>
                <th className="p-3.5">Total Funding</th>
                <th className="p-3.5">Growth Signal</th>
                <th className="p-3.5">Market Signal</th>
                <th className="p-3.5 text-right">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F24] text-[#E4E4E7]">
              {paginatedCompanies.map((company, index) => {
                const displayRank = activePerspective === 'overall' ? company.rank : (currentPage - 1) * itemsPerPage + index + 1;
                return (
                  <tr
                    key={company.id}
                    onClick={() => handleOpenProfile(company)}
                    className="hover:bg-[#181820] transition-colors group cursor-pointer"
                  >
                    {/* Rank */}
                    <td className="p-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex flex-col items-center">
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-xl font-bold font-mono text-xs ${
                            displayRank === 1
                              ? 'bg-[#F5A623] text-black shadow-md shadow-[#F5A623]/25'
                              : displayRank === 2
                              ? 'bg-[#E4E4E7] text-black'
                              : displayRank === 3
                              ? 'bg-[#CD7F32] text-black'
                              : 'text-[#A1A1AA] bg-[#16161c] border border-[#232328]'
                          }`}
                        >
                          #{displayRank}
                        </span>
                        <div className="mt-1">{renderRankDelta(company)}</div>
                      </div>
                    </td>

                    {/* Company Name + Logo */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs border border-white/10 shrink-0 font-mono"
                          style={{ backgroundColor: `${company.logoColor}20`, color: company.logoColor }}
                        >
                          {company.logoText?.slice(0, 2) || company.name.slice(0, 2)}
                        </div>
                        <div>
                          <span className="font-bold text-sm text-white group-hover:text-[#A78BFA] transition-colors block">
                            {company.name}
                          </span>
                          <span className="text-[11px] text-[#71717A] font-mono block">
                            {company.headquarters} • Founded {company.foundedYear}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 rounded-full text-[10.5px] font-medium bg-[#1a1a20] border border-[#272730] text-[#A1A1AA]">
                        {company.category}
                      </span>
                    </td>

                    {/* Valuation */}
                    <td className="p-3.5 font-mono font-bold text-white text-[13px]">
                      {company.valuation}
                    </td>

                    {/* Total Funding */}
                    <td className="p-3.5 font-mono text-[#E4E4E7]">
                      {company.funding}
                    </td>

                    {/* Growth Signal */}
                    <td className="p-3.5 font-mono font-semibold text-emerald-400">
                      {company.growthRate}
                    </td>

                    {/* Market Signal */}
                    <td className="p-3.5">
                      <div className="flex flex-col items-start gap-0.5">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getSignalBadge(company.marketSignal)}`}>
                          {company.marketSignal}
                        </span>
                        <span className="text-[10px] text-[#71717A] font-sans truncate max-w-[140px]">
                          {company.marketSignalDetail}
                        </span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="p-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleOpenProfile(company)}
                        className="px-3 py-1 rounded-lg text-[11px] font-semibold bg-white text-black hover:bg-[#E4E4E7] transition-all cursor-pointer inline-flex items-center gap-1"
                      >
                        <span>Profile</span>
                        <ArrowUpRight size={12} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Mobile Company Cards (<= 640px) */}
      <div className="sm:hidden space-y-3">
        {paginatedCompanies.map((company, index) => {
          const displayRank = activePerspective === 'overall' ? company.rank : (currentPage - 1) * itemsPerPage + index + 1;
          return (
            <div
              key={company.id}
              onClick={() => handleOpenProfile(company)}
              className="p-4 rounded-2xl border border-[#232326] bg-[#111115] hover:border-[#3b3b44] transition-all cursor-pointer text-white"
            >
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex flex-col items-center shrink-0">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-xl font-bold font-mono text-xs ${
                        displayRank === 1
                          ? 'bg-[#F5A623] text-black'
                          : displayRank === 2
                          ? 'bg-[#E4E4E7] text-black'
                          : displayRank === 3
                          ? 'bg-[#CD7F32] text-black'
                          : 'text-[#A1A1AA] bg-[#16161c] border border-[#272728]'
                      }`}
                    >
                      #{displayRank}
                    </span>
                    <div className="mt-1">{renderRankDelta(company)}</div>
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-white truncate">{company.name}</h4>
                    <span className="text-[11px] text-[#71717A] font-mono block">
                      {company.category} • {company.headquarters}
                    </span>
                  </div>
                </div>

                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${getSignalBadge(company.marketSignal)}`}>
                  {company.marketSignal}
                </span>
              </div>

              {/* 3 Metric Pills */}
              <div className="grid grid-cols-3 gap-2 py-2 px-2.5 rounded-xl bg-[#16161c] border border-[#232328] mb-3 text-center font-mono">
                <div>
                  <span className="text-[9.5px] uppercase tracking-wider text-[#71717A] block font-sans">Valuation</span>
                  <span className="text-xs font-bold text-white">{company.valuation}</span>
                </div>
                <div className="border-x border-[#232328]">
                  <span className="text-[9.5px] uppercase tracking-wider text-[#71717A] block font-sans">Funding</span>
                  <span className="text-xs font-bold text-[#E4E4E7]">{company.funding}</span>
                </div>
                <div>
                  <span className="text-[9.5px] uppercase tracking-wider text-[#71717A] block font-sans">Growth</span>
                  <span className="text-xs font-bold text-emerald-400">{company.growthRate}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#1F1F24]" onClick={(e) => e.stopPropagation()}>
                <span className="text-[11px] text-[#71717A] font-mono truncate max-w-[180px]">
                  Backers: {company.majorInvestors?.slice(0, 2).join(', ')}
                </span>
                <button
                  onClick={() => handleOpenProfile(company)}
                  className="px-3 py-1 rounded-xl bg-white text-black font-semibold text-xs flex items-center gap-1"
                >
                  <span>Profile</span>
                  <ArrowUpRight size={11} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#71717A]">
        <div className="flex items-center gap-3 flex-wrap">
          <span>
            Showing <strong className="text-white font-mono">{filteredCompanies.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</strong> to{' '}
            <strong className="text-white font-mono">
              {Math.min(currentPage * itemsPerPage, filteredCompanies.length)}
            </strong>{' '}
            of <strong className="text-white font-mono">{filteredCompanies.length}</strong> top AI enterprises
          </span>

          <div className="flex items-center gap-1.5 ml-1">
            <span className="text-[11px] text-[#71717A]">Per screen:</span>
            {[25, 50, 100].map((size) => (
              <button
                key={size}
                onClick={() => {
                  setItemsPerPage(size);
                  setCurrentPage(1);
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-all cursor-pointer ${
                  itemsPerPage === size
                    ? 'bg-[#6E56CF] text-white border-[#6E56CF] font-bold shadow-sm'
                    : 'bg-[#131316] border-[#232326] text-[#A1A1AA] hover:text-white hover:bg-[#1a1a20]'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {totalPages > 1 && (
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
        )}
      </div>

      {/* 6. Company Profile Deep-Dive Modal */}
      <CompanyProfileModal
        company={selectedCompany}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
}
