"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left";
import Share2 from "lucide-react/dist/esm/icons/share-2";
import Bookmark from "lucide-react/dist/esm/icons/bookmark";
import Check from "lucide-react/dist/esm/icons/check";
import Building2 from "lucide-react/dist/esm/icons/building-2";
import { toast } from "sonner";
import { fetchModelById } from "@/lib/api";
import { isModelBookmarked, toggleModelBookmark } from "@/lib/model-bookmarks";
import { CategoryChip } from "@/components/CategoryChip";
import type { ModelDetail, AIModel } from "@/lib/types";

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9.5px] font-mono uppercase tracking-wider text-[#71717A]">{label}</p>
      <p className="mt-1 truncate text-[13px] font-semibold text-white">{value}</p>
    </div>
  );
}

function RelatedCard({ model }: { model: AIModel }) {
  const company = model.provider?.name || model.creator;
  return (
    <Link
      href={`/models/${model.id}`}
      className="block rounded-lg border border-[#232326]/60 bg-[#131316]/40 p-3 transition-colors hover:bg-[#18181C]/60"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#232326]/60 bg-white text-sm font-bold text-neutral-900">
          {model.provider?.logoUrl ? (
            <Image
              src={model.provider.logoUrl}
              alt=""
              width={36}
              height={36}
              className="h-8 w-8 object-contain"
            />
          ) : (
            model.name.charAt(0)
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold text-white">{model.name}</p>
          <p className="mt-0.5 truncate text-[11px] text-[#A1A1AA]">{company}</p>
          <p className="mt-1 line-clamp-2 text-[11px] text-[#71717A] leading-snug">
            {model.description}
          </p>
        </div>
      </div>
    </Link>
  );
}

export function ModelDetailClient() {
  const params = useParams();
  const id = (params?.id || params?.slug) as string;

  const [model, setModel] = useState<ModelDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    setLoadError(null);
    setModel(null);

    fetchModelById(id)
      .then((data) => {
        if (!active) return;
        if (data) {
          setModel(data);
          setBookmarked(isModelBookmarked(data.id));
          document.title = `${data.name} — AI Model | AI Orbit`;
        } else {
          setModel(null);
        }
      })
      .catch((err: unknown) => {
        if (!active) return;
        setModel(null);
        setLoadError(
          err instanceof Error ? err.message : "Failed to load model",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="mx-auto max-w-[1100px] px-4 py-6 md:px-6 md:py-10 flex-1 w-full">
        <div className="animate-pulse space-y-6">
          <div className="h-4 w-32 rounded bg-[#232326]" />
          <div className="h-40 rounded-xl border border-[#232326]/60 bg-[#131316]/40" />
          <div className="h-48 rounded-xl border border-[#232326]/60 bg-[#131316]/40" />
        </div>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="mx-auto max-w-[1100px] px-4 py-6 md:px-6 md:py-10 flex-1 w-full">
        <Link
          href="/models"
          className="inline-flex items-center gap-1.5 text-sm text-[#71717A] hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          AI Models
        </Link>
        <div className="mt-8 rounded-xl border border-[#232326]/60 bg-[#131316]/40 p-6 text-center">
          <p className="text-sm font-semibold text-white">Couldn’t load this model</p>
          <p className="mt-2 text-xs text-[#A1A1AA]">{loadError}</p>
          <p className="mt-1 text-[11px] text-[#71717A]">
            Check that the API is running and NEXT_PUBLIC_API_URL points at it.
          </p>
          <Link
            href="/models"
            className="mt-4 inline-flex rounded-lg border border-[#232326]/60 bg-[#18181C] px-4 py-2 text-sm font-semibold text-white hover:border-neutral-500 transition-colors"
          >
            Back to models
          </Link>
        </div>
      </main>
    );
  }

  if (!model) {
    notFound();
    return null;
  }

  const companyName = model.provider?.name || model.creator;
  const typeLabel = model.type || model.modality || "—";
  const tasks = (model.tasks ?? []).map((t) => t.task).filter(Boolean);
  const related = model.relatedModels ?? [];

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: model.name, text: model.description, url });
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
    toast.success(next ? "Saved to bookmarks" : "Removed from bookmarks");
  };

  return (
    <main className="mx-auto max-w-[1100px] px-4 py-6 md:px-6 md:py-10 flex-1 w-full relative overflow-hidden">
      <div className="pointer-events-none absolute top-0 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#6E56CF]/5 rounded-full blur-3xl z-0" />

      <nav className="mb-4 md:mb-6 text-sm text-[#71717A] relative z-10">
        <Link href="/models" className="hover:text-white transition-colors inline-flex items-center gap-1.5">
          <ArrowLeft size={14} />
          AI Models
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[#A1A1AA]">{model.name}</span>
      </nav>

      {/* Header */}
      <header className="relative z-10 flex flex-col gap-6 rounded-xl border border-[#232326]/80 bg-[#131316]/40 p-4 md:p-6 backdrop-blur-md sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4 items-start">
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#232326]/60 bg-white/95 p-2.5">
            {model.provider?.logoUrl ? (
              <Image
                src={model.provider.logoUrl}
                alt={`${companyName} logo`}
                width={80}
                height={80}
                className="h-full w-full object-contain"
                priority
              />
            ) : (
              <span className="text-2xl font-bold text-neutral-900 select-none">
                {model.name.charAt(0)}
              </span>
            )}
          </div>

          <div className="space-y-2 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {model.name}
            </h1>
            <p className="text-xs text-[#A1A1AA]">
              by{" "}
              {model.provider?.slug ? (
                <Link
                  href={`/companies/${model.provider.slug}`}
                  className="text-white font-semibold hover:underline"
                >
                  {companyName}
                </Link>
              ) : (
                <span className="text-white font-semibold">{companyName}</span>
              )}
            </p>
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <CategoryChip label={typeLabel} href={`/models?modality=${encodeURIComponent(model.modality)}`} />
              {model.releaseDate && (
                <span className="rounded-md border border-[#232326]/60 bg-[#18181C] px-2 py-0.5 text-[10px] font-mono text-[#A1A1AA]">
                  {model.releaseDate}
                </span>
              )}
              {model.openSource === true && (
                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-emerald-400">
                  OPEN SOURCE
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleBookmark}
            className={`inline-flex w-full sm:w-auto justify-center items-center gap-1.5 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors ${
              bookmarked
                ? "border-[#6E56CF]/50 bg-[#6E56CF]/15 text-white"
                : "border-[#232326]/60 bg-[#18181C] text-[#A1A1AA] hover:text-white"
            }`}
          >
            <Bookmark size={15} className={bookmarked ? "fill-current" : ""} />
            {bookmarked ? "Saved" : "Save"}
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex w-full sm:w-auto justify-center items-center gap-1.5 rounded-lg border border-[#232326]/60 bg-[#18181C] px-4 py-2.5 text-sm font-semibold text-[#A1A1AA] hover:text-white transition-colors"
          >
            {copied ? <Check size={15} /> : <Share2 size={15} />}
            {copied ? "Copied" : "Share"}
          </button>
        </div>
      </header>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row relative z-10">
        <div className="flex-1 min-w-0 space-y-8">
          {/* Overview */}
          <section>
            <h2 className="text-lg font-bold text-white border-b border-[#232326]/40 pb-2 mb-4">
              Overview
            </h2>
            <p className="text-sm leading-relaxed text-[#D4D4D8]">{model.description}</p>
          </section>

          {/* Specs */}
          <section>
            <h2 className="text-lg font-bold text-white border-b border-[#232326]/40 pb-2 mb-4">
              Specifications
            </h2>
            <div className="grid grid-cols-2 gap-4 rounded-xl border border-[#232326]/60 bg-[#131316]/30 p-5 sm:grid-cols-4">
              <Spec label="Company" value={companyName} />
              <Spec label="Type" value={typeLabel} />
              <Spec label="Primary Task" value={model.primaryTask || "—"} />
              <Spec label="Modality" value={model.modality || "—"} />
              <Spec label="Context Window" value={model.contextWindow || "—"} />
              <Spec label="Parameters" value={model.parameterSize || "—"} />
              <Spec label="Released" value={model.releaseDate || "—"} />
              <Spec
                label="Open Source"
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

          {/* Company card */}
          <section>
            <h2 className="text-lg font-bold text-white border-b border-[#232326]/40 pb-2 mb-4">
              Company
            </h2>
            <div className="flex items-center gap-4 rounded-xl border border-[#232326]/60 bg-[#131316]/30 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#232326]/60 bg-white">
                {model.provider?.logoUrl ? (
                  <Image
                    src={model.provider.logoUrl}
                    alt=""
                    width={48}
                    height={48}
                    className="h-10 w-10 object-contain"
                  />
                ) : (
                  <Building2 size={20} className="text-neutral-700" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-white">{companyName}</p>
                <p className="text-[11px] text-[#71717A] mt-0.5">Model provider</p>
              </div>
              {model.provider?.slug && (
                <Link
                  href={`/companies/${model.provider.slug}`}
                  className="shrink-0 text-[12px] font-semibold text-[#A1A1AA] hover:text-white transition-colors"
                >
                  View company →
                </Link>
              )}
            </div>
          </section>

          {/* Tasks */}
          {tasks.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-white border-b border-[#232326]/40 pb-2 mb-4">
                Tasks using this model{" "}
                <span className="text-sm font-normal text-[#71717A]">({tasks.length})</span>
              </h2>
              <div className="flex flex-col divide-y divide-[#232326]/60 rounded-xl border border-[#232326]/60 bg-[#131316]/10 overflow-hidden">
                {tasks.map((task) => (
                  <Link
                    key={task.id}
                    href={`/tasks/${task.slug}`}
                    className="px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#18181C]/40"
                  >
                    {task.title}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {model.updatedAt && (
            <p className="text-[11px] font-mono text-[#52525B]">
              Last updated {new Date(model.updatedAt).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Related sidebar */}
        {related.length > 0 && (
          <aside className="w-full shrink-0 lg:w-80 space-y-4">
            <h2 className="text-lg font-bold text-white border-b border-[#232326]/40 pb-2">
              Related models
            </h2>
            <div className="flex flex-col gap-3">
              {related.map((m) => (
                <RelatedCard key={m.id} model={m} />
              ))}
            </div>
          </aside>
        )}
      </div>
    </main>
  );
}
