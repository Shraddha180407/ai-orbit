import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Trophy, Bot, ArrowRight, Building2, Cpu, Sparkles } from 'lucide-react';
import { LEADERBOARD_DATA } from '../data/leaderboardData';
import { COMPANIES_DATA } from '../data/companiesData';
import CompanyProfileModal from './leaderboard/CompanyProfileModal';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [activeSearchTab, setActiveSearchTab] = useState('all'); // 'all' | 'models' | 'companies'
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Search across models
  const matchingModels = useMemo(() => {
    if (!query.trim()) return LEADERBOARD_DATA.slice(0, 5);
    const q = query.toLowerCase();
    return LEADERBOARD_DATA.filter((m) => 
      m.name.toLowerCase().includes(q) ||
      m.org.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      (m.shortDescription || '').toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query]);

  // Search across companies
  const matchingCompanies = useMemo(() => {
    if (!query.trim()) return COMPANIES_DATA.slice(0, 5);
    const q = query.toLowerCase();
    return COMPANIES_DATA.filter((c) =>
      c.name.toLowerCase().includes(q) ||
      c.org.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      (c.shortDescription || '').toLowerCase().includes(q) ||
      (c.majorInvestors || []).some((inv) => inv.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [query]);

  const handleSelectModel = (slug) => {
    navigate(`/leaderboard/${slug}`);
    onClose();
  };

  const handleSelectCompany = (company) => {
    setSelectedCompany(company);
    setIsCompanyModalOpen(true);
  };

  const showModels = activeSearchTab === 'all' || activeSearchTab === 'models';
  const showCompanies = activeSearchTab === 'all' || activeSearchTab === 'companies';

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md">
        <div className="relative w-full max-w-2xl rounded-2xl border border-[#27272a] bg-[#111114] shadow-2xl overflow-hidden text-white animate-in fade-in zoom-in-95 duration-150">
          {/* Search Bar Header */}
          <div className="flex items-center px-4 py-3.5 border-b border-[#232326]">
            <Search size={18} className="text-[#71717A] shrink-0 mr-3" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search models, companies, backers (e.g., Claude, Cursor, Sequoia, OpenAI)..."
              className="flex-1 bg-transparent text-sm text-white placeholder:text-[#71717A] focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-[#71717A] hover:text-white cursor-pointer mr-1.5"
              >
                <X size={15} />
              </button>
            )}
            <button
              onClick={onClose}
              className="px-2 py-1 text-[11px] font-mono rounded bg-[#1f1f26] border border-[#2e2e38] text-[#A1A1AA] hover:text-white cursor-pointer"
            >
              ESC
            </button>
          </div>

          {/* Scope Filters (All / Models / Companies) */}
          <div className="flex items-center gap-2 px-4 py-2 bg-[#0c0c0e] border-b border-[#1b1b22] text-xs">
            <span className="text-[#71717A] text-[11px] font-medium mr-1">Scope:</span>
            <button
              onClick={() => setActiveSearchTab('all')}
              className={`px-2.5 py-1 rounded-lg font-medium text-[11px] transition-all cursor-pointer ${
                activeSearchTab === 'all'
                  ? 'bg-white text-black font-semibold shadow'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-[#1b1b22]'
              }`}
            >
              All Results
            </button>
            <button
              onClick={() => setActiveSearchTab('models')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium text-[11px] transition-all cursor-pointer ${
                activeSearchTab === 'models'
                  ? 'bg-[#6E56CF] text-white font-semibold shadow'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-[#1b1b22]'
              }`}
            >
              <Cpu size={12} />
              <span>Models ({matchingModels.length})</span>
            </button>
            <button
              onClick={() => setActiveSearchTab('companies')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium text-[11px] transition-all cursor-pointer ${
                activeSearchTab === 'companies'
                  ? 'bg-[#6E56CF] text-white font-semibold shadow'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-[#1b1b22]'
              }`}
            >
              <Building2 size={12} />
              <span>Companies ({matchingCompanies.length})</span>
            </button>
          </div>

          {/* Results List */}
          <div className="max-h-[420px] overflow-y-auto p-3 space-y-4">
            {/* Models Section */}
            {showModels && (
              <div>
                <div className="flex items-center justify-between px-2 pb-1.5 text-[10.5px] uppercase tracking-wider font-semibold text-[#71717A]">
                  <span className="flex items-center gap-1.5">
                    <Cpu size={12} className="text-[#A78BFA]" />
                    AI Models &amp; Tools ({matchingModels.length})
                  </span>
                  {activeSearchTab === 'all' && (
                    <button
                      onClick={() => setActiveSearchTab('models')}
                      className="text-[10px] text-[#A78BFA] hover:underline cursor-pointer lowercase"
                    >
                      view only models
                    </button>
                  )}
                </div>

                {matchingModels.length === 0 ? (
                  <div className="p-4 text-xs text-[#71717A] text-center">
                    No models found matching "{query}".
                  </div>
                ) : (
                  <div className="space-y-1">
                    {matchingModels.map((item) => (
                      <div
                        key={`m-${item.id}`}
                        onClick={() => handleSelectModel(item.slug)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#18181f] cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-[#6E56CF]/20 text-[#A78BFA] flex items-center justify-center font-bold font-mono text-xs shrink-0">
                            #{item.rank}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm text-white group-hover:text-[#A78BFA] transition-colors truncate">
                                {item.name}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#1e1e26] border border-[#2e2e38] text-[#A1A1AA] shrink-0">
                                {item.category}
                              </span>
                            </div>
                            <span className="text-xs text-[#71717A] block truncate">
                              {item.org} • {item.arenaElo} Arena Elo • {item.price}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-[#71717A] group-hover:text-white transition-colors shrink-0 ml-2">
                          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Companies Section */}
            {showCompanies && (
              <div>
                <div className="flex items-center justify-between px-2 pt-2 pb-1.5 border-t border-[#1F1F24] text-[10.5px] uppercase tracking-wider font-semibold text-[#71717A]">
                  <span className="flex items-center gap-1.5">
                    <Building2 size={12} className="text-[#6E56CF]" />
                    AI Companies Top 100 ({matchingCompanies.length})
                  </span>
                  {activeSearchTab === 'all' && (
                    <button
                      onClick={() => setActiveSearchTab('companies')}
                      className="text-[10px] text-[#A78BFA] hover:underline cursor-pointer lowercase"
                    >
                      view only companies
                    </button>
                  )}
                </div>

                {matchingCompanies.length === 0 ? (
                  <div className="p-4 text-xs text-[#71717A] text-center">
                    No companies found matching "{query}".
                  </div>
                ) : (
                  <div className="space-y-1">
                    {matchingCompanies.map((item) => (
                      <div
                        key={`c-${item.id}`}
                        onClick={() => handleSelectCompany(item)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#18181f] cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs border border-white/10 shrink-0 font-mono"
                            style={{ backgroundColor: `${item.logoColor}20`, color: item.logoColor }}
                          >
                            {item.logoText?.slice(0, 3) || item.name.slice(0, 3)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm text-white group-hover:text-[#A78BFA] transition-colors truncate">
                                {item.name}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#1e1e26] border border-[#2e2e38] text-[#A1A1AA] shrink-0">
                                {item.category}
                              </span>
                              <span className="text-[10px] font-mono text-emerald-400">
                                {item.valuation}
                              </span>
                            </div>
                            <span className="text-xs text-[#71717A] block truncate">
                              {item.headquarters} • Signal: {item.marketSignal} • Backers: {(item.majorInvestors || []).slice(0, 2).join(', ')}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-[#71717A] group-hover:text-white transition-colors shrink-0 ml-2">
                          <span className="text-[10px] hidden sm:inline px-1.5 py-0.5 rounded bg-[#1f1f26] text-[#A1A1AA]">
                            Profile
                          </span>
                          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer shortcuts */}
          <div className="px-4 py-2.5 bg-[#0e0e11] border-t border-[#1C1C1F] flex items-center justify-between text-[11px] text-[#71717A]">
            <span>Click model to navigate, click company for investment profile</span>
            <span className="font-mono">AI Orbit Intelligence</span>
          </div>
        </div>
      </div>

      {/* Company Profile Modal mounted directly from search */}
      <CompanyProfileModal
        company={selectedCompany}
        isOpen={isCompanyModalOpen}
        onClose={() => {
          setIsCompanyModalOpen(false);
          setSelectedCompany(null);
        }}
      />
    </>
  );
}
