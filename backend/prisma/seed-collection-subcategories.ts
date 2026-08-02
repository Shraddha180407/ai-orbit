import "dotenv/config";
import { PrismaClient } from "@prisma/client";

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const COLLECTION_SUBCATEGORIES = [
  { name: "Research", slug: "research", description: "Research-focused AI collections" },
  { name: "Productivity", slug: "productivity", description: "Collections focused on productivity, workflow automation, and office tools" },
  { name: "Creative", slug: "creative", description: "AI tools for image generation, video creation, design, writing, and multimedia" },
  { name: "Developer", slug: "developer", description: "Collections of coding assistants, APIs, MCP servers, repositories, and developer tools" },
  { name: "Business", slug: "business", description: "AI solutions for marketing, sales, finance, HR, customer support, and business operations" },
  { name: "Education", slug: "education", description: "AI tools for learning, tutoring, research, note-taking, and academic productivity" },
  { name: "Industry", slug: "industry", description: "Collections organized by industries such as Healthcare, Finance, Legal, Retail, and Manufacturing" },
  { name: "Open Source", slug: "open-source", description: "Curated sets of open-source AI models, frameworks, repositories, and community projects" },
  { name: "Freelancer Toolkit", slug: "freelancer-toolkit", description: "AI tools for freelancers and consultants" },
  { name: "Recruiters", slug: "recruiters", description: "HR and recruitment AI collections" },
  { name: "Analytics", slug: "analytics", description: "Analytics and BI tools" },
  { name: "Ecommerce", slug: "ecommerce", description: "E-commerce AI solutions" },
  { name: "No-Code AI", slug: "no-code-ai", description: "No-code AI solutions" },
  { name: "Healthcare", slug: "healthcare", description: "Medical AI collections" },
  { name: "Finance", slug: "finance", description: "Finance and accounting collections" },
] as const;

async function main() {
  console.log("Seeding collection subcategories...");

  for (const sub of COLLECTION_SUBCATEGORIES) {
    await prisma.collectionSubCategory.upsert({
      where: { slug: sub.slug },
      update: { name: sub.name, description: sub.description },
      create: { name: sub.name, slug: sub.slug, description: sub.description },
    });
  }

  console.log(`Seeded ${COLLECTION_SUBCATEGORIES.length} collection subcategories.`);
}

main()
  .catch((e) => {
    console.error("Error seeding collection subcategories:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
