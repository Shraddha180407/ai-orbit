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

// Substring-to-value lookup mapping configurations
const LICENSE_MAP: [string, string | null][] = [
  ["webui", "Apache-2.0"],
  ["transformer", null],
  ["toolkit", "MIT"],
  ["comfy", null],
  ["bark", "MIT"]
];

const COMPANY_LOGO_MAP: [string, string][] = [
  ["intuit", "bg-blue-500"],
  ["crowdstrike", "bg-red-500"],
  ["snowflake", "bg-cyan-500"],
  ["google", "bg-red-500"],
  ["meta", "bg-blue-600"],
  ["openai", "bg-emerald-600"],
  ["anthropic", "bg-amber-600"],
  ["huggingface", "bg-yellow-500 text-black"],
  ["ollama", "bg-neutral-800"],
  ["langchain", "bg-green-600"],
  ["microsoft", "bg-blue-600"]
];

/**
 * Resolves repository license from title/name (placeholder helper for Phase 2).
 */
export function resolveRepositoryLicense(repoName: string): string | null {
  const name = repoName.toLowerCase();
  const match = LICENSE_MAP.find(([key]) => name.includes(key));
  return match ? match[1] : "Apache-2.0";
}

/**
 * Resolves company logo background color class based on owner name.
 * Maps standard Tailwind theme tokens to avoid hardcoded HEX values.
 */
export function resolveCompanyLogoBg(ownerName: string): string {
  const owner = ownerName.toLowerCase();
  const match = COMPANY_LOGO_MAP.find(([key]) => owner.includes(key));
  return match ? match[1] : "";
}


