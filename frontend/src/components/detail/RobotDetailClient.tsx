"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";

import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left";
import Bot from "lucide-react/dist/esm/icons/bot";
import Building2 from "lucide-react/dist/esm/icons/building-2";
import Calendar from "lucide-react/dist/esm/icons/calendar";
import ChevronLeft from "lucide-react/dist/esm/icons/chevron-left";
import ChevronRight from "lucide-react/dist/esm/icons/chevron-right";
import Play from "lucide-react/dist/esm/icons/play";
import Share2 from "lucide-react/dist/esm/icons/share-2";
import Check from "lucide-react/dist/esm/icons/check";
import Cpu from "lucide-react/dist/esm/icons/cpu";
import DollarSign from "lucide-react/dist/esm/icons/dollar-sign";
import Zap from "lucide-react/dist/esm/icons/zap";
import ShieldCheck from "lucide-react/dist/esm/icons/shield-check";
import ArrowUpRight from "lucide-react/dist/esm/icons/arrow-up-right";
import Activity from "lucide-react/dist/esm/icons/activity";
import Box from "lucide-react/dist/esm/icons/box";

import { Robot } from "@/lib/types";
import { fetchRobotById, fetchAllRobots, API_URL, getFromCache } from "@/lib/api";

interface RobotDetailClientProps {
  id: string;
}

function isYouTubeUrl(url: string): boolean {
  return /youtube\.com|youtu\.be/.test(url);
}

function toYouTubeEmbed(url: string): string {
  return url
    .replace("youtu.be/", "www.youtube.com/embed/")
    .replace("watch?v=", "embed/")
    .replace(/[?&]si=[^&]+/, "");
}

function isImageUrl(url: string): boolean {
  return /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(url);
}

function getAvailabilityStyle(status: string) {
  const s = (status || "").toLowerCase();
  if (s.includes("available") || s.includes("commercial")) {
    return {
      dot: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]",
      badge: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    };
  }
  if (s.includes("production") || s.includes("pilot")) {
    return {
      dot: "bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]",
      badge: "border-sky-500/30 bg-sky-500/10 text-sky-300",
    };
  }
  if (s.includes("development") || s.includes("prototype")) {
    return {
      dot: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]",
      badge: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    };
  }
  return {
    dot: "bg-zinc-500",
    badge: "border-zinc-700 bg-zinc-800/60 text-zinc-300",
  };
}

export function RobotDetailClient({ id }: RobotDetailClientProps) {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeMediaIdx, setActiveMediaIdx] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: robot = null, isLoading } = useQuery<Robot | null>({
    queryKey: ["robot-detail", id],
    queryFn: () => fetchRobotById(id),
    initialData: () => {
      if (!id) return undefined;
      return getFromCache<Robot>(`${API_URL}/api/v1/robots/${encodeURIComponent(id)}`) || undefined;
    },
    staleTime: 15 * 60 * 1000,
    enabled: Boolean(id),
  });

  const { data: allRobots = [] } = useQuery<Robot[]>({
    queryKey: ["robots-all"],
    queryFn: fetchAllRobots,
    staleTime: 15 * 60 * 1000,
    enabled: Boolean(robot),
  });

  const similarRobots = robot
    ? allRobots.filter((r) => r.id !== robot.id && r.category === robot.category).slice(0, 4)
    : [];

  const handleShare = async () => {
    if (!robot) return;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: robot.name, text: robot.about || "", url: window.location.href });
        return;
      } catch {}
    }
    if (navigator?.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!mounted || (isLoading && !robot)) {
    return (
      <div className="w-full max-w-[1280px] mx-auto px-4 py-4 space-y-4 animate-pulse">
        <div className="h-3 w-28 rounded bg-white/5" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-6 h-[380px] rounded-xl bg-white/[0.02] border border-white/5" />
          <div className="lg:col-span-6 space-y-3">
            <div className="h-8 w-3/4 rounded-lg bg-white/[0.03]" />
            <div className="h-4 w-1/2 rounded bg-white/[0.02]" />
            <div className="h-44 rounded-xl bg-white/[0.02]" />
          </div>
        </div>
      </div>
    );
  }

  if (!robot) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-16 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.02]">
          <Bot size={24} className="text-zinc-500" />
        </div>
        <h1 className="text-lg font-bold text-white tracking-tight">Robot Not Found</h1>
        <p className="mt-1 text-xs text-zinc-400">
          The requested system profile cannot be found or is unavailable.
        </p>
        <Link
          href="/robots"
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-white/10 transition"
        >
          <ArrowLeft size={13} /> Return to Directory
        </Link>
      </div>
    );
  }

  const videoUrls = (robot.mediaUrls || []).filter(isYouTubeUrl);
  const imageUrls = [
    robot.thumbnailUrl,
    ...(robot.mediaUrls || []).filter(isImageUrl),
    ...(robot.thumbnailUrl ? [] : robot.logoUrl ? [robot.logoUrl] : []),
  ].filter(Boolean) as string[];

  const mediaItems: Array<{ type: "video" | "image"; src: string }> = [
    ...videoUrls.map((src) => ({ type: "video" as const, src })),
    ...imageUrls.map((src) => ({ type: "image" as const, src })),
  ];
  const hasRealMedia = mediaItems.length > 0;
  const activeMedia = hasRealMedia ? mediaItems[activeMediaIdx] : null;

  let specEntries: { key: string; val: string }[] = [];
  if (robot.specs) {
    const raw = robot.specs.split(/[;\n]/).map((s) => s.trim()).filter(Boolean);
    specEntries = raw
      .map((line) => {
        const idx = line.indexOf(":");
        if (idx > 0) return { key: line.slice(0, idx).trim(), val: line.slice(idx + 1).trim() };
        return null;
      })
      .filter(Boolean) as { key: string; val: string }[];
  }

  const avail = getAvailabilityStyle(robot.availability || "");

  return (
    <div className="w-full bg-[#050608] text-zinc-100 flex flex-col justify-start">
      <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 pt-3 pb-8 space-y-4">
        
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
          <Link href="/" className="hover:text-zinc-300 transition-colors">Orbit</Link>
          <span>/</span>
          <Link href="/robots" className="hover:text-zinc-300 transition-colors">Robots</Link>
          <span>/</span>
          <span className="text-zinc-300 font-semibold">{robot.name}</span>
        </nav>

        {/* SECTION 1: HERO (MEDIA + TELEMETRY) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          
          {/* LEFT: Visual Hardware Stage */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-2">
            <div className="relative w-full h-[320px] sm:h-[360px] rounded-2xl overflow-hidden border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent flex items-center justify-center group shadow-2xl backdrop-blur-xl">
              {!hasRealMedia ? (
                <div className="flex flex-col items-center justify-center gap-2 text-center p-3 z-10">
                  <Bot size={24} className="text-zinc-600" />
                  <p className="text-xs font-semibold text-zinc-300">{robot.name}</p>
                  <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">No Media</p>
                </div>
              ) : activeMedia!.type === "video" ? (
                <iframe
                  src={toYouTubeEmbed(activeMedia!.src)}
                  className="w-full h-full z-10"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  title="Robot Media"
                />
              ) : (
                <div className="relative w-full h-full flex items-center justify-center z-10">
  
                  <Image
                    src={activeMedia!.src}
                    alt=""
                    fill
                    className="object-cover scale-110 blur-3xl opacity-15"
                    unoptimized
                  />

                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/30" />

                  <Image
                    src={activeMedia!.src}
                    alt={robot.name}
                    fill
                    className="object-contain p-2 sm:p-4 drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)]"
                    unoptimized
                    priority
                  />
                </div>
              )}

              {/* Carousel Buttons */}
              {hasRealMedia && mediaItems.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveMediaIdx((i) => (i - 1 + mediaItems.length) % mediaItems.length)}
                    aria-label="Previous Media"
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-black/60 border border-white/15 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition hover:bg-black/90"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setActiveMediaIdx((i) => (i + 1) % mediaItems.length)}
                    aria-label="Next Media"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-black/60 border border-white/15 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition hover:bg-black/90"
                  >
                    <ChevronRight size={16} />
                  </button>

                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-md border border-white/10">
                    {mediaItems.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveMediaIdx(i)}
                        aria-label={`Slide ${i + 1}`}
                        className={`rounded-full transition-all ${
                          i === activeMediaIdx ? "h-1 w-3.5 bg-teal-400" : "h-1 w-1 bg-white/40 hover:bg-white/70"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {hasRealMedia && mediaItems.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
                {mediaItems.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveMediaIdx(i)}
                    className={`relative h-12 w-16 shrink-0 rounded-lg overflow-hidden border transition ${
                      i === activeMediaIdx
                        ? "border-teal-400 shadow-sm shadow-teal-500/20"
                        : "border-white/10 opacity-60 hover:opacity-100"
                    }`}
                  >
                    {item.type === "video" ? (
                      <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                        <Play size={12} className="text-white fill-white" />
                      </div>
                    ) : (
                      <Image src={item.src} alt="Thumbnail" fill className="object-cover" unoptimized />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Telemetry & Actions Panel */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.015] p-4 sm:p-5 backdrop-blur-xl">
            
            {/* Header + Title */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide ${avail.badge}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${avail.dot}`} />
                  {robot.availability}
                </span>
                
                {robot.category && (
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-widest text-zinc-400">
                    {robot.category}
                  </span>
                )}
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  {robot.name}
                </h1>
                <p className="text-xs font-medium text-teal-400/90 flex items-center gap-1.5 mt-0.5">
                  <Building2 size={13} />
                  <span>By {robot.company}</span>
                  {robot.country && <span className="text-zinc-500 font-normal">({robot.country})</span>}
                </p>
              </div>

              {robot.mainTask && (
                <p className="text-xs leading-relaxed text-zinc-300 border-l-2 border-teal-500/60 pl-2.5 py-0.5">
                  {robot.mainTask}
                </p>
              )}
            </div>

            {/* Tight Metric Tiles */}
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 transition hover:border-white/15">
                <span className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider text-zinc-400">
                  <DollarSign size={11} className="text-teal-400" /> Commercial Price
                </span>
                <p className="text-sm font-semibold text-white mt-1 truncate">
                  {robot.price && robot.price !== "N/A" ? robot.price : "Available on Request"}
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition hover:border-white/15">
                <span className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider text-zinc-400">
                  <Zap size={11} className="text-amber-400" /> Autonomy Level
                </span>
                <p className="text-sm font-semibold text-white mt-1 truncate">
                  {robot.autonomyLevel || "Teleoperated"}
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition hover:border-white/15">
                <span className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider text-zinc-400">
                  <Calendar size={11} className="text-blue-400" /> Platform Release
                </span>
                <p className="text-sm font-bold text-white mt-1 font-mono">
                  {robot.releaseDate ? robot.releaseDate.slice(0, 4) : "2026 Production"}
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition hover:border-white/15">
                <span className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider text-zinc-400">
                  <Activity size={11} className="text-emerald-400" /> Operational Status
                </span>
                <p className="text-sm font-bold text-white mt-1 capitalize truncate">
                  {robot.availability || "Active"}
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-2 pt-1">
              {robot.websiteUrl && (
                <a
                  href={robot.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-teal-400 hover:bg-teal-300 px-4 py-2.5 text-xs font-bold text-black transition active:scale-[0.98] cursor-pointer"
                >
                  <span>Visit Manufacturer Website</span>
                  <ArrowUpRight size={14} />
                </a>
              )}

              <button
                onClick={handleShare}
                type="button"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/[0.08] transition active:scale-95 cursor-pointer"
              >
                {copied ? <Check size={14} className="text-teal-400" /> : <Share2 size={14} />}
                <span>{copied ? "Copied" : "Share"}</span>
              </button>
            </div>

          </div>
        </section>

        {/* SECTION 2: EXECUTIVE SUMMARY & COMPACT BLUEPRINT */}
        <section className="space-y-4">
          
          {/* Executive Overview (Col 5) */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.015] p-6 space-y-4 shadow-lg backdrop-blur-xl">
            <div className="space-y-0.5">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-teal-400 flex items-center gap-1">
                <Box size={11} /> Executive Summary
              </span>
              <h2 className="text-base font-bold text-white tracking-tight">Capabilities & Deployment</h2>
            </div>

            {robot.about && (
              <>
                <div>
                  <h3 className="text-sm font-semibold text-white mb-2">
                    Overview
                  </h3>

                  <p className="text-sm leading-relaxed text-zinc-300">
                    {robot.about}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/[0.08]">
                  <h3 className="text-sm font-semibold text-white mb-2">
                    Deployment Context
                  </h3>

                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {robot.name} is designed for {robot.mainTask || "automation"} applications.
                    It is categorized under {robot.category || "robotics"} and is developed
                    by {robot.company}.
                  </p>
                </div>
              </>
            )}

            {/* Primary Use Cases */}
            {robot.primaryUseCases && robot.primaryUseCases.length > 0 && (
              <div className="pt-3 border-t border-white/[0.08] space-y-2">
                <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 flex items-center gap-1">
                  <ShieldCheck size={11} className="text-teal-400" /> Target Domains & Tasks
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {robot.primaryUseCases.map((uc) => (
                    <span
                      key={uc}
                      className="inline-flex items-center rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-zinc-300"
                    >
                      {uc}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* DENSE TECHNICAL SPEC SHEET (Col 7) */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.015] p-6 space-y-4 shadow-lg backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
              <div>
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-teal-400 flex items-center gap-1">
                  <Cpu size={11} /> Blueprint
                </span>
                <h2 className="text-base font-bold text-white tracking-tight">Technical Specifications</h2>
              </div>
              <span className="font-mono text-[9px] text-zinc-500 uppercase">{robot.name}</span>
            </div>

            {/* Dense Key-Value List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {specEntries.length > 0 ? (
                specEntries.map((spec) => (
                  <div
                    key={spec.key}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 flex items-center justify-between text-sm"
                  >
                    <span className="font-mono text-zinc-400">{spec.key}</span>
                    <span className="font-semibold text-zinc-100 text-right">{spec.val}</span>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-center justify-between py-2 border-b border-white/[0.04] text-xs">
                    <span className="font-mono text-zinc-400">Height</span>
                    <span className="font-semibold text-zinc-100">~74 cm</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/[0.04] text-xs">
                    <span className="font-mono text-zinc-400">Weight</span>
                    <span className="font-semibold text-zinc-100">~47 kg</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/[0.04] text-xs">
                    <span className="font-mono text-zinc-400">Degrees of Freedom</span>
                    <span className="font-semibold text-zinc-100">22 DOF</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/[0.04] text-xs">
                    <span className="font-mono text-zinc-400">Robot Type</span>
                    <span className="font-semibold text-zinc-100">Home Automation</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/[0.04] text-xs">
                    <span className="font-mono text-zinc-400">Navigation</span>
                    <span className="font-semibold text-zinc-100">Autonomous / Remote</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/[0.04] text-xs">
                    <span className="font-mono text-zinc-400">Sensors</span>
                    <span className="font-semibold text-zinc-100">RGB, Depth, IMU</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/[0.04] text-xs">
                    <span className="font-mono text-zinc-400">Battery</span>
                    <span className="font-semibold text-zinc-100">Rechargeable Li-Ion</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/[0.04] text-xs">
                    <span className="font-mono text-zinc-400">Connectivity</span>
                    <span className="font-semibold text-zinc-100">Wi-Fi / 5G</span>
                  </div>
                </>
              )}
            </div>
          </div>

        </section>

        {/* SECTION 3: COMPARABLE HARDWARE DECK */}
        {similarRobots.length > 0 && (
          <section className="rounded-2xl border border-white/[0.08] bg-white/[0.015] p-6 space-y-5 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
              <div>
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-teal-400">
                  Ecosystem
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Comparable Systems in {robot.category}
                </h3>
              </div>
              <Link href="/robots" className="text-xs text-teal-400 hover:underline">
                View All Systems →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {similarRobots.map((r) => {
                const sAvail = getAvailabilityStyle(r.availability || "");
                return (
                  <Link
                    key={r.id}
                    href={`/robots/${r.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:border-teal-500/40 hover:-translate-y-1 transition-all duration-300 shadow-lg min-h-[320px]"
                  >
                    {/* Image */}
                    <div className="relative h-44 w-full overflow-hidden">
                      {r.thumbnailUrl ? (
                        <Image
                          src={r.thumbnailUrl}
                          alt={r.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          unoptimized
                        />
                      ) : r.logoUrl ? (
                        <Image
                          src={r.logoUrl}
                          alt={r.name}
                          fill
                          className="object-contain p-4 bg-black/30"
                          unoptimized
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-white/[0.03]">
                          <Bot size={40} className="text-zinc-500" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-4">
                      <h4 className="text-base font-bold text-white line-clamp-2 group-hover:text-teal-400 transition">
                        {r.name}
                      </h4>

                      <p className="text-xs text-zinc-400 mt-1">
                        {r.company}
                      </p>

                      {r.about && (
                        <p className="mt-3 text-xs leading-relaxed text-zinc-400 line-clamp-3">
                          {r.about}
                        </p>
                      )}

                      <div className="mt-auto flex items-center justify-between pt-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-medium ${sAvail.badge}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${sAvail.dot}`} />
                          {r.availability}
                        </span>

                        {r.releaseDate && (
                          <span className="text-[10px] text-zinc-500 font-mono">
                            {r.releaseDate.slice(0, 4)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}