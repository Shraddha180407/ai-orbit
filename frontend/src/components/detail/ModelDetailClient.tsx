"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left";
import Share2 from "lucide-react/dist/esm/icons/share-2";
import Bookmark from "lucide-react/dist/esm/icons/bookmark";
import Check from "lucide-react/dist/esm/icons/check";
import Building2 from "lucide-react/dist/esm/icons/building-2";
import ExternalLink from "lucide-react/dist/esm/icons/external-link";
import Tag from "lucide-react/dist/esm/icons/tag";
import BarChart3 from "lucide-react/dist/esm/icons/bar-chart-3";
import { toast } from "sonner";
import { fetchModelById } from "@/lib/api";
import {
  isModelBookmarked,
  toggleModelBookmark,
} from "@/lib/model-bookmarks";
import type { ModelDetail, AIModel } from "@/lib/types";
import { MOCK_MODELS_BY_ID } from "@/lib/mock/models";
import { formatModelType } from "@/lib/types";

function Spec({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[9.5px] font-mono uppercase tracking-wider text-[#71717A]">
        {label}
      </p>

      <p className="mt-1 truncate text-[13px] font-semibold text-white">
        {value}
      </p>
    </div>
  );
}

function TypeChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-md border border-[#6E56CF]/35 bg-[#6E56CF]/10 px-2.5 py-1 text-[10px] font-semibold text-[#B8A8FF]">
      {label}
    </span>
  );
}

function StatusChip({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: "neutral" | "green";
}) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
        tone === "green"
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
          : "border-[#232326]/70 bg-[#18181C] text-[#A1A1AA]"
      }`}
    >
      {label}
    </span>
  );
}

function RelatedCard({ model }: { model: AIModel }) {
  const company = model.provider?.name || model.creator || "—";
  const typeLabel =
    formatModelType(model.modelType) || model.modality || "Model";

  const [logoFailed, setLogoFailed] = useState(false);

  useEffect(() => {
    setLogoFailed(false);
  }, [model.provider?.logoUrl]);

  return (
    <Link
      href={`/models/${model.id}`}
      className="group relative block overflow-hidden rounded-xl border border-[#232326]/70 bg-[#131316]/55 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#6E56CF]/35 hover:bg-[#18181C]/75 hover:shadow-[0_12px_40px_rgba(0,0,0,0.28)]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#6E56CF]/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="flex items-start gap-3.5">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#2B2B31] bg-white shadow-sm">
          {model.provider?.logoUrl && !logoFailed ? (
            <img
              src={model.provider.logoUrl}
              alt=""
              className="h-9 w-9 object-contain"
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <span className="select-none text-base font-bold text-neutral-800">
              {(company || model.name).charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-[13px] font-bold text-white transition-colors group-hover:text-[#DCD5FF]">
                {model.name}
              </h3>

              <p className="mt-0.5 truncate text-[10.5px] text-[#71717A]">
                {company}
              </p>
            </div>

            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-[#232326]/70 bg-[#18181C] text-[#71717A] transition-all group-hover:border-[#6E56CF]/35 group-hover:bg-[#6E56CF]/10 group-hover:text-[#B8A8FF]">
              →
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            <TypeChip label={typeLabel} />

            {model.openSource === true && (
              <StatusChip label="Open source" tone="green" />
            )}
          </div>

          <p className="mt-3 line-clamp-2 text-[11px] leading-[1.55] text-[#8F8F98]">
            {model.description || "No description available for this model."}
          </p>

          <div className="mt-3 flex items-center justify-between gap-3 border-t border-[#232326]/50 pt-3">
            <span className="text-[9.5px] font-mono uppercase tracking-wider text-[#52525B]">
              {model.modality || typeLabel}
            </span>

            {model.releaseDate ? (
              <span className="truncate text-[9.5px] font-mono text-[#52525B]">
                Released {model.releaseDate}
              </span>
            ) : (
              <span className="text-[9.5px] font-mono text-[#52525B]">
                Model
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ModelDetailClient() {
  const params = useParams();
  const id = (params?.id || params?.slug) as string;
  const mockModel = id ? MOCK_MODELS_BY_ID[id] : undefined;

  /*
   * IMPORTANT:
   * Do not use browser/localStorage cache as React Query initialData here.
   * This component is server-rendered initially, so reading browser-only
   * cached data during the initial render can cause a hydration mismatch.
   */
  const {
    data: apiModel = null,
    isLoading: apiLoading,
    isError,
  } = useQuery<ModelDetail | null>({
    queryKey: ["model-detail", id],
    queryFn: () => fetchModelById(id),
    staleTime: 15 * 60 * 1000,
    enabled: Boolean(id) && !mockModel,
  });

  // Mock entries are used for design review without changing the real API flow.
  const model = mockModel ?? apiModel;
  const loading = Boolean(id) && !mockModel && apiLoading;

  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (model) {
      setBookmarked(isModelBookmarked(model.id));
      document.title = `${model.name} — AI Model | AI Orbit`;
    }
  }, [model]);

  if (loading && !model) {
    return (
      <main className="mx-auto flex w-full max-w-[1100px] flex-1 px-4 py-6 md:px-6 md:py-10">
        <div className="w-full animate-pulse space-y-6">
          <div className="h-4 w-32 rounded bg-[#232326]" />

          <div className="h-52 rounded-xl border border-[#232326]/60 bg-[#131316]/40" />

          <div className="h-64 rounded-xl border border-[#232326]/60 bg-[#131316]/40" />
        </div>
      </main>
    );
  }

  if (isError && !model) {
    return (
      <main className="mx-auto flex w-full max-w-[1100px] flex-1 px-4 py-6 md:px-6 md:py-10">
        <div className="w-full">
          <Link
            href="/models"
            className="inline-flex items-center gap-1.5 text-sm text-[#71717A] transition-colors hover:text-white"
          >
            <ArrowLeft size={14} />
            AI Models
          </Link>

          <div className="mt-8 rounded-xl border border-[#232326]/60 bg-[#131316]/40 p-6 text-center">
            <p className="text-sm font-semibold text-white">
              Couldn’t load this model
            </p>

            <p className="mt-2 text-xs text-[#A1A1AA]">
              Model details could not be retrieved.
            </p>

            <p className="mt-1 text-[11px] text-[#71717A]">
              Check that the API is running and NEXT_PUBLIC_API_URL points at
              it.
            </p>

            <Link
              href="/models"
              className="mt-4 inline-flex rounded-lg border border-[#232326]/60 bg-[#18181C] px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-neutral-500"
            >
              Back to models
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!model) {
    notFound();
    return null;
  }

  const companyName =
    model.provider?.name || model.creator || "Unknown provider";

  const typeLabel =
    formatModelType(model.modelType) || model.modality || "—";

  // API shape is { task: { id, title, slug } }; keep the UI flat.
  const tasks = (model.tasks ?? [])
    .map((entry) => entry?.task)
    .filter(
      (task): task is { id: string; title: string; slug: string } =>
        Boolean(task?.id && task?.title && task?.slug)
    );

  const related = model.relatedModels ?? [];
  const subCategories = model.subCategories ?? [];
  const tags = model.tags ?? [];
  const benchmarks = model.benchmarks ?? [];

  const handleShare = async () => {
    const url =
      typeof window !== "undefined" ? window.location.href : "";

    try {
      if (navigator.share) {
        await navigator.share({
          title: model.name,
          text: model.description,
          url,
        });

        return;
      }

      await navigator.clipboard.writeText(url);

      setCopied(true);
      toast.success("Link copied");

      setTimeout(() => setCopied(false), 2000);
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied");
      } catch {
        toast.error("Could not share");
      }
    }
  };

  const handleBookmark = () => {
    const next = toggleModelBookmark(model.id);

    setBookmarked(next);

    toast.success(
      next ? "Saved to bookmarks" : "Removed from bookmarks"
    );
  };

  return (
    <main className="relative mx-auto flex w-full max-w-[1100px] flex-1 overflow-hidden px-3 py-4 sm:px-6 sm:py-6 md:py-10">
      <div className="pointer-events-none absolute left-1/4 top-0 z-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6E56CF]/5 blur-3xl" />

      <div className="relative z-10 w-full">
        {/* Breadcrumb */}
        <nav className="mb-4 flex min-w-0 items-center text-xs text-[#71717A] sm:mb-6 sm:text-sm">
          <Link
            href="/models"
            className="inline-flex shrink-0 items-center gap-1.5 transition-colors hover:text-white"
          >
            <ArrowLeft size={14} />
            AI Models
          </Link>

          <span className="mx-2 shrink-0">/</span>

          <span className="truncate text-[#A1A1AA]">
            {model.name}
          </span>
        </nav>

        {/* Hero */}
        <header className="rounded-xl border border-[#232326]/80 bg-[#131316]/40 p-4 backdrop-blur-md sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#232326]/60 bg-white/95 p-2.5 sm:h-20 sm:w-20">
                {model.provider?.logoUrl ? (
                  <img
                    src={model.provider.logoUrl}
                    alt={`${companyName} logo`}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="select-none text-2xl font-bold text-neutral-900">
                    {model.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              <div className="min-w-0 pt-0.5">
                <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  {model.name}
                </h1>

                <p className="mt-1.5 text-xs text-[#A1A1AA]">
                  by{" "}
                  {model.provider?.slug ? (
                    <Link
                      href={`/companies/${model.provider.slug}`}
                      className="font-semibold text-white hover:underline"
                    >
                      {companyName}
                    </Link>
                  ) : (
                    <span className="font-semibold text-white">
                      {companyName}
                    </span>
                  )}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <TypeChip label={typeLabel} />

                  {model.openSource === true && (
                    <StatusChip
                      label="Open source"
                      tone="green"
                    />
                  )}

                  {model.primaryTask && (
                    <StatusChip label={model.primaryTask} />
                  )}

                  {model.releaseDate && (
                    <StatusChip
                      label={`Released ${model.releaseDate}`}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Hero actions */}
            <div className="flex w-full shrink-0 gap-2 lg:w-auto lg:flex-col">
              <button
                type="button"
                onClick={handleBookmark}
                className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors lg:flex-none ${
                  bookmarked
                    ? "border-[#6E56CF]/50 bg-[#6E56CF]/15 text-white"
                    : "border-[#232326]/60 bg-[#18181C] text-[#A1A1AA] hover:text-white"
                }`}
              >
                <Bookmark
                  size={15}
                  className={bookmarked ? "fill-current" : ""}
                />

                {bookmarked ? "Saved" : "Save"}
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#232326]/60 bg-[#18181C] px-4 py-2.5 text-sm font-semibold text-[#A1A1AA] transition-colors hover:text-white lg:flex-none"
              >
                {copied ? (
                  <Check size={15} />
                ) : (
                  <Share2 size={15} />
                )}

                {copied ? "Copied" : "Share"}
              </button>
            </div>
          </div>

          {/* Hero quick specs */}
          <div className="mt-5 grid grid-cols-2 gap-4 border-t border-[#232326]/60 pt-4 sm:grid-cols-4">
            <Spec
              label="Primary task"
              value={model.primaryTask || "—"}
            />

            <Spec
              label="Modality"
              value={model.modality || "—"}
            />

            <Spec
              label="Context window"
              value={model.contextWindow || "—"}
            />

            <Spec
              label="Parameters"
              value={model.parameterSize || "—"}
            />
          </div>
        </header>

        {/* Main content + sidebar */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Main column */}
          <div className="min-w-0 space-y-8">
            {/* Overview */}
            <section>
              <h2 className="mb-4 text-lg font-bold text-white">
                Overview
              </h2>

              <div className="rounded-xl border border-[#232326]/60 bg-[#131316]/25 p-5 sm:p-6">
                <p className="text-sm leading-7 text-[#D4D4D8]">
                  {model.description}
                </p>

                {/* Capabilities */}
                {(tasks.length > 0 ||
                  subCategories.length > 0 ||
                  tags.length > 0) && (
                  <div className="mt-5 border-t border-[#232326]/60 pt-5">
                    <p className="mb-3 text-[10px] font-mono uppercase tracking-wider text-[#71717A]">
                      Capabilities & categories
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {tasks.map((task) => (
                        <Link
                          key={task.id}
                          href={`/tasks/${task.slug}`}
                          className="rounded-md border border-[#6E56CF]/30 bg-[#6E56CF]/10 px-2.5 py-1.5 text-[11px] font-semibold text-[#B8A8FF] transition-colors hover:border-[#6E56CF]/50 hover:text-white"
                        >
                          {task.title}
                        </Link>
                      ))}

                      {subCategories.map((category) => (
                        <span
                          key={category.id}
                          className="rounded-md border border-[#232326]/70 bg-[#18181C] px-2.5 py-1.5 text-[11px] font-medium text-[#A1A1AA]"
                        >
                          {category.name}
                        </span>
                      ))}

                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 rounded-md border border-[#232326]/70 bg-[#18181C] px-2.5 py-1.5 text-[11px] font-medium text-[#A1A1AA]"
                        >
                          <Tag size={11} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Specifications */}
            <section>
              <h2 className="mb-4 text-lg font-bold text-white">
                Specifications
              </h2>

              <div className="grid grid-cols-2 gap-x-5 gap-y-5 rounded-xl border border-[#232326]/60 bg-[#131316]/25 p-5 sm:grid-cols-4 sm:p-6">
                <Spec
                  label="Company"
                  value={companyName}
                />

                <Spec
                  label="Type"
                  value={typeLabel}
                />

                <Spec
                  label="Primary task"
                  value={model.primaryTask || "—"}
                />

                <Spec
                  label="Modality"
                  value={model.modality || "—"}
                />

                <Spec
                  label="Context window"
                  value={model.contextWindow || "—"}
                />

                <Spec
                  label="Parameters"
                  value={model.parameterSize || "—"}
                />

                <Spec
                  label="Released"
                  value={model.releaseDate || "—"}
                />

                <Spec
                  label="Open source"
                  value={
                    model.openSource === true
                      ? "Yes"
                      : model.openSource === false
                      ? "No"
                      : "—"
                  }
                />
              </div>
            </section>

            {/* Benchmarks */}
            {benchmarks.length > 0 && (
              <section>
                <div className="mb-4 flex items-center gap-2">
                  <BarChart3
                    size={17}
                    className="text-[#A1A1AA]"
                  />

                  <h2 className="text-lg font-bold text-white">
                    Benchmarks
                  </h2>
                </div>

                <div className="overflow-hidden rounded-xl border border-[#232326]/60 bg-[#131316]/25">
                  {benchmarks.map((benchmark, index) => (
                    <div
                      key={`${benchmark.name}-${index}`}
                      className="flex items-center justify-between gap-4 border-b border-[#232326]/50 px-4 py-3 last:border-b-0 sm:px-5"
                    >
                      <span className="text-[12px] font-medium text-[#A1A1AA]">
                        {benchmark.name}
                      </span>

                      <span className="font-mono text-[13px] font-semibold text-white">
                        {benchmark.score}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Related Models */}
            {related.length > 0 && (
              <section className="min-w-0">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-white">
                      Related Models
                    </h2>

                    <p className="mt-1 text-[11px] text-[#71717A]">
                      Models with similar provider, modality, or creator context.
                    </p>
                  </div>

                  <span className="shrink-0 text-sm font-normal text-[#71717A]">
                    {related.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {related.slice(0, 4).map((m) => (
                    <RelatedCard
                      key={m.id}
                      model={m}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Last updated */}
            {model.updatedAt && (
              <p className="border-t border-[#232326]/40 pt-4 text-[11px] font-mono text-[#52525B]">
                Last updated{" "}
                {new Date(model.updatedAt).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            {/* About Company */}
            <section className="rounded-xl border border-[#232326]/60 bg-[#131316]/25 p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-bold text-white">
                  About the company
                </h2>

                {model.provider?.slug && (
                  <Building2
                    size={16}
                    className="text-[#71717A]"
                  />
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#232326]/60 bg-white">
                  {model.provider?.logoUrl ? (
                    <img
                      src={model.provider.logoUrl}
                      alt=""
                      className="h-10 w-10 object-contain"
                    />
                  ) : (
                    <Building2
                      size={20}
                      className="text-neutral-700"
                    />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-white">
                    {companyName}
                  </p>

                  <p className="mt-0.5 text-[11px] text-[#71717A]">
                    Model provider
                  </p>
                </div>
              </div>

              {model.provider?.slug && (
                <Link
                  href={`/companies/${model.provider.slug}`}
                  className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#232326]/60 bg-[#18181C] px-3 py-2 text-[11px] font-semibold text-[#A1A1AA] transition-colors hover:text-white"
                >
                  View company
                  <ExternalLink size={12} />
                </Link>
              )}
            </section>

            {/* Model at a Glance */}
            <section className="rounded-xl border border-[#232326]/60 bg-[#131316]/25 p-5">
              <h2 className="mb-4 text-base font-bold text-white">
                Model at a glance
              </h2>

              <div className="space-y-3">
                <Spec
                  label="Model ID"
                  value={model.id}
                />

                <Spec
                  label="Creator"
                  value={model.creator || "—"}
                />

                <Spec
                  label="Release date"
                  value={model.releaseDate || "—"}
                />

                <Spec
                  label="Open source"
                  value={
                    model.openSource === true
                      ? "Yes"
                      : model.openSource === false
                      ? "No"
                      : "—"
                  }
                />
              </div>
            </section>

            {/* Explore More */}
            <section className="rounded-xl border border-[#232326]/60 bg-[#131316]/25 p-5">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#6E56CF]/25 bg-[#6E56CF]/10">
                  <ArrowLeft
                    size={13}
                    className="rotate-180 text-[#B8A8FF]"
                  />
                </div>

                <div>
                  <h2 className="text-base font-bold text-white">
                    Explore more
                  </h2>

                  <p className="mt-0.5 text-[10px] text-[#71717A]">
                    Continue exploring AI models.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/models"
                  className="group rounded-lg border border-[#232326]/60 bg-[#18181C]/70 p-3 transition-all hover:border-[#6E56CF]/35 hover:bg-[#6E56CF]/8"
                >
                  <p className="text-[11px] font-semibold text-white group-hover:text-[#DCD5FF]">
                    All models
                  </p>

                  <p className="mt-1 text-[9.5px] leading-4 text-[#71717A]">
                    Browse directory
                  </p>

                  <span className="mt-2 block text-[#71717A] transition-transform group-hover:translate-x-0.5 group-hover:text-[#B8A8FF]">
                    →
                  </span>
                </Link>

                <Link
                  href="/models/compare"
                  className="group rounded-lg border border-[#232326]/60 bg-[#18181C]/70 p-3 transition-all hover:border-[#6E56CF]/35 hover:bg-[#6E56CF]/8"
                >
                  <p className="text-[11px] font-semibold text-white group-hover:text-[#DCD5FF]">
                    Compare
                  </p>

                  <p className="mt-1 text-[9.5px] leading-4 text-[#71717A]">
                    Compare models
                  </p>

                  <span className="mt-2 block text-[#71717A] transition-transform group-hover:translate-x-0.5 group-hover:text-[#B8A8FF]">
                    →
                  </span>
                </Link>

                {model.provider?.slug && (
                  <Link
                    href={`/companies/${model.provider.slug}`}
                    className="group col-span-2 flex items-center justify-between rounded-lg border border-[#232326]/60 bg-[#18181C]/70 px-3.5 py-3 transition-all hover:border-[#6E56CF]/35 hover:bg-[#6E56CF]/8"
                  >
                    <div>
                      <p className="text-[11px] font-semibold text-white group-hover:text-[#DCD5FF]">
                        More from {companyName}
                      </p>

                      <p className="mt-0.5 text-[9.5px] text-[#71717A]">
                        View the provider profile
                      </p>
                    </div>

                    <span className="text-[#71717A] transition-transform group-hover:translate-x-0.5 group-hover:text-[#B8A8FF]">
                      →
                    </span>
                  </Link>
                )}
              </div>
            </section>

            {/* Model Ecosystem
                This intentionally occupies the right column next to
                Related Models, reducing the large empty area. */}
            {related.length > 0 && (
              <section className="rounded-xl border border-[#232326]/60 bg-[#131316]/25 p-5">
                <div className="mb-4">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-base font-bold text-white">
                      Model ecosystem
                    </h2>

                    <span className="rounded-md border border-[#6E56CF]/25 bg-[#6E56CF]/10 px-2 py-1 text-[9px] font-mono text-[#B8A8FF]">
                      {related.length} related
                    </span>
                  </div>

                  <p className="mt-1 text-[10px] leading-4 text-[#71717A]">
                    A quick view of what connects to this model.
                  </p>
                </div>

                <div className="grid grid-cols-2 overflow-hidden rounded-lg border border-[#232326]/60 bg-[#18181C]/45">
                  <div className="border-b border-r border-[#232326]/60 p-3">
                    <p className="text-[9px] font-mono uppercase tracking-wider text-[#52525B]">
                      Related
                    </p>

                    <p className="mt-1 text-lg font-bold text-white">
                      {related.length}
                    </p>
                  </div>

                  <div className="border-b border-[#232326]/60 p-3">
                    <p className="text-[9px] font-mono uppercase tracking-wider text-[#52525B]">
                      Tasks
                    </p>

                    <p className="mt-1 text-lg font-bold text-white">
                      {tasks.length}
                    </p>
                  </div>

                  <div className="border-r border-[#232326]/60 p-3">
                    <p className="text-[9px] font-mono uppercase tracking-wider text-[#52525B]">
                      Benchmarks
                    </p>

                    <p className="mt-1 text-lg font-bold text-white">
                      {benchmarks.length}
                    </p>
                  </div>

                  <div className="p-3">
                    <p className="text-[9px] font-mono uppercase tracking-wider text-[#52525B]">
                      Type
                    </p>

                    <p className="mt-1 truncate text-[11px] font-semibold text-white">
                      {typeLabel}
                    </p>
                  </div>
                </div>

                <div className="mt-3 rounded-lg border border-[#6E56CF]/15 bg-gradient-to-br from-[#6E56CF]/8 via-transparent to-transparent p-3.5">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-[#71717A]">
                    Current model
                  </p>

                  <p className="mt-1 truncate text-[12px] font-semibold text-white">
                    {model.name}
                  </p>

                  <p className="mt-1 text-[10px] text-[#71717A]">
                    {companyName} ·{" "}
                    {model.modality || typeLabel}
                  </p>
                </div>
              </section>
            )}

            {/* Tasks */}
            {tasks.length > 0 && (
              <section className="rounded-xl border border-[#232326]/60 bg-[#131316]/25 p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-white">
                      Tasks using this model
                    </h2>

                    <p className="mt-1 text-[10px] leading-4 text-[#71717A]">
                      Tasks this model can be used for.
                    </p>
                  </div>

                  <span className="shrink-0 text-sm font-normal text-[#71717A]">
                    {tasks.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {tasks.map((task) => (
                    <Link
                      key={task.id}
                      href={`/tasks/${task.slug}`}
                      className="group flex items-center justify-between rounded-lg border border-[#24242B] bg-[#111114] px-3.5 py-3 transition hover:border-[#34343D]"
                    >
                      <p className="min-w-0 truncate text-[11px] font-medium text-[#E8E8EC]">
                        {task.title}
                      </p>

                      <span className="ml-3 shrink-0 text-[#66666F] transition group-hover:text-white">
                        ↗
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
