"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchAllDevices, fetchDeviceById } from "@/lib/api";
import { Device } from "@/lib/types";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DEVICES_DATA, DeviceData, getDeviceBySlug, getSimilarDevices } from "@/data/devices";

const AVAILABILITY_STYLES: Record<string, string> = {
  Available: "bg-[#1a3a2a] text-[#4ade80] border border-[#2a5a3a]",
  "Pre-order": "bg-[#1a2a3a] text-[#60a5fa] border border-[#2a3a5a]",
  Announced: "bg-[#2a2a1a] text-[#facc15] border border-[#4a4a2a]",
  Discontinued: "bg-[#3a1a1a] text-[#f87171] border border-[#5a2a2a]",
};

function mergeDevice(api: Device | null, slug: string): DeviceData | null {
  const dummy = getDeviceBySlug(slug);
  if (!api && !dummy) return null;
  if (!api) return dummy;
  return {
    id: api.id,
    slug: dummy?.slug || api.slug || api.id,
    name: api.name,
    manufacturer: api.manufacturer || dummy?.manufacturer || "—",
    manufacturerSlug: dummy?.manufacturerSlug || "",
    category: api.category || dummy?.category || "Other",
    availability: api.availability || dummy?.availability || "Announced",
    price: api.price || dummy?.price || null,
    year: api.year || dummy?.year || "—",
    month: dummy?.month || api.month || api.year || "—",
    description: api.description || dummy?.description || "",
    imageUrl: api.imageUrl || dummy?.imageUrl || "",
    manufacturerLogoUrl: dummy?.manufacturerLogoUrl || "",
    mainTask: api.mainTask || dummy?.mainTask || "Device",
    mainTaskColor: dummy?.mainTaskColor || "#6E56CF",
    formFactor: api.formFactor || dummy?.formFactor || null,
    country: api.country || dummy?.country || null,
    ram: api.ram || dummy?.ram || null,
    aiFeatures: api.aiFeatures || dummy?.aiFeatures || [],
    primaryUseCases: api.primaryUseCases || dummy?.primaryUseCases || [],
    additionalInfo: api.additionalInfo || dummy?.additionalInfo || null,
    buyUrl: api.buyUrl || dummy?.buyUrl || null,
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
          const sim = getSimilarDevices(merged);
          setSimilar(sim);
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
          {/* Left: Image */}
          <div className="rounded-xl border border-[#232326] bg-white overflow-hidden self-start">
  {device.imageUrl ? (
    <img
      src={device.imageUrl}
      alt={device.name}
      className="w-full object-contain p-6 max-h-[380px]"
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = "none";
      }}
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center">
      <span className="text-5xl font-black text-white uppercase">{device.name.charAt(0)}</span>
    </div>
  )}
</div>
          {/* Right: Info Card */}
          <div className="rounded-xl border border-[#232326] bg-[#0D0D0F] p-4 md:p-6 flex flex-col gap-3">

            {/* Category badge */}
            <div>
              <span className="text-xs bg-[#18181C] border border-[#232326] text-[#A1A1AA] px-2.5 py-1 rounded-full font-mono">
                {device.category || "Device"}
              </span>
            </div>

            {/* Name */}
            <h1 className="text-2xl font-black text-white tracking-tight">{device.name}</h1>

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
                Buy now
              </a>
            )}
          </div>
        </div>

        {/* Specifications */}
        <div className="rounded-xl border border-[#232326] bg-[#0D0D0F] mb-6 overflow-hidden">
          <div className="px-6 py-3 bg-[#131316] border-b border-[#232326]">
            <h2 className="text-xs font-bold text-[#A1A1AA] uppercase tracking-widest">Specifications</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-5">
            {device.formFactor && <SpecRow label="Form factor" value={device.formFactor} />}
            {device.ram && <SpecRow label="RAM" value={device.ram} />}
            {device.country && <SpecRow label="Made in" value={device.country} />}
            <SpecRow label="Release date" value={device.month || device.year || "—"} />
            {device.aiFeatures && device.aiFeatures.length > 0 && (
              <div className="md:col-span-2">
                <p className="text-sm text-[#52525B] mb-2">AI features</p>
                <div className="flex flex-wrap gap-2">
                  {device.aiFeatures.map((f) => (
                    <span key={f} className="text-xs bg-[#18181C] border border-[#232326] text-[#A1A1AA] px-3 py-1 rounded-full">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {device.primaryUseCases && device.primaryUseCases.length > 0 && (
              <div className="md:col-span-2">
                <p className="text-sm text-[#52525B] mb-2">Primary use cases</p>
                <div className="flex flex-wrap gap-2">
                  {device.primaryUseCases.map((u) => (
                    <span key={u} className="text-xs bg-[#18181C] border border-[#232326] text-[#A1A1AA] px-3 py-1 rounded-full">
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
          <div className="mt-8">
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-widest">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#6E56CF]"><rect x="2" y="2" width="9" height="9" rx="1"/><rect x="13" y="2" width="9" height="9" rx="1"/><rect x="2" y="13" width="9" height="9" rx="1"/><rect x="13" y="13" width="9" height="9" rx="1"/></svg>
              Similar Devices
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {similar.map((d) => (
                <Link
                  key={d.id}
                  href={`/devices/${d.slug || d.id}`}
                  className="rounded-xl border border-[#232326] bg-[#0D0D0F] hover:border-[#6E56CF]/40 transition-all group overflow-hidden"
                >
                  {/* Image with overlays */}
                  <div className="relative h-40 bg-[#18181C] flex items-center justify-center overflow-hidden">
                    {d.imageUrl ? (
                      <img
                        src={d.imageUrl}
                        alt={d.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : (
                      <span className="text-3xl font-black text-white uppercase">{d.name.charAt(0)}</span>
                    )}
                    {/* Name overlay bottom left */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-xs font-bold text-white truncate">{d.name}</p>
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

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-4">
      <span className="text-sm text-[#52525B] w-28 shrink-0">{label}</span>
      <span className="text-sm text-white">{value}</span>
    </div>
  );
}