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
import ExternalLink from "lucide-react/dist/esm/icons/external-link";
import RefreshCw from "lucide-react/dist/esm/icons/refresh-cw";
import Share2 from "lucide-react/dist/esm/icons/share-2";
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

function resolveProviderLogo(src: string | null | undefined, name: string) {
  if (name.trim().toLowerCase().includes("openai")) return "/logos/openai.svg";
  return src;
}

function getDetailedDescription(model: ModelDetail, companyName: string) {
  const normalizedName = model.name.trim().toLowerCase();
  if (normalizedName === "o1" || normalizedName === "openai o1") {
    return "OpenAI o1 is an advanced reasoning model designed to spend more time analysing complex problems before responding. It is built for demanding work such as mathematics, scientific reasoning, coding and multi-step problem solving, where careful planning and accuracy matter more than an instant answer.";
  }

  return (
    model.description ||
    `${model.name} is developed by ${companyName} for ${model.primaryTask || model.modality || "advanced tasks"}.`
  );
}

function getRelatedDescription(model: AIModel) {
  const name = model.name.trim().toLowerCase();
  const descriptions: Record<string, string> = {
    "gpt-4": "A capable multimodal model for complex reasoning, content creation, document analysis and conversations that combine text with visual understanding.",
    "gpt-4o": "OpenAI's fast omni model for reasoning across text, audio and vision, designed for natural real-time interactions and multimodal applications.",
    "whisper v3": "A multilingual speech-recognition model built for accurate transcription, translation and audio understanding across accents and noisy environments.",
    "text-embedding-3-large": "OpenAI's most capable embedding model for semantic search, retrieval-augmented generation, clustering and high-quality vector representations.",
    sora: "A text-to-video generation model for producing detailed, coherent scenes with realistic motion, multiple characters and complex visual direction.",
    "dall-e 3": "An advanced text-to-image model that follows nuanced prompts to create detailed illustrations, artwork and realistic visual concepts.",
  };

  return descriptions[name] || model.description || `${model.name} is a ${model.modality || "general-purpose"} model from ${model.provider?.name || model.creator || "its provider"}.`;
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
  const resolvedSrc = resolveProviderLogo(src, name);
  const boxClass =
    size === "large"
      ? "h-16 w-16 rounded-xl sm:h-20 sm:w-20 sm:rounded-2xl"
      : "h-11 w-11 rounded-xl";
  const imageSize = size === "large" ? 64 : 36;

  return (
    <div
      className={`relative flex ${boxClass} shrink-0 items-center justify-center overflow-hidden border border-white/10 bg-white shadow-lg shadow-black/20`}
    >
      {resolvedSrc && !failed ? (
        <Image
          src={resolvedSrc}
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
    <div className="min-w-0 rounded-lg border border-white/[0.07] bg-[#111114] p-3 transition-colors hover:border-white/[0.13]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#71717A]">{label}</p>
      <p className={`mt-1.5 truncate text-sm font-bold ${available ? "text-white" : "text-[#52525B]"}`} title={value}>
        {value}
      </p>
    </div>
  );
}

function SectionTitle({ title, count }: { title: string; count?: number }) {
  return (
    <div className="mb-2.5 flex items-center gap-2 border-b border-white/[0.07] pb-2">
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
  const detail = model.modality || model.type || "General";
  return (
    <Link
      href={`/models/${model.id}`}
      className="group relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#111114] p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#6E56CF]/50 hover:bg-[#141419]"
    >
      <span className="absolute inset-y-0 left-0 w-0.5 bg-[#6E56CF] opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative flex items-center gap-3">
        <ProviderLogo src={model.provider?.logoUrl} name={company} size="small" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-white">{model.name}</p>
          <div className="mt-1 flex min-w-0 items-center gap-2 text-[11px] text-[#8B8B94]">
            <span className="truncate">{company}</span>
            <span className="h-1 w-1 shrink-0 rounded-full bg-[#3F3F46]" />
            <span className="truncate text-[#A78BFA]">{formatModelType(detail)}</span>
          </div>
        </div>
        <ArrowRight size={14} className="shrink-0 text-[#52525B] transition-all group-hover:translate-x-0.5 group-hover:text-[#B8A7FF]" />
      </div>
      <p className="relative mt-2.5 line-clamp-3 text-xs leading-5 text-[#7F7F89]">{getRelatedDescription(model)}</p>
    </Link>
  );
}

function ModelEcosystem({ modelName }: { modelName: string }) {
  return (
    <section>
      <SectionTitle title="Model ecosystem" />
      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href={`/tools?q=${encodeURIComponent(modelName)}`}
          className="group relative flex items-center gap-3 overflow-hidden rounded-xl border border-white/[0.08] bg-[#111114] p-3 transition-all duration-300 hover:border-[#6E56CF]/50 hover:bg-[#141419]"
        >
          <span className="absolute inset-y-0 left-0 w-0.5 bg-[#6E56CF] opacity-0 transition-opacity group-hover:opacity-100" />
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#6E56CF]/30 bg-[#6E56CF]/10 text-[#B8A7FF]">
            <Wrench size={18} />
          </span>
          <span className="relative min-w-0 flex-1">
            <span className="block text-sm font-bold text-white">Tools using {modelName}</span>
            <span className="mt-0.5 block truncate text-[11px] text-[#7F7F89]">Products and workflows powered by this model</span>
          </span>
          <ArrowRight size={14} className="relative shrink-0 text-[#52525B] transition-all group-hover:translate-x-0.5 group-hover:text-[#B8A7FF]" />
        </Link>
        <Link
          href={`/videos?q=${encodeURIComponent(modelName)}`}
          className="group relative flex items-center gap-3 overflow-hidden rounded-xl border border-white/[0.08] bg-[#111114] p-3 transition-all duration-300 hover:border-[#6E56CF]/50 hover:bg-[#141419]"
        >
          <span className="absolute inset-y-0 left-0 w-0.5 bg-[#6E56CF] opacity-0 transition-opacity group-hover:opacity-100" />
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#6E56CF]/30 bg-[#6E56CF]/10 text-[#B8A7FF]">
            <PlayCircle size={19} />
          </span>
          <span className="relative min-w-0 flex-1">
            <span className="block text-sm font-bold text-white">Videos and demos</span>
            <span className="mt-0.5 block truncate text-[11px] text-[#7F7F89]">Explainers, launch highlights and demonstrations</span>
          </span>
          <ArrowRight size={14} className="relative shrink-0 text-[#52525B] transition-all group-hover:translate-x-0.5 group-hover:text-[#B8A7FF]" />
        </Link>
      </div>
    </section>
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
  const detailedDescription = getDetailedDescription(model, companyName);
  const heroCapabilities = (tags.length > 0 ? tags : ["Reasoning", "Mathematics", "Coding", "Science"]).slice(0, 4);
  const storedWebsiteUrl = (model as ModelDetail & { websiteUrl?: string | null }).websiteUrl?.trim();
  const modelWebsiteUrl =
    storedWebsiteUrl ||
    (["o1", "openai o1"].includes(model.name.trim().toLowerCase()) ? "https://openai.com/o1/" : null);

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

      <div className="relative mx-auto w-full max-w-[1180px] px-4 py-4 sm:px-6 sm:py-6 lg:py-7">
        <nav className="mb-4 flex min-w-0 items-center gap-2 text-xs text-[#71717A] sm:mb-5 sm:text-sm" aria-label="Breadcrumb">
          <Link href="/models" className="inline-flex shrink-0 items-center gap-1.5 transition-colors hover:text-white">
            <ArrowLeft size={14} />
            AI Models
          </Link>
          <span aria-hidden="true">/</span>
          <span className="truncate text-[#A1A1AA]">{model.name}</span>
        </nav>

        <header className="overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#151519] via-[#101012] to-[#0d0d10] shadow-2xl shadow-black/25">
          <div className="relative p-4 sm:p-5">
            <div className="pointer-events-none absolute right-0 top-0 h-52 w-52 rounded-full bg-[#6E56CF]/10 blur-3xl" />
            <div className="relative grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4 lg:grid-cols-[80px_minmax(0,1fr)_330px] lg:gap-5">
              <ProviderLogo src={model.provider?.logoUrl} name={companyName} />

              <div className="min-w-0 pt-0.5 lg:grid lg:grid-cols-[170px_minmax(0,1fr)] lg:gap-5">
                <div className="min-w-0">
                  <h1 className="break-words text-3xl font-black tracking-tight text-white sm:text-4xl">{model.name}</h1>
                  <p className="mt-1.5 text-sm text-[#A1A1AA]">
                    Built by{" "}
                    {model.provider?.slug ? (
                      <Link href={`/companies/${model.provider.slug}`} className="font-bold text-white hover:text-[#B8A7FF] hover:underline">
                        {companyName}
                      </Link>
                    ) : (
                      <span className="font-bold text-white">{companyName}</span>
                    )}
                  </p>
                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    <CategoryChip label={typeLabel} href={`/models?modality=${encodeURIComponent(model.modality || "")}`} />
                    <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold text-[#A1A1AA]">
                      {model.openSource === true ? "Open source" : model.openSource === false ? "Closed source" : "Source status unknown"}
                    </span>
                    {modelWebsiteUrl && (
                      <a
                        href={modelWebsiteUrl}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        title={modelWebsiteUrl}
                        className="inline-flex max-w-full items-center gap-1 rounded-full border border-[#6E56CF]/35 bg-[#6E56CF]/10 px-2.5 py-1 text-[10px] font-semibold text-[#B8A7FF] transition hover:border-[#6E56CF]/60 hover:bg-[#6E56CF]/20 hover:text-white"
                      >
                        <span>Visit model</span>
                        <ExternalLink size={11} className="shrink-0" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="mt-3 min-w-0 lg:mt-0">
                  <p className="text-sm leading-6 text-[#C4C4CC] sm:text-[15px] sm:leading-7">
                    {detailedDescription}
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5" aria-label="Model capabilities">
                    {heroCapabilities.map((capability) => (
                      <span
                        key={capability}
                        className="rounded-md border border-[#6E56CF]/25 bg-[#6E56CF]/[0.08] px-2 py-1 text-[10px] font-semibold text-[#B8A7FF]"
                      >
                        {capability}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-span-2 rounded-xl border border-white/[0.07] bg-black/20 p-3 lg:col-span-1">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleBookmark}
                    aria-pressed={bookmarked}
                    className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold transition ${
                      bookmarked
                        ? "border-[#6E56CF]/60 bg-[#6E56CF]/20 text-white"
                        : "border-white/[0.1] bg-white/[0.04] text-[#D4D4D8] hover:bg-white/[0.08] hover:text-white"
                    }`}
                  >
                    <Bookmark size={14} className={bookmarked ? "fill-current" : ""} />
                    {bookmarked ? "Saved" : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={handleShare}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 py-2 text-xs font-bold text-[#D4D4D8] transition hover:bg-white/[0.08] hover:text-white"
                  >
                    {copied ? <Check size={14} /> : <Share2 size={14} />}
                    {copied ? "Copied" : "Share"}
                  </button>
                </div>
                <dl className="mt-2.5 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/[0.07] bg-white/[0.07]">
                  {[
                    ["Released", formatDate(model.releaseDate)],
                    ["Context", cleanValue(model.contextWindow)],
                    ["Modality", cleanValue(model.modality)],
                    ["Provider", companyName],
                  ].map(([label, value]) => (
                    <div key={label} className="min-w-0 bg-[#101013] p-2.5">
                      <dt className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#62626B]">{label}</dt>
                      <dd className={`mt-1 truncate text-xs font-bold ${value === "Not available" ? "text-[#52525B]" : "text-white"}`} title={value}>
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </header>

        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
          <div className="min-w-0 space-y-4">
            <section>
              <SectionTitle title="Technical specifications" />
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
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

            <ModelEcosystem modelName={model.name} />

            {related.length > 0 && (
              <section>
                <SectionTitle title="Related models" count={related.length} />
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {related.map((relatedModel) => (
                    <RelatedCard key={relatedModel.id} model={relatedModel} />
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-2.5 lg:sticky lg:top-24">
            <section className="rounded-xl border border-white/[0.08] bg-[#111114] p-4">
              <div className="flex items-center gap-2">
                <Cpu size={16} className="text-[#A78BFA]" />
                <h2 className="text-sm font-bold text-white">Model information</h2>
              </div>
              <dl className="mt-3 divide-y divide-white/[0.06]">
                {[
                  ["Provider", companyName],
                  ["Type", typeLabel],
                  ["Released", formatDate(model.releaseDate)],
                  ["Open source", model.openSource === true ? "Yes" : model.openSource === false ? "No" : "Not available"],
                  ["Last updated", model.updatedAt ? formatDate(model.updatedAt) : "Not available"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
                    <dt className="text-xs text-[#71717A]">{label}</dt>
                    <dd className="max-w-[60%] text-right text-xs font-semibold text-[#D4D4D8]">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="rounded-xl border border-white/[0.08] bg-[#111114] p-4">
              <div className="flex items-center gap-3">
                <ProviderLogo src={model.provider?.logoUrl} name={companyName} size="small" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-white">{companyName}</p>
                  <p className="mt-0.5 text-xs text-[#71717A]">Model provider</p>
                </div>
              </div>
              {model.provider?.slug ? (
                <Link href={`/companies/${model.provider.slug}`} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/[0.09] bg-white/[0.035] px-3 py-2 text-xs font-bold text-[#D4D4D8] transition hover:border-[#6E56CF]/40 hover:text-white">
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

      </div>
    </main>
  );
}
