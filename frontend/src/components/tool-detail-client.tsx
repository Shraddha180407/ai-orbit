'use client';

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ArrowUpRight from 'lucide-react/dist/esm/icons/arrow-up-right';
import { API_URL } from "@/lib/api";
import type { ToolDetailData, ToolCardData, ReviewData } from "@/lib/types";
import { PricingBadge } from "@/components/PricingBadge";
import { CategoryChip } from "@/components/CategoryChip";
import { RatingStars } from "@/components/RatingStars";
import { BookmarkButton } from "@/components/BookmarkButton";
import { ToolCard } from "@/components/ToolCard";
import { ToolTabs } from "@/components/ToolTabs";
import { StickyCTA } from "@/components/StickyCTA";

export function ToolDetailClient() {
  const params = useParams();
  const slug = params.slug as string;

  const [tool, setTool] = useState<ToolDetailData | null>(null);
  const [similarTools, setSimilarTools] = useState<ToolCardData[]>([]);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [bookmarked, setBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    async function fetchTool() {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/v1/tools/${slug}`);
        if (!res.ok) {
          setNotFoundState(true);
          return;
        }
        const data = await res.json();
        setTool(data.tool);
        setSimilarTools(data.similarTools || []);
        setReviews(data.reviews || []);
        setBookmarked(data.bookmarked || false);
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

  return (
    <main className="mx-auto max-w-container px-4 py-6 md:px-6 md:py-10 relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl pointer-events-none z-0"></div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-4 md:mb-6 text-sm text-foreground-faint relative z-10">
        <Link href="/tools" className="hover:text-foreground transition-colors">
          AI Tools
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground-muted">{tool.name}</span>
      </nav>

      {/* Premium Glassmorphic Header */}
      <header className="relative z-10 flex flex-col gap-6 rounded-xl border border-border/80 bg-surface/40 p-4 md:p-6 backdrop-blur-md shadow-2xl shadow-black/30 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-4 xs:flex-row xs:items-start sm:gap-4">
          {/* Logo */}
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-white/95 p-2.5 shadow-xl shadow-black/20 self-start xs:self-auto">
            {tool.logoUrl ? (
              <Image
                src={tool.logoUrl}
                alt={`${tool.name} logo`}
                width={80}
                height={80}
                className="h-full w-full object-contain"
                priority
              />
            ) : (
              <span className="text-2xl font-bold text-neutral-900 select-none">
                {tool.name.charAt(0)}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {tool.name}
            </h1>

            {tool.company && (
              <p className="text-xs text-foreground-muted">
                by{" "}
                <span className="text-foreground font-semibold">
                  {tool.company.name}
                </span>
              </p>
            )}

            <div className="flex flex-col gap-2 pt-1.5 sm:flex-row sm:items-center sm:gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <PricingBadge
                  pricingModel={tool.pricingModel}
                  pricingAmount={tool.pricingAmount}
                  billingFrequency={tool.billingFrequency}
                />
                {tool.categories.map(({ category }) => (
                  <CategoryChip
                    key={category.slug}
                    label={category.name}
                    href={`/tools?category=${category.slug}`}
                  />
                ))}
              </div>
            </div>

            <div className="pt-1">
              <RatingStars
                rating={tool.avgRating}
                reviewCount={tool.reviewCount}
                size="md"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full sm:w-auto mt-2 sm:mt-0">
          <BookmarkButton
            toolId={tool.id}
            toolSlug={tool.slug}
            initialBookmarked={bookmarked}
            initialCount={tool._count.bookmarks}
            className="w-full sm:w-auto justify-center py-2.5 sm:py-1.5"
          />

          <a
            href={tool.websiteUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex w-full sm:w-auto justify-center items-center gap-1.5 rounded-lg bg-accent px-4 py-2.5 sm:py-2 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition-all hover:bg-accent-hover hover:-translate-y-0.5"
          >
            Visit Website
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="mt-8 flex flex-col gap-8 lg:flex-row relative z-10 pb-20 md:pb-0">
        <div className="flex-1 min-w-0">
          <ToolTabs tool={tool} reviews={reviews} />
        </div>

        {similarTools.length > 0 && (
          <aside
            className="w-full shrink-0 lg:w-80 space-y-4"
            aria-labelledby="similar-heading"
          >
            <h2
              id="similar-heading"
              className="text-lg font-bold text-foreground border-b border-border/40 pb-2 flex items-center gap-2"
            >
              Similar Tools
            </h2>

            <div role="list" className="flex flex-col gap-4">
              {similarTools.map((similar) => (
                <div key={similar.id} role="listitem">
                  <ToolCard tool={similar} />
                </div>
              ))}
            </div>
          </aside>
        )}
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
