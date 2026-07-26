import { render, screen } from "@testing-library/react";
import { TaskSkeleton } from "@/components/TaskSkeleton";

describe("TaskSkeleton", () => {
  it("renders with loading attributes", () => {
    render(<TaskSkeleton />);
    const skeleton = screen.getByRole("generic", { name: "Loading tasks" });
    expect(skeleton).toHaveAttribute("aria-busy", "true");
    expect(skeleton).toHaveAttribute("aria-label", "Loading tasks");
  });

  it("renders 8 skeleton row containers", () => {
    const { container } = render(<TaskSkeleton />);
    const outerContainer = screen.getByRole("generic", { name: "Loading tasks" });
    const rows = outerContainer.querySelectorAll(":scope > div");
    expect(rows.length).toBe(8);
  });
});
