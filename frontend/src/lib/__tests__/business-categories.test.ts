import { describe, expect, it } from "vitest";
import {
  BUSINESS_CATEGORIES,
  isBusinessCategorySlug,
} from "@/lib/business-categories";

describe("business categories", () => {
  it("defines an All option and unique routed subcategories", () => {
    expect(BUSINESS_CATEGORIES[0]).toEqual({ name: "All", slug: "" });

    const routedSlugs = BUSINESS_CATEGORIES.slice(1).map(
      (category) => category.slug,
    );
    expect(new Set(routedSlugs).size).toBe(routedSlugs.length);
  });

  it("validates supported route slugs", () => {
    expect(isBusinessCategorySlug("marketing")).toBe(true);
    expect(isBusinessCategorySlug("finance-accounting")).toBe(true);
    expect(isBusinessCategorySlug("not-a-business-category")).toBe(false);
    expect(isBusinessCategorySlug("")).toBe(false);
  });
});
