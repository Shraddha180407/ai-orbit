import React from "react";
import AlertTriangle from 'lucide-react/dist/esm/icons/alert-triangle';

type TaskErrorStateProps = {
  message?: string;
  onRetry?: () => void;
};

export function TaskErrorState({ message, onRetry }: TaskErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 rounded-2xl bg-gradient-to-b from-[#131316]/50 to-[#0D0D10]/50 ring-1 ring-[#232326]/70">
      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#18181C] to-[#0A0A0C] ring-1 ring-[#232326]/70 flex items-center justify-center mb-4">
        <AlertTriangle className="h-5 w-5 text-[#71717A]" aria-hidden="true" />
      </div>
      <p className="text-white text-sm font-semibold">Something went wrong</p>
      <p className="text-[#A1A1AA] text-xs mt-1.5 max-w-xs">
        {message || "We couldn't load tasks right now. Please try again."}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#18181C] ring-1 ring-[#232326] px-4 py-2 text-xs font-medium text-white hover:ring-[#3A3A3E] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF]/60"
        >
          Retry
        </button>
      )}
    </div>
  );
}