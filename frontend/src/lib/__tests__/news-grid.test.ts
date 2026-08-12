import { describe, it, expect } from "vitest";
import { GRID_FULL, GRID_COMPACT } from "@/lib/news-grid";

describe("news-grid constants", () => {
  it("GRID_FULL is a non-empty string", () => {
    expect(typeof GRID_FULL).toBe("string");
    expect(GRID_FULL.length).toBeGreaterThan(0);
  });

  it("GRID_COMPACT is a non-empty string", () => {
    expect(typeof GRID_COMPACT).toBe("string");
    expect(GRID_COMPACT.length).toBeGreaterThan(0);
  });

  it("GRID_FULL has more columns than GRID_COMPACT", () => {
    const fullParts = GRID_FULL.split(" ");
    const compactParts = GRID_COMPACT.split(" ");
    expect(fullParts.length).toBeGreaterThan(compactParts.length);
  });
});
