import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { TaskDetail } from "@/components/TaskDetail";
import type { Task } from "@/lib/tasks-api";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock("lucide-react/dist/esm/icons/chevron-right", () => ({
  default: (props: any) => <svg data-testid="chevron-right" {...props} />,
}));
vi.mock("lucide-react/dist/esm/icons/arrow-left", () => ({
  default: (props: any) => <svg data-testid="arrow-left" {...props} />,
}));
vi.mock("lucide-react/dist/esm/icons/bell", () => ({
  default: (props: any) => <svg data-testid="bell" {...props} />,
}));
vi.mock("lucide-react/dist/esm/icons/bookmark", () => ({
  default: (props: any) => <svg data-testid="bookmark" {...props} />,
}));
vi.mock("lucide-react/dist/esm/icons/wrench", () => ({
  default: (props: any) => <svg data-testid="wrench" {...props} />,
}));
vi.mock("lucide-react/dist/esm/icons/brain", () => ({
  default: (props: any) => <svg data-testid="brain" {...props} />,
}));
vi.mock("lucide-react/dist/esm/icons/monitor", () => ({
  default: (props: any) => <svg data-testid="monitor" {...props} />,
}));
vi.mock("lucide-react/dist/esm/icons/link-2", () => ({
  default: (props: any) => <svg data-testid="link-2" {...props} />,
}));
vi.mock("lucide-react/dist/esm/icons/heart", () => ({
  default: (props: any) => <svg data-testid="heart" {...props} />,
}));
vi.mock("lucide-react/dist/esm/icons/star", () => ({
  default: (props: any) => <svg data-testid="star" {...props} />,
}));

vi.mock("@/components/TaskDetailActions", () => ({
  TaskDetailActions: (props: any) => (
    <div data-testid="task-detail-actions" data-slug={props.slug} />
  ),
}));

const mockTask: Task = {
  id: "t1", slug: "build-landing-page", title: "Build a Landing Page",
  description: "Create a responsive landing page", difficulty: "EASY",
  pricingModel: "FREE", isFeatured: true,
  category: { slug: "coding", name: "Coding" },
  creator: { name: "Admin" }, createdAt: "2024-06-15T10:00:00Z",
  likes: 42, subscribers: 150, saves: 89,
  resources: 5, tools: 12, models: 3, robots: 7, devices: 2,
};

const relatedTask: Task = {
  ...mockTask, id: "t2", slug: "related-task", title: "Related Task",
};

describe("TaskDetail", () => {
  it("renders task title", () => {
    render(
      <TaskDetail task={mockTask} relatedTasks={[]} bookmarked={false} liked={false} subscribed={false} />
    );
    expect(screen.getAllByText("Build a Landing Page").length).toBeGreaterThanOrEqual(1);
  });

  it("renders task description", () => {
    render(
      <TaskDetail task={mockTask} relatedTasks={[]} bookmarked={false} liked={false} subscribed={false} />
    );
    expect(screen.getByText("Create a responsive landing page")).toBeInTheDocument();
  });

  it("renders category badge", () => {
    render(
      <TaskDetail task={mockTask} relatedTasks={[]} bookmarked={false} liked={false} subscribed={false} />
    );
    expect(screen.getAllByText("Coding").length).toBeGreaterThanOrEqual(1);
  });

  it("renders difficulty badge", () => {
    render(
      <TaskDetail task={mockTask} relatedTasks={[]} bookmarked={false} liked={false} subscribed={false} />
    );
    expect(screen.getAllByText("EASY").length).toBeGreaterThanOrEqual(1);
  });

  it("renders pricing badge", () => {
    render(
      <TaskDetail task={mockTask} relatedTasks={[]} bookmarked={false} liked={false} subscribed={false} />
    );
    expect(screen.getAllByText("FREE").length).toBeGreaterThanOrEqual(1);
  });

  it("renders featured badge", () => {
    render(
      <TaskDetail task={mockTask} relatedTasks={[]} bookmarked={false} liked={false} subscribed={false} />
    );
    expect(screen.getAllByText("Featured").length).toBeGreaterThanOrEqual(1);
  });

  it("renders creator name", () => {
    render(
      <TaskDetail task={mockTask} relatedTasks={[]} bookmarked={false} liked={false} subscribed={false} />
    );
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  it("renders stat items", () => {
    render(
      <TaskDetail task={mockTask} relatedTasks={[]} bookmarked={false} liked={false} subscribed={false} />
    );
    expect(screen.getByText("Tools")).toBeInTheDocument();
    expect(screen.getByText("Models")).toBeInTheDocument();
    expect(screen.getByText("Devices")).toBeInTheDocument();
    expect(screen.getByText("Subscribers")).toBeInTheDocument();
    expect(screen.getByText("Likes")).toBeInTheDocument();
    expect(screen.getByText("Saves")).toBeInTheDocument();
  });

  it("renders stat values formatted", () => {
    render(
      <TaskDetail task={mockTask} relatedTasks={[]} bookmarked={false} liked={false} subscribed={false} />
    );
    expect(screen.getAllByText("12").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("150")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders breadcrumb navigation", () => {
    render(
      <TaskDetail task={mockTask} relatedTasks={[]} bookmarked={false} liked={false} subscribed={false} />
    );
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
  });

  it("renders back to tasks link", () => {
    render(
      <TaskDetail task={mockTask} relatedTasks={[]} bookmarked={false} liked={false} subscribed={false} />
    );
    expect(screen.getByText("Back to Tasks")).toHaveAttribute("href", "/tasks");
  });

  it("passes props to TaskDetailActions", () => {
    render(
      <TaskDetail task={mockTask} relatedTasks={[]} bookmarked={true} liked={true} subscribed={false} />
    );
    const actions = screen.getByTestId("task-detail-actions");
    expect(actions).toHaveAttribute("data-slug", "build-landing-page");
  });

  it("renders related tasks section when tasks provided", () => {
    render(
      <TaskDetail task={mockTask} relatedTasks={[relatedTask]} bookmarked={false} liked={false} subscribed={false} />
    );
    expect(screen.getByText("Related Tasks")).toBeInTheDocument();
    expect(screen.getByText("Related Task")).toBeInTheDocument();
  });

  it("does not render related tasks when empty", () => {
    render(
      <TaskDetail task={mockTask} relatedTasks={[]} bookmarked={false} liked={false} subscribed={false} />
    );
    expect(screen.queryByText("Related Tasks")).not.toBeInTheDocument();
  });

  it("renders featured task with star icon in stat card", () => {
    render(
      <TaskDetail task={mockTask} relatedTasks={[]} bookmarked={false} liked={false} subscribed={false} />
    );
    expect(screen.getAllByTestId("star").length).toBeGreaterThanOrEqual(1);
  });
});
