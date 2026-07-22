"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks whether a horizontally-scrolling element currently has more
 * content hidden past its start/end edge, so a CSS mask (.tas-scroll-fade,
 * see globals.css) can fade only the edges that actually have more to
 * scroll to — recomputed on scroll/resize and whenever the list of items
 * inside it changes length (e.g. FilterChips' dynamic topic chips).
 */
export function useScrollFade<T extends HTMLElement>(dependency?: unknown) {
  const ref = useRef<T>(null);
  const [fade, setFade] = useState({ start: false, end: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const start = el.scrollLeft > 4;
      const end = el.scrollLeft < el.scrollWidth - el.clientWidth - 4;
      setFade({ start, end });
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `dependency` intentionally re-measures when the scrollable content itself changes (e.g. chip count)
  }, [dependency]);

  return { ref, fade };
}
