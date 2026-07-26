import { render, screen } from "@testing-library/react";
import { RatingStars } from "@/components/RatingStars";

describe("RatingStars", () => {
  it("renders 'No reviews yet' when rating is null", () => {
    render(<RatingStars rating={null} />);
    expect(screen.getByText("No reviews yet")).toBeInTheDocument();
  });

  it("renders formatted rating", () => {
    render(<RatingStars rating={4.5} />);
    expect(screen.getByText("4.5")).toBeInTheDocument();
  });

  it("renders review count when provided", () => {
    render(<RatingStars rating={4.2} reviewCount={128} />);
    expect(screen.getByText("4.2")).toBeInTheDocument();
    expect(screen.getByText("(128)")).toBeInTheDocument();
  });

  it("does not render review count when not provided", () => {
    render(<RatingStars rating={3.0} />);
    expect(screen.getByText("3.0")).toBeInTheDocument();
    expect(screen.queryByText(/\(\d+\)/)).not.toBeInTheDocument();
  });

  it("accepts custom className", () => {
    const { container } = render(<RatingStars rating={5.0} className="custom" />);
    const wrapper = container.querySelector("span.inline-flex");
    expect(wrapper).toHaveClass("custom");
  });
});
