export const BUSINESS_CATEGORIES = [
  { name: "All", slug: "" },
  { name: "Writing & Editing", slug: "writing-editing" },
  { name: "Design & Creative", slug: "design-creative" },
  { name: "Customer Service & Support", slug: "customer-support" },
  { name: "Growth & Marketing", slug: "marketing" },
  { name: "Technology & IT", slug: "technology-it" },
  { name: "Workflow Automation", slug: "workflow-automation" },
  { name: "Back Office", slug: "back-office" },
  { name: "Operations", slug: "operations" },
  { name: "Sales", slug: "sales" },
] as const;

export type BusinessCategorySlug =
  (typeof BUSINESS_CATEGORIES)[number]["slug"];

export function isBusinessCategorySlug(
  value: string,
): value is Exclude<BusinessCategorySlug, ""> {
  return BUSINESS_CATEGORIES.some(
    (category) => category.slug !== "" && category.slug === value,
  );
}
