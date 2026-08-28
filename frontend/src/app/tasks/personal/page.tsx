"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ToolListView } from "@/components/ToolListView";
import { API_URL } from "@/lib/api";

const CATEGORY_TOPICS = [
  { name: "All", slug: "" },
  { name: "Relationships", slug: "relationships" },
  { name: "Education", slug: "education" },
  { name: "Learning", slug: "learning" },
  { name: "Health & Wellness", slug: "health-wellness" },
  { name: "Personal Development", slug: "personal-development" },
  { name: "Travel", slug: "travel" },
  { name: "Finance & Wealth", slug: "finance-wealth" },
  { name: "Entertainment", slug: "entertainment" },
  { name: "Food & Nutrition", slug: "food-nutrition" },
  { name: "Shopping", slug: "shopping" },
  { name: "Fashion & Style", slug: "fashion-style" },
  { name: "Mindfulness", slug: "mindfulness" },
  { name: "Life Coaching", slug: "life-coaching" },
  { name: "Home Decor", slug: "home-decor" },
  { name: "Insurance Advisor", slug: "insurance-advisor" }
];

const ALLOWED_CATEGORIES = ["Productivity", "Chatbots", "Writing", "Audio", "Customer Support", "Video", "Image Generation", "Marketing"];

export default function PersonalTasksPage() {
  const [selectedTopic, setSelectedTopic] = useState<string>("");
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
      if (selectedTopic === "Writing") {
        return cats.includes("Productivity");
      }
      return cats.includes(selectedTopic);
    });
  }, [categoryTools, selectedTopic]);

  return (
    <div className="flex flex-col flex-1 justify-between">


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
          Personal Tasks
        </h1>

        {/* Top Sliding Category Row */}
        <div className="mb-8 flex items-center justify-start md:justify-center gap-1.5 overflow-x-auto pb-2.5 scrollbar-none w-full">
          {CATEGORY_TOPICS.map((topic) => (
            <button
              key={topic.slug}
              onClick={(e) => {
                setSelectedTopic(topic.slug);
                const url = topic.slug ? `/personal/${topic.slug}` : `/personal`;
                window.history.pushState(null, "", url);
                e.currentTarget.scrollIntoView({
                  behavior: "smooth",
                  block: "nearest",
                  inline: "center"
                });
              }}
              className={`rounded-full px-3 py-1 text-[12px] font-semibold whitespace-nowrap transition-all duration-200 border cursor-pointer ${
                selectedTopic === topic.slug
                  ? "bg-white text-black border-white shadow-lg shadow-white/5"
                  : "text-neutral-400 hover:text-white bg-[#131316]/50 border-[#232326]/60 hover:border-white/[0.15]"
              }`}
            >
              {topic.name}
            </button>
          ))}
        </div>

        {/* Tools List View */}
        <ToolListView tools={filteredTools} loading={isLoading} />
      </main>


    </div>
  );
}
export const dynamic = "force-dynamic";
