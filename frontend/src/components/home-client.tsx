'use client';

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import Link from "next/link";

export type DirectoryMode =
  | 'tools'
  | 'tasks'
  | 'companies'
  | 'news'
  | 'videos'
  | 'robots'
  | 'devices'
  | 'models'
  | 'repositories'
  | 'mcp'
  | 'collections'
  | 'personal'
  | 'creativity';

const TOOLS_SUB = [
  "Writing & Content",
  "Image Generation",
  "Video Generation & Editing",
  "Audio & Voice",
  "Chatbots & AI Assistants",
  "Coding & Development",
  "Marketing & SEO",
  "Productivity",
  "Business & Analytics",
  "Education & Research"
];

const TASKS_SUB = [
  "Content Creation",
  "Image Creation",
  "Video Creation",
  "Audio & Music",
  "Coding & Development",
  "Data Analysis",
  "Research & Summarization",
  "Productivity & Automation",
  "Marketing & Sales",
  "Customer Support"
];

const COMPANIES_SUB = [
  "AI Model Providers",
  "AI Startups",
  "Enterprise AI",
  "Healthcare AI",
  "Finance AI",
  "Marketing AI",
  "Developer Tools",
  "Robotics & Automation",
  "Education AI",
  "Creative AI"
];

const NEWS_SUB = [
  "AI Industry News",
  "Product Launches",
  "Research & Innovations",
  "Company Updates",
  "Open Source",
  "Regulations & Policy",
  "Events & Conferences",
  "Tutorials & Guides",
  "Interviews & Opinions",
  "Market Trends"
];

const VIDEOS_SUB = [
  "Product Demos",
  "Tutorials",
  "AI News & Updates",
  "Model Showcases",
  "Podcasts & Interviews",
  "Webinars & Workshops",
  "Conferences & Events",
  "Case Studies",
  "Reviews & Comparisons",
  "Educational Content"
];

const ROBOTS_SUB = [
  "Humanoid Robots",
  "Industrial Robots",
  "Service Robots",
  "Healthcare Robots",
  "Educational Robots",
  "Autonomous Mobile Robots (AMRs)",
  "Drones & Aerial Robots",
  "Companion Robots",
  "Agricultural Robots",
  "Research & Defense Robots"
];

const DEVICES_SUB = [
  "AI PCs & Laptops",
  "Smartphones",
  "Smart Home Devices",
  "Wearables",
  "AI Cameras",
  "Audio Devices",
  "AR/VR & Mixed Reality",
  "Edge AI Devices",
  "Robotics Hardware",
  "Development Boards"
];

const MODELS_SUB = [
  "Large Language Models (LLMs)",
  "Image Generation Models",
  "Video Generation Models",
  "Audio & Speech Models",
  "Multimodal Models",
  "Code Generation Models",
  "Embedding Models",
  "Reasoning Models",
  "Vision Models",
  "Open Source Models"
];

const REPOSITORIES_SUB = [
  "Large Language Models (LLMs)",
  "Computer Vision",
  "Generative AI",
  "AI Frameworks & Libraries",
  "NLP (Natural Language Processing)",
  "Robotics & Automation",
  "MLOps & Deployment",
  "Data Science & Analytics",
  "AI Agents",
  "Tutorials & Examples"
];

const MCP_SUB = [
  "Official MCP Servers",
  "Developer Tools",
  "Databases",
  "File Systems & Storage",
  "Productivity & Office",
  "APIs & Web Services",
  "Cloud & DevOps",
  "AI & ML Platforms",
  "Browser & Web Automation",
  "Community & Open Source"
];

const COLLECTIONS_SUB = [
  "Featured Collections",
  "Productivity Collections",
  "Creative Collections",
  "Developer Collections",
  "Business Collections",
  "Education Collections",
  "Industry Collections",
  "Open Source Collections",
  "Trending Collections",
  "New Collections"
];

const PERSONAL_SUB = [
  "Productivity",
  "Chatbots",
  "Writing",
  "Audio",
  "Customer Support",
  "Video",
  "Image Generation",
  "Marketing"
];

const CREATIVITY_SUB = [
  "Image Generation",
  "Video",
  "Audio",
  "Marketing",
  "Design",
  "Productivity",
  "Chatbots",
  "Customer Support"
];

const SUBCATEGORY_SLUG_MAP: Record<string, string> = {
  "writingcontent": "productivity",
  "imagegeneration": "image-generation",
  "videogenerationediting": "video",
  "audiovoice": "audio",
  "chatbotsaiassistants": "chatbots",
  "codingdevelopment": "productivity",
  "marketingseo": "marketing",
  "productivity": "productivity",
  "businessanalytics": "productivity",
  "educationresearch": "chatbots",
  "contentcreation": "productivity",
  "imagecreation": "image-generation",
  "videocreation": "video",
  "audiomusic": "audio",
  "dataanalysis": "productivity",
  "researchsummarization": "chatbots",
  "productivityautomation": "productivity",
  "marketingsales": "marketing",
  "customersupport": "customer-support",
  "largelanguagemodelsllms": "chatbots",
  "imagegenerationmodels": "image-generation",
  "videogenerationmodels": "video",
  "audiospeechmodels": "audio",
  "multimodalmodels": "chatbots",
  "codegenerationmodels": "productivity",
  "embeddingmodels": "productivity",
  "reasoningmodels": "chatbots",
  "visionmodels": "image-generation",
  "opensourcemodels": "productivity",
  "aimodelproviders": "chatbots",
  "aistartups": "productivity",
  "enterpriseai": "productivity",
  "healthcareai": "customer-support",
  "financeai": "productivity",
  "marketingai": "marketing",
  "developertools": "productivity",
  "roboticsautomation": "productivity",
  "educationai": "productivity",
  "creativeai": "image-generation",
  "aiindustrynews": "productivity",
  "productlaunches": "productivity",
  "productlunch": "productivity",
  "researchinnovations": "chatbots",
  "companyupdates": "productivity",
  "opensource": "productivity",
  "regulationspolicy": "productivity",
  "eventsconferences": "productivity",
  "tutorialsguides": "productivity",
  "interviewsopinions": "chatbots",
  "markettrends": "marketing",
  "productdemos": "video",
  "tutorials": "video",
  "ainewsupdates": "video",
  "modelshowcases": "video",
  "podcastsinterviews": "video",
  "webinarsworkshops": "video",
  "conferencesevents": "video",
  "casestudies": "video",
  "reviewscomparisons": "video",
  "educationalcontent": "video",
  "computervision": "image-generation",
  "generativeai": "image-generation",
  "aiframeworkslibraries": "productivity",
  "nlpnaturallanguageprocessing": "chatbots",
  "mlopsdeployment": "productivity",
  "datascienceanalytics": "productivity",
  "aiagents": "chatbots",
  "tutorialsexamples": "productivity",
  "humanoidrobots": "chatbots",
  "industrialrobots": "productivity",
  "servicerobots": "customer-support",
  "healthcarerobots": "customer-support",
  "educationalrobots": "productivity",
  "autonomousmobilerobotsamrs": "productivity",
  "dronesaerialrobots": "video",
  "companionrobots": "chatbots",
  "agriculturalrobots": "productivity",
  "researchdefenserobots": "productivity",
  "officialmcpservers": "productivity",
  "databases": "productivity",
  "filesystemsstorage": "productivity",
  "productivityoffice": "productivity",
  "apiswebservices": "productivity",
  "clouddevops": "productivity",
  "aimlplatforms": "productivity",
  "browserwebautomation": "productivity",
  "communityopensource": "productivity",
  "aipclaptops": "productivity",
  "smartphones": "productivity",
  "smarthomedevices": "productivity",
  "wearables": "audio",
  "aicameras": "video",
  "audiodevices": "audio",
  "arvrmixedreality": "video",
  "edgeaidevices": "productivity",
  "roboticshardware": "productivity",
  "developmentboards": "productivity",
  "featuredcollections": "productivity",
  "productivitycollections": "productivity",
  "creativecollections": "image-generation",
  "developercollections": "productivity",
  "businesscollections": "productivity",
  "educationcollections": "productivity",
  "industrycollections": "productivity",
  "opensourcecollections": "productivity",
  "trendingcollections": "productivity",
  "newcollections": "productivity",
  "writing": "productivity",
  "design": "image-generation"
};

function formatSubcategoryPath(name: string): string {
  if (name === "Product Launches") return "productlunch";
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function getSubcategoriesAndColor(mode: DirectoryMode) {
  switch (mode) {
    case 'tools': return { list: TOOLS_SUB, color: "#FFC53D" };
    case 'tasks': return { list: TASKS_SUB, color: "#FB923C" };
    case 'companies': return { list: COMPANIES_SUB, color: "#38BDF8" };
    case 'news': return { list: NEWS_SUB, color: "#FF6B4A" };
    case 'videos': return { list: VIDEOS_SUB, color: "#F87171" };
    case 'robots': return { list: ROBOTS_SUB, color: "#2DD4BF" };
    case 'devices': return { list: DEVICES_SUB, color: "#F472B6" };
    case 'models': return { list: MODELS_SUB, color: "#A78BFA" };
    case 'repositories': return { list: REPOSITORIES_SUB, color: "#22D3EE" };
    case 'mcp': return { list: MCP_SUB, color: "#818CF8" };
    case 'collections': return { list: COLLECTIONS_SUB, color: "#34D399" };
    case 'personal': return { list: PERSONAL_SUB, color: "#FBBF24" };
    case 'creativity': return { list: CREATIVITY_SUB, color: "#E879F9" };
  }
}
import Search from 'lucide-react/dist/esm/icons/search';
import Wrench from 'lucide-react/dist/esm/icons/wrench';
import ListChecks from 'lucide-react/dist/esm/icons/list-checks';
import Cpu from 'lucide-react/dist/esm/icons/cpu';
import Building2 from 'lucide-react/dist/esm/icons/building-2';
import FolderHeart from 'lucide-react/dist/esm/icons/folder-heart';
import Newspaper from 'lucide-react/dist/esm/icons/newspaper';
import GitBranch from 'lucide-react/dist/esm/icons/git-branch';
import Smartphone from 'lucide-react/dist/esm/icons/smartphone';
import Bot from 'lucide-react/dist/esm/icons/bot';
import Plug from 'lucide-react/dist/esm/icons/plug';
import PlayCircle from 'lucide-react/dist/esm/icons/play-circle';
import UserCircle from 'lucide-react/dist/esm/icons/user-circle';
import Palette from 'lucide-react/dist/esm/icons/palette';
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up';
import Trophy from 'lucide-react/dist/esm/icons/trophy';

import { API_URL } from "@/lib/api";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroFeatureChips } from "@/components/HeroFeatureChips";
import { SortDropdown } from "@/components/SortDropdown";
import { ToolListView } from "@/components/ToolListView";
import { ENTITY_META } from "@/lib/entityMeta";

import type { SortOption } from "@/lib/types";

// Top-of-menu quick actions for the homepage hero search dropdown.
const QUICK_LINKS = [
  { label: "Trending", href: "/search/trending", icon: TrendingUp },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
];

// "Browse by type" — mirrors the entity types the backend indexes.
const BROWSE_BY_TYPE = [
  { label: ENTITY_META.company.label, href: ENTITY_META.company.basePath, icon: ENTITY_META.company.icon },
  { label: ENTITY_META.model.label, href: ENTITY_META.model.basePath, icon: ENTITY_META.model.icon },
  { label: ENTITY_META.robot.label, href: ENTITY_META.robot.basePath, icon: ENTITY_META.robot.icon },
  { label: ENTITY_META.repository.label, href: ENTITY_META.repository.basePath, icon: ENTITY_META.repository.icon },
  { label: ENTITY_META.device.label, href: ENTITY_META.device.basePath, icon: ENTITY_META.device.icon },
];

const DIRECTORY_CARDS = [
  { name: "Tools", href: "/tools", description: "Browse the full AI tools directory, filter by category and pricing.", icon: Wrench, color: "#FFC53D" },
  { name: "Tasks", href: "/tasks", description: "Find the right AI tool for a specific job to be done.", icon: ListChecks, color: "#FB923C" },
  { name: "Companies", href: "/companies", description: "Explore the labs and startups building the AI ecosystem.", icon: Building2, color: "#38BDF8" },
  { name: "News", href: "/news", description: "The latest announcements and coverage across the AI world.", icon: Newspaper, color: "#FF6B4A" },
  { name: "Videos", href: "/videos", description: "Watch demos, reviews, and deep dives on the latest AI tools.", icon: PlayCircle, color: "#F87171" },
  { name: "Robots", href: "/robots", description: "Robotics platforms and the companies behind them.", icon: Bot, color: "#2DD4BF" },
  { name: "Devices", href: "/devices", description: "Hardware built for and powered by AI.", icon: Smartphone, color: "#F472B6" },
  { name: "Models", href: "/models", description: "Compare context windows, pricing, and benchmarks across AI models.", icon: Cpu, color: "#A78BFA" },
  { name: "Repositories", href: "/repositories", description: "Trending open-source AI repositories on GitHub.", icon: GitBranch, color: "#22D3EE" },
  { name: "MCP", href: "/tools", description: "Model Context Protocol servers and integrations.", icon: Plug, color: "#818CF8" },
  { name: "Collections", href: "/collections", description: "Curated bundles of tools grouped by use case.", icon: FolderHeart, color: "#34D399" },
  { name: "Personal", href: "/personal", description: "AI tools for personal productivity and everyday life.", icon: UserCircle, color: "#FBBF24" },
  { name: "Creativity", href: "/creativity", description: "AI tools for art, design, writing, and creative work.", icon: Palette, color: "#E879F9" },
] as const;

interface HomeClientProps {
  defaultMode?: DirectoryMode;
}

export function HomeClient({ defaultMode }: HomeClientProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const routeParams = useParams();

  const activeSubcategoryPath = routeParams?.category as string | undefined;

  const [expandedMode] = useState<DirectoryMode | null>(defaultMode || null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | undefined>(activeSubcategoryPath);

  useEffect(() => {
    setActiveSubcategory(activeSubcategoryPath);
  }, [activeSubcategoryPath]);

  const [tools, setTools] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLFormElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const sentinelRef = useRef<HTMLDivElement>(null);


  // Close the search dropdown on outside click or Escape.
  useEffect(() => {
    if (!searchOpen) return;
    function handleClick(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSearchOpen(false);
        searchInputRef.current?.blur();
      }
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [searchOpen]);

  // ⌘K / Ctrl+K opens the homepage search dropdown.
  useEffect(() => {
    function handleShortcut(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
        searchInputRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, []);

  const categoryParam = activeSubcategory ? (SUBCATEGORY_SLUG_MAP[activeSubcategory] || activeSubcategory) : undefined;

  // Build params object from URL search params
  const params = {
    q: searchParams.get("q") || undefined,
    category: categoryParam || searchParams.get("category") || undefined,
    pricing: searchParams.get("pricing") || undefined,
    sort: (searchParams.get("sort") || undefined) as SortOption | undefined,
  };

  const filterKey = `${params.q || ''}-${params.category || ''}-${params.pricing || ''}-${params.sort || ''}`;

  // Reset page and tools when filters change
  useEffect(() => {
    setTools([]);
    setPage(1);
    setTotalPages(1);
  }, [filterKey]);

  useEffect(() => {
    async function fetchData() {
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsFetchingMore(true);
      }
      try {
        const query = new URLSearchParams();
        if (params.q) query.set("q", params.q);
        if (params.category) query.set("category", params.category);
        if (params.pricing) query.set("pricing", params.pricing);
        if (params.sort) query.set("sort", params.sort);
        query.set("page", page.toString());

        const toolsRes = await fetch(`${API_URL}/api/v1/tools?${query.toString()}`);

        if (toolsRes.ok) {
          const toolsData = await toolsRes.json();
          if (page === 1) {
            setTools(toolsData.tools || []);
          } else {
            setTools(prev => [...prev, ...(toolsData.tools || [])]);
          }
          setTotalPages(toolsData.totalPages || 1);
        }
      } catch (error) {
        console.error("Failed to fetch homepage data:", error);
      } finally {
        setIsLoading(false);
        setIsFetchingMore(false);
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey, page]);

  // IntersectionObserver for endless scrolling
  useEffect(() => {
    if (isLoading || isFetchingMore || page >= totalPages) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage(prev => prev + 1);
      }
    }, { threshold: 0.1 });

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [isLoading, isFetchingMore, page, totalPages]);

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white selection:bg-neutral-800 selection:text-white overflow-x-hidden">
      {/* 1. Sticky Header */}
      <Header />

      {/* 2. Hero Section */}
      <section
        className="relative w-full flex flex-col items-center pt-4 pb-6 px-6"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(35, 35, 38, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(35, 35, 38, 0.08) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      >
        {/* ambient signal glow behind headline — clipped in its own layer so it
            can't push the page width out on narrow viewports, independent of
            the section (which must stay unclipped for the search dropdown) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-[0.12] blur-[100px]"
            style={{ backgroundColor: 'var(--color-signal)' }}
          />
        </div>

        <div className="mx-auto max-w-[1440px] w-full flex flex-col items-center text-center relative z-10">
          <h1 className="max-w-[820px] text-2xl sm:text-4xl lg:text-[44px] font-black tracking-tight leading-[1.1] mb-4 sm:mb-6 select-none text-white text-balance">
            The Home of Everything AI
          </h1>

          <form
            action="/tools"
            method="GET"
            ref={searchContainerRef}
            className="relative w-full max-w-[520px] mx-auto mb-4 sm:mb-5 group"
          >
            <div
              className="relative w-full rounded-xl border border-[#232326]/70 bg-[#111113] h-[38px] sm:h-[42px] flex items-center px-3.5 sm:px-4 pr-[4.5rem] transition-colors duration-150"
              style={{ borderColor: undefined }}
            >
              <Search size={13} className="mr-2 sm:mr-2.5 text-[#71717A] shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                name="q"
                defaultValue={params.q}
                placeholder="Search AI tools, models, companies…"
                onFocus={() => setSearchOpen(true)}
                className="w-full bg-transparent text-[12px] sm:text-[13px] text-white placeholder:text-[#71717A] focus:outline-none"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-0.5 rounded-md border border-[#232326]/60 bg-[#18181C] px-1.5 font-mono text-[10px] text-[#71717A] pointer-events-none">
                  <span>⌘</span>K
                </kbd>
              </div>
            </div>
            <style jsx>{`
              form:focus-within > div {
                border-color: var(--color-signal) !important;
                box-shadow: 0 0 0 3px var(--color-signal-dim);
              }
            `}</style>

            {searchOpen && (
              <div className="search-scope absolute left-0 right-0 top-[calc(100%+8px)] z-30 max-h-[70vh] overflow-y-auto rounded-xl border border-search-border bg-search-bg shadow-2xl shadow-black/40 text-left">
                <div className="border-b border-search-border p-2">
                  {QUICK_LINKS.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-3 rounded-md px-2.5 py-2 text-sm text-search-text-primary hover:bg-search-surface-hover"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-search-surface-active text-search-text-secondary">
                          <Icon size={14} />
                        </span>
                        {link.label}
                      </Link>
                    );
                  })}
                </div>

                <div className="p-2">
                  <div className="px-2 py-2 text-center text-[11px] font-medium uppercase tracking-wide text-search-text-tertiary">
                    Browse by type
                  </div>
                  {BROWSE_BY_TYPE.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-3 rounded-md px-2.5 py-2 text-sm text-search-text-primary hover:bg-search-surface-hover"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-search-surface-active text-search-text-secondary">
                          <Icon size={14} />
                        </span>
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </form>

          <div className="mb-3">
            <HeroFeatureChips />
          </div>
        </div>
      </section>

      <div className="border-b border-[#232326]/40 w-full z-10 relative" />

      {/* Sort control — now sits above the directory nav strip */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-4">
        <div className="mx-auto w-full max-w-[1600px] flex justify-end">
          <SortDropdown />
        </div>
      </div>

      {/* Directory nav strip — single row, evenly spread, sits just above the tools list */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-2 pb-1">
        <div className="mx-auto w-full max-w-[1600px]">
          <div className="flex flex-nowrap items-stretch gap-1.5 sm:gap-2 overflow-x-auto">
            {DIRECTORY_CARDS.map((card) => {
              const Icon = card.icon;
              const mode = card.name.toLowerCase() as DirectoryMode;
              const isSelected = expandedMode === mode;

              return (
                <Link
                  key={card.name}
                  href={card.href}
                  className="group flex flex-1 min-w-[76px] sm:min-w-[92px] shrink-0 flex-row items-center justify-center gap-1.5 sm:gap-2 rounded-lg border border-[#232326]/60 bg-[#0d0d10] px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-center transition-colors duration-200"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = card.color;
                    e.currentTarget.style.boxShadow = `0 0 0 1px ${card.color}, 0 8px 20px -6px ${card.color}55`;
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = "";
                      e.currentTarget.style.boxShadow = "";
                    }
                  }}
                  style={
                    isSelected
                      ? { borderColor: card.color, boxShadow: `0 0 0 1px ${card.color}, 0 8px 20px -6px ${card.color}55` }
                      : undefined
                  }
                >
                  <div
                    className="flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-md border"
                    style={{ backgroundColor: `${card.color}1a`, borderColor: `${card.color}40` }}
                  >
                    <Icon size={10} strokeWidth={1.75} style={{ color: card.color }} />
                  </div>
                  <span className="text-[9px] sm:text-[10.5px] font-bold tracking-tight text-white whitespace-nowrap">
                    {card.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>



      {/* Tools Section — full width so the data table can use the whole screen */}
      <div id="tools" className="scroll-mt-28 w-full px-4 sm:px-6 lg:px-8 pt-8 pb-2">
        <div className="mx-auto w-full max-w-[1600px] space-y-3">
          {/* Top Sliding Category Row for Tools */}
          {expandedMode === "tools" && (
            <div className="mb-8 flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-3 scrollbar-none w-full">
              {["All", "Writing", "Image Generation", "Video Generation", "Audio", "Chatbots", "Coding", "Marketing", "Productivity", "Business", "Education"].map((topic) => {
                const slugMap: Record<string, string> = {
                  "All": "",
                  "Writing": "writing",
                  "Image Generation": "image-generation",
                  "Video Generation": "video",
                  "Audio": "audio",
                  "Chatbots": "chatbots",
                  "Coding": "coding",
                  "Marketing": "marketing",
                  "Productivity": "productivity",
                  "Business": "business",
                  "Education": "education"
                };
                const slug = slugMap[topic];
                const currentCategory = searchParams.get("category") || "";
                const isSelected = currentCategory === slug;

                return (
                  <button
                    key={topic}
                    onClick={(e) => {
                      const newParams = new URLSearchParams(window.location.search);
                      if (slug) {
                        newParams.set("category", slug);
                      } else {
                        newParams.delete("category");
                      }
                      newParams.set("page", "1");
                      router.push(`/tools?${newParams.toString()}`);
                      
                      e.currentTarget.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest",
                        inline: "center"
                      });
                    }}
                    className={`rounded-full px-4 py-1.5 text-[11.5px] font-bold whitespace-nowrap transition-all duration-200 border ${
                      isSelected
                        ? "bg-white text-black border-white shadow-lg shadow-white/5"
                        : "text-neutral-400 hover:text-white bg-[#131316]/50 border-white/[0.05] hover:border-white/[0.15]"
                    }`}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>
          )}

          <ToolListView
            tools={tools}
            loading={isLoading && page === 1}
          />

          {/* Sentinel for infinite scroll */}
          {tools.length > 0 && page < totalPages && (
            <div ref={sentinelRef} className="h-20 flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            </div>
          )}
        </div>
      </div>

      {/* 4. Footer */}
      <Footer />
    </div>
  );
}