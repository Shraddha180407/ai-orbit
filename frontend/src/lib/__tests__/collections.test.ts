import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchCollections, getCollectionDetail, toggleBookmark } from "@/lib/collections";

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

describe("fetchCollections", () => {
  it("fetches collections with default params", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ items: [], nextCursor: null }));
    const result = await fetchCollections({});
    expect(result.items).toEqual([]);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/collections"),
      expect.objectContaining({ headers: { Accept: "application/json" } })
    );
  });

  it("builds query string with params", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ items: [], nextCursor: null }));
    await fetchCollections({
      search: "test",
      creatorType: "EDITORIAL",
      featured: true,
      hasRelatedModels: true,
      hasRelatedCompanies: true,
      updatedWithin: "7d",
      sort: "recently_updated",
      cursor: "abc",
      category: ["coding", "design"],
    });
    const url = mockFetch.mock.calls[0][0];
    expect(url).toContain("search=test");
    expect(url).toContain("creatorType=EDITORIAL");
    expect(url).toContain("featured=true");
    expect(url).toContain("hasRelatedModels=true");
    expect(url).toContain("hasRelatedCompanies=true");
    expect(url).toContain("updatedWithin=7d");
    expect(url).toContain("sort=recently_updated");
    expect(url).toContain("cursor=abc");
    expect(url).toContain("category=coding");
    expect(url).toContain("category=design");
  });

  it("supports AbortSignal", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ items: [], nextCursor: null }));
    const controller = new AbortController();
    await fetchCollections({}, controller.signal);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ signal: controller.signal })
    );
  });

  it("throws on non-ok response", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ error: "Bad request" }, false, 400));
    await expect(fetchCollections({})).rejects.toThrow("Bad request");
  });

  it("throws generic error when no error message", async () => {
    mockFetch.mockResolvedValue(jsonResponse({}, false, 500));
    await expect(fetchCollections({})).rejects.toThrow("Request failed with status 500");
  });
});

describe("getCollectionDetail", () => {
  it("fetches collection detail by slug", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ collection: { name: "Test" }, related: [] }));
    const result = await getCollectionDetail("test");
    expect(result?.collection.name).toBe("Test");
    expect(result?.related).toEqual([]);
  });

  it("returns null on failure", async () => {
    mockFetch.mockResolvedValue(jsonResponse(null, false, 404));
    expect(await getCollectionDetail("nonexistent")).toBeNull();
  });

  it("defaults related to empty array", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ collection: { name: "Test" } }));
    const result = await getCollectionDetail("test");
    expect(result?.related).toEqual([]);
  });
});

describe("toggleBookmark", () => {
  it("sends POST for bookmark false (adding bookmark)", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ bookmarked: false }));
    const result = await toggleBookmark("col-1", false);
    expect(result).toBe(false);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/collections/col-1/bookmark"),
      expect.objectContaining({ method: "POST" })
    );
  });

  it("sends DELETE for bookmark true (removing bookmark)", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ bookmarked: true }));
    const result = await toggleBookmark("col-1", true);
    expect(result).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/collections/col-1/bookmark"),
      expect.objectContaining({ method: "DELETE" })
    );
  });

  it("throws on non-ok response", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ error: "Unauthorized" }, false, 401));
    await expect(toggleBookmark("col-1", true)).rejects.toThrow("Unauthorized");
  });

  it("throws generic error when no error message", async () => {
    mockFetch.mockResolvedValue(jsonResponse({}, false, 500));
    await expect(toggleBookmark("col-1", true)).rejects.toThrow("Request failed with status 500");
  });
});
