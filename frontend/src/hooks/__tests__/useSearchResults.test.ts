import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useSearchResults } from "@/hooks/useSearchResults";
import { renderHookWithQueryClient } from "./test-utils";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => "/search/results",
  useSearchParams: () => new URLSearchParams(""),
}));

const mockGetSearchResults = vi.fn();
const mockGetFacetCounts = vi.fn();

vi.mock("@/lib/search-api", () => ({
  getSearchResults: (...args: any[]) => mockGetSearchResults(...args),
  getFacetCounts: (...args: any[]) => mockGetFacetCounts(...args),
}));

beforeEach(() => {
  mockGetSearchResults.mockReset();
  mockGetFacetCounts.mockReset();
  mockGetSearchResults.mockResolvedValue({ items: [], total: 0 });
  mockGetFacetCounts.mockResolvedValue({
    types: {},
    categories: {},
    pricing: {},
    features: {},
    countries: {},
    priceBounds: { min: 0, max: 300 },
  });
});

describe("useSearchResults", () => {
  it("initializes with default values", async () => {
    const { result } = renderHookWithQueryClient(() => useSearchResults());

    expect(result.current.q).toBe("");
    expect(result.current.types).toEqual([]);
    expect(result.current.categories).toEqual([]);
    expect(result.current.sort).toBe("relevance");
    expect(result.current.data).toEqual({ items: [], total: 0 });
    expect(result.current.hasActiveFilters).toBe(false);
  });

  it("fetches results on mount", async () => {
    mockGetSearchResults.mockResolvedValue({
      items: [{ id: "1", title: "Test" }],
      total: 1,
    });
    mockGetFacetCounts.mockResolvedValue({
      types: { tool: 1 },
      categories: {},
      pricing: {},
      features: {},
      countries: {},
      priceBounds: { min: 0, max: 300 },
    });

    const { result } = renderHookWithQueryClient(() => useSearchResults());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockGetSearchResults).toHaveBeenCalled();
    expect(mockGetFacetCounts).toHaveBeenCalled();
  });

  it("handles error state", async () => {
    mockGetSearchResults.mockRejectedValue(new Error("fail"));
    mockGetFacetCounts.mockRejectedValue(new Error("fail"));

    const { result } = renderHookWithQueryClient(() => useSearchResults());

    await waitFor(() => {
      expect(result.current.error).toBe("Something went wrong while searching. Please try again.");
    });
  });

  it("provides setter functions", () => {
    const { result } = renderHookWithQueryClient(() => useSearchResults());

    expect(typeof result.current.setQuery).toBe("function");
    expect(typeof result.current.setTypes).toBe("function");
    expect(typeof result.current.setCategories).toBe("function");
    expect(typeof result.current.setPricing).toBe("function");
    expect(typeof result.current.setFeatures).toBe("function");
    expect(typeof result.current.setCountries).toBe("function");
    expect(typeof result.current.setPriceRange).toBe("function");
    expect(typeof result.current.setSort).toBe("function");
    expect(typeof result.current.clearFilters).toBe("function");
    expect(typeof result.current.retry).toBe("function");
  });

  it("provides retry function", () => {
    const { result } = renderHookWithQueryClient(() => useSearchResults());
    expect(typeof result.current.retry).toBe("function");
  });

  it("hasActiveFilters is false by default", () => {
    const { result } = renderHookWithQueryClient(() => useSearchResults());
    expect(result.current.hasActiveFilters).toBe(false);
  });
});
