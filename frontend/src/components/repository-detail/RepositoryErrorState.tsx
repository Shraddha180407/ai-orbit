import React from "react";
import Link from "next/link";

interface RepositoryErrorStateProps {
  message?: string;
}

export function RepositoryErrorState({ message = "Repository not found" }: RepositoryErrorStateProps) {
  return (
    <div className="text-center py-20 border border-white/[0.08] bg-[#131316] rounded-xl max-w-xl mx-auto flex flex-col items-center gap-4">
      <p className="text-[#A1A1AA] text-sm font-medium">{message}</p>
      <Link
        href="/repositories"
        className="px-4 py-2 text-xs font-semibold text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg border border-white/[0.08] transition-colors"
      >
        Go Back
      </Link>
    </div>
  );
}
