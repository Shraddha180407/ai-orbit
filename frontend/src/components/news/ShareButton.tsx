"use client";

import { useState } from "react";
import Share2 from "lucide-react/dist/esm/icons/share-2";
import Check from "lucide-react/dist/esm/icons/check";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  fluid?: boolean;
  title?: string;
}

export function ShareButton({ fluid, title }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;
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
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      type="button"
      onClick={share}
      aria-label="Share"
      className={cn(
        "inline-flex items-center gap-2 rounded-md border h-10 px-4 text-sm font-medium transition-colors",
        fluid ? "w-full justify-center" : "justify-start",
        copied ? "border-transparent text-black" : "border-[#232326]/60 bg-[#18181C] text-[#A1A1AA] hover:border-[#3a3a3d] hover:text-white"
      )}
      style={copied ? { backgroundColor: "var(--color-signal)" } : undefined}
    >
      {copied ? <Check size={16} /> : <Share2 size={16} />}
      {copied ? "Link copied" : "Share"}
    </button>
  );
}
