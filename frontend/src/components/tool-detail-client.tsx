'use client';

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    ThumbsUp, Bookmark, ArrowUpRight, FileText, Check, X,
  ChevronLeft, ChevronRight, Sparkles, Layers,
  ArrowRight, ShieldCheck, MessageSquare, Globe, Building,
  Tag, Zap, BarChart2, ExternalLink, Play, Star,
  TrendingUp, Code2, Github, Twitter, Linkedin, Share2,
} from 'lucide-react';

import { API_URL } from "@/lib/api";
import type { ToolDetailData, ToolCardData, ReviewData } from "@/lib/types";
import type { ToolDetailDataExtended, PricingTier } from "@/data/tools";
import { getSampleTool, getSampleSimilarTools } from "@/data/tools";
import { PricingBadge } from "@/components/PricingBadge";
import { RatingStars } from "@/components/RatingStars";
import { BookmarkButton } from "@/components/BookmarkButton";
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

function formatNum(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function parseFeature(feat: string) {
  const parts = feat.split(/[:|-]/);
  if (parts.length > 1) {
    return { title: parts[0].trim(), description: parts.slice(1).join(":").trim() };
  }
  return { title: feat, description: "" };
}

// ── Logo with fallback ────────────────────────────────────────────────────────
function ToolLogo({ logoUrl, name, size = 96 }: { logoUrl: string | null; name: string; size?: number }) {
  const [failed, setFailed] = useState(false);
  if (!logoUrl || failed) {
    return <span className="text-3xl font-black text-neutral-900 select-none">{name.charAt(0)}</span>;
  }
  return (
    <Image src={logoUrl} alt={`${name} logo`} width={size} height={size}
      className="h-full w-full object-contain" priority onError={() => setFailed(true)} />
  );
}

// ── Screenshot / Video Gallery ────────────────────────────────────────────────
function MediaGallery({ screenshots, videoUrl, name }: {
  screenshots: string[]; videoUrl?: string | null; name: string;
}) {
  const mediaItems = [
    ...(videoUrl ? [{ type: "video" as const, src: videoUrl }] : []),
    ...screenshots.map((src) => ({ type: "image" as const, src })),
  ];
  const [idx, setIdx] = useState(0);
  if (mediaItems.length === 0) return null;
  const active = mediaItems[idx];

  return (
    <section className="rounded-xl border border-[#232326] bg-[#0d0d10] overflow-hidden">
      {/* Main display */}
      <div className="relative bg-[#0a0a0c] h-[280px] sm:h-[400px] flex items-center justify-center overflow-hidden">
        {active.type === "video" ? (
  <iframe
    src={active.src
      .replace("youtu.be/", "www.youtube.com/embed/")
      .replace("watch?v=", "embed/")
      .replace(/[?&]si=[^&]+/, "")}
    className="w-full h-full"
    allowFullScreen
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  />
) : (
          <Image src={active.src} alt={`${name} screenshot ${idx + 1}`} fill
  className="object-cover" unoptimized />
        )}
        {mediaItems.length > 1 && (
          <>
            <button onClick={() => setIdx((i) => (i === 0 ? mediaItems.length - 1 : i - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => setIdx((i) => (i === mediaItems.length - 1 ? 0 : i + 1))}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors">
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>
      {/* Thumbnail strip */}
      {mediaItems.length > 1 && (
        <div className="flex gap-2 p-3 bg-[#0a0a0c] border-t border-[#1a1a1e] overflow-x-auto [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-[#232326] [&::-webkit-scrollbar-thumb]:rounded-full">          {mediaItems.map((item, i) => (
            <button key={i} onClick={() => setIdx(i)}
              className={`relative shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === idx ? "border-[#6E56CF]" : "border-[#232326] hover:border-[#52525B]"}`}>
              {item.type === "video" ? (
                <div className="w-full h-full bg-[#18181C] flex items-center justify-center">
                  <Play size={14} className="text-white/60 fill-white/60" />
                </div>
              ) : (
                <Image src={item.src} alt={`thumb ${i}`} fill className="object-cover" unoptimized />
              )}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

// ── Stat pill ─────────────────────────────────────────────────────────────────
function StatPill({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-xl border border-[#232326] bg-[#111114] px-4 py-4 w-full hover:border-[#6E56CF]/30 transition-colors">
      <Icon size={16} className="text-[#6E56CF]" />
      <span className="text-base font-black text-white leading-none">{value}</span>
      <span className="text-[10px] font-mono font-bold text-[#52525B] uppercase tracking-widest">{label}</span>
    </div>
  );
}

// ── Pricing tier card ─────────────────────────────────────────────────────────
function PricingCard({ tier }: { tier: PricingTier }) {
  return (
    <div className={cn(
      "relative rounded-xl border p-4 space-y-3 flex flex-col",
      tier.isPopular
        ? "border-[#6E56CF]/40 bg-[#6E56CF]/5"
        : "border-[#232326] bg-[#0d0d10]"
    )}>
      {tier.isPopular && (
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#6E56CF] text-white text-[9px] font-extrabold uppercase px-3 py-0.5 rounded-full tracking-wider">
          Most Popular
        </div>
      )}
      <div>
        <p className="text-[10px] font-mono font-bold text-[#71717A] uppercase tracking-widest">{tier.name}</p>
        <p className="text-2xl font-black text-white mt-1">{tier.price}</p>
        <p className="text-[11px] text-[#71717A] mt-0.5">{tier.description}</p>
      </div>
      <ul className="space-y-1.5 flex-1">
        {tier.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-[11px] text-[#A1A1AA]">
            <Check size={11} className="text-[#6E56CF] shrink-0 mt-0.5" />
            {f}
          </li>
        ))}
      </ul>
      <button className={cn(
        "w-full rounded-lg py-2 text-xs font-bold transition-all",
        tier.isPopular
          ? "bg-[#6E56CF] text-white hover:bg-[#7C66DF]"
          : "border border-[#232326] text-[#A1A1AA] hover:text-white hover:border-white/10"
      )}>
        {tier.price === "Custom" ? "Contact Sales" : "Get Started"}
      </button>
    </div>
  );
}

// ── Alternative tool card ─────────────────────────────────────────────────────
const ALT_ACCENT_COLORS = [
  "#6E56CF", "#E85D4A", "#0082FB", "#34A853",
  "#FF9900", "#E91E8C", "#00BCD4", "#FF6B35",
];

function AltCard({ tool, index = 0 }: { tool: ToolCardData; index?: number }) {
  const [logoFailed, setLogoFailed] = useState(false);
  const accentColor = ALT_ACCENT_COLORS[index % ALT_ACCENT_COLORS.length];
  return (
    <Link href={`/tools/${tool.slug}`}
      className="group flex gap-3 rounded-xl border border-[#232326] bg-[#0d0d10] p-4 transition-all duration-200 relative overflow-hidden"
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.boxShadow = `inset 3px 0 0 ${accentColor}`;
        el.style.backgroundColor = `${accentColor}08`;
        const logoEl = el.querySelector<HTMLElement>('[data-altlogo="true"]');
        if (logoEl) { logoEl.style.borderColor = accentColor; logoEl.style.boxShadow = `0 0 8px ${accentColor}55`; }
        const nameEl = el.querySelector<HTMLElement>('[data-altname="true"]');
        if (nameEl) nameEl.style.color = accentColor;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.boxShadow = "";
        el.style.backgroundColor = "";
        const logoEl = el.querySelector<HTMLElement>('[data-altlogo="true"]');
        if (logoEl) { logoEl.style.borderColor = ""; logoEl.style.boxShadow = ""; }
        const nameEl = el.querySelector<HTMLElement>('[data-altname="true"]');
        if (nameEl) nameEl.style.color = "";
      }}
    >
      <div data-altlogo="true" className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[#232326] bg-white flex items-center justify-center p-2 transition-all duration-200">
        {tool.logoUrl && !logoFailed ? (
          <Image src={tool.logoUrl} alt={tool.name} fill className="object-contain p-1"
            onError={() => setLogoFailed(true)} />
        ) : (
          <span className="text-xl font-bold text-neutral-900">{tool.name.charAt(0)}</span>
        )}
      </div>
            <div className="min-w-0 flex-1">
        <p data-altname="true" className="text-[13px] font-bold text-white truncate transition-colors duration-200">{tool.name}</p>
        <p className="text-[11px] text-[#71717A] line-clamp-2 mt-0.5 leading-snug">{tool.description}</p>
        {tool.categories?.[0]?.category?.name && (
          <span className="inline-flex items-center mt-2 rounded-full border border-[#232326] bg-[#131316] px-2.5 py-0.5 text-[10px] font-mono font-semibold text-[#A1A1AA]">
            {tool.categories[0].category.name}
          </span>
        )}
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export function ToolDetailClient() {
  const params = useParams();
  const slug = params.slug as string;

  const [tool, setTool] = useState<ToolDetailDataExtended | null>(null);
  const [similarTools, setSimilarTools] = useState<ToolCardData[]>([]);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [bookmarked, setBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);
  const [upvoted, setUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "pricing" | "reviews">("overview");

  useEffect(() => {
    async function fetchTool() {
      setIsLoading(true);
      try {
        // Try sample data first (for design preview)
        const sample = getSampleTool(slug);
        if (sample) {
          setTool(sample);
          setSimilarTools(getSampleSimilarTools(slug));
          setUpvoteCount(sample.upvoteCount);
          setIsLoading(false);
          return;
        }

        // Fall back to API
        const res = await fetch(`${API_URL}/api/v1/tools/${slug}`, { credentials: "include" });
        if (!res.ok) { setNotFoundState(true); return; }
        const data = await res.json();
        // Merge API data with extended type defaults
        setTool({
          ...data.tool,
          longDescription: data.tool.longDescription ?? null,
          videoUrl: data.tool.videoUrl ?? null,
          websiteScreenshotUrl: data.tool.websiteScreenshotUrl ?? null,
          releasedBy: data.tool.releasedBy ?? data.tool.company?.name ?? null,
          country: data.tool.country ?? null,
          views: data.tool.views ?? 0,
          saves: data.tool._count?.bookmarks ?? 0,
          useCases: data.tool.useCases ?? [],
          pricingTiers: data.tool.pricingTiers ?? [],
          verdict: data.tool.verdict ?? null,
          linkedInUrl: data.tool.linkedInUrl ?? null,
          twitterUrl: data.tool.twitterUrl ?? null,
          githubUrl: data.tool.githubUrl ?? null,
          launchDate: data.tool.launchDate ?? null,
          alternativeIds: data.tool.alternativeIds ?? [],
        });
        setSimilarTools(data.similarTools || []);
        setReviews(data.reviews || []);
        setBookmarked(data.bookmarked || false);
        setUpvoteCount(data.tool?.upvoteCount || 0);
        const stored = localStorage.getItem(`upvoted-${data.tool?.id}`);
        if (stored === "true") setUpvoted(true);
        if (data.tool?.id) {
          fetch(`${API_URL}/api/user/history`, {
            method: "POST", credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ toolId: data.tool.id }),
          }).catch(() => {});
        }
      } catch {
        setNotFoundState(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTool();
  }, [slug]);

  useEffect(() => {
    if (tool) document.title = `${tool.name} — AI Tool Details, Pricing & Reviews | AI Orbit`;
  }, [tool]);

  const handleUpvote = () => {
    if (!tool) return;
    const next = !upvoted;
    setUpvoted(next);
    setUpvoteCount((p) => next ? p + 1 : Math.max(0, p - 1));
    localStorage.setItem(`upvoted-${tool.id}`, next ? "true" : "false");
  };

  const handleShare = async () => {
  if (!tool) return;
  const shareData = {
    title: tool.name,
    text: tool.description,
    url: window.location.href,
  };
  if (navigator.share) {
    try { await navigator.share(shareData); } catch {}
  } else {
    await navigator.clipboard.writeText(window.location.href);
  }
};

  if (notFoundState) return notFound();

  if (isLoading || !tool) {
    return (
      <main className="mx-auto max-w-[1400px] px-4 py-8 md:px-6">
        <div className="animate-pulse space-y-6">
          <div className="h-4 w-32 rounded bg-[#232326]" />
          <div className="rounded-2xl border border-[#232326] bg-[#0d0d10] p-8 h-48" />
          <div className="grid lg:grid-cols-[1fr_360px] gap-6">
            <div className="space-y-4">
              <div className="h-80 rounded-xl bg-[#131316] border border-[#232326]" />
              <div className="h-48 rounded-xl bg-[#131316] border border-[#232326]" />
            </div>
            <div className="space-y-4">
              <div className="h-48 rounded-xl bg-[#131316] border border-[#232326]" />
              <div className="h-48 rounded-xl bg-[#131316] border border-[#232326]" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  const formatDate = (v: string | null) => {
    if (!v) return "—";
    return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date(v));
  };

  const displayDescription = tool.longDescription || tool.description;

  return (
    <main className="mx-auto max-w-[1400px] px-4 py-6 md:px-6 md:py-10 text-white">

      {/* ── Breadcrumb ────────────────────────────────────────────────────────── */}
      <nav className="mb-5 text-xs font-semibold text-[#52525B] flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>›</span>
        <Link href="/tools" className="hover:text-white transition-colors">AI Tools</Link>
        {tool.categories[0] && <>
          <span>›</span>
          <Link href={`/tools/${tool.categories[0].category.slug}`}
            className="hover:text-white transition-colors capitalize">
            {tool.categories[0].category.name}
          </Link>
        </>}
        <span>›</span>
        <span className="text-[#A1A1AA]">{tool.name}</span>
      </nav>

      {/* ── Hero Header ──────────────────────────────────────────────────────── */}
      <header className="relative rounded-2xl border border-[#232326] bg-[#0A0A0C] p-6 md:p-8 mb-6 overflow-hidden">
        {/* Accent top bar */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6E56CF]/60 to-transparent" />
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#6E56CF]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          {/* Left: logo + info */}
          <div className="flex gap-5 items-start">
            <div className="relative flex h-28 w-28 md:h-45 md:w-45 shrink-0 self-center items-center justify-center overflow-hidden rounded-2xl border border-[#232326] bg-white p-3 shadow-xl shadow-black/25">
              <ToolLogo logoUrl={tool.logoUrl} name={tool.name} />
            </div>

            <div className="space-y-2 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                  {tool.name}
                </h1>
                {tool.verified && (
                  <ShieldCheck size={20} className="text-[#6E56CF] shrink-0" aria-label="Verified" />
                )}
                {tool.isTrending && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/15 border border-orange-500/20 px-2 py-0.5 text-[10px] font-bold text-orange-400">
                    <TrendingUp size={10} /> Trending
                  </span>
                )}
              </div>

              {/* Category + rating row */}
              <div className="flex flex-wrap items-center gap-2">
                {tool.pricingModel ? (
  <PricingBadge pricingModel={tool.pricingModel} pricingAmount={tool.pricingAmount} billingFrequency={tool.billingFrequency} />
) : (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#232326] bg-[#131316] px-2.5 py-1 text-[10px] font-bold text-[#52525B]">
    <Tag size={9} className="text-[#52525B]" /> Pricing N/A
  </span>
)}
                <RatingStars rating={tool.avgRating} reviewCount={tool.reviewCount} size="sm" />
                {tool.categories.map(({ category }) => (
                  <Link key={category.slug} href={`/tools/${category.slug}`}
                    className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border border-[#232326] text-[#A1A1AA] hover:text-white hover:border-white/10 transition-colors">
                    {category.name}
                  </Link>
                ))}
              </div>

              <p className="text-sm text-[#A1A1AA] max-w-2xl leading-relaxed">
                {tool.description}
              </p>

              {/* Best for + Works on */}
              <div className="flex flex-col gap-1.5 pt-1">
                {tool.targetUsers?.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="text-[#52525B] font-bold">Best for:</span>
                    {tool.targetUsers.map((p) => (
                      <span key={p} className="rounded-md border border-[#232326] bg-[#131316] px-2 py-0.5 font-bold text-white/80 text-[10px]">
                        {PERSONA_MAP[p] || p}
                      </span>
                    ))}
                  </div>
                )}
                {tool.compatibility?.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="text-[#52525B] font-bold">Works on:</span>
                    {tool.compatibility.map((c) => (
                      <span key={c} className="rounded-md border border-[#232326] bg-[#131316] px-2 py-0.5 font-bold text-[#A1A1AA] text-[10px]">
                        {PLATFORM_MAP[c] || c}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Tags */}
              {tool.tags?.length > 0 && (
  <div className="flex flex-wrap items-center gap-1.5 pt-1">
    {tool.tags.slice(0, 6).map(({ tag }) => (
      <Link key={tag.slug} href={`/tools?tag=${tag.slug}`}
        className="inline-flex items-center gap-1 rounded-full border border-[#6E56CF]/30 bg-[#6E56CF]/10 px-3 py-1 text-[10px] font-mono font-bold text-[#A78BFA] hover:bg-[#6E56CF]/20 hover:text-white hover:border-[#6E56CF]/50 transition-all">
        <span className="text-[#6E56CF]">#</span>{tag.name}
      </Link>
    ))}
  </div>
)}
            </div>
          </div>

          {/* Right: action buttons */}
          <div className="flex flex-col gap-2.5 w-full md:w-64 shrink-0">
            <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer nofollow"
              className="inline-flex w-full justify-center items-center gap-2 rounded-xl bg-[#6E56CF] px-4 py-3 text-sm font-extrabold text-white shadow-lg shadow-[#6E56CF]/20 hover:bg-[#7C66DF] hover:-translate-y-0.5 transition-all active:scale-95">
              Visit Website <ArrowUpRight size={15} strokeWidth={2.5} />
            </a>
            {tool.hasApi && tool.apiDocsUrl && (
              <a href={tool.apiDocsUrl} target="_blank" rel="noopener noreferrer nofollow"
                className="inline-flex w-full justify-center items-center gap-1.5 rounded-xl border border-[#232326] bg-[#0d0d10] px-4 py-2.5 text-sm font-semibold text-[#A1A1AA] hover:text-white hover:border-white/10 transition-all">
                <Code2 size={14} /> View API Docs
              </a>
            )}
            <div className="grid grid-cols-3 gap-2">
  <button onClick={handleUpvote}
    className={cn("flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-all active:scale-95",
      upvoted ? "bg-[#6E56CF] text-white border-[#6E56CF]" : "border-[#232326] bg-[#131316] text-white hover:border-white/10")}>
    <ThumbsUp size={12} className={cn("shrink-0", upvoted && "fill-white")} />
    {formatNum(upvoteCount)}
  </button>
  <button
  onClick={() => setBookmarked((b) => !b)}
  className={cn(
    "flex items-center justify-center rounded-xl border px-3 py-2 transition-all active:scale-95",
    bookmarked
      ? "bg-[#6E56CF] text-white border-[#6E56CF]"
      : "border-[#232326] bg-[#131316] text-white hover:border-white/10"
  )}>
  <Bookmark size={14} className={cn("shrink-0", bookmarked && "fill-white")} />
</button>
  <button onClick={handleShare}
    className="flex items-center justify-center rounded-xl border border-[#232326] bg-[#131316] px-3 py-2 text-white hover:border-white/10 transition-all active:scale-95">
    <Share2 size={14} className="shrink-0" />
  </button>
</div>
          </div>
        </div>

        {/* Stats row */}
        <div className="relative grid grid-cols-5 gap-2 mt-6 pt-5 border-t border-[#1a1a1e] w-full">
  {tool.views > 0 && <StatPill icon={BarChart2} label="Views" value={formatNum(tool.views)} />}
  {tool.saves > 0 && <StatPill icon={Bookmark} label="Saves" value={formatNum(tool.saves)} />}
  {upvoteCount > 0 && <StatPill icon={ThumbsUp} label="Upvotes" value={formatNum(upvoteCount)} />}
  {tool.reviewCount > 0 && <StatPill icon={Star} label="Reviews" value={formatNum(tool.reviewCount)} />}
  {tool.avgRating && <StatPill icon={Star} label="Rating" value={`${tool.avgRating.toFixed(1)}/5`} />}
</div>
      </header>

      {/* ── Tab switcher ──────────────────────────────────────────────────────── */}
      <div className="flex border-b border-[#232326] mb-6 overflow-x-auto scrollbar-none">
        {(["overview", "pricing", "reviews"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn("px-6 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border-b-2 -mb-px",
  activeTab === tab
    ? "border-[#6E56CF] text-white bg-[#6E56CF]/5"
    : "border-transparent text-[#52525B] hover:text-[#A1A1AA] hover:bg-white/[0.03]")}>
            {tab === "reviews" ? `Reviews (${tool.reviewCount})` : tab}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ─────────────────────────────────────────────────────── */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">

          {/* ── LEFT COLUMN ── */}
          <div className="space-y-5">

            {/* Media gallery */}
            <MediaGallery screenshots={tool.screenshots} videoUrl={tool.videoUrl} name={tool.name} />

            {/* Overview */}
            <section className="rounded-xl border border-[#232326] bg-[#0d0d10] p-5 md:p-6 space-y-4">
              <div className="flex items-center gap-2.5 border-b border-[#232326]/60 pb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-[#6E56CF]/15">
                  <FileText className="text-[#6E56CF] h-3.5 w-3.5" />
                </span>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Overview</h2>
              </div>
              <div className="text-[13px] leading-relaxed text-[#A1A1AA] whitespace-pre-line space-y-3">
                {displayDescription.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {/* Use cases */}
              {tool.useCases && tool.useCases.length > 0 && (
                <div className="pt-3 border-t border-[#232326]/60 space-y-2">
                  <h3 className="text-[10px] font-mono font-bold text-[#52525B] uppercase tracking-wider">Use Cases</h3>
                  <div className="flex flex-wrap gap-2">
                    {tool.useCases.map((uc) => (
                      <span key={uc} className="inline-flex items-center gap-1 rounded-full border border-[#232326] bg-[#131316] px-3 py-1 text-[11px] font-semibold text-[#A1A1AA]">
                        <Zap size={9} className="text-[#6E56CF]" /> {uc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Key Features */}
            {tool.features?.length > 0 && (
              <section className="rounded-xl border border-[#232326] bg-[#0d0d10] p-5 md:p-6 space-y-4">
                <div className="flex items-center gap-2.5 border-b border-[#232326]/60 pb-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded bg-[#6E56CF]/15">
                    <Sparkles className="text-[#6E56CF] h-3.5 w-3.5" />
                  </span>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">Key Features</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {tool.features.map((feature, i) => {
                    const parsed = parseFeature(feature);
                    return (
                      <div key={i}
  className="flex items-start gap-3 rounded-xl border border-[#232326] bg-[#0d0d10] px-4 py-4 hover:border-[#6E56CF]/40 hover:bg-[#6E56CF]/5 hover:shadow-[0_0_20px_rgba(110,86,207,0.08)] transition-all duration-200">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#6E56CF]/15 border border-[#6E56CF]/25 mt-0.5">
  <Check size={12} className="text-[#6E56CF]" />
</span>
                        <div className="min-w-0">
                          <p className="text-[12px] font-bold text-white">{parsed.title}</p>
                          {parsed.description && (
                            <p className="text-[11px] text-[#71717A] mt-0.5 leading-snug">{parsed.description}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Pros & Cons */}
            <section>
              <ProsConsVerdict
                name={tool.name}
                description={tool.description}
                features={tool.features}
                categories={tool.categories}
                pros={tool.pros}
                cons={tool.cons}
              />
            </section>

          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <aside className="space-y-5">

            {/* Specifications */}
            <section className="rounded-xl border border-[#232326] bg-[#0d0d10] p-5 space-y-3">
              <h3 className="text-[10px] font-mono font-bold text-[#52525B] uppercase tracking-widest border-b border-[#232326]/60 pb-3 flex items-center gap-2">
                <FileText size={12} className="text-[#6E56CF]" /> Specifications
              </h3>
    <div className="space-y-1">
                {[
                  tool.pricingModel ? { label: "Pricing", value: tool.pricingModel.toLowerCase().replace("_", " ") } : { label: "Pricing", value: "Not listed" },
                  tool.pricingAmount ? { label: "Starting at", value: `$${tool.pricingAmount}/${tool.billingFrequency.toLowerCase()}` } : null,
                  { label: "Open Source", value: tool.isOpenSource ? "Yes" : "No" },
                  { label: "API", value: tool.hasApi ? "Available" : "No" },
                  tool.releasedBy ? { label: "Released By", value: tool.releasedBy } : null,
                  tool.country ? { label: "Country", value: tool.country } : null,
                  tool.launchDate ? { label: "Launch Date", value: tool.launchDate } : null,
                  tool.releaseDate ? { label: "Latest Release", value: formatDate(tool.releaseDate) } : null,
                  tool.company ? { label: "Company", value: tool.company.name } : null,
                ].filter(Boolean).map((row: any) => (
                  <div key={row.label} className="flex items-center gap-6 px-3 py-2.5 rounded-lg hover:bg-[#131316] transition-colors text-xs border-b border-[#1a1a1e] last:border-0">
                    <span className="text-[#52525B] w-28 shrink-0">{row.label}</span>
                    <span className="font-semibold text-white capitalize flex-1 text-right">{row.value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* ROI Calculator */}
            <section className="rounded-xl border border-[#232326] bg-[#0d0d10] p-5">
              <ROICalculator pricingModel={tool.pricingModel} pricingAmount={tool.pricingAmount} name={tool.name} />
            </section>

            {/* Alternatives sidebar list */}
            {similarTools.length > 0 && (
              <section className="rounded-xl border border-[#232326] bg-[#0d0d10] p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[#232326]/60 pb-3">
                  <h3 className="text-[10px] font-mono font-bold text-[#52525B] uppercase tracking-widest flex items-center gap-2">
                    <Layers size={12} className="text-[#6E56CF]" /> Featured Alternatives
                  </h3>
                </div>
                <div className="space-y-3">
                  {similarTools.slice(0, 6).map((s) => (
                    <Link key={s.id} href={`/tools/${s.slug}`}
                      className="flex items-center gap-3 py-2 border-b border-[#1a1a1e] last:border-0 group">
                      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-[#232326] bg-white p-1">
                        {s.logoUrl ? (
                          <Image src={s.logoUrl} alt={s.name} fill className="object-contain p-0.5" />
                        ) : (
                          <span className="text-xs font-bold text-neutral-900 flex items-center justify-center h-full">{s.name.charAt(0)}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-bold text-white group-hover:text-[#6E56CF] truncate transition-colors">{s.name}</p>
                        <p className="text-[10px] text-[#71717A] truncate">{s.description}</p>
                      </div>
                
                    </Link>
                  ))}
                </div>
                <Link href="/tools" className="inline-flex items-center gap-1 text-xs font-bold text-[#6E56CF] hover:underline">
                  View all <ArrowRight size={11} />
                </Link>
              </section>
            )}

            {/* Company card */}
            {tool.company && (
              <section className="rounded-xl border border-[#232326] bg-[#0d0d10] p-5 space-y-3">
                <h3 className="text-[10px] font-mono font-bold text-[#52525B] uppercase tracking-widest border-b border-[#232326]/60 pb-3 flex items-center gap-2">
                  <Building size={12} className="text-[#6E56CF]" /> About the Company
                </h3>
                <div className="flex items-center gap-3">
                  {tool.company.logoUrl && (
                    <div className="h-10 w-10 rounded-lg border border-[#232326] bg-white flex items-center justify-center overflow-hidden p-1">
                      <Image src={tool.company.logoUrl} alt={tool.company.name} width={32} height={32} className="object-contain" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-bold text-white">{tool.company.name}</p>
                    {tool.country && <p className="text-[11px] text-[#71717A]">{tool.country}</p>}
                  </div>
                </div>
              </section>
            )}

           </aside>
        </div>
      )}

      {activeTab === "overview" && (<>
        {/* ── FULL WIDTH: Integrations ── */}
        {tool.integrations?.length > 0 && (
          <section className="mt-5 rounded-xl border border-[#232326] bg-[#0d0d10] p-5 space-y-4">
            <div className="flex items-center gap-2.5 border-b border-[#232326]/60 pb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-[#6E56CF]/15">
                <Layers className="text-[#6E56CF] h-3.5 w-3.5" />
              </span>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Integrations</h2>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {tool.integrations.map(({ integration }) => (
                <div key={integration.slug}
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-[#232326] bg-[#131316]/40 hover:border-[#6E56CF]/20 transition-all text-center gap-2">
                  <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-white p-1">
                    {integration.logoUrl ? (
                      <Image src={integration.logoUrl} alt={integration.name} fill className="object-contain p-0.5" />
                    ) : (
                      <span className="text-xs font-bold text-neutral-900 flex items-center justify-center h-full">{integration.name.charAt(0)}</span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#71717A] font-semibold truncate w-full text-center">{integration.name}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </>)}
      {/* ── PRICING TAB ───────────────────────────────────────────────────────── */}
      {activeTab === "pricing" && (
        <div className="space-y-6">
          {tool.pricingTiers && tool.pricingTiers.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {tool.pricingTiers.map((tier) => (
                  <PricingCard key={tier.name} tier={tier} />
                ))}
              </div>
              <div className="rounded-xl border border-[#232326] bg-[#0d0d10] p-5">
                <ROICalculator pricingModel={tool.pricingModel} pricingAmount={tool.pricingAmount} name={tool.name} />
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-[#232326] bg-[#0d0d10] p-8 text-center">
              <p className="text-[#52525B] text-sm">Detailed pricing tiers coming soon.</p>
              <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-[#6E56CF] hover:underline">
                Check pricing on website <ExternalLink size={11} />
              </a>
            </div>
          )}
        </div>
      )}

      {/* ── REVIEWS TAB ──────────────────────────────────────────────────────── */}
      {activeTab === "reviews" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-4">
              <RatingHistogram reviews={reviews} avgRating={tool.avgRating} reviewCount={tool.reviewCount} />
            </div>
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare size={14} className="text-[#6E56CF]" /> User Reviews
                </h2>
                <button onClick={() => setShowReviewForm(!showReviewForm)}
                  className="rounded-lg border border-[#6E56CF]/20 bg-[#0d0d10] px-3.5 py-1.5 text-xs font-semibold text-[#6E56CF] hover:bg-[#6E56CF]/5 transition-all">
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

      {/* ── Full-width Alternatives Grid (always visible) ─────────────────────── */}
      {similarTools.length > 0 && activeTab === "overview" && (
        <section className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers size={14} className="text-[#6E56CF]" /> Top Alternatives to {tool.name}
            </h2>
            <Link href="/tools" className="inline-flex items-center gap-1 text-xs font-bold text-[#6E56CF] hover:underline">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {similarTools.map((s, i) => <AltCard key={s.id} tool={s} index={i} />)}
          </div>
        </section>
      )}

      {/* ── Related topics ───────────────────────────────────────────────────── */}
      {activeTab === "overview" && (tool.categories.length > 0 || (tool.tags?.length ?? 0) > 0) && (
        <section className="mt-6 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 bg-[#232326]" />
            <h2 className="text-[10px] font-mono font-bold text-[#52525B] uppercase tracking-widest flex items-center gap-1.5">
              <Tag size={11} className="text-[#6E56CF]" /> Related Topics
            </h2>
            <div className="h-px flex-1 bg-[#232326]" />
          </div>
          <div className="flex flex-wrap gap-2">
            {tool.categories.map(({ category }) => (
              <Link key={category.slug} href={`/tools/${category.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#232326] bg-[#131316] px-4 py-1.5 text-xs font-semibold text-[#A1A1AA] hover:border-[#6E56CF]/40 hover:text-white hover:bg-[#6E56CF]/10 transition-all">
                <Layers size={10} className="text-[#6E56CF]" /> {category.name}
              </Link>
            ))}
            {tool.tags?.slice(0, 8).map(({ tag }) => (
              <Link key={tag.slug} href={`/tools?tag=${tag.slug}`}
                className="inline-flex items-center rounded-full border border-[#232326] bg-[#131316] px-4 py-1.5 text-xs font-semibold text-[#A1A1AA] hover:border-[#6E56CF]/40 hover:text-white transition-all">
                #{tag.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <StickyCTA name={tool.name} logoUrl={tool.logoUrl} websiteUrl={tool.websiteUrl}
        avgRating={tool.avgRating} reviewCount={tool.reviewCount} />
    </main>
  );
}