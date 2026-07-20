import React from "react";
import { notFound } from "next/navigation";
import { fetchTask, fetchTasks } from "@/lib/tasks-api";
import { TaskDetail } from "@/components/TaskDetail";
import { TaskErrorState } from "@/components/TaskErrorState";

export const runtime = "edge";

type TaskPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: TaskPageProps) {
  const { slug } = await params;

  try {
    const data = await fetchTask(slug);
    if (!data) {
      return { title: "Task Not Found | AI Orbit" };
    }
    return {
      title: `${data.task.title} | AI Orbit`,
      description: data.task.description,
    };
  } catch (e) {
    return { title: "Tasks | AI Orbit" };
  }
}

export default async function TaskPage({ params }: TaskPageProps) {
  const { slug } = await params;

  let data;
  try {
    data = await fetchTask(slug);
  } catch (e) {
    return (
      <div className="min-h-screen bg-[#000000] px-6 lg:px-10 xl:px-14 py-8">
        <TaskErrorState message="We couldn't load this task right now." />
      </div>
    );
  }

  if (!data) {
    notFound();
  }

  const { task, bookmarked, liked, subscribed } = data;

  // No dedicated "related tasks" endpoint yet — filter the list
  // endpoint by the current task's category, per the backend brief.
  let relatedTasks: Awaited<ReturnType<typeof fetchTasks>>["tasks"] = [];
  try {
    const relatedResponse = await fetchTasks({ category: task.category.slug, page: 1 });
    relatedTasks = relatedResponse.tasks.filter((t) => t.slug !== task.slug).slice(0, 5);
  } catch (e) {
    console.error("Failed to load related tasks:", e);
    // Non-fatal — page still renders without the related section.
  }

  return <TaskDetail task={task} relatedTasks={relatedTasks} bookmarked={bookmarked} liked={liked} subscribed={subscribed} />;
}