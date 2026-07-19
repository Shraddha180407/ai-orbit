"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookmark, Share2, Box, ShieldCheck, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CollectionListItem } from "@/lib/types";

interface CollectionRowProps {
  collection: CollectionListItem;
  density: "compact" | "comfortable";
  visibleColumns: Record<string, boolean>;
}

export function CollectionRow({ collection, density, visibleColumns }: CollectionRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const formattedDate = new Date(collection.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div 
      className={cn(
        "group border-b border-border bg-background transition-colors hover:bg-surface-raised/30",
        density === "compact" ? "py-2.5" : "py-5"
      )}
    >
      {/* DESKTOP VIEW LAYOUT (>= 1200px) */}
      <div className="hidden xl:flex items-center justify-between gap-6 px-6">
        <div className="flex flex-1 items-center gap-4 min-w-0">
          <button 
            onClick={(e) => { e.preventDefault(); setIsBookmarked(!isBookmarked); }}
            className="flex h-11 w-11 shrink-0 items-center justify-center text-foreground-muted hover:text-accent transition-colors"
            aria-label={`Bookmark ${collection.title}`}
          >
            <Bookmark size={18} className={cn(isBookmarked && "fill-accent text-accent")} />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Link 
                href={`/collections/${collection.slug}`} 
                className="text-sm font-semibold text-foreground hover:text-accent truncate transition-colors"
              >
                {collection.title}
              </Link>
              {collection.featured && (
                <span className="rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-accent uppercase tracking-wider">
                  Featured
                </span>
              )}
            </div>
            
            <div className="mt-1 flex items-center gap-1.5 text-xs text-foreground-muted">
              <span className="text-foreground-muted/60">Curated by</span>
              <span className="font-medium text-foreground-muted">{collection.curatedBy}</span>
              <ShieldCheck size={13} className="text-accent/80 shrink-0" />
            </div>
          </div>
        </div>

        {/* Category Column */}
        {visibleColumns.category && (
          <div className="w-44 shrink-0">
            <span className="inline-flex rounded-full bg-surface border border-border px-2.5 py-0.5 text-xs text-foreground font-medium">
              {collection.category}
            </span>
          </div>
        )}

        {/* Tools Counter & Preview Images */}
        {visibleColumns.tools && (
          <div className="flex items-center gap-6 w-80 shrink-0 text-xs text-foreground-muted">
            <div className="flex items-center gap-1.5 w-24 shrink-0">
              <Box size={14} className="text-foreground-muted/70" />
              <span className="font-mono font-medium text-foreground">{collection.toolCount}</span> tools
            </div>

            <div className="flex -space-x-1.5 overflow-hidden py-0.5">
              {collection.previewTools?.slice(0, 4).map((tool, idx) => (
                <div 
                  key={idx}
                  className="inline-block h-6 w-6 rounded-md bg-surface ring-2 ring-background overflow-hidden border border-border/40"
                  title={tool.name}
                >
                  {tool.logoUrl ? (
                    <img src={tool.logoUrl} alt={tool.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-accent/10 text-[9px] font-bold text-accent">
                      {tool.name.charAt(0)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Date & Share */}
        <div className="flex items-center gap-4 w-36 justify-end shrink-0 text-xs">
          <span className="text-foreground-muted/60 font-mono">{formattedDate}</span>
          <button 
            className="flex h-11 w-11 items-center justify-center text-foreground-muted hover:text-foreground transition-colors"
            aria-label="Share bundle"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {/* TABLET VIEW LAYOUT (768px - 1199px) */}
      <div className="hidden md:flex xl:hidden flex-col gap-2 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <button 
              onClick={() => setIsExpanded(!isExpanded)} 
              className="p-1.5 text-foreground-muted hover:text-foreground transition-colors"
              aria-expanded={isExpanded}
            >
              <ChevronRight size={16} className={cn("transition-transform duration-150", isExpanded && "rotate-90")} />
            </button>
            <Link href={`/collections/${collection.slug}`} className="font-semibold text-foreground truncate text-sm hover:text-accent">
              {collection.title}
            </Link>
            <span className="rounded-full bg-surface border border-border px-2 py-0.5 text-xs text-foreground-muted">
              {collection.category}
            </span>
          </div>
          <button 
            onClick={() => setIsBookmarked(!isBookmarked)} 
            className="p-2 text-foreground-muted hover:text-accent"
          >
            <Bookmark size={16} className={cn(isBookmarked && "fill-accent text-accent")} />
          </button>
        </div>
        
        {isExpanded && (
          <div className="pl-8 pb-1 text-xs text-foreground-muted border-t border-border/40 pt-2.5 mt-1">
            <p className="leading-relaxed mb-3 text-foreground-muted/90">{collection.description}</p>
            <div className="flex items-center gap-4 font-mono text-foreground-muted/70">
              <span>Total Tools: {collection.toolCount}</span>
              <span>Updated: {formattedDate}</span>
              <span>By: {collection.curatedBy}</span>
            </div>
          </div>
        )}
      </div>

      {/* MOBILE VIEW LAYOUT (<= 767px Stacked Accordion) */}
      <div className="flex md:hidden flex-col px-4">
        <div 
          className="flex items-center justify-between cursor-pointer py-1"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="min-w-0 flex-1 pr-4">
            <h4 className="font-medium text-sm text-foreground truncate">{collection.title}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-foreground-muted">{collection.category}</span>
              <span className="text-foreground-muted/40 font-mono text-[10px]">•</span>
              <span className="text-xs font-mono text-foreground-muted/70">{collection.toolCount} tools</span>
            </div>
          </div>
          <ChevronDown size={16} className={cn("text-foreground-muted transition-transform duration-200 shrink-0", isExpanded && "rotate-180")} />
        </div>

        {isExpanded && (
          <div className="mt-3 border-t border-border/50 pt-3 pb-2 text-xs text-foreground-muted space-y-3">
            <p className="leading-relaxed text-foreground-muted/90">{collection.description}</p>
            
            <div className="bg-surface p-3 rounded-lg border border-border font-mono space-y-1 text-foreground-muted/80">
              <div>Curator: <span className="text-foreground">{collection.curatedBy}</span></div>
              <div>Last Updated: <span className="text-foreground">{formattedDate}</span></div>
            </div>

            <div className="flex items-center justify-between border-t border-border/40 pt-1">
              <span className="text-[10px] text-foreground-muted/50 uppercase font-mono tracking-wider">Actions</span>
              <div className="flex -mr-2">
                <button 
                  onClick={() => setIsBookmarked(!isBookmarked)} 
                  className="w-11 h-11 flex items-center justify-center text-foreground-muted"
                  aria-label="Bookmark item"
                >
                  <Bookmark size={16} className={cn(isBookmarked && "fill-accent text-accent")} />
                </button>
                <button className="w-11 h-11 flex items-center justify-center text-foreground-muted" aria-label="Share item">
                  <Share2 size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}