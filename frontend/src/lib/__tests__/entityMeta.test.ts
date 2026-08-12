import { describe, it, expect } from "vitest";
import { ENTITY_META, ALL_ENTITY_TYPES } from "@/lib/entityMeta";
import type { EntityType } from "@/types/entities";

describe("ENTITY_META", () => {
  it("has entries for all entity types", () => {
    for (const type of ALL_ENTITY_TYPES) {
      expect(ENTITY_META[type]).toBeDefined();
    }
  });

  it("each entity type has required fields", () => {
    for (const type of ALL_ENTITY_TYPES) {
      const meta = ENTITY_META[type];
      expect(meta.label).toBeDefined();
      expect(meta.plural).toBeDefined();
      expect(meta.icon).toBeDefined();
      expect(meta.basePath).toBeDefined();
      expect(meta.tint).toBeDefined();
      expect(meta.solidColor).toBeDefined();
    }
  });

  it("each basePath starts with /", () => {
    for (const type of ALL_ENTITY_TYPES) {
      expect(ENTITY_META[type].basePath).toMatch(/^\//);
    }
  });

  it("each solidColor is a valid hex color", () => {
    for (const type of ALL_ENTITY_TYPES) {
      expect(ENTITY_META[type].solidColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it("tool entity has correct basePath", () => {
    expect(ENTITY_META.tool.basePath).toBe("/tools");
  });

  it("company entity has correct basePath", () => {
    expect(ENTITY_META.company.basePath).toBe("/companies");
  });

  it("model entity has correct basePath", () => {
    expect(ENTITY_META.model.basePath).toBe("/models");
  });

  it("news entity has correct basePath", () => {
    expect(ENTITY_META.news.basePath).toBe("/news");
  });
});

describe("ALL_ENTITY_TYPES", () => {
  it("contains all expected entity types", () => {
    const expected: EntityType[] = [
      "tool", "company", "model", "news", "video", "repository",
      "collection", "task", "country", "fundraise", "investor", "robot", "device",
    ];
    expect(ALL_ENTITY_TYPES).toEqual(expected);
  });

  it("has 13 entity types", () => {
    expect(ALL_ENTITY_TYPES).toHaveLength(13);
  });
});
