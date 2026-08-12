import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useAutocomplete } from "@/hooks/useAutocomplete";

const mockGetAutocomplete = vi.fn();
const mockGetPopularSearches = vi.fn();

vi.mock("@/lib/search-api", () => ({
  getAutocomplete: (...args: any[]) => mockGetAutocomplete(...args),
  getPopularSearches: (...args: any[]) => mockGetPopularSearches(...args),
}));

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  mockGetAutocomplete.mockReset();
  mockGetPopularSearches.mockReset();
  mockGetPopularSearches.mockResolvedValue(["AI coding", "image generation"]);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useAutocomplete", () => {
  it("loads popular searches on mount", async () => {
    const { result } = renderHook(() => useAutocomplete(""));

    await waitFor(() => {
      expect(result.current.popular).toEqual(["AI coding", "image generation"]);
    });
  });

  it("returns empty suggestions for empty query", () => {
    const { result } = renderHook(() => useAutocomplete(""));
    expect(result.current.suggestions).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("debounces query and fetches suggestions", async () => {
    mockGetAutocomplete.mockResolvedValue([
      { id: "1", type: "tool", title: "ChatGPT", category: "Productivity" },
    ]);

    const { result, rerender } = renderHook(
      ({ query }) => useAutocomplete(query),
      { initialProps: { query: "" } }
    );

    rerender({ query: "chat" });

    // Not yet debounced
    expect(mockGetAutocomplete).not.toHaveBeenCalled();

    // Advance past debounce
    act(() => vi.advanceTimersByTime(250));

    await waitFor(() => {
      expect(result.current.suggestions).toHaveLength(1);
    });
  });

  it("sets loading state during fetch", async () => {
    let resolveAutocomplete!: (value: any[]) => void;
    mockGetAutocomplete.mockReturnValue(
      new Promise((resolve) => {
        resolveAutocomplete = resolve;
      })
    );

    const { result, rerender } = renderHook(
      ({ query }) => useAutocomplete(query),
      { initialProps: { query: "" } }
    );

    rerender({ query: "test" });
    act(() => vi.advanceTimersByTime(250));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    act(() => resolveAutocomplete([{ id: "1", type: "tool", title: "Test", category: "Test" }]));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it("handles error state", async () => {
    mockGetAutocomplete.mockRejectedValue(new Error("Network error"));

    const { result, rerender } = renderHook(
      ({ query }) => useAutocomplete(query),
      { initialProps: { query: "" } }
    );

    rerender({ query: "test" });
    act(() => vi.advanceTimersByTime(250));

    await waitFor(() => {
      expect(result.current.error).toBe("Couldn't load suggestions.");
    });
    expect(result.current.suggestions).toEqual([]);
  });

  it("discards stale responses", async () => {
    let callCount = 0;
    mockGetAutocomplete.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return new Promise((resolve) => setTimeout(() => resolve([{ id: "slow", type: "tool", title: "Slow", category: "Test" }]), 500));
      }
      return Promise.resolve([{ id: "fast", type: "tool", title: "Fast", category: "Test" }]);
    });

    const { result, rerender } = renderHook(
      ({ query }) => useAutocomplete(query),
      { initialProps: { query: "" } }
    );

    // First query
    rerender({ query: "slow" });
    act(() => vi.advanceTimersByTime(250));

    // Second query quickly (before first resolves)
    rerender({ query: "fast" });
    act(() => vi.advanceTimersByTime(250));

    await waitFor(() => {
      expect(result.current.suggestions).toHaveLength(1);
    });

    // The fast result should win
    expect(result.current.suggestions[0].id).toBe("fast");
  });

  it("clears suggestions when query becomes empty", async () => {
    mockGetAutocomplete.mockResolvedValue([
      { id: "1", type: "tool", title: "ChatGPT", category: "Productivity" },
    ]);

    const { result, rerender } = renderHook(
      ({ query }) => useAutocomplete(query),
      { initialProps: { query: "chat" } }
    );

    act(() => vi.advanceTimersByTime(250));

    await waitFor(() => {
      expect(result.current.suggestions).toHaveLength(1);
    });

    rerender({ query: "" });

    await waitFor(() => {
      expect(result.current.suggestions).toEqual([]);
    });
  });

  it("returns empty suggestions when query is empty (even if state has values)", async () => {
    mockGetAutocomplete.mockResolvedValue([
      { id: "1", type: "tool", title: "ChatGPT", category: "Productivity" },
    ]);

    const { result, rerender } = renderHook(
      ({ query }) => useAutocomplete(query),
      { initialProps: { query: "chat" } }
    );

    act(() => vi.advanceTimersByTime(250));
    await waitFor(() => {
      expect(result.current.suggestions).toHaveLength(1);
    });

    rerender({ query: "" });

    // Advance debounce so trimmedQuery becomes ""
    act(() => vi.advanceTimersByTime(250));

    await waitFor(() => {
      expect(result.current.suggestions).toEqual([]);
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
