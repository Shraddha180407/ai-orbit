'use client';

import { useEffect, useState } from "react";
import { useParams, usePathname, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ThumbsUp, Bookmark, ArrowUpRight, FileText, Check,
  Sparkles, Layers, ArrowRight, ShieldCheck, MessageSquare,
  Building, Tag, Zap, BarChart2, Star, TrendingUp,
    Code2, Share2, ListChecks,
  ExternalLink, ChevronDown, ChevronUp,
} from 'lucide-react';

import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/lib/api";
import type { ToolCardData, ReviewData } from "@/lib/types";
import type { ToolDetailDataExtended, PricingTier } from "@/data/tools";
import { getSampleTool, getSampleSimilarTools } from "@/data/tools";
import { PricingBadge } from "@/components/PricingBadge";
import { RatingStars } from "@/components/RatingStars";
import { ProsConsVerdict } from "@/components/ProsConsVerdict";
import { RatingHistogram } from "@/components/RatingHistogram";
import { ReviewForm } from "@/components/ReviewForm";
import { ReviewList } from "@/components/ReviewList";
import { ROICalculator } from "@/components/ROICalculator";
import { StickyCTA } from "@/components/StickyCTA";
import { cn } from "@/lib/utils";

const PLATFORM_MAP: Record<string, string> = {
  WEB: "Web", MACOS: "macOS", WINDOWS: "Windows",
  IOS: "iOS", ANDROID: "Android", CHROME_EXTENSION: "Chrome Ext.", LINUX: "Linux",
};

const PERSONA_MAP: Record<string, string> = {
  DEVELOPERS: "Developers", DESIGNERS: "Designers", STUDENTS: "Students",
  MARKETERS: "Marketers", WRITERS: "Writers", RESEARCHERS: "Researchers",
  EDUCATORS: "Educators", SALES: "Sales", ENTERPRISE: "Enterprise",
  CONTENT_CREATORS: "Content Creators",
};

const ALT_ACCENT_COLORS = [
  "#6E56CF", "#E85D4A", "#0082FB", "#34A853",
  "#FF9900", "#E91E8C", "#00BCD4", "#FF6B35",
];

function formatNum(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function parseFeature(feat: string) {
  const parts = feat.split(/[:|-]/);
  if (parts.length > 1) return { title: parts[0].trim(), description: parts.slice(1).join(":").trim() };
  return { title: feat, description: "" };
}

// ── Logo ──────────────────────────────────────────────────────────────────────
function ToolLogo({ logoUrl, name }: { logoUrl: string | null; name: string }) {
  const [failed, setFailed] = useState(false);
  if (!logoUrl || failed) return <span className="text-2xl font-black text-neutral-900">{name.charAt(0)}</span>;
  return <Image src={logoUrl} alt={name} width={80} height={80} className="h-full w-full object-contain" priority onError={() => setFailed(true)} />;
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-[#232326] bg-[#111114] px-3 py-3 hover:border-[#6E56CF]/30 transition-colors">
      <Icon size={13} className="text-[#6E56CF]" />
      <span className="text-sm font-black text-white leading-none">{value}</span>
      <span className="text-[9px] font-mono font-bold text-[#52525B] uppercase tracking-widest leading-none">{label}</span>
    </div>
  );
}

// ── Spec row ──────────────────────────────────────────────────────────────────
function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-[#1e1e24] transition-colors border-b border-[#1a1a1e] last:border-0 text-xs">
      <span className="text-[#52525B] shrink-0">{label}</span>
      <span className="font-semibold text-white capitalize text-right ml-4">{value}</span>
    </div>
  );
}

// ── Integration Logo ──────────────────────────────────────────────────────────
function IntegrationLogo({ integration }: { integration: { slug: string; name: string; logoUrl?: string | null; websiteUrl?: string | null } }) {
  const [src, setSrc] = useState(
    integration.logoUrl || `https://www.google.com/s2/favicons?domain=${integration.slug}.com&sz=128`
  );
  const [failed, setFailed] = useState(false);

  const handleError = () => {
    if (src !== `https://www.google.com/s2/favicons?domain=${integration.slug}.com&sz=128`) {
      setSrc(`https://www.google.com/s2/favicons?domain=${integration.slug}.com&sz=128`);
    } else {
      setFailed(true);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 p-3 rounded-xl border border-[#232326] bg-[#131316]/40 hover:border-[#6E56CF]/25 transition-all group">
      <div className="relative h-10 w-10 rounded-xl bg-white shadow-md overflow-hidden flex items-center justify-center shrink-0">
        {failed
          ? <span className="text-sm font-bold text-neutral-900">{integration.name.charAt(0)}</span>
          : <Image src={src} alt={integration.name} fill className="object-contain p-1" onError={handleError} />
        }
      </div>
      <span className="text-[10px] text-[#71717A] font-medium truncate w-full text-center group-hover:text-[#A1A1AA] transition-colors">{integration.name}</span>
    </div>
  );
}

// ── Pricing card ──────────────────────────────────────────────────────────────
function PricingCard({ tier }: { tier: PricingTier }) {
  return (
    <div className={cn("relative rounded-xl border p-4 space-y-3 flex flex-col",
      tier.isPopular ? "border-[#6E56CF]/40 bg-[#6E56CF]/5" : "border-[#232326] bg-[#0d0d10]")}>
      {tier.isPopular && (
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#6E56CF] text-white text-[9px] font-extrabold uppercase px-3 py-0.5 rounded-full tracking-wider">
          Popular
        </div>
      )}
      <div>
        <p className="text-[10px] font-mono font-bold text-[#71717A] uppercase tracking-widest">{tier.name}</p>
        <p className="text-xl font-black text-white mt-1">{tier.price}</p>
        <p className="text-[11px] text-[#71717A] mt-0.5">{tier.description}</p>
      </div>
      <ul className="space-y-1.5 flex-1">
        {tier.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-[11px] text-[#A1A1AA]">
            <Check size={10} className="text-[#6E56CF] shrink-0 mt-0.5" />{f}
          </li>
        ))}
      </ul>
      <button className={cn("w-full rounded-lg py-2 text-xs font-bold transition-all",
        tier.isPopular ? "bg-[#6E56CF] text-white hover:bg-[#7C66DF]"
          : "border border-[#232326] text-[#A1A1AA] hover:text-white hover:border-white/10")}>
        {tier.price === "Custom" ? "Contact Sales" : "Get Started"}
      </button>
    </div>
  );
}

// ── Alt card ──────────────────────────────────────────────────────────────────
const ALT_CARD_STYLES = [
  { orb1: "top-[-20px] left-[-10px] w-28 h-28 bg-[#6E56CF]/25", orb2: "bottom-[-10px] right-[-10px] w-16 h-16 bg-[#9b78ff]/10", base: "from-[#6E56CF]/15 via-[#6E56CF]/5 to-transparent", dir: "to-br" },
  { orb1: "top-[-20px] right-[-10px] w-28 h-28 bg-[#7c5fe6]/25", orb2: "bottom-[-10px] left-[-10px] w-16 h-16 bg-[#6E56CF]/10", base: "from-[#7c5fe6]/15 via-[#6E56CF]/5 to-transparent", dir: "to-bl" },
  { orb1: "top-[-15px] left-[30%] w-24 h-24 bg-[#8b6cf7]/20", orb2: "bottom-[-5px] right-[20%] w-14 h-14 bg-[#6E56CF]/12", base: "from-[#8b6cf7]/12 via-[#6E56CF]/5 to-transparent", dir: "to-b" },
  { orb1: "bottom-[-10px] left-[-10px] w-24 h-24 bg-[#6E56CF]/22", orb2: "top-[-10px] right-[-5px] w-16 h-16 bg-[#9b78ff]/10", base: "from-[#6E56CF]/10 via-[#8b6cf7]/8 to-transparent", dir: "to-tr" },
  { orb1: "top-[-10px] left-[-15px] w-20 h-20 bg-[#9b78ff]/20", orb2: "top-[-10px] right-[-15px] w-20 h-20 bg-[#6E56CF]/18", base: "from-transparent via-[#6E56CF]/8 to-transparent", dir: "to-b" },
];

// ── Sidebar Integration Row ───────────────────────────────────────────────────
function SidebarIntegrationRow({ integration }: { integration: { slug: string; name: string; logoUrl?: string | null } }) {
  const [src, setSrc] = useState(
    integration.logoUrl || `https://www.google.com/s2/favicons?domain=${integration.slug}.com&sz=128`
  );
  const [failed, setFailed] = useState(false);

  const handleError = () => {
    if (src !== `https://www.google.com/s2/favicons?domain=${integration.slug}.com&sz=128`) {
      setSrc(`https://www.google.com/s2/favicons?domain=${integration.slug}.com&sz=128`);
    } else {
      setFailed(true);
    }
  };

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-[#1a1a1e] last:border-0 group hover:bg-[#131316]/60 rounded-lg px-1.5 transition-colors cursor-default">
      <div className="relative h-7 w-7 rounded-lg bg-white shadow-sm overflow-hidden flex items-center justify-center shrink-0">
        {failed
          ? <span className="text-[10px] font-bold text-neutral-900">{integration.name.charAt(0)}</span>
          : <Image src={src} alt={integration.name} fill className="object-contain p-0.5" onError={handleError} />
        }
      </div>
      <span className="text-[12px] font-medium text-[#A1A1AA] group-hover:text-white transition-colors">{integration.name}</span>
    </div>
  );
}

function AltCard({ tool, index = 0 }: { tool: ToolCardData; index?: number }) {
  const [failed, setFailed] = useState(false);
  const style = ALT_CARD_STYLES[index % ALT_CARD_STYLES.length];

  return (
    <Link href={`/tools/${tool.slug}`}
      className="group flex flex-col rounded-xl border border-[#232326] overflow-hidden transition-all duration-200 hover:border-[#6E56CF]/40 hover:shadow-xl hover:shadow-[#6E56CF]/8 hover:-translate-y-0.5 bg-[#0a0a0d]">

      {/* Banner */}
      <div className="relative h-24 shrink-0 overflow-hidden">
        {/* Base tint */}
        <div className={`absolute inset-0 bg-gradient-${style.dir} ${style.base}`} />
        {/* Fade to card bg at bottom — eliminates harsh line */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#0a0a0d] to-transparent" />
        {/* Glass sheen */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/3 via-transparent to-transparent" />
        {/* Orb 1 */}
        <div className={`absolute ${style.orb1} rounded-full blur-2xl pointer-events-none`} />
        {/* Orb 2 */}
        <div className={`absolute ${style.orb2} rounded-full blur-xl pointer-events-none`} />
        {/* Noise texture overlay for depth */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]" />
        {/* Logo */}
        <div className="absolute bottom-3 left-3">
          <div className="relative h-14 w-14 rounded-xl border border-white/20 bg-white shadow-lg overflow-hidden flex items-center justify-center">
            {tool.logoUrl && !failed
              ? <Image src={tool.logoUrl} alt={tool.name} fill className="object-contain p-0.5" onError={() => setFailed(true)} />
              : <span className="text-lg font-bold text-neutral-900">{tool.name.charAt(0)}</span>}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col gap-0.5 flex-1">
        <p className="text-[13px] font-bold text-white truncate group-hover:text-[#A78BFA] transition-colors leading-tight">{tool.name}</p>
        {tool.company?.name && (
          <p className="text-[11px] text-[#52525B] truncate">{tool.company.name}</p>
        )}
        <p className="text-[11px] text-[#71717A] line-clamp-2 leading-snug mt-1">{tool.description}</p>
        <div className="flex flex-wrap items-center gap-1.5 mt-auto pt-2">
          {tool.categories?.[0]?.category?.name && (
            <span className="rounded-md border border-white/10 bg-white/8 px-2 py-0.5 text-[10px] font-mono text-[#A1A1AA]">
              {tool.categories[0].category.name}
            </span>
          )}
          <span className="hidden sm:inline-flex">
            <PricingBadge pricingModel={tool.pricingModel} pricingAmount={tool.pricingAmount} billingFrequency={tool.billingFrequency} />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── Section header ────────────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, title, badge }: { icon: any; title: string; badge?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[#232326]/50 pb-3">
      <div className="flex items-center gap-2.5">
        <Icon className="text-[#6E56CF] h-3.5 w-3.5 shrink-0" />
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">{title}</h2>
      </div>
      {badge && (
        <span className="text-[10px] font-mono text-[#52525B] bg-[#131316] border border-[#232326] rounded-full px-2 py-0.5">
          {badge}
        </span>
      )}
    </div>
  );
}

// ── Task card (matches Key Features card style) ───────────────────────────────
function TaskCard({ task }: { task: { slug: string; title: string; description?: string } }) {
  return (
    <Link
      href={`/tasks/${task.slug}`}
      className="flex items-start gap-3 rounded-xl border border-[#232326] bg-[#131316]/40 px-3.5 py-3 hover:border-[#6E56CF]/30 hover:bg-[#6E56CF]/5 transition-all group"
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#6E56CF]/15 border border-[#6E56CF]/25 mt-0.5">
        <Check size={11} className="text-[#6E56CF]" />
      </span>
      <div className="min-w-0">
        <p className="text-[12px] font-bold text-white group-hover:text-[#A78BFA] transition-colors leading-snug">
          {task.title}
        </p>
        {task.description && (
          <p className="text-[11px] text-[#71717A] mt-0.5 leading-snug line-clamp-2">{task.description}</p>
        )}
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────
export function ToolDetailClient() {
  const params = useParams();
  const slug = params.slug as string;

  const [bookmarked, setBookmarked] = useState(false);
  const [upvoted, setUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "pricing" | "reviews">("overview");


  const pathname = usePathname();
  const TASKS_VISIBLE = 8; // initial
  const [visibleCount, setVisibleCount] = useState(TASKS_VISIBLE); // show 8 cards (2 rows of 4 / 4 rows of 2) before "show all"

  const { data: detailData, isLoading, isError } = useQuery({
    queryKey: ["tool-detail", slug, pathname],
    queryFn: async () => {
      const sample = getSampleTool(slug);
      if (sample) return { tool: sample, similarTools: getSampleSimilarTools(slug), reviews: [], bookmarked: false };

      if (pathname?.includes("/agents")) {
        const agentRes = await fetch(`${API_URL}/api/v1/agents/${slug}`, { credentials: "include" });
        if (agentRes.ok) {
          const agent = await agentRes.json();
          return {
            tool: {
              ...agent,
              company: { name: agent.category, slug: agent.categorySlug },
              categories: [{ category: { name: agent.category, slug: agent.categorySlug } }],
              ttasks: agent.primaryTask ? [{ task: { slug: agent.categorySlug, title: agent.primaryTask } }] : [],
            },
            similarTools: (agent.similarAgents || []).map((sa: any) => ({
              ...sa,
              company: { name: sa.category, slug: sa.categorySlug },
              categories: [{ category: { name: sa.category, slug: sa.categorySlug } }],
            })),
            reviews: [],
            bookmarked: false,
          };
        }
      }

      const res = await fetch(`${API_URL}/api/v1/tools/${slug}`, { credentials: "include" });
      if (!res.ok) throw new Error("Not found");
      return res.json();
    },
    staleTime: 10 * 60 * 1000,
  });

  const raw = detailData?.tool;
  const tool: ToolDetailDataExtended | null = raw ? {
    ...raw,
    longDescription: raw.longDescription ?? null,
    videoUrl: null,
    websiteScreenshotUrl: null,
    releasedBy: raw.releasedBy ?? raw.company?.name ?? null,
    country: raw.country ?? null,
    views: raw.views ?? 0,
    saves: raw._count?.bookmarks ?? 0,
    useCases: raw.useCases ?? [],
    pricingTiers: raw.pricingTiers ?? [],
    verdict: raw.verdict ?? null,
    linkedInUrl: raw.linkedInUrl ?? null,
    twitterUrl: raw.twitterUrl ?? null,
    githubUrl: raw.githubUrl ?? null,
    launchDate: raw.launchDate ?? null,
    alternativeIds: raw.alternativeIds ?? [],
  } : null;

  const similarTools: ToolCardData[] = detailData?.similarTools || [];
  const reviews: ReviewData[] = detailData?.reviews || [];
  const ttasks: any[] = (raw?.ttasks) || [];
  const visibleTasks = ttasks.slice(0, visibleCount);

  useEffect(() => {
    if (detailData?.tool) {
      setUpvoteCount(detailData.tool.upvoteCount || 0);
      setBookmarked(detailData.bookmarked || false);
      const stored = localStorage.getItem(`upvoted-${detailData.tool.id}`);
      if (stored === "true") setUpvoted(true);
      if (detailData.tool.id) {
        fetch(`${API_URL}/api/user/history`, {
          method: "POST", credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ toolId: detailData.tool.id }),
        }).catch(() => {});
      }
    }
  }, [detailData]);

  useEffect(() => {
    if (tool) document.title = `${tool.name} — AI Tool | AI Orbit`;
  }, [tool]);

  const handleUpvote = () => {
    if (!tool) return;
    const next = !upvoted;
    setUpvoted(next);
    setUpvoteCount(p => next ? p + 1 : Math.max(0, p - 1));
    localStorage.setItem(`upvoted-${tool.id}`, next ? "true" : "false");
  };

  const handleShare = async () => {
    if (!tool) return;
    if (navigator.share) { try { await navigator.share({ title: tool.name, url: window.location.href }); } catch {} }
    else navigator.clipboard.writeText(window.location.href).catch(() => {});
  };

  if (isError || (!isLoading && !tool)) return notFound();

  if (isLoading || !tool) return (
    <main className="mx-auto max-w-[1400px] px-4 py-8 md:px-6 animate-pulse space-y-5">
      <div className="h-4 w-32 rounded bg-[#232326]" />
      <div className="h-52 rounded-2xl bg-[#131316] border border-[#232326]" />
      <div className="grid lg:grid-cols-[1fr_300px] gap-5">
        <div className="space-y-4">
          <div className="h-40 rounded-xl bg-[#131316] border border-[#232326]" />
          <div className="h-40 rounded-xl bg-[#131316] border border-[#232326]" />
        </div>
        <div className="space-y-4">
          <div className="h-40 rounded-xl bg-[#131316] border border-[#232326]" />
          <div className="h-40 rounded-xl bg-[#131316] border border-[#232326]" />
        </div>
      </div>
    </main>
  );

  const formatDate = (v: string | null) => {
    if (!v) return "—";
    try { return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date(v)); }
    catch { return v; }
  };

  const displayDescription = tool.longDescription || tool.description;

  const specs = [
    { label: "Pricing", value: tool.pricingModel.toLowerCase().replace("_", " ") },
    tool.pricingAmount ? { label: "Starting at", value: `$${tool.pricingAmount}/${tool.billingFrequency.toLowerCase()}` } : null,
    { label: "Open Source", value: tool.isOpenSource ? "Yes" : "No" },
    { label: "API", value: tool.hasApi ? "Available" : "No" },
    tool.releasedBy ? { label: "Released By", value: tool.releasedBy } : null,
    tool.country ? { label: "Country", value: tool.country } : null,
    tool.launchDate ? { label: "Launch Date", value: tool.launchDate } : null,
    tool.releaseDate ? { label: "Release Date", value: formatDate(tool.releaseDate) } : null,
    tool.company ? { label: "Company", value: tool.company.name } : null,
    tool.performanceScore ? { label: "Score", value: `${tool.performanceScore}/100` } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  const hasStats = tool.views > 0 || tool.saves > 0 || upvoteCount > 0 || tool.reviewCount > 0 || !!tool.avgRating;

  return (
        <main className="mx-auto max-w-[1400px] px-4 pt-2 pb-5 md:px-6 md:pt-3 md:pb-8 text-white">

      {/* Breadcrumb */}
      <nav className="mb-2 text-xs font-semibold text-[#52525B] flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>›</span>
        <Link href="/tools" className="hover:text-white transition-colors">AI Tools</Link>
        {tool.categories[0] && <>
          <span>›</span>
          <Link href={`/tools/${tool.categories[0].category.slug}`} className="hover:text-white transition-colors">
            {tool.categories[0].category.name}
          </Link>
        </>}
        <span>›</span>
        <span className="text-[#A1A1AA]">{tool.name}</span>
      </nav>

            {/* ── HERO ── */}
      <header className="relative rounded-2xl border border-[#1e1e22] bg-[#09090c] overflow-hidden mb-5">
        {/* Layered background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#6E56CF]/8 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6E56CF]/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6E56CF]/10 to-transparent" />
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#6E56CF]/6 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-0 bottom-0 w-64 h-64 bg-[#6E56CF]/3 rounded-full blur-3xl pointer-events-none" />

        <div className="relative p-4 md:p-8">

                    {/* Mobile layout */}
          <div className="sm:hidden space-y-3">

            {/* Row 1: logo + name */}
            <div className="flex gap-3 items-center">
              <div className="shrink-0 relative">
                <div className="absolute inset-0 rounded-2xl bg-[#6E56CF]/20 blur-xl scale-110 pointer-events-none" />
                <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl shadow-black/50">
                  <ToolLogo logoUrl={tool.logoUrl} name={tool.name} />
                </div>
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <h1 className="text-2xl font-black text-white tracking-tight leading-tight">{tool.name}</h1>
                  {tool.verified && <ShieldCheck size={15} className="text-[#6E56CF] shrink-0" />}
                  {tool.isTrending && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/15 border border-orange-500/20 px-2 py-0.5 text-[9px] font-bold text-orange-400">
                      <TrendingUp size={8} /> Trending
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {tool.categories.slice(0, 3).map(({ category }) => (
                    <Link key={category.slug} href={`/tools/${category.slug}`}
                      className="inline-block rounded-md border border-[#6E56CF]/25 bg-[#6E56CF]/10 px-2.5 py-1 text-[11px] font-semibold text-[#A78BFA] leading-none">
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 2: pricing + rating */}
            <div className="flex flex-wrap items-center gap-2">
              <PricingBadge pricingModel={tool.pricingModel} pricingAmount={tool.pricingAmount} billingFrequency={tool.billingFrequency} />
              <span className="text-[#3a3a3e]">·</span>
              <RatingStars rating={tool.avgRating} size="sm" />
            </div>

            {/* Row 3: description */}
            <p className="text-[13px] text-[#A1A1AA] leading-relaxed">{tool.description}</p>

            {/* Row 4: meta */}
            {(tool.releasedBy || tool.releaseDate || tool.country) && (
              <div className="flex flex-wrap items-center gap-1.5">
                {tool.releasedBy && (
                  <span className="text-[11px] text-[#52525B]">By <span className="text-[#A1A1AA] font-medium">{tool.releasedBy}</span></span>
                )}
                {tool.releaseDate && (
                  <>
                    {tool.releasedBy && <span className="text-[#2a2a2e] text-[11px]">·</span>}
                    <span className="text-[11px] text-[#A1A1AA] font-medium">{formatDate(tool.releaseDate)}</span>
                  </>
                )}
                {tool.country && (
                  <>
                    {(tool.releasedBy || tool.releaseDate) && <span className="text-[#2a2a2e] text-[11px]">·</span>}
                    <span className="text-[11px] text-[#A1A1AA] font-medium">{tool.country}</span>
                  </>
                )}
              </div>
            )}

            {/* Row 5: best for + works on + tags */}
            <div className="flex flex-col gap-1.5">
              {tool.targetUsers?.length > 0 && (
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-[10px] text-[#52525B] font-bold shrink-0">Best for:</span>
                  {tool.targetUsers.map(p => (
                    <span key={p} className="rounded-md border border-[#232326] bg-[#131316] px-1.5 py-0.5 text-[10px] font-semibold text-white/70">
                      {PERSONA_MAP[p] || p}
                    </span>
                  ))}
                </div>
              )}
              {tool.compatibility?.length > 0 && (
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-[10px] text-[#52525B] font-bold shrink-0">Works on:</span>
                  {tool.compatibility.map(c => (
                    <span key={c} className="rounded-md border border-[#232326] bg-[#131316] px-1.5 py-0.5 text-[10px] font-semibold text-[#A1A1AA]">
                      {PLATFORM_MAP[c] || c}
                    </span>
                  ))}
                </div>
              )}
            </div>


            {/* Row 6: action buttons */}
            <div className="flex flex-col gap-2">
              <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer nofollow"
                className="inline-flex w-full justify-center items-center gap-2 rounded-xl bg-[#6E56CF] px-4 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-[#6E56CF]/25 hover:bg-[#7C66DF] transition-all active:scale-95">
                Visit Website <ArrowUpRight size={14} strokeWidth={2.5} />
              </a>
              {tool.hasApi && tool.apiDocsUrl && (
                <a href={tool.apiDocsUrl} target="_blank" rel="noopener noreferrer nofollow"
                  className="inline-flex w-full justify-center items-center gap-1.5 rounded-xl border border-[#2a2a2e] bg-[#0d0d10] px-4 py-2 text-xs font-semibold text-[#71717A]">
                  <Code2 size={13} /> View API Docs
                </a>
              )}
              <div className="grid grid-cols-3 gap-2">
                <button onClick={handleUpvote}
                  className={cn("flex flex-col items-center justify-center gap-0.5 rounded-xl border px-2 py-2 text-xs font-bold transition-all",
                    upvoted ? "bg-[#6E56CF] text-white border-[#6E56CF]" : "border-[#232326] bg-[#0d0d10] text-white")}>
                  <ThumbsUp size={12} className={cn(upvoted && "fill-white")} />
                  <span className="text-[9px] font-mono">{formatNum(upvoteCount)}</span>
                </button>
                <button onClick={() => setBookmarked(b => !b)}
                  className={cn("flex items-center justify-center rounded-xl border py-2 transition-all",
                    bookmarked ? "bg-[#6E56CF] text-white border-[#6E56CF]" : "border-[#232326] bg-[#0d0d10] text-white")}>
                  <Bookmark size={13} className={cn(bookmarked && "fill-white")} />
                </button>
                <button onClick={handleShare}
                  className="flex items-center justify-center rounded-xl border border-[#232326] bg-[#0d0d10] py-2 text-[#71717A]">
                  <Share2 size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* Desktop layout — hidden on mobile */}
          <div className="hidden sm:flex gap-6 items-start justify-between">
            <div className="flex gap-6 items-start">
              <div className="shrink-0 relative">
                <div className="absolute inset-0 rounded-2xl bg-[#6E56CF]/20 blur-xl scale-110 pointer-events-none" />
                <div className="relative flex h-28 w-28 md:h-32 md:w-32 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl shadow-black/50">
                  <ToolLogo logoUrl={tool.logoUrl} name={tool.name} />
                </div>
              </div>
              <div className="min-w-0 flex-1 pt-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-none">{tool.name}</h1>
                  {tool.verified && <ShieldCheck size={18} className="text-[#6E56CF] shrink-0" />}
                  {tool.isTrending && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/15 border border-orange-500/20 px-2.5 py-0.5 text-[10px] font-bold text-orange-400">
                      <TrendingUp size={9} /> Trending
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <PricingBadge pricingModel={tool.pricingModel} pricingAmount={tool.pricingAmount} billingFrequency={tool.billingFrequency} />
                  <span className="text-[#3a3a3e]">·</span>
                  <RatingStars rating={tool.avgRating} reviewCount={tool.reviewCount} size="sm" />
                  <span className="text-[#3a3a3e]">·</span>
                  {tool.categories.slice(0, 3).map(({ category }) => (
                    <Link key={category.slug} href={`/tools/${category.slug}`}
                      className="inline-block text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md border border-[#2a2a2e] text-[#71717A] hover:text-white hover:border-white/10 transition-colors leading-none">
                      {category.name}
                    </Link>
                  ))}
                </div>
                <p className="text-[13px] md:text-sm text-[#A1A1AA] leading-relaxed mt-3 max-w-2xl">{tool.description}</p>
                {(tool.releasedBy || tool.releaseDate || tool.country) && (
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    {tool.releasedBy && (
                      <span className="text-[11px] text-[#52525B]">By <span className="text-[#A1A1AA] font-medium">{tool.releasedBy}</span></span>
                    )}
                    {tool.releaseDate && (
                      <>
                        {tool.releasedBy && <span className="text-[#2a2a2e] text-[11px]">·</span>}
                        <span className="text-[11px] text-[#A1A1AA] font-medium">{formatDate(tool.releaseDate)}</span>
                      </>
                    )}
                    {tool.country && (
                      <>
                        {(tool.releasedBy || tool.releaseDate) && <span className="text-[#2a2a2e] text-[11px]">·</span>}
                        <span className="text-[11px] text-[#A1A1AA] font-medium">{tool.country}</span>
                      </>
                    )}
                  </div>
                )}
                <div className="flex flex-col gap-1.5 mt-3">
                  {tool.targetUsers?.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] text-[#52525B] font-bold shrink-0">Best for:</span>
                      {tool.targetUsers.map(p => (
                        <span key={p} className="rounded-md border border-[#232326] bg-[#131316] px-2 py-0.5 text-[10px] font-semibold text-white/70">
                          {PERSONA_MAP[p] || p}
                        </span>
                      ))}
                    </div>
                  )}
                  {tool.compatibility?.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] text-[#52525B] font-bold shrink-0">Works on:</span>
                      {tool.compatibility.map(c => (
                        <span key={c} className="rounded-md border border-[#232326] bg-[#131316] px-2 py-0.5 text-[10px] font-semibold text-[#A1A1AA]">
                          {PLATFORM_MAP[c] || c}
                        </span>
                      ))}
                    </div>
                  )}
                  
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 w-52 shrink-0">
              <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer nofollow"
                className="inline-flex w-full justify-center items-center gap-2 rounded-xl bg-[#6E56CF] px-4 py-3 text-sm font-extrabold text-white shadow-lg shadow-[#6E56CF]/25 hover:bg-[#7C66DF] hover:shadow-[#6E56CF]/40 transition-all active:scale-95">
                Visit Website <ArrowUpRight size={14} strokeWidth={2.5} />
              </a>
              {tool.hasApi && tool.apiDocsUrl && (
                <a href={tool.apiDocsUrl} target="_blank" rel="noopener noreferrer nofollow"
                  className="inline-flex w-full justify-center items-center gap-1.5 rounded-xl border border-[#2a2a2e] bg-[#0d0d10] px-4 py-2.5 text-xs font-semibold text-[#71717A] hover:text-white hover:border-white/10 transition-all">
                  <Code2 size={13} /> View API Docs
                </a>
              )}
              <div className="grid grid-cols-3 gap-2 mt-0.5">
                <button onClick={handleUpvote}
                  className={cn("flex flex-col items-center justify-center gap-0.5 rounded-xl border px-2 py-2.5 text-xs font-bold transition-all",
                    upvoted ? "bg-[#6E56CF] text-white border-[#6E56CF] shadow-lg shadow-[#6E56CF]/20" : "border-[#232326] bg-[#0d0d10] text-white hover:border-[#6E56CF]/30 hover:bg-[#6E56CF]/5")}>
                  <ThumbsUp size={12} className={cn(upvoted && "fill-white")} />
                  <span className="text-[9px] font-mono">{formatNum(upvoteCount)}</span>
                </button>
                <button onClick={() => setBookmarked(b => !b)}
                  className={cn("flex items-center justify-center rounded-xl border py-2.5 transition-all",
                    bookmarked ? "bg-[#6E56CF] text-white border-[#6E56CF] shadow-lg shadow-[#6E56CF]/20" : "border-[#232326] bg-[#0d0d10] text-white hover:border-[#6E56CF]/30 hover:bg-[#6E56CF]/5")}>
                  <Bookmark size={13} className={cn(bookmarked && "fill-white")} />
                </button>
                <button onClick={handleShare}
                  className="flex items-center justify-center rounded-xl border border-[#232326] bg-[#0d0d10] py-2.5 text-[#71717A] hover:text-white hover:border-white/10 transition-all">
                  <Share2 size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── TABS ── */}
      <div className="flex border-b border-[#232326] mb-5 overflow-x-auto scrollbar-none">
        {(["overview", "pricing", "reviews"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn("px-5 py-2.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border-b-2 -mb-px",
              activeTab === tab ? "border-[#6E56CF] text-white bg-[#6E56CF]/5"
                : "border-transparent text-[#52525B] hover:text-[#A1A1AA]")}>
            {tab === "reviews" ? `Reviews (${tool.reviewCount})` : tab}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">

          {/* LEFT */}
          <div className="space-y-4 min-w-0">

                        {/* Overview — always show with description + use cases */}
            <section className="rounded-xl border border-[#1e1e22] bg-[#09090c] p-5 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/6 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-600/5 rounded-full blur-2xl pointer-events-none" />
              <SectionHeader icon={FileText} title="Overview" />
                            <div className="text-[13px] leading-relaxed text-[#A1A1AA] space-y-2.5">
                {displayDescription.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
              </div>

              {/* Categories + Tags inline divider */}
              {(tool.categories.length > 0 || tool.tags?.length > 0) && (
                <div className="pt-3 border-t border-[#232326]/60 space-y-2.5">
                  {tool.categories.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-mono text-[#52525B] uppercase tracking-widest shrink-0">Categories</span>
                      <span className="text-[#2a2a2e]">·</span>
                      {tool.categories.map(({ category }) => (
                        <Link key={category.slug} href={`/tools/${category.slug}`}
                          className="inline-block rounded-md border border-[#232326] bg-[#131316] px-2.5 py-1 text-[11px] font-semibold text-[#A1A1AA] hover:border-[#6E56CF]/30 hover:text-white transition-all leading-none">
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  )}
                  {tool.tags?.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-mono text-[#52525B] uppercase tracking-widest shrink-0">Tags</span>
                      <span className="text-[#2a2a2e]">·</span>
                      {tool.tags.map(({ tag }) => (
                        <Link key={tag.slug} href={`/tools?tag=${tag.slug}`}
                          className="inline-block rounded-md border border-[#232326] bg-[#131316] px-2.5 py-1 text-[11px] font-mono font-semibold text-[#71717A] hover:border-[#6E56CF]/30 hover:text-[#A1A1AA] transition-all leading-none">
                          #{tag.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>
                      {/* Specs — mobile only, shows between Overview and rest of content */}
            <section className="rounded-xl border border-[#1e1e22] bg-[#09090c] p-4 relative overflow-hidden lg:hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
              <div className="absolute -top-10 -right-10 w-36 h-36 bg-blue-600/6 rounded-full blur-2xl pointer-events-none" />
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wide border-b border-[#232326]/50 pb-3 mb-1 flex items-center gap-2.5">
                <FileText size={13} className="text-[#6E56CF]" /> Specifications
              </h3>
              {specs.map(row => <SpecRow key={row.label} label={row.label} value={row.value} />)}
            </section>

            {/* Key Features */}
            {tool.features?.length > 0 && (
              <section className="rounded-xl border border-[#1e1e22] bg-[#09090c] p-5 space-y-3 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6E56CF]/30 to-transparent" />
                <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#6E56CF]/4 rounded-full blur-2xl pointer-events-none" />
                <SectionHeader icon={Sparkles} title="Key Features" />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
                  {tool.features.map((feat, i) => {
                    const p = parseFeature(feat);
                    return (
                      <div key={i} className="group/feat flex items-start gap-2.5 py-2.5 border-b border-[#ffffff08] last:border-0 sm:[&:nth-last-child(2):nth-child(odd)]:border-0 rounded-lg px-2 -mx-2 hover:bg-[#6E56CF]/5 transition-colors cursor-default">
                        <svg className="shrink-0 mt-[3px] group-hover/feat:fill-[#A78BFA] transition-colors" width="9" height="9" viewBox="0 0 10 10" fill="none"><polygon points="0,0 10,5 0,10 3,5" fill="#6E56CF"/></svg>
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-white group-hover/feat:text-[#A78BFA] transition-colors leading-snug">{p.title}</p>
                          {p.description && <p className="text-[11px] text-[#71717A] group-hover/feat:text-[#A1A1AA] mt-0.5 leading-snug transition-colors">{p.description}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ── WHAT YOU CAN DO — below Key Features, distinct style: left-border accent rows ── */}
            {ttasks.length > 0 && (
                                <section className="rounded-xl border border-[#1e1e22] bg-[#09090c] p-5 space-y-3 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6E56CF]/20 to-transparent" />
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#6E56CF]/4 rounded-full blur-3xl pointer-events-none" />
                <SectionHeader icon={ListChecks} title="Use Cases" badge={`${ttasks.length} tasks`} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
                  {visibleTasks.map((t: any) => (
                    <Link
                      key={t.task.slug}
                      href={`/tasks/${t.task.slug}`}
                      className="group flex items-center gap-2.5 py-2.5 border-b border-[#ffffff08] last:border-0 sm:[&:nth-last-child(2):nth-child(odd)]:border-0"
                    >
                        <svg className="shrink-0 mt-[3px] group-hover:fill-[#A78BFA] transition-colors" width="9" height="9" viewBox="0 0 10 10" fill="none"><polygon points="0,0 10,5 0,10 3,5" fill="#6E56CF"/></svg>
                      <span className="text-[13px] font-medium text-[#A1A1AA] group-hover:text-white transition-colors leading-snug truncate">
                        {t.task.title}
                      </span>
                    </Link>
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-1">
                  {visibleCount < ttasks.length && (
                    <button
                      onClick={() => setVisibleCount(c => Math.min(c + 4, ttasks.length))}
                      className="flex items-center gap-1.5 text-xs font-bold text-[#6E56CF] hover:text-[#A78BFA] transition-colors group"
                    >
                      <ChevronDown size={13} className="group-hover:translate-y-0.5 transition-transform" />
                      Show more
                    </button>
                  )}
                  {visibleCount > TASKS_VISIBLE && (
                    <button
                      onClick={() => setVisibleCount(TASKS_VISIBLE)}
                      className="flex items-center gap-1.5 text-xs font-bold text-[#52525B] hover:text-[#A1A1AA] transition-colors group"
                    >
                      <ChevronUp size={13} className="group-hover:-translate-y-0.5 transition-transform" />
                      Show less
                    </button>
                  )}
                </div>
              </section>
            )}

            {/* Pros & Cons */}
            <section>
              <ProsConsVerdict name={tool.name} description={tool.description} features={tool.features}
                categories={tool.categories} pros={tool.pros} cons={tool.cons} />
            </section>

          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="space-y-4">

            {/* Specs */}
            <section className="hidden lg:block rounded-xl border border-[#1e1e22] bg-[#09090c] p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
              <div className="absolute -top-10 -right-10 w-36 h-36 bg-blue-600/6 rounded-full blur-2xl pointer-events-none" />
                            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide border-b border-[#232326]/50 pb-3 mb-1 flex items-center gap-2.5">
                <FileText size={13} className="text-[#6E56CF]" /> Specifications
              </h3>
              {specs.map(row => <SpecRow key={row.label} label={row.label} value={row.value} />)}
            </section>

           
            {/* Company */}
            {tool.company && (
              <section className="rounded-xl border border-[#1e1e22] bg-[#09090c] p-4 space-y-3 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6E56CF]/20 to-transparent" />
                <div className="absolute -top-12 -left-12 w-40 h-40 bg-[#6E56CF]/4 rounded-full blur-3xl pointer-events-none" />
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wide border-b border-[#232326]/50 pb-3 flex items-center gap-2.5">
                  <Building size={13} className="text-[#6E56CF]" /> Company
                </h3>
                <div className="flex items-center gap-3">
                  {tool.company.logoUrl && (
                    <div className="h-9 w-9 rounded-lg border border-[#232326] bg-white flex items-center justify-center overflow-hidden p-1">
                      <Image src={tool.company.logoUrl} alt={tool.company.name} width={28} height={28} className="object-contain" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-bold text-white">{tool.company.name}</p>
                    {tool.country && <p className="text-[11px] text-[#71717A]">{tool.country}</p>}
                  </div>
                </div>
              </section>
            )}

                        {/* Integrations — sidebar stacked */}
            {tool.integrations?.length > 0 && (
              <section className="rounded-xl border border-[#1e1e22] bg-[#09090c] p-4 space-y-3 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6E56CF]/20 to-transparent" />
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#6E56CF]/4 rounded-full blur-3xl pointer-events-none" />
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wide border-b border-[#232326]/50 pb-3 flex items-center gap-2.5">
                  <Layers size={13} className="text-[#6E56CF]" /> Integrations
                </h3>
                <div className="space-y-0">
                  {tool.integrations.map(({ integration }) => (
                    <SidebarIntegrationRow key={integration.slug} integration={integration} />
                  ))}
                </div>
              </section>
            )}

            {/* ROI Calculator — only show when there are enough tasks to justify it */}
            {ttasks.length >= 4 && (
              <section className="rounded-xl border border-[#1e1e22] bg-[#09090c] p-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6E56CF]/20 to-transparent" />
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#6E56CF]/4 rounded-full blur-3xl pointer-events-none" />
                <ROICalculator pricingModel={tool.pricingModel} pricingAmount={tool.pricingAmount} name={tool.name} />
              </section>
            )}

          </aside>
        </div>
      )}

      {/* ── PRICING TAB ── */}
      {activeTab === "pricing" && (
        <div className="space-y-5">
          {tool.pricingTiers?.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {tool.pricingTiers.map(tier => <PricingCard key={tier.name} tier={tier} />)}
              </div>
              <div className="rounded-xl border border-[#232326] bg-[#0d0d10] p-5">
                <ROICalculator pricingModel={tool.pricingModel} pricingAmount={tool.pricingAmount} name={tool.name} />
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-[#232326] bg-[#0d0d10] p-8 text-center space-y-4">
              <p className="text-[#52525B] text-sm">Detailed pricing tiers not listed yet.</p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <div className="flex flex-col items-center gap-1 px-5 py-3 rounded-xl border border-[#232326] bg-[#131316]">
                  <span className="text-[10px] text-[#52525B]">Model</span>
                  <span className="font-bold text-white capitalize">{tool.pricingModel.toLowerCase().replace("_", " ")}</span>
                </div>
                {tool.pricingAmount && (
                  <div className="flex flex-col items-center gap-1 px-5 py-3 rounded-xl border border-[#6E56CF]/20 bg-[#6E56CF]/5">
                    <span className="text-[10px] text-[#52525B]">Starting at</span>
                    <span className="font-bold text-white">${tool.pricingAmount}/{tool.billingFrequency.toLowerCase()}</span>
                  </div>
                )}
              </div>
              <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6E56CF] hover:underline">
                Check on website <ExternalLink size={11} />
              </a>
              <div className="rounded-xl border border-[#232326] bg-[#131316]/40 p-5 mt-4">
                <ROICalculator pricingModel={tool.pricingModel} pricingAmount={tool.pricingAmount} name={tool.name} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── REVIEWS TAB ── */}
      {activeTab === "reviews" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <div className="lg:col-span-4">
              <RatingHistogram reviews={reviews} avgRating={tool.avgRating} reviewCount={tool.reviewCount} />
            </div>
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare size={13} className="text-[#6E56CF]" /> User Reviews
                </h2>
                <button onClick={() => setShowReviewForm(!showReviewForm)}
                  className="rounded-lg border border-[#6E56CF]/20 bg-[#0d0d10] px-3 py-1.5 text-xs font-semibold text-[#6E56CF] hover:bg-[#6E56CF]/5 transition-all">
                  {showReviewForm ? "Cancel" : "Write a review"}
                </button>
              </div>
              {showReviewForm && (
                <div className="rounded-lg border border-[#232326] bg-[#131316]/30 p-4">
                  <ReviewForm toolId={tool.id} toolSlug={tool.slug} />
                </div>
              )}
              <ReviewList reviews={reviews} />
            </div>
          </div>
        </div>
      )}

      {/* ── Full-width Alternatives ── */}
      {similarTools.length > 0 && activeTab === "overview" && (
        <section className="mt-7 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-[#71717A] uppercase tracking-wider flex items-center gap-2">
              <Layers size={13} className="text-[#6E56CF]/60" /> Top Alternatives to {tool.name}
            </h2>
            <Link href="/tools" className="inline-flex items-center gap-1 text-xs font-bold text-[#6E56CF] hover:underline">
              View all <ArrowRight size={11} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {similarTools.slice(0, 5).map((s, i) => <AltCard key={s.id} tool={s} index={i} />)}
          </div>
        </section>
      )}

      <StickyCTA name={tool.name} logoUrl={tool.logoUrl} websiteUrl={tool.websiteUrl}
        avgRating={tool.avgRating} reviewCount={tool.reviewCount} />
    </main>
  );
}