const BOOKMARK_KEY = "aiorbit:model-bookmarks";

function readIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(BOOKMARK_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function writeIds(ids: string[]) {
  window.localStorage.setItem(BOOKMARK_KEY, JSON.stringify(ids));
}

/** Local-only bookmarks until a models bookmark API exists. */
export function isModelBookmarked(id: string): boolean {
  return readIds().includes(id);
}

export function toggleModelBookmark(id: string): boolean {
  const ids = readIds();
  const idx = ids.indexOf(id);
  if (idx >= 0) {
    ids.splice(idx, 1);
    writeIds(ids);
    return false;
  }
  ids.push(id);
  writeIds(ids);
  return true;
}
