import Link from "next/link";
import { Sparkles } from "lucide-react";

export function CollectionsClosingCTA() {
  return (
    <div className="relative mt-16 overflow-hidden rounded-lg p-[1px]">
      <div
        className="collections-glow absolute inset-[-100%] opacity-60"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0%, #7C5CFC 12%, transparent 24%, var(--collections-gold) 36%, transparent 48%)",
        }}
        aria-hidden="true"
      />
      <div className="relative flex flex-col items-center gap-4 rounded-lg bg-surface px-6 py-12 text-center sm:px-12">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-raised"
          style={{ color: "var(--collections-gold)" }}
        >
          <Sparkles size={18} strokeWidth={1.5} />
        </span>
        <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
          Know a tool that deserves a spot?
        </h2>
        <p className="max-w-md text-sm text-foreground-muted">
          Collections are curated by the team and updated as the AI landscape
          shifts. Suggest a tool or a new collection theme.
        </p>
        <Link
          href="mailto:hello@aiorbit.club?subject=Collection%20suggestion"
          className="mt-1 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          Suggest a collection
        </Link>
      </div>
    </div>
  );
}
