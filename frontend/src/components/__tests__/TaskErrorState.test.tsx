import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskErrorState } from "@/components/TaskErrorState";

describe("TaskErrorState", () => {
  it("renders default error message", () => {
    render(<TaskErrorState />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(
      screen.getByText("We couldn't load tasks right now. Please try again.")
    ).toBeInTheDocument();
  });

  it("renders custom error message", () => {
    render(<TaskErrorState message="Network error" />);
    expect(screen.getByText("Network error")).toBeInTheDocument();
  });

  it("renders retry button when onRetry is provided", async () => {
    const onRetry = vi.fn();
    render(<TaskErrorState onRetry={onRetry} />);
    const retryBtn = screen.getByRole("button", { name: "Retry" });
    expect(retryBtn).toBeInTheDocument();
    await userEvent.click(retryBtn);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("does not render retry button when onRetry is not provided", () => {
    render(<TaskErrorState />);
    expect(screen.queryByRole("button", { name: "Retry" })).not.toBeInTheDocument();
  });
});
