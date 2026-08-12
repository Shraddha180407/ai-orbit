import { render, screen } from "@testing-library/react";
import { TaskCard } from "@/components/TaskCard";
import type { Task } from "@/lib/tasks-api";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("lucide-react/dist/esm/icons/bell", () => ({
  default: (props: any) => <svg data-testid="bell-icon" {...props} />,
}));
vi.mock("lucide-react/dist/esm/icons/bookmark", () => ({
  default: (props: any) => <svg data-testid="bookmark-icon" {...props} />,
}));
vi.mock("lucide-react/dist/esm/icons/wrench", () => ({
  default: (props: any) => <svg data-testid="wrench-icon" {...props} />,
}));
vi.mock("lucide-react/dist/esm/icons/brain", () => ({
  default: (props: any) => <svg data-testid="brain-icon" {...props} />,
}));
vi.mock("lucide-react/dist/esm/icons/bot", () => ({
  default: (props: any) => <svg data-testid="bot-icon" {...props} />,
}));
vi.mock("lucide-react/dist/esm/icons/monitor", () => ({
  default: (props: any) => <svg data-testid="monitor-icon" {...props} />,
}));

const mockTask: Task = {
  id: "task1",
  slug: "build-landing-page",
  title: "Build a Landing Page",
  description: "Create a responsive landing page",
  difficulty: "EASY",
  pricingModel: "FREE",
  isFeatured: false,
  category: { slug: "coding", name: "Coding" },
  creator: { name: "Admin" },
  createdAt: "2024-01-01T00:00:00Z",
  likes: 42,
  subscribers: 150,
  saves: 89,
  resources: 5,
  tools: 12,
  models: 3,
  robots: 7,
  devices: 2,
};

describe("TaskCard", () => {
  it("renders task title", () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText("Build a Landing Page")).toBeInTheDocument();
  });

  it("links to task detail page", () => {
    render(<TaskCard task={mockTask} />);
    const link = screen.getByRole("link", { name: /Build a Landing Page/ });
    expect(link).toHaveAttribute("href", "/tasks/build-landing-page");
  });

  it("renders subscriber count formatted", () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText("150")).toBeInTheDocument();
  });

  it("renders saves count formatted", () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText("89")).toBeInTheDocument();
  });

  it("renders tools count", () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("renders models count", () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders robots count", () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("renders devices count", () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("formats large numbers with k suffix", () => {
    const taskLargeNumbers = {
      ...mockTask,
      subscribers: 5400,
      saves: 1200000,
    };
    render(<TaskCard task={taskLargeNumbers} />);
    expect(screen.getByText("5.4k")).toBeInTheDocument();
    expect(screen.getByText("1.2m")).toBeInTheDocument();
  });

  it("renders dash for null counts", () => {
    const taskNullCounts = {
      ...mockTask,
      subscribers: null,
      saves: null,
      tools: null,
    };
    render(<TaskCard task={taskNullCounts} />);
    const dashes = screen.getAllByText("—");
    expect(dashes.length).toBeGreaterThanOrEqual(3);
  });

  it("renders category icon", () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByTestId("wrench-icon")).toBeInTheDocument();
  });
});
