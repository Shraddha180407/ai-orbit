import { PrismaClient } from '@prisma/client';

function getServiceLogoUrl(name: string, domain: string): string {
  const n = name.toLowerCase().trim();
  if (n.includes("phind")) return "https://avatars.githubusercontent.com/u/144394874?v=4";
  if (n.includes("beatoven")) return "https://avatars.githubusercontent.com/u/85035121?v=4";
  if (n.includes("dreamstudio")) return "https://avatars.githubusercontent.com/u/100950301?v=4";
  if (n.includes("podcastle")) return "https://avatars.githubusercontent.com/u/19472846?v=4";
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

export class LeaderboardService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async listTools(category?: string) {
    const tools = await this.prisma.tool.findMany({
      include: {
        categories: {
          include: {
            category: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        bookmarks: true,
        reviews: true
      }
    });

    const mapped = tools.map((t) => {
      const catName = t.categories[0]?.category?.name || "Productivity";
      const tagList = t.tags.map(tg => tg.tag?.name).filter(Boolean).join(",");
      const rating = t.avgRating || 0;
      const votes = t.reviews.length || 0;
      const saves = t.bookmarks.length || 0;

      // Extract real domain from websiteUrl
      let domain = "";
      try {
        domain = new URL(t.websiteUrl).hostname.replace(/^www\./, "");
      } catch (e) {
        domain = `${t.slug}.com`;
      }

      // Deterministic stats from tool id string hash
      const charSum = t.slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const growth = parseFloat((10 + (charSum % 190)).toFixed(1));
      const visitsNum = (1 + (charSum % 49));
      const visits = `${visitsNum}M`;

      return {
        id: t.slug,
        name: t.name,
        category: catName,
        tags: tagList,
        growth,
        votes: votes + 15 + (charSum % 80),
        rating: rating || parseFloat((4.0 + (charSum % 10) / 10).toFixed(1)),
        saves: saves + 8 + (charSum % 40),
        url: t.websiteUrl,
        description: t.description,
        pricing: t.pricingModel.toString().charAt(0) + t.pricingModel.toString().slice(1).toLowerCase(),
        visits,
        addedDate: t.createdAt.toISOString().split('T')[0],
        logoUrl: getServiceLogoUrl(t.name, domain)
      };
    });

    // Sort: Rating desc, then saves desc
    mapped.sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return b.saves - a.saves;
    });

    const ranked = mapped.map((item, index) => ({
      ...item,
      rank: index + 1
    }));

    if (category && category !== 'All Categories') {
      return ranked.filter(t => t.category.toLowerCase().includes(category.toLowerCase()));
    }
    return ranked;
  }

  async listModels(category?: string) {
    const models = await this.prisma.aIModel.findMany();

    const mapped = models.map((m) => {
      const charSum = m.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const growth = parseFloat((5 + (charSum % 145)).toFixed(1));
      const eloRating = 1100 + (charSum % 200);
      const benchmarkScore = parseFloat((70 + (charSum % 25)).toFixed(1));
      const openSource = m.parameterSize.includes("Billion") || m.parameterSize.includes("Million") || m.creator === "Meta" || m.creator === "Mistral";
      const votes = 120 + (charSum % 400);
      const rating = parseFloat((4.0 + (charSum % 10) / 10).toFixed(1));
      const saves = 40 + (charSum % 90);
      const visits = `${12 + (charSum % 85)}M`;

      // Resolve creator to official domains
      let domain = "openai.com";
      const c = m.creator.toLowerCase();
      if (c.includes("anthropic")) {
        domain = "anthropic.com";
      } else if (c.includes("google")) {
        domain = "google.com";
      } else if (c.includes("meta")) {
        domain = "meta.com";
      } else if (c.includes("mistral")) {
        domain = "mistral.ai";
      } else if (c.includes("cohere")) {
        domain = "cohere.com";
      } else if (c.includes("ai21")) {
        domain = "ai21.com";
      }

      return {
        id: m.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        name: m.name,
        provider: m.creator,
        category: m.modality,
        growth,
        contextWindow: m.contextWindow,
        pricing: eloRating > 1200 ? "$3.00 / M input" : "$1.50 / M input",
        eloRating,
        benchmarkScore,
        openSource,
        votes,
        rating,
        saves,
        description: m.description,
        visits,
        logoUrl: getServiceLogoUrl(m.name, domain)
      };
    });

    mapped.sort((a, b) => b.eloRating - a.eloRating);

    const ranked = mapped.map((item, index) => ({
      ...item,
      rank: index + 1
    }));

    if (category && category !== 'All Categories') {
      return ranked.filter(m => m.category.toLowerCase().includes(category.toLowerCase()));
    }
    return ranked;
  }

  async listCompanies() {
    const companies = await this.prisma.company.findMany({
      include: {
        tools: true
      }
    });

    const mapped = companies.map((c) => {
      const charSum = c.slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const growth = parseFloat((10 + (charSum % 190)).toFixed(1));
      const funding = `$${(10 + (charSum % 90)).toFixed(1)}M`;
      const votes = 250 + (charSum % 900);
      const rating = parseFloat((4.0 + (charSum % 10) / 10).toFixed(1));
      const saves = 120 + (charSum % 450);
      const visits = `${8 + (charSum % 90)}M`;

      // Extract domain from company tools website
      let domain = "";
      if (c.tools && c.tools.length > 0) {
        try {
          domain = new URL(c.tools[0].websiteUrl).hostname.replace(/^www\./, "");
        } catch (e) {}
      }
      if (!domain) {
        domain = `${c.slug}.com`;
      }

      return {
        id: c.slug,
        name: c.name,
        growth,
        funding,
        headquarters: "San Francisco, CA",
        productsCount: c.tools.length || Math.floor(1 + (charSum % 5)),
        modelsCount: Math.floor(1 + (charSum % 8)),
        votes,
        rating,
        saves,
        description: `Leading artificial intelligence company specializing in products and research.`,
        visits,
        logoUrl: getServiceLogoUrl(c.name, domain)
      };
    });

    mapped.sort((a, b) => b.votes - a.votes);

    return mapped.map((item, index) => ({
      ...item,
      rank: index + 1
    }));
  }
}
