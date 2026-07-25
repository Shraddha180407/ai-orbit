import { describe, it, expect } from "vitest";
import { SECTIONS, getSectionBySlug, SECTION_DESCRIPTIONS } from "@/lib/sections";

describe("SECTIONS", () => {
  it("has sections defined", () => {
    expect(SECTIONS.length).toBeGreaterThan(0);
  });

  it("each section has required fields", () => {
    for (const section of SECTIONS) {
      expect(section.key).toBeDefined();
      expect(section.label).toBeDefined();
      expect(section.slug).toBeDefined();
      expect(section.icon).toBeDefined();
      expect(section.types).toBeDefined();
      expect(section.view).toBeDefined();
      expect(section.sort).toBeDefined();
    }
  });

  it("has unique keys", () => {
    const keys = SECTIONS.map((s) => s.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("has unique slugs", () => {
    const slugs = SECTIONS.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("includes trending section", () => {
    const trending = SECTIONS.find((s) => s.key === "trending");
    expect(trending).toBeDefined();
    expect(trending?.view).toBe("trending");
  });

  it("includes collections section", () => {
    const collections = SECTIONS.find((s) => s.key === "collections");
    expect(collections).toBeDefined();
    expect(collections?.types).toContain("collection");
  });

  it("includes tasks section", () => {
    const tasks = SECTIONS.find((s) => s.key === "tasks");
    expect(tasks).toBeDefined();
    expect(tasks?.types).toContain("task");
  });
});

describe("getSectionBySlug", () => {
  it("returns section for valid slug", () => {
    const result = getSectionBySlug("trending");
    expect(result).toBeDefined();
    expect(result?.key).toBe("trending");
  });

  it("returns undefined for invalid slug", () => {
    expect(getSectionBySlug("nonexistent")).toBeUndefined();
  });

  it("returns correct section for each slug", () => {
    for (const section of SECTIONS) {
      const result = getSectionBySlug(section.slug);
      expect(result?.key).toBe(section.key);
    }
  });
});

describe("SECTION_DESCRIPTIONS", () => {
  it("has descriptions for all section keys", () => {
    for (const section of SECTIONS) {
      expect(SECTION_DESCRIPTIONS[section.key]).toBeDefined();
      expect(typeof SECTION_DESCRIPTIONS[section.key]).toBe("string");
      expect(SECTION_DESCRIPTIONS[section.key].length).toBeGreaterThan(0);
    }
  });

  it("has no extra keys not in SECTIONS", () => {
    const sectionKeys = new Set(SECTIONS.map((s) => s.key));
    for (const key of Object.keys(SECTION_DESCRIPTIONS)) {
      expect(sectionKeys.has(key as any)).toBe(true);
    }
  });
});
