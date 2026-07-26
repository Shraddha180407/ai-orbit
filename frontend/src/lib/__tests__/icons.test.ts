import { describe, it, expect } from "vitest";
import { ICONS, type IconKey } from "@/lib/icons";

describe("ICONS", () => {
  it("contains expected icon keys", () => {
    const expectedKeys: IconKey[] = [
      "arrowUp", "arrowDown", "external", "chevronR", "chevronL",
      "clock", "share", "search", "refresh", "alert", "inbox",
      "flame", "bookmark", "filter", "check", "chevronD", "x",
      "user", "calendar", "newspaper",
    ];
    for (const key of expectedKeys) {
      expect(ICONS[key]).toBeDefined();
    }
  });

  it("all icon values are valid SVG path data", () => {
    for (const [key, value] of Object.entries(ICONS)) {
      expect(typeof value).toBe("string");
      expect(value.length).toBeGreaterThan(0);
      // SVG path data should contain M commands at minimum
      expect(value).toMatch(/^M/);
    }
  });

  it("has exactly 20 icons", () => {
    expect(Object.keys(ICONS)).toHaveLength(20);
  });
});
