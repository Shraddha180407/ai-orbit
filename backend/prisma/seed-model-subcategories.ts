import "dotenv/config";
import { PrismaClient } from "@prisma/client";

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const MODEL_SUBCATEGORIES = [
  { name: "LLM", slug: "llm", description: "Large Language Models for text generation, conversation, and language understanding" },
  { name: "Image Generation", slug: "image-generation", description: "AI models for generating images from text prompts or other inputs" },
  { name: "Video Generation", slug: "video-generation", description: "AI models for creating and synthesizing video content" },
  { name: "Speech", slug: "speech", description: "AI models for speech recognition, synthesis, and voice processing" },
  { name: "Multimodal", slug: "multimodal", description: "AI models that process and generate across multiple modalities (text, image, audio, video)" },
  { name: "Code Generation", slug: "code-generation", description: "AI models for writing, completing, and transforming code" },
  { name: "Embedding", slug: "embedding", description: "AI models for generating vector embeddings for search, clustering, and similarity" },
  { name: "Reasoning", slug: "reasoning", description: "AI models specialized in logical reasoning, problem solving, and chain-of-thought" },
  { name: "Vision Models", slug: "vision-models", description: "AI models for image understanding, object detection, and visual analysis" },
  { name: "Open Source Models", slug: "open-source-models", description: "Openly licensed AI models available for public use and modification" },
  { name: "Testing", slug: "testing", description: "AI models and tools for automated testing, QA, and test generation" },
  { name: "E-commerce", slug: "ecommerce", description: "AI models for product recommendations, pricing, and e-commerce optimization" },
  { name: "Recruitment", slug: "recruitment", description: "AI models for hiring, resume screening, and talent matching" },
  { name: "Translation", slug: "translation", description: "AI models for translating text and speech across languages" },
  { name: "Project Management", slug: "project-management", description: "AI models for project planning, task management, and workflow automation" },
] as const;

async function main() {
  console.log("Seeding model subcategories...");

  for (const sub of MODEL_SUBCATEGORIES) {
    await prisma.modelSubCategory.upsert({
      where: { slug: sub.slug },
      update: { name: sub.name, description: sub.description },
      create: { name: sub.name, slug: sub.slug, description: sub.description },
    });
  }

  console.log(`Seeded ${MODEL_SUBCATEGORIES.length} model subcategories.`);
}

main()
  .catch((e) => {
    console.error("Error seeding model subcategories:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
