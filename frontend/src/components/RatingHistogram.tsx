"use client";

import { Star } from 'lucide-react';
import type { ReviewData } from "@/lib/types";

type RatingHistogramProps = {
  reviews: ReviewData[];
  avgRating: number | null;
  reviewCount: number;
};

export function RatingHistogram({ reviews, avgRating, reviewCount }: RatingHistogramProps) {
  const stars = [5, 4, 3, 2, 1];
  
  // Calculate distribution
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const star = Math.max(1, Math.min(5, Math.round(r.rating))) as 5 | 4 | 3 | 2 | 1;
    counts[star]++;
  });

  const totalReviews = reviews.length;

  return (
    <div className="rounded-xl border border-[#232326] bg-[#0d0d10]/60 p-5 space-y-5">
      {/* Visual score display (Stacked vertically to prevent narrow layout overlap) */}
      <div className="flex flex-col items-start justify-center">
        <span className="text-5xl font-black text-white leading-none">
          {avgRating !== null ? avgRating.toFixed(1) : "0.0"}
        </span>
        <div className="flex items-center gap-0.5 mt-2">
          {[1, 2, 3, 4, 5].map((val) => (
            <Star
              key={val}
              size={14}
              className={
                avgRating !== null && val <= Math.round(avgRating)
                  ? "fill-amber-400 text-amber-400"
                  : "text-neutral-600 fill-[#131316]"
              }
              aria-hidden="true"
            />
          ))}
        </div>
        <span className="text-[10px] text-neutral-400 font-semibold mt-1.5">
          Based on {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
        </span>
      </div>

      {/* Histogram distribution list */}
      <div className="space-y-2.5 pt-1">
        {stars.map((starNum) => {
          const count = counts[starNum as 5 | 4 | 3 | 2 | 1];
          const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
          
          return (
            <div key={starNum} className="flex items-center gap-3 text-[10px] font-semibold">
              <span className="w-8 text-neutral-400 flex items-center gap-0.5 select-none shrink-0">
                {starNum} <Star size={9} className="fill-neutral-500 text-neutral-500 shrink-0" />
              </span>
              <div className="h-1.5 flex-1 rounded-full bg-[#131316] overflow-hidden">
                <div
                  style={{ width: `${pct}%` }}
                  className="h-full rounded-full transition-all duration-500 bg-accent"
                ></div>
              </div>
              <span className="w-8 text-right text-neutral-400 shrink-0">
                {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
