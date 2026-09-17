import { describe, expect, it } from "vitest";
import {
  BUSINESS_CATEGORIES,
  isBusinessCategorySlug,
} from "@/lib/business-categories";

describe("business categories", () => {
  it("matches the business functions shown on the directory page", () => {
    expect(BUSINESS_CATEGORIES.slice(1).map((category) => category.name)).toEqual([
      "Writing & Editing",
      "Design & Creative",
      "Customer Service & Support",
      "Growth & Marketing",
      "Technology & IT",
      "Workflow Automation",
      "Back Office",
      "Operations",
      "Sales",
    ]);
  });

  it("defines an All option and unique routed subcategories", () => {
    expect(BUSINESS_CATEGORIES[0]).toEqual({ name: "All", slug: "" });

    const routedSlugs = BUSINESS_CATEGORIES.slice(1).map(
      (category) => category.slug,
    );
    expect(new Set(routedSlugs).size).toBe(routedSlugs.length);
  });

  it("validates supported route slugs", () => {
    expect(isBusinessCategorySlug("marketing")).toBe(true);
    expect(isBusinessCategorySlug("design-creative")).toBe(true);
    expect(isBusinessCategorySlug("back-office")).toBe(true);
    expect(isBusinessCategorySlug("not-a-business-category")).toBe(false);
    expect(isBusinessCategorySlug("")).toBe(false);
  });
});
