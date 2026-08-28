"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { fetchAllDevices, fetchDeviceById, API_URL, prefetchUrl } from "@/lib/api";
import { Device } from "@/lib/types";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DEVICES_DATA, DeviceData, getDeviceBySlug, getSimilarDevices, getMainTaskColor } from "@/data/devices";

const AVAILABILITY_STYLES: Record<string, string> = {
  Available: "bg-[#1a3a2a] text-[#4ade80] border border-[#2a5a3a]",
  "Pre-order": "bg-[#1a2a3a] text-[#60a5fa] border border-[#2a3a5a]",
  Announced: "bg-[#2a2a1a] text-[#facc15] border border-[#4a4a2a]",
  Discontinued: "bg-[#3a1a1a] text-[#f87171] border border-[#5a2a2a]",
};

const ROW_ACCENT_COLORS = [
  "#6E56CF", "#E85D4A", "#0082FB", "#34A853",
  "#FF9900", "#E91E8C", "#00BCD4", "#FF6B35",
];

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
  } as DeviceData;
}

export function DeviceDetailClient() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: deviceDetailData, isLoading: loading } = useQuery({
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
        } catch {
          apiData = null;
        }

        const merged = mergeDevice(apiData, slug);
        if (!merged) return { device: null, similar: [] };

        const allApiDevices = await fetchAllDevices().catch(() => []);
        let similarDevices: DeviceData[] = [];
        if (allApiDevices && allApiDevices.length > 0) {
          similarDevices = allApiDevices
            .filter((d: Device) => d.id !== merged.id && d.category === merged.category)
            .slice(0, 4)
            .map((api: Device) => {
              const dummy = DEVICES_DATA.find((d) => d.id === api.id || d.slug === api.slug);
              const mainTask = api.mainTask || dummy?.mainTask || "Device";
              const dSlug = dummy?.slug || api.slug || api.id;
              const manufacturer = api.manufacturer || dummy?.manufacturer || "—";
              return {
                id: api.id,
                slug: dSlug,
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
                manufacturerLogoUrl: dummy?.manufacturerLogoUrl || getFaviconUrl(manufacturer, dSlug),
                mainTask,
                mainTaskColor: getMainTaskColor(mainTask),
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
          similarDevices = getSimilarDevices(merged);
        }
        return { device: merged, similar: similarDevices };
      } catch {
        const dummy = getDeviceBySlug(slug);
        return { device: dummy, similar: dummy ? getSimilarDevices(dummy) : [] };
      }
    },
    staleTime: 10 * 60 * 1000,
  });

  const device = deviceDetailData?.device || null;
  const similar = deviceDetailData?.similar || [];

  if (loading) {
    return (
      <div className="flex flex-col flex-1">

        <main className="w-full px-6 md:px-10 py-10 flex-1">
          <div className="h-6 w-48 animate-pulse bg-[#131316] rounded mb-8" />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="h-80 animate-pulse bg-[#131316] rounded-xl border border-[#232326]" />
            <div className="h-80 animate-pulse bg-[#131316] rounded-xl border border-[#232326]" />
          </div>
        </main>
  
      </div>
    );
  }

  if (!device) {
    return (
      <div className="flex flex-col flex-1">

        <main className="w-full px-6 md:px-12 py-20 text-center flex-1">
          <p className="text-[#52525B]">Device not found.</p>
          <Link href="/devices" className="text-[#6E56CF] text-sm mt-4 inline-block hover:underline">
            ← Back to Devices
          </Link>
        </main>
  
      </div>
    );
  }

  const accentColor = device.mainTaskColor || "#6E56CF";

  return (
    <div className="flex flex-col flex-1 bg-[#000000] text-white">


      {/* Hero accent bar */}
      <div className="w-full h-px" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}80, transparent)` }} />

      <main className="mx-auto max-w-[1400px] px-4 md:px-6 py-8 flex-1 w-full">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-[#52525B] mb-6 flex-wrap">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span className="text-[#333]">›</span>
          <Link href="/devices" className="hover:text-white transition-colors">Devices</Link>
          {device.manufacturer && <><span className="text-[#333]">›</span><span className="text-[#71717A]">{device.manufacturer}</span></>}
          <span className="text-[#333]">›</span>
          <span className="text-white font-medium">{device.name}</span>
        </nav>

        {/* ── TOP GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 mb-6 items-start">

          {/* LEFT: Gallery */}
          <DeviceGallery
            name={device.name}
            imageUrl={device.imageUrl}
            images={device.images}
            videoUrl={device.videoUrl}
            color={accentColor}
          />

          {/* RIGHT: Info panel */}
          <div className="flex flex-col gap-0 rounded-2xl border border-[#232326] bg-[#0A0A0C] overflow-hidden">

            {/* Top color band */}
            <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}44)` }} />

            <div className="p-5 flex flex-col gap-4">

              {/* Category + actions row */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full border"
                  style={{ color: accentColor, borderColor: `${accentColor}40`, background: `${accentColor}12` }}>
                  {device.category || "Device"}
                </span>
                <div className="flex items-center gap-1.5">
                  <BookmarkButton slug={device.slug || device.id} name={device.name} />
                  <ShareButton slug={device.slug || device.id} name={device.name} />
                </div>
              </div>

              {/* Name */}
              <div>
                <h1 className="text-[26px] font-black text-white tracking-tight leading-tight">{device.name}</h1>
                {device.manufacturer && (
                  <div className="flex items-center gap-2 mt-2">
                    {device.manufacturerLogoUrl && (
                      <div className="h-5 w-5 rounded bg-white flex items-center justify-center overflow-hidden shrink-0">
                        <img src={device.manufacturerLogoUrl} alt={device.manufacturer} className="h-4 w-4 object-contain" />
                      </div>
                    )}
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

              {/* Description */}
              <p className="text-sm text-[#A1A1AA] leading-relaxed">{device.description}</p>

              {/* Quick stats: always 2-col grid */}
              <div className="grid grid-cols-2 gap-2">
                {device.formFactor && (
                  <div className="flex flex-col gap-0.5 rounded-lg bg-[#111114] border border-[#1e1e22] px-3 py-2">
                    <span className="text-[9px] font-mono text-[#52525B] uppercase tracking-wider">Form</span>
                    <span className="text-[11px] font-semibold text-white">{device.formFactor}</span>
                  </div>
                )}
                <div className="flex flex-col gap-0.5 rounded-lg bg-[#111114] border border-[#1e1e22] px-3 py-2">
                  <span className="text-[9px] font-mono text-[#52525B] uppercase tracking-wider">Released</span>
                  <span className="text-[11px] font-semibold text-white">{device.month || device.year || "—"}</span>
                </div>
                {device.country && (
                  <div className="flex flex-col gap-0.5 rounded-lg bg-[#111114] border border-[#1e1e22] px-3 py-2">
                    <span className="text-[9px] font-mono text-[#52525B] uppercase tracking-wider">Made in</span>
                    <span className="text-[11px] font-semibold text-white">{device.country}</span>
                  </div>
                )}
                {device.ram && (
                  <div className="flex flex-col gap-0.5 rounded-lg bg-[#111114] border border-[#1e1e22] px-3 py-2">
                    <span className="text-[9px] font-mono text-[#52525B] uppercase tracking-wider">RAM</span>
                    <span className="text-[11px] font-semibold text-white">{device.ram}</span>
                  </div>
                )}
              </div>

              {/* Buy button */}
              {device.buyUrl && (
                <a
                  href={device.buyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 text-white text-sm font-bold px-5 py-3 rounded-xl transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)` }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  Learn More
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ── SPECS + ABOUT ── */}
        <div className="flex flex-col gap-4 mb-6">

          {/* Specifications */}
          <div className="rounded-2xl border border-[#232326] bg-[#0A0A0C] overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#1a1a1e] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full" style={{ background: accentColor }} />
                <h2 className="text-[10px] font-mono font-bold text-[#71717A] uppercase tracking-widest">Specifications</h2>
              </div>
              <span className="text-[9px] font-mono text-[#333] uppercase tracking-widest">{device.name}</span>
            </div>
            <div className="divide-y divide-[#0f0f12]">
              {device.formFactor && (
                <div className="flex items-center px-5 py-3 hover:bg-[#ffffff03] transition-colors">
                  <span className="text-[11px] text-[#3D3D45] shrink-0 w-32 font-mono">Form factor</span>
                  <span className="text-[12px] font-semibold text-[#E0E0E8]">{device.formFactor}</span>
                </div>
              )}
              {device.ram && (
                <div className="flex items-center px-5 py-3 hover:bg-[#ffffff03] transition-colors">
                  <span className="text-[11px] text-[#3D3D45] shrink-0 w-32 font-mono">RAM</span>
                  <span className="text-[12px] font-semibold text-[#E0E0E8]">{device.ram}</span>
                </div>
              )}
              {device.country && (
                <div className="flex items-center px-5 py-3 hover:bg-[#ffffff03] transition-colors">
                  <span className="text-[11px] text-[#3D3D45] shrink-0 w-32 font-mono">Made in</span>
                  <span className="text-[12px] font-semibold text-[#E0E0E8]">{device.country}</span>
                </div>
              )}
              <div className="flex items-center px-5 py-3 hover:bg-[#ffffff03] transition-colors">
                <span className="text-[11px] text-[#3D3D45] shrink-0 w-32 font-mono">Release date</span>
                <span className="text-[12px] font-semibold text-[#E0E0E8]">{device.month || device.year || "—"}</span>
              </div>
              {device.aiFeatures && device.aiFeatures.length > 0 && (
                <div className="flex items-start px-5 py-3 hover:bg-[#ffffff03] transition-colors">
                  <span className="text-[11px] text-[#3D3D45] shrink-0 w-32 font-mono mt-0.5">AI features</span>
                  <div className="flex flex-wrap gap-1.5">
                    {device.aiFeatures.map((f) => (
                      <span key={f} className="text-[10px] font-mono px-2 py-0.5 rounded-md border border-[#1e1e22] bg-[#111114] text-[#71717A] hover:text-white hover:border-[#333] transition-colors">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {device.primaryUseCases && device.primaryUseCases.length > 0 && (
                <div className="flex items-start px-5 py-3 hover:bg-[#ffffff03] transition-colors">
                  <span className="text-[11px] text-[#3D3D45] shrink-0 w-32 font-mono mt-0.5">Use cases</span>
                  <div className="flex flex-wrap gap-1.5">
                    {device.primaryUseCases.map((u) => (
                      <span key={u}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md border transition-all duration-150 cursor-default"
                        style={{ borderColor: `${accentColor}30`, color: `${accentColor}cc`, background: `${accentColor}0d` }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.borderColor = `${accentColor}70`;
                          el.style.color = accentColor;
                          el.style.background = `${accentColor}20`;
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.borderColor = `${accentColor}30`;
                          el.style.color = `${accentColor}cc`;
                          el.style.background = `${accentColor}0d`;
                        }}>
                        {u}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* About — polished full-width banner */}
          {device.additionalInfo && (
            <div className="rounded-2xl overflow-hidden relative order-first" style={{ border: `1px solid ${accentColor}25` }}>
              {/* Gradient background */}
              <div className="absolute inset-0" style={{ background: `linear-gradient(120deg, ${accentColor}0d 0%, #0A0A0C 60%)` }} />
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, ${accentColor}80, transparent)` }} />
              {/* Left accent bar */}
              <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ background: `linear-gradient(180deg, ${accentColor}, ${accentColor}00)` }} />

              <div className="relative px-6 py-5 flex items-start gap-4">
                {/* Icon */}
                <div className="shrink-0 h-9 w-9 rounded-xl flex items-center justify-center mt-0.5" style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}30` }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: accentColor }}>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-mono font-bold uppercase tracking-[0.15em] mb-2" style={{ color: `${accentColor}90` }}>About this device</p>
                  <p className="text-[13px] text-[#B8B8C0] leading-relaxed">{device.additionalInfo}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── SIMILAR DEVICES ── */}
        {similar.length > 0 && (
          <div className="rounded-2xl border border-[#232326] bg-[#0A0A0C] overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#1a1a1e] flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full" style={{ background: accentColor }} />
              <h2 className="text-[10px] font-mono font-bold text-[#71717A] uppercase tracking-widest">Similar Devices</h2>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {similar.map((d, idx) => {
                const color = ROW_ACCENT_COLORS[idx % ROW_ACCENT_COLORS.length];
                return (
                  <Link
                    key={d.id}
                    href={`/devices/${d.slug || d.id}`}
                    className="group flex gap-4 rounded-2xl bg-[#0D0D0F] p-3 transition-all duration-200 relative overflow-hidden"
                    style={{ boxShadow: '0 0 0 1px #ffffff14' }}
                    onMouseEnter={(e) => {
                      prefetchUrl(`${API_URL}/api/v1/devices/${d.slug || d.id}`);
                      const el = e.currentTarget as HTMLElement;
                      el.style.boxShadow = `0 0 0 1px ${color}30, 0 4px 24px ${color}10`;
                      el.style.background = `${color}06`;
                    }}
                    onTouchStart={() => {
                      prefetchUrl(`${API_URL}/api/v1/devices/${d.slug || d.id}`);
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.boxShadow = '0 0 0 1px #ffffff08';
                      el.style.background = '';
                    }}
                  >
                    {/* Subtle left accent */}
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{ background: color }} />

                    {/* Image */}
                    <div className="h-[100px] w-[100px] shrink-0 rounded-xl overflow-hidden bg-white flex items-center justify-center shadow-sm">
                      <img
                        src={d.imageUrl}
                        alt={d.name}
                        className="w-full h-full object-contain p-1.5"
                        onError={(e) => {
                          const el = e.currentTarget as HTMLImageElement;
                          el.style.display = 'none';
                          const parent = el.parentElement!;
                          parent.style.background = `${d.mainTaskColor}22`;
                          parent.innerHTML = `<span style="color:${d.mainTaskColor};font-size:28px;font-weight:900;">${d.name.charAt(0)}</span>`;
                        }}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div>
                        <p className="text-[13px] font-bold text-white truncate leading-tight transition-colors duration-150"
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = color; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = ''; }}>
                          {d.name}
                        </p>
                        <p className="text-[10px] text-[#3a3a3f] mt-0.5 truncate font-mono">{d.manufacturer} · {d.category}</p>
                        <p className="text-[11px] text-[#52525B] mt-1.5 line-clamp-2 leading-snug">{d.description}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-2.5">
                        {d.availability && (
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${AVAILABILITY_STYLES[d.availability] || "bg-[#232326] text-[#A1A1AA]"}`}>
                            {d.availability}
                          </span>
                        )}
                        {d.price && <span className="text-[10px] font-bold text-[#4ade80]">{d.price}</span>}
                        {d.month && <span className="text-[9px] font-mono text-[#52525B] ml-auto">{d.month}</span>}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </main>

    </div>
  );
}

function BookmarkButton({ slug, name }: { slug: string; name: string }) {
  const [saved, setSaved] = React.useState(false);
  return (
    <button
      onClick={() => setSaved((v) => !v)}
      title="Bookmark"
      className={`p-2 rounded-lg border transition-colors ${saved ? "border-[#6E56CF] text-[#6E56CF] bg-[#6E56CF]/10" : "border-[#232326] text-[#52525B] hover:text-white hover:border-[#52525B]"}`}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
      </svg>
    </button>
  );
}

function ShareButton({ slug, name }: { slug: string; name: string }) {
  const [copied, setCopied] = React.useState(false);
  function share() {
    const url = `${window.location.origin}/devices/${slug}`;
    if (navigator.share) {
      navigator.share({ title: name, url });
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }
  return (
    <button
      onClick={share}
      title={copied ? "Link copied!" : "Share"}
      className="p-2 rounded-lg border border-[#232326] text-[#52525B] hover:text-white hover:border-[#52525B] transition-colors relative"
    >
      {copied ? (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
      )}
    </button>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-4">
      <span className="text-sm text-[#52525B] w-28 shrink-0">{label}</span>
      <span className="text-sm text-white">{value}</span>
    </div>
  );
}

function SpecRowDivider({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-4 px-6 py-4">
      <span className="text-sm text-[#52525B] w-36 shrink-0">{label}</span>
      <span className="text-sm text-white">{value}</span>
    </div>
  );
}

function DeviceGallery({
  name, imageUrl, images, videoUrl, color,
}: {
  name: string;
  imageUrl: string;
  images?: string[];
  videoUrl?: string | null;
  color: string;
}) {
  // Build full media list: video first (if any), then all images
  const allImages = images && images.length > 0 ? images : imageUrl ? [imageUrl] : [];
  const hasVideo = !!videoUrl;

  // media items: { type: 'video'|'image', src: string }
  const mediaItems = [
    ...(hasVideo ? [{ type: 'video' as const, src: videoUrl! }] : []),
    ...allImages.map((src) => ({ type: 'image' as const, src })),
  ];

  const [activeIdx, setActiveIdx] = React.useState(hasVideo ? 0 : 0);
  const [imgFailed, setImgFailed] = React.useState<Record<number, boolean>>({});

  if (mediaItems.length === 0) {
    return (
      <div
        className="rounded-xl border border-[#232326] self-start w-full flex items-center justify-center"
        style={{ background: `${color}18`, minHeight: 320 }}
      >
        <span className="text-[120px] font-black uppercase leading-none" style={{ color }}>
          {name.charAt(0)}
        </span>
      </div>
    );
  }

  const active = mediaItems[activeIdx];
  const showThumbs = mediaItems.length > 1;

  function getYoutubeEmbedUrl(url: string): string {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  }

  function prev() { setActiveIdx((i) => (i === 0 ? mediaItems.length - 1 : i - 1)); }
  function next() { setActiveIdx((i) => (i === mediaItems.length - 1 ? 0 : i + 1)); }

  return (
    <div className="self-start w-full">
      {/* Main display */}
      <div className="relative rounded-xl border border-[#232326] bg-[#0D0D0F] overflow-hidden min-h-[420px] flex items-center justify-center">        {active.type === 'video' ? (
          <iframe
  src={getYoutubeEmbedUrl(active.src)}
  className="w-full"
  style={{ minHeight: 420 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : imgFailed[activeIdx] ? (
          <div className="w-full flex items-center justify-center py-20" style={{ background: `${color}18` }}>
            <span className="text-[80px] font-black uppercase" style={{ color }}>{name.charAt(0)}</span>
          </div>
        ) : (
          <img
  src={active.src}
  alt={`${name} image ${activeIdx + 1}`}
  className="w-full object-contain self-center"
  style={{ minHeight: 420, maxHeight: 420, background: '#fff' }}
  onError={() => setImgFailed((prev) => ({ ...prev, [activeIdx]: true }))}
/>
        )}

        {/* Prev/Next arrows — only if more than 1 media */}
        {mediaItems.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {showThumbs && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-[#232326] [&::-webkit-scrollbar-thumb]:rounded-full">
          {mediaItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`relative shrink-0 w-16 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                activeIdx === idx ? 'border-[#6E56CF]' : 'border-[#232326] hover:border-[#52525B]'
              }`}
            >
              {item.type === 'video' ? (
                <div className="w-full h-full bg-[#18181C] flex flex-col items-center justify-center gap-0.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white" className="opacity-80"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  <span className="text-[8px] text-white/60 font-mono">Video</span>
                </div>
              ) : (
                <img
                  src={item.src}
                  alt={`thumb ${idx}`}
                  className="w-full h-full object-cover bg-white"
                />
              )}
              {activeIdx === idx && (
                <div className="absolute inset-0 bg-[#6E56CF]/10 pointer-events-none" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SimilarDeviceImage({ name, imageUrl, color }: { name: string; imageUrl: string; color: string }) {
  const [failed, setFailed] = React.useState(false);

  if (!imageUrl || failed) {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ background: `${color}22` }}>
        <span className="text-5xl font-black uppercase" style={{ color }}>
          {name.charAt(0)}
        </span>
      </div>
    );
  }

  return (
    <img
  src={imageUrl}
  alt={name}
  className="w-full h-full object-cover object-center scale-105 group-hover:scale-110 transition-transform duration-500"
  onError={() => setFailed(true)}
/>
  );
}