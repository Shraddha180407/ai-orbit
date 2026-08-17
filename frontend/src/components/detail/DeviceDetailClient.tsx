"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchAllDevices, fetchDeviceById } from "@/lib/api";
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
  const [device, setDevice] = useState<DeviceData | null>(null);
  const [similar, setSimilar] = useState<DeviceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // Try API first
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
        setDevice(merged);

        if (merged) {
          // Build similar from API data first, fall back to dummy
          const allApiDevices = await fetchAllDevices().catch(() => []);
          if (allApiDevices && allApiDevices.length > 0) {
            const apiSimilar = allApiDevices
              .filter((d: Device) => d.id !== merged.id && d.category === merged.category)
              .slice(0, 4)
              .map((api: Device) => {
                const dummy = DEVICES_DATA.find((d) => d.id === api.id || d.slug === api.slug);
                const mainTask = api.mainTask || dummy?.mainTask || "Device";
                const slug = dummy?.slug || api.slug || api.id;
                const manufacturer = api.manufacturer || dummy?.manufacturer || "—";
                return {
                  id: api.id,
                  slug,
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
                  manufacturerLogoUrl: dummy?.manufacturerLogoUrl || `https://www.google.com/s2/favicons?sz=64&domain=${manufacturer.toLowerCase().replace(/\s+/g, "")}.com`,
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
            // If not enough same-category devices, fill with other API devices
            if (apiSimilar.length < 4) {
              const others = allApiDevices
                .filter((d: Device) => d.id !== merged.id && d.category !== merged.category)
                .slice(0, 4 - apiSimilar.length)
                .map((api: Device) => {
                  const dummy = DEVICES_DATA.find((d) => d.id === api.id || d.slug === api.slug);
                  const mainTask = api.mainTask || dummy?.mainTask || "Device";
                  const slug = dummy?.slug || api.slug || api.id;
                  const manufacturer = api.manufacturer || dummy?.manufacturer || "—";
                  return {
                    id: api.id,
                    slug,
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
                    manufacturerLogoUrl: dummy?.manufacturerLogoUrl || `https://www.google.com/s2/favicons?sz=64&domain=${manufacturer.toLowerCase().replace(/\s+/g, "")}.com`,
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
              setSimilar([...apiSimilar, ...others]);
            } else {
              setSimilar(apiSimilar);
            }
          } else {
            setSimilar(getSimilarDevices(merged));
          }
        }
      } catch (e) {
        // fallback to dummy only
        const dummy = getDeviceBySlug(slug);
        setDevice(dummy);
        if (dummy) setSimilar(getSimilarDevices(dummy));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#000000] text-white">
        <Header />
        <main className="w-full px-6 md:px-10 py-10 flex-1">
          <div className="h-6 w-48 animate-pulse bg-[#131316] rounded mb-8" />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="h-80 animate-pulse bg-[#131316] rounded-xl border border-[#232326]" />
            <div className="h-80 animate-pulse bg-[#131316] rounded-xl border border-[#232326]" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!device) {
    return (
      <div className="min-h-screen flex flex-col bg-[#000000] text-white">
        <Header />
        <main className="w-full px-6 md:px-12 py-20 text-center flex-1">
          <p className="text-[#52525B]">Device not found.</p>
          <Link href="/devices" className="text-[#6E56CF] text-sm mt-4 inline-block hover:underline">
            ← Back to Devices
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white">
      <Header />
      <main className="mx-auto max-w-[1400px] px-4 md:px-6 py-10 flex-1 w-full">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#52525B] mb-8 flex-wrap">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>›</span>
          {device.manufacturer && <span className="hover:text-white transition-colors">{device.manufacturer}</span>}
          {device.manufacturer && <span>›</span>}
          <Link href="/devices" className="hover:text-white transition-colors">Devices</Link>
          <span>›</span>
          <span className="text-white">{device.name}</span>
        </nav>

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-6 mb-8 items-start">
          {/* Left: Gallery */}
          <DeviceGallery
            name={device.name}
            imageUrl={device.imageUrl}
            images={device.images}
            videoUrl={device.videoUrl}
            color={device.mainTaskColor}
          />
          {/* Right: Info Card */}
          <div className="rounded-xl border border-[#232326] bg-[#0D0D0F] p-4 md:p-6 flex flex-col gap-3">

            {/* Category badge */}
            <div>
              <span className="text-xs bg-[#18181C] border border-[#232326] text-[#A1A1AA] px-2.5 py-1 rounded-full font-mono">
                {device.category || "Device"}
              </span>
            </div>

            {/* Name + Actions */}
            <div className="flex items-start justify-between gap-2">
              <h1 className="text-2xl font-black text-white tracking-tight">{device.name}</h1>
              <div className="flex items-center gap-1.5 shrink-0 mt-1">
                <BookmarkButton slug={device.slug || device.id} name={device.name} />
                <ShareButton slug={device.slug || device.id} name={device.name} />
              </div>
            </div>

            {/* By company */}
            {device.manufacturer && (
              <div className="flex items-center gap-1.5 text-sm text-[#71717A]">
                {device.manufacturerLogoUrl && (
                  <img src={device.manufacturerLogoUrl} alt={device.manufacturer} className="h-4 w-4 object-contain" />
                )}
                by {device.manufacturer}
              </div>
            )}

            {/* Price + Availability */}
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-white">
                {device.price || "N/A"}
              </span>
              {device.availability && (
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${AVAILABILITY_STYLES[device.availability]}`}>
                  {device.availability}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-[#A1A1AA] leading-relaxed">{device.description}</p>

            {/* Form factor + Release date */}
            <div className="flex flex-col gap-2 pt-3 border-t border-[#232326]">
              {device.formFactor && (
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-[#52525B] w-28 shrink-0 flex items-center gap-1.5">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                    Form factor
                  </span>
                  <span className="text-white">{device.formFactor}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <span className="text-[#52525B] w-28 shrink-0 flex items-center gap-1.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                  Release date
                </span>
                <span className="text-white">{device.month || device.year || "—"}</span>
              </div>
            </div>

            {/* Buy button */}
            {device.buyUrl && (
             <a 
                href={device.buyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors w-fit"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                Learn More
              </a>
            )}
          </div>
        </div>

        {/* Specifications */}
        <div className="rounded-xl border border-[#232326] bg-[#0D0D0F] mb-6 overflow-hidden">
          <div className="px-6 py-3 bg-[#131316] border-b border-[#232326]">
            <h2 className="text-xs font-bold text-[#A1A1AA] uppercase tracking-widest">Specifications</h2>
          </div>
          <div className="divide-y divide-[#232326]">
  {device.formFactor && <SpecRowDivider label="Form factor" value={device.formFactor} />}
  {device.ram && <SpecRowDivider label="RAM" value={device.ram} />}
  {device.country && <SpecRowDivider label="Made in" value={device.country} />}
  <SpecRowDivider label="Release date" value={device.month || device.year || "—"} />
            {device.aiFeatures && device.aiFeatures.length > 0 && (
              <div className="flex items-start gap-4 px-6 py-4">
                <span className="text-sm text-[#52525B] w-36 shrink-0">AI features</span>
                <div className="flex flex-wrap gap-2">
                  {device.aiFeatures.map((f) => (
  <span key={f} className="inline-flex items-center rounded-md border border-[#232326]/60 bg-[#18181C] px-2.5 py-0.5 text-[10px] font-mono font-semibold text-[#A1A1AA] hover:border-[#3a3a3d] hover:text-white transition-colors">
    {f}
  </span>
))}
                </div>
              </div>
            )}
            {device.primaryUseCases && device.primaryUseCases.length > 0 && (
              <div className="flex items-start gap-4 px-6 py-4">
                <span className="text-sm text-[#52525B] w-36 shrink-0">Primary use cases</span>
                <div className="flex flex-wrap gap-2">
                  {device.primaryUseCases.map((u) => (
  <span key={u} className="inline-flex items-center rounded-md border border-[#232326]/60 bg-[#18181C] px-2.5 py-0.5 text-[10px] font-mono font-semibold text-[#A1A1AA] hover:border-[#3a3a3d] hover:text-white transition-colors">
    {u}
  </span>
))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        {device.additionalInfo && (
          <div className="rounded-xl border border-[#232326] bg-[#0D0D0F] mb-8 overflow-hidden">
            <div className="px-4 md:px-6 py-3 bg-[#131316] border-b border-[#232326]">
              <h2 className="text-xs font-bold text-[#A1A1AA] uppercase tracking-widest">Additional Information</h2>
            </div>
            <div className="p-4 md:p-6">
              <p className="text-sm text-[#A1A1AA] leading-relaxed">{device.additionalInfo}</p>
            </div>
          </div>
        )}

        {/* Similar Devices */}
        {similar.length > 0 && (
          <div className="mt-8 rounded-xl border border-[#232326] bg-[#0D0D0F] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#232326] flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#6E56CF]"><rect x="2" y="2" width="9" height="9" rx="1"/><rect x="13" y="2" width="9" height="9" rx="1"/><rect x="2" y="13" width="9" height="9" rx="1"/><rect x="13" y="13" width="9" height="9" rx="1"/></svg>
              <h2 className="text-xs font-bold text-[#A1A1AA] uppercase tracking-widest">Similar Devices</h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {similar.map((d, idx) => (
  <Link
    key={d.id}
    href={`/devices/${d.slug || d.id}`}
    className="rounded-xl border border-[#232326] bg-[#0D0D0F] transition-all group overflow-hidden"
    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${ROW_ACCENT_COLORS[idx % ROW_ACCENT_COLORS.length]}60`; }}
    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = ''; }}
  >
                  {/* Image with overlays */}
                  <div className="relative h-52 bg-[#18181C] flex items-center justify-center overflow-hidden">
                    <SimilarDeviceImage name={d.name} imageUrl={d.imageUrl} color={d.mainTaskColor} />
                    {/* Name overlay bottom left */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-xs font-bold text-white truncate group-hover:text-white transition-colors"
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = ROW_ACCENT_COLORS[idx % ROW_ACCENT_COLORS.length]; }}
onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'white'; }}>
                        {d.name}
                      </p>
                      <p className="text-[10px] text-[#A1A1AA]">{d.category} · {d.manufacturer}</p>
                    </div>
                    {/* Date badge top right */}
                    {d.month && (
                      <div className="absolute top-2 right-2 bg-black/70 text-[10px] text-white px-1.5 py-0.5 rounded">
                        {d.month}
                      </div>
                    )}
                  </div>

                  {/* Below image */}
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      {d.availability ? (
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${AVAILABILITY_STYLES[d.availability] || "bg-[#232326] text-[#A1A1AA]"}`}>
                          {d.availability}
                        </span>
                      ) : <span />}
                      {d.price && (
                        <span className="text-xs font-bold text-[#4ade80]">{d.price}</span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#52525B] line-clamp-2 leading-relaxed">
                      {d.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
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
      <div className="relative rounded-xl border border-[#232326] bg-[#0D0D0F] overflow-hidden">
        {active.type === 'video' ? (
          <iframe
            src={getYoutubeEmbedUrl(active.src)}
            className="w-full aspect-video"
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
            className="w-full object-contain"
            style={{ maxHeight: 420, background: '#fff' }}
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
