import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getTrendingVideos,
  getLatestVideos,
  getAllVideos,
  getVideosPage,
  getVideosCount,
  getVideoBySlug,
  getRelatedVideos,
} from "@/lib/videos-data";
import { invalidateClientCache } from "@/lib/api-cache";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

function jsonResponse(data: any, ok = true) {
  return {
    ok,
    json: () => Promise.resolve(data),
  };
}

beforeEach(() => {
  mockFetch.mockReset();
  invalidateClientCache();
});

describe("getTrendingVideos", () => {
  it("fetches trending videos with default limit", async () => {
    mockFetch.mockResolvedValue(jsonResponse([{ id: "1" }]));
    const result = await getTrendingVideos();
    expect(result).toEqual([{ id: "1" }]);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/videos?sort=trending&limit=4"),
      expect.anything()
    );
  });

  it("uses custom limit", async () => {
    mockFetch.mockResolvedValue(jsonResponse([]));
    await getTrendingVideos(10);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("limit=10"),
      expect.anything()
    );
  });

  it("returns empty array on failure", async () => {
    mockFetch.mockResolvedValue(jsonResponse(null, false));
    expect(await getTrendingVideos()).toEqual([]);
  });

  it("returns empty array on network error", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));
    expect(await getTrendingVideos()).toEqual([]);
  });
});

describe("getLatestVideos", () => {
  it("fetches latest videos with default limit", async () => {
    mockFetch.mockResolvedValue(jsonResponse([{ id: "1" }]));
    const result = await getLatestVideos();
    expect(result).toEqual([{ id: "1" }]);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/videos?sort=latest&limit=6"),
      expect.anything()
    );
  });

  it("returns empty array on failure", async () => {
    mockFetch.mockResolvedValue(jsonResponse(null, false));
    expect(await getLatestVideos()).toEqual([]);
  });
});

describe("getAllVideos", () => {
  it("fetches all videos", async () => {
    mockFetch.mockResolvedValue(jsonResponse([{ id: "1" }]));
    const result = await getAllVideos();
    expect(result).toEqual([{ id: "1" }]);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/videos?sort=latest"),
      expect.anything()
    );
  });

  it("returns empty array on failure", async () => {
    mockFetch.mockResolvedValue(jsonResponse(null, false));
    expect(await getAllVideos()).toEqual([]);
  });
});

describe("getVideosPage", () => {
  it("fetches paginated videos", async () => {
    mockFetch.mockResolvedValue(jsonResponse([{ id: "1" }]));
    const result = await getVideosPage(10, 20);
    expect(result).toEqual([{ id: "1" }]);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("limit=10&offset=20"),
      expect.anything()
    );
  });

  it("returns empty array on failure", async () => {
    mockFetch.mockResolvedValue(jsonResponse(null, false));
    expect(await getVideosPage(10, 0)).toEqual([]);
  });
});

describe("getVideosCount", () => {
  it("fetches video count", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ total: 42 }));
    const result = await getVideosCount();
    expect(result).toBe(42);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/videos/count"),
      expect.anything()
    );
  });

  it("returns 0 on failure", async () => {
    mockFetch.mockResolvedValue(jsonResponse(null, false));
    expect(await getVideosCount()).toBe(0);
  });

  it("returns 0 on network error", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));
    expect(await getVideosCount()).toBe(0);
  });
});

describe("getVideoBySlug", () => {
  it("fetches video by slug", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ id: "1", slug: "test" }));
    const result = await getVideoBySlug("test");
    expect(result?.slug).toBe("test");
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/videos/test"),
      expect.anything()
    );
  });

  it("returns null on failure", async () => {
    mockFetch.mockResolvedValue(jsonResponse(null, false));
    expect(await getVideoBySlug("nonexistent")).toBeNull();
  });
});

describe("getRelatedVideos", () => {
  it("fetches related videos for a video", async () => {
    const video = { slug: "test-video" } as any;
    mockFetch.mockResolvedValue(jsonResponse([{ id: "2" }]));
    const result = await getRelatedVideos(video);
    expect(result).toEqual([{ id: "2" }]);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/videos/test-video/related?limit=4"),
      expect.anything()
    );
  });

  it("uses custom limit", async () => {
    const video = { slug: "test" } as any;
    mockFetch.mockResolvedValue(jsonResponse([]));
    await getRelatedVideos(video, 8);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("limit=8"),
      expect.anything()
    );
  });

  it("returns empty array on failure", async () => {
    const video = { slug: "test" } as any;
    mockFetch.mockResolvedValue(jsonResponse(null, false));
    expect(await getRelatedVideos(video)).toEqual([]);
  });
});
