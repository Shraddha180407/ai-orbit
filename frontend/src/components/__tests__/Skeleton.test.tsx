import { render, screen } from "@testing-library/react";
import { ToolCardSkeleton, ToolGridSkeleton } from "@/components/Skeleton";

describe("ToolCardSkeleton", () => {
  it("renders skeleton blocks with correct structure", () => {
    const { container } = render(<ToolCardSkeleton />);
    const skeletonBlocks = container.querySelectorAll(".animate-pulse");
    expect(skeletonBlocks.length).toBeGreaterThan(0);
  });
});

describe("ToolGridSkeleton", () => {
  it("renders 12 skeleton cards", () => {
    const { container } = render(<ToolGridSkeleton />);
    const skeletonCards = container.querySelectorAll('[aria-busy="true"] > div');
    expect(skeletonCards.length).toBe(12);
  });

  it("has accessible loading attributes", () => {
    render(<ToolGridSkeleton />);
    const grid = screen.getByRole("generic", { name: "Loading tools" });
    expect(grid).toHaveAttribute("aria-busy", "true");
    expect(grid).toHaveAttribute("aria-label", "Loading tools");
  });
});
