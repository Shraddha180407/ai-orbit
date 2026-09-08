"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Bookmark,
  CalendarDays,
  Check,
  ChevronRight,
  CircleCheck,
  Code2,
  Eye,
  Github,
  Globe,
  Layers3,
  Link2,
  Share2,
  Star,
  Tag,
  Zap,
  Bot,
  TrendingUp,
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
      ? "h-28 w-28 sm:h-32 sm:w-32"
      : "h-12 w-12";

  if (src) {
    return (
      <div
        className={`${dimensions} shrink-0 overflow-hidden rounded-2xl border border-[#29292f] bg-white`}
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
      className={`${dimensions} shrink-0 flex items-center justify-center rounded-2xl border border-[#29292f] bg-[#15151a]`}
    >
      <Bot className="h-10 w-10 text-[#8066ff]" />
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  count,
}: {
  icon: React.ElementType;
  title: string;
  count?: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-[#202025] px-6 py-5">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-[#8066ff]" />

        <h2 className="text-sm font-bold uppercase tracking-wide text-white">
          {title}
        </h2>
      </div>

      {count && (
        <span className="rounded-full border border-[#29292f] bg-[#15151a] px-3 py-1 text-xs text-[#71717a]">
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
      className="group flex gap-4 rounded-xl border border-[#242429] bg-[#101014] p-4 transition hover:border-[#6E56CF]/60 hover:bg-[#141419]"
    >
      <AgentLogo
        src={agent.logoUrl}
        name={agent.name}
        size="small"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-sm font-semibold text-white group-hover:text-[#a28cff]">
            {agent.name}
          </h3>

          <ChevronRight className="h-4 w-4 shrink-0 text-[#52525b] transition group-hover:translate-x-1 group-hover:text-[#8b72ff]" />
        </div>

        <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#71717a]">
          {agent.description}
        </p>

        <div className="mt-3 flex items-center gap-3 text-[11px] text-[#71717a]">
          <span>{agent.category}</span>

          {agent.avgRating !== null && (
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-current text-yellow-500" />
              {agent.avgRating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </Link>
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

  const { data: agent, isLoading, isError } =
    useQuery<Agent>({
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
      <main className="min-h-screen bg-[#08080b] text-white">
        <div className="mx-auto max-w-[1240px] px-5 py-10 sm:px-6">
          <div className="h-4 w-48 animate-pulse rounded bg-[#17171c]" />

          <div className="mt-6 h-64 animate-pulse rounded-2xl border border-[#202025] bg-[#0e0e12]" />

          <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="h-96 animate-pulse rounded-2xl bg-[#0e0e12]" />
            <div className="h-80 animate-pulse rounded-2xl bg-[#0e0e12]" />
          </div>
        </div>
      </main>
    );
  }

  if (isError || !agent) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#08080b] text-white">
        <div className="text-center">
          <Bot className="mx-auto h-10 w-10 text-[#6E56CF]" />

          <h1 className="mt-4 text-2xl font-bold">
            Agent not found
          </h1>

          <p className="mt-2 text-sm text-[#71717a]">
            We couldn't find this agent.
          </p>

          <Link
            href="/agents"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#7357d9] px-4 py-2 text-sm font-semibold"
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
    <main className="min-h-screen bg-[#08080b] text-white">
      <div className="mx-auto max-w-[1240px] px-5 pb-20 pt-8 sm:px-6 lg:px-8">

        {/* BREADCRUMB */}
        <div className="mb-5 flex items-center gap-2 overflow-hidden text-xs text-[#71717a]">
          <Link
            href="/"
            className="shrink-0 hover:text-white"
          >
            Home
          </Link>

          <ChevronRight className="h-3 w-3 shrink-0" />

          <Link
            href="/agents"
            className="shrink-0 hover:text-white"
          >
            AI Agents
          </Link>

          <ChevronRight className="h-3 w-3 shrink-0" />

          <span className="shrink-0 text-[#a1a1aa]">
            {agent.category}
          </span>

          <ChevronRight className="h-3 w-3 shrink-0" />

          <span className="truncate text-white">
            {agent.name}
          </span>
        </div>

        {/* ====================================================== */}
        {/* HERO */}
        {/* ====================================================== */}

        <section className="overflow-hidden rounded-2xl border border-[#24242a] bg-gradient-to-br from-[#13131a] via-[#0e0e13] to-[#0a0a0d]">
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

              {/* AGENT INFO */}
              <div className="flex min-w-0 flex-1 gap-5 sm:gap-7">
                <AgentLogo
                  src={agent.logoUrl}
                  name={agent.name}
                />

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                      {agent.name}
                    </h1>

                    {agent.verified && (
                      <span
                        title="Verified Agent"
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-[#6E56CF]"
                      >
                        <Check className="h-3.5 w-3.5 text-white" />
                      </span>
                    )}

                    {agent.isTrending && (
                      <span className="flex items-center gap-1 rounded-full border border-orange-500/20 bg-orange-500/10 px-2.5 py-1 text-[11px] font-semibold text-orange-400">
                        <TrendingUp className="h-3 w-3" />
                        Trending
                      </span>
                    )}
                  </div>

                  {/* META */}
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full border border-[#29292f] bg-[#17171c] px-3 py-1.5 text-[#d4d4d8]">
                      {pricing}
                    </span>

                    {agent.avgRating !== null ? (
                      <span className="flex items-center gap-1.5 text-[#a1a1aa]">
                        <Star className="h-3.5 w-3.5 fill-current text-yellow-500" />

                        <span className="font-semibold text-white">
                          {agent.avgRating.toFixed(1)}
                        </span>

                        <span>
                          ({agent.reviewCount}{" "}
                          {agent.reviewCount === 1
                            ? "review"
                            : "reviews"}
                          )
                        </span>
                      </span>
                    ) : (
                      <span className="text-[#71717a]">
                        No reviews yet
                      </span>
                    )}

                    <span className="text-[#3f3f46]">•</span>

                    <Link
                      href={`/agents?category=${agent.categorySlug}`}
                      className="rounded-full border border-[#29292f] bg-[#15151a] px-3 py-1.5 text-[#a1a1aa] transition hover:border-[#6E56CF]/50 hover:text-white"
                    >
                      {agent.category}
                    </Link>
                  </div>

                  {/* DESCRIPTION */}
                  <p className="mt-5 max-w-2xl text-sm leading-7 text-[#a1a1aa] sm:text-base">
                    {agent.description}
                  </p>

                  {/* HERO DETAILS */}
                  <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-[#71717a]">
                    <span className="flex items-center gap-2">
                      <CalendarDays className="h-3.5 w-3.5" />
                      Added {formatDate(agent.createdAt)}
                    </span>

                    <span className="flex items-center gap-2">
                      <Zap className="h-3.5 w-3.5 text-[#8066ff]" />
                      {agent.primaryTask}
                    </span>

                    {agent.compatibility.length > 0 && (
                      <span className="flex items-center gap-2">
                        <Globe className="h-3.5 w-3.5" />
                        {agent.compatibility.length} platform
                        {agent.compatibility.length !== 1
                          ? "s"
                          : ""}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex shrink-0 flex-col gap-3 lg:w-52">
                <a
                  href={agent.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#7357d9] px-5 text-sm font-bold text-white shadow-lg shadow-[#7357d9]/20 transition hover:bg-[#8066ef]"
                >
                  Visit Website
                  <ArrowUpRight className="h-4 w-4" />
                </a>

                <div className="grid grid-cols-3 gap-2">
                  {/* UPVOTE */}
                  <button
                    onClick={() =>
                      setUpvoted((value) => !value)
                    }
                    className={`flex h-11 flex-col items-center justify-center rounded-xl border transition ${
                      upvoted
                        ? "border-[#6E56CF] bg-[#6E56CF]/15 text-[#a28cff]"
                        : "border-[#25252b] bg-[#111115] text-[#71717a] hover:text-white"
                    }`}
                  >
                    <ArrowUpRight className="h-4 w-4 rotate-[-45deg]" />

                    <span className="mt-0.5 text-[10px]">
                      {formatNumber(
                        agent.upvoteCount +
                          (upvoted ? 1 : 0)
                      )}
                    </span>
                  </button>

                  {/* BOOKMARK */}
                  <button
                    onClick={() =>
                      setBookmarked((value) => !value)
                    }
                    className={`flex h-11 items-center justify-center rounded-xl border transition ${
                      bookmarked
                        ? "border-[#6E56CF] bg-[#6E56CF]/15 text-[#a28cff]"
                        : "border-[#25252b] bg-[#111115] text-[#71717a] hover:text-white"
                    }`}
                  >
                    <Bookmark
                      className={`h-4 w-4 ${
                        bookmarked ? "fill-current" : ""
                      }`}
                    />
                  </button>

                  {/* SHARE */}
                  <button
                    onClick={() => {
                      if (
                        typeof window !== "undefined"
                      ) {
                        navigator.clipboard?.writeText(
                          window.location.href
                        );
                      }
                    }}
                    className="flex h-11 items-center justify-center rounded-xl border border-[#25252b] bg-[#111115] text-[#71717a] transition hover:text-white"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* TABS */}
        {/* ====================================================== */}

        <nav className="mt-5 flex overflow-x-auto border-b border-[#202025]">
          <a
            href="#overview"
            className="border-b-2 border-[#8066ff] px-5 py-4 text-xs font-bold uppercase tracking-wide text-white"
          >
            Overview
          </a>

          <a
            href="#capabilities"
            className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#71717a] hover:text-white"
          >
            Capabilities
          </a>

          <a
            href="#pricing"
            className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#71717a] hover:text-white"
          >
            Pricing
          </a>

          <a
            href="#reviews"
            className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#71717a] hover:text-white"
          >
            Reviews ({agent.reviewCount})
          </a>
        </nav>

        {/* ====================================================== */}
        {/* CONTENT */}
        {/* ====================================================== */}

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">

          {/* MAIN */}
          <div className="space-y-5">

            {/* OVERVIEW */}
            <section
              id="overview"
              className="scroll-mt-6 overflow-hidden rounded-2xl border border-[#24242a] bg-[#0e0e12]"
            >
              <SectionHeader
                icon={Layers3}
                title="Overview"
              />

              <div className="space-y-7 p-6">

                <div>
                  <h3 className="text-base font-bold text-white">
                    What is {agent.name}?
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#a1a1aa]">
                    {agent.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">
                    Primary Task
                  </h3>

                  <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-[#29292f] bg-[#15151a] px-4 py-2.5 text-sm text-[#d4d4d8]">
                    <Zap className="h-4 w-4 text-[#8066ff]" />
                    {agent.primaryTask}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">
                    Category
                  </h3>

                  <Link
                    href={`/agents?category=${agent.categorySlug}`}
                    className="mt-3 inline-flex items-center gap-2 rounded-lg border border-[#29292f] bg-[#15151a] px-4 py-2.5 text-sm text-[#d4d4d8] hover:border-[#6E56CF]/50 hover:text-white"
                  >
                    <Tag className="h-4 w-4 text-[#8066ff]" />
                    {agent.category}
                  </Link>
                </div>

              </div>
            </section>

            {/* CAPABILITIES */}
            <section
              id="capabilities"
              className="scroll-mt-6 overflow-hidden rounded-2xl border border-[#24242a] bg-[#0e0e12]"
            >
              <SectionHeader
                icon={CircleCheck}
                title="Capabilities"
              />

              <div className="grid gap-3 p-6 sm:grid-cols-2">

                <div className="rounded-xl border border-[#29292f] bg-[#131318] p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-[#6E56CF]/10 p-2">
                      <Code2 className="h-4 w-4 text-[#8066ff]" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-white">
                        API Access
                      </p>

                      <p className="mt-1 text-xs text-[#71717a]">
                        {agent.hasApi
                          ? "API available"
                          : "No API listed"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-[#29292f] bg-[#131318] p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-[#6E56CF]/10 p-2">
                      <Github className="h-4 w-4 text-[#8066ff]" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-white">
                        Open Source
                      </p>

                      <p className="mt-1 text-xs text-[#71717a]">
                        {agent.isOpenSource
                          ? "Open-source agent"
                          : "Not listed as open source"}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* COMPATIBILITY */}
            <section className="overflow-hidden rounded-2xl border border-[#24242a] bg-[#0e0e12]">
              <SectionHeader
                icon={Globe}
                title="Platform & Compatibility"
              />

              <div className="p-6">
                {agent.compatibility.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {agent.compatibility.map((item) => (
                      <span
                        key={item}
                        className="flex items-center gap-2 rounded-lg border border-[#29292f] bg-[#15151a] px-3.5 py-2 text-sm text-[#d4d4d8]"
                      >
                        <CircleCheck className="h-3.5 w-3.5 text-[#8066ff]" />
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
              className="scroll-mt-6 overflow-hidden rounded-2xl border border-[#24242a] bg-[#0e0e12]"
            >
              <SectionHeader
                icon={Zap}
                title="Pricing"
              />

              <div className="p-6">
                <div className="rounded-xl border border-[#29292f] bg-[#131318] p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                      <p className="text-lg font-bold text-white">
                        {pricing}
                      </p>

                      {agent.pricingRaw && (
                        <p className="mt-2 text-sm leading-6 text-[#71717a]">
                          {agent.pricingRaw}
                        </p>
                      )}
                    </div>

                    <span className="w-fit rounded-full bg-[#6E56CF]/15 px-3 py-1.5 text-xs font-semibold text-[#a28cff]">
                      {agent.pricingModel}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* REVIEWS */}
            <section
              id="reviews"
              className="scroll-mt-6 overflow-hidden rounded-2xl border border-[#24242a] bg-[#0e0e12]"
            >
              <SectionHeader
                icon={Star}
                title="Reviews"
                count={`${agent.reviewCount} reviews`}
              />

              <div className="p-6">
                {agent.reviewCount > 0 ? (
                  <div className="flex items-center gap-5">

                    <div className="text-5xl font-black">
                      {agent.avgRating?.toFixed(1) ?? "—"}
                    </div>

                    <div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(
                          (star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                agent.avgRating &&
                                star <=
                                  Math.round(
                                    agent.avgRating
                                  )
                                  ? "fill-current text-yellow-500"
                                  : "text-[#3f3f46]"
                              }`}
                            />
                          )
                        )}
                      </div>

                      <p className="mt-2 text-xs text-[#71717a]">
                        Based on {agent.reviewCount}{" "}
                        {agent.reviewCount === 1
                          ? "review"
                          : "reviews"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <Star className="mx-auto h-8 w-8 text-[#3f3f46]" />

                    <p className="mt-3 text-sm font-medium text-[#a1a1aa]">
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
                <section className="overflow-hidden rounded-2xl border border-[#24242a] bg-[#0e0e12]">
                  <SectionHeader
                    icon={Bot}
                    title="Similar Agents"
                    count={`${agent.similarAgents.length}`}
                  />

                  <div className="grid gap-3 p-5 sm:grid-cols-2">
                    {agent.similarAgents.map(
                      (similar) => (
                        <SimilarAgentCard
                          key={similar.id}
                          agent={similar}
                        />
                      )
                    )}
                  </div>
                </section>
              )}
          </div>

          {/* ================================================== */}
          {/* SIDEBAR */}
          {/* ================================================== */}

          <aside className="space-y-5">

            {/* SPECIFICATIONS */}
            <section className="overflow-hidden rounded-2xl border border-[#24242a] bg-[#0e0e12]">
              <SectionHeader
                icon={Layers3}
                title="Specifications"
              />

              <div className="px-5">

                <div className="flex items-center justify-between border-b border-[#202025] py-4">
                  <span className="text-sm text-[#71717a]">
                    Pricing
                  </span>

                  <span className="text-sm font-semibold text-white">
                    {pricing}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-[#202025] py-4">
                  <span className="text-sm text-[#71717a]">
                    Open Source
                  </span>

                  <span className="text-sm font-semibold text-white">
                    {agent.isOpenSource
                      ? "Yes"
                      : "No"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-[#202025] py-4">
                  <span className="text-sm text-[#71717a]">
                    API
                  </span>

                  <span className="text-sm font-semibold text-white">
                    {agent.hasApi
                      ? "Available"
                      : "Not available"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-[#202025] py-4">
                  <span className="text-sm text-[#71717a]">
                    Verified
                  </span>

                  <span className="flex items-center gap-1.5 text-sm font-semibold text-white">
                    {agent.verified && (
                      <Check className="h-3.5 w-3.5 text-[#8066ff]" />
                    )}

                    {agent.verified
                      ? "Yes"
                      : "No"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-[#202025] py-4">
                  <span className="text-sm text-[#71717a]">
                    Category
                  </span>

                  <span className="max-w-[150px] truncate text-right text-sm font-semibold text-white">
                    {agent.category}
                  </span>
                </div>

                <div className="flex items-center justify-between py-4">
                  <span className="text-sm text-[#71717a]">
                    Added
                  </span>

                  <span className="text-sm font-semibold text-white">
                    {formatDate(agent.createdAt)}
                  </span>
                </div>

              </div>
            </section>

            {/* ACTIVITY */}
            <section className="overflow-hidden rounded-2xl border border-[#24242a] bg-[#0e0e12]">
              <SectionHeader
                icon={Eye}
                title="Activity"
              />

              <div className="px-5">

                <div className="flex items-center justify-between border-b border-[#202025] py-4">
                  <span className="text-sm text-[#71717a]">
                    Views
                  </span>

                  <span className="text-sm font-semibold text-white">
                    {formatNumber(agent.views)}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-[#202025] py-4">
                  <span className="text-sm text-[#71717a]">
                    Upvotes
                  </span>

                  <span className="text-sm font-semibold text-white">
                    {formatNumber(agent.upvoteCount)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-4">
                  <span className="text-sm text-[#71717a]">
                    Trending
                  </span>

                  <span className="text-sm font-semibold text-white">
                    {agent.isTrending
                      ? "Yes"
                      : "No"}
                  </span>
                </div>

              </div>
            </section>

            {/* LINKS */}
            <section className="overflow-hidden rounded-2xl border border-[#24242a] bg-[#0e0e12]">
              <SectionHeader
                icon={Link2}
                title="Links"
              />

              <div className="space-y-2 p-4">

                <a
                  href={agent.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border border-[#25252b] bg-[#131318] px-4 py-3 text-sm text-[#a1a1aa] transition hover:border-[#6E56CF]/50 hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Website
                  </span>

                  <ArrowUpRight className="h-4 w-4" />
                </a>

                {agent.isOpenSource && (
                  <a
                    href={agent.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-lg border border-[#25252b] bg-[#131318] px-4 py-3 text-sm text-[#a1a1aa] transition hover:border-[#6E56CF]/50 hover:text-white"
                  >
                    <span className="flex items-center gap-2">
                      <Github className="h-4 w-4" />
                      Open Source
                    </span>

                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                )}

                {agent.hasApi && (
                  <div className="flex items-center gap-2 rounded-lg border border-[#25252b] bg-[#131318] px-4 py-3 text-sm text-[#a1a1aa]">
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