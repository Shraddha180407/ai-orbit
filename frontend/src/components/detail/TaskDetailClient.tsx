'use client';

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchTask, fetchTasks, type Task, type TaskDetail as TaskDetailData } from "@/lib/tasks-api";
import { API_URL, getFromCache } from "@/lib/api";
import { TaskDetail } from "@/components/TaskDetail";

export function TaskDetailClient() {
  const params = useParams();
  const slug = params.slug as string;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["task-detail", slug],
    queryFn: () => fetchTask(slug),
    initialData: () => {
      if (!slug) return undefined;
      return getFromCache<any>(`${API_URL}/api/v1/tasks/${encodeURIComponent(slug)}`) || undefined;
    },
    staleTime: 15 * 60 * 1000,
    enabled: Boolean(slug),
  });

  const task = data?.task || null;
  const [relatedTasks, setRelatedTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (task?.category?.slug) {
      fetchTasks({ category: task.category.slug, page: 1 })
        .then((related) => {
          setRelatedTasks(related.tasks.filter((t) => t.slug !== task.slug).slice(0, 5));
        })
        .catch(() => setRelatedTasks([]));
    }
  }, [task?.category?.slug, task?.slug]);

  const bookmarked = data?.bookmarked ?? false;
  const liked = data?.liked ?? false;
  const subscribed = data?.subscribed ?? false;

  useEffect(() => {
    if (task) {
      document.title = `${task.title} | AI Orbit`;
    }
  }, [task]);

  if (isError && !task) {
    notFound();
  }

  if (isLoading && !task) {
    return (
      <main className="flex-1 bg-[#000000] w-full max-w-none px-6 lg:px-10 xl:px-14 py-8">
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