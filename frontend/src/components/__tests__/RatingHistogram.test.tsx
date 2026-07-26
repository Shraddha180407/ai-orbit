import { render, screen } from "@testing-library/react";
import { RatingHistogram } from "@/components/RatingHistogram";
import type { ReviewData } from "@/lib/types";

function makeReviews(ratings: number[]): ReviewData[] {
  return ratings.map((r, i) => ({
    id: `r${i}`,
    rating: r,
    comment: "Great",
    createdAt: "2024-01-01T00:00:00Z",
    user: { name: "User" },
  }));
}

describe("RatingHistogram", () => {
  it("renders average rating", () => {
    const reviews = makeReviews([5, 4, 3]);
    render(
      <RatingHistogram reviews={reviews} avgRating={4.0} reviewCount={3} />
    );
    expect(screen.getByText("4.0")).toBeInTheDocument();
  });

  it("renders review count text", () => {
    const reviews = makeReviews([5, 4]);
    render(
      <RatingHistogram reviews={reviews} avgRating={4.5} reviewCount={2} />
    );
    expect(screen.getByText("Based on 2 reviews")).toBeInTheDocument();
  });

  it("renders singular review text for count of 1", () => {
    const reviews = makeReviews([5]);
    render(
      <RatingHistogram reviews={reviews} avgRating={5.0} reviewCount={1} />
    );
    expect(screen.getByText("Based on 1 review")).toBeInTheDocument();
  });

  it("renders all 5 star levels", () => {
    const reviews = makeReviews([5, 4, 3, 2, 1]);
    const { container } = render(
      <RatingHistogram reviews={reviews} avgRating={3.0} reviewCount={5} />
    );
    const pctSpans = container.querySelectorAll(".w-8.text-right");
    expect(pctSpans).toHaveLength(5);
  });

  it("handles zero reviews gracefully", () => {
    render(
      <RatingHistogram reviews={[]} avgRating={null} reviewCount={0} />
    );
    expect(screen.getByText("0.0")).toBeInTheDocument();
    expect(screen.getByText("Based on 0 reviews")).toBeInTheDocument();
  });
});
