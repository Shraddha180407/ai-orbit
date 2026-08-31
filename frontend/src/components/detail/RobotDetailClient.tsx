"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Bot from "lucide-react/dist/esm/icons/bot";
import Building2 from "lucide-react/dist/esm/icons/building-2";
import Calendar from "lucide-react/dist/esm/icons/calendar";
import MapPin from "lucide-react/dist/esm/icons/map-pin";
import ExternalLink from "lucide-react/dist/esm/icons/external-link";
import ChevronLeft from "lucide-react/dist/esm/icons/chevron-left";
import ChevronRight from "lucide-react/dist/esm/icons/chevron-right";
import Play from "lucide-react/dist/esm/icons/play";
import Share2 from "lucide-react/dist/esm/icons/share-2";
import Check from "lucide-react/dist/esm/icons/check";
import Cpu from "lucide-react/dist/esm/icons/cpu";
import Globe from "lucide-react/dist/esm/icons/globe";
import Tag from "lucide-react/dist/esm/icons/tag";
import Layers from "lucide-react/dist/esm/icons/layers";
import Shield from "lucide-react/dist/esm/icons/shield";
import ShieldCheck from "lucide-react/dist/esm/icons/shield-check";
import Crosshair from "lucide-react/dist/esm/icons/crosshair";
import Radio from "lucide-react/dist/esm/icons/radio";
import Package from "lucide-react/dist/esm/icons/package";
import ScanSearch from "lucide-react/dist/esm/icons/scan-search";
import Leaf from "lucide-react/dist/esm/icons/leaf";
import HeartPulse from "lucide-react/dist/esm/icons/heart-pulse";
import BookOpen from "lucide-react/dist/esm/icons/book-open";
import Factory from "lucide-react/dist/esm/icons/factory";
import Siren from "lucide-react/dist/esm/icons/siren";
import Navigation from "lucide-react/dist/esm/icons/navigation";
import BarChart2 from "lucide-react/dist/esm/icons/bar-chart-2";
import Settings from "lucide-react/dist/esm/icons/settings";
import Home from "lucide-react/dist/esm/icons/home";
import Warehouse from "lucide-react/dist/esm/icons/warehouse";
import Users from "lucide-react/dist/esm/icons/users";
import { Robot } from "@/lib/types";
import { fetchRobotById, fetchAllRobots, API_URL, prefetchUrl, getFromCache } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

interface RobotDetailClientProps {
  id: string;
}

function isYouTubeUrl(url: string): boolean {
  return /youtube\.com|youtu\.be/.test(url);
}
function toYouTubeEmbed(url: string): string {
  return url.replace("youtu.be/", "www.youtube.com/embed/").replace("watch?v=", "embed/").replace(/[?&]si=[^&]+/, "");
}
function isImageUrl(url: string): boolean {
  return /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(url);
}
function getAvailabilityStyle(status: string): { dot: string; badge: string } {
  const s = status.toLowerCase();
  if (s.includes("available") || s.includes("commercial")) return { dot: "bg-emerald-400", badge: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" };
  if (s.includes("production")) return { dot: "bg-sky-400", badge: "border-sky-500/30 bg-sky-500/10 text-sky-400" };
  if (s.includes("development") || s.includes("pilot")) return { dot: "bg-amber-400", badge: "border-amber-500/30 bg-amber-500/10 text-amber-400" };
  if (s.includes("discontinued")) return { dot: "bg-red-400", badge: "border-red-500/30 bg-red-500/10 text-red-400" };
  return { dot: "bg-[#555560]", badge: "border-[#232326] bg-[#18181C] text-[#A1A1AA]" };
}

function UseCaseChip({ label }: { label: string }) {
  const l = label.toLowerCase();
  let Icon = Bot;
  if (l.includes("security")) Icon = ShieldCheck;
  else if (l.includes("defense")) Icon = Crosshair;
  else if (l.includes("surveil")) Icon = Radio;
  else if (l.includes("deliver") || l.includes("warehouse") || l.includes("logistic")) Icon = Warehouse;
  else if (l.includes("inspect") || l.includes("search")) Icon = ScanSearch;
  else if (l.includes("agricult") || l.includes("lawn")) Icon = Leaf;
  else if (l.includes("medical") || l.includes("health") || l.includes("rescue")) Icon = HeartPulse;
  else if (l.includes("educat")) Icon = BookOpen;
  else if (l.includes("industri") || l.includes("manufactur")) Icon = Factory;
  else if (l.includes("monitor") || l.includes("analyt")) Icon = BarChart2;
  else if (l.includes("manag") || l.includes("automat")) Icon = Settings;
  else if (l.includes("home") || l.includes("domestic")) Icon = Home;
  else if (l.includes("companion") || l.includes("assist")) Icon = Users;
  else if (l.includes("navigat")) Icon = Navigation;
  else if (l.includes("packag") || l.includes("sort")) Icon = Package;
  else if (l.includes("patrol") || l.includes("alarm")) Icon = Siren;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-[#2a2a34] bg-[#111118] px-2.5 py-1 text-[11px] font-medium text-[#A1A1AA] hover:border-[#3a3a44] transition-colors">
      <Icon size={11} className="text-[#555560] shrink-0" />
      {label}
    </span>
  );
}

function MediaGallery({ robot }: { robot: Robot }) {
  const videoUrls = robot.mediaUrls.filter(isYouTubeUrl);
  const imageUrls = [
    robot.thumbnailUrl,
    ...robot.mediaUrls.filter(isImageUrl),
    ...(robot.thumbnailUrl ? [] : robot.logoUrl ? [robot.logoUrl] : []),
  ].filter(Boolean) as string[];
  const mediaItems: Array<{ type: "video" | "image"; src: string }> = [
    ...videoUrls.map((src) => ({ type: "video" as const, src })),
    ...imageUrls.map((src) => ({ type: "image" as const, src })),
  ];
  const hasRealMedia = mediaItems.length > 0;
  const [activeIdx, setActiveIdx] = useState(0);
  const active = hasRealMedia ? mediaItems[activeIdx] : null;
  const prev = () => setActiveIdx((i) => (i - 1 + mediaItems.length) % mediaItems.length);
  const next = () => setActiveIdx((i) => (i + 1) % mediaItems.length);
  return (
    <div className="space-y-2">
      <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-[#1e1e24] group bg-[#0c0c14]">
        {!hasRealMedia ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
            <div className="relative flex flex-col items-center gap-3">
              <div className="h-16 w-16 rounded-2xl border border-[#1e1e24] bg-[#111118] flex items-center justify-center">
                <Bot size={28} className="text-[#2a2a36]" />
              </div>
              <div className="text-center">
                <p className="text-[13px] font-semibold text-[#2a2a36]">{robot.name}</p>
                <p className="text-[10px] font-mono text-[#222228] mt-0.5 uppercase tracking-widest">Image coming soon</p>
              </div>
            </div>
          </div>
        ) : active!.type === "video" ? (
          <iframe src={toYouTubeEmbed(active!.src)} className="w-full h-full" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" title="Robot video" />
        ) : (
          <Image src={active!.src} alt={robot.name} fill className="object-contain bg-white" unoptimized />
        )}
        {hasRealMedia && mediaItems.length > 1 && (
          <>
            <button onClick={prev} aria-label="Previous" className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm hover:bg-black/80"><ChevronLeft size={16} /></button>
            <button onClick={next} aria-label="Next" className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm hover:bg-black/80"><ChevronRight size={16} /></button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {mediaItems.map((_, i) => (<button key={i} onClick={() => setActiveIdx(i)} aria-label={`Media ${i + 1}`} className={`rounded-full transition-all ${i === activeIdx ? "h-1.5 w-4 bg-white" : "h-1.5 w-1.5 bg-white/40 hover:bg-white/70"}`} />))}
            </div>
          </>
        )}
      </div>
      {hasRealMedia && mediaItems.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {mediaItems.map((item, i) => (
            <button key={i} onClick={() => setActiveIdx(i)} aria-label={`Select media ${i + 1}`} className={`relative h-14 w-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${i === activeIdx ? "border-[#6E56CF]" : "border-[#1e1e24] hover:border-[#3a3a44]"}`}>
              {item.type === "video" ? (<div className="w-full h-full bg-[#0a0a0d] flex items-center justify-center"><Play size={14} className="text-white/60 fill-white/60" /></div>) : (<Image src={item.src} alt={`Thumb ${i + 1}`} fill className="object-contain bg-white" unoptimized />)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SimilarRobotCard({ robot }: { robot: Robot }) {
  const year = robot.releaseDate ? robot.releaseDate.slice(0, 4) : null;
  const avail = getAvailabilityStyle(robot.availability || "");
  return (
    <Link href={`/robots/${robot.slug}`} className="group flex gap-3 rounded-xl border border-[#1e1e24] bg-[#0a0a0d] p-3 hover:border-[#2a2a34] hover:bg-[#0d0d12] transition-all">
      <div className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden bg-[#0c0c14] border border-[#1e1e24]">
        {robot.thumbnailUrl ? (
          <Image src={robot.thumbnailUrl} alt={robot.name} fill className="object-contain bg-white" unoptimized />
        ) : robot.logoUrl ? (
          <Image src={robot.logoUrl} alt={robot.name} fill className="object-contain bg-white p-1.5" unoptimized />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><Bot size={20} className="text-[#2a2a36]" /></div>
        )}
      </div>
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <p className="text-[13px] font-bold text-white group-hover:text-[#4a9aff] transition-colors truncate leading-tight">{robot.name}</p>
        <p className="text-[10px] text-[#555560] font-mono truncate">{[robot.company, "· Robot ·", robot.category].filter(Boolean).join(" ")}</p>
        {robot.about && <p className="text-[11px] text-[#71717A] line-clamp-2 leading-relaxed">{robot.about}</p>}
        <div className="flex items-center gap-2 mt-auto pt-1">
          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-bold ${avail.badge}`}>
            <span className={`h-1 w-1 rounded-full ${avail.dot}`} />{robot.availability}
          </span>
          {year && <span className="text-[10px] font-mono text-[#555560] ml-auto">{year}</span>}
        </div>
      </div>
    </Link>
  );
}

function StickyCTA({ robot }: { robot: Robot }) {
  const [visible, setVisible] = useState(true);
  if (!robot.websiteUrl || !visible) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#1e1e24] bg-[#0a0a0d]/95 backdrop-blur-md px-4 py-3">
      <div className="mx-auto max-w-[1200px] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 rounded-lg border border-[#1e1e24] bg-[#111118] flex items-center justify-center shrink-0 overflow-hidden">
            {robot.logoUrl ? <Image src={robot.logoUrl} alt={robot.name} width={36} height={36} className="object-contain p-1" unoptimized /> : <Bot size={16} className="text-[#71717A]" />}
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-white truncate">{robot.name}</p>
            <p className="text-[11px] text-[#71717A] truncate">{robot.company}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => setVisible(false)} className="rounded-lg border border-[#1e1e24] bg-[#111118] px-3 py-1.5 text-[11px] font-medium text-[#71717A] hover:text-white transition-colors">Dismiss</button>
          <a href={robot.websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-[#1a6bff] hover:bg-[#2a7aff] text-white text-[12px] font-bold px-4 py-1.5 transition-colors">
            <ExternalLink size={12} /> Visit Website
          </a>
        </div>
      </div>
    </div>
  );
}

export function RobotDetailClient({ id }: RobotDetailClientProps) {
  const [shared, setShared] = useState(false);

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
    enabled: !!robot,
  });

  const similarRobots = robot ? allRobots.filter((r) => r.id !== robot.id && r.category === robot.category).slice(0, 4) : [];

  const handleShare = async () => {
    if (!robot) return;
    const data = { title: robot.name, text: robot.about || "", url: window.location.href };
    if (navigator.share) { try { await navigator.share(data); } catch {} }
    else {
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  if (isLoading && !robot) {
    return (
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 pb-20">
        <div className="mx-auto max-w-[1200px] space-y-6 animate-pulse">
          <div className="h-4 w-48 rounded bg-[#111118]" />
          <div className="rounded-2xl border border-[#1e1e24] bg-[#0a0a0d] p-6 h-36" />
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
            <div className="aspect-[16/10] rounded-xl bg-[#111118]" />
            <div className="space-y-3">{[1,2,3,4,5,6].map((i) => <div key={i} className="h-12 rounded-lg bg-[#111118]" />)}</div>
          </div>
        </div>
      </main>
    );
  }

  if (!robot) {
    return (
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="mx-auto max-w-[1200px] text-center py-20">
          <Bot size={40} className="mx-auto text-[#71717A] mb-4" />
          <p className="text-lg font-semibold text-white">Robot not found</p>
          <p className="text-sm text-[#A1A1AA] mt-2">The robot you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link href="/robots" className="inline-flex items-center gap-1.5 mt-6 text-sm font-medium text-[#2DD4BF] hover:underline">← Back to Robots</Link>
        </div>
      </main>
    );
  }

  const avail = getAvailabilityStyle(robot.availability || "");
  const countryCode = robot.country ? robot.country.slice(0, 2).toUpperCase() : null;
  const videoUrls = robot.mediaUrls.filter(isYouTubeUrl);

  // Specs rows
  let specRows: { key: string; val: string }[] = [];
  let specIsFallback = false;
  if (robot.specs) {
    const lines = robot.specs.split(/[;\n]/).map((l) => l.trim()).filter(Boolean);
    specRows = lines.map((line) => {
      const c = line.indexOf(":");
      if (c > 0 && c < 50) return { key: line.slice(0, c).trim(), val: line.slice(c + 1).trim() };
      return null;
    }).filter(Boolean) as { key: string; val: string }[];
  }
  if (specRows.length === 0) {
    specIsFallback = true;
    const cat = (robot.category || "").toLowerCase();
    if (cat.includes("humanoid")) specRows = [{ key: "Height", val: "~170 cm" }, { key: "Weight", val: "~60 kg" }, { key: "Degrees of Freedom", val: "~28 DoF" }, { key: "Battery Life", val: "~2 hrs" }, { key: "Payload", val: "~10 kg" }, { key: "Actuators", val: "Electric" }];
    else if (cat.includes("drone")) specRows = [{ key: "Flight Time", val: "~30 min" }, { key: "Max Speed", val: "~60 km/h" }, { key: "Range", val: "~5 km" }, { key: "Weight", val: "~1.5 kg" }, { key: "Sensors", val: "Camera, IMU, GPS" }, { key: "Power", val: "LiPo Battery" }];
    else if (cat.includes("mobile") || cat.includes("amr")) specRows = [{ key: "Max Speed", val: "~2 m/s" }, { key: "Payload", val: "~100 kg" }, { key: "Battery Life", val: "~8 hrs" }, { key: "Navigation", val: "LiDAR + SLAM" }, { key: "Drive Type", val: "Differential" }, { key: "Weight", val: "~80 kg" }];
    else if (cat.includes("industrial") || cat.includes("manipulator")) specRows = [{ key: "Reach", val: "~1200 mm" }, { key: "Payload", val: "~10 kg" }, { key: "Degrees of Freedom", val: "6 DoF" }, { key: "Repeatability", val: "±0.05 mm" }, { key: "Power", val: "AC 200V" }, { key: "Weight", val: "~30 kg" }];
    else specRows = [{ key: "Operating Temp", val: "0°C – 40°C" }, { key: "Connectivity", val: "Wi-Fi, Bluetooth" }, { key: "Power Source", val: "Rechargeable Battery" }, { key: "Navigation", val: "AI-based" }, { key: "Operating System", val: "Embedded Linux / ROS" }, { key: "Interface", val: "App / API" }];
    if (robot.autonomyLevel) specRows.unshift({ key: "Autonomy", val: robot.autonomyLevel });
  }

  const DEFAULT_VIDEOS = [
    { id: "v1", youtubeId: "fn3KWM1kuAw", title: "The Most Advanced AI Robots In The World", channel: "Tech Vision", views: "2.4M views", year: "2024", duration: "12:34" },
    { id: "v2", youtubeId: "bHFAQkRPa7E", title: "Boston Dynamics Atlas — Next Generation Robot", channel: "Boston Dynamics", views: "5.1M views", year: "2024", duration: "3:07" },
  ];

  return (
    <main className="flex-1 w-full px-3 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24">
      <div className="mx-auto max-w-[1200px] space-y-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[11px] text-[#555560] font-medium flex-wrap">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/robots" className="hover:text-white transition-colors">Robots</Link>
          <span>/</span>
          <span className="text-[#A1A1AA]">{robot.name}</span>
        </nav>

        {/* Hero */}
        <header className="relative rounded-2xl border border-[#1e1e24] bg-[#080810] p-4 sm:p-6 md:p-8 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1a6bff]/50 to-transparent" />
          <div className="absolute right-0 top-0 w-72 h-72 bg-[#1a6bff]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-xl border border-[#1e1e24] bg-[#0d0d15] flex items-center justify-center overflow-hidden">
                {robot.logoUrl ? <Image src={robot.logoUrl} alt={robot.name} width={80} height={80} className="object-contain p-2" unoptimized /> : <Bot size={28} className="text-[#555560]" />}
              </div>
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white">{robot.name}</h1>
                  {robot.availability && (
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${avail.badge}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${avail.dot}`} />{robot.availability}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[12px] text-[#71717A]">
                  {robot.company && <span className="flex items-center gap-1.5"><Building2 size={12} />{robot.company}</span>}
                  {robot.country && <span className="flex items-center gap-1.5"><MapPin size={12} />{robot.country}</span>}
                  {robot.releaseDate && <span className="flex items-center gap-1.5"><Calendar size={12} />{robot.releaseDate.slice(0, 4)}</span>}
                  {robot.category && <span className="flex items-center gap-1.5"><Tag size={12} /><span className="inline-flex rounded border border-[#2a2a34] bg-[#111118] px-2 py-0.5 text-[10px] font-semibold text-[#A1A1AA]">{robot.category}</span></span>}
                </div>
                {robot.mainTask && <p className="text-[13px] text-[#A1A1AA] max-w-2xl leading-relaxed mt-1">{robot.mainTask}</p>}
                {robot.primaryUseCases && robot.primaryUseCases.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">{robot.primaryUseCases.slice(0, 4).map((uc) => <UseCaseChip key={uc} label={uc} />)}</div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full md:w-52 shrink-0">
              {robot.websiteUrl && (
                <a href={robot.websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex w-full justify-center items-center gap-2 rounded-xl bg-[#1a6bff] hover:bg-[#2a7aff] px-4 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-[#1a6bff]/20 hover:-translate-y-0.5 transition-all active:scale-95">
                  <ExternalLink size={14} /> Visit Website
                </a>
              )}
              <button onClick={handleShare} className="inline-flex w-full justify-center items-center gap-2 rounded-xl border border-[#1e1e24] bg-[#0d0d10] px-4 py-2.5 text-sm font-semibold text-[#A1A1AA] hover:text-white hover:border-[#2a2a34] transition-all active:scale-95">
                {shared ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
                {shared ? "Copied!" : "Share"}
              </button>
            </div>
          </div>
        </header>

        {/* Two-column */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">

          {/* LEFT */}
          <div className="space-y-5">
            <MediaGallery robot={robot} />

            {robot.about && (
              <section className="rounded-xl border border-[#1e1e24] bg-[#0a0a0d] p-5 md:p-6 space-y-4">
                <div className="flex items-center gap-2.5 border-b border-[#1e1e24] pb-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded bg-[#1a6bff]/15"><Bot className="text-[#1a6bff] h-3.5 w-3.5" /></span>
                  <h2 className="text-[11px] font-bold text-white uppercase tracking-widest">About</h2>
                </div>
                {robot.primaryUseCases && robot.primaryUseCases.length > 0 && (
                  <div className="flex flex-wrap gap-2">{robot.primaryUseCases.map((uc) => <UseCaseChip key={uc} label={uc} />)}</div>
                )}
                <p className="text-[13px] text-[#A1A1AA] leading-relaxed">{robot.about}</p>
              </section>
            )}

            {/* Technical Specs */}
            <section className="rounded-xl border border-[#1e1e24] bg-[#0a0a0d] overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[#1e1e24] flex items-center justify-between bg-[#0d0d15]">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded bg-[#1a6bff]/15"><Cpu className="text-[#1a6bff] h-3.5 w-3.5" /></span>
                  <h2 className="text-[11px] font-bold text-white uppercase tracking-widest">Technical Specifications</h2>
                </div>
                <span className="text-[9px] font-mono text-[#333] uppercase tracking-widest truncate max-w-[120px]">{robot.name}</span>
              </div>
              <div className="divide-y divide-[#0f0f12]">
                {specRows.map((row) => (
                  <div key={row.key} className="flex items-start px-5 py-3 hover:bg-white/[0.015] transition-colors">
                    <span className="text-[11px] font-mono text-[#3D3D45] shrink-0 w-36 mt-0.5">{row.key}</span>
                    <span className="text-[12px] font-semibold text-[#E0E0E8]">{row.val}</span>
                  </div>
                ))}
              </div>
              {specIsFallback && <div className="px-5 py-2 border-t border-[#0f0f12]"><p className="text-[9px] font-mono text-[#333] italic">* Estimated specs based on category</p></div>}
            </section>

          </div>

          {/* RIGHT sidebar */}
          <aside className="space-y-4">
            <section className="rounded-xl border border-[#1e1e24] bg-[#0a0a0d] overflow-hidden">
              <div className="px-4 py-3 bg-[#0d0d15] border-b border-[#1e1e24]">
                <p className="text-[10px] font-bold tracking-widest text-[#555560] uppercase flex items-center gap-2"><Shield size={11} className="text-[#555560]" /> Robot Details</p>
              </div>
              <div className="px-4">
                {[
                  { label: "Manufacturing Country", value: robot.country, extra: countryCode },
                  { label: "Autonomy Level", value: robot.autonomyLevel },
                  { label: "Status", value: robot.availability },
                  { label: "Release Date", value: robot.releaseDate ? robot.releaseDate.slice(0, 4) : null },
                  { label: "Price", value: robot.price && robot.price !== "N/A" ? robot.price : null },
                  { label: "Primary Task", value: robot.mainTask },
                ].filter((r) => r.value).map((row, i, arr) => (
                  <div key={row.label} className={`py-3 ${i < arr.length - 1 ? "border-b border-[#111118]" : ""}`}>
                    <p className="text-[10px] text-[#555560] font-medium uppercase tracking-wider mb-1">{row.label}</p>
                    <div className="flex items-center gap-2">
                      {row.extra && <span className="inline-flex items-center justify-center rounded bg-[#1e1e24] px-1.5 py-0.5 text-[10px] font-bold text-[#A1A1AA] font-mono">{row.extra}</span>}
                      <p className="text-[13px] font-semibold text-white">{row.value}</p>
                    </div>
                  </div>
                ))}
                {robot.category && (
                  <div className="py-3 border-t border-[#111118]">
                    <p className="text-[10px] text-[#555560] font-medium uppercase tracking-wider mb-2">Robot Type</p>
                    <span className="inline-flex rounded border border-[#2a2a34] bg-[#111118] px-2.5 py-1 text-[11px] font-medium text-[#A1A1AA]">{robot.category}</span>
                  </div>
                )}
                {robot.primaryUseCases && robot.primaryUseCases.length > 0 && (
                  <div className="py-3 border-t border-[#111118]">
                    <p className="text-[10px] text-[#555560] font-medium uppercase tracking-wider mb-2">Primary Use Cases</p>
                    <div className="flex flex-wrap gap-1.5">{robot.primaryUseCases.map((uc) => <span key={uc} className="inline-flex rounded border border-[#2a2a34] bg-[#111118] px-2.5 py-1 text-[11px] font-medium text-[#A1A1AA]">{uc}</span>)}</div>
                  </div>
                )}
              </div>
              {robot.websiteUrl && (
                <div className="px-4 py-4 border-t border-[#1e1e24]">
                  <a href={robot.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full rounded-lg bg-[#1a6bff] hover:bg-[#2a7aff] text-white text-[13px] font-bold py-2.5 transition-colors">
                    <ExternalLink size={13} /> Visit website
                  </a>
                </div>
              )}
            </section>

            {videoUrls.length > 0 && (
              <section className="rounded-xl border border-[#1e1e24] bg-[#0a0a0d] p-4 space-y-3">
                <p className="text-[10px] font-bold tracking-widest text-[#555560] uppercase flex items-center gap-2"><Play size={11} className="text-[#555560]" /> Videos</p>
                <div className="space-y-2">
                  {videoUrls.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg border border-[#1e1e24] bg-[#0d0d10] p-2.5 hover:border-[#2a2a34] transition-colors group">
                      <div className="h-8 w-8 rounded bg-[#111118] flex items-center justify-center shrink-0"><Play size={12} className="text-[#A1A1AA] fill-[#A1A1AA] group-hover:text-white group-hover:fill-white transition-colors" /></div>
                      <p className="text-[11px] text-[#A1A1AA] group-hover:text-white transition-colors truncate">Watch video {i + 1}</p>
                      <ExternalLink size={11} className="text-[#555560] shrink-0 ml-auto" />
                    </a>
                  ))}
                </div>
              </section>
            )}

            {robot.category && (
              <section className="rounded-xl border border-[#1e1e24] bg-[#0a0a0d] p-4 space-y-3">
                <p className="text-[10px] font-bold tracking-widest text-[#555560] uppercase flex items-center gap-2"><Layers size={11} /> Related Topics</p>
                <div className="flex flex-wrap gap-1.5">
                  <Link href={`/p/robots/${robot.category.toLowerCase().replace(/\s+/g, "-")}`} className="inline-flex items-center gap-1.5 rounded-full border border-[#1e1e24] bg-[#0d0d10] px-3 py-1 text-[11px] font-semibold text-[#A1A1AA] hover:border-[#1a6bff]/40 hover:text-white hover:bg-[#1a6bff]/10 transition-all">
                    <Layers size={9} className="text-[#1a6bff]" /> {robot.category}
                  </Link>
                  {robot.primaryUseCases && robot.primaryUseCases.slice(0, 4).map((uc) => (
                    <span key={uc} className="inline-flex rounded-full border border-[#1e1e24] bg-[#0d0d10] px-3 py-1 text-[11px] font-semibold text-[#A1A1AA]">#{uc.toLowerCase().replace(/\s+/g, "-")}</span>
                  ))}
                </div>
              </section>
            )}
          </aside>
        </div>

        {/* Similar Robots */}
        {similarRobots.length > 0 && (
          <section className="rounded-xl border border-[#1e1e24] bg-[#0a0a0d] p-5 md:p-6 space-y-5">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#1e1e24] bg-[#111118]"><Globe size={13} className="text-[#555560]" /></span>
              <h2 className="text-[11px] font-bold text-white uppercase tracking-widest">Similar Robots</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {similarRobots.map((r) => <SimilarRobotCard key={r.id} robot={r} />)}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}
