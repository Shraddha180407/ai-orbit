"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

// Ported from the design prototype's Logo component. Adapted here because
// AiOrbit's Tool.logoUrl is already a resolved URL (set at seed time),
// not a bare domain — so there's one fetch attempt instead of the
// prototype's multi-source chain, but the same guarantee holds: a broken
// or missing logo never renders as a broken image icon, it falls back to
// a distinct initials badge per tool.
export function Logo({
  src,
  name,
  size,
  className,
}: {
  src?: string | null;
  name: string;
  size: number;
  className?: string;
}) {
  const [errored, setErrored] = useState(!src);

  if (errored || !src) {
    const initial = name.trim().charAt(0).toUpperCase() || "?";
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-surface-raised font-semibold text-foreground-muted",
          className
        )}
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        {initial}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      onError={() => setErrored(true)}
      className={cn("object-contain", className)}
    />
  );
}
