import { render, screen } from "@testing-library/react";
import { EmptyState } from "@/components/EmptyState";

describe("EmptyState", () => {
  it("renders title and description", () => {
    render(<EmptyState title="No results" description="Try a different search." />);
    expect(screen.getByText("No results")).toBeInTheDocument();
    expect(screen.getByText("Try a different search.")).toBeInTheDocument();
  });

  it("renders action node when provided", () => {
    render(
      <EmptyState
        title="Empty"
        description="Nothing here"
        action={<button>Clear filters</button>}
      />
    );
    expect(screen.getByRole("button", { name: "Clear filters" })).toBeInTheDocument();
  });

  it("does not render action container when no action provided", () => {
    const { container } = render(<EmptyState title="T" description="D" />);
    expect(container.querySelector(".mt-5")).not.toBeInTheDocument();
  });
});
