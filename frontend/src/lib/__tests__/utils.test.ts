import { describe, it, expect } from "vitest";
import { cn, buildToolsUrl } from "@/lib/utils";

describe("cn", () => {
  it("merges single class", () => {
    expect(cn("foo")).toBe("foo");
  });

  it("merges multiple classes", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("deduplicates tailwind classes", () => {
    expect(cn("px-4 py-2", "px-8")).toBe("py-2 px-8");
  });

  it("handles conditional classes", () => {
    expect(cn("foo", false && "bar", "baz")).toBe("foo baz");
  });

  it("handles undefined and null gracefully", () => {
    expect(cn("foo", undefined, null)).toBe("foo");
  });

  it("returns empty string for no inputs", () => {
    expect(cn()).toBe("");
  });
});

describe("buildToolsUrl", () => {
  it("returns /tools with no params", () => {
    expect(buildToolsUrl({}, {})).toBe("/tools");
  });

  it("builds URL with current params", () => {
    expect(buildToolsUrl({ q: "test", category: "coding" }, {})).toBe(
      "/tools?q=test&category=coding"
    );
  });

  it("applies overrides to current params", () => {
    const current = { q: "old", category: "coding" };
    const overrides = { q: "new" };
    expect(buildToolsUrl(current, overrides)).toBe("/tools?q=new&category=coding");
  });

  it("removes params when override is null", () => {
    const current = { q: "test", category: "coding", sort: "newest" };
    const overrides = { category: null };
    expect(buildToolsUrl(current, overrides)).toBe("/tools?q=test&sort=newest");
  });

  it("resets page param unless explicitly set in overrides", () => {
    const current = { q: "test", page: "3" };
    const overrides = { sort: "oldest" };
    expect(buildToolsUrl(current, overrides)).toBe("/tools?q=test&sort=oldest");
  });

  it("preserves page param when explicitly set in overrides", () => {
    const current = { q: "test" };
    const overrides = { page: "5" };
    expect(buildToolsUrl(current, overrides)).toBe("/tools?q=test&page=5");
  });

  it("handles empty current with overrides", () => {
    expect(buildToolsUrl({}, { q: "hello" })).toBe("/tools?q=hello");
  });

  it("removes all params when all overridden to null", () => {
    const current = { q: "test", category: "coding" };
    const overrides = { q: null, category: null };
    expect(buildToolsUrl(current, overrides)).toBe("/tools");
  });
});
