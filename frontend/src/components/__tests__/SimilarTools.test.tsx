import { render, screen } from "@testing-library/react";
import { SimilarTools } from "@/components/SimilarTools";
import type { SimilarToolData } from "@/lib/types";

const mockTools: SimilarToolData[] = [
  {
    id: "t1",
    slug: "tool-a",
    name: "Tool A",
    logoUrl: null,
    description: "First tool description",
    pricingModel: "FREE",
    avgRating: 4.5,
  },
  {
    id: "t2",
    slug: "tool-b",
    name: "Tool B",
    logoUrl: "https://example.com/logo.png",
    description: "Second tool description",
    pricingModel: "PAID",
    avgRating: null,
  },
];

describe("SimilarTools", () => {
  it("renders nothing when tools array is empty", () => {
    const { container } = render(<SimilarTools tools={[]} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders heading", () => {
    render(<SimilarTools tools={mockTools} />);
    expect(screen.getByText("Similar tools")).toBeInTheDocument();
  });

  it("renders tool names", () => {
    render(<SimilarTools tools={mockTools} />);
    expect(screen.getByText("Tool A")).toBeInTheDocument();
    expect(screen.getByText("Tool B")).toBeInTheDocument();
  });

  it("renders tool descriptions", () => {
    render(<SimilarTools tools={mockTools} />);
    expect(screen.getByText("First tool description")).toBeInTheDocument();
    expect(screen.getByText("Second tool description")).toBeInTheDocument();
  });

  it("renders links to tool pages", () => {
    render(<SimilarTools tools={mockTools} />);
    expect(screen.getByRole("link", { name: /Tool A/ })).toHaveAttribute(
      "href",
      "/tools/tool-a"
    );
    expect(screen.getByRole("link", { name: /Tool B/ })).toHaveAttribute(
      "href",
      "/tools/tool-b"
    );
  });

  it("renders pricing badges", () => {
    render(<SimilarTools tools={mockTools} />);
    expect(screen.getByText("Free")).toBeInTheDocument();
    expect(screen.getByText("Paid")).toBeInTheDocument();
  });

  it("renders ratings", () => {
    render(<SimilarTools tools={mockTools} />);
    expect(screen.getByText("4.5")).toBeInTheDocument();
    expect(screen.getByText("No reviews yet")).toBeInTheDocument();
  });

  it("renders first letter when no logo", () => {
    render(<SimilarTools tools={mockTools} />);
    expect(screen.getByText("T")).toBeInTheDocument();
  });
});
