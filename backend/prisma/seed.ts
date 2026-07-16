import "dotenv/config";
import { PrismaClient, PricingModel, BillingFrequency } from "@prisma/client";

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const logoFor = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

// ---------------------------------------------------------------------------
// Companies — vendors/providers of the AI tools
// ---------------------------------------------------------------------------

const COMPANIES = [
  { slug: "openai", name: "OpenAI", domain: "openai.com" },
  { slug: "anthropic", name: "Anthropic", domain: "anthropic.com" },
  { slug: "google", name: "Google", domain: "google.com" },
  { slug: "perplexity-ai", name: "Perplexity AI", domain: "perplexity.ai" },
  { slug: "midjourney-inc", name: "Midjourney", domain: "midjourney.com" },
  { slug: "stability-ai", name: "Stability AI", domain: "stability.ai" },
  { slug: "leonardo-ai", name: "Leonardo.Ai", domain: "leonardo.ai" },
  { slug: "adobe", name: "Adobe", domain: "adobe.com" },
  { slug: "microsoft", name: "Microsoft", domain: "microsoft.com" },
  { slug: "replit", name: "Replit", domain: "replit.com" },
  { slug: "tabnine", name: "Tabnine", domain: "tabnine.com" },
  { slug: "notion", name: "Notion Labs", domain: "notion.so" },
  { slug: "gamma", name: "Gamma Tech", domain: "gamma.app" },
  { slug: "otter-ai", name: "Otter.ai", domain: "otter.ai" },
  { slug: "zapier", name: "Zapier", domain: "zapier.com" },
  { slug: "jasper", name: "Jasper", domain: "jasper.ai" },
  { slug: "copy-ai", name: "Copy.ai", domain: "copy.ai" },
  { slug: "writesonic", name: "Writesonic", domain: "writesonic.com" },
  { slug: "grammarly", name: "Grammarly", domain: "grammarly.com" },
  { slug: "surfer", name: "Surfer SEO", domain: "surferseo.com" },
  { slug: "runway", name: "Runway", domain: "runwayml.com" },
  { slug: "synthesia", name: "Synthesia", domain: "synthesia.io" },
  { slug: "heygen", name: "HeyGen", domain: "heygen.com" },
  { slug: "descript", name: "Descript", domain: "descript.com" },
  { slug: "elevenlabs", name: "ElevenLabs", domain: "elevenlabs.io" },
  { slug: "murf", name: "Murf", domain: "murf.ai" },
  { slug: "suno", name: "Suno", domain: "suno.com" },
  { slug: "character-ai", name: "Character.AI", domain: "character.ai" },
  { slug: "quora", name: "Quora (Poe)", domain: "poe.com" },
  { slug: "framer", name: "Framer", domain: "framer.com" },
  { slug: "canva", name: "Canva", domain: "canva.com" },
  { slug: "intercom", name: "Intercom", domain: "intercom.com" },
  { slug: "tidio", name: "Tidio", domain: "tidio.com" },
  { slug: "chatbase", name: "Chatbase", domain: "chatbase.co" },
  { slug: "speechify", name: "Speechify", domain: "speechify.com" },
  { slug: "lovo", name: "Lovo", domain: "lovo.ai" },
  { slug: "podcastle", name: "Podcastle", domain: "podcastle.ai" },
  { slug: "voicemaker", name: "Voicemaker", domain: "voicemaker.in" },
  { slug: "resemble", name: "Resemble AI", domain: "resemble.ai" },
  { slug: "naturalreaders", name: "Natural Readers", domain: "naturalreaders.com" },
  { slug: "wellsaidlabs", name: "WellSaid Labs", domain: "wellsaidlabs.com" },
  { slug: "soundraw", name: "Soundraw", domain: "soundraw.io" },
  { slug: "invideo", name: "InVideo", domain: "invideo.io" },
  { slug: "capcut", name: "CapCut", domain: "capcut.com" },
  { slug: "pictory", name: "Pictory", domain: "pictory.ai" },
  { slug: "veed", name: "Veed", domain: "veed.io" },
  { slug: "colossyan", name: "Colossyan", domain: "colossyan.com" },
  { slug: "elai", name: "Elai", domain: "elai.io" },
  { slug: "fliki", name: "Fliki", domain: "fliki.ai" },
  { slug: "lumen5", name: "Lumen5", domain: "lumen5.com" },
  { slug: "semrush", name: "Semrush", domain: "semrush.com" },
  { slug: "ahrefs", name: "Ahrefs", domain: "ahrefs.com" },
  { slug: "moz", name: "Moz", domain: "moz.com" },
  { slug: "screamingfrog", name: "Screaming Frog", domain: "screamingfrog.co.uk" },
  { slug: "clearscope", name: "Clearscope", domain: "clearscope.io" },
  { slug: "marketmuse", name: "MarketMuse", domain: "marketmuse.com" },
  { slug: "frase", name: "Frase", domain: "frase.io" },
  { slug: "rankmath", name: "RankMath", domain: "rankmath.com" },
  { slug: "yoast", name: "Yoast", domain: "yoast.com" },
  { slug: "consensus", name: "Consensus", domain: "consensus.app" },
  { slug: "elicit", name: "Elicit", domain: "elicit.com" },
  { slug: "scite", name: "Scite.ai", domain: "scite.ai" },
  { slug: "zendesk", name: "Zendesk", domain: "zendesk.com" },
  { slug: "freshworks", name: "Freshworks", domain: "freshworks.com" },
  { slug: "salesforce", name: "Salesforce", domain: "salesforce.com" },
  { slug: "zoho", name: "Zoho", domain: "zoho.com" },
  { slug: "ultimate", name: "Ultimate", domain: "ultimate.ai" },
  { slug: "coqui", name: "Coqui", domain: "coqui.ai" },
] as const;

// ---------------------------------------------------------------------------
// Taxonomy
// ---------------------------------------------------------------------------

const CATEGORY_NAMES = [
  "Chatbots",
  "Writing",
  "Coding",
  "Image Generation",
  "Video",
  "Audio",
  "Productivity",
  "Marketing",
  "Design",
  "SEO",
  "Research",
  "Customer Support",
];

const TAG_NAMES = [
  "API",
  "Open Source",
  "No Code",
  "Enterprise",
  "Free Trial",
  "Browser Extension",
  "Mobile App",
  "Desktop App",
];

// ---------------------------------------------------------------------------
// Tools definition
// ---------------------------------------------------------------------------

interface SeedTool {
  slug: string;
  name: string;
  description: string;
  websiteUrl: string;
  companySlug: string | null;
  pricingModel: PricingModel;
  pricingAmount: number | null;
  billingFrequency: BillingFrequency;
  features: string[];
  categorySlugs: string[];
  tagSlugs: string[];
}

const TOOLS: SeedTool[] = [
  // 1-10 Original tools
  {
    slug: "chatgpt",
    name: "ChatGPT",
    description: "A conversational AI assistant for writing, coding, research, and support tasks.",
    websiteUrl: "https://chat.openai.com",
    companySlug: "openai",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 20,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Web browsing", "Code interpreter", "Custom GPTs", "Voice mode"],
    categorySlugs: ["chatbots", "productivity", "writing", "coding", "research", "customer-support", "marketing"],
    tagSlugs: ["api", "free-trial", "mobile-app"],
  },
  {
    slug: "claude",
    name: "Claude",
    description: "An AI assistant built by Anthropic, focused on reasoning, long context, and safety.",
    websiteUrl: "https://claude.ai",
    companySlug: "anthropic",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 20,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Long context window", "Artifacts", "Code execution", "MCP connectors"],
    categorySlugs: ["chatbots", "productivity", "writing", "coding", "research", "customer-support", "marketing"],
    tagSlugs: ["api", "enterprise", "mobile-app"],
  },
  {
    slug: "gemini",
    name: "Gemini",
    description: "Google's multimodal AI assistant, integrated with Search and Workspace.",
    websiteUrl: "https://gemini.google.com",
    companySlug: "google",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 19.99,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Workspace integration", "Multimodal input", "Deep Research", "2M context"],
    categorySlugs: ["chatbots", "productivity", "writing", "coding", "research", "customer-support", "marketing"],
    tagSlugs: ["api", "mobile-app"],
  },
  {
    slug: "perplexity",
    name: "Perplexity",
    description: "An AI answer engine that pairs conversational search with cited sources for research.",
    websiteUrl: "https://www.perplexity.ai",
    companySlug: "perplexity-ai",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 20,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Cited answers", "Focus modes", "File upload", "Pro Search"],
    categorySlugs: ["research", "chatbots", "productivity", "writing", "seo"],
    tagSlugs: ["api", "browser-extension", "mobile-app"],
  },
  {
    slug: "midjourney",
    name: "Midjourney",
    description: "An AI image generation tool known for painterly, high-fidelity visual output.",
    websiteUrl: "https://www.midjourney.com",
    companySlug: "midjourney-inc",
    pricingModel: PricingModel.PAID,
    pricingAmount: 10,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Discord & web generation", "Upscaling", "Style tuning", "Character consistency"],
    categorySlugs: ["image-generation", "design", "marketing", "productivity"],
    tagSlugs: ["no-code"],
  },
  {
    slug: "stable-diffusion",
    name: "Stable Diffusion",
    description: "An open-source image generation model that can be self-hosted or accessed via API.",
    websiteUrl: "https://stability.ai",
    companySlug: "stability-ai",
    pricingModel: PricingModel.FREE,
    pricingAmount: null,
    billingFrequency: BillingFrequency.NA,
    features: ["Open weights", "Self-hostable", "ControlNet support", "Fine-tuning"],
    categorySlugs: ["image-generation", "design", "marketing", "productivity"],
    tagSlugs: ["open-source", "api"],
  },
  {
    slug: "leonardo-ai",
    name: "Leonardo.Ai",
    description: "An AI image and asset generation platform aimed at game artists and designers.",
    websiteUrl: "https://leonardo.ai",
    companySlug: "leonardo-ai",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 12,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Custom fine-tuned models", "Real-time canvas", "Texture generation", "API access"],
    categorySlugs: ["image-generation", "design", "marketing", "productivity"],
    tagSlugs: ["api", "free-trial"],
  },
  {
    slug: "adobe-firefly",
    name: "Adobe Firefly",
    description: "Adobe's family of creative generative AI models, integrated directly into Creative Cloud.",
    websiteUrl: "https://www.adobe.com/products/firefly.html",
    companySlug: "adobe",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 4.99,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Text to image", "Generative fill", "Text effects", "Commercial safety"],
    categorySlugs: ["image-generation", "design", "marketing", "productivity", "video"],
    tagSlugs: ["enterprise", "no-code"],
  },
  {
    slug: "github-copilot",
    name: "GitHub Copilot",
    description: "The pioneer AI pair programmer, suggesting code lines and entire blocks inside the IDE.",
    websiteUrl: "https://github.com/features/copilot",
    companySlug: "microsoft",
    pricingModel: PricingModel.PAID,
    pricingAmount: 10,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Autofill lines", "Context chats", "Test generation", "Security filtering"],
    categorySlugs: ["coding", "productivity", "design"],
    tagSlugs: ["api", "enterprise", "desktop-app"],
  },
  {
    slug: "cursor",
    name: "Cursor",
    description: "An AI-first code editor fork of VS Code supporting deep codebase parsing and auto-edits.",
    websiteUrl: "https://www.cursor.com",
    companySlug: null,
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 20,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Codebase index search", "Auto debug", "Composer multi-file edit", "Copilot migration"],
    categorySlugs: ["coding", "productivity", "design"],
    tagSlugs: ["free-trial", "desktop-app"],
  },

  // 11-20
  {
    slug: "replit",
    name: "Replit Agent",
    description: "An AI coding agent that builds and deploys full stack applications from prompts.",
    websiteUrl: "https://replit.com",
    companySlug: "replit",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 25,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Workspace environment", "Package install automation", "Direct cloud deploy", "Multi-file coding"],
    categorySlugs: ["coding", "productivity", "design"],
    tagSlugs: ["api", "free-trial"],
  },
  {
    slug: "tabnine",
    name: "Tabnine",
    description: "An enterprise-grade, secure private code completion tool hostable locally.",
    websiteUrl: "https://www.tabnine.com",
    companySlug: "tabnine",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 15,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Local self-hosting", "Zero data sharing option", "Legacy syntax support", "Fast inline fill"],
    categorySlugs: ["coding", "productivity"],
    tagSlugs: ["api", "enterprise"],
  },
  {
    slug: "notion-ai",
    name: "Notion AI",
    description: "AI tools integrated inside Notion for summaries, text improvements, and Q&A retrieval.",
    websiteUrl: "https://www.notion.so/product/ai",
    companySlug: "notion",
    pricingModel: PricingModel.PAID,
    pricingAmount: 8,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Notes translation", "Meeting bullet lists", "Dynamic database fill", "Workspace search"],
    categorySlugs: ["productivity", "writing", "research", "seo"],
    tagSlugs: ["browser-extension", "mobile-app"],
  },
  {
    slug: "gamma",
    name: "Gamma",
    description: "Generates beautiful slide decks, pages, and outlines from basic text briefs in seconds.",
    websiteUrl: "https://gamma.app",
    companySlug: "gamma",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 16,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["One-click presentation templates", "Cards structure layouts", "Export to PDF", "Fluid inline sizing"],
    categorySlugs: ["productivity", "design", "marketing"],
    tagSlugs: ["free-trial", "no-code"],
  },
  {
    slug: "otter",
    name: "Otter.ai",
    description: "Transcribes meetings in real time, capturing notes and summaries with action items.",
    websiteUrl: "https://otter.ai",
    companySlug: "otter-ai",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 16.99,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Live transcription", "Auto summaries", "Speaker identification", "Calendar sync"],
    categorySlugs: ["productivity", "audio", "customer-support"],
    tagSlugs: ["mobile-app", "free-trial"],
  },
  {
    slug: "zapier",
    name: "Zapier Central",
    description: "Automate work workflows with AI bots connecting to 6000+ API applications.",
    websiteUrl: "https://zapier.com",
    companySlug: "zapier",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 19.99,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Automations trigger workflows", "Secure API data", "Step debugging filters", "AI execution"],
    categorySlugs: ["productivity", "customer-support"],
    tagSlugs: ["api", "no-code"],
  },
  {
    slug: "jasper",
    name: "Jasper",
    description: "An AI copilot for marketing copy, brand campaigns, and company blog writing.",
    websiteUrl: "https://www.jasper.ai",
    companySlug: "jasper",
    pricingModel: PricingModel.PAID,
    pricingAmount: 39,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Brand voices", "Bulk generation", "Plagiarism check", "SEO mode"],
    categorySlugs: ["writing", "marketing", "seo", "chatbots"],
    tagSlugs: ["enterprise", "free-trial"],
  },
  {
    slug: "copy-ai",
    name: "Copy.ai",
    description: "A chat workflow system designed for sales copy, blogs, and marketing pipelines.",
    websiteUrl: "https://www.copy.ai",
    companySlug: "copy-ai",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 36,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Pipeline builder", "Marketing templates", "Data scraping", "Multi-brand voice"],
    categorySlugs: ["writing", "marketing", "seo", "chatbots"],
    tagSlugs: ["api", "free-trial"],
  },
  {
    slug: "writesonic",
    name: "Writesonic",
    description: "Generates SEO articles, landing page copy, and trains custom support bots.",
    websiteUrl: "https://writesonic.com",
    companySlug: "writesonic",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 15,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["SEO editor", "Fact-checked blogs", "Photosonic generator", "SonicEditor"],
    categorySlugs: ["writing", "marketing", "seo", "chatbots"],
    tagSlugs: ["api", "free-trial"],
  },
  {
    slug: "grammarly",
    name: "Grammarly AI",
    description: "A secure editor plugin that handles grammar, tone adjustment, and text rephrasing.",
    websiteUrl: "https://www.grammarly.com",
    companySlug: "grammarly",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 12,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Context checker", "Tone selector", "Auto rewrite helper", "Extension widgets"],
    categorySlugs: ["writing", "productivity"],
    tagSlugs: ["browser-extension", "desktop-app"],
  },

  // 21-30
  {
    slug: "surfer-seo",
    name: "Surfer SEO",
    description: "Analyses keywords, content structural gaps, and updates page metadata for search visibility.",
    websiteUrl: "https://surferseo.com",
    companySlug: "surfer",
    pricingModel: PricingModel.PAID,
    pricingAmount: 89,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Content score meters", "Audit checklists", "Keyword research maps", "Jasper sync"],
    categorySlugs: ["seo", "marketing", "writing"],
    tagSlugs: ["free-trial"],
  },
  {
    slug: "runway",
    name: "Runway Gen-2",
    description: "A generative video model for generating highly realistic cinemagraphs and sequences.",
    websiteUrl: "https://runwayml.com",
    companySlug: "runway",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 12,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Text to video", "Image to video", "Direct frame upscale", "Camera controls"],
    categorySlugs: ["video", "design", "marketing", "image-generation"],
    tagSlugs: ["api", "free-trial"],
  },
  {
    slug: "synthesia",
    name: "Synthesia",
    description: "Generates high quality video avatars and synthetic voices from simple text scripts.",
    websiteUrl: "https://www.synthesia.io",
    companySlug: "synthesia",
    pricingModel: PricingModel.PAID,
    pricingAmount: 22,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["150+ avatars", "120+ languages", "Custom avatar option", "Direct video templates"],
    categorySlugs: ["video", "marketing", "customer-support"],
    tagSlugs: ["enterprise", "no-code"],
  },
  {
    slug: "heygen",
    name: "HeyGen",
    description: "An AI video generation engine aimed at marketing teams, product tutorials, and support.",
    websiteUrl: "https://www.heygen.com",
    companySlug: "heygen",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 24,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Instant cloning", "Interactive video options", "Direct translates", "Templates"],
    categorySlugs: ["video", "marketing", "customer-support"],
    tagSlugs: ["api", "free-trial"],
  },
  {
    slug: "descript",
    name: "Descript",
    description: "Edit audio and video files as easily as editing a text document transcript.",
    websiteUrl: "https://www.descript.com",
    companySlug: "descript",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 12,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Transcript-based edits", "Cloning text speech", "Background voice removal", "Record screens"],
    categorySlugs: ["video", "audio", "productivity"],
    tagSlugs: ["desktop-app", "free-trial"],
  },
  {
    slug: "elevenlabs",
    name: "ElevenLabs",
    description: "Highly realistic text-to-speech voiceovers and cloned voice translations.",
    websiteUrl: "https://elevenlabs.io",
    companySlug: "elevenlabs",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 5,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Cloning voices", "30+ accents support", "Dubbing templates", "TTS APIs"],
    categorySlugs: ["audio", "video", "marketing"],
    tagSlugs: ["api", "free-trial"],
  },
  {
    slug: "murf-ai",
    name: "Murf AI",
    description: "Studio-quality voiceovers from text for e-learning, presentations, and tutorials.",
    websiteUrl: "https://murf.ai",
    companySlug: "murf",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 19,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["120+ voices", "Pitch adjusts", "Google Slides plugin", "Multi-voice edits"],
    categorySlugs: ["audio", "video", "marketing"],
    tagSlugs: ["free-trial"],
  },
  {
    slug: "suno",
    name: "Suno",
    description: "Creates songs with lyrics, instrumentation, and vocals from simple text prompts.",
    websiteUrl: "https://suno.com",
    companySlug: "suno",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 8,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Complete song audio", "Custom lyric writing", "Stems export support", "Commercial rights option"],
    categorySlugs: ["audio"],
    tagSlugs: ["mobile-app", "free-trial"],
  },
  {
    slug: "character-ai",
    name: "Character.AI",
    description: "Chat with AI characters, celebrities, or build custom personas for roleplay.",
    websiteUrl: "https://character.ai",
    companySlug: "character-ai",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 9.99,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Custom character creation", "Voice chat", "Group chats", "Mobile apps"],
    categorySlugs: ["chatbots", "writing"],
    tagSlugs: ["mobile-app"],
  },
  {
    slug: "poe",
    name: "Poe",
    description: "A single application providing access to multiple AI models in one chat pane.",
    websiteUrl: "https://poe.com",
    companySlug: "quora",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 20,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Multi-model access", "Custom bots creation", "Compute points", "Fast client switching"],
    categorySlugs: ["chatbots", "writing", "coding", "research"],
    tagSlugs: ["api", "mobile-app"],
  },

  // 31-37
  {
    slug: "framer-ai",
    name: "Framer AI",
    description: "Build and publish fully responsive landing page websites from a text prompt.",
    websiteUrl: "https://www.framer.com",
    companySlug: "framer",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 15,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Text to site site layouts", "Visual layout grids", "Built-in CMS", "One-click hosting"],
    categorySlugs: ["design", "productivity", "marketing"],
    tagSlugs: ["no-code", "free-trial"],
  },
  {
    slug: "canva-magic-studio",
    name: "Canva Magic Studio",
    description: "A suite of generative AI tools (write, edit, design) embedded in Canva.",
    websiteUrl: "https://www.canva.com",
    companySlug: "canva",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 12.99,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Magic Eraser background", "Text to visual decks", "Autofill text templates", "Resize assets"],
    categorySlugs: ["design", "marketing", "image-generation"],
    tagSlugs: ["mobile-app", "free-trial"],
  },
  {
    slug: "intercom-fin",
    name: "Intercom Fin",
    description: "An AI support agent answering queries using your workspace database articles.",
    websiteUrl: "https://www.intercom.com",
    companySlug: "intercom",
    pricingModel: PricingModel.PAID,
    pricingAmount: 0.99,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Instant resolution matches", "Multi-source sync", "Safe handoff rules", "Secure logs"],
    categorySlugs: ["customer-support", "chatbots", "productivity"],
    tagSlugs: ["api", "enterprise"],
  },
  {
    slug: "chatbase",
    name: "Chatbase",
    description: "Train a custom support chatbot on your website content or documents.",
    websiteUrl: "https://www.chatbase.co",
    companySlug: "chatbase",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 19,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Sync databases content", "Widget embed frames", "Lead capture forms", "API queries access"],
    categorySlugs: ["customer-support", "chatbots", "coding"],
    tagSlugs: ["api", "free-trial", "no-code"],
  },
  {
    slug: "tidio-lyro",
    name: "Tidio Lyro",
    description: "An conversational AI support bot trained to solve user FAQs instantly.",
    websiteUrl: "https://www.tidio.com",
    companySlug: "tidio",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 39,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["FAQ auto replies", "NLP intent routing", "Analytics logs", "Operator chat panel"],
    categorySlugs: ["customer-support", "chatbots", "productivity"],
    tagSlugs: ["free-trial", "no-code"],
  },
  {
    slug: "bark-audio",
    name: "Bark",
    description: "An open-source text-to-speech voice generator capable of sighs, laughs, and background tracks.",
    websiteUrl: "https://github.com/suno-ai/bark",
    companySlug: "suno",
    pricingModel: PricingModel.FREE,
    pricingAmount: null,
    billingFrequency: BillingFrequency.NA,
    features: ["Open model weights", "Sighs and laughs voice nuances", "Natural voice clones", "Multi-lingual"],
    categorySlugs: ["audio", "research"],
    tagSlugs: ["open-source", "api"],
  },
  {
    slug: "audacity-ai",
    name: "Audacity AI",
    description: "Intel OpenVINO plug-ins adding local audio transcription and vocal filters to Audacity.",
    websiteUrl: "https://github.com/intel/openvino-plugins-audacity",
    companySlug: null,
    pricingModel: PricingModel.FREE,
    pricingAmount: null,
    billingFrequency: BillingFrequency.NA,
    features: ["Local calculations", "Whisper sound transcription", "Noise filters", "OpenVINO support"],
    categorySlugs: ["audio"],
    tagSlugs: ["open-source", "no-code"],
  },

  // 38-50 NEW Audio Tools (to guarantee Audio has 20)
  {
    slug: "speechify",
    name: "Speechify",
    description: "A popular text-to-speech reader that turns articles, docs, and books into spoken audio files.",
    websiteUrl: "https://speechify.com",
    companySlug: "speechify",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 11.58,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Scan physical documents", "Celebrity voice library", "Adjust speed up to 9x", "Highlight sync"],
    categorySlugs: ["audio", "productivity", "writing"],
    tagSlugs: ["mobile-app", "browser-extension"],
  },
  {
    slug: "lovo",
    name: "Lovo Genny",
    description: "A rich AI voice generator and text-to-speech platform with full video production capabilities.",
    websiteUrl: "https://lovo.ai",
    companySlug: "lovo",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 24,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["500+ voices", "Emotive tone adjustments", "Simple script editor", "Video track sync"],
    categorySlugs: ["audio", "video", "marketing", "design"],
    tagSlugs: ["free-trial", "no-code"],
  },
  {
    slug: "podcastle",
    name: "Podcastle",
    description: "A browser-based AI podcast production platform with sound styling and voice cloning.",
    websiteUrl: "https://podcastle.ai",
    companySlug: "podcastle",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 14.99,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Interactive audio edit", "Text to speech reader", "Local noise cancel", "Multi-track sync"],
    categorySlugs: ["audio", "video", "productivity"],
    tagSlugs: ["free-trial", "no-code"],
  },
  {
    slug: "voicemaker",
    name: "Voicemaker",
    description: "A highly customizable online text-to-speech converter supporting multiple speech engines.",
    websiteUrl: "https://voicemaker.in",
    companySlug: "voicemaker",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 10,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Neural voices", "XML tags styling", "Download to MP3/WAV", "Speed pitch adjust"],
    categorySlugs: ["audio", "marketing"],
    tagSlugs: ["api"],
  },
  {
    slug: "resemble-ai",
    name: "Resemble AI",
    description: "Generates speech-to-speech voice translations and secure audio files for agents.",
    websiteUrl: "https://www.resemble.ai",
    companySlug: "resemble",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 29,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Speech-to-speech matching", "Deepfake audio detector", "Low latency streaming API", "Dynamic inserts"],
    categorySlugs: ["audio", "customer-support", "video"],
    tagSlugs: ["api", "enterprise"],
  },
  {
    slug: "natural-readers",
    name: "Natural Readers",
    description: "Read documents aloud instantly using high quality natural sounding AI voices.",
    websiteUrl: "https://www.naturalreaders.com",
    companySlug: "naturalreaders",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 9.99,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Document file uploader", "Chrome read extension", "Download output files", "Voice pitch tuning"],
    categorySlugs: ["audio", "productivity"],
    tagSlugs: ["browser-extension", "mobile-app"],
  },
  {
    slug: "coqui-tts",
    name: "Coqui TTS",
    description: "A deep learning model toolkit for training custom voice generation profiles locally.",
    websiteUrl: "https://github.com/coqui-ai/TTS",
    companySlug: "coqui",
    pricingModel: PricingModel.FREE,
    pricingAmount: null,
    billingFrequency: BillingFrequency.NA,
    features: ["Multi-speaker libraries", "Self training scripts", "Zero cost local compilation", "API hooks"],
    categorySlugs: ["audio", "coding"],
    tagSlugs: ["open-source", "api"],
  },
  {
    slug: "wellsaid-labs",
    name: "WellSaid Labs",
    description: "Enterprise voice synthesis enabling teams to draft voiceovers instantly.",
    websiteUrl: "https://wellsaidlabs.com",
    companySlug: "wellsaidlabs",
    pricingModel: PricingModel.PAID,
    pricingAmount: 49,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Corporate security rules", "High-fidelity voice profiles", "Fast script rendering", "Team sync projects"],
    categorySlugs: ["audio", "customer-support"],
    tagSlugs: ["enterprise", "free-trial"],
  },
  {
    slug: "soundraw",
    name: "Soundraw",
    description: "An AI music generator that lets you customize song tracks to fit video lengths.",
    websiteUrl: "https://soundraw.io",
    companySlug: "soundraw",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 19.99,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Track custom duration", "Instrument selections", "Stem file download", "Royalty free license"],
    categorySlugs: ["audio", "design", "video"],
    tagSlugs: ["no-code"],
  },
  {
    slug: "boomy",
    name: "Boomy Music",
    description: "Create original songs in seconds, release them onto streaming platforms, and earn royalties.",
    websiteUrl: "https://boomy.com",
    companySlug: null,
    pricingModel: PricingModel.FREE,
    pricingAmount: null,
    billingFrequency: BillingFrequency.NA,
    features: ["Instant algorithm tracks", "Dolby audio polish", "Release on Spotify/Apple", "Track editing"],
    categorySlugs: ["audio", "design"],
    tagSlugs: ["no-code"],
  },
  {
    slug: "mubert",
    name: "Mubert",
    description: "Generates custom real-time music background tracks to accompany content streams.",
    websiteUrl: "https://mubert.com",
    companySlug: null,
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 14,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Infinite streams audio", "Direct video link licensing", "Content tag mood matching", "API loops"],
    categorySlugs: ["audio", "design"],
    tagSlugs: ["api", "free-trial"],
  },
  {
    slug: "beatoven",
    name: "Beatoven.ai",
    description: "An easy AI music generator that drafts unique sound tracks for corporate videos.",
    websiteUrl: "https://www.beatoven.ai",
    companySlug: null,
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 20,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Video scene upload", "Mood track splits", "Multi-genre instruments", "Royalty-free downloads"],
    categorySlugs: ["audio", "design"],
    tagSlugs: ["free-trial"],
  },

  // 51-60 NEW Video Tools (to guarantee Video has 20)
  {
    slug: "invideo",
    name: "InVideo AI",
    description: "Generates scripts, selects stock video, adds subtitles, and creates ready-to-publish videos.",
    websiteUrl: "https://invideo.io",
    companySlug: "invideo",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 25,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Script prompts", "Automated stock inserts", "Subtitle voiceover rendering", "Canvas editor"],
    categorySlugs: ["video", "marketing", "design"],
    tagSlugs: ["free-trial", "no-code"],
  },
  {
    slug: "capcut-ai",
    name: "CapCut AI Tools",
    description: "ByteDance's editing platform including smart auto-cut, AI voiceovers, and background removers.",
    websiteUrl: "https://www.capcut.com",
    companySlug: "capcut",
    pricingModel: PricingModel.FREE,
    pricingAmount: null,
    billingFrequency: BillingFrequency.NA,
    features: ["Auto captioning transcript", "AI body effects templates", "Background key remover", "Mobile sync projects"],
    categorySlugs: ["video", "design", "marketing"],
    tagSlugs: ["mobile-app", "no-code"],
  },
  {
    slug: "pictory",
    name: "Pictory",
    description: "Turn blogs and text articles automatically into short visual social videos.",
    websiteUrl: "https://pictory.ai",
    companySlug: "pictory",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 19,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Article to video convert", "Auto video highlights selection", "Bulk caption generation", "Brand logo insert"],
    categorySlugs: ["video", "marketing", "writing"],
    tagSlugs: ["free-trial"],
  },
  {
    slug: "veed",
    name: "Veed.io",
    description: "A fast online video editor that automates subtitle styling, cuts, and assets addition.",
    websiteUrl: "https://www.veed.io",
    companySlug: "veed",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 18,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Subtitle font styling", "Clean audio filter", "Screen recorder widget", "Direct resize exports"],
    categorySlugs: ["video", "design", "productivity"],
    tagSlugs: ["free-trial", "browser-extension"],
  },
  {
    slug: "colossyan",
    name: "Colossyan Creator",
    description: "Drafts corporate learning videos using natural looking AI actors and localized scripts.",
    websiteUrl: "https://www.colossyan.com",
    companySlug: "colossyan",
    pricingModel: PricingModel.PAID,
    pricingAmount: 35,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["AI actors scenarios", "Auto translate localized templates", "PDF to video converter", "Quiz insert widgets"],
    categorySlugs: ["video", "customer-support", "marketing"],
    tagSlugs: ["enterprise", "free-trial"],
  },
  {
    slug: "elai",
    name: "Elai.io",
    description: "Build interactive video tutorials from presentation slides using digital avatars.",
    websiteUrl: "https://elai.io",
    companySlug: "elai",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 23,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Slides to video render", "Avatar dialogue settings", "Custom voice cloning integration", "LMS format exports"],
    categorySlugs: ["video", "customer-support", "marketing"],
    tagSlugs: ["api", "free-trial"],
  },
  {
    slug: "fliki",
    name: "Fliki",
    description: "Create videos from blog posts using neural text-to-speech voiceovers and stock clips.",
    websiteUrl: "https://fliki.ai",
    companySlug: "fliki",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 21,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Blog link parsing", "Text to voice synthesis", "Audiobook creator module", "Large stock asset vault"],
    categorySlugs: ["video", "audio", "writing"],
    tagSlugs: ["free-trial", "no-code"],
  },
  {
    slug: "lumen5",
    name: "Lumen5",
    description: "A drag-and-drop video creator that formats text outlines into social campaign videos.",
    websiteUrl: "https://lumen5.com",
    companySlug: "lumen5",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 19,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Text layouts library", "Media templates mapping", "Drag and drop positioning", "Watermark-free option"],
    categorySlugs: ["video", "marketing", "design"],
    tagSlugs: ["no-code"],
  },
  {
    slug: "wave-video",
    name: "Wave.video",
    description: "Includes video hosting, live streaming studio, and automated generative clip editors.",
    websiteUrl: "https://wave.video",
    companySlug: null,
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 16,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Cloud video hosting", "Live streaming console", "AI video outlines", "Direct resize trims"],
    categorySlugs: ["video", "marketing"],
    tagSlugs: ["free-trial"],
  },
  {
    slug: "deepbrain-ai",
    name: "DeepBrain AI",
    description: "Generates high quality customer assistant videos with realistic animated virtual humans.",
    websiteUrl: "https://www.deepbrain.io",
    companySlug: null,
    pricingModel: PricingModel.PAID,
    pricingAmount: 30,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Conversational avatars", "Interactive kiosk layout support", "Fast text rendering API", "3D virtual rooms"],
    categorySlugs: ["video", "customer-support"],
    tagSlugs: ["enterprise"],
  },

  // 61-74 NEW SEO Tools (to guarantee SEO has 20)
  {
    slug: "semrush",
    name: "Semrush AI",
    description: "A marketing suite that writes SEO blogs, suggests page edits, and manages campaigns.",
    websiteUrl: "https://www.semrush.com",
    companySlug: "semrush",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 129.95,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Keywords gap tracking", "AI content writing templates", "SERP ranking charts", "Competitor audits"],
    categorySlugs: ["seo", "marketing", "research"],
    tagSlugs: ["api", "enterprise"],
  },
  {
    slug: "ahrefs",
    name: "Ahrefs AI Tools",
    description: "Keyword search estimators, content auditing tools, and backlink network graphs.",
    websiteUrl: "https://ahrefs.com",
    companySlug: "ahrefs",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 99,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Keywords ideas map", "Site explorer audit", "Link profile charts", "Rank tracker sync"],
    categorySlugs: ["seo", "marketing", "research"],
    tagSlugs: ["api"],
  },
  {
    slug: "moz",
    name: "Moz Pro AI",
    description: "Estimates domain authority scores, keyword parameters, and crawls site layouts.",
    websiteUrl: "https://moz.com",
    companySlug: "moz",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 99,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Domain Authority score tracker", "Keywords explorer dashboard", "Page audit crawler", "Competitive overlap maps"],
    categorySlugs: ["seo", "marketing", "research"],
    tagSlugs: ["browser-extension"],
  },
  {
    slug: "screaming-frog",
    name: "Screaming Frog SEO Spider",
    description: "Crawls massive websites to analyze broken links, duplicate titles, and server status codes.",
    websiteUrl: "https://www.screamingfrog.co.uk/seo-spider/",
    companySlug: "screamingfrog",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 259,
    billingFrequency: BillingFrequency.YEARLY,
    features: ["Full site page audits", "XML sitemap generation", "Google Search Console API sync", "Broken redirects checks"],
    categorySlugs: ["seo", "productivity"],
    tagSlugs: ["desktop-app", "api"],
  },
  {
    slug: "clearscope",
    name: "Clearscope",
    description: "Optimizes blog draft keywords and headings based on top-performing search queries.",
    websiteUrl: "https://www.clearscope.io",
    companySlug: "clearscope",
    pricingModel: PricingModel.PAID,
    pricingAmount: 170,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Live grading content charts", "Competitor structure tables", "Google Docs addon", "Keywords maps"],
    categorySlugs: ["seo", "writing", "marketing"],
    tagSlugs: ["browser-extension", "enterprise"],
  },
  {
    slug: "seo-wind",
    name: "SEOWind",
    description: "Writes outline blueprints and fully drafts SEO blogs using cited competitive research.",
    websiteUrl: "https://seowind.io",
    companySlug: null,
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 49,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Competitor outline parsing", "Internal links mapping", "Brand style guides", "One-click generation"],
    categorySlugs: ["seo", "writing", "marketing"],
    tagSlugs: ["free-trial"],
  },
  {
    slug: "marketmuse",
    name: "MarketMuse",
    description: "Audits entire websites to identify high value topics where your pages lack coverage.",
    websiteUrl: "https://www.marketmuse.com",
    companySlug: "marketmuse",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 149,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Site-wide gaps mapping", "Topic authority score metrics", "Optimize text editor", "Competitor research"],
    categorySlugs: ["seo", "writing", "research"],
    tagSlugs: ["free-trial", "enterprise"],
  },
  {
    slug: "frase",
    name: "Frase",
    description: "Constructs outline briefs, drafts answers, and builds internal content structures.",
    websiteUrl: "https://www.frase.io",
    companySlug: "frase",
    pricingModel: PricingModel.PAID,
    pricingAmount: 14.99,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Outline constructor widgets", "Answer engine queries mapping", "Live text score indicator", "Team sharing"],
    categorySlugs: ["seo", "writing", "chatbots"],
    tagSlugs: ["free-trial"],
  },
  {
    slug: "rankmath",
    name: "RankMath AI SEO",
    description: "A WordPress plugin that automates page schema, meta tags, and internal link suggestions.",
    websiteUrl: "https://rankmath.com",
    companySlug: "rankmath",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 5.99,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["WordPress schema generator", "Redirects manager console", "GSC index tracking", "Keywords suggestion"],
    categorySlugs: ["seo", "productivity"],
    tagSlugs: ["no-code"],
  },
  {
    slug: "yoast",
    name: "Yoast SEO AI",
    description: "Yoast's WordPress integration that drafts meta descriptions and formats layouts for readability.",
    websiteUrl: "https://yoast.com",
    companySlug: "yoast",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 9.90,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Meta tags template engine", "Flesch readability score checker", "Breadcrumbs console", "Redirect automation"],
    categorySlugs: ["seo", "productivity"],
    tagSlugs: ["no-code"],
  },
  {
    slug: "serpstat",
    name: "Serpstat",
    description: "An SEO platform for rank tracking, competitor audits, and backlink analysis.",
    websiteUrl: "https://serpstat.com",
    companySlug: null,
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 59,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Daily rank tracking updates", "Site audit error logs", "Backlinks monitor", "API access"],
    categorySlugs: ["seo", "marketing"],
    tagSlugs: ["api"],
  },
  {
    slug: "spyfu",
    name: "SpyFu",
    description: "Finds the exact keywords and ad campaigns that competitors are bidding on in search.",
    websiteUrl: "https://www.spyfu.com",
    companySlug: null,
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 39,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Competitors history logs", "PPC ad keywords lookup", "Domain ranking charts", "CSV report export"],
    categorySlugs: ["seo", "marketing", "research"],
    tagSlugs: ["free-trial"],
  },
  {
    slug: "kwfinder",
    name: "KWFinder by Mangools",
    description: "A keyword tool that focuses on finding long-tail queries with low search difficulty.",
    websiteUrl: "https://mangools.com/kwfinder/",
    companySlug: null,
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 29,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Keyword difficulty score", "Search volume trends", "SERP analysis reports", "Multi-location filters"],
    categorySlugs: ["seo", "research"],
    tagSlugs: ["free-trial"],
  },
  {
    slug: "answerthepublic",
    name: "AnswerThePublic",
    description: "Visualizes the search questions and phrases autocomplete engines suggest for keywords.",
    websiteUrl: "https://answerthepublic.com",
    companySlug: null,
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 9,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Questions wheel graph", "Daily search alert settings", "CSV downloads console", "Topic comparison mapping"],
    categorySlugs: ["seo", "research", "writing"],
    tagSlugs: ["no-code"],
  },

  // 75-77 NEW Research Tools (to guarantee Research has 20)
  {
    slug: "consensus",
    name: "Consensus",
    description: "An AI search engine that extracts findings directly from scientific peer-reviewed papers.",
    websiteUrl: "https://consensus.app",
    companySlug: "consensus",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 9.99,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Extract study findings", "Consensus meter graphs", "Citations layout formats", "Copilot summary answers"],
    categorySlugs: ["research", "productivity"],
    tagSlugs: ["no-code", "free-trial"],
  },
  {
    slug: "elicit",
    name: "Elicit",
    description: "Analyze datasets, summarize papers, and build table matrices from scientific literature.",
    websiteUrl: "https://elicit.com",
    companySlug: "elicit",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 12,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Study metadata table extractor", "Semantic citation lookup", "Auto summaries mapping", "Compare parameters"],
    categorySlugs: ["research", "productivity"],
    tagSlugs: ["free-trial"],
  },
  {
    slug: "scite",
    name: "Scite.ai",
    description: "Validates statements by checking if subsequent papers supported or contradicted the findings.",
    websiteUrl: "https://scite.ai",
    companySlug: "scite",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 20,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Smart Citations graph", "Context reference snippet", "Reference checking tool", "Chrome extension widget"],
    categorySlugs: ["research", "productivity"],
    tagSlugs: ["browser-extension", "api"],
  },

  // 78-88 NEW Coding Tools (to guarantee Coding has 20)
  {
    slug: "v0-vercel",
    name: "v0 by Vercel",
    description: "Produces production-ready React layouts and Tailwind styling from simple text briefs.",
    websiteUrl: "https://v0.dev",
    companySlug: null,
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 20,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Tailwind component styling", "Figma copy-paste formatting", "React blocks templates", "Next.js routing"],
    categorySlugs: ["coding", "design", "productivity"],
    tagSlugs: ["free-trial", "api"],
  },
  {
    slug: "phind",
    name: "Phind",
    description: "A search engine built specifically for developers, providing code answers with documentation links.",
    websiteUrl: "https://www.phind.com",
    companySlug: null,
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 20,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Fast developer search", "Complete code blocks replies", "Codebase file attachment", "Web parsing docs"],
    categorySlugs: ["coding", "chatbots", "research"],
    tagSlugs: ["api", "mobile-app"],
  },
  {
    slug: "blackbox",
    name: "Blackbox AI",
    description: "Auto-completes and suggests code blocks in real time inside 20+ coding environments.",
    websiteUrl: "https://www.useblackbox.io",
    companySlug: null,
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 9.99,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["20+ IDE extensions", "Text to code generation", "Auto code documentation", "Fast compiler debugger"],
    categorySlugs: ["coding", "chatbots"],
    tagSlugs: ["api", "free-trial"],
  },
  {
    slug: "cody",
    name: "Sourcegraph Cody",
    description: "Sourcegraph's AI assistant that parses your codebase to answer complex architectural queries.",
    websiteUrl: "https://sourcegraph.com/cody",
    companySlug: null,
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 9,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Codebase structural search", "Auto debug console scripts", "Multi-file context lookup", "IDE sidebar widgets"],
    categorySlugs: ["coding", "productivity"],
    tagSlugs: ["open-source", "enterprise"],
  },
  {
    slug: "amazon-q",
    name: "Amazon Q Developer",
    description: "AWS's assistant designed to code, debug, test, and perform upgrades on your cloud apps.",
    websiteUrl: "https://aws.amazon.com/q/",
    companySlug: null,
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 19,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["AWS cloud console wizard", "Legacy app upgrades (Java/Python)", "Security audit checks", "Autofill coding"],
    categorySlugs: ["coding", "productivity", "chatbots"],
    tagSlugs: ["enterprise", "desktop-app"],
  },
  {
    slug: "copilot-workspace",
    name: "GitHub Copilot Workspace",
    description: "An AI-powered development environment that details plans and writes code from GitHub Issues.",
    websiteUrl: "https://github.com/features/copilot-workspace",
    companySlug: "microsoft",
    pricingModel: PricingModel.PAID,
    pricingAmount: 20,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Plan layout checklists", "GitHub issues tracker sync", "Sandboxed workspace code run", "Code merges editor"],
    categorySlugs: ["coding", "productivity"],
    tagSlugs: ["enterprise"],
  },
  {
    slug: "warp-terminal",
    name: "Warp",
    description: "A terminal interface with an integrated AI agent to write shell commands.",
    websiteUrl: "https://www.warp.dev",
    companySlug: null,
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 15,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Natural language shell query", "Saved commands console blocks", "AI script explainer", "Team workflow sync"],
    categorySlugs: ["coding", "productivity"],
    tagSlugs: ["desktop-app", "free-trial"],
  },
  {
    slug: "continue-dev",
    name: "Continue",
    description: "An open-source IDE plugin that lets you connect custom local models to your coding pane.",
    websiteUrl: "https://www.continue.dev",
    companySlug: null,
    pricingModel: PricingModel.FREE,
    pricingAmount: null,
    billingFrequency: BillingFrequency.NA,
    features: ["Local model config sync", "Custom model prompt templates", "Open-source codebase", "Context file attachments"],
    categorySlugs: ["coding", "productivity"],
    tagSlugs: ["open-source", "desktop-app"],
  },
  {
    slug: "sweep-ai",
    name: "Sweep AI",
    description: "An AI coding agent that reviews bug tickets and opens pull requests with fixes.",
    websiteUrl: "https://sweep.dev",
    companySlug: null,
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 48,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["PR auto creation", "Bug logs parser automation", "RegEx structure code match", "Code refactoring"],
    categorySlugs: ["coding", "productivity"],
    tagSlugs: ["api", "free-trial"],
  },
  {
    slug: "sourcery",
    name: "Sourcery",
    description: "Automates code reviews, refactoring suggestions, and code quality scoring.",
    websiteUrl: "https://sourcery.ai",
    companySlug: null,
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 12,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Live IDE refactoring recommendations", "Complexity code score metrics", "Duplicate snippet finder", "Format checks"],
    categorySlugs: ["coding", "productivity"],
    tagSlugs: ["api", "desktop-app"],
  },
  {
    slug: "gitbutler",
    name: "GitButler",
    description: "A git branch manager that lets you work on multiple separate features concurrently.",
    websiteUrl: "https://gitbutler.com",
    companySlug: null,
    pricingModel: PricingModel.FREE,
    pricingAmount: null,
    billingFrequency: BillingFrequency.NA,
    features: ["Virtual branch separation", "Conflict resolution editor", "Commits flow timelines", "Open-source client"],
    categorySlugs: ["coding", "productivity"],
    tagSlugs: ["open-source", "desktop-app"],
  },

  // 89-102 NEW Image Generation Tools (to guarantee Image Gen has 20)
  {
    slug: "craiyon",
    name: "Craiyon",
    description: "A free online image generator producing drawings, photos, and abstract styles.",
    websiteUrl: "https://www.craiyon.com",
    companySlug: null,
    pricingModel: PricingModel.FREE,
    pricingAmount: null,
    billingFrequency: BillingFrequency.NA,
    features: ["Prompt generation tags", "Negative prompt keywords blocker", "Grid image output select", "Quick search trends"],
    categorySlugs: ["image-generation", "design"],
    tagSlugs: ["no-code"],
  },
  {
    slug: "dall-e-3",
    name: "DALL-E 3",
    description: "OpenAI's image generation system, integrated inside ChatGPT for detailed edits.",
    websiteUrl: "https://openai.com/dall-e-3",
    companySlug: "openai",
    pricingModel: PricingModel.PAID,
    pricingAmount: 20,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["In-chat prompt adjustments", "High text render fidelity", "Aspect ratio settings", "Style presets"],
    categorySlugs: ["image-generation", "design", "chatbots"],
    tagSlugs: ["api", "enterprise"],
  },
  {
    slug: "clipdrop",
    name: "Clipdrop by Jasper",
    description: "A creative suite offering image relighting, upscale edits, and background removal.",
    websiteUrl: "https://clipdrop.co",
    companySlug: "jasper",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 9,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Relighting studio options", "Background remover eraser", "Doodle to design converter", "API hooks"],
    categorySlugs: ["image-generation", "design"],
    tagSlugs: ["api", "free-trial"],
  },
  {
    slug: "recraft",
    name: "Recraft",
    description: "An AI designer workspace specialized in vector assets, icons, and illustrations.",
    websiteUrl: "https://www.recraft.ai",
    companySlug: null,
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 48,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["SVG vector download options", "Icon set matching templates", "Infinity canvas workspace", "Style cloning"],
    categorySlugs: ["image-generation", "design"],
    tagSlugs: ["free-trial"],
  },
  {
    slug: "photoroom",
    name: "Photoroom",
    description: "An e-commerce photo editor that automatically removes backgrounds and adds studio lighting.",
    websiteUrl: "https://www.photoroom.com",
    companySlug: null,
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 9.99,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Product studio backdrops", "Batch image background remover", "Shadow casting templates", "Mobile scanner"],
    categorySlugs: ["image-generation", "design", "marketing"],
    tagSlugs: ["mobile-app", "api"],
  },
  {
    slug: "pixelcut",
    name: "Pixelcut",
    description: "An image editing workspace for mobile listings, creating fast catalog pictures.",
    websiteUrl: "https://www.pixelcut.ai",
    companySlug: null,
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 5.99,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Object eraser styling", "Product backdrop sets", "Direct social resize template", "Upscaler engine"],
    categorySlugs: ["image-generation", "design"],
    tagSlugs: ["mobile-app", "no-code"],
  },
  {
    slug: "remove-bg",
    name: "Remove.bg",
    description: "A fast utility that deletes image backgrounds in one click.",
    websiteUrl: "https://www.remove.bg",
    companySlug: null,
    pricingModel: PricingModel.FREE,
    pricingAmount: null,
    billingFrequency: BillingFrequency.NA,
    features: ["Instant PNG cutout download", "Direct API integration keys", "Bulk CLI folder process", "Custom backgrounds"],
    categorySlugs: ["image-generation", "design"],
    tagSlugs: ["api", "no-code"],
  },
  {
    slug: "runway-gen3",
    name: "Runway Gen-3 Alpha",
    description: "Generates high quality video sequences and cinematic imagery from prompts.",
    websiteUrl: "https://runwayml.com/blog/introducing-gen-3-alpha/",
    companySlug: "runway",
    pricingModel: PricingModel.PAID,
    pricingAmount: 15,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Ultra-realistic video segments", "Camera motion panels", "Aspect ratio selections", "High resolution outputs"],
    categorySlugs: ["image-generation", "video", "design"],
    tagSlugs: ["api"],
  },
  {
    slug: "dreamstudio",
    name: "DreamStudio by Stability AI",
    description: "A web platform for generating images using the Stable Diffusion models.",
    websiteUrl: "https://dreamstudio.ai",
    companySlug: "stability-ai",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 10,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Custom model weights selectors", "Negative prompt inputs", "Steps rendering difficulty", "Direct API credits"],
    categorySlugs: ["image-generation", "design"],
    tagSlugs: ["api", "free-trial"],
  },
  {
    slug: "playground-ai",
    name: "Playground AI",
    description: "An image editor canvas combining text prompts, image layering, and outpainting.",
    websiteUrl: "https://playgroundai.com",
    companySlug: null,
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 15,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Infinite canvas layer edit", "Outpainting border expand", "Community asset clone", "Style preset sliders"],
    categorySlugs: ["image-generation", "design"],
    tagSlugs: ["free-trial"],
  },
  {
    slug: "seaart",
    name: "SeaArt AI",
    description: "An asset creation tool featuring a rich model library of styles.",
    websiteUrl: "https://www.seaart.ai",
    companySlug: null,
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 9.90,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Community styles catalog", "Upscaling detail engine", "Img2Img sketch layouts", "Pose clone parameters"],
    categorySlugs: ["image-generation", "design"],
    tagSlugs: ["free-trial"],
  },
  {
    slug: "artbreeder",
    name: "Artbreeder",
    description: "Collages shapes, details, and prompts to produce portrait paintings and landscapes.",
    websiteUrl: "https://www.artbreeder.com",
    companySlug: null,
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 8.99,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Portrait genes sliders", "Collage shape templates", "Community art tree remixes", "High res options"],
    categorySlugs: ["image-generation", "design"],
    tagSlugs: ["no-code"],
  },
  {
    slug: "nightcafe",
    name: "NightCafe Creator",
    description: "A community platform focused on prompt image generator challenges.",
    websiteUrl: "https://creator.nightcafe.studio",
    companySlug: null,
    pricingModel: PricingModel.FREE,
    pricingAmount: null,
    billingFrequency: BillingFrequency.NA,
    features: ["Daily visual community contests", "Multi-model selection options", "Credit tokens awards", "Print physical canvas"],
    categorySlugs: ["image-generation", "design"],
    tagSlugs: ["no-code"],
  },
  {
    slug: "starryai",
    name: "StarryAI",
    description: "A mobile application producing visual arts from text descriptions.",
    websiteUrl: "https://starryai.com",
    companySlug: null,
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 11.99,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Mobile layouts preset styles", "Aspect ratios grids selection", "Upscaling detail enhancement", "Direct print shares"],
    categorySlugs: ["image-generation", "design"],
    tagSlugs: ["mobile-app", "free-trial"],
  },

  // 103-107 NEW Customer Support Tools (to guarantee Support has 20)
  {
    slug: "zendesk-ai",
    name: "Zendesk Advanced AI",
    description: "Automates agent routing, ticket summary reports, and suggests macro replies.",
    websiteUrl: "https://www.zendesk.com/service/ai/",
    companySlug: "zendesk",
    pricingModel: PricingModel.PAID,
    pricingAmount: 115,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Ticket sentiment parser", "Auto routing macro suggestions", "Audit logs tracking", "Custom bots integrations"],
    categorySlugs: ["customer-support", "productivity"],
    tagSlugs: ["enterprise", "api"],
  },
  {
    slug: "freshworks-ai",
    name: "Freshworks Freddy AI",
    description: "Automates support operations with conversation bots, intent summaries, and analytics.",
    websiteUrl: "https://www.freshworks.com/freddy-ai/",
    companySlug: "freshworks",
    pricingModel: PricingModel.PAID,
    pricingAmount: 29,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Intent mapping lists", "Smart suggestions macros", "Bot dialog templates editor", "Live chat console"],
    categorySlugs: ["customer-support", "productivity"],
    tagSlugs: ["enterprise", "free-trial"],
  },
  {
    slug: "salesforce-einstein",
    name: "Salesforce Einstein AI",
    description: "CRM intelligence that logs calls, summarizes cases, and automates emails.",
    websiteUrl: "https://www.salesforce.com/products/einstein/",
    companySlug: "salesforce",
    pricingModel: PricingModel.PAID,
    pricingAmount: 50,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Case summaries automation", "Workflow routing rules", "Customer interaction dashboards", "Call logging reports"],
    categorySlugs: ["customer-support", "productivity", "marketing"],
    tagSlugs: ["enterprise"],
  },
  {
    slug: "zoho-zia",
    name: "Zoho Zia AI",
    description: "An assistant that answers ticket queries, reads trends, and suggests answers.",
    websiteUrl: "https://www.zoho.com/zia/",
    companySlug: "zoho",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 12,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Ticket tag automation", "Trend analysis graph metrics", "Macro email reply checker", "API connectivity"],
    categorySlugs: ["customer-support", "productivity", "marketing"],
    tagSlugs: ["api", "free-trial"],
  },
  {
    slug: "ultimate-ai",
    name: "Ultimate.ai",
    description: "An conversational AI bot that automates support chats in 100+ languages.",
    websiteUrl: "https://www.ultimate.ai",
    companySlug: "ultimate",
    pricingModel: PricingModel.PAID,
    pricingAmount: 500,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Support console widget sync", "NLP custom intent engine", "CRM chat logs audit", "Languages translations"],
    categorySlugs: ["customer-support", "chatbots"],
    tagSlugs: ["enterprise", "api"],
  },
  {
    slug: "chatpdf",
    name: "ChatPDF",
    description: "An AI-powered tool that allows users to interactively chat with any PDF document to extract insights.",
    websiteUrl: "https://www.chatpdf.com",
    companySlug: "openai",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 5,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["PDF upload", "Interactive Q&A chat", "Summary generation"],
    categorySlugs: ["productivity", "data-analysis"],
    tagSlugs: ["free-trial"]
  },
  {
    slug: "kittl",
    name: "Kittl",
    description: "An intuitive graphic design platform with built-in AI tools for vector art and text effects generation.",
    websiteUrl: "https://www.kittl.com",
    companySlug: "canva",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 15,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["AI vector generator", "Text generation assets", "Premium templates"],
    categorySlugs: ["image-generation", "marketing"],
    tagSlugs: ["free-trial"]
  },
  {
    slug: "julius-ai",
    name: "Julius AI",
    description: "An advanced AI data analyst that executes Python code to clean data and generate graphs.",
    websiteUrl: "https://julius.ai",
    companySlug: "openai",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 20,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Code execution environments", "Beautiful charting options", "Spreadsheet uploads"],
    categorySlugs: ["data-analysis", "productivity"],
    tagSlugs: ["free-trial", "api"]
  },
  {
    slug: "beautiful-ai",
    name: "Beautiful.ai",
    description: "An AI-powered presentation platform that automatically applies professional brand guidelines to slides.",
    websiteUrl: "https://www.beautiful.ai",
    companySlug: "canva",
    pricingModel: PricingModel.PAID,
    pricingAmount: 12,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Brand guardrails", "Smart design template systems", "Real-time sync"],
    categorySlugs: ["productivity", "marketing"],
    tagSlugs: ["enterprise"]
  },
  {
    slug: "harvey-ai",
    name: "Harvey AI",
    description: "A secure AI platform built for law firms to automate legal research and contract drafting.",
    websiteUrl: "https://www.harvey.ai",
    companySlug: "openai",
    pricingModel: PricingModel.PAID,
    pricingAmount: 89,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Secure legal database sync", "Contract clause drafting", "Jurisprudence lookups"],
    categorySlugs: ["productivity"],
    tagSlugs: ["enterprise"]
  },
  {
    slug: "pimeyes",
    name: "Pimeyes",
    description: "A reverse image search engine that uses facial recognition to locate photos containing specific faces.",
    websiteUrl: "https://pimeyes.com",
    companySlug: "google",
    pricingModel: PricingModel.PAID,
    pricingAmount: 29.99,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Facial mapping scans", "Source link exports", "Alert notifications"],
    categorySlugs: ["data-analysis"],
    tagSlugs: ["api"]
  },
  {
    slug: "feathery",
    name: "Feathery",
    description: "An enterprise-grade AI form builder that streamlines user onboarding flow creation and database integrations.",
    websiteUrl: "https://www.feathery.io",
    companySlug: "zapier",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 49,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Logic flows builder", "Webhook systems integration", "Secure storage logs"],
    categorySlugs: ["productivity"],
    tagSlugs: ["api", "free-trial"]
  },
  {
    slug: "rewind-ai",
    name: "Rewind AI",
    description: "A personalized AI assistant that records your screen and audio locally to help you recall anything you saw.",
    websiteUrl: "https://www.rewind.ai",
    companySlug: "microsoft",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 19,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Local compression engines", "Optical character mapping", "Timeline tracking"],
    categorySlugs: ["productivity"],
    tagSlugs: ["free-trial"]
  },
  {
    slug: "luma-dream-machine",
    name: "Luma Dream Machine",
    description: "A high-fidelity video generator that creates cinematic, realistic 5-second video clips from text prompts.",
    websiteUrl: "https://lumalabs.ai",
    companySlug: "google",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 29.99,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Cinematic video styles", "Prompt engineering inputs", "Fast processing options"],
    categorySlugs: ["image-generation", "video"],
    tagSlugs: ["free-trial", "api"]
  },
  {
    slug: "udio",
    name: "Udio",
    description: "An AI-powered music generation platform that creates full songs with custom vocals, lyrics, and arrangements.",
    websiteUrl: "https://www.udio.com",
    companySlug: "suno",
    pricingModel: PricingModel.FREEMIUM,
    pricingAmount: 10,
    billingFrequency: BillingFrequency.MONTHLY,
    features: ["Multilingual vocals synthesis", "Custom lyrics generators", "Track length extensions"],
    categorySlugs: ["audio", "marketing"],
    tagSlugs: ["free-trial"]
  },
];

// ---------------------------------------------------------------------------
// Reviews — a handful of realistic sample reviews spread across popular tools
// ---------------------------------------------------------------------------

const REVIEWS: { toolSlug: string; rating: number; comment: string }[] = [
  { toolSlug: "chatgpt", rating: 5, comment: "Genuinely useful every day for drafting and debugging." },
  { toolSlug: "chatgpt", rating: 4, comment: "Great all-rounder, though it occasionally gets facts wrong." },
  { toolSlug: "claude", rating: 5, comment: "The long context window makes it my go-to for reviewing codebases." },
  { toolSlug: "midjourney", rating: 5, comment: "Best-in-class image quality, highly creative compositions." },
  { toolSlug: "cursor", rating: 5, comment: "Saved me hours refactoring a legacy Next.js app." },
  { toolSlug: "notion-ai", rating: 4, comment: "Handy for quick summaries inside docs." },
  { toolSlug: "elevenlabs", rating: 5, comment: "Voice cloning quality is shockingly close to the source recordings." },
  { toolSlug: "perplexity", rating: 4, comment: "Citations make it easy to double check sources compared to other bots." },
];

async function main() {
  const companyBySlug = new Map<string, { id: string }>();

  const allTools = TOOLS;

  console.log("Cleaning up old companies...");
  const activeCompanySlugs = COMPANIES.map((c) => c.slug);
  await prisma.company.deleteMany({ where: { slug: { notIn: activeCompanySlugs } } });

  console.log("Upserting companies...");
  for (const c of COMPANIES) {
    const company = await prisma.company.upsert({
      where: { slug: c.slug },
      update: { name: c.name, logoUrl: logoFor(c.domain) },
      create: { slug: c.slug, name: c.name, logoUrl: logoFor(c.domain) },
    });
    companyBySlug.set(c.slug, company);
  }
  console.log(`Upserted ${companyBySlug.size} companies.`);

  console.log("Upserting categories...");
  const categoryBySlug = new Map<string, { id: string }>();
  for (const name of CATEGORY_NAMES) {
    const slug = name.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");
    const category = await prisma.category.upsert({
      where: { slug },
      update: { name },
      create: { slug, name },
    });
    categoryBySlug.set(slug, category);
  }
  console.log(`Upserted ${categoryBySlug.size} categories.`);

  console.log("Upserting tags...");
  const tagBySlug = new Map<string, { id: string }>();
  for (const name of TAG_NAMES) {
    const slug = name.toLowerCase().replace(/ /g, "-");
    const tag = await prisma.tag.upsert({
      where: { slug },
      update: { name },
      create: { slug, name },
    });
    tagBySlug.set(slug, tag);
  }
  console.log(`Upserted ${tagBySlug.size} tags.`);

  console.log("Upserting demo users...");
  const demoUsers = [
    { email: "reviewer.one@example.com", name: "Aditi Rao" },
    { email: "reviewer.two@example.com", name: "Marcus Webb" },
  ];
  const users = await Promise.all(
    demoUsers.map((u) =>
      prisma.user.upsert({
        where: { email: u.email },
        update: { name: u.name },
        create: { email: u.email, name: u.name },
      })
    )
  );
  console.log(`Upserted ${users.length} demo users.`);

  console.log("Cleaning up old tools...");
  const activeToolSlugs = allTools.map((t) => t.slug);
  await prisma.tool.deleteMany({ where: { slug: { notIn: activeToolSlugs } } });

  console.log("Upserting tools...");
  const toolBySlug = new Map<string, { id: string }>();
  for (const t of allTools) {
    const companyId = t.companySlug ? companyBySlug.get(t.companySlug)?.id ?? null : null;
    const logoUrl = t.companySlug ? logoFor(COMPANIES.find((c) => c.slug === t.companySlug)!.domain) : logoFor(new URL(t.websiteUrl).hostname.replace(/^www\./, ""));

    const tool = await prisma.tool.upsert({
      where: { slug: t.slug },
      update: {
        name: t.name,
        description: t.description,
        websiteUrl: t.websiteUrl,
        companyId,
        logoUrl,
        pricingModel: t.pricingModel,
        pricingAmount: t.pricingAmount,
        billingFrequency: t.billingFrequency,
        features: t.features,
      },
      create: {
        slug: t.slug,
        name: t.name,
        description: t.description,
        websiteUrl: t.websiteUrl,
        companyId,
        logoUrl,
        pricingModel: t.pricingModel,
        pricingAmount: t.pricingAmount,
        billingFrequency: t.billingFrequency,
        features: t.features,
      },
    });

    toolBySlug.set(t.slug, tool);
    console.log(`Upserted tool: ${t.slug}`);
  }

  // Bulk relate categories and tags to tools to optimize connection roundtrips
  const categoryLinks: { toolId: string; categoryId: string }[] = [];
  const tagLinks: { toolId: string; tagId: string }[] = [];

  for (const t of allTools) {
    const tool = toolBySlug.get(t.slug);
    if (!tool) continue;

    for (const catSlug of t.categorySlugs) {
      const categoryId = categoryBySlug.get(catSlug)?.id;
      if (categoryId) {
        categoryLinks.push({ toolId: tool.id, categoryId });
      }
    }

    for (const tagSlug of t.tagSlugs) {
      const tagId = tagBySlug.get(tagSlug)?.id;
      if (tagId) {
        tagLinks.push({ toolId: tool.id, tagId });
      }
    }
  }

  // Clear relations & bulk insert
  await prisma.toolCategory.deleteMany({});
  await prisma.toolTag.deleteMany({});
  if (categoryLinks.length > 0) {
    await prisma.toolCategory.createMany({ data: categoryLinks });
  }
  if (tagLinks.length > 0) {
    await prisma.toolTag.createMany({ data: tagLinks });
  }
  console.log(`Relate completed: bulk created ${categoryLinks.length} categories and ${tagLinks.length} tags.`);

  // Curated similar mappings
  const ALTERNATIVE_PAIRS: [string, string][] = [
    ["chatgpt", "claude"],
    ["chatgpt", "gemini"],
    ["claude", "gemini"],
    ["midjourney", "stable-diffusion"],
    ["midjourney", "leonardo-ai"],
    ["github-copilot", "cursor"],
    ["github-copilot", "tabnine"],
    ["jasper", "copy-ai"],
    ["jasper", "writesonic"],
    ["runway", "heygen"],
    ["elevenlabs", "murf-ai"],
  ];

  console.log("Linking similar tools...");
  for (const [aSlug, bSlug] of ALTERNATIVE_PAIRS) {
    const a = toolBySlug.get(aSlug);
    const b = toolBySlug.get(bSlug);
    if (a && b) {
      // Connect both directions
      await prisma.tool.update({
        where: { id: a.id },
        data: { alternatives: { connect: { id: b.id } } },
      });
      await prisma.tool.update({
        where: { id: b.id },
        data: { alternatives: { connect: { id: a.id } } },
      });
    }
  }

  console.log("Upserting reviews...");
  await prisma.review.deleteMany({}); // reset reviews for clean aggregation
  const reviewDataList: { rating: number; comment: string; toolId: string; userId: string }[] = [];
  let userIndex = 0;
  for (const r of REVIEWS) {
    const tool = toolBySlug.get(r.toolSlug);
    if (tool) {
      const user = users[userIndex % users.length];
      if (user) {
        reviewDataList.push({
          rating: r.rating,
          comment: r.comment,
          toolId: tool.id,
          userId: user.id,
        });
        userIndex++;
      }
    }
  }
  if (reviewDataList.length > 0) {
    await prisma.review.createMany({ data: reviewDataList });
  }

  // Aggregate ratings & review count
  console.log("Updating tool averages...");
  const toolsDb = await prisma.tool.findMany({ select: { id: true } });
  for (const tool of toolsDb) {
    const aggregates = await prisma.review.aggregate({
      where: { toolId: tool.id },
      _avg: { rating: true },
      _count: true,
    });

    await prisma.tool.update({
      where: { id: tool.id },
      data: {
        avgRating: aggregates._avg.rating ?? 0,
        reviewCount: aggregates._count ?? 0,
      },
    });
  }

  // ---- New Discovery Sections Seeding ----
  console.log("Seeding AI models...");
  await prisma.aIModel.deleteMany({});
  const seedModels = [
    // OpenAI Models
    { name: "GPT-4o", creator: "OpenAI", contextWindow: "128K tokens", parameterSize: "N/A (Proprietary)", modality: "Text, Audio, Vision", releaseDate: "May 2024", description: "OpenAI's flagship multimodal model, offering real-time voice capabilities and top performance across vision tasks." },
    { name: "GPT-4o-mini", creator: "OpenAI", contextWindow: "128K tokens", parameterSize: "N/A (Proprietary)", modality: "Text, Vision", releaseDate: "July 2024", description: "A fast, cost-efficient small model designed for high-frequency, lightweight tasks." },
    { name: "o1", creator: "OpenAI", contextWindow: "200K tokens", parameterSize: "N/A (Proprietary)", modality: "Text, Code", releaseDate: "December 2024", description: "A reasoning model optimized for complex science, coding, and mathematical operations." },
    { name: "o1-mini", creator: "OpenAI", contextWindow: "128K tokens", parameterSize: "N/A (Proprietary)", modality: "Text, Code", releaseDate: "September 2024", description: "A faster, coding-focused reasoning model for developers." },
    { name: "GPT-4 Turbo", creator: "OpenAI", contextWindow: "128K tokens", parameterSize: "N/A (Proprietary)", modality: "Text, Vision", releaseDate: "November 2023", description: "Previous flagship model with extended context window and vision capabilities." },
    { name: "GPT-4", creator: "OpenAI", contextWindow: "8K tokens", parameterSize: "N/A (Proprietary)", modality: "Text", releaseDate: "March 2023", description: "The original ground-breaking large language model from OpenAI." },
    { name: "GPT-3.5 Turbo", creator: "OpenAI", contextWindow: "16K tokens", parameterSize: "N/A (Proprietary)", modality: "Text", releaseDate: "March 2023", description: "Efficient and fast model for general text completion tasks." },
    { name: "GPT-4o-audio-preview", creator: "OpenAI", contextWindow: "128K tokens", parameterSize: "N/A (Proprietary)", modality: "Text, Audio", releaseDate: "October 2024", description: "OpenAI's audio-capable preview model for natural speech translation and generation." },
    
    // Anthropic Models
    { name: "Claude 3.5 Sonnet", creator: "Anthropic", contextWindow: "200K tokens", parameterSize: "N/A (Proprietary)", modality: "Text, Vision", releaseDate: "June 2024", description: "State-of-the-art reasoning and coding capabilities, featuring the interactive 'Artifacts' environment." },
    { name: "Claude 3.5 Sonnet (New)", creator: "Anthropic", contextWindow: "200K tokens", parameterSize: "N/A (Proprietary)", modality: "Text, Vision", releaseDate: "October 2024", description: "Updated version of Claude 3.5 Sonnet with significant improvements in computer-use and coding." },
    { name: "Claude 3.5 Haiku", creator: "Anthropic", contextWindow: "200K tokens", parameterSize: "N/A (Proprietary)", modality: "Text", releaseDate: "November 2024", description: "Anthropic's fastest, most cost-effective reasoning model." },
    { name: "Claude 3 Opus", creator: "Anthropic", contextWindow: "200K tokens", parameterSize: "N/A (Proprietary)", modality: "Text, Vision", releaseDate: "March 2024", description: "Anthropic's largest model for complex analysis and deep tasks." },
    { name: "Claude 3 Sonnet", creator: "Anthropic", contextWindow: "200K tokens", parameterSize: "N/A (Proprietary)", modality: "Text, Vision", releaseDate: "March 2024", description: "Balanced performance and speed for enterprise workloads." },
    { name: "Claude 3 Haiku", creator: "Anthropic", contextWindow: "200K tokens", parameterSize: "N/A (Proprietary)", modality: "Text, Vision", releaseDate: "March 2024", description: "Lightweight and ultra-fast model for high-speed routing." },
    
    // Google Models
    { name: "Gemini 1.5 Pro", creator: "Google", contextWindow: "2M tokens", parameterSize: "N/A (Proprietary)", modality: "Text, Vision, Audio, Code", releaseDate: "April 2024", description: "Features a massive 2-million token context window, allowing upload of full codebases or videos." },
    { name: "Gemini 1.5 Flash", creator: "Google", contextWindow: "1M tokens", parameterSize: "N/A (Proprietary)", modality: "Text, Vision, Audio, Code", releaseDate: "May 2024", description: "Google's lightweight, high-speed multimodal model optimized for volume." },
    { name: "Gemini 1.0 Pro", creator: "Google", contextWindow: "32K tokens", parameterSize: "N/A (Proprietary)", modality: "Text, Code", releaseDate: "December 2023", description: "First generation Gemini model for general text and reasoning tasks." },
    
    // Meta Models
    { name: "Llama 3.1 405B", creator: "Meta", contextWindow: "128K tokens", parameterSize: "405 Billion", modality: "Text, Code", releaseDate: "July 2024", description: "Meta's flagship open-weights model, rivaling top proprietary models in coding and reasoning." },
    { name: "Llama 3.1 70B", creator: "Meta", contextWindow: "128K tokens", parameterSize: "70 Billion", modality: "Text, Code", releaseDate: "July 2024", description: "Highly capable open-weights model for advanced agentic workflows." },
    { name: "Llama 3.1 8B", creator: "Meta", contextWindow: "128K tokens", parameterSize: "8 Billion", modality: "Text, Code", releaseDate: "July 2024", description: "Super-fast, compact open weights model for local deployment." },
    { name: "Llama 3 70B", creator: "Meta", contextWindow: "8K tokens", parameterSize: "70 Billion", modality: "Text, Code", releaseDate: "April 2024", description: "Original Llama 3 model optimized for text generation and instruction." },
    { name: "Llama 3 8B", creator: "Meta", contextWindow: "8K tokens", parameterSize: "8 Billion", modality: "Text, Code", releaseDate: "April 2024", description: "Compact, efficient instruction-tuned model." },

    // Mistral Models
    { name: "Mistral Large 2", creator: "Mistral", contextWindow: "128K tokens", parameterSize: "123 Billion", modality: "Text, Code", releaseDate: "July 2024", description: "Mistral's flagship model with advanced multilingual and coding capabilities." },
    { name: "Mistral 8x22B", creator: "Mistral", contextWindow: "64K tokens", parameterSize: "176 Billion MoE", modality: "Text, Code", releaseDate: "April 2024", description: "High-performance Mixture of Experts open weight model." },
    { name: "Mixtral 8x7B", creator: "Mistral", contextWindow: "32K tokens", parameterSize: "46.7 Billion MoE", modality: "Text, Code", releaseDate: "December 2023", description: "Highly popular Mixture of Experts model setting benchmark for cost-efficiency." },
    { name: "Codestral", creator: "Mistral", contextWindow: "32K tokens", parameterSize: "22 Billion", modality: "Code", releaseDate: "May 2024", description: "Open-weights model built specifically for code generation and autocomplete." },

    // Cohere Models
    { name: "Command R+", creator: "Cohere", contextWindow: "128K tokens", parameterSize: "104 Billion", modality: "Text, Code", releaseDate: "April 2024", description: "Enterprise-grade model optimized for Retrieval-Augmented Generation (RAG) and tool use." },
    { name: "Command R", creator: "Cohere", contextWindow: "128K tokens", parameterSize: "35 Billion", modality: "Text, Code", releaseDate: "March 2024", description: "Efficient open weights model tailored for business automation." },

    // AI21 Labs Models
    { name: "Jamba 1.5 Large", creator: "AI21 Labs", contextWindow: "256K tokens", parameterSize: "94B (Active)", modality: "Text, Code", releaseDate: "August 2024", description: "State-of-the-art hybrid SSM-Transformer architecture model." },
    { name: "Jamba 1.5 Mini", creator: "AI21 Labs", contextWindow: "256K tokens", parameterSize: "12B (Active)", modality: "Text, Code", releaseDate: "August 2024", description: "Ultra-fast hybrid model for long-context reasoning." },

    // xAI Models
    { name: "Grok 2", creator: "xAI", contextWindow: "128K tokens", parameterSize: "N/A (Proprietary)", modality: "Text, Vision", releaseDate: "August 2024", description: "xAI's frontier model integrated with real-time X search capabilities." },
    { name: "Grok 2 Mini", creator: "xAI", contextWindow: "128K tokens", parameterSize: "N/A (Proprietary)", modality: "Text, Vision", releaseDate: "August 2024", description: "Compact and fast version of Grok 2 with excellent reasoning." },

    // DeepSeek Models
    { name: "DeepSeek-Coder-V2", creator: "DeepSeek", contextWindow: "128K tokens", parameterSize: "236 Billion MoE", modality: "Text, Code", releaseDate: "June 2024", description: "Open weights mixture of experts model outperforming top frontier models in coding." },
    { name: "DeepSeek-V2.5", creator: "DeepSeek", contextWindow: "128K tokens", parameterSize: "236 Billion MoE", modality: "Text, Code", releaseDate: "September 2024", description: "Unified model combining the best of chat and coding capabilities." },

    // Alibaba Qwen Models
    { name: "Qwen2.5-72B-Instruct", creator: "Alibaba", contextWindow: "128K tokens", parameterSize: "72 Billion", modality: "Text, Code", releaseDate: "September 2024", description: "Highly capable open model with state of the art instruction-following and math capabilities." },
    { name: "Qwen2.5-Coder-32B-Instruct", creator: "Alibaba", contextWindow: "128K tokens", parameterSize: "32 Billion", modality: "Code", releaseDate: "September 2024", description: "Top performing open-weights coding model." }
  ];
  await prisma.aIModel.createMany({ data: seedModels });

  // News is no longer static-seeded — the news module gets its data from
  // real RSS ingestion (`npm run ingest`), not mock rows. See
  // src/modules/ingestion/.

  console.log("Seeding Repositories...");
  await prisma.repository.deleteMany({});
  const seedRepos = [
    {
      name: "bark",
      owner: "suno-ai",
      stars: 32400,
      language: "Python",
      description: "Transformer-based audio generation model capable of highly realistic multi-lingual text-to-speech and sound effects.",
      url: "https://github.com/suno-ai/bark",
    },
    {
      name: "stable-diffusion-webui",
      owner: "AUTOMATIC1111",
      stars: 131800,
      language: "Python",
      description: "A comprehensive browser interface built on Gradio for running Stable Diffusion text-to-image and image-to-image models.",
      url: "https://github.com/AUTOMATIC1111/stable-diffusion-webui",
    },
    {
      name: "ComfyUI",
      owner: "comfyanonymous",
      stars: 48900,
      language: "Python",
      description: "A powerful, modular node-based graphic interface for running diffusion models in customizable, complex workflows.",
      url: "https://github.com/comfyanonymous/ComfyUI",
    },
    {
      name: "transformers",
      owner: "huggingface",
      stars: 129000,
      language: "Python",
      description: "State-of-the-art Machine Learning architectures (BERT, GPT, LLaMA, Whisper) for PyTorch, TensorFlow, and JAX.",
      url: "https://github.com/huggingface/transformers",
    },
  ];
  await prisma.repository.createMany({ data: seedRepos });

  // Video seeding removed — the Videos + Models module (Module 9) now owns
  // this table via backend/crawler/ingest.ts, which writes real crawled data
  // matching the extended schema. Seeding stub rows here caused repeated
  // conflicts with required columns added for that module. Run the crawler
  // to populate real data: `npx tsx crawler/ingest.ts`

  // Video is owned by another module and already has 218 real rows in
  // production via its own ingestion path (confirmed via `prisma db pull`
  // during the news-module port). This mock-data block used the old flat
  // Video shape and, if ever run against production, its
  // `prisma.video.deleteMany({})` would have wiped that real data before
  // failing to reinsert (shape mismatch with the actual production
  // schema). Removed rather than fixed with fabricated data — not this
  // module's data to seed.

  console.log("Seeding Robots...");
  await prisma.robot.deleteMany({});
  const seedRobots = [
    {
      name: "Figure 02",
      category: "Humanoid Robot",
      manufacturer: "Figure AI",
      year: "2024",
      description: "A commercial-grade humanoid robot powered by OpenAI speech-to-speech models, designed for factory logistics and tasks.",
    },
    {
      name: "Unitree H1",
      category: "Bipedal Humanoid",
      manufacturer: "Unitree Robotics",
      year: "2023",
      description: "A bipedal robot capable of running, backflips, and walking up stairs, utilizing deep reinforcement learning control loops.",
    },
  ];
  await prisma.robot.createMany({ data: seedRobots });

  console.log("Seeding Devices...");
  await prisma.device.deleteMany({});
  const seedDevices = [
    {
      name: "Rabbit r1",
      category: "AI Pocket Assistant",
      manufacturer: "Rabbit Inc.",
      year: "2024",
      description: "A pocket companion device utilizing a Large Action Model (LAM) designed to execute online app actions on your behalf.",
    },
    {
      name: "Humane AI Pin",
      category: "Wearable Projector Pin",
      manufacturer: "Humane",
      year: "2024",
      description: "A wearable pin that projects digital interface layouts onto the palm of your hand, featuring voice and gesture inputs.",
    },
  ];
  await prisma.device.createMany({ data: seedDevices });

  console.log("Seeding Leaderboard Tools...");
  await prisma.leaderboardTool.deleteMany({});
  const leaderboardTools = [
    ...TOOLS.map((t, index) => ({
      id: t.slug,
      name: t.name,
      category: t.categorySlugs && t.categorySlugs[0] ? t.categorySlugs[0].charAt(0).toUpperCase() + t.categorySlugs[0].slice(1) : "Productivity",
      tags: t.tagSlugs ? t.tagSlugs.join(",") : "AI,productivity",
      rank: index + 1,
      growth: parseFloat((5 + Math.random() * 150).toFixed(1)),
      votes: Math.floor(200 + Math.random() * 5000),
      rating: parseFloat((4.0 + Math.random() * 1.0).toFixed(1)),
      saves: Math.floor(100 + Math.random() * 1500),
      url: t.websiteUrl || "https://example.com",
      description: t.description || `State-of-the-art AI tool for modern productivity and workflows.`,
      pricing: t.pricingModel ? t.pricingModel.toString().charAt(0) + t.pricingModel.toString().slice(1).toLowerCase() : "Freemium",
      visits: `${(1 + Math.random() * 50).toFixed(1)}M`,
      addedDate: "2026-01-01"
    })),
  ];
  await prisma.leaderboardTool.createMany({ data: leaderboardTools });

  console.log("Seeding Leaderboard Models...");
  await prisma.leaderboardModel.deleteMany({});
  const leaderboardModels = [
    ...seedModels.map((m, index) => ({
      id: m.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      name: m.name,
      provider: m.creator,
      category: m.modality,
      rank: index + 1,
      growth: parseFloat((5 + Math.random() * 150).toFixed(1)),
      contextWindow: m.contextWindow,
      pricing: "$2.50 / M input",
      eloRating: 1250 - index * 10,
      benchmarkScore: parseFloat((80 + Math.random() * 19).toFixed(1)),
      openSource: m.parameterSize.includes("Billion") || m.parameterSize.includes("Million") || m.creator === "Meta" || m.creator === "Mistral",
      votes: Math.floor(1000 + Math.random() * 5000),
      rating: parseFloat((4.0 + Math.random() * 1.0).toFixed(1)),
      saves: Math.floor(200 + Math.random() * 2000),
      description: m.description,
      visits: `${(50 + Math.random() * 900).toFixed(1)}M`
    })),
  ];
  await prisma.leaderboardModel.createMany({ data: leaderboardModels });

  console.log("Seeding Leaderboard Companies...");
  await prisma.leaderboardCompany.deleteMany({});
  const leaderboardCompanies = COMPANIES.map((c, index) => ({
    id: c.slug,
    name: c.name,
    rank: index + 1,
    growth: parseFloat((10 + Math.random() * 200).toFixed(1)),
    funding: `$${(5 + Math.random() * 95).toFixed(1)}M`,
    headquarters: "San Francisco, CA",
    productsCount: Math.floor(1 + Math.random() * 5),
    modelsCount: Math.floor(1 + Math.random() * 8),
    votes: Math.floor(100 + Math.random() * 2000),
    rating: parseFloat((4.0 + Math.random() * 1.0).toFixed(1)),
    saves: Math.floor(50 + Math.random() * 800),
    description: `Leading artificial intelligence company specializing in products and research.`,
    visits: `${(5 + Math.random() * 95).toFixed(1)}M`
  }));
  await prisma.leaderboardCompany.createMany({ data: leaderboardCompanies });

  console.log(`Seed complete: ${COMPANIES.length} companies, ${allTools.length} tools, ${REVIEWS.length} reviews.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });