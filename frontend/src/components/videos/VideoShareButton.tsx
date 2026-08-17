"use client";

import { useState } from "react";
import Share2 from "lucide-react/dist/esm/icons/share-2";
import Check from "lucide-react/dist/esm/icons/check";

/**
 * Row-action share button — mirrors NewsRowActions' share button in
 * NewsTable.tsx (same size, border, icon, and copied-state treatment) so
 * the Videos and News tables read as the same design system.
 */
export function VideoShareButton({
  slug,
  title,
  className,
}: {
  slug: string;
  title: string;
  className?: string;
}) {
  const [shared, setShared] = useState(false);

  const share = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/videos/${slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title, text: title, url });
        return;
      }
    } catch {
      // user cancelled or Web Share unsupported — fall through to clipboard
    }
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // clipboard unavailable — ignore
    }
    setShared(true);
    setTimeout(() => setShared(false), 1400);
  };

  return (
    <button
      type="button"
      onClick={share}
      aria-label={shared ? "Link copied" : "Share"}
      title={shared ? "Link copied" : "Share"}
      className={`inline-flex items-center justify-center rounded-md border border-[#232326]/60 bg-[#18181C] p-1.5 text-[#A1A1AA] transition-colors hover:border-[var(--row-accent)] hover:text-white ${className ?? ""}`}
    >
      {shared ? <Check size={12} /> : <Share2 size={12} />}
    </button>
  );
}