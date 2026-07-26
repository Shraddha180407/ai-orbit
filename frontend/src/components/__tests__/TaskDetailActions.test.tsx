import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { TaskDetailActions } from "@/components/TaskDetailActions";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/lib/tasks-api", () => ({
  toggleBookmark: vi.fn(),
  toggleLike: vi.fn(),
  toggleSubscribe: vi.fn(),
}));

import { toggleBookmark, toggleLike, toggleSubscribe } from "@/lib/tasks-api";

describe("TaskDetailActions", () => {
  const defaultProps = {
    slug: "test-task",
    taskId: "t1",
    taskTitle: "Test Task",
    initialLiked: false,
    initialSubscribed: false,
    initialBookmarked: false,
    initialLikes: 10,
    initialSaves: 5,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all action buttons", () => {
    render(<TaskDetailActions {...defaultProps} />);
    expect(screen.getByRole("button", { name: /Like this task/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Bookmark this task/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Share this task/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Copy link/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Subscribe/ })).toBeInTheDocument();
  });

  it("renders initial like count", () => {
    render(<TaskDetailActions {...defaultProps} />);
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("renders initial save count", () => {
    render(<TaskDetailActions {...defaultProps} />);
    expect(screen.getByText("5 saves")).toBeInTheDocument();
  });

  it("toggles like optimistically", async () => {
    const user = userEvent.setup();
    (toggleLike as ReturnType<typeof vi.fn>).mockResolvedValue({ liked: true });

    render(<TaskDetailActions {...defaultProps} />);

    const likeButton = screen.getByRole("button", { name: /Like this task/ });
    expect(likeButton).toHaveAttribute("aria-pressed", "false");

    await user.click(likeButton);
    expect(likeButton).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("11")).toBeInTheDocument();
    expect(toggleLike).toHaveBeenCalledWith("test-task");
  });

  it("toggles bookmark optimistically", async () => {
    const user = userEvent.setup();
    (toggleBookmark as ReturnType<typeof vi.fn>).mockResolvedValue({
      bookmarked: true,
    });

    render(<TaskDetailActions {...defaultProps} />);

    const bookmarkButton = screen.getByRole("button", {
      name: /Bookmark this task/,
    });
    await user.click(bookmarkButton);
    expect(bookmarkButton).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("6 saves")).toBeInTheDocument();
  });

  it("toggles subscribe", async () => {
    const user = userEvent.setup();
    (toggleSubscribe as ReturnType<typeof vi.fn>).mockResolvedValue({
      subscribed: true,
    });

    render(<TaskDetailActions {...defaultProps} />);

    const subscribeButton = screen.getByRole("button", {
      name: /Subscribe/,
    });
    await user.click(subscribeButton);
    expect(subscribeButton).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Subscribed")).toBeInTheDocument();
  });

  it("renders subscribed state initially", () => {
    render(<TaskDetailActions {...defaultProps} initialSubscribed={true} />);
    expect(screen.getByText("Subscribed")).toBeInTheDocument();
  });

  it("renders liked state initially", () => {
    render(<TaskDetailActions {...defaultProps} initialLiked={true} />);
    const likeButton = screen.getByRole("button", { name: /Like this task/ });
    expect(likeButton).toHaveAttribute("aria-pressed", "true");
  });

  it("renders bookmarked state initially", () => {
    render(<TaskDetailActions {...defaultProps} initialBookmarked={true} />);
    const bookmarkButton = screen.getByRole("button", {
      name: /Bookmark this task/,
    });
    expect(bookmarkButton).toHaveAttribute("aria-pressed", "true");
  });

  it("reverts like on server error", async () => {
    const user = userEvent.setup();
    (toggleLike as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("Failed")
    );

    render(<TaskDetailActions {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: /Like this task/ }));
    await vi.waitFor(() => {
      expect(screen.getByText("10")).toBeInTheDocument();
    });
  });

  it("reverts bookmark on server error", async () => {
    const user = userEvent.setup();
    (toggleBookmark as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("Failed")
    );

    render(<TaskDetailActions {...defaultProps} />);

    await user.click(
      screen.getByRole("button", { name: /Bookmark this task/ })
    );
    await vi.waitFor(() => {
      expect(screen.getByText("5 saves")).toBeInTheDocument();
    });
  });
});
