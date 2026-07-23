import { TasksClient } from "@/components/tasks-client";

export const metadata = {
  title: "Tasks | AI Orbit",
  description:
    "Browse AI tasks by category — tools, models, and devices for every use case.",
};

export default function TasksPage() {
  return <TasksClient />;
}