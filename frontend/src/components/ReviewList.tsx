"use client";

import { useState } from "react";
import { Star, MessageSquareOff, ThumbsUp, MessageSquare, CheckCircle } from 'lucide-react';
import { cn } from "@/lib/utils";
import type { ReviewData } from "@/lib/types";

function initials(name: string | null) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 1) return "today";
  if (diffDays === 2) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function ReviewList({ reviews }: { reviews: ReviewData[] }) {
  const [helpfulCounts, setHelpfulCounts] = useState<Record<string, number>>({});
  const [votedHelpful, setVotedHelpful] = useState<Record<string, boolean>>({});

  const toggleHelpful = (reviewId: string) => {
    const hasVoted = votedHelpful[reviewId];
    setVotedHelpful(prev => ({ ...prev, [reviewId]: !hasVoted }));
    setHelpfulCounts(prev => {
      const current = prev[reviewId] ?? 0;
      return {
        ...prev,
        [reviewId]: hasVoted ? current - 1 : current + 1
      };
    });
  };

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-[#232326] py-10 text-center bg-[#0d0d10]/40">
        <MessageSquareOff size={24} className="text-neutral-500" aria-hidden="true" />
        <p className="text-sm text-neutral-400">No reviews yet — be the first to share your experience.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xs uppercase font-bold text-neutral-400 tracking-wider">User Reviews</h3>
      <ul className="divide-y divide-[#232326]/60">
        {reviews.map((review) => {
          const isHelpful = votedHelpful[review.id];
          const count = helpfulCounts[review.id] ?? 0;

          return (
            <li key={review.id} className="py-5 first:pt-1 last:pb-1">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* User Profile Avatar */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 border border-accent/20 text-xs font-bold text-accent">
                    {initials(review.user.name)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold text-white">
                        {review.user.name ?? "Anonymous"}
                      </span>
                      <CheckCircle size={12} className="text-[#34D399] fill-[#34D399]/10 shrink-0" />
                    </div>
                    
                    <div className="flex items-center gap-0.5 mt-0.5" aria-label={`${review.rating} out of 5 stars`}>
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Star
                          key={value}
                          size={12}
                          className={cn(
                            "shrink-0",
                            value <= review.rating 
                              ? "fill-amber-400 text-amber-400" 
                              : "text-[#232326] fill-[#232326]"
                          )}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <span className="text-[10px] text-neutral-400 font-medium">
                  {formatDate(review.createdAt)}
                </span>
              </div>

              {/* Comment text */}
              <p className="mt-3.5 text-xs text-neutral-300 leading-relaxed font-medium pl-12">
                {review.comment}
              </p>

              {/* Action buttons bar */}
              <div className="flex items-center gap-4 mt-3 pl-12">
                <button
                  onClick={() => toggleHelpful(review.id)}
                  className={cn(
                    "flex items-center gap-1.5 text-[10px] font-bold transition-colors",
                    isHelpful ? "text-accent" : "text-neutral-400 hover:text-white"
                  )}
                >
                  <ThumbsUp size={11} className={cn(isHelpful && "fill-accent")} />
                  <span>Helpful ({count})</span>
                </button>

                <button className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-400 hover:text-white transition-colors">
                  <MessageSquare size={11} />
                  <span>Reply</span>
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
