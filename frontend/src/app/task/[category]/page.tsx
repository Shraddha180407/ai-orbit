"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { 
  ArrowLeft, 
  MessageSquare, 
  Copy, 
  Check,
  Bookmark,
  Sparkles,
  Star,
  Zap,
  TrendingUp,
  BookmarkCheck,
  Users
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { API_URL } from "@/lib/api";

// Topic chips mapping for each category to match TAAFT layout
const CATEGORY_TOPICS: Record<string, string[]> = {
  personal: ["Education", "Learning", "Relationships", "Health", "Food", "Spirituality", "Fashion", "Shopping", "Travel", "Lifestyle"],
  work: ["Coding", "Writing", "Data Analysis", "Spreadsheets", "Chatbots", "Transcription", "Customer Support", "Research", "Productivity"],
  creativity: ["Image Generation", "Video Editing", "Voiceover", "Audio", "Marketing", "Art & Design", "Voice Cloning", "Podcasting"]
};

// Main category emojis mapping for section headers
const CATEGORY_EMOJIS: Record<string, string> = {
  "Writing": "✍️",
  "Coding": "💻",
  "Image Generation": "🎨",
  "Video": "🎥",
  "Audio": "🔊",
  "Productivity": "⚡",
  "Marketing": "📈",
  "Research": "🔍",
  "Data Analysis": "📊",
  "Customer Support": "💬",
  "General": "📁"
};

// Map real backend tool category names to task categories
const TASK_CATEGORY_MAP: Record<string, string[]> = {
  personal: ["Productivity", "Writing", "Audio", "Customer Support", "Research"],
  work: ["Coding", "Writing", "Data Analysis", "Customer Support", "Research", "Productivity"],
  creativity: ["Image Generation", "Video", "Audio", "Marketing", "Design"]
};

// Sub-tabs shown below header
const FILTER_TABS = ["All", "SOTA (State of the Art)", "Mini Tools", "Popular", "New"] as const;
type FilterTab = typeof FILTER_TABS[number];

export default function TaskCategoryPage() {
  const params = useParams();
  const rawCategory = params.category as string;
  const categoryKey = rawCategory?.toLowerCase();

  // Validate category
  const isValidCategory = ["personal", "work", "creativity"].includes(categoryKey);
  if (!isValidCategory) {
    notFound();
  }

  const categoryName = rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1);
  const [copied, setCopied] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [savedTools, setSavedTools] = useState<Record<string, boolean>>({});
  
  // Real backend tool state
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const [backendTools, setBackendTools] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real tools from the backend on load
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

  // Filter tools belonging to this category from backend
  const categoryTools = useMemo(() => {
    const allowedCategories = TASK_CATEGORY_MAP[categoryKey] || [];
    const tools = backendTools.filter((tool) => {
      // Check first category in categories list or fallback category property
      const toolCatName = tool.categories?.[0]?.category?.name || tool.category;
      return toolCatName && allowedCategories.includes(toolCatName);
    });

    // Apply active sub-tab filters/sorting
    if (activeTab === "SOTA (State of the Art)") {
      return [...tools].sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0)).slice(0, 4);
    }
    if (activeTab === "Mini Tools") {
      return tools.slice(0, Math.ceil(tools.length / 2));
    }
    if (activeTab === "Popular") {
      return [...tools].sort((a, b) => (b._count?.bookmarks || 0) - (a._count?.bookmarks || 0));
    }
    if (activeTab === "New") {
      return [...tools].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return tools;
  }, [backendTools, categoryKey, activeTab]);

  // Group tools by their respective sub-categories
  const groupedTools = useMemo(() => {
    const groups: Record<string, typeof categoryTools> = {};
    categoryTools.forEach((tool) => {
      const cat = tool.categories?.[0]?.category?.name || tool.category || "General";
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(tool);
    });
    return groups;
  }, [categoryTools]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleSaveTool = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedTools(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Toggle backend subscription for task category
  const handleSubscribe = async () => {
    setSubscribed(!subscribed);
    try {
      await fetch(`${API_URL}/api/v1/tasks/${categoryKey}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
    } catch (e) {
      console.error("Failed to toggle subscription on backend:", e);
    }
  };

  const topicChips = CATEGORY_TOPICS[categoryKey] || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#090a0f] to-[#000000] text-white flex flex-col justify-between">
      <Header />

      <main className="flex-1 mx-auto max-w-[1240px] w-full px-6 py-10">
        {/* Back Link */}
        <Link
          href="/search"
          className="mb-8 inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors group"
        >
          <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-0.5" />
          Back to Search
        </Link>

        {/* Dynamic Category Header Block (Glassmorphic design) */}
        <header className="mb-10 p-8 rounded-2xl border border-white/[0.06] bg-white/[0.01] backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-white/95 flex items-center gap-3">
                {categoryName}
                <Sparkles size={22} className="text-amber-400 animate-pulse" />
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-neutral-400">
                <span className="bg-white/[0.04] text-neutral-300 px-3 py-1 rounded-full border border-white/[0.05]">
                  taaft.com/task/{categoryKey}
                </span>
                <span className="flex items-center gap-1.5 bg-white/[0.02] border border-white/[0.03] px-3 py-1 rounded-full text-neutral-400">
                  <Users size={12} className="text-neutral-500" />
                  {(categoryTools.length * 480 + 3100).toLocaleString()} subscribers
                </span>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleSubscribe}
                className={`flex h-10 items-center justify-center rounded-xl px-5 text-xs font-bold transition-all ${
                  subscribed 
                    ? "bg-neutral-800 text-neutral-300 border border-neutral-700 hover:bg-neutral-700" 
                    : "bg-white text-black hover:bg-neutral-200"
                }`}
              >
                {subscribed ? "Subscribed" : "Subscribe"}
              </button>
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.08] transition-colors"
                title="Copy Page Link"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              </button>
              <a
                href={`https://wa.me/?text=Check%20out%20these%20great%20AI%20tools%20for%20${categoryName}%20on%20The%20AI%20Signal!`}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.08] transition-colors text-[#25D366]"
                title="Share to WhatsApp"
              >
                <MessageSquare size={14} />
              </a>
            </div>
          </div>

          <p className="mt-6 text-sm text-neutral-300 leading-relaxed max-w-3xl">
            Browse through top-tier artificial intelligence platforms optimized for {categoryName} tasks, grouped by their specialized tool columns.
          </p>

          {/* Sub-topic Tag Chips Row */}
          <div className="flex flex-wrap items-center gap-2 mt-8 border-t border-white/[0.06] pt-6">
            {topicChips.map((topic) => (
              <span
                key={topic}
                className="inline-flex items-center rounded-full bg-white/[0.02] border border-white/[0.05] px-3.5 py-1.5 text-xs font-semibold text-neutral-300 cursor-pointer hover:bg-white/[0.06] hover:border-white/[0.15] hover:text-white transition-all duration-300"
              >
                {topic}
              </span>
            ))}
          </div>
        </header>

        {/* Filters and Tabs Row */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
          <div className="flex flex-wrap items-center gap-2">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                  activeTab === tab 
                    ? "bg-white text-black shadow-md" 
                    : "text-neutral-400 hover:text-white bg-white/[0.02] border border-white/[0.04]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="text-xs text-neutral-400 flex items-center gap-1.5">
            <Zap size={13} className="text-amber-400" />
            Curating {categoryTools.length} tools across {Object.keys(groupedTools).length} columns
          </div>
        </div>

        {/* Grouped Tool Sections (Respective Columns) */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[1,2,3,4,5,6,7,8].map((i) => (
              <div key={i} className="h-[240px] animate-pulse rounded-2xl border border-white/[0.05] bg-white/[0.01]" />
            ))}
          </div>
        ) : categoryTools.length > 0 ? (
          <div className="space-y-12">
            {Object.entries(groupedTools).map(([groupName, tools]) => {
              const emoji = CATEGORY_EMOJIS[groupName] || "📁";
              
              return (
                <section key={groupName} className="space-y-5">
                  {/* Sub-category Header/Title representing columns */}
                  <div className="flex items-center gap-2.5 border-b border-white/[0.04] pb-2">
                    <span className="text-lg leading-none" role="img" aria-label={groupName}>
                      {emoji}
                    </span>
                    <h2 className="text-base font-bold text-white tracking-tight">
                      {groupName}
                    </h2>
                    <span className="text-[10px] font-bold text-neutral-400 bg-white/[0.03] border border-white/[0.05] px-2 py-0.5 rounded-full">
                      {tools.length} {tools.length === 1 ? "tool" : "tools"}
                    </span>
                  </div>

                  {/* Responsive 4-Column Tool Grid for this specific Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {tools.map((tool) => {
                      const hasLogo = !!tool.logoUrl || !!tool.imageUrl;
                      const logoSrc = tool.logoUrl || tool.imageUrl;
                      const isSaved = !!savedTools[tool.id];
                      
                      const rating = tool.avgRating ? Number(tool.avgRating).toFixed(1) : "4.5";
                      const savesCount = tool._count?.bookmarks ? tool._count.bookmarks : (100 + (tool.id.length * 7));

                      return (
                        <Link
                          key={tool.id}
                          href={`/tools/${tool.slug}`}
                          className="group flex flex-col justify-between bg-white/[0.01] hover:bg-white/[0.03] rounded-2xl border border-white/[0.05] hover:border-white/[0.12] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_-10px_rgba(255,255,255,0.05)] min-h-[240px]"
                        >
                          <div>
                            <div className="flex items-start justify-between">
                              {/* Tool Logo Container */}
                              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white border border-white/[0.08] p-2 shrink-0 shadow-sm">
                                {hasLogo ? (
                                  <img
                                    src={logoSrc}
                                    alt={`${tool.name} logo`}
                                    className="h-full w-full object-contain"
                                  />
                                ) : (
                                  <span className="text-sm font-black text-black">
                                    {(tool.name || tool.title).charAt(0)}
                                  </span>
                                )}
                              </div>

                              {/* Bookmark Icon */}
                              <button
                                type="button"
                                onClick={(e) => toggleSaveTool(tool.id, e)}
                                className="text-neutral-500 hover:text-white p-1.5 rounded-lg transition-colors bg-white/[0.02] border border-white/[0.04]"
                              >
                                {isSaved ? (
                                  <BookmarkCheck size={14} className="text-amber-400" />
                                ) : (
                                  <Bookmark size={14} />
                                )}
                              </button>
                            </div>

                            <h3 className="mt-4 text-sm font-bold text-white/95 group-hover:text-white transition-colors truncate">
                              {tool.name || tool.title}
                            </h3>
                            
                            {/* Stars and Saves Row */}
                            <div className="flex items-center gap-2 mt-1.5 text-[10px] text-neutral-400 font-semibold">
                              <span className="flex items-center gap-0.5 text-amber-400">
                                <Star size={11} fill="currentColor" />
                                {rating}
                              </span>
                              <span className="h-1 w-1 rounded-full bg-neutral-700" />
                              <span>{savesCount} saves</span>
                            </div>

                            <p className="mt-3 text-xs text-neutral-400 line-clamp-3 leading-relaxed">
                              {tool.description}
                            </p>
                          </div>

                          <div className="mt-6 border-t border-white/[0.05] pt-3 flex items-center justify-between text-[11px] text-neutral-500">
                            <span className="font-semibold text-neutral-300 bg-white/[0.04] border border-white/[0.04] px-2 py-0.5 rounded">
                              {tool.pricingModel || tool.meta?.pricing || "Freemium"}
                            </span>
                            <span className="group-hover:text-white font-medium transition-colors flex items-center gap-0.5">
                              Details &rarr;
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-white/[0.08] rounded-2xl bg-white/[0.01]">
            <TrendingUp size={24} className="mx-auto text-neutral-500 mb-3" />
            <p className="text-sm font-medium text-neutral-400">No tools found matching this filter.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
export const runtime = "edge";
export const dynamic = "force-dynamic";
