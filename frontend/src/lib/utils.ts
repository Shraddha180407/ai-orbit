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




