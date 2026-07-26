'use client';

import React from "react";
import Link from "next/link";

interface NormalizedCollection {
  id: string;
  slug: string;
  name: string;
  description: string;
  creatorName: string;
  creatorAvatar: string;
  creatorType: "EDITORIAL" | "COMMUNITY";
  isFeatured: boolean;
  isCurated: boolean;
  toolCount: number;
  updatedAt: string;
  category: string;
  imageUrl: string;
  color: string;
}

interface Props {
  items: NormalizedCollection[];
  isLoading: boolean;
}

function GridImageCell({ name, imageUrl, color }: { name: string; imageUrl: string; color: string }) {
  const [failed, setFailed] = React.useState(false);
  if (!imageUrl || failed) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center relative p-6 overflow-hidden" 
           style={{ background: `linear-gradient(135deg, ${color}22 0%, #000000 100%)` }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: `radial-gradient(circle at 20% 30%, ${color} 0%, transparent 50%)` }} />
        <span className="text-6xl font-black tracking-tighter select-none uppercase opacity-80" style={{ color }}>
          {name.charAt(0)}
        </span>
        <div className="w-16 h-1 mt-3 rounded-full opacity-60" style={{ backgroundColor: color }} />
      </div>
    );
  }
  return <img src={imageUrl} alt={name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onError={() => setFailed(true)} />;
}

export function CollectionGrid({ items, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-64 animate-pulse bg-[#131316] rounded-xl border border-[#232326]/60" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return <div className="py-20 text-center text-[#52525B] text-sm">No collections found.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
      {items.map((item) => (
        <Link key={item.id} href={`/collections/${item.slug || item.id}`}
          className="rounded-xl border border-[#232326]/60 bg-[#0D0D0F] hover:border-[#6E56CF]/40 transition-all group overflow-hidden">
          <div className="relative h-56 bg-[#18181C] flex items-center justify-center overflow-hidden">
            <GridImageCell name={item.name} imageUrl={item.imageUrl} color={item.color} />
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-sm font-bold text-white truncate group-hover:text-[#6E56CF] transition-colors">{item.name}</p>
              <p className="text-[11px] text-[#A1A1AA]">{item.category} · by {item.creatorName}</p>
            </div>
            {item.toolCount > 0 && (
              <div className="absolute top-2 right-2 bg-black/70 text-[10px] text-white px-1.5 py-0.5 rounded">{item.toolCount} tools</div>
            )}
          </div>
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                item.creatorType === "EDITORIAL" ? "bg-[#2a1a3a] text-[#a78bfa] border border-[#4a2a5a]" :
                "bg-[#1a3a2a] text-[#34d399] border border-[#2a5a3a]"
              }`}>
                {item.creatorType.toLowerCase()}
              </span>
              {item.isFeatured && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#2a2a1a] text-[#facc15] border border-[#4a4a2a]">Featured</span>
              )}
            </div>
            <p className="text-[11px] text-[#A1A1AA] line-clamp-2 leading-relaxed">{item.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}