import type { ToolDetailData, ToolCardData } from "@/lib/types";

export type ToolDetailDataExtended = ToolDetailData & {
  // NEW — add to Prisma Tool model
  longDescription: string | null;          // full markdown/paragraph overview (vs short description)
  videoUrl: string | null;                 // YouTube embed or direct mp4 URL
  websiteScreenshotUrl: string | null;     // auto-captured or manually uploaded preview image
  releasedBy: string | null;               // publisher name (e.g. "Anthropic", "OpenAI")
  country: string | null;                  // country of origin
  views: number;                           // total page views
  saves: number;                           // total bookmarks/saves
  useCases: string[];                      // ["Content Marketing", "SEO", "Social Media"]
  pricingTiers: PricingTier[];             // structured pricing plans
  verdict: string | null;                  // editorial verdict text (can be AI-generated)
  linkedInUrl: string | null;
  twitterUrl: string | null;
  githubUrl: string | null;
  launchDate: string | null;              // human-readable e.g. "March 2023"
  alternativeIds: string[];               // slugs of alternative tools
  ttasks?: { task: { slug: string; title: string } }[];
};

export type PricingTier = {
  name: string;           // "Free", "Pro", "Enterprise"
  price: string;          // "$0", "$20/mo", "Custom"
  description: string;
  features: string[];
  isPopular?: boolean;
};

// ─── Similar tools (returned alongside detail) ───────────────────────────────
export type SimilarToolExtended = ToolCardData & {
  shortDescription: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// SAMPLE TOOL 1 — Descript Max Enterprise
// ─────────────────────────────────────────────────────────────────────────────
export const SAMPLE_TOOL_DESCRIPT: ToolDetailDataExtended = {
  id: "cms3bsw09000ypsp7p53gmmrz",
  slug: "get-descript-max-enterprise-43-com",
  name: "Descript Max Enterprise",
  logoUrl: "https://cdn-images.toolify.ai/image/3ebd7a653ecae95571bcc74258b36f3e.jpeg",
  description: "AI-powered audio and video editing software that edits like a document.",
  longDescription: `Descript is a fully AI-powered audio and video editor that lets you edit media the same way you edit a document — by editing the transcript. Cut filler words, remove silences, overdub your own voice with AI, and collaborate with your team in real time.\n\nThe Max Enterprise edition unlocks unlimited transcription, advanced team permissions, priority rendering, enterprise SSO, and a dedicated customer success manager. It is the go-to platform for podcast studios, corporate L&D teams, and high-volume content agencies.\n\nDescript's Overdub feature lets you generate synthetic speech in your own voice, meaning you can fix recording mistakes by just typing the corrected text — no re-recording required.`,
  websiteUrl: "https://www.descript.com",
  screenshots: [
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&q=80",
    "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&q=80",
    "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=80",
  ],
  videoUrl: "https://youtu.be/UjdZXIsEi1U?si=1lGvGHNNeBDO5WkZ",
  websiteScreenshotUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&q=80",
  features: [
    "Transcript-based editing: Edit video by editing text — delete words to cut clips instantly",
    "Overdub AI voice: Fix recording mistakes by typing corrected text in your own cloned voice",
    "Filler word removal: Auto-detect and remove 'um', 'uh', 'like' with one click",
    "Screen recording: Built-in screen recorder with automatic transcription",
    "Multi-track editing: Full timeline editor with audio ducking and layering",
    "Team collaboration: Real-time co-editing, comments, and version history",
    "Enterprise SSO: SAML-based single sign-on for large organizations",
    "Priority rendering: Faster export queues for high-volume teams",
  ],
  pros: [
    "Transcript editing makes video editing dramatically faster",
    "Overdub voice cloning is best-in-class for fixing mistakes",
    "Collaboration features rival dedicated project management tools",
    "Filler word removal saves hours on podcast post-production",
  ],
  cons: [
    "Enterprise pricing is steep for small teams or solo creators",
    "Overdub requires a substantial voice sample to train accurately",
    "Heavy projects can be slow to sync on lower-end machines",
  ],
  verdict: "Descript Max Enterprise is the definitive choice for organizations serious about video and podcast production at scale. The transcript-based editing paradigm alone justifies switching from traditional NLEs — and Overdub is genuinely magical once trained.",
  releaseDate: "2024-03-01T00:00:00Z",
  launchDate: "March 2024",
  pricingModel: "FREEMIUM",
  pricingAmount: "24",
  billingFrequency: "MONTHLY",
  pricingTiers: [
    {
      name: "Free",
      price: "$0/mo",
      description: "For individuals getting started",
      features: ["1 hour transcription/mo", "720p export", "Watermark on video", "Basic editing"],
    },
    {
      name: "Creator",
      price: "$24/mo",
      description: "For solo content creators",
      features: ["10 hours transcription/mo", "4K export", "No watermark", "Overdub (1 voice)", "Screen recorder"],
      isPopular: true,
    },
    {
      name: "Business",
      price: "$40/mo",
      description: "For teams and agencies",
      features: ["Unlimited transcription", "All Creator features", "Team workspaces", "Advanced permissions", "Priority support"],
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations",
      features: ["Everything in Business", "SSO/SAML", "Dedicated CSM", "SLA guarantee", "Custom contracts"],
    },
  ],
  avgRating: 4.6,
  reviewCount: 284,
  upvoteCount: 1247,
  isOpenSource: false,
  isTrending: true,
  verified: true,
  compatibility: ["WEB", "MACOS", "WINDOWS"],
  targetUsers: ["CONTENT_CREATORS", "MARKETERS", "ENTERPRISE"],
  hasApi: false,
  apiDocsUrl: null,
  performanceScore: 87,
  createdAt: "2026-07-27T14:32:17.673Z",
  releasedBy: "Descript Inc.",
  country: "United States",
  views: 48200,
  saves: 3100,
  useCases: ["Podcast Editing", "Video Production", "Corporate Training", "Content Marketing", "L&D"],
  linkedInUrl: "https://linkedin.com/company/descript",
  twitterUrl: "https://twitter.com/descriptapp",
  githubUrl: null,
  alternativeIds: ["julius-ai", "udio", "luma-dream-machine"],
  company: {
    slug: "descript",
    name: "Descript Inc.",
    logoUrl: "https://www.google.com/s2/favicons?sz=64&domain=descript.com",
  },
  categories: [
    { category: { slug: "video", name: "Video" } },
    { category: { slug: "audio", name: "Audio" } },
    { category: { slug: "productivity", name: "Productivity" } },
  ],
  tags: [
    { tag: { slug: "video-editing", name: "Video Editing" } },
    { tag: { slug: "podcast", name: "Podcast" } },
    { tag: { slug: "transcription", name: "Transcription" } },
    { tag: { slug: "ai-voice", name: "AI Voice" } },
    { tag: { slug: "enterprise", name: "Enterprise" } },
    { tag: { slug: "collaboration", name: "Collaboration" } },
    { tag: { slug: "screen-recording", name: "Screen Recording" } },
  ],
  integrations: [
    { integration: { slug: "youtube", name: "YouTube", logoUrl: "https://www.google.com/s2/favicons?sz=64&domain=youtube.com" } },
    { integration: { slug: "slack", name: "Slack", logoUrl: "https://www.google.com/s2/favicons?sz=64&domain=slack.com" } },
    { integration: { slug: "zoom", name: "Zoom", logoUrl: "https://www.google.com/s2/favicons?sz=64&domain=zoom.us" } },
    { integration: { slug: "google-drive", name: "Google Drive", logoUrl: "https://www.google.com/s2/favicons?sz=64&domain=drive.google.com" } },
    { integration: { slug: "dropbox", name: "Dropbox", logoUrl: "https://www.google.com/s2/favicons?sz=64&domain=dropbox.com" } },
    { integration: { slug: "riverside", name: "Riverside", logoUrl: "https://www.google.com/s2/favicons?sz=64&domain=riverside.fm" } },
  ],
    ttasks: [
    { task: { slug: "edit-video-transcripts", title: "Edit Video Transcripts" } },
    { task: { slug: "remove-filler-words", title: "Remove Filler Words" } },
    { task: { slug: "record-screen", title: "Record Screen" } },
    { task: { slug: "clone-voice", title: "Clone Voice" } },
    { task: { slug: "transcribe-audio", title: "Transcribe Audio" } },
    { task: { slug: "collaborate-on-video", title: "Collaborate On Video" } },
    { task: { slug: "export-captions", title: "Export Captions" } },
    { task: { slug: "create-podcast-episodes", title: "Create Podcast Episodes" } },
    { task: { slug: "generate-show-notes", title: "Generate Show Notes" } },
    { task: { slug: "create-video-clips", title: "Create Video Clips" } },
    { task: { slug: "overdub-mistakes", title: "Overdub Mistakes" } },
    { task: { slug: "publish-to-youtube", title: "Publish To YouTube" } },
  ],
  _count: { reviews: 284, bookmarks: 3100 },
};

// ─────────────────────────────────────────────────────────────────────────────
// SAMPLE TOOL 2 — Julius AI
// ─────────────────────────────────────────────────────────────────────────────
export const SAMPLE_TOOL_JULIUS: ToolDetailDataExtended = {
  id: "cmrx5y5uq005iusvjxjy8uv9s",
  slug: "julius-ai",
  name: "Julius AI",
  logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=julius.ai",
  description: "An advanced AI data analyst that executes Python code to clean data and generate graphs.",
  longDescription: `Julius AI is a conversational data analyst that lets anyone — from business analysts to researchers — upload spreadsheets, CSVs, and databases and ask questions in plain English. Julius runs real Python code under the hood, generates visualizations, and explains every step of its reasoning.\n\nUnlike traditional BI tools, Julius requires no SQL knowledge and no drag-and-drop setup. Just paste your data, ask "show me sales by region for Q3", and Julius produces an interactive chart with a written explanation.\n\nThe platform supports pandas, matplotlib, seaborn, scikit-learn, and dozens of other Python libraries — meaning complex statistical analyses, ML model training, and data cleaning tasks that would normally require a data engineer can be completed in minutes by a non-technical user.`,
  websiteUrl: "https://julius.ai",
  screenshots: [
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
    "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&q=80",
  ],
  videoUrl: "https://youtu.be/67vD-LzYaCE?si=sH2NqOzeJWxsiB4i",
  websiteScreenshotUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
  features: [
    "Natural language queries: Ask data questions in plain English — no SQL or Python needed",
    "Live code execution: Julius runs real Python code (pandas, matplotlib, seaborn, scikit-learn)",
    "Chart generation: Auto-generates bar, line, scatter, pie, and heatmap charts",
    "Data cleaning: Detect nulls, outliers, duplicates, and fix them conversationally",
    "Statistical analysis: Run regressions, correlations, and hypothesis tests via chat",
    "Multi-file support: Upload multiple CSV, Excel, or JSON files and join them",
    "Export results: Download cleaned data, charts, and generated code",
    "Code transparency: Every answer shows the Python code that produced it",
  ],
  pros: [
    "Democratizes data analysis for non-technical business users",
    "Shows actual Python code — fully auditable and exportable",
    "Handles multi-file joins and complex aggregations correctly",
    "Dramatically faster than building dashboards in Tableau or Power BI",
  ],
  cons: [
    "Free tier limits file size and number of messages per day",
    "Very large datasets (1M+ rows) can cause timeouts",
    "Cannot connect directly to live databases (CSV/Excel upload only on base plan)",
  ],
  verdict: "Julius AI is the fastest way to turn a messy spreadsheet into actionable insights without writing a single line of code. For analysts, PMs, and founders who live in Excel, it is genuinely transformative.",
  releaseDate: "2023-11-01T00:00:00Z",
  launchDate: "November 2023",
  pricingModel: "FREEMIUM",
  pricingAmount: "20",
  billingFrequency: "MONTHLY",
  pricingTiers: [
    {
      name: "Free",
      price: "$0/mo",
      description: "Try Julius with limited messages",
      features: ["10 messages/day", "Files up to 10MB", "Basic chart types", "CSV & Excel upload"],
    },
    {
      name: "Pro",
      price: "$20/mo",
      description: "For analysts and power users",
      features: ["Unlimited messages", "Files up to 100MB", "All chart types", "Code export", "Priority processing"],
      isPopular: true,
    },
    {
      name: "Team",
      price: "$40/mo per seat",
      description: "For data teams",
      features: ["Everything in Pro", "Shared workspaces", "Team data library", "Admin controls", "API access"],
    },
  ],
  avgRating: 4.4,
  reviewCount: 127,
  upvoteCount: 892,
  isOpenSource: false,
  isTrending: false,
  verified: false,
  compatibility: ["WEB"],
  targetUsers: ["RESEARCHERS", "MARKETERS", "ENTERPRISE", "STUDENTS"],
  hasApi: true,
  apiDocsUrl: "https://julius.ai/docs/api",
  performanceScore: 81,
  createdAt: "2026-07-23T07:01:48.627Z",
  releasedBy: "Julius AI Inc.",
  country: "United States",
  views: 29400,
  saves: 1870,
  useCases: ["Data Analysis", "Business Intelligence", "Research", "Data Cleaning", "Visualization"],
  linkedInUrl: null,
  twitterUrl: "https://twitter.com/juliusai",
  githubUrl: null,
  alternativeIds: ["get-descript-max-enterprise-43-com", "rewind-ai", "feathery"],
  company: {
    slug: "julius-ai",
    name: "Julius AI Inc.",
    logoUrl: "https://www.google.com/s2/favicons?sz=64&domain=julius.ai",
  },
  categories: [
    { category: { slug: "productivity", name: "Productivity" } },
    { category: { slug: "research", name: "Research" } },
  ],
  tags: [
    { tag: { slug: "data-analysis", name: "Data Analysis" } },
    { tag: { slug: "python", name: "Python" } },
    { tag: { slug: "visualization", name: "Visualization" } },
    { tag: { slug: "no-code", name: "No-Code" } },
    { tag: { slug: "spreadsheet", name: "Spreadsheet" } },
    { tag: { slug: "free-trial", name: "Free Trial" } },
    { tag: { slug: "api", name: "API" } },
  ],
  integrations: [
    { integration: { slug: "google-sheets", name: "Google Sheets", logoUrl: "https://www.google.com/s2/favicons?sz=64&domain=sheets.google.com" } },
    { integration: { slug: "excel", name: "Excel", logoUrl: "https://www.google.com/s2/favicons?sz=64&domain=microsoft.com" } },
    { integration: { slug: "notion", name: "Notion", logoUrl: "https://www.google.com/s2/favicons?sz=64&domain=notion.so" } },
    { integration: { slug: "airtable", name: "Airtable", logoUrl: "https://www.google.com/s2/favicons?sz=64&domain=airtable.com" } },
  ],
  ttasks: [
    { task: { slug: "analyze-data", title: "Analyze Data" } },
    { task: { slug: "visualize-metrics", title: "Visualize Metrics" } },
    { task: { slug: "clean-datasets", title: "Clean Datasets" } },
    { task: { slug: "generate-synthetic-data", title: "Generate Synthetic Data" } },
    { task: { slug: "forecast-demand", title: "Forecast Demand" } },
    { task: { slug: "detect-anomalies", title: "Detect Anomalies" } },
    { task: { slug: "cluster-customer-segments", title: "Cluster Customer Segments" } },
    { task: { slug: "build-etl-pipelines", title: "Build ETL Pipelines" } },
    { task: { slug: "write-data-dictionaries", title: "Write Data Dictionaries" } },
    { task: { slug: "label-training-data", title: "Label Training Data" } },
    { task: { slug: "forecast-churn-risk", title: "Forecast Churn Risk" } },
    { task: { slug: "analyze-survey-results", title: "Analyze Survey Results" } },
    { task: { slug: "fine-tune-language-models", title: "Fine Tune Language Models" } },
  ],
  _count: { reviews: 127, bookmarks: 1870 },
};

// ─── Similar tools for detail page sidebar / alternatives grid ───────────────
export const SIMILAR_TOOLS_DESCRIPT: ToolCardData[] = [
  {
    id: "cmrke1y52005p1sv3w39ktgpz",
    slug: "udio",
    name: "Udio",
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=suno.com",
    description: "An AI-powered music generation platform that creates full songs with custom vocals and arrangements.",
    pricingModel: "FREEMIUM",
    pricingAmount: "10",
    billingFrequency: "MONTHLY",
    categories: [{ category: { slug: "audio", name: "Audio" } }],
    tags: [{ tag: { slug: "free-trial", name: "Free Trial" } }],
    _count: { reviews: 0, bookmarks: 1 },
    avgRating: null,
    company: { slug: "suno", name: "Suno" },
    createdAt: "2026-07-14T08:27:43.000Z",
    isOpenSource: false,
    isTrending: false,
  },
  {
    id: "cmrke1ynd005r1sv3ue6xtng2",
    slug: "luma-dream-machine",
    name: "Luma Dream Machine",
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=google.com",
    description: "A high-fidelity video generator that creates cinematic, realistic 5-second video clips from text prompts.",
    pricingModel: "FREEMIUM",
    pricingAmount: "29.99",
    billingFrequency: "MONTHLY",
    categories: [{ category: { slug: "video", name: "Video" } }],
    tags: [{ tag: { slug: "free-trial", name: "Free Trial" } }],
    _count: { reviews: 0, bookmarks: 1 },
    avgRating: null,
    company: { slug: "google", name: "Google" },
    createdAt: "2026-07-14T08:27:42.889Z",
    isOpenSource: false,
    isTrending: false,
  },
  {
    id: "cmrke1ydv005q1sv3tne7r21l",
    slug: "rewind-ai",
    name: "Rewind AI",
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=microsoft.com",
    description: "A personalized AI assistant that records your screen and audio locally to help you recall anything you saw.",
    pricingModel: "FREEMIUM",
    pricingAmount: "19",
    billingFrequency: "MONTHLY",
    categories: [{ category: { slug: "productivity", name: "Productivity" } }],
    tags: [{ tag: { slug: "free-trial", name: "Free Trial" } }],
    _count: { reviews: 0, bookmarks: 1 },
    avgRating: null,
    company: { slug: "microsoft", name: "Microsoft" },
    createdAt: "2026-07-14T08:27:42.548Z",
    isOpenSource: false,
    isTrending: false,
  },
  {
    id: "cmrke1xmf005n1sv3wjuw68fm",
    slug: "harvey-ai",
    name: "Harvey AI",
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=openai.com",
    description: "A secure AI platform built for law firms to automate legal research and contract drafting.",
    pricingModel: "PAID",
    pricingAmount: "89",
    billingFrequency: "MONTHLY",
    categories: [{ category: { slug: "productivity", name: "Productivity" } }],
    tags: [{ tag: { slug: "enterprise", name: "Enterprise" } }],
    _count: { reviews: 0, bookmarks: 1 },
    avgRating: null,
    company: { slug: "openai", name: "OpenAI" },
    createdAt: "2026-07-14T08:27:41.559Z",
    isOpenSource: false,
    isTrending: false,
  },
  {
    id: "cmrke1xcx005m1sv33jt7fans",
    slug: "beautiful-ai",
    name: "Beautiful.ai",
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=canva.com",
    description: "An AI-powered presentation platform that automatically applies professional brand guidelines to slides.",
    pricingModel: "PAID",
    pricingAmount: "12",
    billingFrequency: "MONTHLY",
    categories: [{ category: { slug: "productivity", name: "Productivity" } }],
    tags: [{ tag: { slug: "enterprise", name: "Enterprise" } }],
    _count: { reviews: 0, bookmarks: 1 },
    avgRating: null,
    company: { slug: "canva", name: "Canva" },
    createdAt: "2026-07-14T08:27:41.217Z",
    isOpenSource: false,
    isTrending: false,
  },
  {
    id: "cmrke1w6e005i1sv3vpbcgypd",
    slug: "chatpdf",
    name: "ChatPDF",
    logoUrl: "https://www.google.com/s2/favicons?sz=128&domain=openai.com",
    description: "An AI-powered tool that allows users to interactively chat with any PDF document to extract insights.",
    pricingModel: "FREEMIUM",
    pricingAmount: "5",
    billingFrequency: "MONTHLY",
    categories: [{ category: { slug: "productivity", name: "Productivity" } }],
    tags: [{ tag: { slug: "free-trial", name: "Free Trial" } }],
    _count: { reviews: 0, bookmarks: 2 },
    avgRating: null,
    company: { slug: "openai", name: "OpenAI" },
    createdAt: "2026-07-14T08:27:39.686Z",
    isOpenSource: false,
    isTrending: false,
  },
];

// ─── Helper to get tool by slug from sample data ─────────────────────────────
export function getSampleTool(slug: string): ToolDetailDataExtended | null {
  if (slug === SAMPLE_TOOL_DESCRIPT.slug) return SAMPLE_TOOL_DESCRIPT;
  if (slug === SAMPLE_TOOL_JULIUS.slug) return SAMPLE_TOOL_JULIUS;
  return null;
}

export function getSampleSimilarTools(slug: string): ToolCardData[] {
  return SIMILAR_TOOLS_DESCRIPT.filter((t) => t.slug !== slug).slice(0, 6);
}

