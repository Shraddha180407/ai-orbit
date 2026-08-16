"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { BLUR_DATA_URL } from "@/lib/video-types";

/**
 * Thumbnails are the single most failure-prone part of this page — they're
 * third-party URLs we don't control. By default this wrapper makes sure a
 * bad URL never shows a broken-image icon: it swaps to a branded gradient
 * tile instead, and shows a shimmer (not a blank gray box) while a good one
 * is loading.
 *
 * Some callers (e.g. the videos list table) want stricter behavior: every
 * row must show a real thumbnail, and if one fails to load the whole item
 * should disappear rather than show a fallback tile. Pass `onError` for
 * that case — when provided, this component reports the failure upward and
 * renders nothing itself, letting the parent remove the item from the list.
 */
export function ThumbImage({
  src,
  alt,
  toolName,
  accent,
  sizes,
  priority = false,
  onError,
}: {
  src: string;
  alt: string;
  toolName: string;
  accent: string;
  sizes: string;
  priority?: boolean;
  onError?: () => void;
}) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    src ? "loading" : "error"
  );

  useEffect(() => {
    if (!src) {
      setStatus("error");
      onError?.();
    }
    // Only re-check when the src itself changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  if (status === "error") {
    if (onError) return null;

    return (
      <div
        className="flex h-full w-full items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${accent}33, ${accent}10)`,
        }}
      >
        <span
          className="text-[15px] font-semibold tracking-tight"
          style={{ color: accent }}
        >
          {toolName}
        </span>
      </div>
    );
  }

  return (
    <>
      {status === "loading" && (
        <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,#2c2d39_8%,#3a3b49_18%,#2c2d39_33%)] bg-[length:200%_100%]" />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        className={`object-cover transition-all duration-500 ease-out ${
          status === "loaded" ? "opacity-100 scale-100" : "opacity-0 scale-[1.02]"
        } group-hover:scale-[1.06]`}
        onLoad={() => setStatus("loaded")}
        onError={() => {
          setStatus("error");
          onError?.();
        }}
      />
    </>
  );
}