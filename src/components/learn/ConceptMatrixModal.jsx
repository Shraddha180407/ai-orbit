import React, { useState, useEffect } from 'react';
import { CONCEPT_MATRIX_TERMS } from '../../data/learnData';

export default function ConceptMatrixModal({ isOpen, onClose }) {
  const [search, setSearch] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredTerms = CONCEPT_MATRIX_TERMS.filter((item) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      item.term.toLowerCase().includes(q) ||
      item.discipline.toLowerCase().includes(q) ||
      item.analogy.toLowerCase().includes(q) ||
      item.breakdown.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex flex-col justify-end transition-opacity duration-300">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-Up Sheet */}
      <div className="relative w-full h-[90vh] bg-[#09090D] border-t border-[#161622] rounded-t-3xl flex flex-col overflow-hidden shadow-2xl z-10 animate-in slide-in-from-bottom duration-300">
        {/* Top Handle */}
        <div className="w-full flex justify-center pt-3 pb-1 cursor-pointer" onClick={onClose}>
          <div className="w-12 h-1 rounded-full bg-zinc-700 hover:bg-zinc-500 transition-colors"></div>
        </div>

        {/* Header */}
        <div className="px-6 py-4 border-b border-[#161622] flex items-center justify-between bg-black/40">
          <div>
            <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <span className="text-[#00E5FF]">⚡</span> Frontier Concept Matrix
            </h2>
            <p className="text-xs text-[#8E8EA0] font-mono">
              Instant definitions, plain English analogies, and technical architectures
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#050508] border border-[#161622] flex items-center justify-center text-[#A1A1B5] hover:text-white transition-colors cursor-pointer font-mono"
          >
            ✕
          </button>
        </div>

        {/* Search Input */}
        <div className="px-6 py-3 bg-[#050508] border-b border-[#161622]">
          <input 
            id="concept-matrix-search-input"
            name="conceptSearch"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            placeholder="Search concepts (e.g. VLA, MoE, KV-Cache, GRPO, RRF)..."
            className="w-full bg-black border border-[#161622] focus:border-[#00E5FF] rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 font-mono focus:outline-none transition-colors"
          />
        </div>

        {/* Glossary Matrix List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 max-w-4xl mx-auto w-full">
          {filteredTerms.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 font-mono text-xs">
              No concepts matching "{search}". Try searching for VLA, MoE, RRF, or GRPO.
            </div>
          ) : (
            filteredTerms.map((item) => {
              const isCyan = item.color === 'cyan';
              const isOrbit = item.color === 'orbit' || item.color === 'purple';
              const isAmber = item.color === 'amber';
              const isEmerald = item.color === 'emerald';

              const titleColor = isCyan
                ? 'text-[#00E5FF]'
                : isOrbit
                ? 'text-[#6E56CF]'
                : isAmber
                ? 'text-[#F5A623]'
                : 'text-emerald-400';

              const badgeClass = isCyan
                ? 'bg-[#00E5FF]/10 text-[#00E5FF]'
                : isOrbit
                ? 'bg-[#6E56CF]/10 text-[#C4B5FD]'
                : isAmber
                ? 'bg-amber-500/10 text-amber-300'
                : 'bg-emerald-500/10 text-emerald-300';

              const borderHover = isCyan
                ? 'hover:border-[#00E5FF]/40'
                : isOrbit
                ? 'hover:border-[#6E56CF]/40'
                : isAmber
                ? 'hover:border-amber-500/40'
                : 'hover:border-emerald-500/40';

              return (
                <div
                  key={item.id}
                  className={`bg-[#050508] border border-[#161622] ${borderHover} rounded-xl p-4 space-y-2.5 transition-all`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold font-mono ${titleColor}`}>
                      {item.term}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${badgeClass}`}>
                      {item.discipline}
                    </span>
                  </div>

                  <div className="text-xs text-zinc-300">
                    <strong className="text-[#8E8EA0] font-mono block mb-1">
                      Plain English Analogy:
                    </strong>
                    {item.analogy}
                  </div>

                  <div className="text-xs text-[#8E8EA0]">
                    <strong className="text-zinc-500 font-mono block mb-1">
                      Technical Breakdown:
                    </strong>
                    {item.breakdown}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
