import { AlertTriangle } from "lucide-react";

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-search-border py-16 text-center">
      <AlertTriangle size={28} className="text-search-danger" />
      <div>
        <p className="text-sm font-medium text-search-text-primary">Search failed</p>
        <p className="mt-1 text-sm text-search-text-secondary">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="mt-1 rounded-md bg-search-accent px-3.5 py-1.5 text-sm text-white hover:bg-search-accent-hover"
      >
        Try again
      </button>
    </div>
  );
}
