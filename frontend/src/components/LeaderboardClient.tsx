"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ArrowUpRight from 'lucide-react/dist/esm/icons/arrow-up-right';
import Star from 'lucide-react/dist/esm/icons/star';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import Bookmark from 'lucide-react/dist/esm/icons/bookmark';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import Building from 'lucide-react/dist/esm/icons/building';
import Play from 'lucide-react/dist/esm/icons/play';
import Brain from 'lucide-react/dist/esm/icons/brain';
import Globe from 'lucide-react/dist/esm/icons/globe';
import { cn } from "@/lib/utils";
import { fetchLeaderboardTools, fetchLeaderboardModels, fetchLeaderboardCompanies } from "@/lib/api";

type LeaderboardTool = {
  id: string;
  name: string;
  category: string;
  tags: string;
  rank: number;
  growth: number;
  votes: number;
  rating: number;
  saves: number;
  url: string;
  description: string;
  pricing: string;
  visits: string;
  addedDate: string;
  logoUrl?: string;
};

type LeaderboardModel = {
  id: string;
  name: string;
  provider: string;
  category: string;
  rank: number;
  growth: number;
  contextWindow: string;
  pricing: string;
  eloRating: number;
  benchmarkScore: number;
  openSource: boolean;
  votes: number;
  rating: number;
  saves: number;
  description: string;
  visits: string;
  logoUrl?: string;
};

type LeaderboardCompany = {
  id: string;
  name: string;
  rank: number;
  growth: number;
  funding: string;
  headquarters: string;
  productsCount: number;
  modelsCount: number;
  votes: number;
  rating: number;
  saves: number;
  description: string;
  visits: string;
  logoUrl?: string;
};

// Hindi Translation dictionary
const t: Record<string, Record<string, string>> = {
  en: {
    title: "AI SIGNAL",
    aiTools: "AI Tools",
    aiModels: "AI Models",
    aiCompanies: "AI Companies",
    bookmarks: "Bookmarks",
    english: "English",
    hindi: "Hindi",
    login: "Login",
    filter: "FILTER:",
    sortBy: "Sort by:",
    rank: "Rank",
    tool: "Tool",
    model: "Model",
    company: "Company",
    tags: "Tags",
    monthlyVisits: "Monthly Visits",
    context: "Context",
    monthlyHits: "Monthly Hits",
    products: "Products",
    monthlyTraffic: "Monthly Traffic",
    growth: "Growth",
    action: "Action",
    visit: "Visit",
    explore: "Explore",
    view: "View",
    loading: "Loading Leaderboard...",
    allCategories: "All Categories",
    "Audio & Voice": "Audio & Voice",
    "Chatbot": "Chatbot",
    "Code Assistant": "Code Assistant",
    "Copywriting": "Copywriting",
    "Data Analysis": "Data Analysis",
    "Image Generation": "Image Generation",
    "Productivity": "Productivity",
    "Search & Answer": "Search & Answer",
    "Translation": "Translation",
    "UI/UX Design": "UI/UX Design",
    "Video Editing": "Video Editing",
    "Code Model": "Code Model",
    "LLM": "LLM",
    "Multi-modal": "Multi-modal",
    "Multimodal": "Multimodal",
    "Reasoning LLM": "Reasoning LLM",
    sortRank: "Sort by: Rank",
    sortVisits: "Sort by: Monthly Visits",
    sortGrowth: "Sort by: Growth",
    sortNewest: "Sort by: Newest",
  },
  hi: {
    title: "एआई सिग्नल",
    aiTools: "एआई टूल्स",
    aiModels: "एआई मॉडल्स",
    aiCompanies: "एआई कंपनियाँ",
    bookmarks: "बुकमार्क",
    english: "English",
    hindi: "हिंदी",
    login: "लॉगिन",
    filter: "फ़िल्टर:",
    sortBy: "सॉर्ट करें:",
    rank: "रैंक",
    tool: "टूल",
    model: "मॉडल",
    company: "कंपनी",
    tags: "टैग",
    monthlyVisits: "मासिक विज़िट",
    context: "कॉन्टेक्स्ट",
    monthlyHits: "मासिक हिट्स",
    products: "प्रोडक्ट्स",
    monthlyTraffic: "मासिक ट्रैफ़िक",
    growth: "ग्रोथ",
    action: "एक्शन",
    visit: "विज़िट",
    explore: "एक्सप्लोर",
    view: "देखें",
    loading: "लीडरबोर्ड लोड हो रहा है...",
    allCategories: "सभी श्रेणियाँ",
    "Audio & Voice": "ऑडियो और आवाज़",
    "Chatbot": "चैटबॉट",
    "Code Assistant": "कोड असिस्टेंट",
    "Copywriting": "कॉपीराइटिंग",
    "Data Analysis": "डेटा विश्लेषण",
    "Image Generation": "इमेज जनरेशन",
    "Productivity": "उत्पादकता",
    "Search & Answer": "खोज और उत्तर",
    "Translation": "अनुवाद",
    "UI/UX Design": "यूआई/यूएक्स डिज़ाइन",
    "Video Editing": "वीडियो एडिटिंग",
    "Code Model": "कोड मॉडल",
    "LLM": "एलएलएम",
    "Multi-modal": "मल्टी-मॉडल",
    "Multimodal": "मल्टीमॉडल",
    "Reasoning LLM": "रीजनिंग एलएलएम",
    sortRank: "सॉर्ट करें: रैंक",
    sortVisits: "सॉर्ट करें: मासिक विज़िट",
    sortGrowth: "सॉर्ट करें: ग्रोथ",
    sortNewest: "सॉर्ट करें: नया",
  }
};

export function LeaderboardClient() {
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [activeTab, setActiveTab] = useState<"tools" | "models" | "companies" | "bookmarks">("tools");
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("Rank");

  const [tools, setTools] = useState<LeaderboardTool[]>([]);
  const [models, setModels] = useState<LeaderboardModel[]>([]);
  const [companies, setCompanies] = useState<LeaderboardCompany[]>([]);
  const [loading, setLoading] = useState(true);

  // Local bookmarks set
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  // Get current active categories based on active tab
  const getCategoriesForTab = () => {
    if (activeTab === "tools" || activeTab === "bookmarks") {
      return [
        "All Categories",
        "Audio & Voice",
        "Chatbot",
        "Code Assistant",
        "Copywriting",
        "Data Analysis",
        "Image Generation",
        "Productivity",
        "Search & Answer",
        "Translation",
        "UI/UX Design",
        "Video Editing",
      ];
    } else if (activeTab === "models") {
      return [
        "All Categories",
        "Code Model",
        "LLM",
        "Multi-modal",
        "Multimodal",
        "Reasoning LLM",
      ];
    } else {
      return [
        "All Categories",
      ];
    }
  };

  // Helper to parse Traffic values e.g. "28.5M" -> 28500000, "3.8B" -> 3800000000
  const parseTraffic = (val: string): number => {
    if (!val) return 0;
    const clean = val.replace(/[^0-9.]/g, "");
    const num = parseFloat(clean);
    if (val.toUpperCase().includes("B")) return num * 1000000000;
    if (val.toUpperCase().includes("M")) return num * 1000000;
    if (val.toUpperCase().includes("K")) return num * 1000;
    return num;
  };

  // Toggle bookmark in local state
  const toggleLocalBookmark = (id: string) => {
    const next = new Set(bookmarkedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setBookmarkedIds(next);
  };

  // Load initial data
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [toolsData, modelsData, companiesData] = await Promise.all([
          fetchLeaderboardTools(),
          fetchLeaderboardModels(),
          fetchLeaderboardCompanies(),
        ]);
        setTools(toolsData);
        setModels(modelsData);
        setCompanies(companiesData);

        // Pre-bookmark first few items for demonstration
        if (toolsData.length > 0) {
          setBookmarkedIds(new Set([toolsData[0].id, toolsData[2].id]));
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter tools and models by category
  const getFilteredTools = () => {
    let list = tools;
    if (activeTab === "bookmarks") {
      list = tools.filter((t) => bookmarkedIds.has(t.id));
    }

    const filtered = list.filter((t) => {
      if (activeCategory === "All Categories") return true;
      const categoryMapping: Record<string, string> = {
        "Audio & Voice": "Audio",
        "Chatbot": "Chatbots",
        "Code Assistant": "Coding",
        "Copywriting": "Writing",
        "Image Generation": "Image Generation",
        "Productivity": "Productivity",
        "Video Editing": "Video",
      };
      const target = categoryMapping[activeCategory] || activeCategory;
      return t.category.toLowerCase().includes(target.toLowerCase());
    });

    // Apply Sorting logic
    return [...filtered].sort((a, b) => {
      if (sortBy === "Rank") return a.rank - b.rank;
      if (sortBy === "Growth") return b.growth - a.growth;
      if (sortBy === "Monthly Visits") return parseTraffic(b.visits) - parseTraffic(a.visits);
      if (sortBy === "Newest") return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
      return 0;
    });
  };

  const matchModelCategory = (m: any, target: string): boolean => {
    const cat = m.category.toLowerCase();
    const name = m.name.toLowerCase();
    const desc = m.description.toLowerCase();
    
    if (target === "Code Model") {
      return cat.includes("code") || name.includes("code") || name.includes("coder");
    }
    if (target === "LLM") {
      return cat.includes("text");
    }
    if (target === "Multi-modal" || target === "Multimodal") {
      return cat.includes(",") || cat.includes("vision") || cat.includes("audio") || desc.includes("multimodal");
    }
    if (target === "Reasoning LLM") {
      return desc.includes("reasoning") || name.includes("reasoning") || name.startsWith("o1");
    }
    return cat.includes(target.toLowerCase());
  };

  const getFilteredModels = () => {
    const filtered = models.filter((m) => {
      if (activeCategory === "All Categories") return true;
      return matchModelCategory(m, activeCategory);
    });

    // Apply Sorting logic
    return [...filtered].sort((a, b) => {
      if (sortBy === "Rank") return a.rank - b.rank;
      if (sortBy === "Growth") return b.growth - a.growth;
      if (sortBy === "Monthly Visits") return parseTraffic(b.visits) - parseTraffic(a.visits);
      return 0;
    });
  };

  const getFilteredCompanies = () => {
    // Apply Sorting logic
    return [...companies].sort((a, b) => {
      if (sortBy === "Rank") return a.rank - b.rank;
      if (sortBy === "Growth") return b.growth - a.growth;
      if (sortBy === "Monthly Visits") return parseTraffic(b.visits) - parseTraffic(a.visits);
      return 0;
    });
  };

  // Get live count of items for each category pill dynamically
  const getCountForCategory = (catName: string): number | null => {
    if (catName === "All Categories") return null;
    const categoryMapping: Record<string, string> = {
      "Audio & Voice": "Audio",
      "Chatbot": "Chatbots",
      "Code Assistant": "Coding",
      "Copywriting": "Writing",
      "Image Generation": "Image Generation",
      "Productivity": "Productivity",
      "Video Editing": "Video",
    };
    const target = categoryMapping[catName] || catName;

    if (activeTab === "tools" || activeTab === "bookmarks") {
      const list = activeTab === "bookmarks" ? tools.filter((t) => bookmarkedIds.has(t.id)) : tools;
      return list.filter((t) => t.category.toLowerCase().includes(target.toLowerCase())).length;
    } else if (activeTab === "models") {
      return models.filter((m) => matchModelCategory(m, catName)).length;
    }
    return null;
  };

  // Dynamic label translator
  const _ = (key: string) => {
    return t[lang][key] || key;
  };

  // Render Rank with Gold, Silver, Bronze badges (numbers in white!)
  const renderRankBadge = (rankNum: number) => {
    if (rankNum === 1) {
      return (
        <span className="inline-flex items-center gap-1 font-bold text-xs select-none">
          <span>🥇</span>
          <span className="text-white">#1</span>
        </span>
      );
    }
    if (rankNum === 2) {
      return (
        <span className="inline-flex items-center gap-1 font-bold text-xs select-none">
          <span>🥈</span>
          <span className="text-white">#2</span>
        </span>
      );
    }
    if (rankNum === 3) {
      return (
        <span className="inline-flex items-center gap-1 font-bold text-xs select-none">
          <span>🥉</span>
          <span className="text-white">#3</span>
        </span>
      );
    }
    return <span className="text-[#71717A] text-xs font-semibold">#{rankNum}</span>;
  };

  // Safe Tags parsing
  const renderTags = (tagsStr: string) => {
    let tagList: string[] = [];
    if (tagsStr) {
      try {
        const parsed = JSON.parse(tagsStr);
        tagList = Array.isArray(parsed) ? parsed : [parsed.toString()];
      } catch {
        tagList = tagsStr.split(",").map((t) => t.trim());
      }
    }
    return (
      <div className="flex flex-row flex-nowrap gap-1.5 overflow-hidden max-w-[200px]">
        {tagList.slice(0, 2).map((tag) => (
          <span key={tag} className="px-2 py-0.5 rounded bg-[#18181C] text-[10px] text-[#A1A1AA] border border-[#232326] whitespace-nowrap">
            {tag}
          </span>
        ))}
      </div>
    );
  };

  // Comprehensive real-tool logo domain map
  const LOGO_DOMAIN_MAP: Record<string, string> = {
    "chatgpt": "openai.com", "openai": "openai.com", "gpt-4": "openai.com",
    "gpt-4o": "openai.com", "gpt-3.5": "openai.com", "dall-e": "openai.com", "dalle": "openai.com",
    "o1-": "openai.com", "o3-": "openai.com", "o4-": "openai.com", "gpt-": "openai.com",
    "claude": "anthropic.com", "anthropic": "anthropic.com",
    "gemini": "google.com", "google": "google.com", "deepmind": "google.com", "bard": "google.com", "gemma": "google.com",
    "llama": "meta.com", "meta ai": "meta.com",
    "mistral": "mistral.ai", "mixtral": "mistral.ai", "le chat": "mistral.ai",
    "cohere": "cohere.com", "command r": "cohere.com",
    "ai21": "ai21.com", "jamba": "ai21.com", "jurassic": "ai21.com",
    "deepseek": "deepseek.com",
    "grok": "x.ai", "xai": "x.ai",
    "qwen": "alibabacloud.com", "alibaba": "alibabacloud.com",
    "groq": "groq.com",
    "together ai": "together.ai", "together": "together.ai",
    "replicate": "replicate.com",
    "hugging face": "huggingface.co", "huggingface": "huggingface.co",
    "perplexity": "perplexity.ai",
    "inflection": "inflection.ai",
    "zhipu": "zhipuai.cn", "chatglm": "zhipuai.cn",
    "moonshot": "moonshot.cn", "kimi": "moonshot.cn",
    "baidu": "baidu.com", "ernie": "baidu.com",
    "cursor": "cursor.com",
    "github copilot": "github.com", "copilot": "github.com",
    "replit": "replit.com",
    "tabnine": "tabnine.com",
    "codeium": "codeium.com", "windsurf": "codeium.com",
    "devin": "cognition.ai", "cognition": "cognition.ai",
    "bolt": "bolt.new",
    "lovable": "lovable.dev",
    "v0": "v0.dev",
    "midjourney": "midjourney.com",
    "stable diffusion": "stability.ai", "stability": "stability.ai", "dreamstudio": "stability.ai",
    "leonardo": "leonardo.ai",
    "adobe firefly": "adobe.com", "firefly": "adobe.com", "adobe": "adobe.com",
    "craiyon": "craiyon.com",
    "canva": "canva.com",
    "pika": "pika.art",
    "kling": "klingai.com",
    "haiper": "haiper.ai",
    "runway": "runwayml.com", "runwayml": "runwayml.com", "gen-3": "runwayml.com",
    "elevenlabs": "elevenlabs.io", "eleven labs": "elevenlabs.io",
    "lovo": "lovo.ai", "genny": "lovo.ai",
    "play.ht": "play.ht", "playht": "play.ht",
    "murf": "murf.ai",
    "suno": "suno.com",
    "udio": "udio.com",
    "heygen": "heygen.com",
    "descript": "descript.com",
    "synthesia": "synthesia.io",
    "d-id": "d-id.com",
    "voicemaker": "voicemaker.in",
    "resemble": "resemble.ai",
    "natural readers": "naturalreaders.com",
    "wellsaid": "wellsaidlabs.com",
    "soundraw": "soundraw.io",
    "chatbase": "chatbase.co",
    "framer": "framer.com",
    "screaming frog": "screamingfrog.co.uk",
    "blackbox": "blackbox.ai",
    "cody": "sourcegraph.com",
    "warp": "warp.dev",
    "continue": "continue.dev",
    "sweep": "sweep.dev",
    "sourcery": "sourcery.ai",
    "clipdrop": "clipdrop.co",
    "recraft": "recraft.ai",
    "pixelcut": "pixelcut.ai",
    "remove.bg": "remove.bg", "remove-bg": "remove.bg",
    "playground": "playground.com",
    "nightcafe": "nightcafe.studio",
    "beatoven": "beatoven.ai",
    "ultimate.ai": "ultimate.ai", "ultimate-ai": "ultimate.ai",
    "julius": "julius.ai",
    "harvey": "harvey.ai",
    "feathery": "feathery.io",
    "rewind": "rewind.ai",
    "luma": "lumalabs.ai",
    "jasper": "jasper.ai",
    "copy.ai": "copy.ai", "copyai": "copy.ai",
    "writesonic": "writesonic.com",
    "grammarly": "grammarly.com",
    "notion": "notion.so",
    "beautiful.ai": "beautiful.ai", "beautiful ai": "beautiful.ai",
    "tome": "tome.app",
    "gamma": "gamma.app",
    "figma": "figma.com",
    "otter": "otter.ai",
    "fireflies": "fireflies.ai",
    "mem": "mem.ai",
    "character.ai": "character.ai", "character ai": "character.ai",
    "poe": "poe.com",
    "you.com": "you.com",
    "amazon": "aws.amazon.com", "alexa": "aws.amazon.com", "bedrock": "aws.amazon.com",
    "microsoft": "microsoft.com", "azure": "microsoft.com", "bing": "microsoft.com",
    "apple": "apple.com", "siri": "apple.com",
    "samsung": "samsung.com", "gauss": "samsung.com",
    "nvidia": "nvidia.com",
    "ibm": "ibm.com", "watson": "ibm.com",
    "salesforce": "salesforce.com", "einstein": "salesforce.com",
  };

  const getLogoUrl = (name: string): string => {
    const n = name.toLowerCase().trim();
    if (n.includes("phind")) return "https://avatars.githubusercontent.com/u/144394874?v=4";
    if (n.includes("beatoven")) return "https://avatars.githubusercontent.com/u/85035121?v=4";
    if (n.includes("dreamstudio") || n.includes("stability")) return "https://avatars.githubusercontent.com/u/100950301?v=4";
    if (n.includes("podcastle")) return "https://avatars.githubusercontent.com/u/19472846?v=4";

    for (const [key, domain] of Object.entries(LOGO_DOMAIN_MAP)) {
      if (n === key || n.includes(key)) {
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
      }
    }
    const slug = n.replace(/\s+/g, "").replace(/[^a-z0-9]/g, "");
    return `https://www.google.com/s2/favicons?domain=${slug}.com&sz=128`;
  };

  const resolveLogoUrl = (url: string | undefined | null, name: string) => {
    const n = name.toLowerCase().trim();
    if (
      n.includes("phind") ||
      n.includes("beatoven") ||
      n.includes("dreamstudio") ||
      n.includes("stability") ||
      n.includes("podcastle")
    ) {
      return getLogoUrl(name);
    }

    if (url && url.includes("logo.clearbit.com")) {
      const domain = url.split("logo.clearbit.com/")[1];
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    }
    return url || getLogoUrl(name);
  };

  const getInitials = (name: string) => name.trim().charAt(0).toUpperCase();

  const handleLogoError = (e: React.SyntheticEvent<HTMLImageElement, Event>, name: string) => {
    const target = e.currentTarget;
    // Hide the broken image immediately
    target.style.display = "none";
    const parent = target.parentElement;
    if (parent && !parent.querySelector(".logo-fallback-initial")) {
      const span = document.createElement("span");
      span.className = "logo-fallback-initial";
      span.textContent = getInitials(name);
      span.style.cssText = "display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:18px;font-weight:700;color:#fff;background:linear-gradient(135deg,#1f1f2e,#3b3b4f);border-radius:0px;";
      parent.appendChild(span);
    }
  };

  return (
    <div className="w-full flex flex-col bg-[#000000] text-white selection:bg-neutral-800 selection:text-white min-h-screen">
      {/* Top Header Logo & Navigation Bar */}
      <div className="border-b border-[#1B1B1F] bg-[#000000] sticky top-0 z-50">
        <div className="mx-auto max-w-[1440px] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Exactly AS box Logo from screenshot */}
            <div className="flex h-8 w-8 items-center justify-center rounded bg-white text-black font-black text-sm select-none shadow">
              AS
            </div>
            <span className="text-sm font-black tracking-wider text-white">
              {_("title")}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Language dropdown switch */}
            <div className="relative inline-flex items-center">
              <Globe size={13} className="absolute left-2.5 text-[#71717A] pointer-events-none" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as "en" | "hi")}
                className="appearance-none rounded-lg border border-[#232326] bg-[#131316] pl-7 pr-7 py-1 text-xs font-semibold text-[#A1A1AA] hover:text-white hover:border-neutral-500 focus:outline-none transition-all cursor-pointer h-7"
              >
                <option value="en">{_("english")}</option>
                <option value="hi">{_("hindi")}</option>
              </select>
              <ChevronDown size={11} className="absolute right-2 text-[#71717A] pointer-events-none" />
            </div>

            <button className="rounded-md bg-white px-4 py-1.5 text-xs font-semibold text-black hover:bg-neutral-200 transition-all active:scale-95 whitespace-nowrap">
              {_("login")}
            </button>
          </div>
        </div>
      </div>

      {/* Main Leaderboard Content Frame */}
      <div className="mx-auto max-w-[1440px] w-full px-6 py-6 flex-1 flex flex-col">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2.5 border-b border-[#1B1B1F] pb-4 mb-6">
          <button
            onClick={() => {
              setActiveTab("tools");
              setActiveCategory("All Categories");
            }}
            className={cn(
              "px-4 py-2 text-xs font-bold rounded-lg border transition-all active:scale-95 flex items-center gap-1.5",
              activeTab === "tools"
                ? "bg-[#131316] text-white border-neutral-500 shadow-md"
                : "bg-transparent border-transparent text-[#71717A] hover:text-white"
            )}
          >
            <Brain size={13} />
            {_("aiTools")}
          </button>
          <button
            onClick={() => {
              setActiveTab("models");
              setActiveCategory("All Categories");
            }}
            className={cn(
              "px-4 py-2 text-xs font-bold rounded-lg border transition-all active:scale-95 flex items-center gap-1.5",
              activeTab === "models"
                ? "bg-[#131316] text-white border-neutral-500 shadow-md"
                : "bg-transparent border-transparent text-[#71717A] hover:text-white"
            )}
          >
            <Sparkles size={13} />
            {_("aiModels")}
          </button>
          <button
            onClick={() => {
              setActiveTab("companies");
              setActiveCategory("All Categories");
            }}
            className={cn(
              "px-4 py-2 text-xs font-bold rounded-lg border transition-all active:scale-95 flex items-center gap-1.5",
              activeTab === "companies"
                ? "bg-[#131316] text-white border-neutral-500 shadow-md"
                : "bg-transparent border-transparent text-[#71717A] hover:text-white"
            )}
          >
            <Building size={13} />
            {_("aiCompanies")}
          </button>
          <button
            onClick={() => {
              setActiveTab("bookmarks");
              setActiveCategory("All Categories");
            }}
            className={cn(
              "px-4 py-2 text-xs font-bold rounded-lg border transition-all active:scale-95 flex items-center gap-1.5",
              activeTab === "bookmarks"
                ? "bg-[#131316] text-white border-neutral-500 shadow-md"
                : "bg-transparent border-transparent text-[#71717A] hover:text-white"
            )}
          >
            <Bookmark size={13} />
            {_("bookmarks")}
            {/* Bookmarks Count Badge exactly like screenshot */}
            <span className="ml-1.5 bg-neutral-800 text-[#71717A] text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {bookmarkedIds.size}
            </span>
          </button>
        </div>

        {/* Dynamic Category Filtering Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 md:pb-0 flex-1">
            <span className="text-[10px] uppercase tracking-wider text-[#71717A] font-bold select-none pr-1">
              {_("filter")}
            </span>
            {getCategoriesForTab().map((cat) => {
              const count = getCountForCategory(cat);
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "rounded-full px-3 py-1 text-[12px] font-semibold border transition-all whitespace-nowrap active:scale-95 flex items-center gap-1.5",
                    activeCategory === cat
                      ? "bg-white text-black border-transparent font-bold"
                      : "bg-[#131316] border-[#232326] text-[#A1A1AA] hover:border-neutral-500 hover:text-white"
                  )}
                >
                  <span>{_(cat)}</span>
                  {/* Category count badge exactly like screenshot */}
                  {count !== null && (
                    <span className={cn(
                      "text-[9px] px-1 py-0.1 rounded font-mono font-bold select-none",
                      activeCategory === cat ? "bg-[#131316] text-white" : "bg-[#232326] text-[#71717A]"
                    )}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sort dropdown Prefix formatting inside options */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative inline-flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none rounded-lg border border-[#232326] bg-[#131316] pl-3 pr-8 py-1.5 text-[13px] font-semibold text-white hover:text-white hover:border-neutral-500 focus:outline-none transition-all cursor-pointer h-8"
              >
                <option value="Rank">{_("sortRank")}</option>
                <option value="Monthly Visits">{_("sortVisits")}</option>
                <option value="Growth">{_("sortGrowth")}</option>
                {activeTab === "tools" && <option value="Newest">{_("sortNewest")}</option>}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71717A] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            <span className="text-xs text-foreground-faint mt-4 animate-pulse">{_("loading")}</span>
          </div>
        ) : (
          <div className="border border-[#232326] rounded-xl overflow-hidden bg-[#131316]/20 backdrop-blur-md">
            {/* Table Area */}
            {(activeTab === "tools" || activeTab === "bookmarks") && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#232326] text-[10px] font-bold tracking-wider text-white uppercase bg-[#131316]/50">
                      <th className="py-3.5 px-6 w-24">{_("rank")}</th>
                      <th className="py-3.5 px-6">{_("tool")}</th>
                      <th className="py-3.5 px-6">{_("tags")}</th>
                      <th className="py-3.5 px-6 text-right w-40">{_("monthlyVisits")}</th>
                      <th className="py-3.5 px-6 text-right w-36">{_("growth")}</th>
                      <th className="py-3.5 px-6 text-center w-36">{_("action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredTools().map((tool) => (
                      <tr
                        key={tool.id}
                        className="border-b border-[#1B1B1F] hover:bg-[#18181C]/60 transition-colors group"
                      >
                        <td className="py-4 px-6 font-bold text-sm">
                          {renderRankBadge(tool.rank)}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            {/* STRICTLY SQUARE BOX - NO ROUND EDGE, WITH INTERNAL PADDING & DARK BG */}
                            <div className="h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-none border border-[#232326] bg-[#18181C] flex relative p-1.5">
                              <span className="text-white font-black text-sm uppercase select-none z-0">
                                {tool.name.charAt(0)}
                              </span>
                              <img
                                src={resolveLogoUrl(tool.logoUrl, tool.name)}
                                alt={tool.name}
                                className="h-full w-full object-contain absolute z-10 p-1.5 bg-[#18181C]"
                                onError={(e) => handleLogoError(e, tool.name)}
                              />
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-white text-[15px] truncate">
                                {tool.name}
                              </h4>
                              {/* 1 LINE strictly & grey color matching picture */}
                              <p className="text-xs text-[#A1A1AA] line-clamp-1 max-w-md mt-0.5">
                                {tool.description}
                              </p>
                              {/* Subtext: Category and Pricing in zinc-500 uppercase */}
                              <p className="text-[10px] text-[#71717A] uppercase font-bold tracking-wider line-clamp-1 mt-0.5">
                                {tool.category} • {tool.pricing}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {renderTags(tool.tags)}
                        </td>
                        <td className="py-4 px-6 text-right font-mono text-xs font-semibold text-white">
                          {tool.visits}
                        </td>
                        <td className="py-4 px-6 text-right font-mono text-xs font-bold">
                          <span
                            className={cn(
                              tool.growth >= 0 ? "text-emerald-500" : "text-rose-500"
                            )}
                          >
                            {tool.growth >= 0 ? `+${tool.growth}%` : `${tool.growth}%`}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() => toggleLocalBookmark(tool.id)}
                              className={cn(
                                "p-1.5 rounded transition-all hover:bg-neutral-800 active:scale-90",
                                bookmarkedIds.has(tool.id) ? "text-[#6E56CF]" : "text-[#71717A] hover:text-white"
                              )}
                            >
                              <Bookmark size={15} className={cn(bookmarkedIds.has(tool.id) && "fill-[#6E56CF]")} />
                            </button>
                            <a
                              href={tool.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#232326] bg-[#131316] text-[11px] font-semibold text-white hover:text-white hover:border-white/30 transition-all active:scale-95"
                            >
                              {_("visit")}
                              <ArrowUpRight size={12} />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "models" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#232326] text-[10px] font-bold tracking-wider text-white uppercase bg-[#131316]/50">
                      <th className="py-3.5 px-6 w-24">{_("rank")}</th>
                      <th className="py-3.5 px-6">{_("model")}</th>
                      <th className="py-3.5 px-6 w-32">{_("context")}</th>
                      <th className="py-3.5 px-6 text-right w-40">{_("monthlyHits")}</th>
                      <th className="py-3.5 px-6 text-right w-36">{_("growth")}</th>
                      <th className="py-3.5 px-6 text-center w-28">{_("action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredModels().map((model) => (
                      <tr
                        key={model.id}
                        className="border-b border-[#1B1B1F] hover:bg-[#18181C]/60 transition-colors group"
                      >
                        <td className="py-4 px-6 font-bold text-sm">
                          {renderRankBadge(model.rank)}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-none border border-[#232326] bg-[#18181C] flex relative p-1.5">
                              <span className="text-white font-black text-sm uppercase select-none z-0">
                                {model.name.charAt(0)}
                              </span>
                              <img
                                src={resolveLogoUrl(model.logoUrl, model.name)}
                                alt={model.name}
                                className="h-full w-full object-contain absolute z-10 p-1.5 bg-[#18181C]"
                                onError={(e) => handleLogoError(e, model.name)}
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-white text-[15px] truncate">
                                  {model.name}
                                </h4>
                                {model.openSource && (
                                  <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] text-[#A1A1AA] border border-[#232326] font-semibold">
                                    Open
                                  </span>
                                )}
                              </div>
                              {/* Description strictly 1 line & grey */}
                              <p className="text-xs text-[#A1A1AA] line-clamp-1 mt-0.5">
                                {model.description}
                              </p>
                              <p className="text-[10px] text-[#71717A] font-bold uppercase tracking-wider mt-0.5">
                                {model.provider}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-xs text-[#A1A1AA] font-medium">
                          {model.contextWindow}
                        </td>
                        <td className="py-4 px-6 text-right font-mono text-xs font-semibold text-white">
                          {model.visits}
                        </td>
                        <td className="py-4 px-6 text-right font-mono text-xs font-bold">
                          <span
                            className={cn(
                              model.growth >= 0 ? "text-emerald-500" : "text-rose-500"
                            )}
                          >
                            {model.growth >= 0 ? `+${model.growth}%` : `${model.growth}%`}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <Link
                            href={`/tools`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#232326] bg-[#131316] text-[11px] font-semibold text-white hover:text-white hover:border-white/30 transition-all active:scale-95"
                          >
                            {_("visit")}
                            <ArrowUpRight size={12} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "companies" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#232326] text-[10px] font-bold tracking-wider text-white uppercase bg-[#131316]/50">
                      <th className="py-3.5 px-6 w-24">{_("rank")}</th>
                      <th className="py-3.5 px-6">{_("company")}</th>
                      <th className="py-3.5 px-6 text-center w-28">{_("products")}</th>
                      <th className="py-3.5 px-6 text-right w-40">{_("monthlyTraffic")}</th>
                      <th className="py-3.5 px-6 text-right w-36">{_("growth")}</th>
                      <th className="py-3.5 px-6 text-center w-28">{_("action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredCompanies().map((company) => (
                      <tr
                        key={company.id}
                        className="border-b border-[#1B1B1F] hover:bg-[#18181C]/60 transition-colors group"
                      >
                        <td className="py-4 px-6 font-bold text-sm">
                          {renderRankBadge(company.rank)}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-none border border-[#232326] bg-[#18181C] flex relative p-1.5">
                              <span className="text-white font-black text-sm uppercase select-none z-0">
                                {company.name.charAt(0)}
                              </span>
                              <img
                                src={resolveLogoUrl(company.logoUrl, company.name)}
                                alt={company.name}
                                className="h-full w-full object-contain absolute z-10 p-1.5 bg-[#18181C]"
                                onError={(e) => handleLogoError(e, company.name)}
                              />
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-white text-[15px] truncate">
                                {company.name}
                              </h4>
                              {/* 1 line & grey */}
                              <p className="text-xs text-[#A1A1AA] line-clamp-1 mt-0.5">
                                {company.description}
                              </p>
                              <p className="text-[10px] text-[#71717A] font-bold uppercase tracking-wider mt-0.5">
                                {company.headquarters}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center font-semibold text-xs text-white">
                          {company.productsCount}
                        </td>
                        <td className="py-4 px-6 text-right font-mono text-xs font-semibold text-white">
                          {company.visits}
                        </td>
                        <td className="py-4 px-6 text-right font-mono text-xs font-bold">
                          <span
                            className={cn(
                              company.growth >= 0 ? "text-emerald-500" : "text-rose-500"
                            )}
                          >
                            {company.growth >= 0 ? `+${company.growth}%` : `${company.growth}%`}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <Link
                            href={`/companies/${company.id.toLowerCase()}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#232326] bg-[#131316] text-[11px] font-semibold text-white hover:text-white hover:border-white/30 transition-all active:scale-95"
                          >
                            {_("visit")}
                            <ArrowUpRight size={12} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
