import React from "react";
import { fetchTasks } from "@/lib/tasks-api";
import { TasksClient } from "@/components/tasks-client";
import { TaskErrorState } from "@/components/TaskErrorState";

export const runtime = "edge";

export const metadata = {
  title: "Tasks | AI Orbit",
  description: "Browse AI tasks by category — tools, models, and devices for every use case.",
};

export default async function TasksPage() {
  try {
    const initialData = await fetchTasks({ page: 1, sort: "newest" });
    return <TasksClient initialData={initialData} />;
  } catch (e) {
    return (
      <div className="min-h-screen bg-[#000000] px-6 lg:px-10 xl:px-14 py-8">
        <TaskErrorState message="We couldn't load the Tasks directory right now." />
      </div>
    );
  }
}