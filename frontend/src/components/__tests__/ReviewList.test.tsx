import { render, screen } from "@testing-library/react";
import { ReviewList } from "@/components/ReviewList";
import type { ReviewData } from "@/lib/types";

const mockReviews: ReviewData[] = [
  {
    id: "r1",
    rating: 5,
    comment: "Excellent tool for productivity.",
    createdAt: "2024-06-15T10:00:00Z",
    user: { name: "Alice Smith" },
  },
  {
    id: "r2",
    rating: 3,
    comment: "Decent but has room for improvement.",
    createdAt: "2024-07-20T14:30:00Z",
    user: { name: "Bob Jones" },
  },
];

describe("ReviewList", () => {
  it("renders empty state when no reviews", () => {
    render(<ReviewList reviews={[]} />);
    expect(
      screen.getByText("No reviews yet — be the first to share your experience.")
    ).toBeInTheDocument();
  });

  it("renders review count", () => {
    render(<ReviewList reviews={mockReviews} />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
  });

  it("renders reviewer names", () => {
    render(<ReviewList reviews={mockReviews} />);
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.getByText("Bob Jones")).toBeInTheDocument();
  });

  it("renders review comments", () => {
    render(<ReviewList reviews={mockReviews} />);
    expect(screen.getByText("Excellent tool for productivity.")).toBeInTheDocument();
    expect(
      screen.getByText("Decent but has room for improvement.")
    ).toBeInTheDocument();
  });

  it("renders star ratings with accessible label", () => {
    render(<ReviewList reviews={mockReviews} />);
    expect(screen.getByLabelText("5 out of 5 stars")).toBeInTheDocument();
    expect(screen.getByLabelText("3 out of 5 stars")).toBeInTheDocument();
  });

  it("renders initials for user avatar", () => {
    render(<ReviewList reviews={mockReviews} />);
    expect(screen.getByText("AS")).toBeInTheDocument();
    expect(screen.getByText("BJ")).toBeInTheDocument();
  });

  it("handles null user name with Anonymous fallback", () => {
    const reviews: ReviewData[] = [
      {
        id: "r3",
        rating: 4,
        comment: "Good product overall.",
        createdAt: "2024-08-01T09:00:00Z",
        user: { name: null },
      },
    ];
    render(<ReviewList reviews={reviews} />);
    expect(screen.getByText("Anonymous")).toBeInTheDocument();
  });

  it("formats dates correctly", () => {
    render(<ReviewList reviews={mockReviews} />);
    expect(screen.getByText("Jun 15, 2024")).toBeInTheDocument();
    expect(screen.getByText("Jul 20, 2024")).toBeInTheDocument();
  });
});
