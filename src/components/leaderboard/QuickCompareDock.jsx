import React from 'react';
import { GitCompare, X, ArrowRight } from 'lucide-react';

export default function QuickCompareDock({
  selectedModels = [],
  onToggleCompare,
  onClearCompare,
  onOpenModal
}) {
  if (selectedModels.length === 0) return null;

  // Smart shortened labels to prevent truncation and make chips instantly distinguishable
  const getShortName = (m) => {
    if (!m || !m.name) return '';
    if (m.name.startsWith('Claude')) {
      return m.name.split(' ').slice(0, 2).join(' '); // "Claude 3.7", "Claude 3.5"
    }
    if (m.name.startsWith('OpenAI ')) {
      return m.name.replace('OpenAI ', ''); // "o3-mini", "o1", "o1-mini"
    }
    if (m.name.startsWith('Gemini ')) {
      return m.name.split(' ').slice(0, 2).join(' '); // "Gemini 2.0", "Gemini 1.5"
    }
    const words = m.name.split(' ');
    return words.length > 2 ? words.slice(0, 2).join(' ') : m.name;
  };

  const counterColorClass = 
    selectedModels.length === 3 
      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
      : selectedModels.length === 2 
      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
      : 'bg-white/10 text-white border-white/20';

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[95vw] sm:max-w-[900px] transition-all duration-300 ease-out animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="p-2 sm:p-2.5 rounded-2xl border border-[#6E56CF]/40 bg-[#0c0c10]/95 backdrop-blur-2xl shadow-[0_0_35px_rgba(110,86,207,0.35),0_10px_30px_rgba(0,0,0,0.9)] ring-1 ring-white/10 flex items-center justify-between gap-3 sm:gap-4 text-white transition-all duration-300">
        {/* Left: Selected counter + short chips + Clear button */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5 min-w-0">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border shrink-0 transition-colors ${counterColorClass}`}>
            <GitCompare size={13} />
            <span>{selectedModels.length}/3 Selected</span>
          </div>

          {selectedModels.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#16161c] border border-[#27272e] shrink-0 text-xs hover:border-[#3b3b44] transition-all animate-in fade-in zoom-in-95 duration-200"
            >
              <span className="text-white font-medium whitespace-nowrap">{getShortName(m)}</span>
              <button
                onClick={() => onToggleCompare(m)}
                className="text-[#71717A] hover:text-white cursor-pointer ml-0.5 transition-colors"
                title={`Remove ${m.name}`}
                aria-label={`Remove ${m.name}`}
              >
                <X size={12} />
              </button>
            </div>
          ))}

          <button
            onClick={onClearCompare}
            className="text-xs text-[#71717A] hover:text-red-400 hover:bg-red-950/20 px-2 py-1 rounded-lg transition-colors cursor-pointer shrink-0 ml-1"
          >
            Clear all
          </button>
        </div>

        {/* Right: Primary action button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenModal}
            disabled={selectedModels.length < 2}
            className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md cursor-pointer ${
              selectedModels.length >= 2
                ? 'bg-white text-black hover:bg-[#E4E4E7] shadow-white/10 active:scale-95'
                : 'bg-[#232326] text-[#71717A] cursor-not-allowed'
            }`}
          >
            <span>Compare Full Matrix</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
