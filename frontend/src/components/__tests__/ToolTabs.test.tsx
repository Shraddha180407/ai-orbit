import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ToolTabs } from "../ToolTabs";

vi.mock("../ROICalculator", () => ({
  ROICalculator: (props: any) => (
    <div data-testid="roi-calculator">{props.name}</div>
  ),
}));

vi.mock("../ProsConsVerdict", () => ({
  ProsConsVerdict: (props: any) => (
    <div data-testid="pros-cons-verdict">{props.name}</div>
  ),
}));

vi.mock("../RatingHistogram", () => ({
  RatingHistogram: (props: any) => (
    <div data-testid="rating-histogram">{props.reviewCount} reviews</div>
  ),
}));

vi.mock("../ReviewForm", () => ({
  ReviewForm: (props: any) => (
    <div data-testid="review-form">{props.toolSlug}</div>
  ),
}));

vi.mock("../ReviewList", () => ({
  ReviewList: (props: any) => (
    <div data-testid="review-list">{props.reviews.length} reviews</div>
  ),
}));

describe("ToolTabs", () => {
  const tool = {
    id: "tool-1",
    slug: "test-tool",
    name: "TestTool",
    description: "A test tool description",
    features: ["Feature 1", "Feature 2"],
    websiteUrl: "https://example.com",
    pricingModel: "PAID" as const,
    pricingAmount: "29",
    billingFrequency: "MONTHLY" as const,
    createdAt: "2024-01-15",
    releaseDate: "2024-01-15",
    company: { slug: "acme", name: "Acme Corp" },
    categories: [{ category: { slug: "coding", name: "Coding" } }],
    tags: [{ tag: { slug: "ai", name: "AI" } }],
    avgRating: 4.2,
    reviewCount: 5,
  };

  const reviews = [
    { id: "r1", rating: 5, comment: "Great tool", createdAt: "2024-02-01", user: { name: "User1" } },
  ];

  it("renders all four tabs", () => {
    render(<ToolTabs tool={tool} reviews={reviews} />);
    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("ROI Estimator")).toBeInTheDocument();
    expect(screen.getByText("Specifications")).toBeInTheDocument();
    expect(screen.getByText("Reviews (1)")).toBeInTheDocument();
  });

  it("shows overview tab content by default", () => {
    render(<ToolTabs tool={tool} reviews={reviews} />);
    expect(screen.getByText(/About TestTool/)).toBeInTheDocument();
    expect(screen.getByText("A test tool description")).toBeInTheDocument();
    expect(screen.getByText("Expert Analysis")).toBeInTheDocument();
    expect(screen.getByText("Feature 1")).toBeInTheDocument();
    expect(screen.getByText("Feature 2")).toBeInTheDocument();
  });

  it("switches to ROI tab", () => {
    render(<ToolTabs tool={tool} reviews={reviews} />);
    fireEvent.click(screen.getByText("ROI Estimator"));
    expect(screen.getByTestId("roi-calculator")).toHaveTextContent("TestTool");
  });

  it("switches to Specifications tab", () => {
    render(<ToolTabs tool={tool} reviews={reviews} />);
    fireEvent.click(screen.getByText("Specifications"));
    expect(screen.getByText("Technical Specifications")).toBeInTheDocument();
    expect(screen.getByText("paid")).toBeInTheDocument();
    expect(screen.getByText("$29")).toBeInTheDocument();
    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
    expect(screen.getByText("AI")).toBeInTheDocument();
  });

  it("switches to Reviews tab", () => {
    render(<ToolTabs tool={tool} reviews={reviews} />);
    fireEvent.click(screen.getByText(/Reviews/));
    expect(screen.getByTestId("review-form")).toHaveTextContent("test-tool");
    expect(screen.getByTestId("review-list")).toHaveTextContent("1 reviews");
    expect(screen.getByTestId("rating-histogram")).toHaveTextContent("5 reviews");
  });

  it("formats date correctly in specs", () => {
    render(<ToolTabs tool={tool} reviews={reviews} />);
    fireEvent.click(screen.getByText("Specifications"));
    expect(screen.getByText("January 2024")).toBeInTheDocument();
  });

  it("does not show features section when empty", () => {
    const toolNoFeatures = { ...tool, features: [] };
    render(<ToolTabs tool={toolNoFeatures} reviews={reviews} />);
    expect(screen.queryByText("Key Features")).not.toBeInTheDocument();
  });
});
