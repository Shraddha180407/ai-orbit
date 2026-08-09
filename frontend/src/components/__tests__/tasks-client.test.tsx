import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { TasksClient } from "@/components/tasks-client";
import type { TaskListResponse } from "@/lib/tasks-api";

vi.mock("@/lib/tasks-api", () => ({
  fetchTasks: vi.fn(),
  AuthRequiredError: class AuthRequiredError extends Error {
    constructor(msg?: string) { super(msg ?? "auth required"); }
  },
}));

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/tasks",
}));

import { fetchTasks, AuthRequiredError } from "@/lib/tasks-api";

const mockTask = {
  id: "t1", slug: "test-task", title: "Test Task", description: "A task",
  difficulty: "EASY" as const, pricingModel: "FREE" as const, isFeatured: false,
  category: { slug: "coding", name: "Coding" }, creator: { name: "Admin" },
  createdAt: "2024-01-01T00:00:00Z", likes: 10, subscribers: 20, saves: 5,
  resources: 3, tools: 2, models: 1, robots: 0, devices: 1,
};

const mockResponse: TaskListResponse = {
  tasks: [mockTask], total: 1, page: 1, totalPages: 1, sort: "newest",
  categories: [{ slug: "coding", name: "Coding" }],
};

describe("TasksClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (fetchTasks as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);
  });

  it("renders initial data without fetching", () => {
    render(<TasksClient initialData={mockResponse} />);
    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(fetchTasks).not.toHaveBeenCalled();
  });

  it("shows loading skeleton on initial fetch without data", async () => {
    (fetchTasks as ReturnType<typeof vi.fn>).mockReturnValue(new Promise(() => {}));
    render(<TasksClient />);
    await waitFor(() => {
      expect(screen.queryByText("No Tasks Found")).not.toBeInTheDocument();
    });
  });

  it("shows error state on fetch failure", async () => {
    (fetchTasks as ReturnType<typeof vi.fn>).mockRejectedValue(new Error("Network error"));
    render(<TasksClient />);
    await waitFor(() => {
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });
    expect(screen.getByText("Network error")).toBeInTheDocument();
  });

  it("shows auth required state", async () => {
    (fetchTasks as ReturnType<typeof vi.fn>).mockRejectedValue(new AuthRequiredError());
    render(<TasksClient />);
    await waitFor(() => {
      expect(screen.getByText("Log in to see this")).toBeInTheDocument();
    });
  });

  it("shows empty state when no tasks returned", async () => {
    (fetchTasks as ReturnType<typeof vi.fn>).mockResolvedValue({
      ...mockResponse, tasks: [], total: 0,
    });
    render(<TasksClient />);
    await waitFor(() => {
      expect(screen.getByText("No Tasks Found")).toBeInTheDocument();
    });
  });

  it("renders column headers", () => {
    render(<TasksClient initialData={mockResponse} />);
    expect(screen.getByText("SUBSCRIBERS")).toBeInTheDocument();
    expect(screen.getByText("SAVES")).toBeInTheDocument();
    expect(screen.getByText("TOOLS")).toBeInTheDocument();
  });
});
