"use client";

import { useActionState, useState } from "react";
import Star from 'lucide-react/dist/esm/icons/star';
import { submitReview, type ReviewFormState } from "@/lib/actions";
import { cn } from "@/lib/utils";

const initialState: ReviewFormState = { status: "idle" };

export function ReviewForm({ toolId, toolSlug }: { toolId: string; toolSlug: string }) {
  const [state, formAction, isPending] = useActionState(submitReview, initialState);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <form action={formAction} className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4">
      <input type="hidden" name="toolId" value={toolId} />
      <input type="hidden" name="toolSlug" value={toolSlug} />
      <input type="hidden" name="rating" value={rating} />

      <div>
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-foreground-faint">
          Your rating
        </span>
        <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={rating === value}
              aria-label={`${value} star${value === 1 ? "" : "s"}`}
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-0.5"
            >
              <Star
                size={22}
                className={cn(
                  "transition-colors",
                  (hoverRating || rating) >= value
                    ? "fill-amber-400 text-amber-400"
                    : "text-neutral-600 fill-[#131316]"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="comment" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-foreground-faint">
          Your review
        </label>
        <textarea
          id="comment"
          name="comment"
          rows={3}
          minLength={10}
          maxLength={1000}
          required
          placeholder="What did you use it for, and how did it go?"
          className="w-full resize-none rounded-md border border-border bg-surface-raised px-3 py-2 text-sm text-foreground placeholder:text-foreground-faint focus:border-accent focus:outline-none"
        />
      </div>

      {state.status === "error" && (
        <p className="text-sm text-danger" role="alert">
          {state.message}
        </p>
      )}
      {state.status === "success" && (
        <p className="text-sm text-success" role="status">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending || rating === 0}
        className="self-start rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}
