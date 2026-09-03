import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Builds a /tools URL by merging current search params with overrides.
 * Passing `null` for a key removes it (used for toggling filters off).
 */
export function buildToolsUrl(
  current: Record<string, string | undefined>,
  overrides: Record<string, string | null>
): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(current)) {
    if (value) params.set(key, value);
  }
  for (const [key, value] of Object.entries(overrides)) {
    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  }

  // Any filter change resets pagination unless page is explicitly set.
  if (!("page" in overrides)) {
    params.delete("page");
  }

  const qs = params.toString();
  return qs ? `/tools?${qs}` : "/tools";
}

/**
 * Smoothly scrolls a category chip into view inside a horizontally scrollable container.
 * - If the content fits within the container (e.g. wide desktop), it does not scroll at all.
 * - If the target chip is already fully visible inside the viewport, it does not scroll at all.
 * - If the target chip is cut off or off-screen, it shifts so the active chip is positioned
 *   on the left side with comfortable padding.
 */
export function scrollChipIntoView(
  container: HTMLElement | null,
  target: HTMLElement | null,
  smooth = true
) {
  if (!container || !target) return;
  // If the content doesn't overflow the container, no scrolling is needed
  if (container.scrollWidth <= container.clientWidth) return;

  const targetRect = target.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  const padding = 12;
  const isFullyVisible =
    targetRect.left >= containerRect.left + padding &&
    targetRect.right <= containerRect.right - padding;

  // If already comfortably visible in view, do NOT shift at all!
  if (isFullyVisible) return;

  // Shift left (or back) so the active chip aligns to the left side with padding
  const targetScrollLeft = container.scrollLeft + (targetRect.left - containerRect.left) - padding;

  container.scrollTo({
    left: Math.max(0, targetScrollLeft),
    behavior: smooth ? "smooth" : "auto",
  });
}
