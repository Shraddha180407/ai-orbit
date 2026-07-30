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
    <div className="min-h-screen flex flex-col bg-[#000000] text-white">
      <Header />
      <Suspense fallback={<div className="h-[300px]" />}><GlobalHero /></Suspense>
      <TasksClient />
      <Footer />
    </div>
  );
}