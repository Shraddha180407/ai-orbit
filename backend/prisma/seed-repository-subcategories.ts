import "dotenv/config";
import { PrismaClient } from "@prisma/client";

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const REPOSITORY_SUBCATEGORIES = [
  { name: "LLMs", slug: "llms", description: "Open-source repositories for language models and conversational AI" },
  { name: "Generative AI", slug: "generative-ai", description: "Projects related to text, image, audio, and video generation" },
  { name: "AI Frameworks", slug: "ai-frameworks", description: "Machine learning frameworks, SDKs, APIs, and development libraries" },
  { name: "NLP", slug: "nlp", description: "Repositories for text analysis, translation, summarization, and language processing" },
  { name: "Frameworks", slug: "frameworks", description: "Libraries and frameworks for AI development" },
  { name: "Robotics", slug: "robotics", description: "AI repositories for robotics, autonomous systems, and industrial automation" },
  { name: "RAG Systems", slug: "rag-systems", description: "Retrieval-Augmented Generation frameworks and examples" },
  { name: "Deployment", slug: "deployment", description: "Tools for model training, deployment, monitoring, and CI/CD for AI" },
  { name: "Data Science", slug: "data-science", description: "Repositories for data preprocessing, visualization, analytics, and machine learning" },
  { name: "Prompt Engineering", slug: "prompt-engineering", description: "Prompt templates, prompt libraries, and optimization repositories" },
  { name: "Search Engines", slug: "search-engines", description: "AI search engines and retrieval systems" },
  { name: "Knowledge Graphs", slug: "knowledge-graphs", description: "Knowledge graph and semantic search repositories" },
  { name: "AI Agents", slug: "ai-agents", description: "Open-source autonomous agents, multi-agent systems, and agent frameworks" },
  { name: "Cloud", slug: "cloud", description: "Cloud-native AI deployment and infrastructure" },
  { name: "Computer Vision", slug: "computer-vision", description: "Repositories for image recognition, object detection, segmentation, and visual AI" },
] as const;

async function main() {
  console.log("Seeding repository subcategories...");

  for (const sub of REPOSITORY_SUBCATEGORIES) {
    await prisma.repositorySubCategory.upsert({
      where: { slug: sub.slug },
      update: { name: sub.name, description: sub.description },
      create: { name: sub.name, slug: sub.slug, description: sub.description },
    });
  }

  console.log(`Seeded ${REPOSITORY_SUBCATEGORIES.length} repository subcategories.`);
}

main()
  .catch((e) => {
    console.error("Error seeding repository subcategories:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
