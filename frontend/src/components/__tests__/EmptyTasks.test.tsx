import { render, screen } from "@testing-library/react";
import { EmptyTasks } from "@/components/EmptyTasks";

describe("EmptyTasks", () => {
  it("renders default message", () => {
    render(<EmptyTasks />);
    expect(screen.getByText("No Tasks Found")).toBeInTheDocument();
    expect(
      screen.getByText("Try adjusting your search or filters to find what you're looking for.")
    ).toBeInTheDocument();
  });

  it("renders custom message", () => {
    render(<EmptyTasks message="No tasks for this category." />);
    expect(screen.getByText("No Tasks Found")).toBeInTheDocument();
    expect(screen.getByText("No tasks for this category.")).toBeInTheDocument();
  });
});
