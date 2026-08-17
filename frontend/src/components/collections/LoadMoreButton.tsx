"use client";

import { Loader2 } from "lucide-react";

interface Props {
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
}

export function LoadMoreButton({
  loading,
  disabled,
  onClick,
}: Props) {
  return (
    <div className="flex justify-center py-10">
      <button
        disabled={disabled || loading}
        onClick={onClick}
        className="rounded-xl border border-border bg-surface px-6 py-3 text-sm font-medium transition-colors hover:border-accent disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2
              size={16}
              className="animate-spin"
            />
            Loading...
          </span>
        ) : (
          "Load More"
        )}
      </button>
    </div>
  );
}
