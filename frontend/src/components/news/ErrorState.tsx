"use client";

import AlertTriangle from "lucide-react/dist/esm/icons/alert-triangle";
import RefreshCw from "lucide-react/dist/esm/icons/refresh-cw";

interface ErrorStateProps {
  onRetry: () => void;
  title?: string;
  body?: string;
}

/** Same empty/error card shell as NewsTable.tsx's NewsTableEmpty (border-dashed, bg-surface/40, py-16). */
export function ErrorState({
  onRetry,
  title = "Couldn't load the feed",
  body = "Something went wrong fetching the latest news. Check your connection and try again.",
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[#232326] bg-[#131316]/40 py-16 text-center">
      <AlertTriangle size={28} className="text-[#71717A]" aria-hidden="true" />
      <div>
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="mt-1 text-xs text-[#A1A1AA] max-w-[320px]">{body}</p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-[#232326]/60 bg-[#18181C] px-3.5 py-1.5 text-xs font-medium text-[#A1A1AA] transition-colors hover:border-[#3a3a3d] hover:text-white"
      >
        <RefreshCw size={13} />
        Retry
      </button>
    </div>
  );
}
