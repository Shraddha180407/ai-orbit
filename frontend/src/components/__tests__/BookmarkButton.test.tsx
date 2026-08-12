import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BookmarkButton } from "@/components/BookmarkButton";
import { vi } from "vitest";

vi.mock("@/lib/actions", () => ({
  toggleBookmark: vi.fn(),
}));

import { toggleBookmark } from "@/lib/actions";

describe("BookmarkButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders unbookmarked state", () => {
    render(
      <BookmarkButton
        toolId="t1"
        toolSlug="tool-a"
        initialBookmarked={false}
        initialCount={5}
      />
    );
    expect(screen.getByRole("button", { name: "Save tool" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("renders bookmarked state", () => {
    render(
      <BookmarkButton
        toolId="t1"
        toolSlug="tool-a"
        initialBookmarked={true}
        initialCount={6}
      />
    );
    expect(
      screen.getByRole("button", { name: "Remove bookmark" })
    ).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Saved")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
  });

  it("performs optimistic update on click", async () => {
    const user = userEvent.setup();
    (toggleBookmark as ReturnType<typeof vi.fn>).mockResolvedValue({
      bookmarked: true,
    });

    render(
      <BookmarkButton
        toolId="t1"
        toolSlug="tool-a"
        initialBookmarked={false}
        initialCount={5}
      />
    );

    await user.click(screen.getByRole("button"));
    expect(screen.getByText("Saved")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(toggleBookmark).toHaveBeenCalledWith("t1", "tool-a");
  });

  it("reverts on server error", async () => {
    const user = userEvent.setup();
    (toggleBookmark as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("Failed")
    );

    render(
      <BookmarkButton
        toolId="t1"
        toolSlug="tool-a"
        initialBookmarked={false}
        initialCount={5}
      />
    );

    await user.click(screen.getByRole("button"));
    await vi.waitFor(() => {
      expect(screen.getByText("Save")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
    });
  });

  it("accepts small size prop", () => {
    render(
      <BookmarkButton
        toolId="t1"
        toolSlug="tool-a"
        initialBookmarked={false}
        initialCount={0}
        size="sm"
      />
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
