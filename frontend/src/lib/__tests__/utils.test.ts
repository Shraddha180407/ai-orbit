import { describe, it, expect, vi } from "vitest";
import { cn, buildToolsUrl, scrollChipIntoView } from "@/lib/utils";

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

describe("scrollChipIntoView", () => {
  it("does nothing if container or target is null", () => {
    // Should not throw
    scrollChipIntoView(null, null);
    const div = document.createElement("div");
    scrollChipIntoView(div, null);
    scrollChipIntoView(null, div);
  });

  it("does not scroll if container does not overflow (content fits completely)", () => {
    const container = document.createElement("div");
    const target = document.createElement("button");
    container.appendChild(target);

    Object.defineProperty(container, "scrollWidth", { value: 500, configurable: true });
    Object.defineProperty(container, "clientWidth", { value: 600, configurable: true });

    let scrolled = false;
    container.scrollTo = () => {
      scrolled = true;
    };

    scrollChipIntoView(container, target);
    expect(scrolled).toBe(false);
  });

  it("does not scroll if target is already comfortably visible in viewport", () => {
    const container = document.createElement("div");
    const target = document.createElement("button");
    container.appendChild(target);

    Object.defineProperty(container, "scrollWidth", { value: 1200, configurable: true });
    Object.defineProperty(container, "clientWidth", { value: 600, configurable: true });
    container.scrollLeft = 0;

    // Container at [0, 600], target at [100, 200]
    vi.spyOn(container, "getBoundingClientRect").mockReturnValue({
      left: 0,
      right: 600,
      top: 0,
      bottom: 50,
      width: 600,
      height: 50,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    vi.spyOn(target, "getBoundingClientRect").mockReturnValue({
      left: 100,
      right: 200,
      top: 0,
      bottom: 50,
      width: 100,
      height: 50,
      x: 100,
      y: 0,
      toJSON: () => {},
    });

    let scrolled = false;
    container.scrollTo = () => {
      scrolled = true;
    };

    scrollChipIntoView(container, target);
    expect(scrolled).toBe(false);
  });

  it("shifts left and aligns target to left side when target is cut off on the right", () => {
    const container = document.createElement("div");
    const target = document.createElement("button");
    container.appendChild(target);

    Object.defineProperty(container, "scrollWidth", { value: 1200, configurable: true });
    Object.defineProperty(container, "clientWidth", { value: 600, configurable: true });
    container.scrollLeft = 0;

    // Container at [0, 600], target at [595, 695] (cut off at right edge)
    vi.spyOn(container, "getBoundingClientRect").mockReturnValue({
      left: 0,
      right: 600,
      top: 0,
      bottom: 50,
      width: 600,
      height: 50,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    vi.spyOn(target, "getBoundingClientRect").mockReturnValue({
      left: 595,
      right: 695,
      top: 0,
      bottom: 50,
      width: 100,
      height: 50,
      x: 595,
      y: 0,
      toJSON: () => {},
    });

    let scrollArgs: any = null;
    container.scrollTo = (options: any) => {
      scrollArgs = options;
    };

    scrollChipIntoView(container, target);
    expect(scrollArgs).not.toBeNull();
    // targetLeft (595 - 0) - padding (12) = 583
    expect(scrollArgs.left).toBe(583);
    expect(scrollArgs.behavior).toBe("smooth");
  });

  it("shifts and aligns target to left side when target is cut off on the left", () => {
    const container = document.createElement("div");
    const target = document.createElement("button");
    container.appendChild(target);

    Object.defineProperty(container, "scrollWidth", { value: 1200, configurable: true });
    Object.defineProperty(container, "clientWidth", { value: 600, configurable: true });
    container.scrollLeft = 400;

    // Container at [0, 600], target at [-50, 50] (scrolled past on left)
    vi.spyOn(container, "getBoundingClientRect").mockReturnValue({
      left: 0,
      right: 600,
      top: 0,
      bottom: 50,
      width: 600,
      height: 50,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    vi.spyOn(target, "getBoundingClientRect").mockReturnValue({
      left: -50,
      right: 50,
      top: 0,
      bottom: 50,
      width: 100,
      height: 50,
      x: -50,
      y: 0,
      toJSON: () => {},
    });

    let scrollArgs: any = null;
    container.scrollTo = (options: any) => {
      scrollArgs = options;
    };

    scrollChipIntoView(container, target);
    expect(scrollArgs).not.toBeNull();
    // 400 + (-50 - 0) - 12 = 338
    expect(scrollArgs.left).toBe(338);
  });
});

