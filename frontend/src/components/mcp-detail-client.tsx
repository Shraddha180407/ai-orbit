'use client';

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Lucide icons
import ArrowUp from 'lucide-react/dist/esm/icons/arrow-up';
import Eye from 'lucide-react/dist/esm/icons/eye';
import Bookmark from 'lucide-react/dist/esm/icons/bookmark';
import Share2 from 'lucide-react/dist/esm/icons/share-2';
import Check from 'lucide-react/dist/esm/icons/check';
import BadgeCheck from 'lucide-react/dist/esm/icons/badge-check';
import Building2 from 'lucide-react/dist/esm/icons/building-2';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';

import MoreHorizontal from 'lucide-react/dist/esm/icons/more-horizontal';
import Zap from 'lucide-react/dist/esm/icons/zap';
import ShieldAlert from 'lucide-react/dist/esm/icons/shield-alert';
import { useQuery } from "@tanstack/react-query";
import Copy from 'lucide-react/dist/esm/icons/copy';


import type { MCPItem } from "@/lib/types";
import { API_URL, fetchMCPItemAlternatives } from "@/lib/api";
import { PricingBadge } from "@/components/PricingBadge";
import { CategoryChip } from "@/components/CategoryChip";
import { Breadcrumb } from "@/components/news/Breadcrumb";
import { RatingStars } from "@/components/RatingStars";
import { ExpandableContent } from "@/components/ui/ExpandableContent";



interface MCPDetailClientProps {
  item: MCPItem;
}

// Reusable Save Button (Bookmark) for MCP items with focus states
function SaveButton({
  slug,
  initialCount,
  initialSaved,
  className
}: {
  slug: string;
  initialCount: number;
  initialSaved: boolean;
  className?: string;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [count, setCount] = useState(initialCount);
  const [isPending, setIsPending] = useState(false);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isPending) return;
    setIsPending(true);

    const nextSaved = !saved;
    setSaved(nextSaved);
    setCount((c) => c + (nextSaved ? 1 : -1));

    try {
      const res = await fetch(`${API_URL}/api/v1/mcps/${slug}/save`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        const body = await res.json();
        if (body && typeof body.saved === "boolean") {
          setSaved(body.saved);
        }
      } else {
        // Rollback
        setSaved(saved);
        setCount(count);
      }
    } catch (err) {
      console.error("Failed to save MCP item:", err);
      // Rollback
      setSaved(saved);
      setCount(count);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSave}
      disabled={isPending}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-4 py-2.5 sm:py-2 text-sm font-semibold transition-all disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
        saved
          ? "border-[var(--color-signal,#6E56CF)] bg-[var(--color-signal,#6E56CF)]/10 text-[var(--color-signal,#6E56CF)]"
          : "border-[#232326]/60 bg-[#18181C] text-[#A1A1AA] hover:border-[#3a3a3d] hover:text-white"
      } ${className || ""}`}
      aria-pressed={saved}
      aria-label={saved ? "Remove bookmark" : "Save MCP"}
    >
      <Bookmark size={16} className={saved ? "fill-[var(--color-signal,#6E56CF)]" : ""} />
      <span>{saved ? "Saved" : "Save"}</span>
      <span className="text-xs text-neutral-500 font-mono">{count}</span>
    </button>
  );
}

// Reusable Share Button copying link to clipboard with focus states
function CopyLinkButton({ slug, name, className }: { slug: string; name: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = `${window.location.origin}/p/mcp/${slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={handleShare}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-4 py-2.5 sm:py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
        copied
          ? "border-[var(--color-signal,#6E56CF)] text-[var(--color-signal,#6E56CF)]"
          : "border-[#232326]/60 bg-[#18181C] text-[#A1A1AA] hover:border-[#3a3a3d] hover:text-white"
      } ${className || ""}`}
      title="Copy link to clipboard"
      aria-label={`Copy share link for ${name}`}
    >
      {copied ? <Check size={16} /> : <Share2 size={16} />}
      <span>{copied ? "Copied" : "Copy Link"}</span>
    </button>
  );
}

// Reusable Copy Code Button for Code blocks
function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-md border border-[#232326] bg-[#131316] px-2.5 py-1 text-[10px] font-semibold transition-all opacity-0 group-hover/code:opacity-100 focus-visible:opacity-100 ${
        copied ? "border-[var(--color-signal,#6E56CF)] text-[var(--color-signal,#6E56CF)]" : "border-[#232326]/60 text-[#A1A1AA] hover:text-white"
      }`}
    >
      {copied ? <Check size={10} /> : <Copy size={10} />}
      <span>{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

function formatFeatureTitle(title: string): string {
  let name = title;
  const prefixes = [
    "niche_",
    "mcp_",
    "tool_",
    "smithery_",
  ];
  for (const prefix of prefixes) {
    if (name.toLowerCase().startsWith(prefix)) {
      name = name.slice(prefix.length);
      break;
    }
  }
  // Replace underscores and hyphens with spaces
  name = name.replace(/[_-]/g, " ");
  // Title Case
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getFeaturePreview(description: string): string {
  // Strip markdown emphasis
  const cleanText = description
    .replace(/[*_`~]/g, "")
    // Remove markdown links into plain text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Remove markdown headings
    .replace(/^#+\s+/gm, "")
    // Remove bullet markers
    .replace(/^[-*+]\s+/gm, "")
    // Remove HTML tags
    .replace(/<[^>]*>/g, "")
    // Collapse repeated whitespace & multiple newlines into spaces
    .replace(/\s+/g, " ");

  // Find the first sentence ending with punctuation
  const sentenceEnd = cleanText.search(/[.!?](?:\s|$)/);
  let preview = sentenceEnd !== -1 ? cleanText.slice(0, sentenceEnd + 1) : cleanText;

  // Limit size to ~150 characters without cutting words
  if (preview.length > 150) {
    const truncated = preview.slice(0, 150);
    const lastSpace = truncated.lastIndexOf(" ");
    preview = lastSpace > 50 ? truncated.slice(0, lastSpace) + "..." : truncated + "...";
  }
  return preview.trim();
}

// Reusable Recommendation Card for "If You Liked This" Section


interface RecommendationCardProps {
  item: MCPItem;
}

function RecommendationCard({ item }: RecommendationCardProps) {
  const primaryCategoryName = item.categories?.[0]?.category?.name || item.categories?.[0]?.name || "Uncategorized";

  return (
    <Link
      href={`/p/mcp/${item.slug}`}
      className="group flex flex-col gap-4 rounded-xl border border-[#232326]/60 bg-[#131316]/30 p-4 hover:border-white/[0.15] hover:bg-[#18181C]/40 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
    >
      <div className="flex items-start justify-between gap-3">
        {/* Logo */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#232326]/60 bg-white">
          {item.logoUrl ? (
            <Image
              src={item.logoUrl}
              alt={`${item.name} logo`}
              width={48}
              height={48}
              className="h-10 w-10 object-contain p-1"
              unoptimized
            />
          ) : (
            <span className="text-base font-bold text-neutral-900 select-none">
              {item.name.charAt(0)}
            </span>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-1.5 justify-end">
          <PricingBadge pricingModel={item.pricingType} />
          {item.isVerified && (
            <BadgeCheck size={16} className="text-blue-400 shrink-0" aria-label="Verified Provider" />
          )}
        </div>
      </div>

      <div className="space-y-1">
        <h4 className="text-sm font-bold text-white group-hover:text-[#6E56CF] transition-colors line-clamp-1">
          {item.name}
        </h4>
        <p className="text-[11px] text-neutral-400">by {item.providerName}</p>
      </div>

      <p className="text-[11.5px] text-[#A1A1AA] line-clamp-2 leading-relaxed min-h-[34px]">
        {item.shortDescription}
      </p>

      <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#232326]/40 mt-auto text-[10px] text-[#71717A]">
        <div className="flex items-center gap-2">
          <RatingStars rating={item.qualityScore ?? 4.5} size="sm" />
          <span>•</span>
          <span className="truncate max-w-[80px]">{primaryCategoryName}</span>
        </div>
        <div className="flex items-center gap-1">
          <Eye size={10} />
          <span className="font-mono">{item.viewCount}</span>
        </div>
      </div>
    </Link>
  );
}

export function MCPDetailClient({ item }: MCPDetailClientProps) {
  // Navigation tabs list
  const TABS = [
    "Overview",
    "Releases",
    "Pricing",
    // Hide for now until backend support exists:
    // "Pros & Cons",
    // "Prompts",
    // "Reviews",
    // "Q&A",
  ];

  // States for dropdown menu and scroll tab navigation
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");

  // State for selected release index
  const [selectedReleaseIdx, setSelectedReleaseIdx] = useState(0);

  const releases = item.releases || [];
  const hasReleases = releases.length > 0;
  const selectedRelease = releases[selectedReleaseIdx];

  // Derive dynamic inputs/outputs classification based on item type
  const inputs = item.itemType === "SERVER" ? ["API", "Text", "Context"] : ["API", "UI Interface", "Agent"];
  const outputs = item.itemType === "SERVER" ? ["API", "Text", "MCP Protocol"] : ["API", "MCP Config", "Client UI"];

  // Derive supported languages from tags (e.g. typescript, python, rust, etc.)
  const allTags = item.tags?.map((t: any) => t.tag?.name || t.name || "") || [];
  const supportedLanguages = allTags.filter((t) =>
    ["typescript", "python", "javascript", "rust", "go", "java", "c++"].includes(t.toLowerCase())
  );

  // Formatting helper for custom labels
  const primaryCategoryName = item.categories?.[0]?.category?.name || item.categories?.[0]?.name || "Uncategorized";
  const formattedLanguageString = supportedLanguages.length > 0 ? supportedLanguages.join(", ") : "Multi-language";

  // Determine Also Used For data list based on priority
  let alsoUsedForItems: { name: string; href?: string }[] = [];
  if (item.useCases && item.useCases.length > 0) {
    alsoUsedForItems = item.useCases.map((u) => ({
      name: u.title,
      href: `/mcp?q=${encodeURIComponent(u.title)}`,
    }));
  } else if (item.tags && item.tags.length > 0) {
    alsoUsedForItems = item.tags.map((t: any) => {
      const name = t.name || t.tag?.name || "";
      return {
        name,
        href: `/mcp?q=${encodeURIComponent(name)}`,
      };
    });
  } else if (item.categories && item.categories.length > 0) {
    alsoUsedForItems = item.categories.map((c: any) => {
      const name = c.name || c.category?.name || "";
      const slug = c.slug || c.category?.slug || "";
      return {
        name,
        href: `/mcp?category=${slug}`,
      };
    });
  } else if (item.subCategories && item.subCategories.length > 0) {
    alsoUsedForItems = item.subCategories.map((s: any) => {
      const name = s.name || s.subCategory?.name || "";
      return {
        name,
        href: `/mcp?q=${encodeURIComponent(name)}`,
      };
    });
  }

  // Filter out any empty names
  alsoUsedForItems = alsoUsedForItems.filter((x) => x.name && x.name.trim() !== "");

  // Determine Related Topics data list based on priority (excluding what was used in Also Used For)
  let relatedTopicsItems: { name: string; href?: string }[] = [];

  const usedUseCases = item.useCases && item.useCases.length > 0;
  const usedTags = !usedUseCases && (item.tags && item.tags.length > 0);
  const usedCategories = !usedUseCases && !usedTags && (item.categories && item.categories.length > 0);

  if (usedUseCases) {
    if (item.tags && item.tags.length > 0) {
      relatedTopicsItems = item.tags.map((t: any) => {
        const name = t.name || t.tag?.name || "";
        return {
          name,
          href: `/mcp?q=${encodeURIComponent(name)}`,
        };
      });
    } else if (item.categories && item.categories.length > 0) {
      relatedTopicsItems = item.categories.map((c: any) => {
        const name = c.name || c.category?.name || "";
        const slug = c.slug || c.category?.slug || "";
        return {
          name,
          href: `/mcp?category=${slug}`,
        };
      });
    } else if (item.subCategories && item.subCategories.length > 0) {
      relatedTopicsItems = item.subCategories.map((s: any) => {
        const name = s.name || s.subCategory?.name || "";
        return {
          name,
          href: `/mcp?q=${encodeURIComponent(name)}`,
        };
      });
    }
  } else if (usedTags) {
    if (item.categories && item.categories.length > 0) {
      relatedTopicsItems = item.categories.map((c: any) => {
        const name = c.name || c.category?.name || "";
        const slug = c.slug || c.category?.slug || "";
        return {
          name,
          href: `/mcp?category=${slug}`,
        };
      });
    } else if (item.subCategories && item.subCategories.length > 0) {
      relatedTopicsItems = item.subCategories.map((s: any) => {
        const name = s.name || s.subCategory?.name || "";
        return {
          name,
          href: `/mcp?q=${encodeURIComponent(name)}`,
        };
      });
    }
  } else if (usedCategories) {
    if (item.subCategories && item.subCategories.length > 0) {
      relatedTopicsItems = item.subCategories.map((s: any) => {
        const name = s.name || s.subCategory?.name || "";
        return {
          name,
          href: `/mcp?q=${encodeURIComponent(name)}`,
        };
      });
    }
  }

  // Filter out any empty names
  relatedTopicsItems = relatedTopicsItems.filter((x) => x.name && x.name.trim() !== "");

  // Fetch recommendations (alternatives) from backend
  const { data: alternativesData } = useQuery({
    queryKey: ["mcpAlternatives", item.slug],
    queryFn: () => fetchMCPItemAlternatives(item.slug),
    enabled: !!item.slug,
  });
  const recommendations = alternativesData || [];


  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 py-6 md:px-6 md:py-10 relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#6E56CF]/5 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Breadcrumb Navigation */}
      <nav className="mb-4 md:mb-6 relative z-10">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "MCP", href: "/mcp" },
            { label: item.itemType === "SERVER" ? "MCP Servers" : "MCP Clients", href: `/mcp?type=${item.itemType.toLowerCase()}` },
            { label: item.name },
          ]}
        />
      </nav>

      {/* Hero Section Container */}
      <div className="relative z-10 flex flex-col gap-6 rounded-xl border border-[#232326]/60 bg-[#131316]/30 p-4 md:p-6 backdrop-blur-md shadow-2xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            
            {/* 1. Logo Block */}
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#232326]/60 bg-white shadow-lg shadow-black/20 self-start">
              {item.logoUrl ? (
                <Image
                  src={item.logoUrl}
                  alt={`${item.name} logo`}
                  width={80}
                  height={80}
                  className="h-full w-full object-contain p-2"
                  unoptimized
                />
              ) : (
                <span className="text-2xl font-bold text-neutral-900 select-none">
                  {item.name.charAt(0)}
                </span>
              )}
            </div>

            {/* 2. MCP Title & Badges */}
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  {item.name}
                </h1>
                {item.releases && item.releases.length > 0 && (
                  <span className="inline-flex items-center rounded-md bg-[#18181C] border border-[#232326] px-2 py-0.5 text-[10px] font-mono font-semibold text-neutral-400">
                    {item.releases[0].versionName}
                  </span>
                )}
                {item.isVerified && (
                  <BadgeCheck size={18} className="text-blue-400 shrink-0" aria-label="Verified Provider" />
                )}
              </div>

              {/* 3. Metadata Row */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-[#A1A1AA]">
                <div className="flex items-center gap-1">
                  <Building2 size={12} className="text-neutral-500" />
                  <span>{item.providerName}</span>
                </div>
                <span className="text-[#3a3a3d]" aria-hidden="true">•</span>
                <div className="flex items-center gap-1.5">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.2 text-[9px] font-bold border ${
                    item.itemType === "SERVER"
                      ? "bg-[#6E56CF]/10 text-[#6E56CF] border-[#6E56CF]/30"
                      : "bg-[#FFC53D]/10 text-[#FFC53D] border-[#FFC53D]/30"
                  }`}>
                    {item.itemType}
                  </span>
                  <CategoryChip label={primaryCategoryName} />
                </div>
                <span className="text-[#3a3a3d]" aria-hidden="true">•</span>
                <div className="flex items-center gap-1">
                  <Eye size={12} className="text-neutral-500" />
                  <span className="font-mono">{item.viewCount} views</span>
                </div>
                <span className="text-[#3a3a3d]" aria-hidden="true">•</span>
                <div className="flex items-center gap-1">
                  <RatingStars
                    rating={item.qualityScore ?? 4.5}
                    reviewCount={item.reviews && item.reviews.length > 0 ? item.reviews.length : undefined}
                  />
                </div>
                <span className="text-[#3a3a3d]" aria-hidden="true">•</span>
                <span className="text-[#71717A]">{formattedLanguageString}</span>

              </div>
            </div>
          </div>

          {/* 4. Primary Actions Block */}
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto md:self-start">
            {item.websiteUrl && (
              <a
                href={item.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full sm:w-auto justify-center items-center gap-1.5 rounded-lg bg-accent px-4 py-2.5 sm:py-2 text-sm font-semibold text-black shadow-lg shadow-accent/20 transition-all hover:bg-accent-hover hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2DD4BF] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                <span>Use Tool</span>
                <ExternalLink size={14} />
              </a>
            )}
            <CopyLinkButton slug={item.slug} name={item.name} />
            <SaveButton slug={item.slug} initialCount={item.saveCount} initialSaved={false} />
            
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="inline-flex items-center justify-center rounded-lg border border-[#232326]/60 bg-[#18181C] p-2.5 text-[#A1A1AA] hover:border-[#3a3a3d] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                title="More Options"
                aria-label="More Options"
              >
                <MoreHorizontal size={16} />
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 rounded-lg border border-[#232326] bg-[#131316] p-1.5 shadow-xl z-50">
                    <button
                      type="button"
                      disabled
                      className="flex w-full items-center px-3 py-2 text-xs font-semibold text-neutral-600 cursor-not-allowed rounded-md text-left"
                    >
                      Report MCP (Coming Soon)
                    </button>
                    <button
                      type="button"
                      disabled
                      className="flex w-full items-center px-3 py-2 text-xs font-semibold text-neutral-600 cursor-not-allowed rounded-md text-left"
                    >
                      Claim Provider (Coming Soon)
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-[#232326]/60" />

        <div className="space-y-4">
          {/* 5. Inputs / Outputs classification badges */}
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-neutral-400 font-medium">Inputs:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {inputs.map((input) => (
                  <span key={input} className="rounded bg-neutral-900 border border-neutral-800 px-2.5 py-0.5 font-medium text-neutral-300">
                    {input}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-neutral-400 font-medium">Outputs:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {outputs.map((output) => (
                  <span key={output} className="rounded bg-neutral-900 border border-neutral-800 px-2.5 py-0.5 font-medium text-neutral-300">
                    {output}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 6. Short description block */}
          <div className="space-y-1.5">
            <h2 className="text-sm font-semibold text-neutral-200">About {item.name}</h2>
            <p className="text-[13px] text-[#A1A1AA] leading-relaxed max-w-[900px] whitespace-pre-wrap">
              {item.shortDescription}
            </p>
          </div>

          {/* 7. Feature/Category Tags list */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <PricingBadge pricingModel={item.pricingType} />
            {allTags.map((tag) => (
              <span key={tag} className="rounded-full bg-[#131316]/50 border border-[#232326]/60 px-3 py-1 text-[10px] font-bold text-neutral-400">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 8. Tab Navigation UI */}
        <div className="border-b border-[#232326]/60 mt-4">
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-none py-1 animate-fade-in">
            {TABS.map((tab) => {
              const active = activeTab === tab;
              const isEnabled = ["Overview", "Releases", "Pricing"].includes(tab);

              if (!isEnabled) {
                return (
                  <button
                    key={tab}
                    type="button"
                    disabled
                    className="border-b-2 border-transparent py-3 text-sm font-semibold whitespace-nowrap text-neutral-600 cursor-not-allowed select-none opacity-40 focus:outline-none"
                    title={`${tab} is not implemented`}
                  >
                    {tab}
                  </button>
                );
              }

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab);
                    const idMap: Record<string, string> = {
                      "Overview": "overview-section",
                      "Releases": "releases-section",
                      "Pricing": "pricing-section"
                    };
                    const id = idMap[tab];
                    if (id) {
                      const el = document.getElementById(id);
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    }
                  }}
                  className={`border-b-2 py-3 text-sm font-semibold whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                    active
                      ? "border-[#6E56CF] text-white"
                      : "border-transparent text-neutral-400 hover:text-white"
                  }`}
                  aria-selected={active}
                  role="tab"
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout (Phase 2) */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 lg:gap-12 relative z-10">
        
        {/* Left Column (Overview & Features) */}
        <div className="space-y-8 min-w-0">
          
          {/* Overview Section */}
          <section id="overview-section" className="scroll-mt-28 space-y-3 rounded-xl border border-[#232326]/60 bg-[#131316]/30 p-5 md:p-6">
            <h3 className="text-base font-bold text-white">Overview</h3>
            <ExpandableContent maxHeight={450}>
              <div className="text-[13px] text-[#A1A1AA] leading-relaxed whitespace-pre-line max-w-[850px]">
                {item.fullDescription}
              </div>
            </ExpandableContent>

          </section>

          {/* Supported Features & Interfaces */}
          <section className="space-y-4 rounded-xl border border-[#232326]/60 bg-[#131316]/30 p-5 md:p-6">
            <h3 className="text-base font-bold text-white">Supported Features & Interfaces</h3>
            <div className="flex flex-wrap gap-2">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                item.itemType === "SERVER"
                  ? "bg-[#6E56CF]/10 text-[#6E56CF] border-[#6E56CF]/30"
                  : "bg-[#FFC53D]/10 text-[#FFC53D] border-[#FFC53D]/30"
              }`}>
                {item.itemType}
              </span>
              {item.technicalSpecs?.[0]?.integrations?.map((integ) => (
                <CategoryChip key={integ} label={integ} />
              ))}
              {item.technicalSpecs?.[0]?.supportedPlatforms?.map((plat) => (
                <span key={plat} className="inline-flex items-center rounded-full border border-neutral-800 bg-[#18181C] px-2.5 py-0.5 text-[10px] font-medium text-neutral-300">
                  {plat}
                </span>
              ))}
            </div>
          </section>

          {/* Key Features List */}
          {item.features && item.features.length > 0 && (
            <section className="space-y-4 rounded-xl border border-[#232326]/60 bg-[#131316]/30 p-5 md:p-6">
              <h3 className="text-base font-bold text-white">Key Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {item.features.map((feat) => {
                  const readableTitle = formatFeatureTitle(feat.title);
                  const previewText = feat.description ? getFeaturePreview(feat.description) : "";
                  
                  // Collapse is only necessary if the description is actually longer/different from the plain text sentence preview.
                  const cleanedFullDescription = feat.description 
                    ? feat.description.replace(/[*_`~]/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim()
                    : "";
                  const isExpandable = feat.description && previewText !== cleanedFullDescription;

                  return (
                    <div 
                      key={feat.id} 
                      className={`flex gap-3 rounded-lg border border-[#232326]/60 bg-[#131316]/20 p-4 ${
                        isExpandable ? "min-h-[160px] h-full" : ""
                      }`}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#18181C] text-[#6E56CF]">
                        <Zap size={16} />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-1">{readableTitle}</h4>
                          {feat.description && (
                            isExpandable ? (
                              <ExpandableContent
                                collapsedContent={
                                  <p className="text-xs text-[#A1A1AA] leading-relaxed">{previewText}</p>
                                }
                                readMoreLabel="Read More"
                                readLessLabel="Read Less"
                              >
                                <p className="text-xs text-[#A1A1AA] leading-relaxed whitespace-pre-line">{feat.description}</p>
                              </ExpandableContent>
                            ) : (
                              <p className="text-xs text-[#A1A1AA] leading-relaxed">{feat.description}</p>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}


          {/* Installation Guide Section */}
          {item.installationGuides && item.installationGuides.length > 0 && (
            <section className="space-y-4 rounded-xl border border-[#232326]/60 bg-[#131316]/30 p-5 md:p-6">
              <h3 className="text-base font-bold text-white">Installation Guide</h3>
              <div className="space-y-6">
                {item.installationGuides.map((step) => (
                  <div key={step.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#6E56CF]/10 text-xs font-bold text-[#6E56CF] border border-[#6E56CF]/30">
                        {step.stepNumber}
                      </span>
                      <h4 className="text-sm font-semibold text-white">{step.title}</h4>
                    </div>
                    {step.instructions && (
                      <p className="text-xs text-[#A1A1AA] leading-relaxed pl-7">{step.instructions}</p>
                    )}
                    {step.codeSnippet && (
                      <div className="relative pl-7 group/code">
                        <pre className="overflow-x-auto rounded-lg border border-[#232326]/60 bg-[#18181C] p-3 text-xs font-mono text-[#E4E4E7]">
                          <code>{step.codeSnippet}</code>
                        </pre>
                        <CopyCodeButton code={step.codeSnippet} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>


        {/* Right Sidebar (Author & Pricing Cards) */}
        <div className="space-y-6">
          
          {/* Author Card */}
          <div className="rounded-xl border border-[#232326]/60 bg-[#131316]/30 p-5 space-y-4 animate-fade-in">
            <h3 className="text-xs font-mono font-semibold tracking-wider text-neutral-500 uppercase">Provider & Creator</h3>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#232326]/60 bg-white">
                <span className="text-lg font-bold text-neutral-900 select-none">
                  {item.providerName.charAt(0)}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white">{item.providerName}</span>
                  {item.isVerified && (
                    <BadgeCheck size={14} className="text-blue-400 shrink-0" aria-label="Verified Provider" />
                  )}
                </div>
                {item.providerUrl && (
                  <a
                    href={item.providerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#A1A1AA] hover:text-white hover:underline transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#6E56CF] rounded px-0.5"
                  >
                    <span>Visit website</span>
                    <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Pricing Card */}
          <div id="pricing-section" className="scroll-mt-28 rounded-xl border border-[#232326]/60 bg-[#131316]/30 p-5 space-y-4">
            <h3 className="text-xs font-mono font-semibold tracking-wider text-neutral-500 uppercase">Pricing Details</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-[#232326]/40">
                <span className="text-neutral-400">Pricing Model</span>
                <PricingBadge pricingModel={item.pricingType} />
              </div>
              {item.startingPrice !== undefined && item.startingPrice !== null && (
                <div className="flex items-center justify-between text-xs py-1.5 border-b border-[#232326]/40">
                  <span className="text-neutral-400">Starting Price</span>
                  <span className="font-semibold text-white font-mono">
                    ${Number(item.startingPrice).toFixed(2)}
                  </span>
                </div>
              )}
              {item.pricingPlans?.[0]?.billingCycle && (
                <div className="flex items-center justify-between text-xs py-1.5 border-b border-[#232326]/40">
                  <span className="text-neutral-400">Billing Frequency</span>
                  <span className="font-semibold text-white lowercase">
                    {item.pricingPlans[0].billingCycle.toLowerCase()}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-[#232326]/40">
                <span className="text-neutral-400">License</span>
                <span className="font-semibold text-white uppercase font-mono">{item.license || "MIT"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Releases Section (Phase 3) */}
      <div id="releases-section" className="scroll-mt-28 mt-12 relative z-10 border-t border-[#232326]/60 pt-8 max-w-[850px]">
        {/* Releases Heading */}
        <h3 className="text-xl font-extrabold tracking-tight text-white mb-6">Releases</h3>



        {/* Dynamic Releases Timeline Content */}
        {hasReleases ? (
          <div className="space-y-6">
            {/* Version Selector Chips */}
            <div className="flex flex-wrap gap-2">
              {releases.map((rel, idx) => {
                const active = idx === selectedReleaseIdx;
                return (
                  <button
                    key={rel.id}
                    type="button"
                    onClick={() => setSelectedReleaseIdx(idx)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                      active
                        ? "bg-white text-black border-white shadow-lg shadow-white/5"
                        : "text-neutral-400 hover:text-white bg-[#131316]/50 border-[#232326]/60 hover:border-white/[0.15]"
                    }`}
                  >
                    {rel.versionName}
                  </button>
                );
              })}
            </div>

            {/* Selected Release Card */}
            <div className="rounded-xl border border-[#232326]/60 bg-[#131316]/30 p-5 md:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#232326]/40 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg font-bold text-white">{selectedRelease.versionName}</span>
                  {selectedReleaseIdx === 0 && (
                    <span className="inline-flex items-center rounded bg-[#6E56CF]/10 border border-[#6E56CF]/30 px-2 py-0.2 text-[9px] font-bold text-[#6E56CF]">
                      Latest
                    </span>
                  )}
                </div>
                {selectedRelease.releaseDate && (
                  <span className="text-xs text-[#71717A] font-mono">
                    Released on {new Date(selectedRelease.releaseDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                )}
              </div>

              {selectedRelease.summary && (
                <p className="text-sm font-semibold text-neutral-200">{selectedRelease.summary}</p>
              )}

              {selectedRelease.description && (
                <div className="text-xs text-[#A1A1AA] leading-relaxed whitespace-pre-line">
                  {selectedRelease.description}
                </div>
              )}

              {selectedRelease.improvements && selectedRelease.improvements.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-xs font-semibold text-neutral-300">Improvements & Fixes</h5>
                  <ul className="list-disc pl-5 text-xs text-[#A1A1AA] space-y-1">
                    {selectedRelease.improvements.map((imp, i) => (
                      <li key={i}>{imp}</li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          </div>
        ) : (
          /* Clean Empty State Card when no releases exist */
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[#232326] bg-[#131316]/40 py-12 text-center">
            <ShieldAlert size={24} className="text-[#71717A]" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-white">No releases posted yet</p>
              <p className="mt-1 text-xs text-[#A1A1AA]">
                There are no version logs or release notes available for this item.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Bar (Phase 4) */}
      <div className="mt-8 rounded-xl border border-[#232326]/60 bg-[#131316]/30 p-5 space-y-4 max-w-[850px] relative z-10">
        <h3 className="text-xs font-mono font-semibold tracking-wider text-[#71717A] uppercase">Actions</h3>

        {/* Primary CTA: Use Tool */}
        {item.websiteUrl ? (
          <a
            href={item.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full justify-center items-center gap-1.5 rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-black shadow-lg shadow-accent/20 transition-all hover:bg-accent-hover hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2DD4BF] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <span>Use Tool</span>
            <ExternalLink size={16} />
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex w-full justify-center items-center gap-1.5 rounded-lg bg-neutral-900 border border-neutral-800 px-4 py-3 text-sm font-semibold text-neutral-500 cursor-not-allowed"
          >
            <span>Use Tool</span>
            <ExternalLink size={16} />
          </button>
        )}

        {/* Secondary CTAs: Save & Copy Link */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SaveButton
            slug={item.slug}
            initialCount={item.saveCount}
            initialSaved={false}
            className="w-full justify-center py-2.5 sm:py-3"
          />
          <CopyLinkButton
            slug={item.slug}
            name={item.name}
            className="w-full justify-center py-2.5 sm:py-3"
          />
        </div>
      </div>

      {/* Also Used For Section (Phase 5) */}
      {alsoUsedForItems.length > 0 && (
        <div className="mt-8 rounded-xl border border-[#232326]/60 bg-[#131316]/30 p-5 space-y-4 max-w-[850px] relative z-10">
          <h3 className="text-xs font-mono font-semibold tracking-wider text-[#71717A] uppercase">Also Used For</h3>
          <div className="flex flex-wrap gap-2">
            {alsoUsedForItems.map((chip, idx) => {
              const content = (
                <span className="rounded-full bg-[#131316]/50 border border-[#232326]/60 hover:border-white/[0.15] px-4 py-1.5 text-xs font-semibold text-neutral-300 hover:text-white transition-all cursor-pointer">
                  {chip.name}
                </span>
              );

              if (chip.href) {
                return (
                  <Link
                    key={idx}
                    href={chip.href}
                    className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] rounded-full focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  >
                    {content}
                  </Link>
                );
              }

              // Else click handler with TODO
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => console.log("TODO: Implement navigation route for use cases")}
                  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] rounded-full focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  {content}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommended MCPs / "If You Liked This" Section (Phase 6) */}
      {recommendations.length > 0 && (
        <div className="mt-12 relative z-10 border-t border-[#232326]/60 pt-8 max-w-[850px] space-y-6">
          <h3 className="text-xl font-extrabold tracking-tight text-white font-sans">If You Liked This...</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {recommendations.map((rec) => (
              <RecommendationCard key={rec.id} item={rec} />
            ))}
          </div>
        </div>
      )}

      {/* Related Topics Section (Phase 7) */}
      {relatedTopicsItems.length > 0 && (
        <div className="mt-8 rounded-xl border border-[#232326]/60 bg-[#131316]/30 p-5 space-y-4 max-w-[850px] relative z-10">
          <h3 className="text-xs font-mono font-semibold tracking-wider text-[#71717A] uppercase">Related Topics</h3>
          <div className="flex flex-wrap gap-2">
            {relatedTopicsItems.map((chip, idx) => {
              const content = (
                <span className="rounded-full bg-[#131316]/50 border border-[#232326]/60 hover:border-white/[0.15] px-4 py-1.5 text-xs font-semibold text-neutral-300 hover:text-white transition-all cursor-pointer">
                  {chip.name}
                </span>
              );

              if (chip.href) {
                return (
                  <Link
                    key={idx}
                    href={chip.href}
                    className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] rounded-full focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => console.log("TODO: Implement navigation route for subcategories")}
                  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] rounded-full focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  {content}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}
