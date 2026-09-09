import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { LEADERBOARD_DATA } from '../data/leaderboardData';
import { 
  ArrowLeft, 
  Trophy, 
  ExternalLink, 
  GitCompare, 
  Bookmark, 
  Share2, 
  Check, 
  Copy, 
  Cpu, 
  Zap, 
  Clock, 
  ShieldCheck, 
  Layers, 
  Code2, 
  CheckCircle2, 
  TrendingUp,
  Sparkles,
  DollarSign
} from 'lucide-react';
import SuperpowerBadge from '../components/leaderboard/SuperpowerBadge';

export default function LeaderboardDetailPage({ 
  bookmarks = [], 
  onToggleBookmark,
  selectedForCompare = [],
  onToggleCompare
}) {
  const { slug } = useParams();
  const navigate = useNavigate();

  const model = LEADERBOARD_DATA.find((m) => m.slug === slug) || LEADERBOARD_DATA[0];

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const isBookmarked = bookmarks.includes(model.id);
  const isCompared = selectedForCompare.some((m) => m.id === model.id);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    const code = `import openai

client = openai.OpenAI(
    base_url="https://api.orbit.club/v1",
    api_key="ORBIT_API_KEY"
)

response = client.chat.completions.create(
    model="${model.id}",
    messages=[{"role": "user", "content": "Analyze system requirements and architecture."}]
)
print(response.choices[0].message.content)`;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const relatedModels = LEADERBOARD_DATA.filter((m) => m.id !== model.id && (m.category === model.category || m.org === model.org)).slice(0, 3);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#6E56CF]/30 pb-20">
      {/* Top Breadcrumb Navigation */}
      <div className="border-b border-[#1C1C1F] bg-[#09090b]/80 backdrop-blur-md sticky top-[57px] z-30 py-2.5 px-4 sm:px-8">
        <div className="mx-auto max-w-[1440px] flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-[#A1A1AA] overflow-x-auto scrollbar-none whitespace-nowrap">
            <Link to="/" className="hover:text-white transition-colors flex items-center gap-1">
              <Trophy size={13} className="text-[#6E56CF]" />
              <span>Leaderboard</span>
            </Link>
            <span className="text-[#3F3F46]">/</span>
            <span className="text-[#71717A]">{model.category}</span>
            <span className="text-[#3F3F46]">/</span>
            <span className="text-white font-medium">{model.name}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#232326] bg-[#131316] text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
            >
              {copiedLink ? <Check size={12} className="text-[#10B981]" /> : <Share2 size={12} />}
              <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share'}</span>
            </button>

            <button
              onClick={() => onToggleBookmark(model.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                isBookmarked
                  ? 'bg-[#6E56CF]/20 border-[#6E56CF]/50 text-[#A78BFA]'
                  : 'bg-[#131316] border-[#232326] text-[#A1A1AA] hover:text-white'
              }`}
            >
              <Bookmark size={12} className={isBookmarked ? 'fill-[#A78BFA]' : ''} />
              <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 pt-6 sm:pt-8">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#A1A1AA] hover:text-white mb-6 transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Leaderboard Rankings</span>
        </Link>

        {/* Model Hero Header */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6 pb-6 border-b border-[#1C1C1F]">
          <div className="max-w-3xl">
            {/* Context & Badges */}
            <div className="flex items-center gap-2.5 mb-3 flex-wrap">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#6E56CF] text-white font-bold font-mono text-xs">
                #{model.rank}
              </span>
              <span className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">
                {model.org}
              </span>
              <span className="text-[#3F3F46]">•</span>
              <span className="text-xs text-[#A78BFA] font-medium bg-[#6E56CF]/10 px-2.5 py-0.5 rounded-full border border-[#6E56CF]/20">
                {model.category}
              </span>
              {model.superpower && (
                <SuperpowerBadge superpower={model.superpower} category={model.category} />
              )}
              {model.isOpenWeights && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Open Weights
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-2">
              {model.name}
            </h1>
            <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed max-w-2xl">
              {model.fullDescription}
            </p>
          </div>

          {/* Action Box */}
          <div className="w-full lg:w-72 p-5 rounded-2xl border border-[#232326] bg-[#111115] shrink-0">
            <span className="text-[11px] uppercase tracking-wider text-[#71717A] font-semibold block">
              Arena ELO Rating
            </span>
            <div className="text-3xl font-bold font-mono text-white my-1 flex items-baseline gap-2">
              <span>{model.arenaElo}</span>
              <span className="text-xs font-semibold text-[#10B981]">{model.eloChange}</span>
            </div>
            <span className="text-xs text-[#A1A1AA] flex items-center justify-between mb-4">
              <span>Monthly Active: <strong className="text-white font-mono">{model.monthlyVisits}</strong></span>
              <span className="text-[#10B981] font-mono text-xs flex items-center gap-1">
                <TrendingUp size={11} /> {model.growth}
              </span>
            </span>

            <div className="space-y-2">
              <a
                href={model.website}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#6E56CF] hover:bg-[#7C66DC] text-white flex items-center justify-center gap-1.5 shadow-lg shadow-[#6E56CF]/25 transition-all active:scale-95"
              >
                <span>Visit Official Website</span>
                <ExternalLink size={13} />
              </a>

              <button
                onClick={() => onToggleCompare(model)}
                className={`w-full py-2 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  isCompared
                    ? 'bg-[#10B981]/20 border-[#10B981]/40 text-[#34D399]'
                    : 'bg-[#18181c] border-[#27272e] text-[#A1A1AA] hover:text-white hover:border-[#3a3a40]'
                }`}
              >
                <GitCompare size={13} />
                <span>{isCompared ? 'Selected for Comparison' : 'Compare with Other Models'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics Quad - Tightened vertical rhythm */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 py-6 border-b border-[#1C1C1F]">
          <div className="p-4 rounded-xl border border-[#232326] bg-[#111115]">
            <div className="flex items-center gap-2 text-[#71717A] text-xs font-semibold uppercase mb-1">
              <Trophy size={13} className="text-[#F5A623]" /> Coding Benchmark
            </div>
            <div className="text-xl font-bold font-mono text-white">{model.codingScore}</div>
            <span className="text-[11px] text-[#A1A1AA]">HumanEval / SWE-bench</span>
          </div>

          <div className="p-4 rounded-xl border border-[#232326] bg-[#111115]">
            <div className="flex items-center gap-2 text-[#71717A] text-xs font-semibold uppercase mb-1">
              <Cpu size={13} className="text-[#00E5FF]" /> Context Window
            </div>
            <div className="text-xl font-bold font-mono text-white">{model.contextWindow}</div>
            <span className="text-[11px] text-[#A1A1AA]">Native attention span</span>
          </div>

          <div className="p-4 rounded-xl border border-[#232326] bg-[#111115]">
            <div className="flex items-center gap-2 text-[#71717A] text-xs font-semibold uppercase mb-1">
              <Zap size={13} className="text-[#10B981]" /> Output Speed
            </div>
            <div className="text-xl font-bold font-mono text-white">{model.outputSpeed}</div>
            <span className="text-[11px] text-[#A1A1AA]">Average generation rate</span>
          </div>

          <div className="p-4 rounded-xl border border-[#232326] bg-[#111115]">
            <div className="flex items-center gap-2 text-[#71717A] text-xs font-semibold uppercase mb-1">
              <DollarSign size={13} className="text-[#A78BFA]" /> Pricing
            </div>
            <div className="text-xl font-bold font-mono text-white truncate">{model.price.split(' ')[0]}</div>
            <span className="text-[11px] text-[#A1A1AA] truncate">{model.price}</span>
          </div>
        </div>

        {/* Detailed Sections: Benchmarks + Specs (Continuous flow) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6">
          {/* Left 7 Cols: Benchmarks & Capabilities */}
          <div className="lg:col-span-7 space-y-6">
            {/* Benchmark Scores */}
            <div className="p-6 rounded-2xl border border-[#232326] bg-[#111115]">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Trophy size={16} className="text-[#6E56CF]" />
                Standardized Benchmark Scores
              </h3>
              <div className="space-y-3">
                {model.benchmarks.map((bm, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#16161c] border border-[#232326]">
                    <div>
                      <span className="font-semibold text-xs text-white block">{bm.name}</span>
                      <span className="text-[11px] text-[#A78BFA] font-medium">{bm.rank}</span>
                    </div>
                    <span className="text-base font-bold font-mono text-white">{bm.score}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Capabilities */}
            <div className="p-6 rounded-2xl border border-[#232326] bg-[#111115]">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                Core Capabilities &amp; Strengths
              </h3>
              <ul className="space-y-2.5 text-xs text-[#E4E4E7]">
                {model.keyFeatures.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-[#6E56CF] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Code Snippet */}
            <div className="rounded-2xl border border-[#232326] bg-[#0c0c0f] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#141418] border-b border-[#232326]">
                <span className="text-xs font-mono text-[#A1A1AA] flex items-center gap-2">
                  <Code2 size={14} className="text-[#6E56CF]" />
                  api_inference_example.py
                </span>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 text-[11px] text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
                >
                  {copiedCode ? <Check size={12} className="text-[#10B981]" /> : <Copy size={12} />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-[#E4E4E7] overflow-x-auto">
{`import openai

# Call ${model.name} via AI Orbit routing gateway
client = openai.OpenAI(
    base_url="https://api.orbit.club/v1",
    api_key="YOUR_ORBIT_API_KEY"
)

response = client.chat.completions.create(
    model="${model.id}",
    messages=[
        {"role": "system", "content": "You are an expert system architect."},
        {"role": "user", "content": "Design an event-driven telemetry ingest pipeline."}
    ],
    temperature=0.2
)

print(response.choices[0].message.content)`}
              </pre>
            </div>
          </div>

          {/* Right 5 Cols: Technical Specs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl border border-[#232326] bg-[#111115] space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Technical Specifications
              </h3>
              <div className="divide-y divide-[#1F1F24] text-xs">
                <div className="flex justify-between py-2.5">
                  <span className="text-[#71717A]">Input Token Pricing</span>
                  <span className="text-white font-mono">{model.specs.inputPrice}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-[#71717A]">Output Token Pricing</span>
                  <span className="text-white font-mono">{model.specs.outputPrice}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-[#71717A]">Context Window</span>
                  <span className="text-[#A78BFA] font-mono font-bold">{model.specs.contextWindow}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-[#71717A]">Max Output Tokens</span>
                  <span className="text-white font-mono">{model.specs.maxOutput}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-[#71717A]">Knowledge Cutoff</span>
                  <span className="text-white">{model.specs.cutoff}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-[#71717A]">Supported Modalities</span>
                  <span className="text-white text-right">{model.specs.modalities}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-[#71717A]">Average Throughput</span>
                  <span className="text-[#10B981] font-mono">{model.specs.speed}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-[#71717A]">First-Token Latency</span>
                  <span className="text-white font-mono">{model.specs.ttft}</span>
                </div>
              </div>
            </div>

            {/* Related Models */}
            <div className="p-6 rounded-2xl border border-[#232326] bg-[#111115]">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                Comparable Systems
              </h3>
              <div className="space-y-3">
                {relatedModels.map((rel) => (
                  <Link
                    key={rel.id}
                    to={`/leaderboard/${rel.slug}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#16161c] border border-[#232326] hover:border-[#3b3b44] transition-colors group"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-white group-hover:text-[#A78BFA] transition-colors">
                          {rel.name}
                        </span>
                        <span className="text-[10px] text-[#71717A]">#{rel.rank}</span>
                      </div>
                      <span className="text-[11px] text-[#71717A]">{rel.org} • {rel.category}</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-white">{rel.arenaElo} Elo</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
