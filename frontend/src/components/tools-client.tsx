'use client';

import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import { ToolListView } from "@/components/ToolListView";
import { API_URL } from "@/lib/api";
import type { SortOption } from "@/lib/types";
import { BUSINESS_CATEGORIES } from "@/lib/business-categories";


type DirectoryMode = "tools" | "personal" | "creativity" | "business";

// Maps UI category slugs → task slugs and tag slugs present in API data
const CATEGORY_FILTER_MAP: Record<string, { taskSlugs?: string[]; tagSlugs?: string[]; nameParts?: string[]; descriptionParts?: string[] }> = {
  // ── Tools ──────────────────────────────────────────────────────────────────
  "writing":             { taskSlugs: ["write-blog-posts"], nameParts: ["write", "copy", "katteb", "grammarly", "jasper", "copyai", "wordtune"], descriptionParts: ["writing", "copywriting", "blog", "essay", "content creation", "marketing copy"] },
  "image-generation":    { taskSlugs: ["create-empty-states"], nameParts: ["kittl", "midjourney", "dall", "stable", "ilus", "ai-illustration", "ai-hairstyle", "pickey"], descriptionParts: ["image gen", "text-to-image", "image generator", "ai image", "generate image", "ai art", "illustration generator", "visual", "convert text to image"] },
  "video":               { taskSlugs: ["generate-video-scripts"], nameParts: ["filmflow", "boords", "descript"], descriptionParts: ["video", "storyboard", "film production", "screenwriting", "youtube"] },
  "audio":               { taskSlugs: ["transcribe-audio"], nameParts: ["otter", "fliflik"], descriptionParts: ["transcri", "voice", "audio", "speech", "meeting", "sound", "voice changer", "voice filter"] },
  "chatbots":            { taskSlugs: ["build-chatbots"], nameParts: ["chatbase", "poe", "character", "bot"], descriptionParts: ["chatbot", "conversational", "knowledge base", "chat with", "ai chat", "virtual assistant"] },
  "coding":              { taskSlugs: ["generate-code"], nameParts: ["cursor", "copilot", "codeium", "width"], descriptionParts: ["code", "coding", "developer", "programming", "software development", "engineer"] },
  "marketing":           { nameParts: ["bestcontent", "copyai", "impel"], descriptionParts: ["marketing", "seo", "advertising", "campaign", "lead", "automotive", "customer lifecycle"] },
  "productivity":        { tagSlugs: ["productivity"], taskSlugs: ["automate-workflows", "summarize-documents"], nameParts: ["notion", "otter"], descriptionParts: ["productivity", "workflow", "automat", "scheduling", "appointment", "task management", "summarize"] },
  "business":            { nameParts: ["mava", "truelark", "impel", "chatbase"], descriptionParts: ["business", "enterprise", "customer support", "crm", "b2b", "revenue", "sales", "corporate training"] },
  "education":           { nameParts: ["twixie", "yourteacher", "umu", "katteb"], descriptionParts: ["educat", "learn", "teach", "tutor", "language", "training", "course", "study", "child", "student", "foreign language"] },
  "agents":              { taskSlugs: ["automate-workflows"], descriptionParts: ["agent", "autonomous", "automat", "agentic"] },
  "presentations":       { descriptionParts: ["presentation", "slide", "pitch deck", "slideshow", "powerpoint"] },
  "3d-generation":       { descriptionParts: ["3d", "three-dimensional", "3d model", "3d generat"] },
  "no-code":             { nameParts: ["chatme"], descriptionParts: ["no-code", "nocode", "visual editor", "drag and drop", "without code", "web application"] },
  "workflow-automation": { taskSlugs: ["automate-workflows"], descriptionParts: ["workflow automat", "automation platform", "automate", "zapier", "integrate"] },

  // ── Business ───────────────────────────────────────────────────────────────
  "sales":              { descriptionParts: ["sales", "crm", "lead", "prospect", "outreach", "pipeline", "revenue", "deal"] },
  "customer-support":   { tagSlugs: ["customer-support"], descriptionParts: ["customer support", "customer service", "help desk", "helpdesk", "support ticket", "live chat", "sentiment"] },
  "human-resources":    { descriptionParts: ["human resources", " hr ", "employee", "workforce", "payroll", "performance review", "people operations"] },
  "recruiting":         { descriptionParts: ["recruit", "hiring", "candidate", "resume", "cv screening", "interview", "talent acquisition"] },
  "finance-accounting": { descriptionParts: ["accounting", "bookkeeping", "invoice", "expense", "financial", "finance", "tax", "payroll", "receipt"] },
  "legal-compliance":   { descriptionParts: ["legal", "law", "contract", "compliance", "regulation", "policy", "document review"] },
  "operations":         { descriptionParts: ["operations", "supply chain", "logistics", "inventory", "forecast", "resource planning", "back office"] },
  "project-management": { descriptionParts: ["project management", "task management", "project planning", "roadmap", "team collaboration", "resource allocation"] },
  "email":              { descriptionParts: ["email", "inbox", "newsletter", "email campaign", "email assistant", "email marketing"] },
  "scheduling":         { descriptionParts: ["scheduling", "calendar", "appointment", "meeting", "booking"] },
  "ecommerce":          { descriptionParts: ["ecommerce", "e-commerce", "online store", "shopping", "retail", "product listing", "product recommendation"] },
  "writing-editing":    { taskSlugs: ["write-blog-posts", "summarize-documents"], descriptionParts: ["writing", "editing", "grammar", "copywriting", "paraphras", "summariz", "business content"] },
  "technology-it":      { taskSlugs: ["generate-code"], descriptionParts: ["information technology", "software development", "code assistant", "cybersecurity", "website builder", "database", "technical support", "no-code", "low-code"] },
  "data-analytics":     { descriptionParts: ["data analysis", "analytics", "business intelligence", "spreadsheet", "dashboard", "reporting", "sql", "forecasting"] },

  // ── Personal ───────────────────────────────────────────────────────────────
  "relationships":       { nameParts: ["loverr", "flave", "wowow", "wifeapp", "lovecore", "outpeach", "virtugf", "fallfor", "honeychat", "mygirl", "xmate", "aipornchat", "nsfw", "naughty", "tickles", "texthub", "bloomstories", "dreamrp", "ehentai", "realmplay", "janitor", "polybuzz", "ai-girlfriend", "alphazria", "nsfwchat", "soulfun", "joiai", "couple"], descriptionParts: ["girlfriend", "companion", "romantic", "relationship", "partner", "dating", "virtual partner", "ai girlfriend", "nsfw", "sexting", "roleplay", "intimate"] },
  "learning":            { nameParts: ["yourteacher", "umu"], descriptionParts: ["language practice", "foreign language", "learning platform", "corporate training", "course", "study", "lesson"] },
  "health-wellness":     { descriptionParts: ["health", "wellness", "fitness", "mental health", "nutrition", "wellbeing", "medical"] },
  "personal-development":{ nameParts: ["secretenergy", "ask-marcus"], descriptionParts: ["personal growth", "stoic", "self-improvement", "life coach", "motivat", "mindset", "marcus aurelius", "metaphysical", "conscious"] },
  "travel":              { descriptionParts: ["travel", "trip", "destination", "hotel", "flight", "itinerary"] },
  "finance-wealth":      { descriptionParts: ["financ", "wealth", "invest", "money", "budget", "tax", "trading"] },
  "entertainment":       { nameParts: ["roastedby", "memedeck", "digital-pets", "ai-realm", "dreampal", "lore-sage", "tell-me", "storychat", "dreamrp", "roleplay-gpt", "realmplay", "bot3", "spicy-chat", "carter-chat", "figgs", "nurmonic", "robotalk", "ai-characters"], descriptionParts: ["game", "roleplay", "story", "adventure", "meme", "tamagotchi", "entertain", "rpg", "dnd", "dungeons", "fiction", "narrative", "pet simulation"] },
  "food-nutrition":      { descriptionParts: ["food", "nutrition", "recipe", "meal", "diet", "cooking", "ingredient"] },
  "shopping":            { descriptionParts: ["shop", "ecommerce", "product recommendation", "purchase", "buy"] },
  "fashion-style":       { nameParts: ["ai-hairstyle"], descriptionParts: ["fashion", "style", "hair", "outfit", "clothing", "wardrobe", "makeover"] },
  "mindfulness":         { descriptionParts: ["mindful", "meditat", "calm", "zen", "stress", "anxiety", "breathe", "relax"] },
  "life-coaching":       { nameParts: ["huma", "halogram"], descriptionParts: ["life coach", "mentor", "emotional support", "companionship", "mood", "personal assistant", "empathetic"] },
  "home-decor":          { descriptionParts: ["home decor", "interior design", "furniture", "room design"] },
  "insurance-advisor":   { descriptionParts: ["insur", "coverage", "policy", "premium"] },

  // ── Creativity ─────────────────────────────────────────────────────────────
  "software-development":{ taskSlugs: ["generate-code"], descriptionParts: ["software development", "coding", "developer", "programming", "engineer", "web application", "no-code platform"] },
  "video-creation":      { nameParts: ["filmflow", "boords", "descript"], descriptionParts: ["video", "film", "storyboard", "screenwriting", "youtube", "tutorial"] },
  "music":               { descriptionParts: ["music", "audio", "sound", "song", "beat", "melody", "compose"] },
  "graphic-design":      { nameParts: ["kittl"], descriptionParts: ["graphic design", "design creation", "poster", "banner", "logo", "visual design"] },
  "digital-art":         { nameParts: ["ilus", "ai-illustration"], descriptionParts: ["digital art", "illustration", "ai art", "artwork", "artistic"] },
  "brainstorming":       { descriptionParts: ["brainstorm", "idea generat", "creative", "ideation", "concept"] },
  "3d-creation":         { descriptionParts: ["3d", "three-dimensional"] },
  "presentation-design": { descriptionParts: ["presentation", "slide", "pitch", "deck"] },
  "storytelling":        { taskSlugs: ["write-blog-posts"], nameParts: ["tell-me", "lore-sage", "storychat", "dreampal"], descriptionParts: ["story", "narrative", "tale", "fiction", "children's story", "world building", "ttrpg", "fantasy world"] },
  "content-creation":    { taskSlugs: ["write-blog-posts", "generate-video-scripts"], nameParts: ["bestcontent", "copyai", "filmflow"], descriptionParts: ["content creation", "content marketing", "creator", "social media content", "blog"] },
  "branding":            { nameParts: ["makeinfluencer"], descriptionParts: ["brand", "logo", "identity", "influencer", "monetize"] },
  "motion-graphics":     { descriptionParts: ["motion", "animation", "animated", "motion graphic"] },
  "game-creation":       { nameParts: ["ai-realm", "digital-pets", "lore-sage"], descriptionParts: ["game", "rpg", "dnd", "dungeons and dragons", "game master", "ttrpg", "pet simulation"] },
};

const CATEGORY_MAP = {
  tools: [
    { name: "All", slug: "" },
    { name: "Writing", slug: "writing" },
    { name: "Image Generation", slug: "image-generation" },
    { name: "Video Generation", slug: "video" },
    { name: "Audio", slug: "audio" },
    { name: "Chatbots", slug: "chatbots" },
    { name: "Coding", slug: "coding" },
    { name: "Marketing", slug: "marketing" },
    { name: "Productivity", slug: "productivity" },
    { name: "Business", slug: "business" },
    { name: "Education", slug: "education" },
    { name: "Agents", slug: "agents" },
    { name: "Presentations", slug: "presentations" },
    { name: "3D Generation", slug: "3d-generation" },
    { name: "No-Code AI Builders", slug: "no-code" },
    { name: "Workflow Automation", slug: "workflow-automation" }
  ],
  personal: [
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
  ],
  creativity: [
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
  ],
  agents: [
    { name: "All", slug: "" },
    { name: "Content Creation", slug: "content-creation" },
    { name: "Research Assistance", slug: "research-assistance" },
    { name: "Customer Support", slug: "customer-support" },
    { name: "Software Development", slug: "software-development" },
    { name: "Business Automation", slug: "business-automation" },
    { name: "Data Analysis", slug: "data-analysis" },
    { name: "Knowledge Management", slug: "knowledge-management" },
    { name: "Personal Productivity", slug: "personal-productivity" },
    { name: "Sales Automation", slug: "sales-automation" },
    { name: "Workflow Automation", slug: "workflow-automation" },
    { name: "Autonomous Agents", slug: "autonomous-agents" }
  ],
  business: [
    ...BUSINESS_CATEGORIES
  ]
} as const;

function matchesCategory(tool: any, categorySlug: string): boolean {
  const filter = CATEGORY_FILTER_MAP[categorySlug];
  if (!filter) return true;

  // ttasks slugs — most reliable signal
  const taskSlugs = tool.ttasks?.map((t: any) => t.task?.slug) ?? [];
  if (filter.taskSlugs?.some((s: string) => taskSlugs.includes(s))) return true;

  // tag slugs
  const tagSlugs = tool.tags?.map((t: any) => t.tag?.slug) ?? [];
  if (filter.tagSlugs?.some((s: string) => tagSlugs.includes(s))) return true;

  // name + slug match (exact tool identifiers)
  const nameAndSlug = (tool.name + " " + tool.slug).toLowerCase();
  if (filter.nameParts?.some((p: string) => nameAndSlug.includes(p.toLowerCase()))) return true;

  const searchableText = [
    tool.name,
    tool.slug,
    tool.description,
    tool.company?.name,
    ...(tool.useCases ?? []),
    ...(tool.categories?.flatMap((item: any) => [item.category?.name, item.category?.slug]) ?? []),
    ...(tool.tags?.flatMap((item: any) => [item.tag?.name, item.tag?.slug]) ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (filter.descriptionParts?.some((part: string) => searchableText.includes(part.toLowerCase()))) return true;

  return false;
}

export function ToolsClient({
  defaultMode,
  defaultCategory
}: {
  defaultMode?: DirectoryMode;
  defaultCategory?: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  // FIXED: Mode is now dynamically derived every render. It will instantly swap back to "tools" 
  // when navigating away from the "agents" page, completely bypassing the Next.js cache trap.
  const mode: DirectoryMode = defaultMode || (
    pathname?.includes("personal") ? "personal" :
      pathname?.includes("creativity") ? "creativity" :
        pathname?.includes("business") ? "business" :
          "tools"
  );

  const [currentPage, setCurrentPage] = useState<number>(() => {
    const pageFromUrl = searchParams.get("page");
    return pageFromUrl ? parseInt(pageFromUrl, 10) : 1;
  });

  const [activeCategory, setActiveCategory] = useState<string>(() => {
    return defaultCategory || searchParams.get("category") || "";
  });

  const subCatContainerRef = useRef<HTMLDivElement>(null);
  const subCatRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const categoryRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = categoryRowRef.current;
    const activeBtn = subCatRefs.current[activeCategory];

    if (!container || !activeBtn) return;

    const containerRect = container.getBoundingClientRect();
    const buttonRect = activeBtn.getBoundingClientRect();

    const buttonLeft =
      buttonRect.left - containerRect.left + container.scrollLeft;
    const buttonRight = buttonLeft + buttonRect.width;
    const visibleLeft = container.scrollLeft;
    const visibleRight = container.scrollLeft + container.clientWidth;

    if (buttonRight > visibleRight) {
      const extraSpace = Math.min(
        container.clientWidth * 0.35,
        container.scrollWidth - buttonRight
      );

      container.scrollTo({
        left: Math.max(
          0,
          Math.min(
            container.scrollWidth - container.clientWidth,
            buttonRight - container.clientWidth + extraSpace
          )
        ),
        behavior: "smooth",
      });
    } else if (buttonLeft < visibleLeft) {
      const extraSpace = Math.min(
        container.clientWidth * 0.25,
        buttonLeft
      );

      container.scrollTo({
        left: Math.max(0, buttonLeft - extraSpace),
        behavior: "smooth",
      });
    }
  }, [activeCategory]);

  // FIXED: If the mode changes (e.g. going from Agents to Tools), force the category and page to reset 
  // so the new page doesn't try to query the old page's categories.
  useEffect(() => {
    setActiveCategory(defaultCategory || searchParams.get("category") || "");
    setCurrentPage(Number(searchParams.get("page")) || 1);
  }, [mode, defaultCategory]);



  const handleCategoryChange = (slug: string) => {
    setActiveCategory(slug);
    setCurrentPage(1);

    const base =
  mode === "personal"
    ? "/personal"
    : mode === "creativity"
      ? "/creativity"
      : mode === "business"
        ? "/business"
      : "/tools";
    const url = slug ? `${base}/${slug}` : base;
    window.history.pushState(null, "", url);
  };

  const q = searchParams.get("q") || undefined;
  const pricing = searchParams.get("pricing") || undefined;
  const sort = (searchParams.get("sort") || undefined) as SortOption | undefined;

  
  

  // Single page Query
  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ["tools", mode, activeCategory, q, pricing, sort, currentPage],
    queryFn: async () => {
      const query = new URLSearchParams();
      if (q) query.set("q", q);
      if (pricing) query.set("pricing", pricing);
      if (sort) query.set("sort", sort);
      query.set("page", mode === "business" ? "1" : String(currentPage));
      query.set("pageSize", mode === "business" ? "500" : "200");


      const endpoint = mode === "personal"
        ? `${API_URL}/api/v1/tools/category/personal`
        : mode === "creativity"
          ? `${API_URL}/api/v1/tools/category/creativity`
          : mode === "business"
            ? `${API_URL}/api/v1/tools/category/business`
          : `${API_URL}/api/v1/tools`;

    
      const res = await fetch(`${endpoint}?${query.toString()}`);
      if (!res.ok) return { tools: [], totalPages: 1 };
      return res.json();
    },
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });

  const rawTools = data?.tools || [];
  const filteredTools = activeCategory
    ? rawTools.filter((t: any) => matchesCategory(t, activeCategory))
    : rawTools;
  const businessPageSize = 24;
  const totalPages = mode === "business"
    ? Math.max(1, Math.ceil(filteredTools.length / businessPageSize))
    : data?.totalPages || 1;
  const tools = mode === "business"
    ? filteredTools.slice(
        (currentPage - 1) * businessPageSize,
        currentPage * businessPageSize,
      )
    : filteredTools;

  const categories = React.useMemo(
  () => CATEGORY_MAP[mode] || CATEGORY_MAP.tools,
  [mode]
);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);

    // Scroll smoothly to top of grid
    const target = document.getElementById("tools");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div id="tools" className="scroll-mt-28 w-full px-4 sm:px-6 lg:px-8 pt-2 pb-6">
      
        <div className="mx-auto w-full max-w-[1600px] space-y-4">

        {/* Category Row */}
        <div
          ref={(el) => {
            subCatContainerRef.current = el;
            categoryRowRef.current = el;
          }}
          className="mb-2 -mx-4 sm:mx-0 px-4 sm:px-0 flex items-center justify-start gap-1.5 touch-scroll-x pb-2.5 scrollbar-none w-auto sm:w-full overflow-x-auto scroll-smooth"
        >
          {categories.map((topic) => {
            const isSelected = activeCategory === topic.slug;
            return (
              <button
                key={topic.name}
                ref={(el) => { subCatRefs.current[topic.slug] = el; }}
                onClick={() => {
                  handleCategoryChange(topic.slug);
                }}
                data-active={isSelected ? "true" : undefined}
                className={`rounded-full px-3.5 py-1 text-[12px] font-semibold whitespace-nowrap transition-all duration-200 border active:scale-95 cursor-pointer shrink-0 ${isSelected
                    ? "bg-white text-black border-white shadow-lg shadow-white/5"
                    : "text-neutral-400 hover:text-white bg-[#131316]/50 border-[#232326]/60 hover:border-white/[0.15]"
                  }`}
              >
                {topic.name}
              </button>
            );
          })}
        </div>

    {/* List Grid */}
    <ToolListView tools={tools} loading={isLoading || isPlaceholderData} />

    {/* Pagination Bar */}
    {totalPages > 1 && (
      <div className="mt-8 flex items-center justify-center gap-2 pt-4 border-t border-[#232326]">
        {/* Prev Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-lg px-3 py-1.5 text-xs font-medium border border-[#232326] bg-[#131316] text-neutral-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {/* Page Indicator */}
        <div className="flex items-center gap-1 px-2">
          <span className="text-xs text-neutral-400">
            Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong>
          </span>
        </div>

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="rounded-lg px-3 py-1.5 text-xs font-medium border border-[#232326] bg-[#131316] text-neutral-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    )}

  </div>
    </div >
  );
}
