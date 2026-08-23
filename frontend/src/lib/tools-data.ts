export type PricingModel = "FREE" | "FREEMIUM" | "PAID" | "FREE_TRIAL";

export type ToolRecord = {
  slug: string;
  name: string;
  tagline: string;
  websiteUrl: string;
  pricing: PricingModel;
  categorySlug: string;
  subcategory: string;
};

function tool(
  slug: string,
  name: string,
  tagline: string,
  websiteUrl: string,
  pricing: PricingModel,
  categorySlug: string,
  subcategory: string
): ToolRecord {
  return { slug, name, tagline, websiteUrl, pricing, categorySlug, subcategory };
}

export const TOOLS: ToolRecord[] = [
  // ---- image-creation ----
  tool("midjourney", "Midjourney", "AI-powered image generation platform that creates high-quality images from text prompts.", "https://www.midjourney.com", "PAID", "image-creation", "Illustrations"),
  tool("leonardo-ai", "Leonardo AI", "Generate high-quality AI images, game assets, illustrations, and creative artwork.", "https://leonardo.ai", "FREEMIUM", "image-creation", "Illustrations"),
  tool("adobe-firefly", "Adobe Firefly", "Adobe's generative AI model for images, effects, and text-to-image creation.", "https://www.adobe.com/products/firefly.html", "FREEMIUM", "image-creation", "Image editing"),
  tool("canva-ai", "Canva AI", "AI-powered design tools for generating images, presentations, and creative content.", "https://www.canva.com", "FREEMIUM", "image-creation", "Product images"),
  tool("ideogram", "Ideogram", "AI image generator known for accurate in-image text rendering.", "https://ideogram.ai", "FREEMIUM", "image-creation", "Illustrations"),
  tool("dalle", "DALL·E", "OpenAI's text-to-image model for generating original images from prompts.", "https://openai.com/dall-e-3", "FREEMIUM", "image-creation", "Illustrations"),
  tool("stable-diffusion", "Stable Diffusion", "Open-source diffusion model for text-to-image generation.", "https://stability.ai", "FREE", "image-creation", "Illustrations"),
  tool("remove-bg", "Remove.bg", "Automatically remove image backgrounds using AI.", "https://www.remove.bg", "FREEMIUM", "image-creation", "Background removal"),
  tool("topaz-photo-ai", "Topaz Photo AI", "AI-powered image enhancement, noise reduction, sharpening, and upscaling.", "https://www.topazlabs.com/topaz-photo-ai", "PAID", "image-creation", "Upscaling"),
  tool("photoroom", "PhotoRoom", "AI background removal and product photo generation for e-commerce.", "https://www.photoroom.com", "FREEMIUM", "image-creation", "Background removal"),
  tool("clipdrop", "Clipdrop", "Suite of AI image editing tools including relight, cleanup, and upscale.", "https://clipdrop.co", "FREEMIUM", "image-creation", "Image editing"),
  tool("playground-ai", "Playground AI", "Free-to-use AI image generator with a canvas-style editing workflow.", "https://playgroundai.com", "FREEMIUM", "image-creation", "Illustrations"),
  tool("nightcafe", "NightCafe", "AI art generator community platform with multiple generation styles.", "https://creator.nightcafe.studio", "FREEMIUM", "image-creation", "Fantasy images"),
  tool("artbreeder", "Artbreeder", "Collaborative AI tool for blending and evolving images and portraits.", "https://www.artbreeder.com", "FREEMIUM", "image-creation", "Portraits"),
  tool("deepai", "DeepAI", "Simple text-to-image AI generator with an open API.", "https://deepai.org", "FREEMIUM", "image-creation", "Illustrations"),
  tool("craiyon", "Craiyon", "Free, lightweight AI image generator (formerly DALL·E mini).", "https://www.craiyon.com", "FREE", "image-creation", "Funny images"),
  tool("fotor-ai", "Fotor AI", "AI photo editor with image generation, enhancement, and design tools.", "https://www.fotor.com", "FREEMIUM", "image-creation", "Image editing"),
  tool("picsart-ai", "Picsart AI", "AI-powered photo and design editor with generative tools.", "https://picsart.com", "FREEMIUM", "image-creation", "Image editing"),
  tool("freepik-ai", "Freepik AI", "AI image generator built into Freepik's stock content platform.", "https://www.freepik.com/ai", "FREEMIUM", "image-creation", "Illustrations"),
  tool("bing-image-creator", "Bing Image Creator", "Microsoft's free AI image generator powered by DALL·E.", "https://www.bing.com/images/create", "FREE", "image-creation", "Illustrations"),
  tool("flux", "FLUX", "High-fidelity open-weights text-to-image model from Black Forest Labs.", "https://blackforestlabs.ai", "FREEMIUM", "image-creation", "Illustrations"),
  tool("recraft", "Recraft", "AI design tool for generating vector art, icons, and brand assets.", "https://www.recraft.ai", "FREEMIUM", "image-creation", "Vector art"),
  tool("magnific-ai", "Magnific AI", "AI upscaler and enhancer for adding fine detail to generated images.", "https://magnific.ai", "PAID", "image-creation", "Upscaling"),
  tool("krea-ai", "Krea AI", "Real-time AI image generation and enhancement platform.", "https://www.krea.ai", "FREEMIUM", "image-creation", "Illustrations"),
  tool("scenario", "Scenario", "AI-generated game assets and art trained on custom styles.", "https://www.scenario.com", "FREEMIUM", "image-creation", "Fantasy images"),
  tool("lexica", "Lexica", "Stable Diffusion search engine and image generator.", "https://lexica.art", "FREEMIUM", "image-creation", "Illustrations"),
  tool("openart", "OpenArt", "AI image generator and prompt marketplace with multiple models.", "https://openart.ai", "FREEMIUM", "image-creation", "Illustrations"),
  tool("google-whisk", "Google Whisk", "Google's experimental AI tool for remixing images into new visuals.", "https://labs.google/whisk", "FREE", "image-creation", "Image editing"),

  // ---- content-creation ----
  tool("chatgpt", "ChatGPT", "Conversational AI assistant for writing, brainstorming, and Q&A.", "https://chat.openai.com", "FREEMIUM", "content-creation", "Blog posts"),
  tool("claude-ai", "Claude", "AI assistant built by Anthropic for writing, reasoning, and analysis.", "https://claude.ai", "FREEMIUM", "content-creation", "Blog posts"),
  tool("gemini", "Gemini", "Google's multimodal AI assistant for text and content generation.", "https://gemini.google.com", "FREEMIUM", "content-creation", "Blog posts"),
  tool("perplexity", "Perplexity", "AI-powered answer engine with cited, real-time web search.", "https://www.perplexity.ai", "FREEMIUM", "content-creation", "Blog posts"),
  tool("jasper", "Jasper", "AI writing platform built for marketing teams and brand content.", "https://www.jasper.ai", "PAID", "content-creation", "Ad copy"),
  tool("copy-ai", "Copy.ai", "AI copywriting tool for ads, emails, and product descriptions.", "https://www.copy.ai", "FREEMIUM", "content-creation", "Ad copy"),
  tool("writesonic", "Writesonic", "AI content generator for blogs, ads, and landing pages.", "https://writesonic.com", "FREEMIUM", "content-creation", "Blog posts"),
  tool("notion-ai", "Notion AI", "AI writing and summarization built directly into Notion docs.", "https://www.notion.so/product/ai", "PAID", "content-creation", "Blog posts"),
  tool("grammarly", "Grammarly", "AI writing assistant for grammar, tone, and clarity across the web.", "https://www.grammarly.com", "FREEMIUM", "content-creation", "Paraphrasing"),
  tool("rytr", "Rytr", "AI writing assistant for generating short and long-form content quickly.", "https://rytr.me", "FREEMIUM", "content-creation", "Social captions"),
  tool("sudowrite", "Sudowrite", "AI writing tool built specifically for fiction and creative writers.", "https://www.sudowrite.com", "PAID", "content-creation", "Creative writing"),
  tool("quillbot", "QuillBot", "AI paraphrasing, grammar checking, and summarization tool.", "https://quillbot.com", "FREEMIUM", "content-creation", "Paraphrasing"),
  tool("wordtune", "Wordtune", "AI writing companion that rewrites and improves sentences in real time.", "https://www.wordtune.com", "FREEMIUM", "content-creation", "Paraphrasing"),
  tool("anyword", "Anyword", "AI copywriting platform with predictive performance scoring.", "https://anyword.com", "PAID", "content-creation", "Ad copy"),
  tool("frase", "Frase", "AI content research and SEO writing tool for blog content.", "https://www.frase.io", "PAID", "content-creation", "SEO content"),
  tool("surfer-seo", "Surfer SEO", "AI-assisted content optimization tool for SEO-focused writing.", "https://surferseo.com", "PAID", "content-creation", "SEO content"),
  tool("simplified", "Simplified", "All-in-one AI content and design platform for marketing teams.", "https://simplified.com", "FREEMIUM", "content-creation", "Social captions"),
  tool("copysmith", "Copysmith", "AI content generation platform built for e-commerce copywriting.", "https://copysmith.ai", "PAID", "content-creation", "Product descriptions"),

  // ---- video-creation ----
  tool("runway", "Runway", "AI video generation and editing platform with text-to-video tools.", "https://runwayml.com", "FREEMIUM", "video-creation", "Text to video"),
  tool("pika", "Pika", "AI video generation tool for creating short clips from text or images.", "https://pika.art", "FREEMIUM", "video-creation", "Text to video"),
  tool("synthesia", "Synthesia", "Generate AI avatar videos from text scripts, no camera needed.", "https://www.synthesia.io", "PAID", "video-creation", "Talking avatars"),
  tool("heygen", "HeyGen", "AI video platform for creating talking-avatar and localized videos.", "https://www.heygen.com", "FREEMIUM", "video-creation", "Talking avatars"),
  tool("luma-ai", "Luma AI", "AI video generation tool known for realistic motion and lighting.", "https://lumalabs.ai", "FREEMIUM", "video-creation", "Text to video"),
  tool("capcut-ai", "CapCut AI", "AI-powered video editing features inside CapCut's editor.", "https://www.capcut.com", "FREEMIUM", "video-creation", "Video editing"),
  tool("kling-ai", "Kling AI", "Text-to-video and image-to-video generation model from Kuaishou.", "https://klingai.com", "FREEMIUM", "video-creation", "Text to video"),
  tool("invideo-ai", "InVideo AI", "Turn text prompts into full edited videos with AI narration.", "https://invideo.io/ai", "FREEMIUM", "video-creation", "Text to video"),
  tool("fliki", "Fliki", "Text-to-video tool with realistic AI voices for social content.", "https://fliki.ai", "FREEMIUM", "video-creation", "Voiceover"),
  tool("descript", "Descript", "AI-powered video and audio editor with transcript-based editing.", "https://www.descript.com", "FREEMIUM", "video-creation", "Video editing"),
  tool("opus-clip", "Opus Clip", "AI tool that repurposes long videos into short viral clips.", "https://www.opus.pro", "FREEMIUM", "video-creation", "Short clips"),
  tool("elai-io", "Elai.io", "Create AI avatar videos from text without cameras or actors.", "https://elai.io", "FREEMIUM", "video-creation", "Talking avatars"),
  tool("d-id", "D-ID", "AI platform for generating talking-avatar videos from a photo.", "https://www.d-id.com", "FREEMIUM", "video-creation", "Talking avatars"),
  tool("veed-io", "VEED.io", "Online video editor with AI subtitles, avatars, and translation.", "https://www.veed.io", "FREEMIUM", "video-creation", "Captions"),
  tool("colossyan", "Colossyan", "AI video generator for training and corporate learning content.", "https://www.colossyan.com", "PAID", "video-creation", "Talking avatars"),

  // ---- coding ----
  tool("github-copilot", "GitHub Copilot", "AI pair programmer that suggests code directly in your editor.", "https://github.com/features/copilot", "PAID", "coding", "Code completion"),
  tool("cursor", "Cursor", "AI-first code editor built for fast, agentic coding workflows.", "https://www.cursor.com", "FREEMIUM", "coding", "Code completion"),
  tool("replit", "Replit", "Cloud-based coding environment with built-in AI coding assistant.", "https://replit.com", "FREEMIUM", "coding", "App building"),
  tool("windsurf", "Windsurf", "Agentic AI-native code editor built by Codeium.", "https://windsurf.com", "FREEMIUM", "coding", "Code completion"),
  tool("tabnine", "Tabnine", "AI code completion tool with private, on-prem model options.", "https://www.tabnine.com", "FREEMIUM", "coding", "Code completion"),
  tool("amazon-q-developer", "Amazon Q Developer", "AWS's AI assistant for coding, debugging, and cloud development.", "https://aws.amazon.com/q/developer", "FREEMIUM", "coding", "Debugging"),
  tool("sourcegraph-cody", "Cody", "AI coding assistant from Sourcegraph with deep codebase context.", "https://sourcegraph.com/cody", "FREEMIUM", "coding", "Code review"),
  tool("continue-dev", "Continue", "Open-source AI code assistant you can customize with any model.", "https://www.continue.dev", "FREE", "coding", "Code completion"),
  tool("jetbrains-ai", "JetBrains AI Assistant", "AI coding assistant built into JetBrains IDEs.", "https://www.jetbrains.com/ai", "PAID", "coding", "Code completion"),
  tool("aider", "Aider", "Open-source AI pair programmer that edits code in your terminal.", "https://aider.chat", "FREE", "coding", "Terminal agents"),
  tool("v0", "v0", "Vercel's AI tool for generating UI components from prompts.", "https://v0.dev", "FREEMIUM", "coding", "App building"),
  tool("bolt-new", "Bolt.new", "AI tool that builds and deploys full-stack web apps from prompts.", "https://bolt.new", "FREEMIUM", "coding", "App building"),
  tool("lovable", "Lovable", "AI app builder that generates full web apps from natural language.", "https://lovable.dev", "FREEMIUM", "coding", "App building"),
  tool("claude-code", "Claude Code", "Anthropic's agentic coding tool for the terminal and IDE.", "https://claude.com/product/claude-code", "PAID", "coding", "Terminal agents"),
  tool("codeium", "Codeium", "Free AI code completion and chat assistant for developers.", "https://codeium.com", "FREE", "coding", "Code completion"),
];

export function getToolsByCategory(categorySlug: string | undefined | null): ToolRecord[] {
  if (!categorySlug) return [];
  return TOOLS.filter((t) => t.categorySlug === categorySlug);
}

export function getToolBySlug(slug: string): ToolRecord | undefined {
  return TOOLS.find((t) => t.slug === slug);
}