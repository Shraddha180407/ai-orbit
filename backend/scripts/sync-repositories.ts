import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { marked } from "marked";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const GITHUB_TOPICS = [
  "llm", "chatbot", "ai-agent", "machine-learning", "deep-learning",
  "computer-vision", "nlp", "text-to-image", "text-to-speech",
  "speech-recognition", "rag", "langchain", "openai", "stable-diffusion",
  "generative-ai", "ai-tools", "prompt-engineering", "fine-tuning",
  "neural-network", "transformers", "reinforcement-learning", "automl",
  "mlops", "vector-database", "embeddings", "ai-agents-framework",
  "image-generation", "video-generation", "code-generation", "data-science",
  "pytorch", "tensorflow", "huggingface", "ai-chatbot",
  "recommendation-system", "anomaly-detection", "ocr", "tts",
  "voice-cloning", "ai-agents", "autonomous-agents", "ai-writing",
  "ai-copilot", "semantic-search", "artificial-intelligence",
];

const SEARCH_API_DELAY_MS = 2500; // 30 req/min → ~2s gap, add buffer
const REST_BATCH_SIZE = 50;
const REST_BATCH_DELAY_MS = 1000;
const DB_BATCH_SIZE = 100;
const SEARCH_PER_PAGE = 100;
const SEARCH_MAX_PAGES = 10;

// ---------------------------------------------------------------------------
// Types (GitHub Search API response shapes)
// ---------------------------------------------------------------------------

interface GitHubOwner {
  login: string;
  avatar_url: string;
}

interface GitHubLicense {
  spdx_id: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: GitHubOwner;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  license: GitHubLicense | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  default_branch: string;
  created_at: string;
}

interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubRepo[];
}

interface GitHubReadmeResponse {
  content: string;
  encoding: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function checkEnv(): void {
  const missing: string[] = [];
  if (!process.env.DATABASE_URL) missing.push("DATABASE_URL");
  if (!process.env.GITHUB_TOKEN) missing.push("GITHUB_TOKEN");
  if (missing.length > 0) {
    console.error(`Missing required env vars: ${missing.join(", ")}`);
    process.exit(1);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function sanitizeSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildSlug(owner: string, name: string): string {
  return sanitizeSlug(`${owner}-${name}`);
}

function githubHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github.mercy-preview+json",
    "User-Agent": "aiorbit-sync-script",
  };
}

function restHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "aiorbit-sync-script",
  };
}

// ---------------------------------------------------------------------------
// GitHub API calls
// ---------------------------------------------------------------------------

async function searchReposByTopic(topic: string): Promise<GitHubRepo[]> {
  const allRepos: GitHubRepo[] = [];

  for (let page = 1; page <= SEARCH_MAX_PAGES; page++) {
    const url =
      `https://api.github.com/search/repositories` +
      `?q=topic:${encodeURIComponent(topic)}+stars:>50` +
      `&sort=stars&order=desc&per_page=${SEARCH_PER_PAGE}&page=${page}`;

    try {
      const res = await fetch(url, { headers: githubHeaders() });

      if (res.status === 403) {
        console.warn(`  ⚠ Rate limited on topic "${topic}" page ${page}, waiting 60s...`);
        await sleep(60_000);
        // Retry once
        const retry = await fetch(url, { headers: githubHeaders() });
        if (!retry.ok) {
          console.error(`  ✗ Retry failed for "${topic}" page ${page}: ${retry.status}`);
          break;
        }
        const data: GitHubSearchResponse = await retry.json();
        allRepos.push(...data.items);
        if (data.items.length < SEARCH_PER_PAGE) break;
        await sleep(SEARCH_API_DELAY_MS);
        continue;
      }

      if (!res.ok) {
        console.error(`  ✗ Search failed for "${topic}" page ${page}: ${res.status}`);
        break;
      }

      const data: GitHubSearchResponse = await res.json();
      allRepos.push(...data.items);

      console.log(
        `  Page ${page}: ${data.items.length} repos (total so far: ${allRepos.length})`
      );

      if (data.items.length < SEARCH_PER_PAGE) break;
      await sleep(SEARCH_API_DELAY_MS);
    } catch (err) {
      console.error(`  ✗ Network error on "${topic}" page ${page}:`, err);
      break;
    }
  }

  return allRepos;
}

async function fetchReadme(owner: string, name: string): Promise<string | null> {
  const url = `https://api.github.com/repos/${owner}/${name}/readme`;

  try {
    const res = await fetch(url, { headers: restHeaders() });

    if (!res.ok) {
      // 404 = no README, other errors = skip
      return null;
    }

    const data: GitHubReadmeResponse = await res.json();

    if (data.encoding !== "base64") {
      console.warn(`  ⚠ Unexpected encoding "${data.encoding}" for ${owner}/${name}`);
      return null;
    }

    const markdown = Buffer.from(data.content, "base64").toString("utf-8");
    const html = await marked.parse(markdown) as string;
    return html;
  } catch (err) {
    console.error(`  ✗ README fetch error for ${owner}/${name}:`, err);
    return null;
  }
}

function rewriteRelativeImages(html: string, owner: string, name: string, branch: string): string {
  const prefix = `https://raw.githubusercontent.com/${owner}/${name}/${branch}/`;
  // Rewrite src="...", src='./...', src="./..." to absolute URLs
  return html.replace(
    /src="(?!\w+:\/?\/)([^"]+)"/g,
    (_match, path) => `src="${prefix}${path}"`
  );
}

// ---------------------------------------------------------------------------
// Field mapping
// ---------------------------------------------------------------------------

interface MappedRepo {
  githubId: number;
  slug: string;
  name: string;
  owner: string;
  ownerAvatarUrl: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  license: string | null;
  topics: string[];
  stars: number;
  forks: number;
  openIssues: number;
  defaultBranch: string;
  logoUrl: string;
  brandColor: null;
  readmeHtml: string | null;
  readmeFetchedAt: Date | null;
  githubCreatedAt: Date;
  syncedAt: Date;
}

function mapRepo(repo: GitHubRepo, readmeHtml: string | null): MappedRepo {
  const now = new Date();
  const slug = buildSlug(repo.owner.login, repo.name);

  return {
    githubId: repo.id,
    slug,
    name: repo.name,
    owner: repo.owner.login,
    ownerAvatarUrl: repo.owner.avatar_url,
    description: repo.description,
    url: repo.html_url,
    homepage: repo.homepage || null,
    language: repo.language,
    license: repo.license?.spdx_id ?? null,
    topics: repo.topics ?? [],
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    openIssues: repo.open_issues_count,
    defaultBranch: repo.default_branch,
    logoUrl: repo.owner.avatar_url,
    brandColor: null,
    readmeHtml,
    readmeFetchedAt: readmeHtml ? now : null,
    githubCreatedAt: new Date(repo.created_at),
    syncedAt: now,
  };
}

// ---------------------------------------------------------------------------
// Database
// ---------------------------------------------------------------------------

async function upsertRepo(prisma: PrismaClient, repo: MappedRepo): Promise<void> {
  await prisma.repository.upsert({
    where: { githubId: repo.githubId },
    create: {
      githubId: repo.githubId,
      slug: repo.slug,
      name: repo.name,
      owner: repo.owner,
      ownerAvatarUrl: repo.ownerAvatarUrl,
      description: repo.description,
      url: repo.url,
      homepage: repo.homepage,
      language: repo.language,
      license: repo.license,
      topics: repo.topics,
      stars: repo.stars,
      forks: repo.forks,
      openIssues: repo.openIssues,
      defaultBranch: repo.defaultBranch,
      logoUrl: repo.logoUrl,
      brandColor: repo.brandColor,
      readmeHtml: repo.readmeHtml,
      readmeFetchedAt: repo.readmeFetchedAt,
      githubCreatedAt: repo.githubCreatedAt,
      syncedAt: repo.syncedAt,
    },
    update: {
      name: repo.name,
      owner: repo.owner,
      ownerAvatarUrl: repo.ownerAvatarUrl,
      description: repo.description,
      url: repo.url,
      homepage: repo.homepage,
      language: repo.language,
      license: repo.license,
      topics: repo.topics,
      stars: repo.stars,
      forks: repo.forks,
      openIssues: repo.openIssues,
      defaultBranch: repo.defaultBranch,
      logoUrl: repo.logoUrl,
      brandColor: repo.brandColor,
      readmeHtml: repo.readmeHtml,
      readmeFetchedAt: repo.readmeFetchedAt,
      githubCreatedAt: repo.githubCreatedAt,
      syncedAt: repo.syncedAt,
    },
  });
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const startTime = Date.now();
  checkEnv();

  console.log("=== GitHub Repository Discovery & Sync ===\n");
  console.log(`Topics to scan: ${GITHUB_TOPICS.length}`);
  console.log(`GitHub token: ${process.env.GITHUB_TOKEN!.slice(0, 4)}...`);
  console.log();

  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });

  // Phase 1: Discover repos via search
  const seenIds = new Set<number>();
  const uniqueRepos: GitHubRepo[] = [];

  for (let i = 0; i < GITHUB_TOPICS.length; i++) {
    const topic = GITHUB_TOPICS[i];
    console.log(`[${i + 1}/${GITHUB_TOPICS.length}] Searching topic: "${topic}"`);

    const repos = await searchReposByTopic(topic);

    let newCount = 0;
    for (const repo of repos) {
      if (!seenIds.has(repo.id)) {
        seenIds.add(repo.id);
        uniqueRepos.push(repo);
        newCount++;
      }
    }

    console.log(
      `  → Found ${repos.length} repos, ${newCount} new (running unique total: ${uniqueRepos.length})`
    );

    if (i < GITHUB_TOPICS.length - 1) {
      await sleep(SEARCH_API_DELAY_MS);
    }
  }

  console.log(`\n--- Discovery complete: ${uniqueRepos.length} unique repos ---\n`);

  // Phase 2: Fetch READMEs in batches
  console.log("Fetching READMEs...");
  const readmeMap = new Map<number, string | null>();
  let readmeFailures = 0;

  for (let i = 0; i < uniqueRepos.length; i++) {
    const repo = uniqueRepos[i];
    const readme = await fetchReadme(repo.owner.login, repo.name);
    readmeMap.set(repo.id, readme);

    if (readme === null) readmeFailures++;

    if ((i + 1) % 25 === 0 || i === uniqueRepos.length - 1) {
      console.log(
        `  README progress: ${i + 1}/${uniqueRepos.length} (${readmeFailures} failures)`
      );
    }

    if ((i + 1) % REST_BATCH_SIZE === 0 && i < uniqueRepos.length - 1) {
      await sleep(REST_BATCH_DELAY_MS);
    }
  }

  console.log(`\nREADME fetch complete: ${uniqueRepos.length - readmeFailures} success, ${readmeFailures} failures\n`);

  // Phase 3: Upsert to database in batches
  console.log("Writing to database...");
  let upserted = 0;
  let dbErrors = 0;

  for (let i = 0; i < uniqueRepos.length; i++) {
    const repo = uniqueRepos[i];
    const readme = readmeMap.get(repo.id) ?? null;
    const mapped = mapRepo(repo, readme);

    try {
      await upsertRepo(prisma, mapped);
      upserted++;
    } catch (err) {
      console.error(`  ✗ DB upsert failed for ${repo.full_name}:`, err);
      dbErrors++;
    }

    if ((i + 1) % DB_BATCH_SIZE === 0 && i < uniqueRepos.length - 1) {
      console.log(`  DB progress: ${i + 1}/${uniqueRepos.length} (${upserted} upserted, ${dbErrors} errors)`);
    }
  }

  await prisma.$disconnect();

  // Summary
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log("\n=== Sync Complete ===");
  console.log(`Total repos discovered: ${uniqueRepos.length}`);
  console.log(`Total upserted:         ${upserted}`);
  console.log(`DB errors:              ${dbErrors}`);
  console.log(`README fetch failures:  ${readmeFailures}`);
  console.log(`Time taken:             ${elapsed}s`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exitCode = 1;
});
