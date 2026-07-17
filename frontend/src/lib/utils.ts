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
 * Resolves repository license from title/name (placeholder helper for Phase 2).
 */
export function resolveRepositoryLicense(repoName: string): string | null {
  const name = repoName.toLowerCase();
  if (name.includes("webui")) return "Apache-2.0";
  if (name.includes("transformer")) return null;
  if (name.includes("toolkit")) return "MIT";
  if (name.includes("comfy")) return null;
  if (name.includes("bark")) return "MIT";
  return "Apache-2.0";
}

/**
 * Resolves company logo background color class based on owner name.
 * Maps standard Tailwind theme tokens to avoid hardcoded HEX values.
 */
export function resolveCompanyLogoBg(ownerName: string): string {
  const owner = ownerName.toLowerCase();
  if (owner.includes("intuit")) return "bg-blue-500";
  if (owner.includes("crowdstrike")) return "bg-red-500";
  if (owner.includes("snowflake")) return "bg-cyan-500";
  return "";
}

