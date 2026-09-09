"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Bookmark,
  CalendarDays,
  Check,
  ChevronRight,
  Code2,
  Github,
  Globe,
  Share2,
  Star,
  TrendingUp,
  Zap,
  Bot,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { API_URL } from "@/lib/api";

type SimilarAgent = {
  id: string;
  slug: string;
  name: string;
  description: string;
  logoUrl?: string | null;
  category: string;
  pricingModel: string;
  avgRating: number | null;
};

type Agent = {
  id: string;
  slug: string;
  name: string;
  description: string;
  websiteUrl: string;
  logoUrl?: string | null;

  category: string;
  categorySlug: string;
  primaryTask: string;

  pricingModel: string;
  pricingRaw?: string | null;

  hasApi: boolean;
  isOpenSource: boolean;
  isTrending: boolean;
  verified: boolean;

  compatibility: string[];

  avgRating: number | null;
  reviewCount: number;
  upvoteCount: number;
  views: number;

  createdAt: string;
  source?: string | null;

  similarAgents?: SimilarAgent[];
};

function formatPricing(
  pricingModel: string,
  pricingRaw?: string | null
) {
  if (pricingRaw) return pricingRaw;

  switch (pricingModel?.toUpperCase()) {
    case "FREE":
      return "Free";
    case "FREEMIUM":
      return "Freemium";
    case "PAID":
      return "Paid";
    default:
      return pricingModel || "Not specified";
  }
}

function formatDate(date: string) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatNumber(value: number) {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }

  return value.toString();
}

function AgentLogo({
  src,
  name,
  size = "large",
}: {
  src?: string | null;
  name: string;
  size?: "large" | "small";
}) {
  const dimensions =
    size === "large"
      ? "h-24 w-24 sm:h-28 sm:w-28"
      : "h-12 w-12";

  if (src) {
    return (
      <div
        className={`${dimensions} shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white shadow-[0_0_40px_rgba(126,92,255,0.12)]`}
      >
        <img
          src={src}
          alt={`${name} logo`}
          className="h-full w-full object-contain"
        />
      </div>
    );
  }

  return (
    <div
      className={`${dimensions} flex shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[#17151f]`}
    >
      <Bot className="h-10 w-10 text-[#8b72ff]" />
    </div>
  );
}

function SectionHeader({
  title,
  count,
}: {
  title: string;
  count?: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5 sm:px-5">
      <div className="flex items-center gap-2.5">
        <h2 className="text-xs font-bold uppercase tracking-[0.08em] text-white">
          {title}
        </h2>
      </div>

      {count && (
        <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 text-[10px] font-medium text-[#71717a]">
          {count}
        </span>
      )}
    </div>
  );
}

function SimilarAgentCard({
  agent,
}: {
  agent: SimilarAgent;
}) {
  return (
    <Link
      href={`/agents/${agent.slug}`}
      className="group rounded-xl border border-white/[0.07] bg-[#111116] p-3.5 transition duration-200 hover:-translate-y-0.5 hover:border-[#8066ff]/30 hover:bg-[#15141b]"
    >
      <div className="flex gap-3.5">
        <AgentLogo
          src={agent.logoUrl}
          name={agent.name}
          size="small"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-sm font-semibold text-white group-hover:text-[#b6a8ff]">
              {agent.name}
            </h3>

            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-[#52525b] transition group-hover:translate-x-1 group-hover:text-[#8b72ff]" />
          </div>

          <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-[#71717a]">
            {agent.description}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px]">
            <span className="rounded-full border border-white/[0.06] bg-white/[0.025] px-2 py-1 text-[#71717a]">
              {agent.category}
            </span>

            {agent.avgRating !== null && (
              <span className="flex items-center gap-1 text-[#a1a1aa]">
                <Star className="h-3 w-3 fill-current text-yellow-500" />
                {agent.avgRating.toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function CapabilityCard({
  title,
  description,
  available,
}: {
  title: string;
  description: string;
  available: boolean;
}) {
  return (
    <div className="group rounded-xl border border-white/[0.07] bg-[#111116] p-3.5 transition hover:border-[#8066ff]/20">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className={`mt-1 text-[11px] ${available ? "text-[#a1a1aa]" : "text-[#71717a]"}`}>
        {description}
      </p>
    </div>
  );
}

export default function AgentDetailClient({
  slug: slugProp,
}: {
  slug?: string;
}) {
  const [upvoted, setUpvoted] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const slug = slugProp;

  const { data: agent, isLoading, isError } = useQuery<Agent>({
    queryKey: ["agent-detail", slug],

    queryFn: async () => {
      const response = await fetch(
        `${API_URL}/api/v1/agents/${slug}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Agent not found");
      }

      return response.json();
    },

    enabled: Boolean(slug),
  });

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#07070a] text-white">
        <div className="mx-auto max-w-[1240px] px-5 py-10 sm:px-6 lg:px-8">
          <div className="h-3 w-44 animate-pulse rounded bg-white/[0.05]" />
          <div className="mt-6 h-72 animate-pulse rounded-3xl border border-white/[0.05] bg-[#0d0d11]" />
          <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="h-[700px] animate-pulse rounded-2xl bg-[#0d0d11]" />
            <div className="h-96 animate-pulse rounded-2xl bg-[#0d0d11]" />
          </div>
        </div>
      </main>
    );
  }

  if (isError || !agent) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#07070a] text-white">
        <div className="text-center">
          <Bot className="mx-auto h-10 w-10 text-[#8066ff]" />
          <h1 className="mt-4 text-2xl font-bold">Agent not found</h1>
          <p className="mt-2 text-sm text-[#71717a]">
            We couldn't find this agent.
          </p>

          <Link
            href="/agents"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#7357d9] px-4 py-2.5 text-sm font-semibold transition hover:bg-[#8066ef]"
          >
            Browse Agents
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    );
  }

  const pricing = formatPricing(
    agent.pricingModel,
    agent.pricingRaw
  );

  return (
    <main className="min-h-screen bg-[#07070a] text-white">
      <div className="mx-auto max-w-[1240px] px-5 pb-20 pt-7 sm:px-6 lg:px-8">

        {/* BREADCRUMB */}
        <div className="mb-6 flex items-center gap-2 overflow-hidden text-xs text-[#62626b]">
          <Link href="/" className="shrink-0 transition hover:text-white">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0" />
          <Link
            href="/agents"
            className="shrink-0 transition hover:text-white"
          >
            AI Agents
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0" />
          <Link
            href={`/agents?category=${agent.categorySlug}`}
            className="shrink-0 transition hover:text-white"
          >
            {agent.category}
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0" />
          <span className="truncate text-[#a1a1aa]">{agent.name}</span>
        </div>

        {/* ====================================================== */}
        {/* AGENT HERO */}
        {/* ====================================================== */}

        <section className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d0d12]">
          {/* subtle background glow */}
          <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#8066ff]/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-[-150px] left-[30%] h-64 w-64 rounded-full bg-[#5b43c7]/[0.06] blur-3xl" />

          <div className="relative p-5 sm:p-6 lg:p-7">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">

              {/* MAIN AGENT IDENTITY */}
              <div className="flex min-w-0 gap-4 sm:gap-5">
                <AgentLogo
                  src={agent.logoUrl}
                  name={agent.name}
                />

                <div className="min-w-0 pt-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="text-3xl font-black tracking-[-0.03em] sm:text-4xl lg:text-[42px]">
                      {agent.name}
                    </h1>

                    {agent.verified && (
                      <span
                        title="Verified Agent"
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-[#7357d9] shadow-lg shadow-[#7357d9]/20"
                      >
                        <Check className="h-3.5 w-3.5 text-white" />
                      </span>
                    )}

                    {agent.isTrending && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 px-2.5 py-1 text-[10px] font-bold text-orange-400">
                        <TrendingUp className="h-3 w-3" />
                        Trending
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-emerald-400">
                      {pricing}
                    </span>

                    <Link
                      href={`/agents?category=${agent.categorySlug}`}
                      className="rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-[11px] font-medium text-[#a1a1aa] transition hover:border-[#8066ff]/30 hover:text-white"
                    >
                      {agent.category}
                    </Link>

                    <span className="flex items-center gap-1.5 text-[11px] text-[#71717a]">
                      <Star className="h-3.5 w-3.5 fill-current text-yellow-500" />
                      <span className="font-semibold text-white">
                        {agent.avgRating !== null
                          ? agent.avgRating.toFixed(1)
                          : "—"}
                      </span>
                      <span>
                        {agent.reviewCount}{" "}
                        {agent.reviewCount === 1 ? "review" : "reviews"}
                      </span>
                    </span>
                  </div>

                  <p className="mt-4 max-w-2xl text-sm leading-6 text-[#a1a1aa]">
                    {agent.description}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-lg border border-[#8066ff]/25 bg-[#8066ff]/10 px-2.5 py-1.5 text-[11px] font-medium text-[#b7a8ff]">
                      {agent.primaryTask}
                    </span>

                    {agent.compatibility.length > 0 && (
                      <span className="inline-flex items-center rounded-lg border border-white/[0.07] bg-white/[0.025] px-2.5 py-1.5 text-[11px] font-medium text-[#a1a1aa]">
                        {agent.compatibility.length} platform
                        {agent.compatibility.length !== 1 ? "s" : ""}
                      </span>
                    )}

                    <span className="inline-flex items-center rounded-lg border border-white/[0.07] bg-white/[0.025] px-2.5 py-1.5 text-[11px] font-medium text-[#71717a]">
                      Added {formatDate(agent.createdAt)}
                    </span>

                    {agent.hasApi && (
                      <span className="inline-flex items-center rounded-lg border border-white/[0.07] bg-white/[0.025] px-2.5 py-1.5 text-[11px] font-medium text-[#a1a1aa]">
                        API available
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* ACTION AREA */}
              <div className="flex shrink-0 flex-col gap-2.5 lg:w-48">
                <a
                  href={agent.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#7357d9] px-5 text-sm font-bold text-white shadow-xl shadow-[#7357d9]/20 transition hover:bg-[#8066ef] hover:shadow-[#7357d9]/30"
                >
                  Visit Website
                  <ArrowUpRight className="h-4 w-4" />
                </a>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    aria-label="Upvote agent"
                    onClick={() =>
                      setUpvoted((value) => !value)
                    }
                    className={`flex h-11 flex-col items-center justify-center rounded-xl border transition ${
                      upvoted
                        ? "border-[#8066ff]/40 bg-[#8066ff]/10 text-[#a28cff]"
                        : "border-white/[0.07] bg-white/[0.025] text-[#71717a] hover:border-white/10 hover:text-white"
                    }`}
                  >
                    <ArrowUpRight className="h-4 w-4 rotate-[-45deg]" />
                    <span className="mt-0.5 text-[10px]">
                      {formatNumber(
                        agent.upvoteCount + (upvoted ? 1 : 0)
                      )}
                    </span>
                  </button>

                  <button
                    type="button"
                    aria-label="Bookmark agent"
                    onClick={() =>
                      setBookmarked((value) => !value)
                    }
                    className={`flex h-11 items-center justify-center rounded-xl border transition ${
                      bookmarked
                        ? "border-[#8066ff]/40 bg-[#8066ff]/10 text-[#a28cff]"
                        : "border-white/[0.07] bg-white/[0.025] text-[#71717a] hover:border-white/10 hover:text-white"
                    }`}
                  >
                    <Bookmark
                      className={`h-4 w-4 ${
                        bookmarked ? "fill-current" : ""
                      }`}
                    />
                  </button>

                  <button
                    type="button"
                    aria-label="Share agent"
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        navigator.clipboard?.writeText(
                          window.location.href
                        );
                      }
                    }}
                    className="flex h-11 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-[#71717a] transition hover:border-white/10 hover:text-white"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* SECTION NAV */}
        {/* ====================================================== */}

        <nav className="sticky top-0 z-20 mt-5 border-b border-white/[0.07] bg-[#07070a]/95 backdrop-blur-xl">
          <div className="flex overflow-x-auto">
            {[
              ["overview", "Overview"],
              ["capabilities", "Capabilities"],
              ["pricing", "Pricing"],
              ["reviews", `Reviews (${agent.reviewCount})`],
            ].map(([href, label], index) => (
              <a
                key={href}
                href={`#${href}`}
                className={`whitespace-nowrap border-b-2 px-5 py-4 text-[11px] font-bold uppercase tracking-[0.08em] transition ${
                  index === 0
                    ? "border-[#8066ff] text-white"
                    : "border-transparent text-[#62626b] hover:text-white"
                }`}
              >
                {label}
              </a>
            ))}
          </div>
        </nav>

        {/* ====================================================== */}
        {/* CONTENT */}
        {/* ====================================================== */}

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_285px]">

          {/* ================================================== */}
          {/* MAIN COLUMN */}
          {/* ================================================== */}

          <div className="min-w-0 space-y-4">

            {/* OVERVIEW */}
            <section
              id="overview"
              className="scroll-mt-24 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0d0d12]"
            >
              <SectionHeader title="About this agent" />

              <div className="p-5">
                <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_230px]">
                  <div>
                    <p className="text-sm leading-6 text-[#a1a1aa]">
                      {agent.description}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/[0.06] bg-[#111116] p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#52525b]">
                      Primary task
                    </p>

                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#8066ff]/10">
                        <Zap className="h-4 w-4 text-[#8b72ff]" />
                      </div>

                      <span className="text-sm font-semibold text-white">
                        {agent.primaryTask}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-white/[0.06] pt-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#52525b]">
                    Category
                  </span>

                  <Link
                    href={`/agents?category=${agent.categorySlug}`}
                    className="inline-flex items-center rounded-lg border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-xs font-medium text-[#a1a1aa] transition hover:border-[#8066ff]/30 hover:text-white"
                  >
                    {agent.category}
                  </Link>
                </div>
              </div>
            </section>

            {/* CAPABILITIES */}
            <section
              id="capabilities"
              className="scroll-mt-24 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0d0d12]"
            >
              <SectionHeader title="Capabilities" />

              <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6">
                <CapabilityCard
                  title="API Access"
                  description={
                    agent.hasApi
                      ? "API available"
                      : "No API listed"
                  }
                  available={agent.hasApi}
                />

                <CapabilityCard
                  title="Open Source"
                  description={
                    agent.isOpenSource
                      ? "Open-source agent"
                      : "Not listed as open source"
                  }
                  available={agent.isOpenSource}
                />
              </div>
            </section>

            {/* PLATFORM */}
            <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0d0d12]">
              <SectionHeader title="Platform compatibility" />

              <div className="p-5">
                {agent.compatibility.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {agent.compatibility.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center rounded-lg border border-white/[0.07] bg-[#111116] px-3 py-2 text-xs font-medium text-[#d4d4d8]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#71717a]">
                    Compatibility information is not available.
                  </p>
                )}
              </div>
            </section>

            {/* PRICING */}
            <section
              id="pricing"
              className="scroll-mt-24 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0d0d12]"
            >
              <SectionHeader title="Pricing" />

              <div className="p-5">
                <div className="flex flex-col gap-3 rounded-xl border border-[#8066ff]/15 bg-gradient-to-r from-[#15121e] to-[#111116] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="text-lg font-bold text-white">
                        {pricing}
                      </p>
                    </div>

                    {agent.pricingRaw && (
                      <p className="mt-2 max-w-xl text-xs leading-5 text-[#71717a]">
                        {agent.pricingRaw}
                      </p>
                    )}
                  </div>

                  <span className="w-fit rounded-full border border-[#8066ff]/20 bg-[#8066ff]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#a28cff]">
                    {agent.pricingModel}
                  </span>
                </div>
              </div>
            </section>

            {/* REVIEWS */}
            <section
              id="reviews"
              className="scroll-mt-24 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0d0d12]"
            >
              <SectionHeader
                title="Reviews"
                count={`${agent.reviewCount} reviews`}
              />

              <div className="p-5">
                {agent.reviewCount > 0 ? (
                  <div className="flex items-center gap-6">
                    <div>
                      <div className="text-5xl font-black tracking-tight text-white">
                        {agent.avgRating?.toFixed(1) ?? "—"}
                      </div>

                      <div className="mt-2 flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              agent.avgRating &&
                              star <=
                                Math.round(agent.avgRating)
                                ? "fill-current text-yellow-500"
                                : "text-[#3f3f46]"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="border-l border-white/[0.06] pl-6">
                      <p className="text-sm font-semibold text-white">
                        Community rating
                      </p>
                      <p className="mt-1 text-xs text-[#71717a]">
                        Based on {agent.reviewCount}{" "}
                        {agent.reviewCount === 1
                          ? "review"
                          : "reviews"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex min-h-28 flex-col items-center justify-center text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.02]">
                      <Star className="h-5 w-5 text-[#52525b]" />
                    </div>

                    <p className="mt-4 text-sm font-semibold text-[#a1a1aa]">
                      No reviews yet
                    </p>

                    <p className="mt-1 text-xs text-[#52525b]">
                      Be the first to review this agent.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* SIMILAR AGENTS */}
            {agent.similarAgents &&
              agent.similarAgents.length > 0 && (
                <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0d0d12]">
                  <SectionHeader
                    title="Similar agents"
                    count={`${agent.similarAgents.length}`}
                  />

                  <div className="grid gap-3 p-5 sm:grid-cols-2">
                    {agent.similarAgents.map((similar) => (
                      <SimilarAgentCard
                        key={similar.id}
                        agent={similar}
                      />
                    ))}
                  </div>
                </section>
              )}
          </div>

          {/* ================================================== */}
          {/* SIDEBAR */}
          {/* ================================================== */}

          <aside className="space-y-4">

            {/* SPECIFICATIONS */}
            <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0d0d12]">
              <SectionHeader title="Specifications" />

              <div className="px-5">
                <div className="flex items-center justify-between border-b border-white/[0.06] py-3">
                  <span className="text-xs text-[#62626b]">
                    Pricing
                  </span>
                  <span className="text-xs font-semibold text-white">
                    {pricing}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-white/[0.06] py-3">
                  <span className="text-xs text-[#62626b]">
                    Open Source
                  </span>
                  <span className="text-xs font-semibold text-white">
                    {agent.isOpenSource ? "Yes" : "No"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-white/[0.06] py-3">
                  <span className="text-xs text-[#62626b]">
                    API
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      agent.hasApi
                        ? "text-emerald-400"
                        : "text-white"
                    }`}
                  >
                    {agent.hasApi ? "Available" : "Not available"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-white/[0.06] py-3">
                  <span className="text-xs text-[#62626b]">
                    Verified
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-white">
                    {agent.verified && (
                      <Check className="h-3.5 w-3.5 text-[#8066ff]" />
                    )}
                    {agent.verified ? "Yes" : "No"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-white/[0.06] py-3">
                  <span className="text-xs text-[#62626b]">
                    Category
                  </span>
                  <span className="max-w-[150px] truncate text-right text-xs font-semibold text-white">
                    {agent.category}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3">
                  <span className="text-xs text-[#62626b]">
                    Added
                  </span>
                  <span className="text-xs font-semibold text-white">
                    {formatDate(agent.createdAt)}
                  </span>
                </div>
              </div>
            </section>

            {/* ACTIVITY */}
            <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0d0d12]">
              <SectionHeader title="Activity" />

              <div className="grid grid-cols-3 divide-x divide-white/[0.06] p-2">
                <div className="px-2.5 py-2.5 text-center">
                  <p className="text-lg font-bold text-white">
                    {formatNumber(agent.views)}
                  </p>
                  <p className="mt-1 text-[10px] text-[#52525b]">
                    Views
                  </p>
                </div>

                <div className="px-2.5 py-2.5 text-center">
                  <p className="text-lg font-bold text-white">
                    {formatNumber(agent.upvoteCount)}
                  </p>
                  <p className="mt-1 text-[10px] text-[#52525b]">
                    Upvotes
                  </p>
                </div>

                <div className="px-2.5 py-2.5 text-center">
                  <p
                    className={`text-lg font-bold ${
                      agent.isTrending
                        ? "text-orange-400"
                        : "text-white"
                    }`}
                  >
                    {agent.isTrending ? "Yes" : "No"}
                  </p>
                  <p className="mt-1 text-[10px] text-[#52525b]">
                    Trending
                  </p>
                </div>
              </div>
            </section>

            {/* LINKS */}
            <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0d0d12]">
              <SectionHeader title="Links" />

              <div className="space-y-2 p-4">
                <a
                  href={agent.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-[#111116] px-3.5 py-2.5 text-xs text-[#a1a1aa] transition hover:border-[#8066ff]/25 hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Website
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>

                {agent.isOpenSource && (
                  <a
                    href={agent.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-[#111116] px-3.5 py-2.5 text-xs text-[#a1a1aa] transition hover:border-[#8066ff]/25 hover:text-white"
                  >
                    <span className="flex items-center gap-2">
                      <Github className="h-4 w-4" />
                      Open Source
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}

                {agent.hasApi && (
                  <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-[#111116] px-3.5 py-2.5 text-xs text-[#a1a1aa]">
                    <Code2 className="h-4 w-4" />
                    API Available
                  </div>
                )}
              </div>
            </section>

          </aside>
        </div>
      </div>
    </main>
  );
}
