import { Suspense } from "react";
import { Header } from "@/components/Header";
import { GlobalHero } from "@/components/GlobalHero";
import { Footer } from "@/components/Footer";
import { TasksClient } from "@/components/tasks-client";

export const metadata = {
  title: "Tasks | AI Orbit",
  description:
    "Browse AI tasks by category — tools, models, and devices for every use case.",
};

export default function TasksPage() {
  return (
    <div className="flex flex-col flex-1">

      <div className="relative z-[60]">
        <Suspense fallback={<div className="h-[300px]" />}><GlobalHero /></Suspense>
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        <Suspense fallback={<div className="flex-1 w-full min-h-[50vh]" />}><TasksClient /></Suspense>
      </div>

    </div>
  );
}