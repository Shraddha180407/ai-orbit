import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { logger } from "../src/lib/logger.js";

// ---------------------------------------------------------------------------
// SAFETY: This script ONLY inserts rows into RepositorySubCategoryItem.
// It NEVER modifies, deletes, or updates any other table or column.
//
// Usage:
//   npx tsx scripts/backfill-repository-subcategories.ts            (live run)
//   npx tsx scripts/backfill-repository-subcategories.ts --dry-run  (dry run)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Dry-run detection
// ---------------------------------------------------------------------------

const DRY_RUN = process.argv.includes("--dry-run");

// ---------------------------------------------------------------------------
// Classification rules
// Each subcategory maps to a set of keywords checked against:
//   - repository.topics (exact match, lowercase)
//   - repository.name (contains, lowercase)
//   - repository.description (contains, lowercase)
// A repository may match multiple subcategories.
// ---------------------------------------------------------------------------

interface ClassificationRule {
  slug: string;
  topicMatches: string[];
  namePatterns: string[];
  descriptionPatterns: string[];
}

const RULES: ClassificationRule[] = [
  {
    slug: "llms",
    topicMatches: [
      "llm", "large-language-model", "language-model", "llama", "mistral",
      "gpt", "chatgpt", "gemini", "claude", "fine-tuning", "quantization",
      "model-compression", "knowledge-distillation", "gguf", "ggml",
      "vllm", "text-generation", "instruction-tuning", "lora", "qlora",
      "alpaca", "vicuna", "wizard", "airoboros", "openchat",
    ],
    namePatterns: ["llm", "gpt", "llama", "mistral", "chat", "model"],
    descriptionPatterns: [
      "language model", "large language model", "llm", "chatbot",
      "text generation", "fine-tun", "quantiz",
    ],
  },
  {
    slug: "generative-ai",
    topicMatches: [
      "generative-ai", "gan", "diffusion", "stable-diffusion",
      "text-to-image", "image-generation", "video-generation",
      "text-to-speech", "speech-synthesis", "voice-cloning",
      "audio-generation", "music-generation", "image-synthesis",
      "style-transfer", "deepfake", "neural-rendering",
    ],
    namePatterns: ["diffusion", "generative", "gan", "tts", "text-to-image"],
    descriptionPatterns: [
      "generative ai", "text generation", "image generation",
      "video generation", "audio generation", "speech synthesis",
      "diffusion model", "style transfer",
    ],
  },
  {
    slug: "ai-frameworks",
    topicMatches: [
      "pytorch", "tensorflow", "machine-learning", "deep-learning",
      "neural-network", "keras", "jax", "onnx", "huggingface",
      "transformers", "scikit-learn", "fastai", "lightning",
      "flax", "sonnet", "ml-framework", "training-framework",
    ],
    namePatterns: ["pytorch", "tensorflow", "keras", "jax", "onnx", "transformer"],
    descriptionPatterns: [
      "machine learning framework", "deep learning framework",
      "neural network", "training framework", "ml framework",
    ],
  },
  {
    slug: "nlp",
    topicMatches: [
      "nlp", "natural-language-processing", "text-classification",
      "sentiment-analysis", "named-entity-recognition", "text-summarization",
      "machine-translation", "question-answering", "text-processing",
      "tokenization", "word-embeddings", "language-detection",
      "text-mining", "information-extraction", "relation-extraction",
      "coreference-resolution", "dependency-parsing",
    ],
    namePatterns: ["nlp", "text", "language", "translation", "tokenizer"],
    descriptionPatterns: [
      "natural language processing", "nlp", "text analysis",
      "text classification", "sentiment", "translation",
      "summarization", "named entity", "tokeniz",
    ],
  },
  {
    slug: "frameworks",
    topicMatches: [
      "framework", "library", "sdk", "api", "developer-tools",
      "cli", "toolkit", "scaffold", "boilerplate", "template",
    ],
    namePatterns: ["framework", "sdk", "toolkit", "library"],
    descriptionPatterns: [
      "framework", "sdk", "developer tool", "library for",
      "toolkit", "building blocks",
    ],
  },
  {
    slug: "robotics",
    topicMatches: [
      "robotics", "ros", "ros2", "autonomous-vehicles", "self-driving-car",
      "drone", "industrial-automation", "robot", "manipulation",
      "locomotion", "slam", "path-planning", "motion-planning",
    ],
    namePatterns: ["robot", "drone", "autonomous", "slam"],
    descriptionPatterns: [
      "robotics", "robot", "autonomous vehicle", "self-driving",
      "drone", "manipulation", "locomotion",
    ],
  },
  {
    slug: "rag-systems",
    topicMatches: [
      "rag", "retrieval-augmented-generation", "vector-database",
      "embeddings", "semantic-search", "langchain", "llamaindex",
      "retrieval", "vector-search", "faiss", "pinecone", "weaviate",
      "chroma", "qdrant", "milvus", "pgvector",
    ],
    namePatterns: ["rag", "retrieval", "vector", "embeddings", "langchain", "llamaindex"],
    descriptionPatterns: [
      "retrieval-augmented", "rag", "vector database", "semantic search",
      "embedding", "retrieval system", "knowledge base",
    ],
  },
  {
    slug: "deployment",
    topicMatches: [
      "mlops", "model-serving", "inference", "deployment", "kubernetes",
      "docker", "ci-cd", "monitoring", "model-registry", "experiment-tracking",
      "ml-pipeline", "feature-store", "automl", "hyperparameter-tuning",
      "model-optimization", "edge-ai", "tensorrt", "inference-optimization",
    ],
    namePatterns: ["serving", "deploy", "inference", "mlops", "pipeline"],
    descriptionPatterns: [
      "model serving", "deployment", "mlops", "inference",
      "model monitoring", "ml pipeline", "production",
    ],
  },
  {
    slug: "data-science",
    topicMatches: [
      "data-science", "data-analysis", "data-visualization", "pandas",
      "numpy", "scikit-learn", "statistics", "jupyter", "notebook",
      "data-cleaning", "exploratory-data-analysis", "eda",
      "feature-engineering", "data-mining", "time-series",
      "regression", "classification", "clustering",
    ],
    namePatterns: ["data", "pandas", "numpy", "notebook", "visualization"],
    descriptionPatterns: [
      "data science", "data analysis", "data visualization",
      "exploratory", "statistical", "feature engineer",
    ],
  },
  {
    slug: "prompt-engineering",
    topicMatches: [
      "prompt-engineering", "prompt", "prompt-template", "prompt-library",
      "chatgpt-prompts", "ai-prompts", "prompt-optimization",
    ],
    namePatterns: ["prompt", "prompting"],
    descriptionPatterns: [
      "prompt engineer", "prompt template", "prompt library",
      "prompt optim", "prompting guide",
    ],
  },
  {
    slug: "search-engines",
    topicMatches: [
      "search-engine", "information-retrieval", "elasticsearch",
      "solr", "lucene", "full-text-search", "search", "whoosh",
      "meilisearch", "typesense", "algolia",
    ],
    namePatterns: ["search", "elasticsearch", "solr", "meilisearch"],
    descriptionPatterns: [
      "search engine", "information retrieval", "full-text search",
      "search index", "search api",
    ],
  },
  {
    slug: "knowledge-graphs",
    topicMatches: [
      "knowledge-graph", "graph-database", "neo4j", "ontology",
      "semantic-web", "linked-data", "graph-neural-network",
      "graphdb", "sparql", "rdf",
    ],
    namePatterns: ["knowledge-graph", "graph", "neo4j", "ontology"],
    descriptionPatterns: [
      "knowledge graph", "graph database", "semantic web",
      "ontology", "linked data",
    ],
  },
  {
    slug: "ai-agents",
    topicMatches: [
      "ai-agents", "autonomous-agents", "agent-framework",
      "multi-agent", "agentic", "agent-based-modeling",
      "tool-use", "function-calling", "planning",
    ],
    namePatterns: ["agent", "autonomous", "agentic"],
    descriptionPatterns: [
      "ai agent", "autonomous agent", "multi-agent",
      "agent framework", "agentic", "tool use",
    ],
  },
  {
    slug: "cloud",
    topicMatches: [
      "cloud", "aws", "azure", "gcp", "serverless", "cloud-computing",
      "iaas", "paas", "saas", "terraform", "infrastructure-as-code",
      "cloud-native", "cloud-deployment",
    ],
    namePatterns: ["cloud", "aws", "azure", "gcp", "serverless", "terraform"],
    descriptionPatterns: [
      "cloud", "aws", "azure", "gcp", "serverless",
      "infrastructure", "cloud-native",
    ],
  },
  {
    slug: "computer-vision",
    topicMatches: [
      "computer-vision", "image-classification", "object-detection",
      "image-segmentation", "ocr", "face-recognition", "visual-ai",
      "opencv", "yolo", "segment-anything", "depth-estimation",
      "optical-character-recognition", "image-processing",
      "video-analysis", "pose-estimation", "3d-reconstruction",
    ],
    namePatterns: ["vision", "yolo", "ocr", "segment", "detection", "opencv"],
    descriptionPatterns: [
      "computer vision", "image classification", "object detection",
      "image segmentation", "ocr", "face recognition",
      "visual", "image processing",
    ],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getPrisma(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
}

interface RepoRecord {
  id: string;
  name: string;
  description: string | null;
  language: string | null;
  topics: string[];
}

function matchesRule(repo: RepoRecord, rule: ClassificationRule): boolean {
  const topicsLower = repo.topics.map((t) => t.toLowerCase());

  for (const topic of rule.topicMatches) {
    if (topicsLower.includes(topic.toLowerCase())) return true;
  }

  const nameLower = repo.name.toLowerCase();
  for (const pattern of rule.namePatterns) {
    if (nameLower.includes(pattern.toLowerCase())) return true;
  }

  if (repo.description) {
    const descLower = repo.description.toLowerCase();
    for (const pattern of rule.descriptionPatterns) {
      if (descLower.includes(pattern.toLowerCase())) return true;
    }
  }

  return false;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const startTime = Date.now();
  const prisma = getPrisma();

  if (DRY_RUN) {
    logger.info("=== DRY RUN: Backfill Repository SubCategory Mappings ===\n");
    logger.info("NO database writes will be performed.\n");
  } else {
    logger.info("=== Backfill Repository SubCategory Mappings ===\n");
  }

  // Load subcategories
  const subCategories = await prisma.repositorySubCategory.findMany({
    select: { id: true, slug: true, name: true },
  });

  const slugToId = new Map<string, string>();
  for (const sc of subCategories) {
    slugToId.set(sc.slug, sc.id);
  }

  logger.info(`Loaded ${subCategories.length} subcategories.`);

  // Load all repositories
  const repositories = await prisma.repository.findMany({
    select: { id: true, name: true, description: true, language: true, topics: true },
  });

  logger.info(`Loaded ${repositories.length} repositories.\n`);

  // Load all existing mappings to skip repos that are already fully mapped
  const existingItems = await prisma.repositorySubCategoryItem.findMany({
    select: { repositoryId: true, subCategoryId: true },
  });

  const existingSet = new Set(
    existingItems.map((item) => `${item.repositoryId}:${item.subCategoryId}`)
  );

  logger.info(`Found ${existingItems.length} existing mapping(s).\n`);

  // Stats
  let classified = 0;
  let skipped = 0;
  let unclassified = 0;
  let inserted = 0;
  let wouldInsert = 0;
  let alreadyExisted = 0;
  let errors = 0;
  const unclassifiedRepos: string[] = [];
  const classificationSummary: Array<{
    repo: string;
    subcategories: string[];
  }> = [];

  // Process each repository
  for (const repo of repositories) {
    // Determine matching subcategories
    const matchingSlugs = RULES.filter((rule) => matchesRule(repo, rule)).map(
      (rule) => rule.slug
    );

    if (matchingSlugs.length === 0) {
      unclassified++;
      unclassifiedRepos.push(`${repo.name} (${repo.id})`);
      continue;
    }

    classified++;
    classificationSummary.push({
      repo: repo.name,
      subcategories: matchingSlugs,
    });

    let repoHasNewInsert = false;

    for (const slug of matchingSlugs) {
      const subCategoryId = slugToId.get(slug);
      if (!subCategoryId) {
        logger.warn(`  Subcategory slug "${slug}" not found in DB — skipping.`);
        continue;
      }

      const key = `${repo.id}:${subCategoryId}`;
      if (existingSet.has(key)) {
        alreadyExisted++;
        continue;
      }

      if (DRY_RUN) {
        wouldInsert++;
        repoHasNewInsert = true;
        continue;
      }

      // LIVE MODE: perform the insert
      try {
        await prisma.repositorySubCategoryItem.upsert({
          where: {
            repositoryId_subCategoryId: {
              repositoryId: repo.id,
              subCategoryId,
            },
          },
          create: { repositoryId: repo.id, subCategoryId },
          update: {}, // No-op update — just ensures idempotency
        });
        existingSet.add(key); // Prevent double-insert in same run
        inserted++;
        repoHasNewInsert = true;
      } catch (err) {
        logger.error(`  Error inserting mapping for repo ${repo.id} -> ${slug}:`, err);
        errors++;
      }
    }

    if (!repoHasNewInsert && matchingSlugs.length > 0) {
      skipped++;
    }
  }

  await prisma.$disconnect();

  // Summary
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  if (DRY_RUN) {
    logger.info("\n=== Dry Run Summary ===");
    logger.info(`Repositories scanned:     ${repositories.length}`);
    logger.info(`Repositories classified:   ${classified}`);
    logger.info(`Repositories skipped:      ${skipped}`);
    logger.info(`Repositories unclassified: ${unclassified}`);
    logger.info(`Mappings that WOULD be inserted: ${wouldInsert}`);
    logger.info(`Mappings already existing: ${alreadyExisted}`);
    logger.info(`Time taken:                ${elapsed}s`);

    if (classificationSummary.length > 0) {
      logger.info(`\nClassification Summary (${classificationSummary.length} repos):`);
      for (const item of classificationSummary) {
        logger.info(`  ${item.repo} -> ${item.subcategories.join(", ")}`);
      }
    }
  } else {
    logger.info("\n=== Backfill Complete ===");
    logger.info(`Repositories scanned:     ${repositories.length}`);
    logger.info(`Repositories classified:   ${classified}`);
    logger.info(`Repositories skipped:      ${skipped}`);
    logger.info(`Repositories unclassified: ${unclassified}`);
    logger.info(`Mappings inserted:         ${inserted}`);
    logger.info(`Mappings already existed:  ${alreadyExisted}`);
    logger.info(`Errors:                    ${errors}`);
    logger.info(`Time taken:                ${elapsed}s`);
  }

  if (unclassifiedRepos.length > 0) {
    logger.info(`\nUnclassified Repository (${unclassifiedRepos.length}):`);
    for (const name of unclassifiedRepos) {
      logger.info(`  - ${name}`);
    }
  }

  if (DRY_RUN) {
    logger.info("\n*** DRY RUN COMPLETE ***");
    logger.info("No database changes were made.");
  }
}

main().catch((err) => {
  logger.error("Fatal error:", err);
  process.exitCode = 1;
});
