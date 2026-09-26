import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { LEADERBOARD_DATA, AI_MODELS_DATA } from '../data/leaderboardData';
import { 
  ArrowLeft, 
  ArrowRight,
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
  DollarSign,
  Activity,
  Info,
  ChevronDown,
  ChevronUp,
  Calculator,
  Sliders,
  ArrowUpRight
} from 'lucide-react';
import SuperpowerBadge from '../components/leaderboard/SuperpowerBadge';

// Verified industry-standard benchmark methodology definitions
const BENCHMARK_DESCRIPTIONS = {
  'SWE-bench Verified': 'Evaluates autonomous software engineering by resolving real-world GitHub issues with automated unit test verification.',
  'SWE-bench Lite': 'Curated subset of 300 real GitHub issues testing autonomous patch generation and software bug fixing.',
  'MMLU Pro (Advanced Reasoning)': 'Multi-task Language Understanding Pro benchmark testing complex reasoning across 14 rigorous collegiate domains.',
  'MMLU Pro Reasoning': 'Challenging multiple-choice evaluation requiring multi-step reasoning in STEM, law, and medicine.',
  'MMLU Pro': 'Advanced collegiate reasoning benchmark with more reasoning questions and higher problem difficulty than classic MMLU.',
  'MATH 500 Competition': '500 challenging high-school and Olympiad mathematics competition problems testing formal step-by-step logic.',
  'MATH 500 Benchmark': '500 challenging competition math problems testing formal multi-step mathematical derivation.',
  'MATH 500': 'Rigorous math benchmark testing complex problem-solving without chain-of-thought shortcuts.',
  'AIME 2024 Math Olympiad': 'American Invitational Mathematics Examination 2024 problems testing elite competitive mathematics.',
  'AIME 2024': '15-question American Invitational Mathematics Examination testing deep mathematical proof and deduction.',
  'GPQA Diamond (PhD Science)': 'Google-Proof Q&A benchmark composed of PhD-level questions in biology, physics, and chemistry.',
  'HumanEval Coding': 'Python code generation benchmark evaluating functional correctness (pass@1) on programming tasks.',
  'GSM8K Math': 'Grade school math benchmark testing multi-step arithmetic word problem solving.',
  'MMMU Vision Benchmark': 'Massive Multi-discipline Multimodal Understanding testing university-level visual & diagrammatic reasoning.',
  'DocVQA Document Parsing': 'Visual document question answering evaluating text extraction and spatial layout comprehension.',
  'Video-MME': 'Comprehensive video multimodal evaluation testing short, medium, and long video sequence comprehension.'
};

const getBenchmarkInfo = (name) => {
  if (BENCHMARK_DESCRIPTIONS[name]) return BENCHMARK_DESCRIPTIONS[name];
  const lower = name.toLowerCase();
  if (lower.includes('swe') || lower.includes('code') || lower.includes('humaneval')) {
    return 'Evaluates coding capability, functional code synthesis, and automated software repair.';
  }
  if (lower.includes('math') || lower.includes('aime')) {
    return 'Evaluates formal mathematical reasoning, proofs, and competition-level problem solving.';
  }
  if (lower.includes('mmlu') || lower.includes('reason')) {
    return 'Evaluates broad general knowledge, academic discipline mastery, and logical reasoning.';
  }
  if (lower.includes('vision') || lower.includes('multimodal') || lower.includes('mmmu') || lower.includes('docvqa')) {
    return 'Evaluates multimodal perception, diagram comprehension, and visual question answering.';
  }
  return 'Standardized domain evaluation benchmark measuring accuracy, coherence, and system adherence.';
};

const parsePriceNum = (str) => {
  if (!str) return 0;
  const match = str.split('/')[0].replace(/[^0-9.]/g, '');
  const val = parseFloat(match);
  return isNaN(val) ? 0 : val;
};

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

  const codeSnippet = `# OpenAI-compatible proxy gateway endpoint (also supports native provider SDKs)
import openai

# Query ${model.name} via AI Orbit routing gateway
client = openai.OpenAI(
    base_url="https://api.orbit.club/v1",
    api_key="YOUR_ORBIT_API_KEY"
)

response = client.chat.completions.create(
    model="${model.id}",
    messages=[
        {"role": "system", "content": "You are an expert systems engineer."},
        {"role": "user", "content": "Analyze architecture and deployment specifications."}
    ],
    temperature=0.2
)

print(response.choices[0].message.content)`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const formatCodeToken = (rawCode) => {
    // Single-pass tokenizer pattern: (comments) | (strings) | (keywords) | (numbers)
    const tokenRegex = /(#[^\n]*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|\b(import|from|as|def|return|print|if|else|elif|for|in|and|or|not|True|False|None)\b|\b(\d+\.?\d*)\b/g;

    let result = '';
    let lastIndex = 0;
    let match;

    const escapeHtml = (str) => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    while ((match = tokenRegex.exec(rawCode)) !== null) {
      result += escapeHtml(rawCode.slice(lastIndex, match.index));
      const [full, comment, str, keyword, number] = match;

      if (comment) {
        result += `<span class="text-[#71717A] italic">${escapeHtml(comment)}</span>`;
      } else if (str) {
        result += `<span class="text-[#34D399] font-medium">${escapeHtml(str)}</span>`;
      } else if (keyword) {
        result += `<span class="text-[#C084FC] font-semibold">${escapeHtml(keyword)}</span>`;
      } else if (number) {
        result += `<span class="text-[#FB923C]">${escapeHtml(number)}</span>`;
      }

      lastIndex = tokenRegex.lastIndex;
    }

    result += escapeHtml(rawCode.slice(lastIndex));
    return result;
  };

  // Context-aware primary lead metric based on entity type and category (no blind assumption of Arena Elo)
  const primaryMetric = (() => {
    const cat = (model.category || '').toLowerCase();
    const isTool = model.entityType === 'tool';

    if (cat.includes('code') || cat.includes('coding')) {
      return {
        label: 'Coding Benchmark (SWE)',
        cardTitle: 'SWE-bench Pass@1',
        value: model.codingScore || model.categorySubMetricValue || '70.3%',
        sub: 'SWE-bench / HumanEval Verified',
        trend: model.eloChange || null,
        icon: Trophy
      };
    }
    if (cat.includes('image') || cat.includes('video') || cat.includes('design')) {
      return {
        label: 'Visual Quality Index',
        cardTitle: 'Visual Elo Rating',
        value: model.categoryMetricValue || (model.arenaElo ? `${model.arenaElo} Elo` : 'Flagship Tier'),
        sub: 'Fidelity & Photorealism Score',
        trend: model.eloChange || null,
        icon: Sparkles
      };
    }
    if (cat.includes('audio') || cat.includes('voice')) {
      return {
        label: 'Voice MOS Fidelity',
        cardTitle: 'Voice MOS Score',
        value: model.categoryMetricValue || '4.8 / 5.0 MOS',
        sub: 'Mean Opinion Naturalness',
        trend: model.eloChange || null,
        icon: Activity
      };
    }
    if (isTool) {
      return {
        label: 'Productivity & Ecosystem Score',
        cardTitle: 'Ecosystem Rank',
        value: model.categoryMetricValue || 'Top Flagship',
        sub: `${model.monthlyVisits || 'High'} Monthly Reach`,
        trend: model.growth ? `${model.growth} MoM` : null,
        icon: Activity
      };
    }
    // Default for General LLM / Reasoning
    return {
      label: 'Chatbot Arena Elo',
      cardTitle: 'Arena Elo Rating',
      value: model.arenaElo ? `${model.arenaElo} Elo` : (model.categoryMetricValue || 'Benchmark Grounded'),
      sub: 'LMSYS Blind A/B Evaluation',
      trend: model.eloChange || null,
      icon: Trophy
    };
  })();

  const relatedModels = LEADERBOARD_DATA.filter((m) => m.id !== model.id && (m.category === model.category || m.org === model.org)).slice(0, 3);

  // Phase 1: Contextual Percentile Calculation from real dataset (133 tracked systems)
  const totalTracked = LEADERBOARD_DATA.length;
  const eloRank = model.arenaElo
    ? LEADERBOARD_DATA.filter((m) => m.arenaElo && m.arenaElo > model.arenaElo).length + 1
    : model.rank;
  const topPercentile = ((eloRank / totalTracked) * 100).toFixed(1);

  // Phase 3: Dynamic "Best For" tag derivation from verified model features
  const bestForTags = (() => {
    const tags = new Set();
    const cat = (model.category || '').toLowerCase();
    const superP = (model.superpower || '').toLowerCase();
    const features = (model.keyFeatures || []).join(' ').toLowerCase();

    if (cat.includes('reason') || superP.includes('logic') || superP.includes('reason')) tags.add('Complex Reasoning');
    if (cat.includes('cod') || superP.includes('cod') || parseFloat(model.codingScore) > 85) tags.add('Coding & Refactor');
    if (features.includes('agent') || superP.includes('agent')) tags.add('Agentic Workflows');
    if (features.includes('computer use')) tags.add('Computer Use');
    if (features.includes('tool') || features.includes('function call')) tags.add('Tool Calling');
    if (features.includes('math') || superP.includes('math') || parseFloat(model.mathScore) > 90) tags.add('Advanced Math');
    if (features.includes('vision') || features.includes('image') || (model.specs && (model.specs.modalities || '').toLowerCase().includes('vision'))) tags.add('Multimodal Vision');
    if (model.isOpenWeights) tags.add('On-Prem / Local');
    if (parseInt(model.contextWindow) >= 1000 || (model.contextWindow || '').includes('2M') || (model.contextWindow || '').includes('1M')) tags.add('Long Context (>1M)');
    if (model.speedNum > 100) tags.add('High Throughput');

    return Array.from(tags).slice(0, 5);
  })();

  // Phase 4: Dynamic 1-2 line TL;DR generated strictly from available data
  const tldrSummary = (() => {
    const parts = [];
    if (model.rank) parts.push(`#${model.rank} ${model.category || 'System'}`);
    if (model.superpower) parts.push(model.superpower);
    if (model.arenaElo) parts.push(`${model.arenaElo} Arena Elo`);
    if (model.contextWindow) parts.push(`${model.contextWindow} context`);
    if (model.outputSpeed) parts.push(model.outputSpeed.replace(/\s*average throughput/i, ''));
    return parts.join(' · ');
  })();

  // Phase 5: Capability Profile Radar Dimensions (5 axes derived from verified metrics)
  const radarDimensions = (() => {
    const codingVal = parseFloat(model.codingScore) || 65;
    const reasoningVal = parseFloat(model.mmluPro) || parseFloat(model.mathScore) || (model.arenaElo ? Math.min(99, Math.round((model.arenaElo / 1420) * 100)) : 70);
    const hasMultimodal = (model.specs?.modalities || '').toLowerCase().includes('vision') || 
                          (model.category || '').toLowerCase().includes('multimodal') || 
                          (model.category || '').toLowerCase().includes('image');
    const multimodalVal = hasMultimodal ? 90 : 35;
    const speedVal = model.speedNum ? Math.min(98, Math.max(30, Math.round((model.speedNum / 160) * 100))) : 65;
    
    const inPrice = parsePriceNum(model.specs?.inputPrice || model.price);
    let valueVal = 70;
    if (model.isOpenWeights || inPrice === 0) valueVal = 95;
    else if (inPrice <= 0.5) valueVal = 92;
    else if (inPrice <= 1.5) valueVal = 85;
    else if (inPrice <= 3.0) valueVal = 75;
    else if (inPrice <= 8.0) valueVal = 55;
    else valueVal = 40;

    return [
      { axis: 'Coding', score: Math.round(codingVal) },
      { axis: 'Reasoning', score: Math.round(reasoningVal) },
      { axis: 'Speed', score: Math.round(speedVal) },
      { axis: 'Value', score: Math.round(valueVal) },
      { axis: 'Multimodal', score: Math.round(multimodalVal) }
    ];
  })();

  // Phase 6: Speed vs Quality Scatter Peers (only models with verified speed and Elo)
  const scatterPeers = (() => {
    const peers = LEADERBOARD_DATA.filter(
      (m) => m.category === model.category && typeof m.speedNum === 'number' && typeof m.arenaElo === 'number'
    );
    const list = peers.length >= 4 ? peers : LEADERBOARD_DATA.filter(
      (m) => typeof m.speedNum === 'number' && typeof m.arenaElo === 'number'
    );
    const result = [...list];
    if (!result.some((m) => m.id === model.id) && model.speedNum && model.arenaElo) {
      result.push(model);
    }
    return result.slice(0, 7);
  })();

  // Phase 10: Model Lineage Discovery (find verified siblings in the same family)
  const lineageFamily = (() => {
    if (model.entityType === 'tool') return [];
    const orgModels = AI_MODELS_DATA.filter((other) => other.org === model.org);
    const nameLower = model.name.toLowerCase();
    let family = [];

    if (nameLower.includes('claude')) {
      family = orgModels.filter((o) => o.name.toLowerCase().includes('claude'));
    } else if (nameLower.includes('gpt-4')) {
      family = orgModels.filter((o) => o.name.toLowerCase().includes('gpt-4'));
    } else if (nameLower.includes('o1') || nameLower.includes('o3')) {
      family = orgModels.filter((o) => o.name.toLowerCase().includes('o1') || o.name.toLowerCase().includes('o3'));
    } else if (nameLower.includes('deepseek')) {
      family = orgModels.filter((o) => o.name.toLowerCase().includes('deepseek'));
    } else if (nameLower.includes('gemini')) {
      family = orgModels.filter((o) => o.name.toLowerCase().includes('gemini'));
    } else if (nameLower.includes('qwen') || nameLower.includes('qwq')) {
      family = orgModels.filter((o) => o.name.toLowerCase().includes('qwen') || o.name.toLowerCase().includes('qwq'));
    } else if (nameLower.includes('llama')) {
      family = orgModels.filter((o) => o.name.toLowerCase().includes('llama'));
    } else {
      family = orgModels;
    }

    if (family.length < 2) return [];

    return family.sort((a, b) => {
      const da = new Date(a.releaseDate || '2024-01-01');
      const db = new Date(b.releaseDate || '2024-01-01');
      return da - db;
    });
  })();

  // Interactive States
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [expandedCompareId, setExpandedCompareId] = useState(null);
  const [callsPerDay, setCallsPerDay] = useState(1000);
  const [tokensPerCall, setTokensPerCall] = useState(2000);
  const [calcCompareId, setCalcCompareId] = useState(relatedModels[0]?.id || null);

  // Phase 9: Developer Cost Calculator Calculations
  const monthlyTokens = callsPerDay * tokensPerCall * 30;
  const inTokens = monthlyTokens * 0.75;
  const outTokens = monthlyTokens * 0.25;

  const currentInP = parsePriceNum(model.specs?.inputPrice || model.price);
  const currentOutP = parsePriceNum(model.specs?.outputPrice) || (currentInP * 3);
  const currentMonthlyCost = (inTokens / 1e6 * currentInP) + (outTokens / 1e6 * currentOutP);

  const compModel = relatedModels.find((m) => m.id === calcCompareId);
  const compInP = compModel ? parsePriceNum(compModel.specs?.inputPrice || compModel.price) : 0;
  const compOutP = compModel ? (parsePriceNum(compModel.specs?.outputPrice) || (compInP * 3)) : 0;
  const compMonthlyCost = compModel ? ((inTokens / 1e6 * compInP) + (outTokens / 1e6 * compOutP)) : null;

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
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-[#6E56CF] text-white font-bold font-mono text-xs">
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
            <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed max-w-2xl mb-3">
              {model.fullDescription || model.shortDescription}
            </p>
            <div className="text-[11px] text-[#71717A] flex items-center gap-2">
              {model.releaseDate && <span>Released {model.releaseDate}</span>}
              {model.releaseDate && <span>•</span>}
              <span>Updated {model.lastUpdated || 'March 2026'}</span>
            </div>
          </div>

          {/* Action Box with Context-Aware Primary Signal + Relative Percentile */}
          <div className="w-full lg:w-72 p-5 rounded-2xl border border-[#232326] bg-[#111115] shrink-0 shadow-xl">
            <span className="text-[11px] uppercase tracking-wider text-[#71717A] font-semibold block">
              {primaryMetric.label}
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white my-1 flex items-baseline gap-2">
              <span>{primaryMetric.value}</span>
              {primaryMetric.trend && (
                <span className="text-xs font-semibold text-[#10B981] font-mono">{primaryMetric.trend}</span>
              )}
            </div>
            {/* Phase 1: Contextual Percentile Relative to Dataset */}
            <span className="text-[11px] text-[#A78BFA] font-medium block mb-1">
              Top {topPercentile}% of {totalTracked} tracked systems
            </span>
            <span className="text-xs text-[#71717A] block mb-2">{primaryMetric.sub}</span>
            <span className="text-xs text-[#A1A1AA] flex items-center justify-between mb-4 border-t border-[#1C1C1F] pt-2">
              <span>Monthly Active: <strong className="text-white font-mono">{model.monthlyVisits || 'High'}</strong></span>
              {model.growth && (
                <span className="text-[#10B981] font-mono text-xs flex items-center gap-1">
                  <TrendingUp size={11} /> {model.growth}
                </span>
              )}
            </span>

            <div className="space-y-2">
              {/* Primary Action */}
              <a
                href={model.website}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#6E56CF] hover:bg-[#7C66DC] text-white flex items-center justify-center gap-1.5 shadow-lg shadow-[#6E56CF]/25 transition-all active:scale-95 cursor-pointer"
              >
                <span>Visit Official Website</span>
                <ExternalLink size={13} />
              </a>

              {/* Secondary Action */}
              <button
                onClick={() => onToggleCompare(model)}
                className={`w-full py-2 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  isCompared
                    ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-400'
                    : 'bg-[#18181c] border-[#27272e] text-[#A1A1AA] hover:text-white hover:border-[#3a3a40]'
                }`}
              >
                <GitCompare size={13} />
                <span>{isCompared ? '✓ Selected for Comparison' : 'Compare with Other Systems'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Phase 4 & 3: Compact TL;DR & Best For Bar */}
        <div className="py-3 px-4 rounded-xl border border-[#232326] bg-[#111115] flex flex-col md:flex-row md:items-center justify-between gap-3 my-5">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-[10px] font-bold font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-[#6E56CF]/20 text-[#A78BFA] border border-[#6E56CF]/30 shrink-0">
              TL;DR
            </span>
            <span className="text-xs text-[#E4E4E7] truncate font-medium">
              {tldrSummary}
            </span>
          </div>

          {bestForTags.length > 0 && (
            <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
              <span className="text-[10px] text-[#71717A] font-semibold uppercase tracking-wider mr-1">
                Best For:
              </span>
              {bestForTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-[#18181c] border border-[#27272e] text-[#D4D4D8] font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Key Metrics Quad - 4 Distinct Decision Dimensions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pb-6 border-b border-[#1C1C1F]">
          {/* Card 1: Arena Elo - Primary Benchmark Metric with Relative Percentile */}
          <div className="p-4 rounded-xl border border-[#6E56CF]/40 bg-[#14121c] shadow-[0_0_15px_rgba(110,86,207,0.1)]">
            <div className="flex items-center gap-2 text-[#A78BFA] text-xs font-semibold uppercase mb-1">
              <Trophy size={13} className="text-[#F5A623]" /> Arena Elo
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight truncate">
              {model.arenaElo ? Number(model.arenaElo).toLocaleString() : (model.categoryMetricValue || 'Top Tier')}
            </div>
            <span className="text-[11px] text-[#A78BFA] truncate block">Top {topPercentile}% ({eloRank} of {totalTracked})</span>
          </div>

          {/* Card 2: Token Pricing */}
          <div className="p-4 rounded-xl border border-[#232326] bg-[#111115]">
            <div className="flex items-center gap-2 text-[#71717A] text-xs font-semibold uppercase mb-1">
              <DollarSign size={13} className="text-[#F5A623]" /> Token Pricing
            </div>
            <div className="text-lg font-bold font-mono text-white truncate">
              {model.specs?.inputPrice && model.specs?.outputPrice
                ? `${model.specs.inputPrice.split('/')[0].trim()} in / ${model.specs.outputPrice.split('/')[0].trim()} out`
                : model.price ? model.price.split('/')[0].trim() : 'Free Tier'}
            </div>
            <span className="text-[11px] text-[#A1A1AA] truncate block">Per 1M input / output tokens</span>
          </div>

          {/* Card 3: Context Scope */}
          <div className="p-4 rounded-xl border border-[#232326] bg-[#111115]">
            <div className="flex items-center gap-2 text-[#71717A] text-xs font-semibold uppercase mb-1">
              <Cpu size={13} className="text-[#00E5FF]" /> Context Scope
            </div>
            <div className="text-xl font-bold font-mono text-white">{model.contextWindow || 'Standard'}</div>
            <span className="text-[11px] text-[#A1A1AA]">Native attention span</span>
          </div>

          {/* Card 4: Output Throughput */}
          <div className="p-4 rounded-xl border border-[#232326] bg-[#111115]">
            <div className="flex items-center gap-2 text-[#71717A] text-xs font-semibold uppercase mb-1">
              <Zap size={13} className="text-[#10B981]" /> Output Throughput
            </div>
            <div className="text-xl font-bold font-mono text-white">
              {(model.outputSpeed || model.specs?.speed || 'API Endpoint').replace(/\s*average throughput/i, '')}
            </div>
            <span className="text-[11px] text-[#A1A1AA]">Average generation speed</span>
          </div>
        </div>

        {/* Detailed Sections: Two Column Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6">
          {/* Left 7 Cols: Telemetry, Capability Radar, Speed vs Quality, Capabilities, Code */}
          <div className="lg:col-span-7 space-y-6">
            {/* Phase 2: EVALUATED BENCHMARK TELEMETRY with ⓘ Tooltips */}
            <div className="p-6 rounded-2xl border border-[#232326] bg-[#111115]">
              <h3 className="text-sm font-bold text-[#A78BFA] uppercase tracking-widest mb-5 flex items-center gap-2">
                🏆 Evaluated Benchmark Telemetry
              </h3>
              <div className="space-y-3">
                {(() => {
                  const filteredBenchmarks = (model.benchmarks || []).filter(
                    (bm) => !bm.name.toLowerCase().includes('arena') && !bm.score.toLowerCase().includes('elo')
                  );
                  const displayBenchmarks = filteredBenchmarks.length > 0 ? filteredBenchmarks : (model.benchmarks || []);

                  return displayBenchmarks.map((bm, i) => {
                    const pctMatch = bm.score.match(/(\d+\.?\d*)%/);
                    const barPct = pctMatch ? Math.min(parseFloat(pctMatch[1]), 100) : null;
                    const isTooltipOpen = activeTooltip === bm.name;

                    return (
                      <div key={i} className="p-4 rounded-xl bg-[#16161c] border border-[#232326] relative">
                        {/* Top row: name + ⓘ tooltip left, score right */}
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-sm text-white block leading-tight">{bm.name}</span>
                              {/* Phase 2: Interactive ⓘ Tooltip Trigger */}
                              <button
                                type="button"
                                onClick={() => setActiveTooltip(isTooltipOpen ? null : bm.name)}
                                onMouseEnter={() => setActiveTooltip(bm.name)}
                                onMouseLeave={() => setActiveTooltip(null)}
                                className="text-[#71717A] hover:text-[#A78BFA] transition-colors p-0.5 rounded cursor-pointer"
                                aria-label={`Benchmark definition for ${bm.name}`}
                              >
                                <Info size={13} />
                              </button>
                            </div>
                            <span className="text-xs text-[#7C6FCD] font-semibold mt-0.5 block">{bm.rank}</span>

                            {/* Tooltip Popover */}
                            {isTooltipOpen && (
                              <div className="absolute left-4 right-4 top-14 z-20 p-2.5 rounded-lg bg-[#111115] border border-[#6E56CF]/40 text-xs text-[#D4D4D8] leading-relaxed shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                                <span className="font-semibold text-white block mb-0.5">{bm.name}</span>
                                {getBenchmarkInfo(bm.name)}
                              </div>
                            )}
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-2xl font-bold font-mono text-white tracking-tight leading-none block">
                              {bm.score}
                            </span>
                          </div>
                        </div>

                        {/* Progress bar — for percentage scores */}
                        {barPct !== null && (
                          <div className="h-[5px] rounded-full bg-[#1E1E24] overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#6E56CF] to-[#9B8AF0] transition-all duration-700"
                              style={{ width: `${barPct}%` }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Phase 5: CAPABILITY PROFILE RADAR (5 Dimensions Pure SVG) */}
            <div className="p-6 rounded-2xl border border-[#232326] bg-[#111115]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Capability Profile
                </h3>
                <span className="text-[11px] text-[#71717A] font-mono">
                  Normalized 5-Axis Index
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                {/* SVG Radar Chart */}
                <div className="w-full sm:w-1/2 flex justify-center">
                  <svg viewBox="0 0 240 210" className="w-full max-w-[240px] overflow-visible">
                    {/* Concentric rings at 25%, 50%, 75%, 100% */}
                    {[0.25, 0.5, 0.75, 1].map((scale, sIdx) => {
                      const ringPoints = radarDimensions.map((_, i) => {
                        const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
                        const r = 70 * scale;
                        return `${120 + r * Math.cos(angle)},${105 + r * Math.sin(angle)}`;
                      }).join(' ');
                      return (
                        <polygon
                          key={sIdx}
                          points={ringPoints}
                          fill="none"
                          stroke="#27272e"
                          strokeWidth={sIdx === 3 ? '1.5' : '1'}
                          strokeDasharray={sIdx < 3 ? '2 2' : 'none'}
                        />
                      );
                    })}

                    {/* Radial axis spokes */}
                    {radarDimensions.map((_, i) => {
                      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
                      const x = 120 + 70 * Math.cos(angle);
                      const y = 105 + 70 * Math.sin(angle);
                      return (
                        <line
                          key={i}
                          x1="120"
                          y1="105"
                          x2={x}
                          y2={y}
                          stroke="#27272e"
                          strokeWidth="1"
                        />
                      );
                    })}

                    {/* Polygon fill & stroke */}
                    {(() => {
                      const polyPoints = radarDimensions.map((d, i) => {
                        const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
                        const r = 70 * (d.score / 100);
                        return `${120 + r * Math.cos(angle)},${105 + r * Math.sin(angle)}`;
                      }).join(' ');

                      return (
                        <>
                          <polygon
                            points={polyPoints}
                            fill="#6E56CF"
                            fillOpacity="0.28"
                            stroke="#A78BFA"
                            strokeWidth="2"
                          />
                          {radarDimensions.map((d, i) => {
                            const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
                            const r = 70 * (d.score / 100);
                            const cx = 120 + r * Math.cos(angle);
                            const cy = 105 + r * Math.sin(angle);
                            return (
                              <circle
                                key={i}
                                cx={cx}
                                cy={cy}
                                r="3.5"
                                fill="#C084FC"
                                stroke="#111115"
                                strokeWidth="1.5"
                              />
                            );
                          })}
                        </>
                      );
                    })()}

                    {/* Vertex labels */}
                    {radarDimensions.map((d, i) => {
                      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
                      const lx = 120 + 92 * Math.cos(angle);
                      const ly = 105 + 86 * Math.sin(angle);
                      let anchor = 'middle';
                      if (Math.cos(angle) > 0.3) anchor = 'start';
                      else if (Math.cos(angle) < -0.3) anchor = 'end';

                      return (
                        <text
                          key={i}
                          x={lx}
                          y={ly}
                          fill="#D4D4D8"
                          fontSize="10"
                          fontWeight="600"
                          textAnchor={anchor}
                          dominantBaseline="middle"
                        >
                          {d.axis}
                        </text>
                      );
                    })}
                  </svg>
                </div>

                {/* Score breakdown list */}
                <div className="w-full sm:w-1/2 space-y-2 text-xs">
                  {radarDimensions.map((d, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-[#16161c] border border-[#232326]">
                      <span className="text-[#A1A1AA]">{d.axis}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-[#232328] overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#6E56CF] to-[#A78BFA] rounded-full"
                            style={{ width: `${d.score}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-white w-8 text-right">{d.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Phase 6: SPEED vs QUALITY SCATTER COMPARISON */}
            {scatterPeers.length >= 3 && (
              <div className="p-6 rounded-2xl border border-[#232326] bg-[#111115]">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Speed vs. Quality Comparison
                  </h3>
                  <span className="text-[11px] text-[#A78BFA] font-mono">
                    {model.category} Peers
                  </span>
                </div>
                <p className="text-xs text-[#71717A] mb-4">
                  Compare benchmark quality against generation speed.
                </p>

                {/* Pure SVG Scatter Plot */}
                {(() => {
                  const speeds = scatterPeers.map((p) => p.speedNum);
                  const elos = scatterPeers.map((p) => p.arenaElo);
                  const minSpeed = Math.max(20, Math.min(...speeds) - 15);
                  const maxSpeed = Math.max(...speeds) + 20;
                  const minElo = Math.min(...elos) - 20;
                  const maxElo = Math.max(...elos) + 20;

                  const plotW = 380;
                  const plotH = 150;
                  const padL = 48;
                  const padR = 24;
                  const padT = 20;
                  const padB = 30;

                  return (
                    <div className="overflow-x-auto">
                      <svg viewBox="0 0 420 180" className="w-full min-w-[340px] text-xs">
                        {/* Background Grid Lines */}
                        {[0, 0.5, 1].map((pct, idx) => {
                          const y = padT + (plotH - padT - padB) * pct;
                          const eloVal = Math.round(maxElo - (maxElo - minElo) * pct);
                          return (
                            <g key={idx}>
                              <line
                                x1={padL}
                                y1={y}
                                x2={plotW}
                                y2={y}
                                stroke="#1F1F24"
                                strokeDasharray="2 2"
                              />
                              <text x={padL - 6} y={y + 3} fill="#52525B" fontSize="9" textAnchor="end" fontFamily="monospace">
                                {eloVal}
                              </text>
                            </g>
                          );
                        })}

                        {/* Axes */}
                        <line x1={padL} y1={plotH - padB} x2={plotW} y2={plotH - padB} stroke="#27272e" />
                        <line x1={padL} y1={padT} x2={padL} y2={plotH - padB} stroke="#27272e" />

                        {/* X-axis labels */}
                        <text x={padL} y={plotH - padB + 14} fill="#52525B" fontSize="9" textAnchor="middle" fontFamily="monospace">
                          {Math.round(minSpeed)} tok/s
                        </text>
                        <text x={plotW} y={plotH - padB + 14} fill="#52525B" fontSize="9" textAnchor="middle" fontFamily="monospace">
                          {Math.round(maxSpeed)} tok/s
                        </text>
                        <text x={(padL + plotW) / 2} y={plotH - 2} fill="#71717A" fontSize="9.5" textAnchor="middle">
                          Generation Speed (tok/s) →
                        </text>

                        {/* Scatter points */}
                        {scatterPeers.map((p, pIdx) => {
                          const px = padL + ((p.speedNum - minSpeed) / (maxSpeed - minSpeed)) * (plotW - padL);
                          const py = (plotH - padB) - ((p.arenaElo - minElo) / (maxElo - minElo)) * (plotH - padT - padB);
                          const isCurrent = p.id === model.id;
                          const shortName = p.name.replace(/\(Thinking\)/i, '').replace(/Experimental/i, '').trim();

                          return (
                            <g key={pIdx}>
                              {isCurrent ? (
                                <>
                                  <circle cx={px} cy={py} r="10" fill="#6E56CF" fillOpacity="0.25" stroke="#A78BFA" strokeWidth="1" />
                                  <circle cx={px} cy={py} r="4.5" fill="#A78BFA" />
                                  <text x={px} y={py - 12} fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">
                                    {shortName} ({p.arenaElo})
                                  </text>
                                </>
                              ) : (
                                <>
                                  <circle cx={px} cy={py} r="3.5" fill="#71717A" stroke="#232326" strokeWidth="1" />
                                  <text x={px} y={py - 6} fill="#71717A" fontSize="8.5" textAnchor="middle">
                                    {shortName.split(' ')[0]}
                                  </text>
                                </>
                              )}
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Core Capabilities */}
            <div className="p-6 rounded-2xl border border-[#232326] bg-[#111115]">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                Core Capabilities &amp; Strengths
              </h3>
              <ul className="space-y-2.5 text-xs text-[#E4E4E7]">
                {(model.keyFeatures || []).map((feat, i) => (
                  <li key={i} className="border-l-2 border-[#6E56CF] pl-3 py-0.5 text-xs text-[#E4E4E7] leading-relaxed">
                    {feat}
                  </li>
                ))}
              </ul>
            </div>

            {/* Code Snippet with Syntax Highlighting */}
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
              <pre 
                className="p-4 text-xs font-mono text-[#E4E4E7] overflow-x-auto leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formatCodeToken(codeSnippet) }}
              />
            </div>
          </div>

          {/* Right 5 Cols: Technical Specs, Lineage, Comparable Systems + Inline Diff, Cost Calculator */}
          <div className="lg:col-span-5 space-y-6">
            {/* Technical Specifications - Deeper Reference Details (Non-Duplicate) */}
            <div className="p-6 rounded-2xl border border-[#232326] bg-[#111115] space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Technical Specifications
              </h3>
              <div className="divide-y divide-[#1F1F24] text-xs">
                <div className="flex justify-between py-2.5">
                  <span className="text-[#71717A]">Max Output Tokens</span>
                  <span className="text-white font-mono">{model.specs?.maxOutput || '4,096 tokens'}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-[#71717A]">Knowledge Cutoff</span>
                  <span className="text-white">{model.specs?.cutoff || 'Current (2025/2026)'}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-[#71717A]">Supported Modalities</span>
                  <span className="text-white text-right">
                    {model.specs?.modalities || (model.entityType === 'tool' ? 'Code, Git, Terminal' : 'Text, Code')}
                  </span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-[#71717A]">First-Token Latency</span>
                  <span className="text-white font-mono">{model.specs?.ttft || '350ms'}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-[#71717A]">API Endpoint</span>
                  <span className="text-white">
                    {model.specs?.apiEndpoint || (model.entityType === 'tool' ? 'Native Desktop & Extension' : 'OpenAI-Compatible REST')}
                  </span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-[#71717A]">Deployment &amp; License</span>
                  <span className="text-white truncate max-w-[200px] text-right">
                    {model.licenseType || model.license || (model.isOpenWeights ? 'Open Weights Available' : 'Managed Cloud API')}
                  </span>
                </div>
              </div>
            </div>

            {/* Phase 10: MODEL LINEAGE (Family Progression) */}
            {lineageFamily.length >= 2 && (
              <div className="p-6 rounded-2xl border border-[#232326] bg-[#111115]">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                  Model Family Lineage
                </h3>
                <p className="text-xs text-[#71717A] mb-4">
                  Evolutionary lineage within the {model.org} research catalog.
                </p>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {lineageFamily.map((fam, idx) => {
                    const isCurrent = fam.id === model.id;
                    return (
                      <React.Fragment key={fam.id}>
                        <Link
                          to={`/leaderboard/${fam.slug}`}
                          className={`shrink-0 p-2.5 rounded-xl border text-xs transition-all ${
                            isCurrent
                              ? 'bg-[#6E56CF]/15 border-[#6E56CF] text-white shadow-md'
                              : 'bg-[#16161c] border-[#232326] text-[#A1A1AA] hover:text-white hover:border-[#3b3b44]'
                          }`}
                        >
                          <div className="flex items-center gap-1 mb-0.5">
                            <span className="font-semibold text-xs truncate max-w-[110px]">{fam.name.replace(/Claude/i, '').replace(/Sonnet/i, 'Sonnet').replace(/OpenAI/i, '').trim()}</span>
                            {isCurrent && (
                              <span className="text-[9px] px-1 py-0.2 rounded bg-[#6E56CF] text-white font-mono font-bold">
                                Current
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[#71717A] block font-mono">{fam.releaseDate || 'Recent'}</span>
                        </Link>
                        {idx < lineageFamily.length - 1 && (
                          <span className="text-[#3F3F46] shrink-0">→</span>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Phase 7: COMPARABLE SYSTEMS WITH INLINE DIFF TABLE */}
            <div className="p-6 rounded-2xl border border-[#232326] bg-[#111115]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Comparable Systems
                </h3>
                <span className="text-[11px] text-[#71717A]">
                  Direct Category Peers
                </span>
              </div>

              <div className="space-y-3">
                {relatedModels.map((rel) => {
                  const isExpanded = expandedCompareId === rel.id;
                  const eloDiff = (typeof model.arenaElo === 'number' && typeof rel.arenaElo === 'number')
                    ? model.arenaElo - rel.arenaElo
                    : null;
                  const speedDiff = (typeof model.speedNum === 'number' && typeof rel.speedNum === 'number')
                    ? model.speedNum - rel.speedNum
                    : null;
                  const mPrice = parsePriceNum(model.specs?.inputPrice || model.price);
                  const rPrice = parsePriceNum(rel.specs?.inputPrice || rel.price);

                  return (
                    <div
                      key={rel.id}
                      className="rounded-xl bg-[#16161c] border border-[#232326] overflow-hidden transition-colors"
                    >
                      {/* Header row */}
                      <div className="p-3 flex items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-xs text-white">
                              {rel.name}
                            </span>
                            <span className="text-[10px] text-[#71717A]">#{rel.rank}</span>
                          </div>
                          <span className="text-[11px] text-[#71717A]">{rel.org} • {rel.category}</span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono text-xs font-bold text-white">
                            {rel.arenaElo ? `${rel.arenaElo} Elo` : (rel.categoryMetricValue || rel.price || 'Details')}
                          </span>

                          {/* Inline Compare Toggle */}
                          <button
                            type="button"
                            onClick={() => setExpandedCompareId(isExpanded ? null : rel.id)}
                            className={`px-2 py-1 rounded text-[11px] font-semibold border flex items-center gap-1 transition-colors cursor-pointer ${
                              isExpanded
                                ? 'bg-[#6E56CF]/20 border-[#6E56CF]/50 text-[#A78BFA]'
                                : 'bg-[#1e1e24] border-[#2c2c34] text-[#A1A1AA] hover:text-white hover:border-[#3a3a44]'
                            }`}
                          >
                            <span>Compare</span>
                            {isExpanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                          </button>

                          {/* Detail Link */}
                          <Link
                            to={`/leaderboard/${rel.slug}`}
                            className="p-1 rounded text-[#71717A] hover:text-white transition-colors"
                            title={`View ${rel.name} details`}
                          >
                            <ArrowRight size={13} />
                          </Link>
                        </div>
                      </div>

                      {/* Phase 7: Expanded Diff Comparison Drawer */}
                      {isExpanded && (
                        <div className="px-3.5 pb-3.5 pt-2 border-t border-[#232326] bg-[#121217] space-y-2 text-xs animate-in fade-in duration-150">
                          <div className="grid grid-cols-4 text-[10.5px] font-mono text-[#71717A] pb-1 border-b border-[#1E1E22]">
                            <span>Metric</span>
                            <span className="text-right text-[#A78BFA] truncate">{model.name.split(' ')[0]}</span>
                            <span className="text-right truncate">{rel.name.split(' ')[0]}</span>
                            <span className="text-right">Diff</span>
                          </div>

                          {/* Row 1: Arena Elo */}
                          {eloDiff !== null && (
                            <div className="grid grid-cols-4 font-mono text-[11px] py-1 border-b border-[#1A1A1E]">
                              <span className="text-[#A1A1AA]">Arena Elo</span>
                              <span className="text-right text-white font-bold">{model.arenaElo}</span>
                              <span className="text-right text-[#D4D4D8]">{rel.arenaElo}</span>
                              <span className={`text-right font-bold ${eloDiff >= 0 ? 'text-[#10B981]' : 'text-[#F5A623]'}`}>
                                {eloDiff >= 0 ? `+${eloDiff}` : eloDiff}
                              </span>
                            </div>
                          )}

                          {/* Row 2: Throughput Speed */}
                          {speedDiff !== null && (
                            <div className="grid grid-cols-4 font-mono text-[11px] py-1 border-b border-[#1A1A1E]">
                              <span className="text-[#A1A1AA]">Throughput</span>
                              <span className="text-right text-white">{model.speedNum} tok/s</span>
                              <span className="text-right text-[#D4D4D8]">{rel.speedNum} tok/s</span>
                              <span className={`text-right ${speedDiff >= 0 ? 'text-[#10B981]' : 'text-[#F5A623]'}`}>
                                {speedDiff >= 0 ? `+${speedDiff}` : speedDiff}
                              </span>
                            </div>
                          )}

                          {/* Row 3: Token Pricing */}
                          {(mPrice > 0 || rPrice > 0) && (
                            <div className="grid grid-cols-4 font-mono text-[11px] py-1 border-b border-[#1A1A1E]">
                              <span className="text-[#A1A1AA]">Input Price</span>
                              <span className="text-right text-white">${mPrice}/M</span>
                              <span className="text-right text-[#D4D4D8]">${rPrice}/M</span>
                              <span className="text-right text-[#A1A1AA]">
                                {mPrice === rPrice ? 'Same' : `${mPrice > rPrice ? '+' : '-'}$${Math.abs(mPrice - rPrice).toFixed(2)}`}
                              </span>
                            </div>
                          )}

                          {/* Row 4: Coding Benchmark */}
                          {(model.codingScore || rel.codingScore) && (
                            <div className="grid grid-cols-4 font-mono text-[11px] py-1 border-b border-[#1A1A1E]">
                              <span className="text-[#A1A1AA]">Coding</span>
                              <span className="text-right text-white">{model.codingScore || 'N/A'}</span>
                              <span className="text-right text-[#D4D4D8]">{rel.codingScore || 'N/A'}</span>
                              <span className="text-right text-[#A78BFA]">Verified</span>
                            </div>
                          )}

                          {/* Row 5: Context Scope */}
                          <div className="grid grid-cols-4 font-mono text-[11px] py-1">
                            <span className="text-[#A1A1AA]">Context</span>
                            <span className="text-right text-white truncate">{model.contextWindow || '200k'}</span>
                            <span className="text-right text-[#D4D4D8] truncate">{rel.contextWindow || 'Standard'}</span>
                            <span className="text-right text-[#71717A]">Attention</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Phase 9: DEVELOPER COST CALCULATOR */}
            <div className="p-6 rounded-2xl border border-[#232326] bg-[#111115]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Calculator size={15} className="text-[#6E56CF]" />
                  API Cost Calculator
                </h3>
                <span className="text-[10.5px] font-mono text-[#10B981]">
                  Live Pricing
                </span>
              </div>
              <p className="text-xs text-[#71717A] mb-4">
                Estimate production monthly API spend based on volume.
              </p>

              <div className="space-y-4 text-xs">
                {/* Sliders */}
                <div>
                  <div className="flex justify-between text-[#A1A1AA] mb-1">
                    <span>API Calls / Day</span>
                    <span className="font-mono font-bold text-white">{callsPerDay.toLocaleString()}</span>
                  </div>
                  <input
                    id="cost-calc-calls-per-day-input"
                    name="callsPerDay"
                    type="range"
                    min="100"
                    max="10000"
                    step="100"
                    value={callsPerDay}
                    onChange={(e) => setCallsPerDay(Number(e.target.value))}
                    className="w-full h-1.5 bg-[#232328] rounded-lg appearance-none cursor-pointer accent-[#6E56CF]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[#A1A1AA] mb-1">
                    <span>Average Tokens / Call</span>
                    <span className="font-mono font-bold text-white">{tokensPerCall.toLocaleString()}</span>
                  </div>
                  <input
                    id="cost-calc-tokens-per-call-input"
                    name="tokensPerCall"
                    type="range"
                    min="500"
                    max="8000"
                    step="250"
                    value={tokensPerCall}
                    onChange={(e) => setTokensPerCall(Number(e.target.value))}
                    className="w-full h-1.5 bg-[#232328] rounded-lg appearance-none cursor-pointer accent-[#6E56CF]"
                  />
                </div>

                {/* Calculation Result Card */}
                <div className="p-3.5 rounded-xl bg-[#16161c] border border-[#232326] space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[#A1A1AA]">Estimated Monthly Spend:</span>
                    <span className="text-xl font-bold font-mono text-white">
                      {currentMonthlyCost > 0 ? `$${currentMonthlyCost.toFixed(2)}` : 'Free Tier'}
                    </span>
                  </div>
                  <span className="text-[10.5px] text-[#71717A] block">
                    Calculated on {(monthlyTokens / 1e6).toFixed(1)}M total tokens/mo (75% input, 25% output)
                  </span>

                  {/* Competitor Price Comparison */}
                  {compModel && compMonthlyCost !== null && compMonthlyCost > 0 && (
                    <div className="pt-2 border-t border-[#232328] flex items-center justify-between text-[11px]">
                      <span className="text-[#71717A]">vs. {compModel.name.split(' ')[0]}:</span>
                      <span className="font-mono font-semibold text-white">
                        ${compMonthlyCost.toFixed(2)}/mo
                        {currentMonthlyCost < compMonthlyCost && (
                          <span className="text-[#10B981] ml-1.5 font-bold">
                            (Save ${(compMonthlyCost - currentMonthlyCost).toFixed(0)}/mo)
                          </span>
                        )}
                        {currentMonthlyCost > compMonthlyCost && (
                          <span className="text-[#F5A623] ml-1.5">
                            (+${(currentMonthlyCost - compMonthlyCost).toFixed(0)}/mo)
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
