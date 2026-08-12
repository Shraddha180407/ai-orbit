import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  API_URL,
  fetchLeaderboardTools,
  fetchLeaderboardModels,
  fetchLeaderboardCompanies,
  fetchAllCompanies,
  fetchCompanyDetails,
  fetchAllModels,
  fetchAllNews,
  fetchRepositories,
  fetchRepositoryBySlug,
  fetchAllRepos,
  fetchAllVideos,
  fetchAllRobots,
  fetchAllDevices,
  fetchDeviceById,
  fetchSearchAutocomplete,
  fetchPopularSearches,
  fetchFeaturedTools,
  fetchTasks,
  toggleTaskSubscription,
  fetchRepositoryOwners,
} from "@/lib/api";

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

afterEach(() => {
  vi.restoreAllMocks();
});

describe("API_URL", () => {
  it("resolves to a valid URL string", () => {
    expect(typeof API_URL).toBe("string");
    expect(API_URL).toMatch(/^https?:\/\//);
  });
});

describe("fetchLeaderboardTools", () => {
  it("fetches tools without category", async () => {
    mockFetch.mockResolvedValue(jsonResponse([{ name: "Tool1" }]));
    const result = await fetchLeaderboardTools();
    expect(result).toEqual([{ name: "Tool1" }]);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/leaderboard/tools"),
      expect.any(Object)
    );
  });

  it("adds category param when provided", async () => {
    mockFetch.mockResolvedValue(jsonResponse([{ name: "Tool1" }]));
    await fetchLeaderboardTools("coding");
    const url = mockFetch.mock.calls[0][0];
    expect(url).toContain("category=coding");
  });

  it("does not add category for 'All Categories'", async () => {
    mockFetch.mockResolvedValue(jsonResponse([{ name: "Tool1" }]));
    await fetchLeaderboardTools("All Categories");
    const url = mockFetch.mock.calls[0][0];
    expect(url).not.toContain("category=");
  });

  it("returns empty array on failure", async () => {
    mockFetch.mockResolvedValue(jsonResponse(null, false, 500));
    const result = await fetchLeaderboardTools();
    expect(result).toEqual([]);
  });
});

describe("fetchLeaderboardModels", () => {
  it("fetches models successfully", async () => {
    mockFetch.mockResolvedValue(jsonResponse([{ name: "Model1" }]));
    const result = await fetchLeaderboardModels();
    expect(result).toEqual([{ name: "Model1" }]);
  });

  it("returns empty array on failure", async () => {
    mockFetch.mockResolvedValue(jsonResponse(null, false, 500));
    expect(await fetchLeaderboardModels()).toEqual([]);
  });
});

describe("fetchLeaderboardCompanies", () => {
  it("fetches companies successfully", async () => {
    mockFetch.mockResolvedValue(jsonResponse([{ name: "Co1" }]));
    expect(await fetchLeaderboardCompanies()).toEqual([{ name: "Co1" }]);
  });

  it("returns empty array on failure", async () => {
    mockFetch.mockResolvedValue(jsonResponse(null, false, 500));
    expect(await fetchLeaderboardCompanies()).toEqual([]);
  });
});

describe("fetchAllCompanies", () => {
  it("fetches all companies", async () => {
    mockFetch.mockResolvedValue(jsonResponse([{ name: "Co1" }]));
    expect(await fetchAllCompanies()).toEqual([{ name: "Co1" }]);
  });

  it("returns empty array on failure", async () => {
    mockFetch.mockResolvedValue(jsonResponse(null, false, 500));
    expect(await fetchAllCompanies()).toEqual([]);
  });
});

describe("fetchCompanyDetails", () => {
  it("fetches company by slug", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ name: "Co1" }));
    const result = await fetchCompanyDetails("co1");
    expect(result).toEqual({ name: "Co1" });
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/companies/co1"),
      expect.any(Object)
    );
  });

  it("returns null on failure", async () => {
    mockFetch.mockResolvedValue(jsonResponse(null, false, 404));
    expect(await fetchCompanyDetails("nonexistent")).toBeNull();
  });
});

describe("fetchAllModels", () => {
  it("fetches all models", async () => {
    mockFetch.mockResolvedValue(jsonResponse([{ name: "M1" }]));
    expect(await fetchAllModels()).toEqual([{ name: "M1" }]);
  });

  it("returns empty array on failure", async () => {
    mockFetch.mockResolvedValue(jsonResponse(null, false, 500));
    expect(await fetchAllModels()).toEqual([]);
  });
});

describe("fetchAllNews", () => {
  it("fetches all news", async () => {
    mockFetch.mockResolvedValue(jsonResponse([{ title: "News1" }]));
    expect(await fetchAllNews()).toEqual([{ title: "News1" }]);
  });

  it("returns empty array on failure", async () => {
    mockFetch.mockResolvedValue(jsonResponse(null, false, 500));
    expect(await fetchAllNews()).toEqual([]);
  });
});

describe("fetchRepositories", () => {
  it("fetches repositories with default params", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ items: [], nextCursor: null, hasMore: false, total: 0 }));
    const result = await fetchRepositories();
    expect(result.items).toEqual([]);
  });

  it("passes query params correctly", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ items: [], nextCursor: null, hasMore: false, total: 0 }));
    await fetchRepositories({ limit: 10, sort: "stars", language: "TypeScript", q: "test" });
    const url = mockFetch.mock.calls[0][0];
    expect(url).toContain("limit=10");
    expect(url).toContain("sort=stars");
    expect(url).toContain("language=TypeScript");
    expect(url).toContain("q=test");
  });

  it("returns empty response on failure", async () => {
    mockFetch.mockResolvedValue(jsonResponse(null, false, 500));
    const result = await fetchRepositories();
    expect(result).toEqual({ items: [], nextCursor: null, hasMore: false, total: 0 });
  });
});

describe("fetchRepositoryBySlug", () => {
  it("fetches repository by slug", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ name: "repo1" }));
    const result = await fetchRepositoryBySlug("repo1");
    expect(result).toEqual({ name: "repo1" });
  });

  it("returns null on failure", async () => {
    mockFetch.mockResolvedValue(jsonResponse(null, false, 404));
    expect(await fetchRepositoryBySlug("nonexistent")).toBeNull();
  });
});

describe("fetchAllRepos", () => {
  it("fetches all repos from fetchRepositories", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ items: [{ name: "r1" }], nextCursor: null, hasMore: false, total: 1 }));
    const result = await fetchAllRepos();
    expect(result).toEqual([{ name: "r1" }]);
  });

  it("returns empty array on error", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));
    const result = await fetchAllRepos();
    expect(result).toEqual([]);
  });

  it("guards against non-array items", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ items: "not-an-array", nextCursor: null, hasMore: false, total: 0 }));
    const result = await fetchAllRepos();
    expect(result).toEqual([]);
  });
});

describe("fetchAllVideos", () => {
  it("fetches all videos", async () => {
    mockFetch.mockResolvedValue(jsonResponse([{ title: "V1" }]));
    expect(await fetchAllVideos()).toEqual([{ title: "V1" }]);
  });

  it("returns empty array on failure", async () => {
    mockFetch.mockResolvedValue(jsonResponse(null, false, 500));
    expect(await fetchAllVideos()).toEqual([]);
  });
});

describe("fetchAllRobots", () => {
  it("fetches all robots", async () => {
    mockFetch.mockResolvedValue(jsonResponse([{ name: "Bot1" }]));
    expect(await fetchAllRobots()).toEqual([{ name: "Bot1" }]);
  });

  it("returns empty array on failure", async () => {
    mockFetch.mockResolvedValue(jsonResponse(null, false, 500));
    expect(await fetchAllRobots()).toEqual([]);
  });
});

describe("fetchAllDevices", () => {
  it("fetches all devices", async () => {
    mockFetch.mockResolvedValue(jsonResponse([{ name: "Dev1" }]));
    expect(await fetchAllDevices()).toEqual([{ name: "Dev1" }]);
  });

  it("returns empty array on failure", async () => {
    mockFetch.mockResolvedValue(jsonResponse(null, false, 500));
    expect(await fetchAllDevices()).toEqual([]);
  });
});

describe("fetchDeviceById", () => {
  it("fetches device by id", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ name: "Dev1" }));
    const result = await fetchDeviceById("123");
    expect(result).toEqual({ name: "Dev1" });
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/devices/123"),
      expect.any(Object)
    );
  });

  it("returns null on failure", async () => {
    mockFetch.mockResolvedValue(jsonResponse(null, false, 404));
    expect(await fetchDeviceById("nonexistent")).toBeNull();
  });
});

describe("fetchSearchAutocomplete", () => {
  it("fetches suggestions for valid query", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ suggestions: [{ id: "1", title: "ChatGPT" }] }));
    const result = await fetchSearchAutocomplete("chat");
    expect(result).toEqual([{ id: "1", title: "ChatGPT" }]);
  });

  it("returns empty array for empty query", async () => {
    const result = await fetchSearchAutocomplete("");
    expect(result).toEqual([]);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("returns empty array for whitespace-only query", async () => {
    const result = await fetchSearchAutocomplete("   ");
    expect(result).toEqual([]);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("returns empty array on failure", async () => {
    mockFetch.mockResolvedValue(jsonResponse(null, false, 500));
    expect(await fetchSearchAutocomplete("test")).toEqual([]);
  });

  it("trims whitespace from query", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ suggestions: [] }));
    await fetchSearchAutocomplete("  chat  ");
    const url = mockFetch.mock.calls[0][0];
    expect(url).toContain("q=chat");
  });
});

describe("fetchPopularSearches", () => {
  it("fetches popular searches", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ popular: ["AI", "tools"] }));
    const result = await fetchPopularSearches();
    expect(result).toEqual(["AI", "tools"]);
  });

  it("returns empty array on failure", async () => {
    mockFetch.mockResolvedValue(jsonResponse(null, false, 500));
    expect(await fetchPopularSearches()).toEqual([]);
  });
});

describe("fetchFeaturedTools", () => {
  it("fetches featured tools", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ featured: [{ id: "1" }] }));
    const result = await fetchFeaturedTools();
    expect(result).toEqual([{ id: "1" }]);
  });

  it("returns empty array on failure", async () => {
    mockFetch.mockResolvedValue(jsonResponse(null, false, 500));
    expect(await fetchFeaturedTools()).toEqual([]);
  });
});

describe("fetchTasks", () => {
  it("fetches tasks without category", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ tasks: [], total: 0 }));
    const result = await fetchTasks();
    expect(result).toEqual({ tasks: [], total: 0 });
  });

  it("adds category param when provided", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ tasks: [], total: 0 }));
    await fetchTasks("coding");
    const url = mockFetch.mock.calls[0][0];
    expect(url).toContain("category=coding");
  });

  it("returns empty result on failure", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));
    const result = await fetchTasks();
    expect(result).toEqual({ tasks: [], total: 0 });
  });

  it("returns empty result on non-ok response", async () => {
    mockFetch.mockResolvedValue(jsonResponse(null, false, 500));
    const result = await fetchTasks();
    expect(result).toEqual({ tasks: [], total: 0 });
  });
});

describe("toggleTaskSubscription", () => {
  it("returns true on success", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ subscribed: true }));
    const result = await toggleTaskSubscription("task-1");
    expect(result).toBe(true);
  });

  it("returns false on failure", async () => {
    mockFetch.mockResolvedValue(jsonResponse(null, false, 500));
    expect(await toggleTaskSubscription("task-1")).toBe(false);
  });

  it("returns false on network error", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));
    expect(await toggleTaskSubscription("task-1")).toBe(false);
  });
});

describe("fetchRepositoryOwners", () => {
  it("fetches owners successfully", async () => {
    mockFetch.mockResolvedValue(jsonResponse([{ owner: "user1" }]));
    const result = await fetchRepositoryOwners();
    expect(result).toEqual([{ owner: "user1" }]);
  });

  it("returns empty array on failure", async () => {
    mockFetch.mockResolvedValue(jsonResponse(null, false, 500));
    expect(await fetchRepositoryOwners()).toEqual([]);
  });
});
