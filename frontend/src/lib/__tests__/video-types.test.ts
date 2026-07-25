import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  formatDuration,
  formatViews,
  formatRelativeDate,
  getChannelUrl,
  TOOL_CATEGORIES,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  BLUR_DATA_URL,
} from "@/lib/video-types";

describe("formatDuration", () => {
  it("formats seconds to m:ss", () => {
    expect(formatDuration(0)).toBe("0:00");
  });

  it("formats single-digit seconds with padding", () => {
    expect(formatDuration(65)).toBe("1:05");
  });

  it("formats exactly one minute", () => {
    expect(formatDuration(60)).toBe("1:00");
  });

  it("formats large durations", () => {
    expect(formatDuration(3661)).toBe("61:01");
  });

  it("formats sub-minute durations", () => {
    expect(formatDuration(45)).toBe("0:45");
  });
});

describe("formatViews", () => {
  it("formats millions", () => {
    expect(formatViews(1500000)).toBe("1.5M views");
  });

  it("formats thousands", () => {
    expect(formatViews(45000)).toBe("45K views");
  });

  it("formats exact thousands", () => {
    expect(formatViews(1000)).toBe("1K views");
  });

  it("formats small numbers", () => {
    expect(formatViews(999)).toBe("999 views");
  });

  it("formats zero", () => {
    expect(formatViews(0)).toBe("0 views");
  });

  it("formats one million exactly", () => {
    expect(formatViews(1000000)).toBe("1.0M views");
  });
});

describe("formatRelativeDate", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-20T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns 'Today' for same day", () => {
    expect(formatRelativeDate("2026-07-20T11:00:00Z")).toBe("Today");
  });

  it("returns 'Yesterday' for one day ago", () => {
    expect(formatRelativeDate("2026-07-19T12:00:00Z")).toBe("Yesterday");
  });

  it("returns days ago for less than a week", () => {
    expect(formatRelativeDate("2026-07-17T12:00:00Z")).toBe("3 days ago");
  });

  it("returns weeks ago for less than a month", () => {
    expect(formatRelativeDate("2026-07-06T12:00:00Z")).toBe("2w ago");
  });

  it("returns months ago for more than a month", () => {
    expect(formatRelativeDate("2026-05-20T12:00:00Z")).toBe("2mo ago");
  });
});

describe("getChannelUrl", () => {
  it("returns channel URL when channelId is provided", () => {
    expect(getChannelUrl("UC123", "Author")).toBe(
      "https://www.youtube.com/channel/UC123"
    );
  });

  it("returns search URL when channelId is null", () => {
    expect(getChannelUrl(null, "Author Name")).toBe(
      "https://www.youtube.com/results?search_query=Author%20Name"
    );
  });

  it("returns search URL when channelId is undefined", () => {
    expect(getChannelUrl(undefined, "Test Channel")).toBe(
      "https://www.youtube.com/results?search_query=Test%20Channel"
    );
  });

  it("encodes special characters in author name", () => {
    expect(getChannelUrl(null, "Tom & Jerry")).toBe(
      "https://www.youtube.com/results?search_query=Tom%20%26%20Jerry"
    );
  });
});

describe("constants", () => {
  it("has all required tool categories", () => {
    expect(TOOL_CATEGORIES).toEqual([
      "multimodal-ai",
      "llm",
      "agents",
      "robotics",
      "general-ai",
    ]);
  });

  it("has labels for all categories", () => {
    for (const cat of TOOL_CATEGORIES) {
      expect(CATEGORY_LABELS[cat]).toBeDefined();
      expect(typeof CATEGORY_LABELS[cat]).toBe("string");
    }
  });

  it("has colors for all categories", () => {
    for (const cat of TOOL_CATEGORIES) {
      expect(CATEGORY_COLORS[cat]).toBeDefined();
      expect(CATEGORY_COLORS[cat]).toMatch(/^#/);
    }
  });

  it("BLUR_DATA_URL is a valid data URI", () => {
    expect(BLUR_DATA_URL).toMatch(/^data:image\/svg\+xml;base64,/);
  });
});
