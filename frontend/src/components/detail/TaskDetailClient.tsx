'use client';

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { fetchTask, fetchTasks, type Task } from "@/lib/tasks-api";
import { TaskDetail } from "@/components/TaskDetail";

import { useQuery } from "@tanstack/react-query";

export function TaskDetailClient() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: taskData, isLoading, isError } = useQuery({
    queryKey: ["task-detail", slug],
    queryFn: async () => {
      const data = await fetchTask(slug);
      if (!data) return null;
      let related: Task[] = [];
      if (data.task.category?.slug) {
        try {
          const relatedRes = await fetchTasks({ category: data.task.category.slug, page: 1 });
          related = relatedRes.tasks.filter((t) => t.slug !== data.task.slug).slice(0, 5);
        } catch {}
      }
      return { ...data, relatedTasks: related };
    },
    staleTime: 10 * 60 * 1000,
  });

  const task = taskData?.task || null;
  const relatedTasks = taskData?.relatedTasks || [];
  const bookmarked = taskData?.bookmarked || false;
  const liked = taskData?.liked || false;
  const subscribed = taskData?.subscribed || false;
  const notFoundState = isError || (!isLoading && !task);

  // Same pattern as ToolDetailClient: set the document title client-side
  // once data is in. The server-rendered <title> comes from
  // UnifiedEntityPage's generateMetadata (see the "tasks" branch there).
  useEffect(() => {
    if (task) {
      document.title = `${task.title} | AI Orbit`;
    }
  }, [task]);

  if (notFoundState) {
    notFound();
  }

  if (isLoading || !task) {
    return (
      <main className="min-h-screen bg-[#000000] w-full max-w-none px-6 lg:px-10 xl:px-14 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-4 w-40 rounded bg-[#18181C]" />
          <div className="rounded-2xl ring-1 ring-[#232326]/70 bg-gradient-to-b from-[#131316]/70 to-[#0D0D10]/70 p-6 sm:p-9 space-y-6">
            <div className="flex gap-4">
              <div className="h-16 w-16 rounded-2xl bg-[#18181C]" />
              <div className="space-y-2 flex-1">
                <div className="h-7 w-56 rounded bg-[#18181C]" />
                <div className="h-4 w-32 rounded bg-[#18181C]" />
                <div className="h-4 w-40 rounded bg-[#18181C]" />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-[#18181C]/80" />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <TaskDetail
      task={task}
      relatedTasks={relatedTasks}
      bookmarked={bookmarked}
      liked={liked}
      subscribed={subscribed}
    />
  );
}