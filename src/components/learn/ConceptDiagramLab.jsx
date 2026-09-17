import React, { useState } from 'react';

export default function ConceptDiagramLab({ onOpenLesson }) {
  const [isSaved, setIsSaved] = useState(() => {
    try {
      const saved = localStorage.getItem('orbit_saved_rag_lab');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const toggleSave = () => {
    setIsSaved((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('orbit_saved_rag_lab', String(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  return (
    <section className="max-w-7xl mx-auto px-6 mb-24" id="featured-labs">
      <div className="flex items-center justify-between pb-4 mb-8 border-b border-[#161622]/80">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold tracking-tight text-white">
            Interactive Concept Diagrams &amp; Labs
          </h2>
          <p className="text-xs text-[#8E8EA0] font-mono mt-1">
            Live architecture inspection for production retrieval and execution pipelines
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#A1A1B5]">
          <span>Dual Engine Blueprint</span>
        </div>
      </div>

      {/* Hero Card with Handcrafted Concept SVGs */}
      <div className="bg-[#09090D] border border-[#161622] rounded-3xl p-7 sm:p-9 relative overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Production RAG Breakdown */}
          <div className="lg:col-span-6 space-y-5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-[#6E56CF]/15 border border-[#6E56CF]/30 text-[#6E56CF] text-xs font-mono font-semibold">
                ⭐ Architecture Lab
              </span>
              <span className="text-xs font-mono text-[#8E8EA0]">
                Production-Ready RAG &amp; Rerank
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
              Building Production-Ready RAG Systems
            </h3>

            <p className="text-sm text-[#A1A1B5] font-sans leading-relaxed">
              Eliminate hallucination in mission-critical applications. See how dense semantic embeddings, BM25 keyword matching, Reciprocal Rank Fusion (RRF), and Cohere rerankers collaborate before prompting the context-augmented LLM.
            </p>

            <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#8E8EA0]">
              <span className="px-2.5 py-1 rounded-lg bg-[#050508] border border-[#161622] text-emerald-400">
                ● 6 Interactive Sandboxes
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#050508] border border-[#161622]">
                Cosine vs Dot Product
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#050508] border border-[#161622]">
                RRF Formula
              </span>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={() => onOpenLesson('rag-lesson')}
                className="px-6 py-3.5 rounded-xl bg-[#6E56CF] hover:bg-[#5E44C5] active:scale-95 text-white font-mono text-xs font-semibold flex items-center gap-2 shadow-[0_0_25px_rgba(110,86,207,0.5)] transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Start Laboratory</span>
                <span>→</span>
              </button>

              <button
                onClick={toggleSave}
                className={`px-4 py-3.5 rounded-xl bg-[#101017] hover:bg-[#13131C] border ${
                  isSaved ? 'border-[#6E56CF] text-[#6E56CF]' : 'border-[#161622] text-[#A1A1B5] hover:text-white'
                } font-mono text-xs flex items-center gap-2 transition-all cursor-pointer`}
              >
                <svg className="w-4 h-4" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                <span>{isSaved ? 'Lab Saved' : 'Save Lab'}</span>
              </button>
            </div>
          </div>

          {/* Right: Handcrafted Illustrated SVG Diagram */}
          <div className="lg:col-span-6">
            <div className="bg-[#050508] border border-[#161622] rounded-2xl p-5 font-mono text-xs shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between text-[#8E8EA0] pb-3 mb-4 border-b border-[#161622]/70">
                <span className="text-[#C4B5FD] font-semibold">pipeline_flow_topology.svg</span>
                <span className="text-emerald-400 text-[10px] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> Live Signal Flow
                </span>
              </div>

              {/* SVG Diagram */}
              <svg className="w-full h-[260px]" viewBox="0 0 440 260">
                <defs>
                  <pattern height="20" id="gridPattern" patternUnits="userSpaceOnUse" width="20">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#111119" strokeWidth="1" />
                  </pattern>
                </defs>

                <rect fill="url(#gridPattern)" height="260" width="440" />

                {/* Node 1: User Query */}
                <rect fill="#0E0E15" height="40" rx="8" stroke="#6E56CF" strokeWidth="1.5" width="100" x="20" y="30" />
                <text fill="#FFFFFF" fontFamily="JetBrains Mono" fontSize="10" textAnchor="middle" x="70" y="55">User Query</text>

                {/* Flow line to Split */}
                <path d="M 120 50 L 160 50" fill="none" stroke="#6E56CF" strokeWidth="2" />

                {/* Node 2A: Dense Embedding */}
                <rect fill="#0A0A10" height="34" rx="6" stroke="#00E5FF" strokeWidth="1.5" width="110" x="160" y="20" />
                <text fill="#67E8F9" fontFamily="JetBrains Mono" fontSize="9" textAnchor="middle" x="215" y="41">Dense Embedding</text>

                {/* Node 2B: BM25 Lexical */}
                <rect fill="#0A0A10" height="34" rx="6" stroke="#F5A623" strokeWidth="1.5" width="110" x="160" y="66" />
                <text fill="#FBBF24" fontFamily="JetBrains Mono" fontSize="9" textAnchor="middle" x="215" y="87">Sparse BM25 Index</text>

                {/* Connectors to RRF */}
                <path d="M 270 37 L 310 50" fill="none" stroke="#00E5FF" strokeDasharray="3 3" strokeWidth="1.5" />
                <path d="M 270 83 L 310 50" fill="none" stroke="#F5A623" strokeDasharray="3 3" strokeWidth="1.5" />

                {/* Node 3: RRF & Rerank */}
                <rect fill="#141126" height="40" rx="8" stroke="#6E56CF" strokeWidth="2" width="110" x="310" y="30" />
                <text fill="#FFFFFF" fontFamily="JetBrains Mono" fontSize="9" fontWeight="bold" textAnchor="middle" x="365" y="50">RRF + Reranker</text>
                <text fill="#C4B5FD" fontFamily="JetBrains Mono" fontSize="8" textAnchor="middle" x="365" y="63">Top-k = 5 Chunks</text>

                {/* Arrow down to Context Injection */}
                <path d="M 365 70 L 365 130" fill="none" stroke="#6E56CF" strokeWidth="2" />

                {/* Signal beam animation down */}
                <circle cx="365" cy="100" fill="#00E5FF" r="3">
                  <animate attributeName="cy" dur="2s" repeatCount="indefinite" values="70;130" />
                </circle>

                {/* Node 4: Agent Reasoning Core */}
                <rect fill="#0A0A10" height="44" rx="8" stroke="#10B981" strokeWidth="2" width="160" x="260" y="130" />
                <text fill="#34D399" fontFamily="JetBrains Mono" fontSize="10" fontWeight="bold" textAnchor="middle" x="340" y="152">LLM Reasoning Loop</text>
                <text fill="#A1A1B5" fontFamily="JetBrains Mono" fontSize="8" textAnchor="middle" x="340" y="165">Tool Call vs Direct Output</text>

                {/* Dynamic Tool Loop Edge */}
                <path d="M 260 152 C 180 152, 180 220, 260 220" fill="none" stroke="#00E5FF" strokeDasharray="4 3" strokeWidth="1.5" />
                <text fill="#00E5FF" fontFamily="JetBrains Mono" fontSize="8" textAnchor="middle" x="180" y="190">Tool Check</text>

                {/* Node 5: Tool Execution Node */}
                <rect fill="#09090E" height="38" rx="6" stroke="#00E5FF" strokeWidth="1.5" width="160" x="260" y="200" />
                <text fill="#FFFFFF" fontFamily="JetBrains Mono" fontSize="9" textAnchor="middle" x="340" y="219">Local MCP Tool Executor</text>
                <text fill="#8E8EA0" fontFamily="JetBrains Mono" fontSize="8" textAnchor="middle" x="340" y="231">JSON Result Injected to State</text>

                {/* Loop back upward from tool */}
                <path d="M 390 200 L 390 174" fill="none" stroke="#00E5FF" strokeWidth="1.5" />
              </svg>

              {/* Active Telemetry Bar below SVG */}
              <div className="mt-2 pt-2 border-t border-[#161622]/80 flex items-center justify-between text-[10px] text-[#8E8EA0]">
                <span>Status: <strong className="text-emerald-400">Graph Ready</strong></span>
                <span>End-to-End Latency: <strong className="text-white">124ms</strong></span>
                <span>Context Precision: <strong className="text-[#00E5FF]">99.2%</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
