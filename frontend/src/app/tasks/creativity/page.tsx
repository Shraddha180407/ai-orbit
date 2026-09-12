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
  { name: "Image Generation", slug: "image-generation" },
  { name: "Writing", slug: "writing" },
  { name: "Software Development", slug: "software-development" },
  { name: "Video Creation", slug: "video-creation" },
  { name: "Music", slug: "music" },
  { name: "Graphic Design", slug: "graphic-design" },
  { name: "Digital Art", slug: "digital-art" },
  { name: "Brainstorming", slug: "brainstorming" },
  { name: "3D Creation", slug: "3d-creation" },
  { name: "Presentation Design", slug: "presentation-design" },
  { name: "Storytelling", slug: "storytelling" },
  { name: "Content Creation", slug: "content-creation" },
  { name: "Branding", slug: "branding" },
  { name: "Motion Graphics", slug: "motion-graphics" },
  { name: "Game Creation", slug: "game-creation" }
];

const ALLOWED_CATEGORIES = [
  "Image Generation",
  "Writing",
  "Software Development",
  "Video Creation",
  "Music",
  "Graphic Design",
  "Digital Art",
  "Brainstorming",
  "3D Creation",
  "Presentation Design",
  "Storytelling",
  "Content Creation",
  "Branding",
  "Motion Graphics",
  "Game Creation"
];

export default function CreativityTasksPage() {
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
    if (!selectedTopic || selectedTopic === "All") return categoryTools;
    return categoryTools.filter((tool) => {
      const cats = tool.categories?.map((c: { category?: { name: string } }) => c.category?.name) || [tool.category];
      if (selectedTopic === "Design") {
        return cats.includes("Image Generation");
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
          Creativity Tasks
        </h1>

        {/* Top Sliding Category Row */}
        <div className="mb-8 flex items-center justify-start md:justify-center gap-1.5 overflow-x-auto pb-2.5 scrollbar-none w-full">
          {CATEGORY_TOPICS.map((topic) => (
            <button
              key={topic.slug}
              onClick={(e) => {
                setSelectedTopic(topic.name); // store name for filtering
                const url = topic.slug ? `/creativity/${topic.slug}` : `/creativity`;
                window.history.pushState(null, "", url);
                
                const btn = e.currentTarget;
                const container = btn.parentElement;
                if (container && window.innerWidth < 768) {
                  requestAnimationFrame(() => {
                    const cRect = container.getBoundingClientRect();
                    const bRect = btn.getBoundingClientRect();
                    const bLeft = bRect.left - cRect.left + container.scrollLeft;
                    const bRight = bLeft + bRect.width;

                    if (bLeft < container.scrollLeft) {
                      container.scrollTo({ left: bLeft - 16, behavior: "smooth" });
                    } else if (bRight > container.scrollLeft + container.clientWidth) {
                      container.scrollTo({ left: bRight - container.clientWidth + 16, behavior: "smooth" });
                    }
                  });
                }
              }}
              className={`rounded-full px-3 py-1 text-[12px] font-semibold whitespace-nowrap transition-all duration-200 border cursor-pointer ${
                selectedTopic === topic.name // compare against name
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
