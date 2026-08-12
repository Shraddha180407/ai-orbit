'use client';

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  ThumbsUp, 
  Bookmark, 
  ArrowUpRight, 
  FileText, 
  Star, 
  Check, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Info,
  Building,
  Globe,
  Calculator,
  Layers,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  Sparkle
} from 'lucide-react';

import { API_URL } from "@/lib/api";
import type { ToolDetailData, ToolCardData, ReviewData } from "@/lib/types";
import { PricingBadge } from "@/components/PricingBadge";
import { RatingStars } from "@/components/RatingStars";
import { BookmarkButton } from "@/components/BookmarkButton";
import { ToolCard } from "@/components/ToolCard";
import { ProsConsVerdict } from "@/components/ProsConsVerdict";
import { RatingHistogram } from "@/components/RatingHistogram";
import { ReviewForm } from "@/components/ReviewForm";
import { ReviewList } from "@/components/ReviewList";
import { ROICalculator } from "@/components/ROICalculator";
import { StickyCTA } from "@/components/StickyCTA";
import { cn } from "@/lib/utils";

const PLATFORM_MAP: Record<string, string> = {
  WEB: "Web",
  MACOS: "macOS",
  WINDOWS: "Windows",
  IOS: "iOS",
  ANDROID: "Android",
  CHROME_EXTENSION: "Chrome Ext.",
  LINUX: "Linux"
};

const PERSONA_MAP: Record<string, string> = {
  DEVELOPERS: "Developers",
  DESIGNERS: "Designers",
  STUDENTS: "Students",
  MARKETERS: "Marketers",
  WRITERS: "Writers",
  RESEARCHERS: "Researchers",
  EDUCATORS: "Educators",
  SALES: "Sales",
  ENTERPRISE: "Enterprise",
  CONTENT_CREATORS: "Content Creators"
};

const parseFeature = (feat: string) => {
  const parts = feat.split(/[:|-]/);
  if (parts.length > 1) {
    return {
      title: parts[0].trim(),
      description: parts.slice(1).join(":").trim()
    };
  }
  return {
    title: feat,
    description: ""
  };
};

export function ToolDetailClient() {
  const params = useParams();
  const slug = params.slug as string;

  const [tool, setTool] = useState<ToolDetailData | null>(null);
  const [similarTools, setSimilarTools] = useState<ToolCardData[]>([]);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [bookmarked, setBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  // Upvote local state
  const [upvoted, setUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(0);

  // Screenshot Carousel State
  const [activeScreenshotIdx, setActiveScreenshotIdx] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    async function fetchTool() {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/v1/tools/${slug}`, { credentials: 'include' });
        if (!res.ok) {
          setNotFoundState(true);
          return;
        }
        const data = await res.json();
        setTool(data.tool);
        setSimilarTools(data.similarTools || []);
        setReviews(data.reviews || []);
        setBookmarked(data.bookmarked || false);
        setUpvoteCount(data.tool?.upvoteCount || 0);

        // Load local upvote state
        const storedUpvoted = localStorage.getItem(`upvoted-${data.tool?.id}`);
        if (storedUpvoted === "true") {
          setUpvoted(true);
        }

        if (data.tool?.id) {
          fetch(`${API_URL}/api/user/history`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ toolId: data.tool.id })
          }).catch(e => console.error('Failed to record history', e));
        }
      } catch (error) {
        console.error("Failed to fetch tool:", error);
        setNotFoundState(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTool();
  }, [slug]);

  // Update page title dynamically
  useEffect(() => {
    if (tool) {
      document.title = `${tool.name} — AI Tool Details, Pricing & Reviews | The AI Signal`;
    }
  }, [tool]);

  const handleUpvoteToggle = () => {
    if (!tool) return;
    const nextUpvoted = !upvoted;
    setUpvoted(nextUpvoted);
    setUpvoteCount(prev => nextUpvoted ? prev + 1 : Math.max(0, prev - 1));
    localStorage.setItem(`upvoted-${tool.id}`, nextUpvoted ? "true" : "false");
  };

  if (notFoundState) {
    notFound();
  }

  if (isLoading || !tool) {
    return (
      <main className="mx-auto max-w-container px-4 py-6 md:px-6 md:py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-4 w-32 rounded bg-[#232326]" />
          <div className="rounded-xl border border-border/80 bg-surface/40 p-6 space-y-4">
            <div className="flex gap-4">
              <div className="h-20 w-20 rounded-xl bg-[#232326]" />
              <div className="space-y-2 flex-1">
                <div className="h-6 w-48 rounded bg-[#232326]" />
                <div className="h-4 w-24 rounded bg-[#232326]" />
                <div className="h-4 w-32 rounded bg-[#232326]" />
              </div>
            </div>
          </div>
          <div className="h-64 rounded-xl border border-border/80 bg-surface/40" />
        </div>
      </main>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    applicationCategory: tool.categories[0]?.category.name ?? "AI Tool",
    url: tool.websiteUrl,
    ...(tool.avgRating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: tool.avgRating,
            reviewCount: tool.reviewCount,
          },
        }
      : {}),
  };

  const formatDate = (dateVal: string | null) => {
    if (!dateVal) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(new Date(dateVal));
  };

  return (
    <main className="mx-auto max-w-container px-4 py-6 md:px-6 md:py-10 relative overflow-hidden text-foreground collections-scope">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl pointer-events-none z-0"></div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-4 text-xs font-semibold text-foreground-faint flex items-center gap-1.5 relative z-10">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>&gt;</span>
        <Link href="/tools" className="hover:text-white transition-colors">AI Tools</Link>
        <span>&gt;</span>
        <Link href={`/tools?category=${tool.categories[0]?.category.slug}`} className="hover:text-white transition-colors capitalize">
          {tool.categories[0]?.category.name}
        </Link>
        <span>&gt;</span>
        <span className="text-foreground-muted">{tool.name}</span>
      </nav>

      {/* Header Profile Section */}
      <header className="relative z-10 flex flex-col gap-6 rounded-2xl border border-[#232326] bg-[#0d0d10] p-6 md:p-8 shadow-2xl shadow-black/35 lg:flex-row lg:items-center lg:justify-between overflow-hidden">
        {/* Background decorative glow */}
        <div className="absolute right-0 top-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl pointer-events-none z-0"></div>

        <div className="flex flex-col gap-6 md:flex-row md:items-center relative z-10">
          {/* Logo container */}
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#232326] bg-white p-4 shadow-xl shadow-black/25 self-start md:self-center transition-transform hover:scale-105 duration-200">
            {tool.logoUrl ? (
              <Image
                src={tool.logoUrl}
                alt={`${tool.name} logo`}
                width={96}
                height={96}
                className="h-full w-full object-contain"
                priority
              />
            ) : (
              <span className="text-3xl font-black text-neutral-900 select-none">
                {tool.name.charAt(0)}
              </span>
            )}
          </div>

          <div className="space-y-3.5">
            <div className="space-y-1">
              <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
                {tool.name}
                {tool.verified && (
                  <ShieldCheck size={22} className="text-accent fill-accent/10 shrink-0" aria-label="Verified tool" />
                )}
              </h1>
              
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <PricingBadge
                  pricingModel={tool.pricingModel}
                  pricingAmount={tool.pricingAmount}
                  billingFrequency={tool.billingFrequency}
                />
                <RatingStars
                  rating={tool.avgRating}
                  reviewCount={tool.reviewCount}
                  size="sm"
                />
              </div>
            </div>

            <p className="text-sm text-neutral-300 max-w-[650px] leading-relaxed font-medium">
              {tool.description.length > 150 ? `${tool.description.slice(0, 150)}...` : tool.description}
            </p>

            <div className="space-y-2 pt-1">
              {/* Best For Row */}
              {tool.targetUsers && tool.targetUsers.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-foreground-faint">
                  <span className="font-bold text-neutral-400">Best for:</span>
                  <div className="flex flex-wrap gap-1">
                    {tool.targetUsers.map((persona) => (
                      <span 
                        key={persona} 
                        className="rounded-md border border-[#232326] bg-[#131316] px-2 py-0.5 font-bold text-white/90"
                      >
                        {PERSONA_MAP[persona] || persona}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Works On Row */}
              {tool.compatibility && tool.compatibility.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-foreground-faint">
                  <span className="font-bold text-neutral-400">Works on:</span>
                  <div className="flex flex-wrap gap-1">
                    {tool.compatibility.map((platform) => (
                      <span 
                        key={platform} 
                        className="rounded-md border border-[#232326] bg-[#131316] px-2 py-0.5 font-bold text-neutral-300"
                      >
                        {PLATFORM_MAP[platform] || platform}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action column */}
        <div className="flex flex-col gap-3.5 w-full lg:w-72 mt-4 lg:mt-0 relative z-10 shrink-0">
          <div className="grid grid-cols-2 gap-2.5 w-full">
            {/* Upvote local button */}
            <button
              onClick={handleUpvoteToggle}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold transition-all active:scale-95",
                upvoted
                  ? "bg-accent text-white border-accent shadow-lg shadow-accent/15"
                  : "border-[#232326] bg-[#131316] text-white hover:border-white/10"
              )}
            >
              <ThumbsUp size={13} className={cn("shrink-0", upvoted && "fill-white")} />
              <span>{upvoteCount} Upvotes</span>
            </button>

            {/* Bookmark button */}
            <BookmarkButton
              toolId={tool.id}
              toolSlug={tool.slug}
              initialBookmarked={bookmarked}
              initialCount={tool._count.bookmarks}
              className="w-full justify-center py-2 border-[#232326] bg-[#131316] text-white font-bold"
            />
          </div>

          <a
            href={tool.websiteUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex w-full justify-center items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-accent/15 transition-all hover:bg-accent-hover hover:-translate-y-0.5 active:scale-95"
          >
            Visit Website
            <ArrowUpRight size={15} strokeWidth={2.5} />
          </a>

          {tool.hasApi && tool.apiDocsUrl && (
            <a
              href={tool.apiDocsUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex w-full justify-center items-center gap-1.5 rounded-lg border border-[#232326] bg-[#0d0d10] px-4 py-2.5 text-sm font-semibold text-neutral-300 hover:text-white hover:border-white/10 transition-all active:scale-95"
            >
              View API Docs
            </a>
          )}
        </div>
      </header>

      {/* Main Responsive Split Grid */}
      <div className="mt-8 flex flex-col gap-6 lg:flex-row relative z-10 pb-20 md:pb-0">
        
        {/* Left Column - Core Content (Span 2/3) */}
        <div className="flex-1 min-w-0 space-y-6">
          
          {/* Screenshot Gallery Carousel */}
          {tool.screenshots && tool.screenshots.length > 0 && (
            <section aria-label="Screenshots" className="rounded-xl border border-[#232326] bg-[#0d0d10] p-4 relative overflow-hidden">
              <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Layers size={15} className="text-accent" />
                Screenshots
              </h2>
              <div className="relative h-[250px] sm:h-[350px] w-full rounded-lg overflow-hidden bg-[#131316]/50 flex items-center justify-center">
                <Image
                  src={tool.screenshots[activeScreenshotIdx]}
                  alt={`${tool.name} screenshot ${activeScreenshotIdx + 1}`}
                  fill
                  className="object-contain p-2"
                  unoptimized
                />
                
                {tool.screenshots.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveScreenshotIdx(prev => prev === 0 ? tool.screenshots.length - 1 : prev - 1)}
                      className="absolute left-3 p-1.5 rounded-full border border-[#232326] bg-[#0d0d10]/80 text-white hover:bg-[#131316] transition-colors"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => setActiveScreenshotIdx(prev => prev === tool.screenshots.length - 1 ? 0 : prev + 1)}
                      className="absolute right-3 p-1.5 rounded-full border border-[#232326] bg-[#0d0d10]/80 text-white hover:bg-[#131316] transition-colors"
                    >
                      <ChevronRight size={16} />
                    </button>

                    {/* Indicator dots */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                      {tool.screenshots.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveScreenshotIdx(idx)}
                          className={cn(
                            "h-1.5 w-1.5 rounded-full transition-all",
                            activeScreenshotIdx === idx ? "bg-accent w-3" : "bg-white/20"
                          )}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </section>
          )}

          {/* Overview & Key Features Card */}
          <section aria-labelledby="overview-heading" className="rounded-xl border border-[#232326] bg-[#0d0d10] p-5 md:p-6 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 border-b border-[#232326]/60 pb-2">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-accent/15">
                  <FileText className="text-accent h-3.5 w-3.5" />
                </span>
                <h2 id="overview-heading" className="text-sm font-bold text-white uppercase tracking-wider">
                  Overview
                </h2>
              </div>
              <p className="text-xs leading-relaxed text-neutral-300 whitespace-pre-line">
                {tool.description}
              </p>
            </div>

            {tool.features && tool.features.length > 0 && (
              <div className="space-y-3.5 pt-4 border-t border-[#232326]/60">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {tool.features.map((feature, index) => {
                    const parsed = parseFeature(feature);
                    return (
                      <div 
                        key={index}
                        className="flex items-center gap-3.5 rounded-xl border border-[#232326] bg-[#0d0d10]/40 px-3.5 py-3 hover:border-white/5 transition-all"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 border border-accent/20">
                          <Sparkles size={13} className="text-accent" />
                        </span>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">{parsed.title}</h4>
                          {parsed.description && (
                            <p className="text-[10px] text-neutral-400 mt-0.5 truncate leading-relaxed">
                              {parsed.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          {/* Pros & Cons Section */}
          <section aria-labelledby="analysis-heading">
            <ProsConsVerdict
              name={tool.name}
              description={tool.description}
              features={tool.features}
              categories={tool.categories}
              pros={tool.pros}
              cons={tool.cons}
            />
          </section>

          {/* Integrations Grid */}
          {tool.integrations && tool.integrations.length > 0 && (
            <section aria-labelledby="integrations-heading" className="rounded-xl border border-[#232326] bg-[#0d0d10] p-5 md:p-6 space-y-4">
              <h2 id="integrations-heading" className="text-lg font-bold text-white flex items-center gap-2">
                <Layers size={16} className="text-accent" />
                Integrations
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {tool.integrations.map(({ integration }) => (
                  <div 
                    key={integration.slug}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-[#232326] bg-[#0d0d10]/30 hover:border-white/5 transition-all text-center"
                  >
                    <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-white/5 p-1 mb-2 border border-white/[0.03]">
                      {integration.logoUrl ? (
                        <Image
                          src={integration.logoUrl}
                          alt={`${integration.name} logo`}
                          fill
                          className="object-contain p-1"
                        />
                      ) : (
                        <span className="text-sm font-bold text-white flex items-center justify-center h-full">
                          {integration.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-foreground-muted font-semibold truncate w-full">{integration.name}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Reviews & Ratings Timeline (Mockup Split layout) */}
          <section aria-labelledby="reviews-heading" className="rounded-xl border border-[#232326] bg-[#0d0d10] p-5 md:p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#232326]/60 pb-2">
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-accent/15">
                  <MessageSquare className="text-accent h-3.5 w-3.5" />
                </span>
                <h2 id="reviews-heading" className="text-sm font-bold text-white uppercase tracking-wider">
                  Reviews & Ratings
                </h2>
              </div>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="rounded-lg border border-accent/20 bg-[#0d0d10] px-3.5 py-1.5 text-xs font-semibold text-accent hover:bg-accent/5 transition-all"
              >
                {showReviewForm ? "Cancel" : "Write a review"}
              </button>
            </div>

            {/* Split layout: Histogram on the left, reviews on the right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2 items-start">
              {/* Left Column (Histogram Card) */}
              <div className="lg:col-span-4 lg:sticky lg:top-4">
                <RatingHistogram
                  reviews={reviews}
                  avgRating={tool.avgRating}
                  reviewCount={tool.reviewCount}
                />
              </div>

              {/* Right Column (Review Form & Reviews List) */}
              <div className="lg:col-span-8 space-y-6">
                {showReviewForm && (
                  <div className="rounded-lg border border-[#232326] bg-[#131316]/30 p-4 animate-in fade-in slide-in-from-top-3 duration-200">
                    <ReviewForm toolId={tool.id} toolSlug={tool.slug} />
                  </div>
                )}
                
                <ReviewList reviews={reviews} />

                {reviews.length > 0 && (
                  <div className="pt-2">
                    <button className="rounded-lg border border-[#232326] bg-[#0d0d10] px-4 py-2 text-xs font-semibold text-accent hover:border-white/10 transition-all">
                      View all {tool.reviewCount} reviews
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>

        </div>

        {/* Right Column - Specifications & Sidebars (Span 1/3) */}
        <aside className="w-full shrink-0 lg:w-[350px] space-y-6">

          {/* Specifications Table Card */}
          <section className="rounded-xl border border-[#232326] bg-[#0d0d10] p-5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-[#232326]/60 pb-2">
              <FileText size={15} className="text-accent" />
              Specifications & Pricing
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#232326]/40">
                <span className="text-foreground-faint">Pricing Model</span>
                <span className="font-semibold text-white capitalize">{tool.pricingModel.toLowerCase().replace("_", " ")}</span>
              </div>
              {tool.pricingAmount && (
                <div className="flex justify-between py-1.5 border-b border-[#232326]/40">
                  <span className="text-foreground-faint">Base Cost</span>
                  <span className="font-semibold text-white">${tool.pricingAmount} / {tool.billingFrequency.toLowerCase()}</span>
                </div>
              )}
              <div className="flex justify-between py-1.5 border-b border-[#232326]/40">
                <span className="text-foreground-faint">Billing Frequency</span>
                <span className="font-semibold text-white capitalize">{tool.billingFrequency.toLowerCase()}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#232326]/40">
                <span className="text-foreground-faint">Open Source</span>
                <span className="font-semibold text-white">{tool.isOpenSource ? "Yes" : "No"}</span>
              </div>
              {tool.company && (
                <div className="flex justify-between py-1.5 border-b border-[#232326]/40">
                  <span className="text-foreground-faint">Company</span>
                  <span className="font-semibold text-white">{tool.company.name}</span>
                </div>
              )}
              {tool.releaseDate && (
                <div className="flex justify-between py-1.5 border-b border-[#232326]/40">
                  <span className="text-foreground-faint">Release Date</span>
                  <span className="font-semibold text-white">{formatDate(tool.releaseDate)}</span>
                </div>
              )}
            </div>
          </section>

          {/* Dynamic Pricing Tier Card */}
          <section className="rounded-xl border border-[#232326] bg-[#0d0d10] p-5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-[#232326]/60 pb-2">
              <Calculator size={15} className="text-accent" />
              Choose Your Plan
            </h3>
            
            <div className="grid grid-cols-1 gap-3">
              {/* Render Free plan tier if Freemium / Free Trial */}
              {(tool.pricingModel === "FREEMIUM" || tool.pricingModel === "FREE_TRIAL" || tool.pricingModel === "FREE") && (
                <div className="rounded-lg border border-[#232326] bg-[#0d0d10]/40 p-3.5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-neutral-400">Basic Tier</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-white">$0</span>
                    <span className="text-[10px] text-neutral-400">/ forever</span>
                  </div>
                  <p className="text-[10px] text-foreground-faint">Free limited account access to try out basic features.</p>
                </div>
              )}

              {/* Render Premium tier if Paid / Freemium */}
              {tool.pricingModel !== "FREE" && (
                <div className="rounded-lg border border-accent/20 bg-accent/[0.02] p-3.5 space-y-1 relative overflow-hidden">
                  <div className="absolute right-0 top-0 bg-accent text-black font-extrabold text-[8px] uppercase px-1.5 py-0.5 rounded-bl">Active</div>
                  <span className="text-[10px] uppercase font-bold text-accent">Pro Plan</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-white">${tool.pricingAmount || "Price Variable"}</span>
                    <span className="text-[10px] text-neutral-400">/ {tool.billingFrequency.toLowerCase()}</span>
                  </div>
                  <p className="text-[10px] text-foreground-faint">Full premium features access with regular updates.</p>
                </div>
              )}
            </div>
          </section>

          {/* ROI Calculator Card */}
          <section className="rounded-xl border border-[#232326] bg-[#0d0d10] p-5">
            <ROICalculator
              pricingModel={tool.pricingModel}
              pricingAmount={tool.pricingAmount}
              name={tool.name}
            />
          </section>

          {/* Alternatives Sidebar */}
          {similarTools.length > 0 && (
            <section
              className="rounded-xl border border-[#232326] bg-[#0d0d10] p-5 space-y-4"
              aria-labelledby="similar-heading"
            >
              <div className="flex items-center justify-between border-b border-[#232326]/60 pb-2">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded bg-accent/15">
                    <Layers className="text-accent h-3.5 w-3.5" />
                  </span>
                  <h3 id="similar-heading" className="text-sm font-bold text-white uppercase tracking-wider">
                    Alternatives
                  </h3>
                </div>
              </div>

              <div role="list" className="flex flex-col gap-3">
                {similarTools.map((similar) => (
                  <div 
                    key={similar.id} 
                    role="listitem"
                    className="flex items-center justify-between gap-3 py-2 border-b border-[#232326]/40 last:border-b-0"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Logo */}
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-[#232326] bg-white/95 p-1">
                        {similar.logoUrl ? (
                          <Image
                            src={similar.logoUrl}
                            alt={`${similar.name} logo`}
                            fill
                            className="object-contain p-1"
                          />
                        ) : (
                          <span className="text-sm font-bold text-neutral-900 flex items-center justify-center h-full">
                            {similar.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      
                      <div className="min-w-0">
                        <Link href={`/tools/${similar.slug}`} className="block text-sm font-bold text-white hover:text-accent truncate">
                          {similar.name}
                        </Link>
                        <span className="block text-[10px] text-foreground-faint truncate max-w-[240px]">
                          {similar.description}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-center border-t border-[#232326]/40">
                <Link
                  href="/tools"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:underline"
                >
                  View all alternatives
                  <ArrowRight size={13} />
                </Link>
              </div>
            </section>
          )}

        </aside>
      </div>

      {/* Floating Sticky CTA on mobile screens */}
      <StickyCTA
        name={tool.name}
        logoUrl={tool.logoUrl}
        websiteUrl={tool.websiteUrl}
        avgRating={tool.avgRating}
        reviewCount={tool.reviewCount}
      />
    </main>
  );
}
