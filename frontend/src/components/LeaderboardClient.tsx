"use client";

import React, { useState, useEffect } from "react";
import ArrowUpRight from 'lucide-react/dist/esm/icons/arrow-up-right';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import Bookmark from 'lucide-react/dist/esm/icons/bookmark';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import Building from 'lucide-react/dist/esm/icons/building';
import Brain from 'lucide-react/dist/esm/icons/brain';
import Globe from 'lucide-react/dist/esm/icons/globe';
import Trophy from 'lucide-react/dist/esm/icons/trophy';
import Search from 'lucide-react/dist/esm/icons/search';
import SearchX from 'lucide-react/dist/esm/icons/search-x';
import X from 'lucide-react/dist/esm/icons/x';
import Info from 'lucide-react/dist/esm/icons/info';
import { cn } from "@/lib/utils";
import { fetchLeaderboardTools, fetchLeaderboardModels, fetchLeaderboardCompanies } from "@/lib/api";
import { Pagination } from "@/components/Pagination";

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
  url: string;
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
  url: string;
  logoUrl?: string;
};

// Hindi & English Translation dictionary
const t: Record<string, Record<string, string>> = {
  en: {
    heroBadge: "GLOBAL AI RANKINGS",
    heroTitle: "AI Ecosystem Leaderboard",
    heroSubtitle: "Real-time rankings, traffic growth, and performance metrics across top AI tools, models, and companies.",
    searchPlaceholder: "Search leaderboard tools, models, or companies...",
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
    noResultsTitle: "No matches found",
    noResultsSub: "Try adjusting your search query or clearing category filters.",
    clearFilters: "Clear Filters",
  },
  hi: {
    heroBadge: "ग्लोबल एआई रैंकिंग",
    heroTitle: "एआई इकोसिस्टम लीडरबोर्ड",
    heroSubtitle: "शीर्ष एआई टूल्स, मॉडल्स और कंपनियों की रियल-टाइम रैंकिंग, ट्रैफ़िक ग्रोथ और परफ़ॉरमेंस।",
    searchPlaceholder: "टूल्स, मॉडल्स या कंपनियाँ खोजें...",
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
    noResultsTitle: "कोई परिणाम नहीं मिला",
    noResultsSub: "कृपया अपनी खोज या फ़िल्टर बदलकर प्रयास करें।",
    clearFilters: "फ़िल्टर साफ़ करें",
  }
};

export function LeaderboardClient() {
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [activeTab, setActiveTab] = useState<"tools" | "agents" | "mcp" | "models" | "companies">("tools");
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("Rank");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(100);

  const [tools, setTools] = useState<LeaderboardTool[]>([]);
  const [models, setModels] = useState<LeaderboardModel[]>([]);
  const [companies, setCompanies] = useState<LeaderboardCompany[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, activeCategory, sortBy, searchQuery]);

  // Local bookmarks set
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  // Get current active categories based on active tab
  const getCategoriesForTab = () => {
    if (activeTab === "tools" || activeTab === "agents" || activeTab === "mcp") {
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
      return ["All Categories"];
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
        let toolsData = await fetchLeaderboardTools();
        const modelsData = await fetchLeaderboardModels();
        const companiesData = await fetchLeaderboardCompanies();
        
        if (toolsData.length === 0) {
          toolsData = [
            { id: '1', name: 'Midjourney', category: 'Generative AI', description: 'Advanced AI image generation.', pricing: 'Paid', tags: '["AI", "Image"]', visits: '15.2M', growth: 12, url: 'https://midjourney.com', rank: 1, rating: 5, votes: 1234, saves: 567, addedDate: new Date().toISOString() },
            { id: '2', name: 'ChatGPT', category: 'Chatbots', description: 'Powerful conversational AI.', pricing: 'Freemium', tags: '["AI", "Chat"]', visits: '45.0M', growth: 5, url: 'https://chat.openai.com', rank: 2, rating: 5, votes: 5678, saves: 1234, addedDate: new Date().toISOString() },
            { id: '3', name: 'Cursor', category: 'Code Assistant', description: 'AI code editor for engineers.', pricing: 'Paid', tags: '["Code", "Dev"]', visits: '22.0M', growth: -2, url: 'https://cursor.sh', rank: 3, rating: 4, votes: 345, saves: 123, addedDate: new Date().toISOString() }
          ];
        }

        setTools(toolsData);
        setModels(modelsData);
        setCompanies(companiesData);

        // Pre-bookmark first few items for demonstration
        if (toolsData.length > 0) {
          setBookmarkedIds(new Set([toolsData[0].id, toolsData[2].id]));
        }
      } catch (err) {
        console.error("Error fetching leaderboard data:", err);
        const mockData = [
          { id: '1', name: 'Midjourney', category: 'Generative AI', description: 'Advanced AI image generation.', pricing: 'Paid', tags: '["AI", "Image"]', visits: '15.2M', growth: 12, url: 'https://midjourney.com', rank: 1, rating: 5, votes: 1234, saves: 567, addedDate: new Date().toISOString() },
          { id: '2', name: 'ChatGPT', category: 'Chatbots', description: 'Powerful conversational AI.', pricing: 'Freemium', tags: '["AI", "Chat"]', visits: '45.0M', growth: 5, url: 'https://chat.openai.com', rank: 2, rating: 5, votes: 5678, saves: 1234, addedDate: new Date().toISOString() },
          { id: '3', name: 'Cursor', category: 'Code Assistant', description: 'AI code editor for engineers.', pricing: 'Paid', tags: '["Code", "Dev"]', visits: '22.0M', growth: -2, url: 'https://cursor.sh', rank: 3, rating: 4, votes: 345, saves: 123, addedDate: new Date().toISOString() }
        ];
        setTools(mockData);
        setModels([]);
        setCompanies([]);
        setBookmarkedIds(new Set([mockData[0].id, mockData[2].id]));
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter tools by category & search query
  const getFilteredTools = () => {
    let list = tools;
    if (activeTab === "bookmarks") {
      list = tools.filter((t) => bookmarkedIds.has(t.id));
    }

    const q = searchQuery.toLowerCase().trim();

    const filtered = list.filter((t) => {
      // Search filter
      if (q) {
        const matchName = t.name.toLowerCase().includes(q);
        const matchDesc = t.description?.toLowerCase().includes(q);
        const matchCat = t.category?.toLowerCase().includes(q);
        const matchTags = t.tags?.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchCat && !matchTags) return false;
      }

      // Category filter
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

  const matchModelCategory = (m: LeaderboardModel, target: string): boolean => {
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
    const q = searchQuery.toLowerCase().trim();

    const filtered = models.filter((m) => {
      // Search filter
      if (q) {
        const matchName = m.name.toLowerCase().includes(q);
        const matchProv = m.provider?.toLowerCase().includes(q);
        const matchDesc = m.description?.toLowerCase().includes(q);
        const matchCat = m.category?.toLowerCase().includes(q);
        if (!matchName && !matchProv && !matchDesc && !matchCat) return false;
      }

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
    const q = searchQuery.toLowerCase().trim();

    const filtered = companies.filter((c) => {
      if (q) {
        const matchName = c.name.toLowerCase().includes(q);
        const matchHq = c.headquarters?.toLowerCase().includes(q);
        const matchDesc = c.description?.toLowerCase().includes(q);
        if (!matchName && !matchHq && !matchDesc) return false;
      }
      return true;
    });

    // Apply Sorting logic
    return [...filtered].sort((a, b) => {
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

  // Render Rank Badges matching Homepage styling with Signal theme accents
  const renderRankBadge = (rankNum: number) => {
    if (rankNum === 1) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F5A623]/10 border border-[#F5A623]/30 text-[#F5A623] font-bold text-xs select-none shadow-[0_0_10px_rgba(245,166,35,0.15)]">
          <span>🥇</span>
          <span className="font-mono">#1</span>
        </span>
      );
    }
    if (rankNum === 2) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-400/10 border border-slate-400/30 text-slate-200 font-bold text-xs select-none">
          <span>🥈</span>
          <span className="font-mono">#2</span>
        </span>
      );
    }
    if (rankNum === 3) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-700/15 border border-amber-600/30 text-amber-300 font-bold text-xs select-none">
          <span>🥉</span>
          <span className="font-mono">#3</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#18181C] border border-[#232326] text-[#A1A1AA] font-mono text-xs font-semibold">
        #{rankNum}
      </span>
    );
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
          <span key={tag} className="px-2.5 py-1 rounded-md bg-white/5 backdrop-blur-md text-[10px] text-white border border-white/10 font-semibold whitespace-nowrap group-hover:border-white/20 transition-all">
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
    target.style.display = "none";
    const parent = target.parentElement;
    if (parent && !parent.querySelector(".logo-fallback-initial")) {
      const span = document.createElement("span");
      span.className = "logo-fallback-initial";
      span.textContent = getInitials(name);
      span.style.cssText = "display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:16px;font-weight:800;color:#fff;background:#18181C;";
      parent.appendChild(span);
    }
  };

  const currentFilteredTools = getFilteredTools();
  const currentFilteredModels = getFilteredModels();
  const currentFilteredCompanies = getFilteredCompanies();

  const totalTools = currentFilteredTools.length;
  const totalModels = currentFilteredModels.length;
  const totalCompanies = currentFilteredCompanies.length;

  const currentTotal = activeTab === "tools" || activeTab === "agents" || activeTab === "mcp"
    ? totalTools
    : activeTab === "models"
    ? totalModels
    : totalCompanies;

  const totalPages = Math.max(1, Math.ceil(currentTotal / pageSize));

  const visibleTools = currentFilteredTools.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const visibleModels = currentFilteredModels.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const visibleCompanies = currentFilteredCompanies.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="w-full flex flex-col flex-1 bg-[#000000] text-white selection:bg-neutral-800 selection:text-white">
      {/* Main Leaderboard Content Frame matching Tools page spacing & structure */}
      <div id="leaderboard" className="w-full px-4 sm:px-6 lg:px-8 pt-2 pb-6 flex-1 flex flex-col">
        <div className="mx-auto w-full max-w-[1600px] flex-1 flex flex-col">

          {/* Subcategories Row - EXACT MATCH TO TOOLS PAGE */}
          <div className="mb-2 -mx-4 sm:mx-0 px-4 sm:px-0 flex items-center justify-start gap-1.5 touch-scroll-x pb-2.5 scrollbar-none w-auto sm:w-full">
            {getCategoriesForTab().map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={(e) => {
                    setActiveCategory(cat);
                    e.currentTarget.scrollIntoView({
                      behavior: "smooth",
                      block: "nearest",
                      inline: "center",
                    });
                  }}
                  className={`rounded-full px-3.5 py-1 text-[12px] font-semibold whitespace-nowrap transition-all duration-200 border active:scale-95 cursor-pointer shrink-0 ${
                    isSelected
                      ? "bg-white text-black border-white shadow-lg shadow-white/5"
                      : "text-neutral-400 hover:text-white bg-[#131316]/50 border-[#232326]/60 hover:border-white/[0.15]"
                  }`}
                >
                  {cat === "All Categories" ? "All" : _(cat)}
                </button>
              );
            })}
          </div>

          {/* Controls Bar (Search, Language, Sort) */}
          <div className="flex items-center justify-end gap-2.5 mb-4 w-full">
            {/* Table Search filter */}
            <div className="relative inline-flex items-center">
              <Search size={13} className="absolute left-2.5 text-[#71717A] pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={_("searchPlaceholder")}
                className="w-44 sm:w-56 rounded-lg border border-[#232326] bg-[#131316] pl-7 pr-7 text-[12px] font-semibold text-white placeholder:text-[#71717A] hover:border-[#F5A623]/50 focus:outline-none focus:border-[#F5A623] transition-all h-8"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 text-[#71717A] hover:text-white"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Language dropdown switch */}
            <div className="relative inline-flex items-center">
              <Globe size={13} className="absolute left-2.5 text-[#71717A] pointer-events-none" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as "en" | "hi")}
                className="appearance-none rounded-lg border border-[#232326] bg-[#131316] pl-7 pr-7 py-1.5 text-[13px] font-semibold text-[#A1A1AA] hover:text-white hover:border-[#F5A623]/50 focus:outline-none transition-all cursor-pointer h-8"
              >
                <option value="en">EN</option>
                <option value="hi">हिंदी</option>
              </select>
              <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71717A] pointer-events-none" />
            </div>

            {/* Sort select */}
            <div className="relative inline-flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none rounded-lg border border-[#232326] bg-[#131316] pl-3 pr-8 py-1.5 text-[13px] font-semibold text-white hover:border-[#F5A623]/50 focus:outline-none transition-all cursor-pointer h-8"
              >
                <option value="Rank">{_("sortRank")}</option>
                <option value="Monthly Visits">{_("sortVisits")}</option>
                <option value="Growth">{_("sortGrowth")}</option>
                {activeTab === "tools" && <option value="Newest">{_("sortNewest")}</option>}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71717A] pointer-events-none" />
            </div>
          </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            <span className="text-xs text-[#71717A] mt-4 animate-pulse">{_("loading")}</span>
          </div>
        ) : (
          <div className="border border-[#232326]/70 rounded-xl overflow-hidden bg-[#0d0d10] shadow-xl">
            
            {/* 1. Tools, Agents, MCP View */}
            {(activeTab === "tools" || activeTab === "agents" || activeTab === "mcp") && (
              currentFilteredTools.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                  <div className="h-12 w-12 rounded-full border border-[#232326] bg-[#131316] flex items-center justify-center text-[#71717A] mb-3">
                    <SearchX size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">{_("noResultsTitle")}</h3>
                  <p className="text-xs text-[#71717A] max-w-sm mb-4">{_("noResultsSub")}</p>
                  {(searchQuery || activeCategory !== "All Categories") && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setActiveCategory("All Categories");
                      }}
                      className="px-3 py-1.5 rounded-lg border border-[#232326] bg-[#131316] text-xs font-semibold text-white hover:border-[#F5A623] transition-all"
                    >
                      {_("clearFilters")}
                    </button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto touch-scroll-x">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#232326] text-[10px] font-bold tracking-wider text-[#71717A] uppercase bg-[#131316]/70">
                        <th className="py-3.5 px-6 w-24">{_("rank")}</th>
                        <th className="py-3.5 px-6">{_("tool")}</th>
                        <th className="py-3.5 px-6">{_("tags")}</th>
                        <th className="py-3.5 px-6 text-right w-40">{_("monthlyVisits")}</th>
                        <th className="py-3.5 px-6 text-right w-36">{_("growth")}</th>
                        <th className="py-3.5 px-6 text-center w-36">{_("action")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleTools.map((tool) => (
                        <tr
                          key={tool.id}
                          className="relative border-b border-[#232326]/50 hover:bg-gradient-to-r hover:from-[#131316] hover:to-[#18181C] transition-all duration-300 group hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:z-10"
                        >
                          <td className="py-4 px-6 font-bold text-base">
                            <div className="relative flex items-center">
                              {/* Left hover edge highlight bar */}
                              <span className="pointer-events-none absolute -left-6 top-1/2 h-0 w-[3px] -translate-y-1/2 rounded-full bg-[#F5A623] shadow-[0_0_10px_#F5A623] transition-all duration-300 group-hover:h-[80%]" />
                              {renderRankBadge(tool.rank)}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#232326] bg-[#131316] flex relative p-1.5 shadow-lg group-hover:border-[#F5A623]/50 group-hover:shadow-[0_0_15px_rgba(245,166,35,0.2)] transition-all duration-300">
                                <span className="text-white font-black text-base uppercase select-none z-0">
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
                                <h4 className="font-bold text-white text-[15px] truncate group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-[#F5A623] transition-all duration-300">
                                  {tool.name}
                                </h4>
                                <div className="flex items-start gap-1.5 mt-1.5 bg-[#1A1A1E]/50 p-2 rounded-md border border-[#232326]/50">
                                  <Info size={14} className="shrink-0 mt-0.5 text-[#F5A623]/70" />
                                  <p className="text-[12.5px] text-[#D4D4D8] line-clamp-2 max-w-md leading-relaxed">
                                    {tool.description}
                                  </p>
                                </div>
                                <p className="text-[10px] text-[#71717A] uppercase font-bold tracking-wider line-clamp-1 mt-1.5">
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
                                "inline-flex items-center px-2 py-0.5 rounded-md font-mono text-xs font-semibold border",
                                tool.growth >= 0
                                  ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                                  : "text-rose-400 bg-rose-500/10 border-rose-500/20"
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
                                  "p-1.5 rounded-lg transition-all hover:bg-[#232326] active:scale-90",
                                  bookmarkedIds.has(tool.id) ? "text-[#F5A623]" : "text-[#71717A] hover:text-white"
                                )}
                                title={bookmarkedIds.has(tool.id) ? "Bookmarked" : "Bookmark tool"}
                              >
                                <Bookmark size={16} className={cn(bookmarkedIds.has(tool.id) && "fill-[#F5A623]")} />
                              </button>
                              <a
                                href={tool.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#232326] bg-gradient-to-b from-[#18181C] to-[#131316] text-xs font-bold text-white hover:border-[#F5A623] hover:shadow-[0_0_15px_rgba(245,166,35,0.25)] hover:text-[#F5A623] transition-all duration-300 active:scale-95"
                              >
                                {_("visit")}
                                <ArrowUpRight size={13} className="text-[#71717A] group-hover:text-white" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}

            {/* 2. Models View */}
            {activeTab === "models" && (
              currentFilteredModels.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                  <div className="h-12 w-12 rounded-full border border-[#232326] bg-[#131316] flex items-center justify-center text-[#71717A] mb-3">
                    <SearchX size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">{_("noResultsTitle")}</h3>
                  <p className="text-xs text-[#71717A] max-w-sm mb-4">{_("noResultsSub")}</p>
                  {(searchQuery || activeCategory !== "All Categories") && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setActiveCategory("All Categories");
                      }}
                      className="px-3 py-1.5 rounded-lg border border-[#232326] bg-[#131316] text-xs font-semibold text-white hover:border-[#F5A623] transition-all"
                    >
                      {_("clearFilters")}
                    </button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto touch-scroll-x">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#232326] text-[10px] font-bold tracking-wider text-[#71717A] uppercase bg-[#131316]/70">
                        <th className="py-3.5 px-6 w-24">{_("rank")}</th>
                        <th className="py-3.5 px-6">{_("model")}</th>
                        <th className="py-3.5 px-6 w-32">{_("context")}</th>
                        <th className="py-3.5 px-6 text-right w-40">{_("monthlyHits")}</th>
                        <th className="py-3.5 px-6 text-right w-36">{_("growth")}</th>
                        <th className="py-3.5 px-6 text-center w-28">{_("action")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleModels.map((model) => (
                        <tr
                          key={model.id}
                          className="relative border-b border-[#1B1B1F] hover:bg-[#18181C]/60 transition-colors group"
                        >
                          <td className="py-4 px-6 font-bold text-base">
                            <div className="relative flex items-center">
                              <span className="pointer-events-none absolute -left-6 top-1/2 h-0 w-[3px] -translate-y-1/2 rounded-full bg-[var(--color-signal)] transition-all duration-200 group-hover:h-[70%]" />
                              {renderRankBadge(model.rank)}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#232326]/70 bg-[#18181C] flex relative p-1.5 shadow-inner">
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
                                  <h4 className="font-bold text-white text-[15px] truncate group-hover:text-[#F5A623] transition-colors">
                                    {model.name}
                                  </h4>
                                  {model.openSource && (
                                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-[9px] text-emerald-400 border border-emerald-500/20 font-mono font-semibold">
                                      Open
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-[#A1A1AA] line-clamp-1 mt-0.5">
                                  {model.description}
                                </p>
                                <p className="text-[10px] text-[#71717A] font-bold uppercase tracking-wider mt-0.5">
                                  {model.provider}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-xs text-[#A1A1AA] font-mono font-medium">
                            {model.contextWindow}
                          </td>
                          <td className="py-4 px-6 text-right font-mono text-xs font-semibold text-white">
                            {model.visits}
                          </td>
                          <td className="py-4 px-6 text-right font-mono text-xs font-bold">
                            <span
                              className={cn(
                                "inline-flex items-center px-2 py-0.5 rounded-md font-mono text-xs font-semibold border",
                                model.growth >= 0
                                  ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                                  : "text-rose-400 bg-rose-500/10 border-rose-500/20"
                              )}
                            >
                              {model.growth >= 0 ? `+${model.growth}%` : `${model.growth}%`}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <a
                              href={model.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#232326] bg-[#131316] text-xs font-semibold text-white hover:border-[#F5A623] hover:text-white transition-all active:scale-95 shadow-sm"
                            >
                              {_("visit")}
                              <ArrowUpRight size={13} className="text-[#71717A] group-hover:text-white" />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}

            {/* 3. Companies View */}
            {activeTab === "companies" && (
              currentFilteredCompanies.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                  <div className="h-12 w-12 rounded-full border border-[#232326] bg-[#131316] flex items-center justify-center text-[#71717A] mb-3">
                    <SearchX size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">{_("noResultsTitle")}</h3>
                  <p className="text-xs text-[#71717A] max-w-sm mb-4">{_("noResultsSub")}</p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="px-3 py-1.5 rounded-lg border border-[#232326] bg-[#131316] text-xs font-semibold text-white hover:border-[#F5A623] transition-all"
                    >
                      {_("clearFilters")}
                    </button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto touch-scroll-x">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#232326] text-[10px] font-bold tracking-wider text-[#71717A] uppercase bg-[#131316]/70">
                        <th className="py-3.5 px-6 w-24">{_("rank")}</th>
                        <th className="py-3.5 px-6">{_("company")}</th>
                        <th className="py-3.5 px-6 text-center w-28">{_("products")}</th>
                        <th className="py-3.5 px-6 text-right w-40">{_("monthlyTraffic")}</th>
                        <th className="py-3.5 px-6 text-right w-36">{_("growth")}</th>
                        <th className="py-3.5 px-6 text-center w-28">{_("action")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleCompanies.map((company) => (
                        <tr
                          key={company.id}
                          className="relative border-b border-[#1B1B1F] hover:bg-[#18181C]/60 transition-colors group"
                        >
                          <td className="py-4 px-6 font-bold text-base">
                            <div className="relative flex items-center">
                              <span className="pointer-events-none absolute -left-6 top-1/2 h-0 w-[3px] -translate-y-1/2 rounded-full bg-[var(--color-signal)] transition-all duration-200 group-hover:h-[70%]" />
                              {renderRankBadge(company.rank)}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#232326]/70 bg-[#18181C] flex relative p-1.5 shadow-inner">
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
                                <h4 className="font-bold text-white text-[15px] truncate group-hover:text-[#F5A623] transition-colors">
                                  {company.name}
                                </h4>
                                <p className="text-xs text-[#A1A1AA] line-clamp-1 mt-0.5">
                                  {company.description}
                                </p>
                                <p className="text-[10px] text-[#71717A] font-bold uppercase tracking-wider mt-0.5">
                                  {company.headquarters}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center font-mono font-semibold text-xs text-white">
                            {company.productsCount}
                          </td>
                          <td className="py-4 px-6 text-right font-mono text-xs font-semibold text-white">
                            {company.visits}
                          </td>
                          <td className="py-4 px-6 text-right font-mono text-xs font-bold">
                            <span
                              className={cn(
                                "inline-flex items-center px-2 py-0.5 rounded-md font-mono text-xs font-semibold border",
                                company.growth >= 0
                                  ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                                  : "text-rose-400 bg-rose-500/10 border-rose-500/20"
                              )}
                            >
                              {company.growth >= 0 ? `+${company.growth}%` : `${company.growth}%`}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <a
                              href={company.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#232326] bg-[#131316] text-xs font-semibold text-white hover:border-[#F5A623] hover:text-white transition-all active:scale-95 shadow-sm"
                            >
                              {_("visit")}
                              <ArrowUpRight size={13} className="text-[#71717A] group-hover:text-white" />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </div>
        )}

        {/* Unified Floating Pill Pagination */}
        {!loading && currentTotal > 0 && (
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalCount={currentTotal}
            onPageChange={(p) => {
              setCurrentPage(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onPageSizeChange={(s) => {
              setPageSize(s);
              setCurrentPage(1);
            }}
          />
        )}
      </div>
    </div>
  </div>
);
}
