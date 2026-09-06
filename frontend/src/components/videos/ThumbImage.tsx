"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { BLUR_DATA_URL } from "@/lib/video-types";

function sanitizeYoutubeUrl(url: string): string {
  if (!url) return url;
  // If it's a YouTube thumbnail with an expiring signature, fall back to the safe, standard thumbnail.
  if (url.includes("i.ytimg.com/vi/") && url.includes("sqp=")) {
    const match = url.match(/vi\/([^\/]+)\//);
    if (match && match[1]) {
      return `https://i.ytimg.com/vi/${match[1]}/hqdefault.jpg`;
    }
  }
  return url;
}

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
  const sanitizedSrc = sanitizeYoutubeUrl(src);
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    sanitizedSrc ? "loading" : "error"
  );

  useEffect(() => {
    if (!sanitizedSrc) {
      setStatus("error");
      onError?.();
    } else {
      setStatus("loading");
    }
  }, [sanitizedSrc]);

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
        src={sanitizedSrc}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        className={`object-cover transition-all duration-500 ease-out ${
          status === "loaded" ? "opacity-100 scale-100" : "opacity-0 scale-[1.02]"
        } group-hover:scale-[1.06]`}
        onLoad={(e) => {
          // YouTube doesn't 404 for deleted/private videos' thumbnail URLs —
          // it returns a real 200 OK image, but it's always a fixed-size
          // generic gray placeholder (120x90px). A real thumbnail is always
          // larger than that. Checking the loaded image's actual pixel
          // dimensions is the only reliable way to catch this, since
          // onError never fires for it.
          const img = e.currentTarget;
          if (img.naturalWidth === 120 && img.naturalHeight === 90) {
            setStatus("error");
            onError?.();
            return;
          }
          setStatus("loaded");
        }}
        onError={() => {
          setStatus("error");
          onError?.();
        }}
      />
    </>
  );
}