import { describe, it, expect, vi, beforeEach } from "vitest";
import { getTools, getAllCategories, getToolDetails, getToolBySlug } from "@/lib/tools";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

function jsonResponse(data: any, ok = true, status = 200) {
  return {
    ok,
    status,
    json: () => Promise.resolve(data),
  };
}

beforeEach(() => {
  mockFetch.mockReset();
});

describe("getTools", () => {
  it("fetches tools with default params", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ tools: [], total: 0, categories: [] }));
    const result = await getTools({});
    expect(result.tools).toEqual([]);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/tools"),
      expect.objectContaining({ cache: "no-store" })
    );
  });

  it("builds query string with params", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ tools: [], total: 0, categories: [] }));
    await getTools({ q: "test", category: "coding", pricing: "Free", sort: "newest", page: "2" });
    const url = mockFetch.mock.calls[0][0];
    expect(url).toContain("q=test");
    expect(url).toContain("category=coding");
    expect(url).toContain("pricing=Free");
    expect(url).toContain("sort=newest");
    expect(url).toContain("page=2");
  });

  it("skips undefined params", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ tools: [], total: 0, categories: [] }));
    await getTools({ q: "test" });
    const url = mockFetch.mock.calls[0][0];
    expect(url).toContain("q=test");
    expect(url).not.toContain("category=");
    expect(url).not.toContain("pricing=");
  });

  it("returns fallback data on error", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));
    const result = await getTools({ page: "3" });
    expect(result.tools).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.page).toBe(3);
    expect(result.totalPages).toBe(1);
  });

  it("returns fallback data on non-ok response", async () => {
    mockFetch.mockResolvedValue(jsonResponse(null, false, 500));
    const result = await getTools({});
    expect(result.tools).toEqual([]);
    expect(result.total).toBe(0);
  });
});

describe("getAllCategories", () => {
  it("fetches categories", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ categories: ["coding", "design"] }));
    const result = await getAllCategories();
    expect(result).toEqual(["coding", "design"]);
  });

  it("returns empty array on failure", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));
    expect(await getAllCategories()).toEqual([]);
  });

  it("returns empty array when categories is undefined", async () => {
    mockFetch.mockResolvedValue(jsonResponse({}));
    expect(await getAllCategories()).toEqual([]);
  });
});

describe("getToolDetails", () => {
  it("fetches tool details by slug", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ tool: { name: "TestTool" } }));
    const result = await getToolDetails("testtool");
    expect(result).toEqual({ tool: { name: "TestTool" } });
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/tools/testtool"),
      expect.objectContaining({ cache: "no-store" })
    );
  });

  it("returns null on failure", async () => {
    mockFetch.mockResolvedValue(jsonResponse(null, false, 404));
    expect(await getToolDetails("nonexistent")).toBeNull();
  });

  it("returns null on network error", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));
    expect(await getToolDetails("test")).toBeNull();
  });
});

describe("getToolBySlug", () => {
  it("returns tool object from details", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ tool: { name: "TestTool", slug: "test" } }));
    const result = await getToolBySlug("test");
    expect(result).toEqual({ name: "TestTool", slug: "test" });
  });

  it("returns null when tool is missing", async () => {
    mockFetch.mockResolvedValue(jsonResponse({}));
    expect(await getToolBySlug("test")).toBeNull();
  });

  it("returns null on API failure", async () => {
    mockFetch.mockResolvedValue(jsonResponse(null, false, 500));
    expect(await getToolBySlug("test")).toBeNull();
  });
});
