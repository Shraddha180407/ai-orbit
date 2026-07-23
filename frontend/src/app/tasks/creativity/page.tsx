"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ToolListView } from "@/components/ToolListView";
import { API_URL } from "@/lib/api";

const CATEGORY_TOPICS = [
  "Image Generation",
  "Video",
  "Audio",
  "Marketing",
  "Design",
  "Productivity",
  "Chatbots",
  "Customer Support"
];

const ALLOWED_CATEGORIES = ["Image Generation", "Video", "Audio", "Marketing", "Design", "Productivity", "Chatbots", "Customer Support"];

export default function CreativityTasksPage() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(CATEGORY_TOPICS[0]);
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const [backendTools, setBackendTools] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBackendData() {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/v1/tools?limit=100`);
        if (res.ok) {
          const data = await res.json();
          setBackendTools(data.tools || []);
        }
      } catch (err) {
        console.error("Failed to load backend tools:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadBackendData();
  }, []);

  const categoryTools = useMemo(() => {
    const tools = backendTools.filter((tool) => {
      const toolCats = tool.categories?.map((c: { category?: { name: string } }) => c.category?.name) || [tool.category];
      return toolCats.some((catName: string) => catName && ALLOWED_CATEGORIES.includes(catName));
    });
    return tools;
  }, [backendTools]);

  const filteredTools = useMemo(() => {
    if (!selectedTopic) return categoryTools;
    return categoryTools.filter((tool) => {
      const cats = tool.categories?.map((c: { category?: { name: string } }) => c.category?.name) || [tool.category];
      if (selectedTopic === "Design") {
        return cats.includes("Image Generation");
      }
      return cats.includes(selectedTopic);
    });
  }, [categoryTools, selectedTopic]);

  const handleTopicClick = (topic: string | null, e: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedTopic(topic);
    e.currentTarget.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center"
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between">
      <Header />

      <main className="flex-1 mx-auto max-w-[1600px] w-full px-6 py-10">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors group"
        >
          <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-0.5" />
          Back to Home
        </Link>

        {/* Centered Heading */}
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#6E56CF] text-center mb-6">
          Creativity Tasks
        </h1>

        {/* Top Sliding Category Row */}
        <div className="mb-8 flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-3 scrollbar-none w-full">
          {CATEGORY_TOPICS.map((topic) => (
            <button
              key={topic}
              onClick={(e) => handleTopicClick(topic, e)}
              className={`rounded-full px-3 py-1 text-[9.5px] font-bold whitespace-nowrap transition-all duration-200 border ${
                selectedTopic === topic
                  ? "bg-white text-black border-white shadow-lg shadow-white/5"
                  : "text-neutral-400 hover:text-white bg-[#131316]/50 border-white/[0.05] hover:border-white/[0.15]"
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Tools List View */}
        <ToolListView tools={filteredTools} loading={isLoading} />
      </main>

      <Footer />
    </div>
  );
}
export const dynamic = "force-dynamic";
