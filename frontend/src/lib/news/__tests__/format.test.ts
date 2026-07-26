import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { absDate, publishedLabel } from "@/lib/news/format";

describe("absDate", () => {
  it("returns formatted date for hours ago", () => {
    const now = new Date("2026-07-20T12:00:00Z").getTime();
    const result = absDate(24, now);
    expect(result).toMatch(/Jul 19/);
  });

  it("returns current date for 0 hours ago", () => {
    const now = new Date("2026-07-20T12:00:00Z").getTime();
    const result = absDate(0, now);
    expect(result).toMatch(/Jul 20/);
  });

  it("handles large hour values", () => {
    const now = new Date("2026-07-20T12:00:00Z").getTime();
    const result = absDate(720, now);
    expect(result).toMatch(/Jun 20/);
  });
});

describe("publishedLabel", () => {
  it("returns 'Just now' for less than 1 hour", () => {
    const now = Date.now();
    expect(publishedLabel(0.5, now)).toBe("Just now");
  });

  it("returns hours format for less than 24 hours", () => {
    const now = Date.now();
    expect(publishedLabel(5, now)).toBe("5h");
  });

  it("returns 'Yesterday' for exactly 24 hours", () => {
    const now = Date.now();
    expect(publishedLabel(24, now)).toBe("Yesterday");
  });

  it("returns absolute date for more than 24 hours", () => {
    const now = new Date("2026-07-20T12:00:00Z").getTime();
    const result = publishedLabel(48, now);
    expect(result).toMatch(/Jul 18/);
  });

  it("returns 'Just now' for 0 hours", () => {
    const now = Date.now();
    expect(publishedLabel(0, now)).toBe("Just now");
  });
});
