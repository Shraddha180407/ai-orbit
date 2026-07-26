import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { FilterSidebar } from "../FilterSidebar";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe("FilterSidebar", () => {
  const categories = [
    { slug: "coding", name: "Coding", _count: { tools: 42 } },
    { slug: "writing", name: "Writing", _count: { tools: 18 } },
  ];

  it("renders pricing options", () => {
    render(<FilterSidebar categories={categories} params={{}} />);
    expect(screen.getByText("Free")).toBeInTheDocument();
    expect(screen.getByText("Freemium")).toBeInTheDocument();
    expect(screen.getByText("Paid")).toBeInTheDocument();
    expect(screen.getByText("Free Trial")).toBeInTheDocument();
  });

  it("renders category list with counts", () => {
    render(<FilterSidebar categories={categories} params={{}} />);
    expect(screen.getByText("Coding")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("Writing")).toBeInTheDocument();
    expect(screen.getByText("18")).toBeInTheDocument();
  });

  it("shows clear filters link when filters active", () => {
    render(<FilterSidebar categories={categories} params={{ category: "coding" }} />);
    expect(screen.getByText("Clear all filters")).toHaveAttribute("href", "/tools");
  });

  it("hides clear filters link when no filters active", () => {
    render(<FilterSidebar categories={categories} params={{}} />);
    expect(screen.queryByText("Clear all filters")).not.toBeInTheDocument();
  });

  it("marks active pricing option", () => {
    render(<FilterSidebar categories={categories} params={{ pricing: "FREE" }} />);
    const freeLink = screen.getByText("Free").closest("a")!;
    expect(freeLink).toHaveAttribute("aria-current", "true");
  });

  it("marks active category", () => {
    render(<FilterSidebar categories={categories} params={{ category: "coding" }} />);
    const codingLink = screen.getByText("Coding").closest("a")!;
    expect(codingLink).toHaveAttribute("aria-current", "true");
  });
});
