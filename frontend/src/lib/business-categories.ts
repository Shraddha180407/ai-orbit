export const BUSINESS_CATEGORIES = [
  { name: "All", slug: "" },
  { name: "Marketing & Growth", slug: "marketing" },
  { name: "Sales", slug: "sales" },
  { name: "Customer Support", slug: "customer-support" },
  { name: "Human Resources", slug: "human-resources" },
  { name: "Recruiting", slug: "recruiting" },
  { name: "Finance & Accounting", slug: "finance-accounting" },
  { name: "Legal & Compliance", slug: "legal-compliance" },
  { name: "Operations", slug: "operations" },
  { name: "Workflow Automation", slug: "workflow-automation" },
  { name: "Project Management", slug: "project-management" },
  { name: "Email", slug: "email" },
  { name: "Scheduling", slug: "scheduling" },
  { name: "E-commerce", slug: "ecommerce" },
  { name: "Writing & Editing", slug: "writing-editing" },
  { name: "Technology & IT", slug: "technology-it" },
  { name: "Data & Analytics", slug: "data-analytics" },
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
