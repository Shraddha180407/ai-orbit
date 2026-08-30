"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  Check, Cpu, Zap, ListChecks, Layers, FileText,
  Share2, Bookmark, ArrowUpRight, ArrowRight,
  ShieldCheck, Sparkles,
} from "lucide-react";
import { fetchAllDevices, fetchDeviceById, API_URL, prefetchUrl } from "@/lib/api";
import { Device } from "@/lib/types";
import { DEVICES_DATA, DeviceData, getDeviceBySlug, getSimilarDevices, getMainTaskColor } from "@/data/devices";

// ─── constants ───────────────────────────────────────────────────────────────

const AVAILABILITY_STYLES: Record<string, string> = {
  Available:    "bg-[#1a3a2a] text-[#4ade80] border border-[#2a5a3a]",
  "Pre-order":  "bg-[#1a2a3a] text-[#60a5fa] border border-[#2a3a5a]",
  Announced:    "bg-[#2a2a1a] text-[#facc15] border border-[#4a4a2a]",
  Discontinued: "bg-[#3a1a1a] text-[#f87171] border border-[#5a2a2a]",
};

const ALT_CARD_STYLES = [
  { orb1: "top-[-20px] left-[-10px] w-28 h-28", orb2: "bottom-[-10px] right-[-10px] w-16 h-16", c1: "#6E56CF", c2: "#9b78ff" },
  { orb1: "top-[-20px] right-[-10px] w-28 h-28", orb2: "bottom-[-10px] left-[-10px] w-16 h-16", c1: "#E85D4A", c2: "#ff8a7a" },
  { orb1: "top-[-15px] left-[30%] w-24 h-24", orb2: "bottom-[-5px] right-[20%] w-14 h-14", c1: "#0082FB", c2: "#60a5fa" },
  { orb1: "bottom-[-10px] left-[-10px] w-24 h-24", orb2: "top-[-10px] right-[-5px] w-16 h-16", c1: "#34A853", c2: "#4ade80" },
  { orb1: "top-[-10px] left-[-15px] w-20 h-20", orb2: "top-[-10px] right-[-15px] w-20 h-20", c1: "#FF9900", c2: "#fbbf24" },
];

// ─── helpers ─────────────────────────────────────────────────────────────────

function getFaviconUrl(manufacturer: string, slug: string): string {
  const mfr = (manufacturer || "").toLowerCase().replace(/\s+/g, "");
  const domain = slug.toLowerCase().replace(/[^a-z0-9-]/g, "").split("-")[0];
  return `https://www.google.com/s2/favicons?sz=64&domain=${mfr || domain}.com`;
}

function mergeDevice(api: Device | null, slug: string): DeviceData | null {
  const dummy = getDeviceBySlug(slug);
  if (!api && !dummy) return null;
  if (!api) return dummy;
  const mainTask = api.mainTask || dummy?.mainTask || "Device";
  const manufacturer = api.manufacturer || dummy?.manufacturer || "—";
  return {
    id: api.id,
    slug: dummy?.slug || api.slug || api.id,
    name: api.name,
    manufacturer,
    manufacturerSlug: dummy?.manufacturerSlug || "",
    category: api.category || dummy?.category || "Other",
    availability: api.availability || dummy?.availability || "Announced",
    price: api.price || dummy?.price || null,
    year: api.year || dummy?.year || "—",
    month: dummy?.month || api.month || api.year || "—",
    description: api.description || dummy?.description || "",
    imageUrl: api.imageUrl || dummy?.imageUrl || "",
    manufacturerLogoUrl: dummy?.manufacturerLogoUrl || getFaviconUrl(manufacturer, slug),
    mainTask,
    mainTaskColor: getMainTaskColor(mainTask),
    formFactor: api.formFactor || dummy?.formFactor || null,
    country: api.country || dummy?.country || null,
    ram: api.ram || dummy?.ram || null,
    aiFeatures: api.aiFeatures || dummy?.aiFeatures || [],
    primaryUseCases: api.primaryUseCases || dummy?.primaryUseCases || [],
    additionalInfo: api.additionalInfo || dummy?.additionalInfo || null,
    buyUrl: api.buyUrl || dummy?.buyUrl || null,
    images: api.images || dummy?.images || [],
    videoUrl: api.videoUrl || dummy?.videoUrl || null,
    longDescription: dummy?.longDescription ?? null,
    processor: api.processor || dummy?.processor || null,
    storage: api.storage || dummy?.storage || null,
    battery: api.battery || dummy?.battery || null,
    display: api.display || dummy?.display || null,
    connectivity: api.connectivity || dummy?.connectivity || null,
    weight: api.weight || dummy?.weight || null,
    aiModel: api.aiModel || dummy?.aiModel || null,
    processingType: api.processingType || dummy?.processingType || null,
    bestFor: api.bestFor || dummy?.bestFor || null,
    score: api.score ?? dummy?.score ?? null,
    verdict: api.verdict || dummy?.verdict || null,
  } as DeviceData;
}

// ─── sub-components ──────────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, title, badge, color = "#6E56CF" }: {
  icon: any; title: string; badge?: string; color?: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-[#232326]/50 pb-3">
      <div className="flex items-center gap-2.5">
        <Icon size={13} style={{ color }} className="shrink-0" />
        <h2 className="text-sm font-bold text-white uppercase tracking-wide">{title}</h2>
      </div>
      {badge && (
        <span className="text-[10px] font-mono text-[#52525B] bg-[#131316] border border-[#232326] rounded-full px-2 py-0.5">
          {badge}
        </span>
      )}
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-[#1e1e24] transition-colors border-b border-[#1a1a1e] last:border-0 text-xs">
      <span className="text-[#52525B] shrink-0">{label}</span>
      <span className="font-semibold text-white capitalize text-right ml-4">{value}</span>
    </div>
  );
}

function BookmarkButton({ slug, name }: { slug: string; name: string }) {
  const [saved, setSaved] = React.useState(false);
  return (
    <button onClick={() => setSaved(v => !v)} title="Bookmark"
      className={`flex items-center justify-center rounded-xl border py-2.5 px-3 transition-all ${saved ? "bg-[#6E56CF] text-white border-[#6E56CF]" : "border-[#232326] bg-[#0d0d10] text-white hover:border-[#6E56CF]/30"}`}>
      <Bookmark size={13} className={saved ? "fill-white" : ""} />
    </button>
  );
}

function ShareButton({ slug, name }: { slug: string; name: string }) {
  const [copied, setCopied] = React.useState(false);
  function share() {
    const url = `${window.location.origin}/devices/${slug}`;
    if (navigator.share) navigator.share({ title: name, url });
    else navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }
  return (
    <button onClick={share} title={copied ? "Copied!" : "Share"}
      className="flex items-center justify-center rounded-xl border border-[#232326] bg-[#0d0d10] py-2.5 px-3 text-[#71717A] hover:text-white hover:border-white/10 transition-all">
      {copied
        ? <Check size={13} className="text-[#4ade80]" />
        : <Share2 size={13} />}
    </button>
  );
}

function DeviceImage({ name, imageUrl, color }: { name: string; imageUrl: string; color: string }) {
  const [failed, setFailed] = React.useState(false);
  if (!imageUrl || failed) {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ background: `${color}22` }}>
        <span className="text-6xl font-black uppercase" style={{ color }}>{name.charAt(0)}</span>
      </div>
    );
  }
  return <img src={imageUrl} alt={name} className="w-full h-full object-contain p-2" onError={() => setFailed(true)} />;
}

// Alternative device card — matches AltCard from tools but with image banner
function AltDeviceCard({ device, index = 0 }: { device: DeviceData; index?: number }) {
  const [imgFailed, setImgFailed] = React.useState(false);
  const s = ALT_CARD_STYLES[index % ALT_CARD_STYLES.length];

  return (
    <Link
      href={`/devices/${device.slug || device.id}`}
      onMouseEnter={() => prefetchUrl(`${API_URL}/api/v1/devices/${device.slug || device.id}`)}
      className="group flex flex-col h-full rounded-xl border border-[#232326] overflow-hidden transition-all duration-200 hover:border-[#6E56CF]/40 hover:shadow-xl hover:shadow-[#6E56CF]/8 hover:-translate-y-0.5 bg-[#0a0a0d]"
    >
      {/* Banner with image */}
      <div className="relative h-28 shrink-0 overflow-hidden bg-white">
        {/* Gradient orbs */}
        <div className={`absolute ${s.orb1} rounded-full blur-2xl pointer-events-none`}
          style={{ background: `${s.c1}40` }} />
        <div className={`absolute ${s.orb2} rounded-full blur-xl pointer-events-none`}
          style={{ background: `${s.c2}20` }} />
        {/* Fade bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#0a0a0d] to-transparent z-10" />
        {/* Device image */}
        {device.imageUrl && !imgFailed ? (
          <img src={device.imageUrl} alt={device.name}
            className="w-full h-full object-contain p-2"
            onError={() => setImgFailed(true)} />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: `${device.mainTaskColor}18` }}>
            <span className="text-4xl font-black" style={{ color: device.mainTaskColor }}>{device.name.charAt(0)}</span>
          </div>
        )}
        {/* Manufacturer logo bottom-left */}
        <div className="absolute bottom-3 left-3 z-20">
          <div className="h-8 w-8 rounded-lg border border-white/20 bg-white shadow-md overflow-hidden flex items-center justify-center">
            <img src={device.manufacturerLogoUrl} alt={device.manufacturer}
              className="h-6 w-6 object-contain"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1 min-h-[120px]">
        <p className="text-[13px] font-bold text-white truncate group-hover:text-[#A78BFA] transition-colors leading-tight">{device.name}</p>
        {device.manufacturer && <p className="text-[11px] text-[#52525B] truncate mt-0.5">{device.manufacturer}</p>}
        <p className="text-[11px] text-[#71717A] line-clamp-2 leading-snug mt-1.5 flex-1">{device.description}</p>
        {/* bottom row */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1a1a1e] group-hover:border-transparent transition-colors duration-200">
          <div className="flex items-center gap-1 flex-wrap">
                       {device.category && (
              <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full shrink-0 text-[#d4d4d8] bg-white/8 border border-white/15">
                {device.category}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold text-[#4ade80] shrink-0">{device.price || "N/A"}</span>
        </div>
      </div>
    </Link>
  );
}

function DeviceGallery({ name, imageUrl, images, videoUrl, color }: {
  name: string; imageUrl: string; images?: string[]; videoUrl?: string | null; color: string;
}) {
  const allImages = images && images.length > 0 ? images : imageUrl ? [imageUrl] : [];
  const mediaItems = [
    ...(videoUrl ? [{ type: "video" as const, src: videoUrl }] : []),
    ...allImages.map(src => ({ type: "image" as const, src })),
  ];
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [imgFailed, setImgFailed] = React.useState<Record<number, boolean>>({});

  if (mediaItems.length === 0) {
    return (
      <div className="rounded-xl border border-[#232326] flex items-center justify-center bg-white" style={{ minHeight: 340 }}>
        <span className="text-[100px] font-black uppercase leading-none" style={{ color }}>{name.charAt(0)}</span>
      </div>
    );
  }

  function getYoutubeEmbedUrl(url: string) {
    const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return m ? `https://www.youtube.com/embed/${m[1]}` : url;
  }

  const active = mediaItems[activeIdx];
  return (
          <div className="w-full flex flex-col">
      <div className="relative rounded-xl border border-[#232326] bg-white overflow-hidden flex items-center justify-center" style={{ height: 350, maxHeight: 350 }}>
        {active.type === "video" ? (
          <iframe src={getYoutubeEmbedUrl(active.src)} className="w-full" style={{ minHeight: 340 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        ) : imgFailed[activeIdx] ? (
          <div className="w-full flex items-center justify-center py-20" style={{ background: `${color}18`, minHeight: 340 }}>
            <span className="text-[80px] font-black uppercase" style={{ color }}>{name.charAt(0)}</span>
          </div>
        ) : (
          <img src={active.src} alt={`${name} ${activeIdx + 1}`}
            className="w-full h-full object-contain" style={{ maxHeight: 440, background: "#fff" }}
            onError={() => setImgFailed(p => ({ ...p, [activeIdx]: true }))} />
        )}
        {mediaItems.length > 1 && (
          <>
            <button onClick={() => setActiveIdx(i => i === 0 ? mediaItems.length - 1 : i - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button onClick={() => setActiveIdx(i => i === mediaItems.length - 1 ? 0 : i + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </>
        )}
      </div>
      {mediaItems.length > 1 && (
               <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
          {mediaItems.map((item, idx) => (
            <button key={idx} onClick={() => setActiveIdx(idx)}
              className={`shrink-0 w-16 h-13 rounded-lg overflow-hidden border-2 transition-all ${activeIdx === idx ? "border-[#6E56CF]" : "border-[#232326] hover:border-[#52525B]"}`}>
              {item.type === "video"
                ? <div className="w-full h-full bg-[#18181C] flex items-center justify-center"><svg width="14" height="14" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg></div>
                : <img src={item.src} alt="" className="w-full h-full object-cover bg-white" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export function DeviceDetailClient() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: deviceDetailData, isLoading } = useQuery({
    queryKey: ["device-detail", slug],
    queryFn: async () => {
      try {
        let apiData: Device | null = null;
        try {
          apiData = await fetchDeviceById(slug);
          if (!apiData) {
            const all = await fetchAllDevices();
            apiData = all.find((d: Device) => d.id === slug || d.slug === slug) || null;
          }
        } catch { apiData = null; }

        const merged = mergeDevice(apiData, slug);
        if (!merged) return { device: null, similar: [] };

        const allApiDevices = await fetchAllDevices().catch(() => []);
        let similarDevices: DeviceData[] = [];
        if (allApiDevices?.length > 0) {
          similarDevices = allApiDevices
            .filter((d: Device) => d.id !== merged.id && d.category === merged.category)
            .slice(0, 5)
            .map((api: Device) => {
              const dummy = DEVICES_DATA.find(d => d.id === api.id || d.slug === api.slug);
              const mainTask = api.mainTask || dummy?.mainTask || "Device";
              const dSlug = dummy?.slug || api.slug || api.id;
              const manufacturer = api.manufacturer || dummy?.manufacturer || "—";
              return {
                id: api.id, slug: dSlug, name: api.name, manufacturer,
                manufacturerSlug: dummy?.manufacturerSlug || "",
                category: api.category || dummy?.category || "Other",
                availability: api.availability || dummy?.availability || "Announced",
                price: api.price || dummy?.price || null,
                year: api.year || dummy?.year || "—",
                month: dummy?.month || api.month || api.year || "—",
                description: api.description || dummy?.description || "",
                imageUrl: api.imageUrl || dummy?.imageUrl || "",
                manufacturerLogoUrl: dummy?.manufacturerLogoUrl || getFaviconUrl(manufacturer, dSlug),
                mainTask, mainTaskColor: getMainTaskColor(mainTask),
                formFactor: api.formFactor || dummy?.formFactor || null,
                country: api.country || dummy?.country || null,
                ram: api.ram || dummy?.ram || null,
                aiFeatures: api.aiFeatures || dummy?.aiFeatures || [],
                primaryUseCases: api.primaryUseCases || dummy?.primaryUseCases || [],
                additionalInfo: api.additionalInfo || dummy?.additionalInfo || null,
                buyUrl: api.buyUrl || dummy?.buyUrl || null,
              } as DeviceData;
            });
        } else {
          similarDevices = getSimilarDevices(merged, 5);
        }
        return { device: merged, similar: similarDevices };
      } catch {
        const dummy = getDeviceBySlug(slug);
        return { device: dummy, similar: dummy ? getSimilarDevices(dummy, 5) : [] };
      }
    },
    staleTime: 10 * 60 * 1000,
  });

  const device = deviceDetailData?.device || null;
  const similar = deviceDetailData?.similar || [];

  // ── loading ──
  if (isLoading) return (
    <main className="mx-auto max-w-[1400px] px-4 py-8 md:px-6 animate-pulse space-y-5">
      <div className="h-4 w-32 rounded bg-[#232326]" />
      <div className="h-52 rounded-2xl bg-[#131316] border border-[#232326]" />
      <div className="grid lg:grid-cols-[1fr_300px] gap-5">
        <div className="space-y-4">
          <div className="h-40 rounded-xl bg-[#131316] border border-[#232326]" />
          <div className="h-40 rounded-xl bg-[#131316] border border-[#232326]" />
        </div>
        <div className="space-y-4">
          <div className="h-40 rounded-xl bg-[#131316] border border-[#232326]" />
          <div className="h-40 rounded-xl bg-[#131316] border border-[#232326]" />
        </div>
      </div>
    </main>
  );

  if (!device) return (
    <main className="mx-auto max-w-[1400px] px-4 py-20 text-center">
      <p className="text-[#52525B]">Device not found.</p>
      <Link href="/devices" className="text-[#6E56CF] text-sm mt-4 inline-block hover:underline">← Back to Devices</Link>
    </main>
  );

    const accentColor = "#6E56CF";
  const displayDescription = device.longDescription || device.additionalInfo || device.description;

  // specs for sidebar
  const specs = [
    device.formFactor ? { label: "Form Factor", value: device.formFactor } : null,
    device.processor  ? { label: "Processor",   value: device.processor }  : null,
    device.ram        ? { label: "RAM",          value: device.ram }        : null,
    device.storage    ? { label: "Storage",      value: device.storage }    : null,
    device.battery    ? { label: "Battery",      value: device.battery }    : null,
    device.display    ? { label: "Display",      value: device.display }    : null,
    device.weight     ? { label: "Weight",       value: device.weight }     : null,
    device.country    ? { label: "Made in",      value: device.country }    : null,
    { label: "Released", value: device.month || device.year || "—" },
    device.processingType ? { label: "Processing", value: device.processingType } : null,
    device.aiModel ? { label: "AI Model", value: device.aiModel } : null,
    device.price ? { label: "Price", value: device.price } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <main className="mx-auto max-w-[1400px] px-4 pt-2 pb-8 md:px-6 text-white">

      {/* Breadcrumb */}
      <nav className="mb-3 text-xs font-semibold text-[#52525B] flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>›</span>
        <Link href="/devices" className="hover:text-white transition-colors">Devices</Link>
        {device.manufacturer && <><span>›</span><span className="text-[#71717A]">{device.manufacturer}</span></>}
        <span>›</span>
        <span className="text-[#A1A1AA]">{device.name}</span>
      </nav>

      {/* ── HERO ── */}
      <header className="relative rounded-2xl border border-[#1e1e22] bg-[#09090c] overflow-hidden mb-5">
        {/* bg effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#6E56CF]/8 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6E56CF]/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6E56CF]/10 to-transparent" />
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#6E56CF]/6 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-0 bottom-0 w-64 h-64 bg-[#6E56CF]/3 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-transparent to-transparent pointer-events-none" />

        <div className="relative p-4 md:p-5">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1px_420px] gap-0 items-stretch">

            {/* LEFT — gallery */}
            <div className="lg:pr-6 flex flex-col">
              <DeviceGallery
                name={device.name}
                imageUrl={device.imageUrl}
                images={device.images}
                videoUrl={device.videoUrl}
                color={accentColor}
              />
            </div>{/* end gallery wrapper */}

            {/* vertical divider — desktop only */}
            <div className="hidden lg:block self-stretch w-px bg-gradient-to-b from-transparent via-[#ffffff12] to-transparent mx-0" />

            {/* RIGHT — info */}
            <div className="flex flex-col gap-4 lg:pl-6">

              {/* Category badge + actions */}
<div className="flex items-center justify-between">
  
  {/* Category badge */}
  <span
    className="text-[10px] font-mono font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border"
    style={{
      color: accentColor,
      borderColor: `${accentColor}40`,
      background: `${accentColor}12`,
    }}
  >
    {device.category || "Device"}
  </span>

  {/* Bookmark + Share */}
  <div className="flex items-center gap-3">
    <BookmarkButton
      slug={device.slug || device.id}
      name={device.name}
    />

    <ShareButton
      slug={device.slug || device.id}
      name={device.name}
    />
  </div>

</div>

              {/* Name + manufacturer */}
              <div>
                <h1 className="text-[28px] font-black text-white tracking-tight leading-tight">{device.name}</h1>
                {device.manufacturer && (
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="h-5 w-5 rounded bg-white flex items-center justify-center overflow-hidden shrink-0">
                      <img src={device.manufacturerLogoUrl} alt={device.manufacturer}
                        className="h-4 w-4 object-contain"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                    </div>
                    <span className="text-sm text-[#71717A]">by <span className="text-[#A1A1AA] font-medium">{device.manufacturer}</span></span>
                  </div>
                )}
              </div>

              {/* Price + availability */}
              <div className="flex items-center gap-3 py-3 border-y border-[#1a1a1e]">
                <span className="text-2xl font-black text-white">{device.price || "N/A"}</span>
                {device.availability && (
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${AVAILABILITY_STYLES[device.availability]}`}>
                    {device.availability}
                  </span>
                )}
              </div>

              {/* Short description */}
              <p className="text-sm text-[#A1A1AA] leading-relaxed">{device.description}</p>

              {/* processingType + bestFor */}
              {(device.processingType || (device.bestFor && device.bestFor.length > 0)) && (
                <div className="flex flex-wrap gap-1.5">
                  {device.processingType && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border cursor-default transition-colors duration-200 hover:brightness-150"
                      style={{ color: accentColor, borderColor: `${accentColor}40`, background: `${accentColor}12` }}>
                      <Zap size={8} /> {device.processingType}
                    </span>
                  )}
                  {device.bestFor?.map(b => (
                    <span key={b} className="text-[10px] font-mono px-2.5 py-1 rounded-full border border-[#232326] bg-[#131316] text-[#71717A] cursor-default transition-colors duration-200 hover:text-white hover:border-[#52525B]">
                      {b}
                    </span>
                  ))}
                </div>
              )}

              {/* Quick stat pills */}
              <div className="grid grid-cols-3 gap-2">
                {device.formFactor && (
                  <div className="flex flex-col gap-0.5 rounded-lg bg-[#111114] border border-[#1e1e22] px-3 py-2 cursor-default transition-colors duration-200 hover:border-[#3a3a3e] hover:bg-[#17171a]">
                    <span className="text-[9px] font-mono text-[#52525B] uppercase tracking-wider">Form</span>
                    <span className="text-[11px] font-semibold text-white">{ device.formFactor}</span>
                  </div>
                )}
                <div className="flex flex-col gap-0.5 rounded-lg bg-[#111114] border border-[#1e1e22] px-3 py-2 cursor-default transition-colors duration-200 hover:border-[#3a3a3e] hover:bg-[#17171a]">
                  <span className="text-[9px] font-mono text-[#52525B] uppercase tracking-wider">Released</span>
                  <span className="text-[11px] font-semibold text-white">{device.month || device.year || "—"}</span>
                </div>
                {device.country && (
                  <div className="flex flex-col gap-0.5 rounded-lg bg-[#111114] border border-[#1e1e22] px-3 py-2 cursor-default transition-colors duration-200 hover:border-[#3a3a3e] hover:bg-[#17171a]">
                    <span className="text-[9px] font-mono text-[#52525B] uppercase tracking-wider">Made in</span>
                    <span className="text-[11px] font-semibold text-white">{device.country}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {device.buyUrl && (
                  <a href={device.buyUrl} target="_blank" rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl text-white text-sm font-extrabold px-5 py-3 transition-all hover:opacity-90 active:scale-[0.98] shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`, boxShadow: `0 4px 20px ${accentColor}30` }}>
                    <ArrowUpRight size={14} strokeWidth={2.5} /> Learn More
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── BODY: left main + right sidebar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">

        {/* ── LEFT ── */}
        <div className="space-y-4 min-w-0">

          {/* Overview / About */}
          <section className="rounded-xl border border-[#1e1e22] bg-[#09090c] p-5 space-y-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-2xl pointer-events-none bg-blue-600/6" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full blur-2xl pointer-events-none bg-indigo-600/5" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-transparent to-transparent pointer-events-none" />
            <SectionHeader icon={FileText} title="About this Device" color={accentColor} />
            <div className="text-[13px] leading-relaxed text-[#A1A1AA] space-y-2.5">
              {(device.longDescription || device.additionalInfo || device.description)
                .split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
            </div>
            {/* connectivity + category + mainTask tags */}
            <div className="pt-3 border-t border-[#232326]/60 space-y-2.5">
              {device.connectivity && device.connectivity.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-mono text-[#52525B] uppercase tracking-widest shrink-0">Connectivity</span>
                  <span className="text-[#2a2a2e]">·</span>
                                   {device.connectivity.map(c => (
                    <span key={c} className="rounded-md border border-[#232326] bg-[#131316] px-2.5 py-1 text-[11px] font-mono font-semibold text-[#A1A1AA] cursor-default transition-colors duration-200 hover:text-white hover:border-[#52525B]">
                      {c}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-mono text-[#52525B] uppercase tracking-widest shrink-0">Category</span>
                <span className="text-[#2a2a2e]">·</span>
                <span className="rounded-md border border-[#232326] bg-[#131316] px-2.5 py-1 text-[11px] font-semibold text-[#A1A1AA] cursor-default transition-colors duration-200 hover:text-white hover:border-[#52525B] leading-none">
                  {device.category}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-mono text-[#52525B] uppercase tracking-widest shrink-0">Tags</span>
                <span className="text-[#2a2a2e]">·</span>
                {[device.mainTask, device.formFactor, device.processingType].filter(Boolean).map(tag => (
                  <span key={tag} className="rounded-md border border-[#232326] bg-[#131316] px-2.5 py-1 text-[11px] font-mono font-semibold text-[#71717A] cursor-default transition-colors duration-200 hover:text-white hover:border-[#52525B] leading-none">
                    #{tag}
                  </span>
                ))}
                {device.bestFor?.map(tag => (
                  <span key={tag} className="rounded-md border border-[#232326] bg-[#131316] px-2.5 py-1 text-[11px] font-mono font-semibold text-[#71717A] cursor-default transition-colors duration-200 hover:text-white hover:border-[#52525B] leading-none">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </section>

                   {/* Specs — mobile only */}
          <section className="rounded-xl border border-[#1e1e22] bg-[#09090c] p-4 relative overflow-hidden lg:hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
            <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full blur-2xl pointer-events-none bg-blue-600/6" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-transparent to-transparent pointer-events-none" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wide border-b border-[#232326]/50 pb-3 mb-1 flex items-center gap-2.5">
              <Cpu size={13} style={{ color: accentColor }} /> Specifications
            </h3>
            {specs.map(row => <SpecRow key={row.label} label={row.label} value={row.value} />)}
          </section>

          {/* Key Features */}
          {device.aiFeatures && device.aiFeatures.length > 0 && (
            <section className="rounded-xl border border-[#232326]/40 bg-[#0a0a0c]/60 p-5 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${accentColor}50, transparent)` }} />
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl pointer-events-none"
                style={{ background: `${accentColor}10` }} />
              <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full blur-3xl pointer-events-none"
                style={{ background: `${accentColor}07` }} />
              {/* glass sheen */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-transparent to-transparent pointer-events-none" />
              <SectionHeader icon={Zap} title="Key Features" color={accentColor} badge={`${device.aiFeatures.length} features`} />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-10">
                {device.aiFeatures.map((feat, i) => (
                  <div key={i}
                    className="group/feat flex items-start gap-2.5 py-2.5 border-b border-[#ffffff08] last:border-0 sm:[&:nth-last-child(2):nth-child(odd)]:border-0 rounded-lg px-2 -mx-2 hover:bg-[#ffffff04] transition-colors cursor-default">
                    <svg className="shrink-0 mt-[3px]" width="9" height="9" viewBox="0 0 10 10" fill="none">
                      <polygon points="0,0 10,5 0,10 3,5" fill={accentColor} />
                    </svg>
                    <p className="text-[13px] font-medium text-[#A1A1AA] group-hover/feat:text-white transition-colors leading-snug">{feat}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Use Cases */}
          {device.primaryUseCases && device.primaryUseCases.length > 0 && (
            <section className="rounded-xl border border-[#232326]/40 bg-[#0a0a0c]/60 p-5 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)` }} />
              <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full blur-3xl pointer-events-none"
                style={{ background: `${accentColor}10` }} />
              <div className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full blur-3xl pointer-events-none"
                style={{ background: `${accentColor}07` }} />
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-transparent to-transparent pointer-events-none" />
              <SectionHeader icon={ListChecks} title="Use Cases" color={accentColor} badge={`${device.primaryUseCases.length} tasks`} />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-10">
                {device.primaryUseCases.map((u, i) => (
                  <div key={i}
                    className="group flex items-center gap-2.5 py-2.5 border-b border-[#ffffff08] last:border-0 sm:[&:nth-last-child(2):nth-child(odd)]:border-0">
                    <svg className="shrink-0 mt-[1px] group-hover:fill-[#A78BFA] transition-colors" width="9" height="9" viewBox="0 0 10 10" fill="none">
                      <polygon points="0,0 10,5 0,10 3,5" fill={accentColor} />
                    </svg>
                    <span className="text-[13px] font-medium text-[#A1A1AA] group-hover:text-white transition-colors leading-snug">{u}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

                    {/* Verdict */}
          {device.verdict && (
            <section className="relative overflow-hidden rounded-xl border border-[#6E56CF]/20 bg-gradient-to-br from-[#6E56CF]/5 to-transparent p-4 shadow-xl shadow-black/20">
              <div className="absolute right-0 top-0 -mr-6 -mt-6 h-24 w-24 rounded-full bg-[#6E56CF]/10 blur-xl pointer-events-none" />
              <div className="flex items-center gap-2.5 mb-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#6E56CF]/15 shrink-0">
                  <Sparkles size={11} className="text-[#6E56CF]" />
                </span>
                <div className="flex items-center justify-between flex-1">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wide">AI Verdict</h4>
                  {device.score != null && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full text-[#6E56CF]"
                      style={{ background: "#6E56CF18", border: "1px solid #6E56CF30" }}>
                      Score: {device.score}/100
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm leading-relaxed text-[#A1A1AA]">{device.verdict}</p>
            </section>
          )}
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <aside className="space-y-4">

          {/* Specs — desktop */}
          <section className="hidden lg:block rounded-xl border border-[#1e1e22] bg-[#09090c] p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
            <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full blur-2xl pointer-events-none bg-blue-600/6" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-transparent to-transparent pointer-events-none" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wide border-b border-[#232326]/50 pb-3 mb-1 flex items-center gap-2.5">
              <Cpu size={13} style={{ color: accentColor }} /> Specifications
            </h3>
            {specs.map(row => <SpecRow key={row.label} label={row.label} value={row.value} />)}
          </section>

                    {/* Manufacturer */}
          <section className="rounded-xl border border-[#1e1e22] bg-[#09090c] p-4 space-y-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
            <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full blur-3xl pointer-events-none bg-indigo-600/5" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-transparent to-transparent pointer-events-none" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wide border-b border-[#232326]/50 pb-3 flex items-center gap-2.5">
              <ShieldCheck size={13} style={{ color: accentColor }} /> Manufacturer
            </h3>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl border border-[#232326] bg-white flex items-center justify-center overflow-hidden p-1 shrink-0">
                <img src={device.manufacturerLogoUrl} alt={device.manufacturer}
                  className="h-8 w-8 object-contain"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{device.manufacturer || "—"}</p>
                {device.country && <p className="text-[11px] text-[#71717A]">{device.country}</p>}
              </div>
            </div>
          </section>

        </aside>
      </div>

      {/* ── SIMILAR DEVICES — full width below grid ── */}
      {similar.length > 0 && (
        <section className="mt-7 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-s font-bold text-[#71717A] uppercase tracking-wider flex items-center gap-2">
              <Layers size={20} className="text-[#6E56CF]/60" /> SIMILAR DEVICES
            </h2>
            <Link href="/devices" className="inline-flex items-center gap-1 text-xs font-bold text-[#6E56CF] hover:underline">
              View all <ArrowRight size={11} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 items-stretch">
            {similar.slice(0, 5).map((d, i) => (
              <AltDeviceCard key={d.id} device={d} index={i} />
            ))}
          </div>
        </section>
      )}

    </main>
  );
}