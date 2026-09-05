import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LEADERBOARD_DATA } from '../data/leaderboardData';
import { ArrowLeft, Trophy, X, GitCompare, ExternalLink, CheckCircle2 } from 'lucide-react';

export default function LeaderboardComparePage({ selectedForCompare = [], onToggleCompare, onClearCompare }) {
  const navigate = useNavigate();

  // If no items selected, default to comparing top 2 models (Claude 3.7 vs o3-mini)
  const modelsToCompare = selectedForCompare.length >= 2 
    ? selectedForCompare 
    : [LEADERBOARD_DATA[0], LEADERBOARD_DATA[1]];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#6E56CF]/30 pb-20">
      {/* Top Breadcrumb */}
      <div className="border-b border-[#1C1C1F] bg-[#09090b]/80 backdrop-blur-md sticky top-[57px] z-30 py-2.5 px-4 sm:px-8">
        <div className="mx-auto max-w-[1440px] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[#A1A1AA]">
            <Link to="/" className="hover:text-white transition-colors flex items-center gap-1">
              <Trophy size={13} className="text-[#6E56CF]" />
              <span>Leaderboard</span>
            </Link>
            <span className="text-[#3F3F46]">/</span>
            <span className="text-white font-medium">Head-to-Head Comparison</span>
          </div>
          {selectedForCompare.length > 0 && (
            <button
              onClick={onClearCompare}
              className="text-xs text-[#71717A] hover:text-white transition-colors"
            >
              Clear selections
            </button>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 pt-6 sm:pt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#A1A1AA] hover:text-white mb-6 transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Leaderboard</span>
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            Model Benchmarking Matrix
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1AA]">
            Evaluating {modelsToCompare.length} artificial intelligence systems across standardized metrics, inference speed, and token cost.
          </p>
        </div>

        {/* Matrix Card */}
        <div className="rounded-2xl border border-[#232326] bg-[#111115] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#16161c] border-b border-[#232326]">
                  <th className="p-4 text-[11px] uppercase tracking-wider text-[#71717A] font-semibold w-1/4">
                    Evaluation Dimension
                  </th>
                  {modelsToCompare.map((m) => (
                    <th key={m.id} className="p-4 w-1/3">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-base text-white">{m.name}</span>
                          {selectedForCompare.some((item) => item.id === m.id) && (
                            <button
                              onClick={() => onToggleCompare(m)}
                              className="text-[#71717A] hover:text-red-400 p-1"
                              title="Remove"
                            >
                              <X size={13} />
                            </button>
                          )}
                        </div>
                        <span className="text-xs text-[#A1A1AA] font-mono">{m.org} • {m.category}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-mono font-bold text-[#F5A623]">{m.arenaElo} Elo</span>
                          <span className="text-[10px] text-[#10B981] font-mono">{m.eloChange}</span>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F1F24] text-[#E4E4E7]">
                <tr>
                  <td className="p-4 text-[#71717A] font-medium">LMSYS Arena Global Rank</td>
                  {modelsToCompare.map((m) => (
                    <td key={m.id} className="p-4 font-mono font-bold text-white text-sm">
                      #{m.rank}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-[#71717A] font-medium">MMLU Pro Reasoning</td>
                  {modelsToCompare.map((m) => (
                    <td key={m.id} className="p-4 font-mono text-[#10B981] font-semibold">
                      {m.mmluPro}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-[#71717A] font-medium">Coding Benchmark (SWE-bench)</td>
                  {modelsToCompare.map((m) => (
                    <td key={m.id} className="p-4 font-mono text-[#A78BFA] font-bold">
                      {m.codingScore}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-[#71717A] font-medium">Mathematical Problem Solving</td>
                  {modelsToCompare.map((m) => (
                    <td key={m.id} className="p-4 font-mono font-semibold text-white">
                      {m.mathScore}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-[#71717A] font-medium">Output Throughput Speed</td>
                  {modelsToCompare.map((m) => (
                    <td key={m.id} className="p-4 font-mono">
                      {m.outputSpeed}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-[#71717A] font-medium">Context Window Size</td>
                  {modelsToCompare.map((m) => (
                    <td key={m.id} className="p-4 font-mono font-semibold text-white">
                      {m.contextWindow}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-[#71717A] font-medium">Inference Pricing</td>
                  {modelsToCompare.map((m) => (
                    <td key={m.id} className="p-4 font-mono text-xs">
                      {m.price}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-[#71717A] font-medium">License / Weight Access</td>
                  {modelsToCompare.map((m) => (
                    <td key={m.id} className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#1a1a20] border border-[#272730] text-[#E4E4E7]">
                        {m.license}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-[#71717A] font-medium">Primary Architecture Strengths</td>
                  {modelsToCompare.map((m) => (
                    <td key={m.id} className="p-4">
                      <ul className="space-y-1.5 text-xs text-[#A1A1AA]">
                        {m.keyFeatures.map((feat, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <CheckCircle2 size={13} className="text-[#6E56CF] mt-0.5 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-[#71717A] font-medium">Actions</td>
                  {modelsToCompare.map((m) => (
                    <td key={m.id} className="p-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/leaderboard/${m.slug}`}
                          className="px-3.5 py-1.5 rounded-xl bg-[#6E56CF] hover:bg-[#7C66DC] text-white font-semibold text-xs"
                        >
                          Full Profile
                        </Link>
                        <a
                          href={m.website}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg border border-[#232326] bg-[#16161c] text-[#A1A1AA] hover:text-white"
                          title="Visit website"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
