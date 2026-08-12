import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useRecentSearches } from "@/hooks/useRecentSearches";

const STORAGE_KEY = "search:recent";

beforeEach(() => {
  localStorage.clear();
});

describe("useRecentSearches", () => {
  it("starts with empty recent searches", () => {
    const { result } = renderHook(() => useRecentSearches());
    expect(result.current.recent).toEqual([]);
  });

  it("loads existing searches from localStorage", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(["chatgpt", "midjourney"]));
    const { result } = renderHook(() => useRecentSearches());
    expect(result.current.recent).toEqual(["chatgpt", "midjourney"]);
  });

  it("addRecent prepends a new term", () => {
    const { result } = renderHook(() => useRecentSearches());
    act(() => result.current.addRecent("chatgpt"));
    expect(result.current.recent).toEqual(["chatgpt"]);
  });

  it("addRecent deduplicates case-insensitively", () => {
    const { result } = renderHook(() => useRecentSearches());
    act(() => result.current.addRecent("ChatGPT"));
    act(() => result.current.addRecent("chatgpt"));
    expect(result.current.recent).toEqual(["chatgpt"]);
  });

  it("addRecent moves duplicate to front preserving original case", () => {
    const { result } = renderHook(() => useRecentSearches());
    act(() => result.current.addRecent("chatgpt"));
    act(() => result.current.addRecent("midjourney"));
    act(() => result.current.addRecent("ChatGPT"));
    // The new term "ChatGPT" is moved to front, deduplication is by lowercase comparison
    expect(result.current.recent).toEqual(["ChatGPT", "midjourney"]);
  });

  it("addRecent caps at 6 items", () => {
    const { result } = renderHook(() => useRecentSearches());
    act(() => {
      for (let i = 0; i < 10; i++) {
        result.current.addRecent(`term-${i}`);
      }
    });
    expect(result.current.recent).toHaveLength(6);
    expect(result.current.recent[0]).toBe("term-9");
  });

  it("addRecent ignores empty strings", () => {
    const { result } = renderHook(() => useRecentSearches());
    act(() => result.current.addRecent(""));
    act(() => result.current.addRecent("   "));
    expect(result.current.recent).toEqual([]);
  });

  it("addRecent trims whitespace", () => {
    const { result } = renderHook(() => useRecentSearches());
    act(() => result.current.addRecent("  chatgpt  "));
    expect(result.current.recent).toEqual(["chatgpt"]);
  });

  it("clearRecent empties the list", () => {
    const { result } = renderHook(() => useRecentSearches());
    act(() => result.current.addRecent("chatgpt"));
    act(() => result.current.addRecent("midjourney"));
    act(() => result.current.clearRecent());
    expect(result.current.recent).toEqual([]);
  });

  it("clearRecent removes from localStorage", () => {
    const { result } = renderHook(() => useRecentSearches());
    act(() => result.current.addRecent("chatgpt"));
    expect(localStorage.getItem(STORAGE_KEY)).toBeDefined();
    act(() => result.current.clearRecent());
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("persists to localStorage on add", () => {
    const { result } = renderHook(() => useRecentSearches());
    act(() => result.current.addRecent("chatgpt"));
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    expect(stored).toEqual(["chatgpt"]);
  });

  it("handles malformed localStorage gracefully", () => {
    localStorage.setItem(STORAGE_KEY, "not-json");
    const { result } = renderHook(() => useRecentSearches());
    expect(result.current.recent).toEqual([]);
  });

  it("handles localStorage unavailable gracefully", () => {
    const original = Storage.prototype.getItem;
    Storage.prototype.getItem = vi.fn(() => {
      throw new Error("localStorage unavailable");
    });
    const { result } = renderHook(() => useRecentSearches());
    expect(result.current.recent).toEqual([]);
    Storage.prototype.getItem = original;
  });
});
