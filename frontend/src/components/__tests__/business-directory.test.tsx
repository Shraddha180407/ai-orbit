import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { BusinessDirectory } from "@/components/business-directory";

vi.mock("@/components/tools-client", () => ({
  ToolsClient: ({ showCategories }: { showCategories?: boolean }) => (
    <div
      data-testid="business-tools"
      data-show-categories={showCategories === false ? "false" : "true"}
    />
  ),
}));

vi.mock("@/components/mvpblocks/geometric-hero", () => ({
  default: ({ badge, title1, title2 }: {
    badge?: string;
    title1?: string;
    title2?: string;
  }) => (
    <section data-testid="geometric-hero">
      <span>{badge ?? "Business AI directory"}</span>
      <h2>{title1 ?? "Find the right AI"} {title2}</h2>
    </section>
  ),
}));

describe("BusinessDirectory", () => {
  it("renders the tailored geometric hero above the business directory", () => {
    render(<BusinessDirectory />);

    expect(screen.getByTestId("geometric-hero")).toBeInTheDocument();
    expect(screen.getByRole("heading", {
      name: "Find the right AI",
    })).toBeInTheDocument();
    expect(screen.getByTestId("business-tools")).toBeInTheDocument();
    expect(screen.queryByRole("heading", {
      name: "AI tools for every business function",
    })).not.toBeInTheDocument();
  });

  it("renders business category filters with the new icon pack", () => {
    render(<BusinessDirectory />);

    expect(screen.getByTestId("business-directory-nav")).toBeInTheDocument();
    for (const label of [
      "All",
      "writing",
      "design",
      "customer support",
      "growth",
      "technology",
      "Workflow Automation",
      "Back Office",
      "Operations",
      "Sales",
    ]) {
      expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
    }
    expect(screen.getByRole("link", { name: "Sales" })).toHaveAttribute(
      "href",
      "/business/sales",
    );
    expect(screen.getByTestId("business-tools")).toBeInTheDocument();
    expect(screen.getByTestId("business-tools")).toHaveAttribute(
      "data-show-categories",
      "false",
    );
  });
});
