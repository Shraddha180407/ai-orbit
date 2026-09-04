"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left";
import ArrowRight from "lucide-react/dist/esm/icons/arrow-right";
import Bookmark from "lucide-react/dist/esm/icons/bookmark";
import Building2 from "lucide-react/dist/esm/icons/building-2";
import Check from "lucide-react/dist/esm/icons/check";
import Cpu from "lucide-react/dist/esm/icons/cpu";
import RefreshCw from "lucide-react/dist/esm/icons/refresh-cw";
import Share2 from "lucide-react/dist/esm/icons/share-2";
import Sparkles from "lucide-react/dist/esm/icons/sparkles";
import PlayCircle from "lucide-react/dist/esm/icons/play-circle";
import Wrench from "lucide-react/dist/esm/icons/wrench";
import { toast } from "sonner";
import { fetchModelById, API_URL, getFromCache } from "@/lib/api";
import { isModelBookmarked, toggleModelBookmark } from "@/lib/model-bookmarks";
import { CategoryChip } from "@/components/CategoryChip";
import type { ModelDetail, AIModel } from "@/lib/types";

function formatModelType(value?: string | null) {
  if (!value) return "";
  return value
    .replace(/[_-]+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function cleanValue(value?: string | null) {
  const normalized = value?.trim();
  return normalized && normalized !== "—" ? normalized : "Not available";
}

function formatDate(value?: string | null) {
  if (!value) return "Not available";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

function ProviderLogo({
  src,
  name,
  size = "large",
}: {
  src?: string | null;
  name: string;
  size?: "small" | "large";
}) {
  const [failed, setFailed] = useState(false);
  const boxClass =
    size === "large"
      ? "h-16 w-16 rounded-xl sm:h-20 sm:w-20 sm:rounded-2xl"
      : "h-11 w-11 rounded-xl";
  const imageSize = size === "large" ? 64 : 36;

  return (
    <div
      className={`relative flex ${boxClass} shrink-0 items-center justify-center overflow-hidden border border-white/10 bg-white shadow-lg shadow-black/20`}
    >
      {src && !failed ? (
        <Image
          src={src}
          alt={`${name} logo`}
          width={imageSize}
          height={imageSize}
          className="h-[78%] w-[78%] object-contain"
          onError={() => setFailed(true)}
          priority={size === "large"}
          unoptimized
        />
      ) : (
        <span className={size === "large" ? "text-2xl font-black text-neutral-900" : "text-base font-black text-neutral-900"}>
          {name.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}

function SpecCard({ label, value }: { label: string; value: string }) {
  const available = value !== "Not available";
  return (
    <div className="min-w-0 rounded-xl border border-white/[0.07] bg-[#111114] p-4 transition-colors hover:border-white/[0.13]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#71717A]">{label}</p>
      <p className={`mt-2 truncate text-sm font-bold ${available ? "text-white" : "text-[#52525B]"}`} title={value}>
        {value}
      </p>
    </div>
  );
}

function SectionTitle({ title, count }: { title: string; count?: number }) {
  return (
    <div className="mb-4 flex items-center gap-2 border-b border-white/[0.07] pb-3">
      <h2 className="text-base font-bold text-white sm:text-lg">{title}</h2>
      {typeof count === "number" && (
        <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[10px] font-semibold text-[#A1A1AA]">
          {count}
        </span>
      )}
    </div>
  );
}

function RelatedCard({ model }: { model: AIModel }) {
  const company = model.provider?.name || model.creator || "Unknown provider";
  const detail = model.modality || model.type || "AI model";
  return (
    <Link
      href={`/models/${model.id}`}
      className="group relative flex min-h-44 flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#151519] to-[#0d0d10] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#6E56CF]/55 hover:shadow-[0_18px_45px_-24px_rgba(110,86,207,0.65)]"
    >
      <span className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#6E56CF]/0 blur-2xl transition-colors duration-300 group-hover:bg-[#6E56CF]/15" />
      <div className="relative flex min-w-0 items-start gap-3">
        <ProviderLogo src={model.provider?.logoUrl} name={company} size="small" />
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="truncate text-[15px] font-bold text-white">{model.name}</p>
          <p className="mt-1 truncate text-xs text-[#8B8B94]">{company}</p>
        </div>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.035] text-[#71717A] transition-all group-hover:border-[#6E56CF]/35 group-hover:bg-[#6E56CF]/10 group-hover:text-[#C4B8FF]">
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
      <p className="relative mt-4 line-clamp-2 min-h-10 text-xs leading-5 text-[#85858E]">
        {model.description || `Explore ${model.name}, an AI model created by ${company}.`}
      </p>
      <div className="relative mt-auto flex items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
        <span className="max-w-[65%] truncate rounded-md border border-white/[0.07] bg-white/[0.035] px-2 py-1 text-[10px] font-semibold text-[#A1A1AA]">
          {formatModelType(detail)}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#77717F] transition-colors group-hover:text-[#B8A7FF]">
          View model
        </span>
      </div>
    </Link>
  );
}

function LoadingState() {
  return (
    <main className="mx-auto w-full max-w-[1180px] flex-1 px-4 py-6 sm:px-6 sm:py-10">
      <div className="animate-pulse space-y-6">
        <div className="h-4 w-40 rounded bg-[#232326]" />
        <div className="rounded-2xl border border-white/[0.06] bg-[#111114] p-6">
          <div className="flex gap-5">
            <div className="h-20 w-20 rounded-2xl bg-[#232326]" />
            <div className="flex-1 space-y-3">
              <div className="h-8 w-2/5 rounded bg-[#232326]" />
              <div className="h-4 w-3/4 rounded bg-[#1b1b1f]" />
              <div className="h-4 w-1/2 rounded bg-[#1b1b1f]" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-20 rounded-xl border border-white/[0.06] bg-[#111114]" />
          ))}
        </div>
      </div>
    </main>
  );
}

function MissingState({ retry, retrying }: { retry: () => void; retrying: boolean }) {
  return (
    <main className="mx-auto flex w-full max-w-[1180px] flex-1 items-center justify-center px-4 py-16 sm:px-6">
      <div className="w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[#111114] p-7 text-center shadow-2xl shadow-black/20">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#6E56CF]/25 bg-[#6E56CF]/10">
          <Cpu size={22} className="text-[#A78BFA]" />
        </div>
        <h1 className="mt-5 text-xl font-bold text-white">Model details unavailable</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[#A1A1AA]">
          This model may have been removed, or its information could not be loaded right now.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <button
            type="button"
            onClick={retry}
            disabled={retrying}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#6E56CF] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#7C66D9] disabled:cursor-wait disabled:opacity-60"
          >
            <RefreshCw size={14} className={retrying ? "animate-spin" : ""} />
            Try again
          </button>
          <Link
            href="/models"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.03] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/[0.07]"
          >
            <ArrowLeft size={14} />
            Back to models
          </Link>
        </div>
      </div>
    </main>
  );
}

export function ModelDetailClient() {
  const params = useParams();
  const id = (params?.id || params?.slug) as string;

  const {
    data: model = null,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery<ModelDetail | null>({
    queryKey: ["model-detail", id],
    queryFn: () => fetchModelById(id),
    initialData: () => {
      if (!id) return undefined;
      return getFromCache<ModelDetail>(`${API_URL}/api/v1/models/${encodeURIComponent(id)}`) || undefined;
    },
    staleTime: 15 * 60 * 1000,
    enabled: Boolean(id),
  });

  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!model) return;
    setBookmarked(isModelBookmarked(model.id));
    document.title = `${model.name} — AI Model | AI Orbit`;
  }, [model]);

  if (isLoading && !model) return <LoadingState />;

  if ((isError || !model) && !isLoading) {
    return <MissingState retry={() => void refetch()} retrying={isFetching} />;
  }

  if (!model) return null;

  const companyName = model.provider?.name || model.creator || "Unknown provider";
  const modelType = (model as ModelDetail & { modelType?: string | null }).modelType;
  const typeLabel = formatModelType(modelType) || model.type || model.modality || "Not available";
  const tasks = (model.tasks ?? []).map((item) => item.task).filter(Boolean);
  const related = model.relatedModels ?? [];
  const tags = Array.from(new Set((model.tags ?? []).filter(Boolean)));
  const benchmarks = model.benchmarks ?? [];

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: model.name, text: model.description, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied");
      window.setTimeout(() => setCopied(false), 2000);
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
    toast.success(next ? "Saved to bookmarks" : "Removed from bookmarks");
  };

  return (
    <main className="relative flex-1 overflow-hidden bg-black">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[460px] w-[780px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6E56CF]/10 blur-[120px]" />

      <div className="relative mx-auto w-full max-w-[1180px] px-4 py-5 sm:px-6 sm:py-8 lg:py-10">
        <nav className="mb-5 flex min-w-0 items-center gap-2 text-xs text-[#71717A] sm:mb-7 sm:text-sm" aria-label="Breadcrumb">
          <Link href="/models" className="inline-flex shrink-0 items-center gap-1.5 transition-colors hover:text-white">
            <ArrowLeft size={14} />
            AI Models
          </Link>
          <span aria-hidden="true">/</span>
          <span className="truncate text-[#A1A1AA]">{model.name}</span>
        </nav>

        <header className="overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#151519] via-[#101012] to-[#0d0d10] shadow-2xl shadow-black/25">
          <div className="relative p-4 sm:p-7 lg:p-8">
            <div className="pointer-events-none absolute right-0 top-0 h-52 w-52 rounded-full bg-[#6E56CF]/10 blur-3xl" />
            <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
              <div className="flex min-w-0 items-start gap-4 sm:gap-5">
                <ProviderLogo src={model.provider?.logoUrl} name={companyName} />
                <div className="min-w-0">
                  <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-[#6E56CF]/30 bg-[#6E56CF]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#B8A7FF]">
                    <Sparkles size={11} />
                    AI model
                  </div>
                  <h1 className="break-words text-2xl font-black tracking-tight text-white sm:text-4xl">{model.name}</h1>
                  <p className="mt-2 text-sm text-[#A1A1AA]">
                    Built by{" "}
                    {model.provider?.slug ? (
                      <Link href={`/companies/${model.provider.slug}`} className="font-bold text-white hover:text-[#B8A7FF] hover:underline">
                        {companyName}
                      </Link>
                    ) : (
                      <span className="font-bold text-white">{companyName}</span>
                    )}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <CategoryChip label={typeLabel} href={`/models?modality=${encodeURIComponent(model.modality || "")}`} />
                    <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold text-[#A1A1AA]">
                      {model.openSource === true ? "Open source" : model.openSource === false ? "Closed source" : "Source status unknown"}
                    </span>
                    {model.releaseDate && (
                      <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold text-[#A1A1AA]">
                        Released {formatDate(model.releaseDate)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex w-full gap-2 lg:w-auto">
                <button
                  type="button"
                  onClick={handleBookmark}
                  aria-pressed={bookmarked}
                  className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-bold transition lg:flex-none ${
                    bookmarked
                      ? "border-[#6E56CF]/60 bg-[#6E56CF]/20 text-white"
                      : "border-white/[0.1] bg-white/[0.04] text-[#D4D4D8] hover:bg-white/[0.08] hover:text-white"
                  }`}
                >
                  <Bookmark size={15} className={bookmarked ? "fill-current" : ""} />
                  {bookmarked ? "Saved" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-[#D4D4D8] transition hover:bg-white/[0.08] hover:text-white lg:flex-none"
                >
                  {copied ? <Check size={15} /> : <Share2 size={15} />}
                  {copied ? "Copied" : "Share"}
                </button>
              </div>
            </div>

            {model.description && (
              <p className="relative mt-5 max-w-4xl text-sm leading-6 text-[#C4C4CC] sm:mt-6 sm:text-[15px] sm:leading-7">{model.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 border-t border-white/[0.07] bg-black/20 sm:grid-cols-4">
            {[
              ["Context", cleanValue(model.contextWindow)],
              ["Parameters", cleanValue(model.parameterSize)],
              ["Modality", cleanValue(model.modality)],
              ["Primary task", cleanValue(model.primaryTask)],
            ].map(([label, value], index) => (
              <div key={label} className={`p-4 sm:p-5 ${index % 2 !== 0 ? "border-l border-white/[0.07]" : ""} ${index > 1 ? "border-t border-white/[0.07] sm:border-t-0" : ""} ${index > 0 ? "sm:border-l sm:border-white/[0.07]" : ""}`}>
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#62626B]">{label}</p>
                <p className={`mt-1.5 truncate text-sm font-bold ${value === "Not available" ? "text-[#52525B]" : "text-white"}`} title={value}>
                  {value}
                </p>
              </div>
            ))}
          </div>
        </header>

        <div className="mt-7 grid gap-7 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div className="min-w-0 space-y-8">
            <section>
              <SectionTitle title="Overview" />
              <div className="rounded-xl border border-white/[0.08] bg-[#111114] p-4 sm:p-5">
                <p className="text-sm leading-7 text-[#C4C4CC]">
                  {model.description || `${model.name} is an AI model developed by ${companyName}.`}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[typeLabel, cleanValue(model.modality), model.openSource === true ? "Open source" : model.openSource === false ? "Closed source" : "Source status unknown", `Released ${formatDate(model.releaseDate)}`]
                    .filter((value, index, values) => value !== "Not available" && values.indexOf(value) === index)
                    .map((value) => (
                      <span key={value} className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold text-[#D4D4D8]">
                        {value}
                      </span>
                    ))}
                </div>
              </div>
            </section>

            <section>
              <SectionTitle title="Technical specifications" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <SpecCard label="Model type" value={typeLabel} />
                <SpecCard label="Modality" value={cleanValue(model.modality)} />
                <SpecCard label="Primary task" value={cleanValue(model.primaryTask)} />
                <SpecCard label="Context window" value={cleanValue(model.contextWindow)} />
                <SpecCard label="Parameter size" value={cleanValue(model.parameterSize)} />
                <SpecCard label="Release date" value={formatDate(model.releaseDate)} />
              </div>
            </section>

            {benchmarks.length > 0 && (
              <section>
                <SectionTitle title="Benchmarks" count={benchmarks.length} />
                <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#0d0d10]">
                  <div className="grid grid-cols-[minmax(0,1fr)_120px] border-b border-white/[0.07] bg-white/[0.025] px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.13em] text-[#71717A]">
                    <span>Benchmark</span>
                    <span className="text-right">Score</span>
                  </div>
                  <div className="divide-y divide-white/[0.06]">
                    {benchmarks.map((benchmark, index) => (
                      <div key={`${benchmark.name}-${index}`} className="grid grid-cols-[minmax(0,1fr)_120px] px-4 py-3 text-sm">
                        <span className="truncate font-medium text-[#D4D4D8]">{benchmark.name}</span>
                        <span className="text-right font-mono font-bold text-white">{String(benchmark.score)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {(tags.length > 0 || tasks.length > 0) && (
              <section>
                <SectionTitle title="Capabilities and tasks" count={tags.length + tasks.length} />
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="rounded-lg border border-[#6E56CF]/25 bg-[#6E56CF]/10 px-3 py-1.5 text-xs font-semibold text-[#C4B8FF]">
                      {tag}
                    </span>
                  ))}
                  {tasks.map((task) => (
                    <Link key={task.id} href={`/tasks/${task.slug}`} className="rounded-lg border border-white/[0.09] bg-white/[0.035] px-3 py-1.5 text-xs font-semibold text-[#D4D4D8] transition hover:border-[#6E56CF]/40 hover:text-white">
                      {task.title}
                    </Link>
                  ))}
                </div>
              </section>
            )}

          </div>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <section className="rounded-xl border border-white/[0.08] bg-[#111114] p-5">
              <div className="flex items-center gap-2">
                <Cpu size={16} className="text-[#A78BFA]" />
                <h2 className="text-sm font-bold text-white">Model information</h2>
              </div>
              <dl className="mt-4 divide-y divide-white/[0.06]">
                {[
                  ["Provider", companyName],
                  ["Type", typeLabel],
                  ["Released", formatDate(model.releaseDate)],
                  ["Open source", model.openSource === true ? "Yes" : model.openSource === false ? "No" : "Not available"],
                  ["Last updated", model.updatedAt ? formatDate(model.updatedAt) : "Not available"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
                    <dt className="text-xs text-[#71717A]">{label}</dt>
                    <dd className="max-w-[60%] text-right text-xs font-semibold text-[#D4D4D8]">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="rounded-xl border border-white/[0.08] bg-[#111114] p-5">
              <div className="flex items-center gap-3">
                <ProviderLogo src={model.provider?.logoUrl} name={companyName} size="small" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-white">{companyName}</p>
                  <p className="mt-0.5 text-xs text-[#71717A]">Model provider</p>
                </div>
              </div>
              {model.provider?.slug ? (
                <Link href={`/companies/${model.provider.slug}`} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/[0.09] bg-white/[0.035] px-3 py-2 text-xs font-bold text-[#D4D4D8] transition hover:border-[#6E56CF]/40 hover:text-white">
                  View company
                  <ArrowRight size={13} />
                </Link>
              ) : (
                <div className="mt-4 flex items-center gap-2 rounded-lg border border-white/[0.06] bg-black/20 px-3 py-2 text-xs text-[#62626B]">
                  <Building2 size={13} />
                  Company profile unavailable
                </div>
              )}
            </section>
          </aside>
        </div>

        <div className="mt-9 space-y-10 border-t border-white/[0.06] pt-9">
          <section>
            <SectionTitle title="Model ecosystem" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                href={`/tools?q=${encodeURIComponent(model.name)}`}
                className="group relative flex min-h-40 overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#17171c] via-[#121216] to-[#0d0d10] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#6E56CF]/50 hover:shadow-[0_18px_50px_-30px_rgba(110,86,207,0.75)] sm:p-6"
              >
                <span className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full bg-[#6E56CF]/10 blur-3xl transition-colors group-hover:bg-[#6E56CF]/20" />
                <span className="relative flex min-w-0 flex-1 flex-col">
                  <span className="flex items-start justify-between gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#6E56CF]/30 bg-[#6E56CF]/12 text-[#B8A7FF] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                      <Wrench size={20} />
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.035] text-[#71717A] transition-all group-hover:border-[#6E56CF]/35 group-hover:bg-[#6E56CF]/10 group-hover:text-[#C4B8FF]">
                      <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </span>
                  <span className="mt-5 block text-base font-bold text-white sm:text-lg">Tools using {model.name}</span>
                  <span className="mt-1.5 block max-w-md text-xs leading-5 text-[#85858E] sm:text-sm">
                    Discover products, applications and workflows powered by this model.
                  </span>
                </span>
              </Link>
              <Link
                href={`/videos?q=${encodeURIComponent(model.name)}`}
                className="group relative flex min-h-40 overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#17171c] via-[#121216] to-[#0d0d10] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#6E56CF]/50 hover:shadow-[0_18px_50px_-30px_rgba(110,86,207,0.75)] sm:p-6"
              >
                <span className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full bg-[#6E56CF]/10 blur-3xl transition-colors group-hover:bg-[#6E56CF]/20" />
                <span className="relative flex min-w-0 flex-1 flex-col">
                  <span className="flex items-start justify-between gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#6E56CF]/30 bg-[#6E56CF]/12 text-[#B8A7FF] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                      <PlayCircle size={21} />
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.035] text-[#71717A] transition-all group-hover:border-[#6E56CF]/35 group-hover:bg-[#6E56CF]/10 group-hover:text-[#C4B8FF]">
                      <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </span>
                  <span className="mt-5 block text-base font-bold text-white sm:text-lg">Videos and demos</span>
                  <span className="mt-1.5 block max-w-md text-xs leading-5 text-[#85858E] sm:text-sm">
                    Watch explainers, launch highlights and real-world demonstrations of {model.name}.
                  </span>
                </span>
              </Link>
            </div>
          </section>

          {related.length > 0 && (
            <section>
              <SectionTitle title={`More models from ${companyName}`} count={related.length} />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((relatedModel) => (
                  <RelatedCard key={relatedModel.id} model={relatedModel} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
