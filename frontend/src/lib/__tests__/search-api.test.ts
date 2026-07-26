import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getSearchResults,
  getFacetCounts,
  getEntityBySlug,
} from "@/lib/search-api";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

function jsonResponse(data: any, ok = true, status = 200) {
  return { ok, status, json: () => Promise.resolve(data) };
}

beforeEach(() => {
  mockFetch.mockReset();
  localStorage.clear();
});

describe("getSearchResults", () => {
  it("returns results with empty query", async () => {
    const result = await getSearchResults({
      q: "",
      types: [],
      categories: [],
      sort: "relevance",
    });
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.total).toBeGreaterThan(0);
  });

  it("filters by query", async () => {
    const result = await getSearchResults({
      q: "ChatGPT",
      types: [],
      categories: [],
      sort: "relevance",
    });
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items[0].title.toLowerCase()).toContain("chatgpt");
  });

  it("filters by type", async () => {
    const result = await getSearchResults({
      q: "",
      types: ["tool"],
      categories: [],
      sort: "relevance",
    });
    for (const item of result.items) {
      expect(item.type).toBe("tool");
    }
  });

  it("sorts by newest", async () => {
    const result = await getSearchResults({
      q: "",
      types: [],
      categories: [],
      sort: "newest",
    });
    for (let i = 1; i < result.items.length; i++) {
      expect(
        new Date(result.items[i - 1].createdAt).getTime()
      ).toBeGreaterThanOrEqual(
        new Date(result.items[i].createdAt).getTime()
      );
    }
  });

  it("sorts by popular", async () => {
    const result = await getSearchResults({
      q: "",
      types: [],
      categories: [],
      sort: "popular",
    });
    for (let i = 1; i < result.items.length; i++) {
      expect(result.items[i - 1].popularityScore).toBeGreaterThanOrEqual(
        result.items[i].popularityScore
      );
    }
  });

  it("sorts by az", async () => {
    const result = await getSearchResults({
      q: "",
      types: [],
      categories: [],
      sort: "az",
    });
    for (let i = 1; i < result.items.length; i++) {
      expect(
        result.items[i - 1].title.localeCompare(result.items[i].title)
      ).toBeLessThanOrEqual(0);
    }
  });

  it("handles trending view", async () => {
    const result = await getSearchResults({
      q: "",
      types: [],
      categories: [],
      sort: "relevance",
      view: "trending",
    });
    expect(result.items.length).toBeGreaterThan(0);
  });

  it("handles leaderboard view", async () => {
    const result = await getSearchResults({
      q: "",
      types: [],
      categories: [],
      sort: "relevance",
      view: "leaderboard",
    });
    expect(result.items.length).toBeGreaterThan(0);
    for (let i = 1; i < result.items.length; i++) {
      expect(result.items[i - 1].popularityScore).toBeGreaterThanOrEqual(
        result.items[i].popularityScore
      );
    }
  });

  it("filters by pricing", async () => {
    const result = await getSearchResults({
      q: "",
      types: [],
      categories: [],
      pricing: ["Free"],
      sort: "relevance",
    });
    for (const item of result.items) {
      expect(item.meta.pricing).toBe("Free");
    }
  });

  it("filters by category", async () => {
    const result = await getSearchResults({
      q: "",
      types: [],
      categories: ["Coding"],
      sort: "relevance",
    });
    for (const item of result.items) {
      expect(item.category).toBe("Coding");
    }
  });

  it("filters by country", async () => {
    const result = await getSearchResults({
      q: "",
      types: [],
      categories: [],
      countries: ["US"],
      sort: "relevance",
    });
    for (const item of result.items) {
      expect(item.country).toBe("US");
    }
  });

  it("filters by price range", async () => {
    const result = await getSearchResults({
      q: "",
      types: [],
      categories: [],
      priceMin: 0,
      priceMax: 50,
      sort: "relevance",
    });
    for (const item of result.items) {
      if (item.priceAmount !== undefined) {
        expect(item.priceAmount).toBeGreaterThanOrEqual(0);
        expect(item.priceAmount).toBeLessThanOrEqual(50);
      }
    }
  });

  it("throws when force-error is set in localStorage", async () => {
    localStorage.setItem("search:force-error", "1");
    await expect(
      getSearchResults({ q: "", types: [], categories: [], sort: "relevance" })
    ).rejects.toThrow("Network request failed");
  });
});

describe("getFacetCounts", () => {
  it("returns facet counts", async () => {
    const result = await getFacetCounts({
      q: "",
      types: [],
      categories: [],
    });
    expect(result.types).toBeDefined();
    expect(result.categories).toBeDefined();
    expect(result.pricing).toBeDefined();
    expect(result.features).toBeDefined();
    expect(result.countries).toBeDefined();
    expect(result.priceBounds).toBeDefined();
    expect(typeof result.priceBounds.min).toBe("number");
    expect(typeof result.priceBounds.max).toBe("number");
  });

  it("counts are non-negative", async () => {
    const result = await getFacetCounts({
      q: "",
      types: [],
      categories: [],
    });
    for (const count of Object.values(result.types)) {
      expect(count).toBeGreaterThanOrEqual(0);
    }
    for (const count of Object.values(result.categories)) {
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  it("throws when force-error is set", async () => {
    localStorage.setItem("search:force-error", "1");
    await expect(
      getFacetCounts({ q: "", types: [], categories: [] })
    ).rejects.toThrow("Network request failed");
  });
});

describe("getEntityBySlug", () => {
  it("finds entity by type and slug", async () => {
    const result = await getEntityBySlug("tool", "chatgpt");
    if (result) {
      expect(result.type).toBe("tool");
      expect(result.slug).toBe("chatgpt");
    }
  });

  it("returns null for nonexistent entity", async () => {
    const result = await getEntityBySlug("tool", "nonexistent-slug-xyz");
    expect(result).toBeNull();
  });

  it("throws when force-error is set", async () => {
    localStorage.setItem("search:force-error", "1");
    await expect(getEntityBySlug("tool", "test")).rejects.toThrow(
      "Network request failed"
    );
  });
});
