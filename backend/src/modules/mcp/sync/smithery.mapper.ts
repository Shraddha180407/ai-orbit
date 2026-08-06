// ============================================================
// Smithery → MCPItem Mapper
// ============================================================

import type { MCPItemType, MCPPricingType } from '@prisma/client';
import type {
  SmitheryServerSummary,
  SmitheryServerDetail,
} from './types.js';

// ----------------------------------------------------------
// Static taxonomy: keyword → category/subcategory slug
// ----------------------------------------------------------
interface TaxonomyRule {
  keywords: string[];
  categorySlug: string;
  subCategorySlug?: string;
  tags: string[];
}

const TAXONOMY_RULES: TaxonomyRule[] = [
  {
    keywords: ['search', 'web', 'crawl', 'scrape', 'index'],
    categorySlug: 'apis',
    tags: ['search', 'web'],
  },
  {
    keywords: ['database', 'sql', 'postgres', 'mysql', 'mongo', 'redis', 'sqlite'],
    categorySlug: 'databases',
    tags: ['database'],
  },
  {
    keywords: ['file', 'filesystem', 'directory', 'storage', 'fs'],
    categorySlug: 'file-systems',
    tags: ['file-system'],
  },
  {
    keywords: ['email', 'mail', 'calendar', 'sheets', 'docs', 'drive', 'productivity'],
    categorySlug: 'productivity',
    tags: ['productivity'],
  },
  {
    keywords: ['cloud', 'aws', 'gcp', 'azure', 'deploy', 'kubernetes', 'docker'],
    categorySlug: 'cloud',
    tags: ['cloud'],
  },
  {
    keywords: ['browser', 'playwright', 'puppeteer', 'selenium', 'web-scraping'],
    categorySlug: 'browser',
    tags: ['browser', 'automation'],
  },
  {
    keywords: ['ai', 'ml', 'model', 'llm', 'inference', 'training', 'openai', 'anthropic'],
    categorySlug: 'ml-platforms',
    tags: ['ai', 'ml'],
  },
  {
    keywords: ['git', 'github', 'gitlab', 'code', 'repo', 'pr', 'issue'],
    categorySlug: 'developer-tools',
    subCategorySlug: 'sdks-frameworks',
    tags: ['developer-tools', 'git'],
  },
  {
    keywords: ['test', 'qa', 'lint', 'debug', 'ci', 'cd'],
    categorySlug: 'developer-tools',
    subCategorySlug: 'testing-tools',
    tags: ['testing', 'developer-tools'],
  },
  {
    keywords: ['api', 'rest', 'graphql', 'webhook', 'integration'],
    categorySlug: 'apis',
    tags: ['api', 'integration'],
  },
  {
    keywords: ['payment', 'stripe', 'billing', 'commerce'],
    categorySlug: 'apis',
    tags: ['payment', 'api'],
  },
  {
    keywords: ['chat', 'slack', 'discord', 'teams', 'notification'],
    categorySlug: 'productivity',
    tags: ['chat', 'messaging'],
  },
  {
    keywords: ['image', 'video', 'audio', 'media', 'ocr', 'vision'],
    categorySlug: 'ml-platforms',
    tags: ['media', 'ai'],
  },
  {
    keywords: ['security', 'auth', 'oauth', 'token', 'encrypt'],
    categorySlug: 'developer-tools',
    tags: ['security'],
  },
  {
    keywords: ['map', 'location', 'geo', 'weather', 'forecast'],
    categorySlug: 'apis',
    tags: ['geolocation', 'weather'],
  },
];

// ----------------------------------------------------------
// Public API
// ----------------------------------------------------------

export interface MappedMCPItem {
  itemType: MCPItemType;
  name: string;
  slug: string;
  logoUrl: string | null;
  shortDescription: string;
  fullDescription: string;
  providerName: string;
  providerUrl: string | null;
  license: string | null;
  pricingType: MCPPricingType;
  isVerified: boolean;
  websiteUrl: string | null;
  documentationUrl: string | null;
  repositoryUrl: string | null;
  qualityScore: number;
}

export interface MappedRelations {
  categorySlug: string | null;
  subCategorySlug: string | null;
  tagSlugs: string[];
  features: Array<{ title: string; description: string }>;
  technicalSpec: {
    supportedPlatforms: string[];
    compatibility: string;
    integrations: string[];
    localBindingControls: string;
  } | null;
  installationSteps: Array<{
    stepNumber: number;
    title: string;
    codeSnippet: string;
    instructions: string;
  }>;
}

export interface MappedServer {
  item: MappedMCPItem;
  relations: MappedRelations;
}

// ----------------------------------------------------------
// Map a summary + detail pair into our schema
// ----------------------------------------------------------
export function mapSmitheryServer(
  summary: SmitheryServerSummary,
  detail: SmitheryServerDetail | null,
): MappedServer {
  const qualifiedName = summary.qualifiedName;
  const displayName = summary.displayName || qualifiedName;
  const description = summary.description || '';

  const slug = `sm-${sanitizeSlug(qualifiedName)}`;
  const taxonomy = classifyTaxonomy(displayName, description);
  const providerName = extractProviderName(summary);
  const providerUrl = summary.homepage || null;
  const websiteUrl = summary.homepage || `https://smithery.ai/servers/${qualifiedName}`;
  const repositoryUrl = extractRepositoryUrl(summary, detail);
  const features = extractFeatures(detail);
  const technicalSpec = buildTechnicalSpec(detail);
  const installationSteps = buildInstallationSteps(summary, detail);
  const qualityScore = computeQualityScore(summary);

  return {
    item: {
      itemType: 'SERVER',
      name: displayName,
      slug,
      logoUrl: summary.iconUrl,
      shortDescription: truncate(description, 200),
      fullDescription: buildFullDescription(summary, detail),
      providerName,
      providerUrl,
      license: null,
      pricingType: 'FREE',
      isVerified: summary.verified,
      websiteUrl,
      documentationUrl: websiteUrl,
      repositoryUrl,
      qualityScore,
    },
    relations: {
      categorySlug: taxonomy.categorySlug,
      subCategorySlug: taxonomy.subCategorySlug ?? null,
      tagSlugs: taxonomy.tags,
      features,
      technicalSpec,
      installationSteps,
    },
  };
}

// ----------------------------------------------------------
// Helpers
// ----------------------------------------------------------

function sanitizeSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Fix 4: Score each rule by keyword count, pick best
function classifyTaxonomy(
  name: string,
  description: string,
): { categorySlug: string; subCategorySlug?: string; tags: string[] } {
  const text = `${name} ${description}`.toLowerCase();

  let bestScore = -1;
  let bestRule: TaxonomyRule | null = null;

  for (const rule of TAXONOMY_RULES) {
    const score = rule.keywords.filter((kw) => text.includes(kw)).length;
    if (score === 0) continue;

    const shouldReplace =
      score > bestScore ||
      (score === bestScore && bestRule !== null && (
        // Tiebreak: prefer rule with subCategory
        (!bestRule.subCategorySlug && !!rule.subCategorySlug) ||
        // then more keywords
        (rule.keywords.length > bestRule.keywords.length)
      ));

    if (shouldReplace || bestRule === null) {
      bestScore = score;
      bestRule = rule;
    }
  }

  if (!bestRule) {
    return { categorySlug: 'mcp-servers', tags: ['mcp'] };
  }

  return {
    categorySlug: bestRule.categorySlug,
    subCategorySlug: bestRule.subCategorySlug,
    tags: bestRule.tags,
  };
}

function extractProviderName(summary: SmitheryServerSummary): string {
  if (summary.namespace) return summary.namespace;
  const parts = summary.qualifiedName.split('/');
  return parts[0] || summary.qualifiedName;
}

// Fix 10: Check all available fields for GitHub repository
function extractRepositoryUrl(
  summary: SmitheryServerSummary,
  detail: SmitheryServerDetail | null,
): string | null {
  // 1. Check homepage for GitHub URL
  const homepage = summary.homepage;
  if (homepage && homepage.includes('github.com')) {
    return normalizeGitHubUrl(homepage);
  }

  if (detail) {
    // 2. Check connections for GitHub URLs
    for (const conn of detail.connections) {
      if (conn.type === 'stdio' && 'bundleUrl' in conn) {
        const bundleUrl = conn.bundleUrl;
        if (bundleUrl.includes('github.com')) {
          return normalizeGitHubUrl(bundleUrl);
        }
      }
    }

    // 3. Check deployment URL for GitHub
    if (detail.deploymentUrl && detail.deploymentUrl.includes('github.com')) {
      return normalizeGitHubUrl(detail.deploymentUrl);
    }
  }

  // 4. Check if qualifiedName looks like a GitHub path (owner/repo pattern)
  const parts = summary.qualifiedName.split('/');
  if (parts.length === 2) {
    // Could be a GitHub repo — construct URL but only if it looks like a real repo
    const [owner, repo] = parts;
    if (
      owner.length > 0 &&
      repo.length > 0 &&
      !owner.startsWith('@') &&
      !repo.includes('.')
    ) {
      return `https://github.com/${owner}/${repo}`;
    }
  }

  return null;
}

function normalizeGitHubUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'github.com') {
      const segments = parsed.pathname.split('/').filter(Boolean);
      if (segments.length >= 2) {
        return `https://github.com/${segments[0]}/${segments[1]}`;
      }
    }
  } catch {
    // Not a valid URL
  }
  return url;
}

function extractFeatures(
  detail: SmitheryServerDetail | null,
): Array<{ title: string; description: string }> {
  if (!detail?.tools) return [];

  return detail.tools.slice(0, 10).map((tool) => ({
    title: tool.name,
    description: tool.description || `Tool: ${tool.name}`,
  }));
}

function buildTechnicalSpec(
  detail: SmitheryServerDetail | null,
): MappedServer['relations']['technicalSpec'] {
  if (!detail) return null;

  const platforms: string[] = [];
  const integrations: string[] = [];

  for (const conn of detail.connections) {
    if (conn.type === 'stdio' && 'runtime' in conn) {
      platforms.push(conn.runtime);
    }
    if (conn.type === 'http') {
      platforms.push('cloud-hosted');
    }
  }

  if (detail.tools && detail.tools.length > 0) {
    integrations.push(`tools:${detail.tools.length}`);
  }
  if (detail.resources && detail.resources.length > 0) {
    integrations.push(`resources:${detail.resources.length}`);
  }
  if (detail.prompts && detail.prompts.length > 0) {
    integrations.push(`prompts:${detail.prompts.length}`);
  }

  return {
    supportedPlatforms: platforms,
    compatibility: detail.remote ? 'cloud' : 'local',
    integrations,
    localBindingControls: detail.remote
      ? 'Not required — cloud hosted'
      : 'Standard MCP stdio binding',
  };
}

function buildInstallationSteps(
  summary: SmitheryServerSummary,
  detail: SmitheryServerDetail | null,
): MappedServer['relations']['installationSteps'] {
  const steps: MappedServer['relations']['installationSteps'] = [];

  steps.push({
    stepNumber: 1,
    title: 'Install via Smithery',
    codeSnippet: `npx -y @smithery/cli install ${summary.qualifiedName}`,
    instructions: `Install ${summary.displayName} using the Smithery CLI.`,
  });

  if (detail?.connections) {
    const httpConn = detail.connections.find((c) => c.type === 'http');
    if (httpConn) {
      steps.push({
        stepNumber: 2,
        title: 'Connect via HTTP',
        codeSnippet: `# Endpoint: ${summary.displayName}`,
        instructions:
          'This server is hosted on Smithery. Connect using the provided endpoint URL.',
      });
    }
  }

  return steps;
}

// Fix 6: Deterministic quality score from multiple signals
function computeQualityScore(summary: SmitheryServerSummary): number {
  let score = 0;

  // Verified bonus (0–3 points)
  if (summary.verified) score += 3;

  // Deployed bonus (0–2 points)
  if (summary.isDeployed) score += 2;

  // By-Smithery bonus (0–1 point)
  if (summary.bySmithery) score += 1;

  // Use count contribution (0–4 points, log-scaled)
  // 1 use → 0, 10 → 1.3, 100 → 2.6, 1000 → 4.0, capped at 4
  const useScore = Math.min(4, Math.log10(Math.max(summary.useCount, 1)) * 1.33);
  score += useScore;

  // Smithery score if available (0–2 points, normalized from 0–1)
  if (summary.score !== null && summary.score !== undefined) {
    score += Math.min(2, summary.score * 2);
  }

  // Clamp to 0–10
  return Math.round(Math.min(10, Math.max(0, score)) * 100) / 100;
}

function buildFullDescription(
  summary: SmitheryServerSummary,
  detail: SmitheryServerDetail | null,
): string {
  const parts: string[] = [];

  parts.push(summary.description);

  if (detail?.tools && detail.tools.length > 0) {
    parts.push(`\n## Available Tools\n`);
    parts.push(
      detail.tools
        .map((t) => `- **${t.name}**: ${t.description || 'No description'}`)
        .join('\n'),
    );
  }

  if (detail?.resources && detail.resources.length > 0) {
    parts.push(`\n## Resources\n`);
    parts.push(detail.resources.map((r) => `- ${r.name}`).join('\n'));
  }

  parts.push(`\n---\n*Imported from Smithery Registry — qualified name: \`${summary.qualifiedName}\`*`);
  return parts.join('\n');
}

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 3) + '...';
}
