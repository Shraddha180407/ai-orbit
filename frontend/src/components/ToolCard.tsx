import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Bookmark from 'lucide-react/dist/esm/icons/bookmark';
import { PricingBadge } from "@/components/PricingBadge";
import { CategoryChip } from "@/components/CategoryChip";
import { RatingStars } from "@/components/RatingStars";
import type { ToolCardData } from "@/lib/types";

import { Edit2, Trash2 } from "lucide-react";
import { API_URL, prefetchUrl } from "@/lib/api";

export function ToolCard({ 
  tool,
  isAdmin,
  onEdit,
  onDelete
}: { 
  tool: ToolCardData;
  isAdmin?: boolean;
  onEdit?: (c: ToolCardData) => void;
  onDelete?: (id: string) => void;
}) {
  const categories = tool.categories ?? [];
  const primaryCategory = categories[0]?.category;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <div className="relative">
      {isAdmin && (
        <div className="absolute right-2 top-2 z-10 flex gap-1">
          <button
            type="button"
            aria-label="Edit tool"
            onClick={(e) => {
              e.preventDefault();
              onEdit?.(tool);
            }}
            className="flex h-7 w-7 items-center justify-center rounded-md bg-surface border border-border text-foreground hover:text-accent transition-colors shadow-sm"
          >
            <Edit2 size={13} />
          </button>
          <button
            type="button"
            aria-label="Delete tool"
            onClick={(e) => {
              e.preventDefault();
              setDeleteDialogOpen(true);
            }}
            className="flex h-7 w-7 items-center justify-center rounded-md bg-surface border border-border text-foreground hover:text-red-500 transition-colors shadow-sm"
          >
            <Trash2 size={13} />
          </button>
        </div>
      )}
      {deleteDialogOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`delete-tool-title-${tool.id}`}
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-xs rounded-lg border border-border bg-surface p-4 shadow-2xl">
            <h2 id={`delete-tool-title-${tool.id}`} className="text-sm font-semibold text-foreground">
              Delete {tool.name}?
            </h2>
            <p className="mt-1.5 text-xs text-foreground-muted">
              This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteDialogOpen(false)}
                className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-background"
              >
                Cancel
              </button>
              <button
                type="button"
                aria-label="Confirm delete"
                onClick={() => {
                  setDeleteDialogOpen(false);
                  onDelete?.(tool.id);
                }}
                className="rounded-md bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <Link
        href={`/tools/${tool.slug}`}
        prefetch={false}
        onMouseEnter={() => prefetchUrl(`${API_URL}/api/v1/tools/${tool.slug}`)}
        onTouchStart={() => prefetchUrl(`${API_URL}/api/v1/tools/${tool.slug}`)}
        onFocus={() => prefetchUrl(`${API_URL}/api/v1/tools/${tool.slug}`)}
        className="group flex flex-col sm:grid sm:grid-cols-[80px_1fr_160px_160px] lg:grid-cols-[80px_1fr_180px_180px] gap-3 sm:gap-5 items-start sm:items-center justify-between sm:min-h-[80px] py-4 px-3.5 sm:py-5 sm:px-5 transition-all hover:bg-[#18181C]/40 focus-visible:bg-[#18181C]/40 focus-visible:outline-none"
      >
      {/* Mobile Top Row / Desktop Column 1 & 2 */}
      <div className="flex items-start sm:contents w-full gap-3">
        {/* Column 1: Logo */}
        <div className="flex h-12 w-12 sm:h-20 sm:w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-white p-1.5 sm:p-2.5 shadow-sm">
          {tool.logoUrl ? (
            <Image
              src={tool.logoUrl}
              alt={`${tool.name} logo`}
              width={64}
              height={64}
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="text-base sm:text-xl font-bold text-neutral-900">
              {tool.name.charAt(0)}
            </span>
          )}
        </div>

        {/* Column 2: Name + Metadata + Description */}
        <div className="flex flex-col justify-center min-w-0 flex-1 sm:h-full">
          <div className="flex items-center justify-between sm:justify-start gap-2">
            <h3 className="font-bold text-white text-sm sm:text-base truncate group-hover:text-white transition-colors">
              {tool.name}
            </h3>
            <Bookmark size={15} className="shrink-0 text-foreground-faint group-hover:text-accent transition-colors" aria-hidden="true" />
          </div>

          {/* Inline info row */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-0.5 sm:mt-1 text-[10.5px] sm:text-[11px] text-[#71717A]">
            {primaryCategory && (
              <span className="font-semibold text-[#8F8F94]">{primaryCategory.name}</span>
            )}
            <span className="h-1 w-1 rounded-full bg-[#232326]" />
            <RatingStars rating={tool.avgRating} reviewCount={tool._count.reviews} size="sm" />
            <span className="h-1 w-1 rounded-full bg-[#232326]" />
            <span>{tool._count.bookmarks} saves</span>
          </div>

          <p className="text-xs text-[#A1A1AA] line-clamp-2 sm:line-clamp-1 mt-1.5 sm:mt-2 max-w-2xl leading-relaxed">
            {tool.description}
          </p>
        </div>
      </div>

      {/* Column 3: Secondary Categories / Tags */}
      {categories.length > 1 && (
        <div className="flex flex-wrap items-center sm:justify-center gap-1.5 w-full sm:w-auto">
          {categories.slice(1, 3).map(({ category }) => (
            <CategoryChip key={category.slug} label={category.name} />
          ))}
        </div>
      )}

      {/* Column 4: Pricing & Action */}
      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 w-full sm:w-auto shrink-0 border-t border-[#232326]/40 sm:border-t-0 pt-2 sm:pt-0 mt-1 sm:mt-0">
        <PricingBadge
          pricingModel={tool.pricingModel}
          pricingAmount={tool.pricingAmount}
          billingFrequency={tool.billingFrequency}
        />
        <span className="text-[11px] font-semibold text-[#71717A] group-hover:text-white transition-colors sm:block hidden mt-1">
          View details &rarr;
        </span>
      </div>
    </Link>
    </div>
  );
}
