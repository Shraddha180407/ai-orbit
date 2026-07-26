import { render, screen } from "@testing-library/react";
import { ToolGrid } from "@/components/ToolGrid";
import type { ToolCardData } from "@/lib/types";

const mockTools: ToolCardData[] = [
  {
    id: "1",
    slug: "test-tool",
    name: "Test Tool",
    logoUrl: null,
    description: "A test tool",
    pricingModel: "FREE",
    pricingAmount: null,
    billingFrequency: "NA",
    categories: [{ category: { slug: "coding", name: "Coding" } }],
    tags: [],
    _count: { reviews: 5, bookmarks: 10 },
    avgRating: 4.2,
    company: null,
  },
  {
    id: "2",
    slug: "another-tool",
    name: "Another Tool",
    logoUrl: null,
    description: "Another tool",
    pricingModel: "PAID",
    pricingAmount: "29",
    billingFrequency: "MONTHLY",
    categories: [{ category: { slug: "writing", name: "Writing" } }],
    tags: [],
    _count: { reviews: 3, bookmarks: 7 },
    avgRating: 3.8,
    company: null,
  },
];

describe("ToolGrid", () => {
  it("renders empty state when no tools", () => {
    render(<ToolGrid tools={[]} />);
    expect(screen.getByText("No tools match your filters")).toBeInTheDocument();
  });

  it("renders list of tools", () => {
    render(<ToolGrid tools={mockTools} />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
  });

  it("renders tool names", () => {
    render(<ToolGrid tools={mockTools} />);
    expect(screen.getByText("Test Tool")).toBeInTheDocument();
    expect(screen.getByText("Another Tool")).toBeInTheDocument();
  });

  it("renders pricing badges", () => {
    render(<ToolGrid tools={mockTools} />);
    expect(screen.getByText("Free")).toBeInTheDocument();
    expect(screen.getByText("Paid")).toBeInTheDocument();
  });
});
