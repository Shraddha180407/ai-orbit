import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useHomeSearch } from "@/hooks/useHomeSearch";

const mockFetchSearchAutocomplete = vi.fn();
const mockFetchPopularSearches = vi.fn();
const mockFetchFeaturedTools = vi.fn();

vi.mock("@/lib/api", () => ({
  fetchSearchAutocomplete: (...args: any[]) => mockFetchSearchAutocomplete(...args),
  fetchPopularSearches: (...args: any[]) => mockFetchPopularSearches(...args),
  fetchFeaturedTools: (...args: any[]) => mockFetchFeaturedTools(...args),
}));

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  mockFetchSearchAutocomplete.mockReset();
  mockFetchPopularSearches.mockReset();
  mockFetchFeaturedTools.mockReset();
  mockFetchPopularSearches.mockResolvedValue(["AI tools", "image generation"]);
  mockFetchFeaturedTools.mockResolvedValue([{ id: "1", title: "ChatGPT" }]);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useHomeSearch", () => {
  it("loads popular and featured on mount", async () => {
    const { result } = renderHook(() => useHomeSearch(""));

    await waitFor(() => {
      expect(result.current.popular).toEqual(["AI tools", "image generation"]);
    });
    expect(result.current.featured).toEqual([{ id: "1", title: "ChatGPT" }]);
  });

  it("returns empty suggestions for empty query", () => {
    const { result } = renderHook(() => useHomeSearch(""));
    expect(result.current.suggestions).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it("debounces query and fetches suggestions", async () => {
    mockFetchSearchAutocomplete.mockResolvedValue([{ id: "1", title: "ChatGPT" }]);

    const { result, rerender } = renderHook(
      ({ query }) => useHomeSearch(query),
      { initialProps: { query: "" } }
    );

    rerender({ query: "chat" });
    expect(mockFetchSearchAutocomplete).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(200));

    await waitFor(() => {
      expect(mockFetchSearchAutocomplete).toHaveBeenCalledWith("chat");
    });
  });

  it("sets loading state during fetch", async () => {
    let resolveAutocomplete!: (value: any[]) => void;
    mockFetchSearchAutocomplete.mockReturnValue(
      new Promise((resolve) => {
        resolveAutocomplete = resolve;
      })
    );

    const { result, rerender } = renderHook(
      ({ query }) => useHomeSearch(query),
      { initialProps: { query: "" } }
    );

    rerender({ query: "test" });
    act(() => vi.advanceTimersByTime(200));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    act(() => resolveAutocomplete([{ id: "1", title: "Test" }]));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it("clears suggestions when query becomes empty", async () => {
    mockFetchSearchAutocomplete.mockResolvedValue([{ id: "1", title: "Test" }]);

    const { result, rerender } = renderHook(
      ({ query }) => useHomeSearch(query),
      { initialProps: { query: "test" } }
    );

    act(() => vi.advanceTimersByTime(200));

    await waitFor(() => {
      expect(result.current.suggestions).toHaveLength(1);
    });

    rerender({ query: "" });

    await waitFor(() => {
      expect(result.current.suggestions).toEqual([]);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it("cancels stale fetches on unmount", async () => {
    let resolveFetch!: (value: any[]) => void;
    mockFetchSearchAutocomplete.mockReturnValue(
      new Promise((resolve) => {
        resolveFetch = resolve;
      })
    );

    const { result, rerender, unmount } = renderHook(
      ({ query }) => useHomeSearch(query),
      { initialProps: { query: "" } }
    );

    rerender({ query: "test" });
    act(() => vi.advanceTimersByTime(200));

    unmount();

    // Should not throw when resolving after unmount
    act(() => resolveFetch([{ id: "1", title: "Test" }]));
  });
});
