import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { BusinessDirectory } from "@/components/business-directory";

vi.mock("@/components/tools-client", () => ({
  ToolsClient: () => <div data-testid="business-tools" />,
}));

vi.mock("@/components/mvpblocks/geometric-hero", () => ({
  default: ({ badge, title1, title2 }: {
    badge?: string;
    title1?: string;
    title2?: string;
  }) => (
    <section data-testid="geometric-hero">
      <span>{badge ?? "Business AI directory"}</span>
      <h2>{title1 ?? "Find the right AI"} {title2 ?? "for every workflow"}</h2>
    </section>
  ),
}));

describe("BusinessDirectory", () => {
  it("renders the tailored geometric hero above the business directory", () => {
    render(<BusinessDirectory />);

    expect(screen.getByTestId("geometric-hero")).toBeInTheDocument();
    expect(screen.getByRole("heading", {
      name: "Find the right AI for every workflow",
    })).toBeInTheDocument();
    expect(screen.getByTestId("business-tools")).toBeInTheDocument();
    expect(screen.queryByRole("heading", {
      name: "AI tools for every business function",
    })).not.toBeInTheDocument();
  });
});
