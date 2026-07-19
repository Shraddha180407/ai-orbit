"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckSquare, ChevronDown, ChevronRight, Search } from "lucide-react";

interface TaskItem {
  title: string;
  slug: string;
  category: string;
}

const ALL_TASKS: TaskItem[] = [
  { title: "Summarize a document", slug: "summarize-a-document", category: "Personal" },
  { title: "Generate marketing copy", slug: "generate-marketing-copy", category: "Creativity" },
  { title: "Transcribe a meeting", slug: "transcribe-a-meeting", category: "Work" },
  { title: "Remove background from an image", slug: "remove-background-from-an-image", category: "Creativity" },
  { title: "Write unit tests", slug: "write-unit-tests", category: "Work" },
  { title: "Translate a webpage", slug: "translate-a-webpage", category: "Personal" },
  { title: "Build a chatbot", slug: "build-a-chatbot", category: "Work" },
  { title: "Clean a spreadsheet", slug: "clean-a-spreadsheet", category: "Work" },
  { title: "Generate a voiceover", slug: "generate-a-voiceover", category: "Creativity" },
  { title: "Detect anomalies in data", slug: "detect-anomalies-in-data", category: "Work" },
];

const CATEGORIES = [
  { name: "Personal", emoji: "🙋‍♂️", slug: "Personal" },
  { name: "Work", emoji: "💼", slug: "Work" },
  { name: "Creativity", emoji: "🎨", slug: "Creativity" },
];

interface TasksDropdownProps {
  buttonClassName?: string;
  menuClassName?: string;
}

export function TasksDropdown({ buttonClassName, menuClassName }: TasksDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter tasks based on query
  const filteredTasks = searchQuery.trim()
    ? ALL_TASKS.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleCategoryClick = (categorySlug: string) => {
    setIsOpen(false);
    setSearchQuery("");
    router.push(`/task/${categorySlug.toLowerCase()}`);
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      {/* Dropdown Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClassName || "flex items-center gap-1.5 rounded-full border border-search-border px-3 py-1.5 text-sm text-search-text-secondary transition-colors hover:border-search-border-hover hover:text-search-text-primary bg-search-surface/50"}
      >
        <CheckSquare size={14} className="shrink-0" />
        <span>Tasks</span>
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={
            menuClassName ||
            "absolute left-0 mt-2 w-[280px] rounded-lg border border-search-border bg-search-surface p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150"
          }
          style={{ backgroundColor: "#1e1e24" }}
        >
          {/* Search Input */}
          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-search-text-tertiary" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-search-border bg-search-bg py-1.5 pl-8 pr-3 text-xs text-search-text-primary placeholder-search-text-tertiary outline-none focus:border-search-border-hover focus:ring-1 focus:ring-search-accent"
              autoFocus
            />
          </div>

          {/* Menu Items */}
          <div className="max-h-[220px] overflow-y-auto space-y-0.5">
            {searchQuery.trim() ? (
              filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <Link
                    key={task.slug}
                    href={`/tasks/${task.slug}`}
                    onClick={() => {
                      setIsOpen(false);
                      setSearchQuery("");
                    }}
                    className="flex items-center justify-between rounded-md px-2.5 py-2 text-xs font-medium text-search-text-secondary hover:bg-white/5 hover:text-search-text-primary transition-colors"
                  >
                    <span className="truncate">{task.title}</span>
                    <span className="text-[10px] uppercase tracking-wider text-search-text-tertiary px-1 bg-white/5 rounded shrink-0 ml-2">
                      {task.category}
                    </span>
                  </Link>
                ))
              ) : (
                <div className="px-2.5 py-3 text-center text-xs text-search-text-tertiary">
                  No matching tasks found
                </div>
              )
            ) : (
              CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => handleCategoryClick(cat.slug)}
                  className="flex w-full items-center justify-between rounded-md px-2.5 py-2 text-xs font-medium text-search-text-secondary hover:bg-white/5 hover:text-search-text-primary transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base leading-none">{cat.emoji}</span>
                    <span>{cat.name}</span>
                  </div>
                  <ChevronRight size={12} className="text-search-text-tertiary/75" />
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
