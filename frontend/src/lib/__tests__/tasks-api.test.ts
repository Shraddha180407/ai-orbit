import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  fetchTasks,
  fetchTask,
  toggleBookmark,
  toggleLike,
  toggleSubscribe,
} from "@/lib/tasks-api";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

function jsonResponse(data: any, ok = true, status = 200) {
  return {
    ok,
    status,
    json: () => Promise.resolve(data),
    clone: () => ({
      json: () => Promise.resolve(data),
    }),
  };
}

beforeEach(() => {
  mockFetch.mockReset();
});

describe("fetchTasks", () => {
  it("fetches tasks with default params", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ tasks: [], total: 0, page: 1, totalPages: 1, sort: "newest", categories: [] }));
    const result = await fetchTasks();
    expect(result.tasks).toEqual([]);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/tasks"),
      expect.objectContaining({ cache: "no-store", credentials: "include" })
    );
  });

  it("builds query string with all params", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ tasks: [], total: 0, page: 1, totalPages: 1, sort: "newest", categories: [] }));
    await fetchTasks({ q: "test", category: "coding", difficulty: "EASY", pricing: "FREE", sort: "newest", page: 2 });
    const url = mockFetch.mock.calls[0][0];
    expect(url).toContain("q=test");
    expect(url).toContain("category=coding");
    expect(url).toContain("difficulty=EASY");
    expect(url).toContain("pricing=FREE");
    expect(url).toContain("sort=newest");
    expect(url).toContain("page=2");
  });

  it("does not add filter param when 'all'", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ tasks: [], total: 0, page: 1, totalPages: 1, sort: "newest", categories: [] }));
    await fetchTasks({ filter: "all" });
    const url = mockFetch.mock.calls[0][0];
    expect(url).not.toContain("filter=");
  });

  it("adds filter param when not 'all'", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ tasks: [], total: 0, page: 1, totalPages: 1, sort: "newest", categories: [] }));
    await fetchTasks({ filter: "for-you" });
    const url = mockFetch.mock.calls[0][0];
    expect(url).toContain("filter=for-you");
  });

  it("adds featuredOnly param", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ tasks: [], total: 0, page: 1, totalPages: 1, sort: "newest", categories: [] }));
    await fetchTasks({ featuredOnly: true });
    const url = mockFetch.mock.calls[0][0];
    expect(url).toContain("featuredOnly=true");
  });

  it("throws TasksApiError on network failure", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));
    await expect(fetchTasks()).rejects.toThrow("Network error");
  });

  it("throws TasksApiError on non-ok response", async () => {
    mockFetch.mockResolvedValue(jsonResponse(null, false, 500));
    await expect(fetchTasks()).rejects.toThrow("Failed to fetch tasks");
  });

  it("throws AuthRequiredError on 401 with AUTH_REQUIRED code", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ code: "AUTH_REQUIRED", error: "Login required" }),
      clone: () => ({
        json: () => Promise.resolve({ code: "AUTH_REQUIRED", error: "Login required" }),
      }),
    });
    await expect(fetchTasks()).rejects.toThrow("Login required");
  });

  it("throws AuthRequiredError on 401 without AUTH_REQUIRED code", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 401,
      json: () => Promise.resolve({}),
      clone: () => ({ json: () => Promise.resolve({}) }),
    });
    await expect(fetchTasks()).rejects.toThrow("You need to be logged in");
  });
});

describe("fetchTask", () => {
  it("fetches task by slug", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ task: { id: "1" }, bookmarked: false, liked: false, subscribed: false }));
    const result = await fetchTask("my-task");
    expect(result?.task.id).toBe("1");
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/tasks/my-task"),
      expect.any(Object)
    );
  });

  it("returns null on 404", async () => {
    mockFetch.mockResolvedValue(jsonResponse(null, false, 404));
    const result = await fetchTask("nonexistent");
    expect(result).toBeNull();
  });

  it("throws on network failure", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));
    await expect(fetchTask("task-1")).rejects.toThrow("Network error");
  });

  it("throws on non-ok non-404 response", async () => {
    mockFetch.mockResolvedValue(jsonResponse(null, false, 500));
    await expect(fetchTask("task-1")).rejects.toThrow("Failed to fetch task");
  });

  it("encodes slug in URL", async () => {
    mockFetch.mockResolvedValue(jsonResponse(null, false, 404));
    await fetchTask("my task with spaces");
    const url = mockFetch.mock.calls[0][0];
    expect(url).toContain(encodeURIComponent("my task with spaces"));
  });
});

describe("toggleBookmark", () => {
  it("sends POST request with taskId", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ bookmarked: true }));
    const result = await toggleBookmark("task-1", "task-id-1");
    expect(result.bookmarked).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/tasks/task-1/bookmark"),
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId: "task-id-1" }),
      })
    );
  });

  it("throws on network failure", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));
    await expect(toggleBookmark("task-1", "id")).rejects.toThrow("Network error");
  });

  it("throws on non-ok response", async () => {
    mockFetch.mockResolvedValue(jsonResponse(null, false, 500));
    await expect(toggleBookmark("task-1", "id")).rejects.toThrow("Failed to toggle bookmark");
  });

  it("throws AuthRequiredError on 401", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ code: "AUTH_REQUIRED" }),
      clone: () => ({ json: () => Promise.resolve({ code: "AUTH_REQUIRED" }) }),
    });
    await expect(toggleBookmark("task-1", "id")).rejects.toThrow("You need to be logged in");
  });
});

describe("toggleLike", () => {
  it("sends POST request", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ liked: true }));
    const result = await toggleLike("task-1");
    expect(result.liked).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/tasks/task-1/like"),
      expect.objectContaining({ method: "POST", credentials: "include" })
    );
  });

  it("throws on network failure", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));
    await expect(toggleLike("task-1")).rejects.toThrow("Network error");
  });

  it("throws on non-ok response", async () => {
    mockFetch.mockResolvedValue(jsonResponse(null, false, 500));
    await expect(toggleLike("task-1")).rejects.toThrow("Failed to toggle like");
  });
});

describe("toggleSubscribe", () => {
  it("sends POST request", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ subscribed: true }));
    const result = await toggleSubscribe("task-1");
    expect(result.subscribed).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/tasks/task-1/subscribe"),
      expect.objectContaining({ method: "POST", credentials: "include" })
    );
  });

  it("throws on network failure", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));
    await expect(toggleSubscribe("task-1")).rejects.toThrow("Network error");
  });

  it("throws on non-ok response", async () => {
    mockFetch.mockResolvedValue(jsonResponse(null, false, 500));
    await expect(toggleSubscribe("task-1")).rejects.toThrow("Failed to toggle subscribe");
  });
});
