"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { mockCollections } from "@/lib/mockCollections";
import type { CollectionListItem } from "@/lib/types";

type DbCreatorType = "EDITORIAL" | "COMMUNITY";

interface NormalizedTool {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  logoUrl?: string;
}

interface NormalizedCollection {
  id: string;
  slug: string;
  name: string;
  description: string;
  creatorName: string;
  creatorAvatar: string;
  creatorType: DbCreatorType;
  isFeatured: boolean;
  isCurated: boolean;
  toolCount: number;
  createdAt: string;
  updatedAt: string;
  category: string;
  categoriesList: string[];
  imageUrl: string;
  color: string;
  tools: NormalizedTool[];
}

const CREATOR_TYPE_STYLES: Record<DbCreatorType, string> = {
  EDITORIAL: "bg-[#2a1a3a] text-[#a78bfa] border border-[#4a2a5a]",
  COMMUNITY: "bg-[#1a3a2a] text-[#34d399] border border-[#2a5a3a]",
};

const CREATOR_COLORS: Record<DbCreatorType, string> = {
  EDITORIAL: "#A78BFA",
  COMMUNITY: "#34D399",
};

// CRASH-PROOF helper function defined at the top
function formatDate(dateStr: string | Date): string {
  if (!dateStr) return "—";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return String(dateStr);
    return date.toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "short", 
      day: "numeric" 
    });
  } catch {
    return String(dateStr);
  }
}

// CRASH-PROOF normalization parser
function normalizeCollection(item: any): NormalizedCollection {
  if (!item) {
    return {
      id: "", slug: "", name: "Unnamed Collection", description: "",
      creatorName: "Anonymous", creatorAvatar: "", creatorType: "COMMUNITY",
      isFeatured: false, isCurated: false, toolCount: 0, createdAt: "", updatedAt: "",
      category: "General", categoriesList: [], imageUrl: "", color: "#6E56CF", tools: []
    };
  }

  const name = item.name || item.title || "Unnamed Collection";
  const slug = item.slug || item.id || "";
  
  let creatorName = "Anonymous";
  let creatorAvatar = "";
  if (item.creator && typeof item.creator === 'object') {
    creatorName = item.creator.name || creatorName;
    creatorAvatar = item.creator.image || item.creator.avatar || item.creator.avatarUrl || "";
  } else {
    if (item.creatorName) creatorName = item.creatorName;
    if (item.creatorAvatar) creatorAvatar = item.creatorAvatar;
  }
  
  const creatorType: DbCreatorType = item.creatorType === "EDITORIAL" ? "EDITORIAL" : "COMMUNITY";
  const isFeatured = !!(item.isFeatured ?? item.featured);
  const isCurated = !!(item.isCurated ?? item.curated);

  // Extract categories relation safely
  let categoriesList: string[] = [];
  if (Array.isArray(item.categories)) {
    categoriesList = item.categories.map((c: any) => {
      if (!c) return "";
      if (typeof c === 'string') return c;
      return c.categoryName || c.name || "";
    }).filter(Boolean);
  }
  const category = categoriesList.length > 0 ? categoriesList[0] : (item.category || "General");

  // Extract tools list relation safely
  let tools: NormalizedTool[] = [];
  if (Array.isArray(item.tools)) {
    tools = item.tools.map((t: any) => {
      if (!t) return null;
      const toolObj = t.tool || t;
      if (!toolObj) return null;
      return {
        id: toolObj.id || "",
        name: toolObj.name || toolObj.title || "Unnamed Tool",
        slug: toolObj.slug || toolObj.id || "",
        description: toolObj.description || "",
        imageUrl: toolObj.imageUrl || toolObj.image || "",
        logoUrl: toolObj.logoUrl || toolObj.logo || "",
      };
    }).filter((t: any) => t !== null && t.id) as NormalizedTool[];
  }

  const toolCount = typeof item.toolCount === 'number' ? item.toolCount : tools.length;
  const color = item.color || CREATOR_COLORS[creatorType] || "#6E56CF";

  return {
    id: item.id || slug,
    slug,
    name,
    description: item.description || "",
    creatorName,
    creatorAvatar,
    creatorType,
    isFeatured,
    isCurated,
    toolCount,
    createdAt: item.createdAt || item.created_at || "",
    updatedAt: item.updatedAt || item.updated_at || "",
    category,
    categoriesList,
    imageUrl: item.imageUrl || item.image || "",
    color,
    tools,
  };
}

export default function CollectionDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [collection, setCollection] = useState<NormalizedCollection | null>(null);
  const [similar, setSimilar] = useState<NormalizedCollection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Prevent execution until the slug parameter is fully resolved
    if (!slug) return;

    async function load() {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";
        
        // 1. Fetch collection details
        let apiData: any = null;
        try {
          const res = await fetch(`${API_BASE_URL}/collections/${slug}`);
          if (res.ok) apiData = await res.json();
        } catch {
          apiData = null;
        }

        // Fallback to mock data lookup
        if (!apiData) {
          apiData = mockCollections.find((c: any) => c.slug === slug || c.id === slug) || null;
        }

        const merged = apiData ? normalizeCollection(apiData) : null;
        setCollection(merged);

        if (merged) {
          // 2. Fetch similar collections
          let allCollections: any[] = [];
          try {
            const res = await fetch(`${API_BASE_URL}/collections?limit=100`);
            if (res.ok) {
              const data = await res.json();
              allCollections = data.items || [];
            }
          } catch {
            allCollections = [];
          }

          if (allCollections.length === 0) {
            allCollections = mockCollections;
          }

          const similarNormalized = allCollections
            .map((c) => {
              try { return normalizeCollection(c); } catch { return null; }
            })
            .filter((c): c is NormalizedCollection => 
              c !== null && c.id !== merged.id && (c.category === merged.category || c.creatorType === merged.creatorType)
            )
            .slice(0, 4);

          setSimilar(similarNormalized);
        }
      } catch (e) {
        console.error("Error loading collection details", e);
        const dummy = mockCollections.find((c: any) => c.slug === slug || c.id === slug);
        if (dummy) setCollection(normalizeCollection(dummy));
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

  if (!collection) {
    return (
      <div className="min-h-screen flex flex-col bg-[#000000] text-white">
        <Header />
        <main className="w-full px-6 md:px-12 py-20 text-center flex-1">
          <p className="text-[#52525B]">Collection not found.</p>
          <Link href="/collections" className="text-[#6E56CF] text-sm mt-4 inline-block hover:underline">
            ← Back to Collections
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
          <Link href="/collections" className="hover:text-white transition-colors">Collections</Link>
          <span>›</span>
          <span className="hover:text-white transition-colors">{collection.category}</span>
          <span>›</span>
          <span className="text-white">{collection.name}</span>
        </nav>

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-6 mb-8 items-start">
          {/* Left: Image / Cover */}
          <CollectionImage name={collection.name} imageUrl={collection.imageUrl} color={collection.color} />

          {/* Right: Info Card */}
          <div className="rounded-xl border border-[#232326] bg-[#0D0D0F] p-4 md:p-6 flex flex-col gap-3">
            {/* Category badge */}
            <div>
              <span className="text-xs bg-[#18181C] border border-[#232326] text-[#A1A1AA] px-2.5 py-1 rounded-full font-mono">
                {collection.category}
              </span>
            </div>

            {/* Name */}
            <h1 className="text-2xl font-black text-white tracking-tight">{collection.name}</h1>

            {/* Creator details */}
            <div className="flex items-center gap-2 text-sm text-[#71717A]">
              {collection.creatorAvatar ? (
                <img src={collection.creatorAvatar} alt={collection.creatorName} className="h-6 w-6 rounded-full border border-[#232326]" />
              ) : (
                <div className="h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs text-white" style={{ backgroundColor: collection.color }}>
                  {collection.creatorName.charAt(0)}
                </div>
              )}
              <span>by <strong className="text-white">{collection.creatorName}</strong></span>
            </div>

            {/* Counts + Badges */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#131316] border border-[#232326] text-white">
                {collection.toolCount} Tools
              </span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CREATOR_TYPE_STYLES[collection.creatorType]}`}>
                {collection.creatorType.toLowerCase()}
              </span>
              {collection.isFeatured && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#2a2a1a] text-[#facc15] border border-[#4a4a2a]">
                  featured
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-[#A1A1AA] leading-relaxed pt-2">{collection.description}</p>

            {/* Dates */}
            <div className="flex flex-col gap-2 pt-3 border-t border-[#232326]">
              <div className="flex items-center gap-3 text-sm">
                <span className="text-[#52525B] w-28 shrink-0 flex items-center gap-1.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                  Last updated
                </span>
                <span className="text-white">{formatDate(collection.updatedAt)}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-[#52525B] w-28 shrink-0 flex items-center gap-1.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                  Created on
                </span>
                <span className="text-white">{formatDate(collection.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tools in this Collection */}
        <div className="rounded-xl border border-[#232326] bg-[#0D0D0F] mb-8 overflow-hidden">
          <div className="px-6 py-4 bg-[#131316] border-b border-[#232326] flex items-center justify-between">
            <h2 className="text-xs font-bold text-[#A1A1AA] uppercase tracking-widest">Tools in this stack ({collection.tools.length})</h2>
          </div>
          <div className="p-6">
            {collection.tools.length === 0 ? (
              <p className="text-sm text-[#52525B] text-center py-6">No tools have been added to this collection yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {collection.tools.map((tool) => (
                  <Link key={tool.id} href={`/tools/${tool.slug || tool.id}`} className="group flex items-start gap-4 p-4 rounded-xl border border-[#232326]/60 bg-[#08080A] hover:border-[#6E56CF]/40 transition-colors">
                    {/* Tool Logo */}
                    <div className="h-12 w-12 rounded-lg bg-[#131316] border border-[#232326] flex items-center justify-center shrink-0 overflow-hidden">
                      {tool.logoUrl || tool.imageUrl ? (
                        <img src={tool.logoUrl || tool.imageUrl} alt={tool.name} className="h-8 w-8 object-contain" />
                      ) : (
                        <span className="text-white font-black uppercase text-xl select-none">{tool.name.charAt(0)}</span>
                      )}
                    </div>
                    {/* Tool Info */}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-white group-hover:text-[#6E56CF] transition-colors truncate">{tool.name}</h3>
                      <p className="text-xs text-[#A1A1AA] line-clamp-2 mt-1 leading-relaxed">{tool.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Specifications */}
        <div className="rounded-xl border border-[#232326] bg-[#0D0D0F] mb-8 overflow-hidden">
          <div className="px-6 py-3 bg-[#131316] border-b border-[#232326]">
            <h2 className="text-xs font-bold text-[#A1A1AA] uppercase tracking-widest">Metadata Details</h2>
          </div>
          <div className="divide-y divide-[#232326]">
            <SpecRowDivider label="Creator" value={collection.creatorName} />
            <SpecRowDivider label="Creator Type" value={collection.creatorType} />
            <SpecRowDivider label="Primary Category" value={collection.category} />
            {collection.categoriesList.length > 1 && (
              <div className="flex items-start gap-4 px-6 py-4">
                <span className="text-sm text-[#52525B] w-36 shrink-0">All Categories</span>
                <div className="flex flex-wrap gap-2">
                  {collection.categoriesList.map((c) => (
                    <span key={c} className="inline-flex items-center rounded-md border border-[#232326]/60 bg-[#18181C] px-2.5 py-0.5 text-[10px] font-mono font-semibold text-[#A1A1AA]">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <SpecRowDivider label="Curation Status" value={collection.isCurated ? "Curated stack" : "Standard stack"} />
          </div>
        </div>

        {/* Similar Collections */}
        {similar.length > 0 && (
          <div className="mt-8 rounded-xl border border-[#232326] bg-[#0D0D0F] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#232326] flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#6E56CF]"><rect x="2" y="2" width="9" height="9" rx="1"/><rect x="13" y="2" width="9" height="9" rx="1"/><rect x="2" y="13" width="9" height="9" rx="1"/><rect x="13" y="13" width="9" height="9" rx="1"/></svg>
              <h2 className="text-xs font-bold text-[#A1A1AA] uppercase tracking-widest">Similar Collections</h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {similar.map((d) => (
                <Link
                  key={d.id}
                  href={`/collections/${d.slug || d.id}`}
                  className="rounded-xl border border-[#232326] bg-[#0D0D0F] transition-all group overflow-hidden"
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${d.color}60`; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = ''; }}
                >
                  <div className="relative h-52 bg-[#18181C] flex items-center justify-center overflow-hidden">
                    <SimilarCollectionImage name={d.name} imageUrl={d.imageUrl} color={d.color} />
                    {/* Title overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-xs font-bold text-white truncate transition-colors">
                        {d.name}
                      </p>
                      <p className="text-[10px] text-[#A1A1AA]">{d.category} · by {d.creatorName}</p>
                    </div>
                    {/* Tool count badge */}
                    {d.toolCount > 0 && (
                      <div className="absolute top-2 right-2 bg-black/70 text-[10px] text-white px-1.5 py-0.5 rounded">
                        {d.toolCount} tools
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${CREATOR_TYPE_STYLES[d.creatorType]}`}>
                        {d.creatorType.toLowerCase()}
                      </span>
                      {d.isFeatured && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#2a2a1a] text-[#facc15] border border-[#4a4a2a]">Featured</span>
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

function SpecRowDivider({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-4 px-6 py-4">
      <span className="text-sm text-[#52525B] w-36 shrink-0">{label}</span>
      <span className="text-sm text-white capitalize">{value}</span>
    </div>
  );
}

function CollectionImage({ name, imageUrl, color }: { name: string; imageUrl: string; color: string }) {
  const [failed, setFailed] = React.useState(false);

  if (!imageUrl || failed) {
    return (
      <div
        className="rounded-xl border border-[#232326] self-start w-full h-[380px] flex flex-col items-center justify-center relative p-10 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${color}22 0%, #000000 100%)` }}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 60%)` }} />
        <span className="text-[120px] font-black uppercase leading-none select-none opacity-80" style={{ color }}>
          {name.charAt(0)}
        </span>
        <div className="w-24 h-1.5 mt-5 rounded-full opacity-60" style={{ backgroundColor: color }} />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#232326] bg-white overflow-hidden self-start">
      <img
        src={imageUrl}
        alt={name}
        className="w-full object-contain p-6 max-h-[380px]"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

function SimilarCollectionImage({ name, imageUrl, color }: { name: string; imageUrl: string; color: string }) {
  const [failed, setFailed] = React.useState(false);

  if (!imageUrl || failed) {
    return (
      <div className="w-full h-full flex items-center justify-center relative" style={{ background: `linear-gradient(135deg, ${color}22 0%, #000000 100%)` }}>
        <span className="text-5xl font-black uppercase select-none opacity-70" style={{ color }}>
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