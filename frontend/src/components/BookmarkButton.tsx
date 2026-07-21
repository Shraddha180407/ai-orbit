"use client";

import { useTransition, useState } from "react";
import Bookmark from 'lucide-react/dist/esm/icons/bookmark';
import { toggleBookmark } from "@/lib/actions";
import { cn } from "@/lib/utils";

type BookmarkButtonProps = {
  toolId: string;
  toolSlug: string;
  initialBookmarked: boolean;
  initialCount: number;
  size?: "sm" | "md";
  className?: string;
  iconOnly?: boolean;
};

export function BookmarkButton({
  toolId,
  toolSlug,
  initialBookmarked,
  initialCount,
  size = "md",
  className,
  iconOnly = false,
}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [count, setCount] = useState(initialCount);
  const [isPending, startTransition] = useTransition();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic update — reconciled with the server action's result.
    const nextBookmarked = !bookmarked;
    setBookmarked(nextBookmarked);
    setCount((c) => c + (nextBookmarked ? 1 : -1));

    startTransition(async () => {
      try {
        const result = await toggleBookmark(toolId, toolSlug);
        setBookmarked(result.bookmarked);
      } catch {
        // Roll back on failure.
        setBookmarked(bookmarked);
        setCount((c) => c + (nextBookmarked ? -1 : 1));
      }
    });
  };

  const iconSize = size === "sm" ? 16 : 18;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={bookmarked}
      aria-label={bookmarked ? "Remove bookmark" : "Save tool"}
      className={cn(
        "inline-flex items-center justify-center rounded-md transition-colors disabled:opacity-60",
        iconOnly ? "p-1.5" : "border gap-1.5 px-3 py-1.5 text-sm font-medium",
        bookmarked
          ? iconOnly
            ? "text-accent hover:text-accent-hover"
            : "border-accent/30 bg-accent/10 text-accent hover:bg-accent/20 hover:border-accent/50"
          : iconOnly
            ? "text-foreground-faint hover:text-foreground"
            : "border-border text-foreground-muted hover:border-accent/50 hover:text-foreground",
        className
      )}
    >
      <Bookmark size={iconSize} className={cn(bookmarked && "fill-accent")} aria-hidden="true" />
      {!iconOnly && (
        <>
          {bookmarked ? "Saved" : "Save"}
          <span className="text-xs text-foreground-faint">{count}</span>
        </>
      )}
    </button>
  );
}
