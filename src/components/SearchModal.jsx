import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Trophy, Bot, ArrowRight } from 'lucide-react';
import { LEADERBOARD_DATA } from '../data/leaderboardData';
import { ROBOTS_DATA } from '../data/robotsData';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
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

  // Search across leaderboard models
  const matchingModels = LEADERBOARD_DATA.filter((m) => 
    m.name.toLowerCase().includes(query.toLowerCase()) ||
    m.org.toLowerCase().includes(query.toLowerCase()) ||
    m.category.toLowerCase().includes(query.toLowerCase()) ||
    m.shortDescription.toLowerCase().includes(query.toLowerCase())
  );

  const displayModels = query.trim() === '' ? LEADERBOARD_DATA.slice(0, 5) : matchingModels.slice(0, 6);

  const handleSelect = (slug) => {
    navigate(`/leaderboard/${slug}`);
    onClose();
  };

  return (
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
            placeholder="Search AI leaderboard models, tools, or providers..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-[#71717A] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#71717A] hover:text-white cursor-pointer"
            >
              <X size={15} />
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-2 px-2 py-1 text-[11px] font-mono rounded bg-[#1f1f26] border border-[#2e2e38] text-[#A1A1AA] hover:text-white cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 divide-y divide-[#1b1b22]">
          <div className="px-3 py-1.5 text-[10.5px] uppercase tracking-wider font-semibold text-[#71717A]">
            {query.trim() === '' ? 'Top Ranked AI Systems' : `Matching Results (${displayModels.length})`}
          </div>

          {displayModels.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#71717A]">
              No AI models or tools found matching "{query}". Try searching for "Claude", "o3-mini", "DeepSeek", or "Cursor".
            </div>
          ) : (
            displayModels.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelect(item.slug)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#18181f] cursor-pointer transition-colors group"
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
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-[#0e0e11] border-t border-[#1C1C1F] flex items-center justify-between text-[11px] text-[#71717A]">
          <span>Select item to open full profile &amp; benchmarks</span>
          <span className="font-mono">AI Orbit Leaderboard</span>
        </div>
      </div>
    </div>
  );
}
