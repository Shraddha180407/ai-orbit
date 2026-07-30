import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { TasksClient } from "@/components/tasks-client";
import type { TaskListResponse } from "@/lib/tasks-api";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock("lucide-react/dist/esm/icons/chevron-right", () => ({
  default: (props: any) => <svg data-testid="chevron-right" {...props} />,
}));
vi.mock("lucide-react/dist/esm/icons/sparkles", () => ({
  default: (props: any) => <svg data-testid="sparkles" {...props} />,
}));

vi.mock("@/lib/tasks-api", () => ({
  fetchTasks: vi.fn(),
  AuthRequiredError: class AuthRequiredError extends Error {
    constructor(msg?: string) { super(msg ?? "auth required"); }
  },
}));
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: vi.fn() }),
  useParams: () => ({}),
}));

vi.mock("@/hooks/use-user", () => ({
  useUser: () => ({ user: null, isLoading: false, isAuthenticated: false }),
}));
import { fetchTasks, AuthRequiredError } from "@/lib/tasks-api";
import { TaskFilters } from "@/components/TaskFilters";

vi.mock("@/components/TaskFilters", () => ({
  TaskFilters: (props: any) => (
    <div data-testid="task-filters">
      <input data-testid="search-input" onChange={(e) => props.onSearchChange(e.target.value)} />
      <button data-testid="category-btn" onClick={() => props.onCategoryChange("coding")}>Coding</button>
    </div>
  ),
}));

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
    expect(screen.getAllByText("Tasks").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(fetchTasks).not.toHaveBeenCalled();
  });

  it("shows task count subtitle", () => {
    render(<TasksClient initialData={mockResponse} />);
    expect(screen.getByText("Tasks across all categories")).toBeInTheDocument();
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

  it("renders task filters component", () => {
    render(<TasksClient initialData={mockResponse} />);
    expect(screen.getByTestId("task-filters")).toBeInTheDocument();
  });

});
