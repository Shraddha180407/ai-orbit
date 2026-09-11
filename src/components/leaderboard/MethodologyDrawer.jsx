import React from 'react';
import { 
  X, 
  ShieldCheck, 
  Trophy, 
  Building2, 
  CheckCircle2, 
  ExternalLink, 
  Clock, 
  AlertCircle,
  HelpCircle,
  Scale
} from 'lucide-react';

export default function MethodologyDrawer({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl border border-[#27272a] bg-[#111114] shadow-2xl p-5 sm:p-8 my-auto text-white max-h-[90vh] overflow-y-auto scrollbar-none animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#232326]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#6E56CF]/20 text-[#A78BFA] flex items-center justify-center shrink-0">
              <Scale size={20} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span>Methodology &amp; Data Transparency</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Verified Standard
                </span>
              </h2>
              <p className="text-xs text-[#A1A1AA] mt-0.5">
                How rankings, evaluations, and enterprise signals are sourced, verified, and weighted.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl border border-[#232326] bg-[#16161a] flex items-center justify-center text-[#A1A1AA] hover:text-white cursor-pointer transition-colors shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* Section 0: Overall Ranking Methodology */}
        <div className="py-5 border-b border-[#1F1F24] space-y-2.5">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Scale size={16} className="text-[#A78BFA]" />
            <h3>Overall Rank: AI Orbit Ranking Methodology</h3>
          </div>
          <p className="text-xs text-[#A1A1AA] leading-relaxed">
            Overall Rank is calculated using the <strong className="text-white">AI Orbit ranking methodology</strong>, a composite framework balancing Chatbot Arena pairwise human preferences, verified standardized benchmarks, token efficiency, and adoption signals. No single sponsor or self-reported score dictates standing.
          </p>
        </div>

        {/* Section 1: AI Models & Tools Methodology */}
        <div className="py-5 border-b border-[#1F1F24] space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Trophy size={16} className="text-[#F5A623]" />
            <h3>Part A: AI Models &amp; Tools Evaluation</h3>
          </div>
          <p className="text-xs text-[#A1A1AA] leading-relaxed">
            AI Orbit evaluates foundation models and developer tools across reproducible, peer-reviewed benchmarks, real-world community telemetry, and pricing efficiency:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#16161c] border border-[#232328]">
              <span className="font-semibold text-white block mb-1">LMSYS Chatbot Arena (Elo)</span>
              <span className="text-[#71717A] text-[11px] leading-relaxed block">
                Crowdsourced, blind A/B pairwise human preference evaluations using Bradley-Terry statistical modeling. Sourced hourly.
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#16161c] border border-[#232328]">
              <span className="font-semibold text-white block mb-1">SWE-bench Verified &amp; Coding</span>
              <span className="text-[#71717A] text-[11px] leading-relaxed block">
                Standardized software engineering benchmark measuring the ability of LLMs to resolve real GitHub issues autonomously.
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#16161c] border border-[#232328]">
              <span className="font-semibold text-white block mb-1">Inference Latency &amp; Speed (tok/s)</span>
              <span className="text-[#71717A] text-[11px] leading-relaxed block">
                Time-To-First-Token (TTFT) and token throughput tested over continuous WebSocket streaming endpoints under standard loads.
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#16161c] border border-[#232328]">
              <span className="font-semibold text-white block mb-1">Domain-Adaptive Benchmarks</span>
              <span className="text-[#71717A] text-[11px] leading-relaxed block">
                Non-LLM categories use specialized metrics: Visual Elo for image generators, MOS fidelity for voice, and BLEU for translation.
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: AI Companies Top 100 Methodology */}
        <div className="py-5 border-b border-[#1F1F24] space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Building2 size={16} className="text-[#6E56CF]" />
            <h3>Part B: AI Companies Top 100 Signals</h3>
          </div>
          <p className="text-xs text-[#A1A1AA] leading-relaxed">
            Company rankings are grounded in verified commercial and ecosystem signals, referencing <strong>Norgard X</strong> and official regulatory disclosures rather than black-box formulas:
          </p>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-[#16161c] border border-[#232328] flex items-start gap-2.5">
              <CheckCircle2 size={14} className="text-[#10B981] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Valuation &amp; Capital Raised:</strong>
                <span className="text-[#A1A1AA] ml-1">
                  Sourced from verified SEC Form D filings, audited corporate press releases, and reputable financial data providers (PitchBook, Crunchbase, and Norgard X).
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#16161c] border border-[#232328] flex items-start gap-2.5">
              <CheckCircle2 size={14} className="text-[#10B981] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Multi-Input Market Signal:</strong>
                <span className="text-[#A1A1AA] ml-1">
                  Categorized as <em>Strong</em> (sustained traction across funding and usage), <em>Emerging</em> (rapid inflection), or <em>Watch</em> (recent strategic milestones or pivots).
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#16161c] border border-[#232328] flex items-start gap-2.5">
              <CheckCircle2 size={14} className="text-[#10B981] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Hiring Velocity &amp; Team Growth:</strong>
                <span className="text-[#A1A1AA] ml-1">
                  Calculated from active job openings and net headcount additions across engineering and research organizations.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Data Freshness & Open Standards */}
        <div className="py-5 border-b border-[#1F1F24] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#A1A1AA] flex-wrap">
            <Clock size={14} className="text-[#6E56CF] shrink-0" />
            <span>Benchmark indices: <strong className="text-white">Updated periodically</strong></span>
            <span className="opacity-40">•</span>
            <span>Company venture data: <strong className="text-white">As of each company's last disclosed round</strong></span>
            <span className="opacity-40">•</span>
            <span className="text-[11px] text-[#71717A] italic">Some figures are estimates</span>
          </div>

          <span className="text-[11px] font-mono text-[#71717A] shrink-0">
            Independent &amp; Vendor Neutral
          </span>
        </div>

        {/* Footer */}
        <div className="pt-4 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white text-black hover:bg-[#E4E4E7] transition-all cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
