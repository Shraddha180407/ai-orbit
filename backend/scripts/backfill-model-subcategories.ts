import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { logger } from "../src/lib/logger.js";

// ---------------------------------------------------------------------------
// SAFETY: This script ONLY inserts rows into ModelSubCategoryItem.
// It NEVER modifies, deletes, or updates any other table or column.
//
// Usage:
//   npx tsx scripts/backfill-model-subcategories.ts            (live run)
//   npx tsx scripts/backfill-model-subcategories.ts --dry-run  (dry run)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Dry-run detection
// ---------------------------------------------------------------------------

const DRY_RUN = process.argv.includes("--dry-run");

// ---------------------------------------------------------------------------
// Batch size for createMany inserts
// ---------------------------------------------------------------------------

const BATCH_SIZE = 500;

// ---------------------------------------------------------------------------
// Classification rules
// Each subcategory maps to a set of rules checked against model metadata:
//   - modelType (exact enum match)
//   - modality (substring match, lowercase)
//   - namePatterns (substring match, lowercase)
//   - slugPatterns (substring match, lowercase)
//   - capabilityPatterns (substring match within capabilities array, lowercase)
//   - descriptionPatterns (substring match, lowercase)
//   - openSource (boolean match)
// A model may match multiple subcategories.
// ---------------------------------------------------------------------------

interface ClassificationRule {
  slug: string;
  modelTypeMatches?: string[];
  modalityMatches?: string[];
  namePatterns?: string[];
  slugPatterns?: string[];
  capabilityPatterns?: string[];
  descriptionPatterns?: string[];
  openSourceMatch?: boolean;
}

const RULES: ClassificationRule[] = [
  // ---- LLM ----
  {
    slug: "llm",
    modelTypeMatches: ["TEXT"],
    modalityMatches: ["text"],
    namePatterns: [
      "llm", "gpt", "claude", "gemini", "llama", "mistral", "phi", "qwen",
      "deepseek", "command", "jais", "falcon", "mpt", "dolly", "vicuna",
      "alpaca", "wizard", "openchat", "neural-chat", "zephyr", "stablelm",
    ],
    slugPatterns: ["llm", "gpt", "claude", "gemini", "llama", "mistral"],
    capabilityPatterns: ["text generation", "conversation", "chat", "instruct"],
    descriptionPatterns: [
      "language model", "text generation", "conversation", "chatbot",
      "natural language", "instruction following",
    ],
  },

  // ---- Image Generation ----
  {
    slug: "image-generation",
    modelTypeMatches: ["IMAGE"],
    modalityMatches: ["image"],
    namePatterns: [
      "dall-e", "dalle", "stable diffusion", "midjourney", "imagen",
      "firefly", "playground", "lexica", "kandinsky", "deepfloyd",
      "sdxl", "sd-xl",
    ],
    slugPatterns: ["dall-e", "dalle", "stable-diffusion", "image-gen", "imagen"],
    capabilityPatterns: [
      "image generation", "text-to-image", "image synthesis",
      "image creation", "generating images",
    ],
    descriptionPatterns: [
      "image generation", "generating images", "text-to-image",
      "image synthesis", "image creation",
    ],
  },

  // ---- Video Generation ----
  {
    slug: "video-generation",
    modelTypeMatches: ["VIDEO"],
    modalityMatches: ["video"],
    namePatterns: [
      "sora", "runway", "pika", "kling", "luma", "dream-machine",
      "stable-video", "cogvideo", "video-gen",
    ],
    slugPatterns: ["sora", "runway", "pika", "kling", "video-gen", "video"],
    capabilityPatterns: [
      "video generation", "text-to-video", "video synthesis",
      "video creation", "generating videos",
    ],
    descriptionPatterns: [
      "video generation", "generating videos", "text-to-video",
      "video synthesis", "video creation",
    ],
  },

  // ---- Speech ----
  {
    slug: "speech",
    modelTypeMatches: ["AUDIO"],
    modalityMatches: ["audio", "speech", "voice"],
    namePatterns: [
      "whisper", "bark", "xtts", "tortoise", "vall-e", "tts", "speech",
      "voice", "eleven", "coqui", "deepgram", "assembly", "wav2vec",
      "hubert", "wavlm",
    ],
    slugPatterns: ["whisper", "bark", "tts", "speech", "voice", "audio"],
    capabilityPatterns: [
      "speech recognition", "text-to-speech", "speech synthesis",
      "voice cloning", "transcription", "audio generation",
      "speech-to-text", "voice generation",
    ],
    descriptionPatterns: [
      "speech recognition", "text-to-speech", "speech synthesis",
      "voice cloning", "transcription", "audio processing",
      "speech-to-text", "voice",
    ],
  },

  // ---- Multimodal ----
  {
    slug: "multimodal",
    modelTypeMatches: ["MULTIMODAL"],
    modalityMatches: ["multimodal", "multi-modal"],
    namePatterns: [
      "gpt-4o", "gpt-4v", "claude-3", "gemini-pro", "gemini-1.5",
      "llava", "bakllava", "cogvlm", "internvl", "qwen-vl",
      "phi-3-vision", "moondream",
    ],
    slugPatterns: ["multimodal", "multi-modal", "gpt-4o", "gemini", "claude-3"],
    capabilityPatterns: [
      "multimodal", "multi-modal", "image understanding", "visual reasoning",
      "cross-modal", "text and image", "image and text",
    ],
    descriptionPatterns: [
      "multimodal", "multi-modal", "processes multiple modalities",
      "understands images", "visual understanding",
    ],
  },

  // ---- Code Generation ----
  {
    slug: "code-generation",
    modelTypeMatches: ["CODE"],
    namePatterns: [
      "codellama", "code-llama", "starcoder", "deepseek-coder",
      "codex", "copilot", "codegemma", "codegeex", "wizard-coder",
      "phind", "codeshell", "dscoder", "code-gecko",
    ],
    slugPatterns: ["code", "coder", "codellama", "starcoder", "codex"],
    capabilityPatterns: [
      "code generation", "code completion", "code synthesis",
      "programming", "coding", "code assistant",
    ],
    descriptionPatterns: [
      "code generation", "code completion", "programming",
      "coding assistant", "software development",
    ],
  },

  // ---- Embedding ----
  {
    slug: "embedding",
    namePatterns: [
      "embed", "e5", "bge", "gte", "instructor", "sentence-transformers",
      "text-embedding", "openai-embedding", "cohere-embed",
    ],
    slugPatterns: ["embed", "e5", "bge", "gte", "instructor"],
    capabilityPatterns: [
      "embeddings", "vector embeddings", "text embeddings",
      "semantic search", "similarity", "sentence embeddings",
    ],
    descriptionPatterns: [
      "embedding", "vector representation", "semantic search",
      "sentence embedding", "text embedding",
    ],
  },

  // ---- Reasoning ----
  {
    slug: "reasoning",
    namePatterns: [
      "o1", "o3", "o4", "deepseek-r1", "qwq", "reason",
      "think", "chain-of-thought", "cot",
    ],
    slugPatterns: ["o1", "o3", "o4", "deepseek-r1", "qwq", "reason"],
    capabilityPatterns: [
      "reasoning", "chain-of-thought", "logical reasoning",
      "problem solving", "mathematical reasoning",
    ],
    descriptionPatterns: [
      "reasoning", "chain-of-thought", "logical reasoning",
      "problem solving", "mathematical", "step-by-step",
    ],
  },

  // ---- Vision Models ----
  {
    slug: "vision-models",
    modelTypeMatches: ["IMAGE"],
    modalityMatches: ["vision", "image"],
    namePatterns: [
      "yolo", "sam", "segment-anything", "clip", "siglip", "dino",
      "detr", "resnet", "vit", "swin", "grounding-dino", "owl",
      " Florence",
    ],
    slugPatterns: ["yolo", "sam", "clip", "siglip", "dino", "vision", "vit"],
    capabilityPatterns: [
      "image understanding", "object detection", "image classification",
      "image segmentation", "visual analysis", "image recognition",
    ],
    descriptionPatterns: [
      "image understanding", "object detection", "image classification",
      "visual analysis", "image recognition", "computer vision",
    ],
  },

  // ---- Open Source Models ----
  {
    slug: "open-source-models",
    openSourceMatch: true,
    namePatterns: [
      "llama", "mistral", "phi", "qwen", "deepseek", "gemma",
      "falcon", "mpt", "dolly", "bloom", "oasst", "redpajama",
      "open-llm", "stable", "mpt",
    ],
    slugPatterns: [
      "llama", "mistral", "phi", "qwen", "deepseek", "gemma",
      "falcon", "mpt", "dolly", "bloom", "open",
    ],
    descriptionPatterns: [
      "open source", "openly licensed", "apache", "mit license",
      "publicly available",
    ],
  },

  // ---- Testing ----
  {
    slug: "testing",
    namePatterns: ["test", "qa", "quality", "lint", "benchmark", "eval"],
    slugPatterns: ["test", "qa", "benchmark", "eval"],
    capabilityPatterns: [
      "testing", "test generation", "quality assurance",
      "code testing", "automated testing",
    ],
    descriptionPatterns: [
      "testing", "test generation", "quality assurance",
      "automated testing", "test automation",
    ],
  },

  // ---- E-commerce ----
  {
    slug: "ecommerce",
    namePatterns: [
      "shop", "commerce", "product", "recommend", "pricing", "sales",
    ],
    slugPatterns: ["shop", "commerce", "product", "recommend", "pricing"],
    capabilityPatterns: [
      "product recommendation", "pricing optimization",
      "e-commerce", "shopping", "personalization",
    ],
    descriptionPatterns: [
      "e-commerce", "product recommendation", "pricing",
      "shopping", "retail",
    ],
  },

  // ---- Recruitment ----
  {
    slug: "recruitment",
    namePatterns: [
      "hire", "recruit", "resume", "talent", "job", "career",
    ],
    slugPatterns: ["hire", "recruit", "resume", "talent", "job"],
    capabilityPatterns: [
      "resume screening", "talent matching", "hiring",
      "recruitment", "job matching",
    ],
    descriptionPatterns: [
      "recruitment", "hiring", "resume", "talent",
      "job matching", "candidate",
    ],
  },

  // ---- Translation ----
  {
    slug: "translation",
    namePatterns: [
      "translate", "nllb", "m2m", "opus", "seamless", "bloom",
      "madlad", "ilingual",
    ],
    slugPatterns: ["translate", "nllb", "m2m", "opus", "seamless"],
    capabilityPatterns: [
      "translation", "machine translation", "language translation",
      "multilingual translation", "cross-lingual",
    ],
    descriptionPatterns: [
      "translation", "machine translation", "language translation",
      "multilingual", "cross-lingual",
    ],
  },

  // ---- Project Management ----
  {
    slug: "project-management",
    namePatterns: [
      "project", "task", "workflow", "planning", "kanban", "sprint",
    ],
    slugPatterns: ["project", "task", "workflow", "planning"],
    capabilityPatterns: [
      "project management", "task management", "workflow automation",
      "planning", "scheduling",
    ],
    descriptionPatterns: [
      "project management", "task management", "workflow",
      "planning", "sprint",
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

interface ModelRecord {
  id: string;
  name: string;
  slug: string;
  creator: string;
  description: string;
  modality: string;
  capabilities: string[];
  modelType: string | null;
  openSource: boolean;
}

function matchesRule(model: ModelRecord, rule: ClassificationRule): boolean {
  // Check modelType
  if (rule.modelTypeMatches && model.modelType) {
    if (rule.modelTypeMatches.includes(model.modelType)) return true;
  }

  // Check modality
  if (rule.modalityMatches && model.modality) {
    const modalityLower = model.modality.toLowerCase();
    for (const pattern of rule.modalityMatches) {
      if (modalityLower.includes(pattern.toLowerCase())) return true;
    }
  }

  // Check name
  if (rule.namePatterns) {
    const nameLower = model.name.toLowerCase();
    for (const pattern of rule.namePatterns) {
      if (nameLower.includes(pattern.toLowerCase())) return true;
    }
  }

  // Check slug
  if (rule.slugPatterns) {
    const slugLower = model.slug.toLowerCase();
    for (const pattern of rule.slugPatterns) {
      if (slugLower.includes(pattern.toLowerCase())) return true;
    }
  }

  // Check capabilities
  if (rule.capabilityPatterns && model.capabilities.length > 0) {
    const capsLower = model.capabilities.map((c) => c.toLowerCase());
    for (const pattern of rule.capabilityPatterns) {
      const patternLower = pattern.toLowerCase();
      for (const cap of capsLower) {
        if (cap.includes(patternLower)) return true;
      }
    }
  }

  // Check description
  if (rule.descriptionPatterns && model.description) {
    const descLower = model.description.toLowerCase();
    for (const pattern of rule.descriptionPatterns) {
      if (descLower.includes(pattern.toLowerCase())) return true;
    }
  }

  // Check openSource
  if (rule.openSourceMatch !== undefined) {
    if (model.openSource !== rule.openSourceMatch) return false;
    // If openSource matches, also require at least one name/slug pattern
    // to avoid classifying ALL open source models into this category
    const hasNameMatch =
      rule.namePatterns?.some((p) =>
        model.name.toLowerCase().includes(p.toLowerCase())
      ) ?? false;
    const hasSlugMatch =
      rule.slugPatterns?.some((p) =>
        model.slug.toLowerCase().includes(p.toLowerCase())
      ) ?? false;
    const hasDescMatch =
      rule.descriptionPatterns?.some((p) =>
        model.description.toLowerCase().includes(p.toLowerCase())
      ) ?? false;
    if (!hasNameMatch && !hasSlugMatch && !hasDescMatch) return false;
    return true;
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
    logger.info("=== DRY RUN: Backfill Model SubCategory Mappings ===\n");
    logger.info("NO database writes will be performed.\n");
  } else {
    logger.info("=== Backfill Model SubCategory Mappings ===\n");
  }

  // 1. Load subcategories
  const subCategories = await prisma.modelSubCategory.findMany({
    select: { id: true, slug: true, name: true },
  });

  const slugToId = new Map<string, string>();
  for (const sc of subCategories) {
    slugToId.set(sc.slug, sc.id);
  }

  logger.info(`Loaded ${subCategories.length} subcategories.`);

  // 2. Load all models
  const models = await prisma.aIModel.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      creator: true,
      description: true,
      modality: true,
      capabilities: true,
      modelType: true,
      openSource: true,
    },
  });

  logger.info(`Loaded ${models.length} models.\n`);

  // 3. Load existing mappings to skip models that are already fully mapped
  const existingItems = await prisma.modelSubCategoryItem.findMany({
    select: { modelId: true, subCategoryId: true },
  });

  const existingSet = new Set(
    existingItems.map((item) => `${item.modelId}:${item.subCategoryId}`)
  );

  logger.info(`Found ${existingItems.length} existing mapping(s).\n`);

  // 4. Classify all models
  let classified = 0;
  let unclassified = 0;
  let alreadyExisted = 0;
  const unclassifiedModels: string[] = [];
  const classificationSummary: Array<{
    model: string;
    subcategories: string[];
  }> = [];

  // Build insert objects in memory
  interface InsertItem {
    modelId: string;
    subCategoryId: string;
  }

  const toInsert: InsertItem[] = [];

  for (const model of models) {
    // Determine matching subcategories
    const matchingSlugs = RULES.filter((rule) => matchesRule(model, rule)).map(
      (rule) => rule.slug
    );

    if (matchingSlugs.length === 0) {
      unclassified++;
      unclassifiedModels.push(`${model.name} (${model.id})`);
      continue;
    }

    classified++;
    classificationSummary.push({
      model: model.name,
      subcategories: matchingSlugs,
    });

    for (const slug of matchingSlugs) {
      const subCategoryId = slugToId.get(slug);
      if (!subCategoryId) {
        logger.warn(`  Subcategory slug "${slug}" not found in DB — skipping.`);
        continue;
      }

      const key = `${model.id}:${subCategoryId}`;
      if (existingSet.has(key)) {
        alreadyExisted++;
        continue;
      }

      // Prepare for insert
      toInsert.push({ modelId: model.id, subCategoryId });
      existingSet.add(key); // Prevent double-insert in same run
    }
  }

  // 5. Insert in batches
  let inserted = 0;
  let errors = 0;

  if (DRY_RUN) {
    logger.info(`\nWould insert ${toInsert.length} new mapping(s).`);
  } else {
    // Insert in batches
    for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
      const batch = toInsert.slice(i, i + BATCH_SIZE);
      try {
        await prisma.modelSubCategoryItem.createMany({
          data: batch,
          skipDuplicates: true,
        });
        inserted += batch.length;
      } catch (err) {
        logger.error(`Error inserting batch ${Math.floor(i / BATCH_SIZE) + 1}:`, err);
        errors += batch.length;
      }
    }
  }

  await prisma.$disconnect();

  // 6. Summary
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  if (DRY_RUN) {
    logger.info("\n=== Dry Run Summary ===");
    logger.info(`Models scanned:          ${models.length}`);
    logger.info(`Models classified:       ${classified}`);
    logger.info(`Models unclassified:     ${unclassified}`);
    logger.info(`Mappings already existed: ${alreadyExisted}`);
    logger.info(`Mappings that WOULD be inserted: ${toInsert.length}`);
    logger.info(`Time taken:              ${elapsed}s`);
  } else {
    logger.info("\n=== Backfill Complete ===");
    logger.info(`Models scanned:          ${models.length}`);
    logger.info(`Models classified:       ${classified}`);
    logger.info(`Models unclassified:     ${unclassified}`);
    logger.info(`Mappings inserted:       ${inserted}`);
    logger.info(`Mappings already existed: ${alreadyExisted}`);
    logger.info(`Errors:                  ${errors}`);
    logger.info(`Time taken:              ${elapsed}s`);
  }

  if (classificationSummary.length > 0) {
    logger.info(`\nClassification Summary (${classificationSummary.length} models):`);
    for (const item of classificationSummary) {
      logger.info(`  ${item.model} -> ${item.subcategories.join(", ")}`);
    }
  }

  if (unclassifiedModels.length > 0) {
    logger.info(`\nUnclassified Models (${unclassifiedModels.length}):`);
    for (const name of unclassifiedModels) {
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
