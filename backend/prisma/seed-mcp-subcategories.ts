import "dotenv/config";
import { PrismaClient } from "@prisma/client";

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const MCP_SUBCATEGORIES = [
  { name: "MCP Servers", slug: "mcp-servers", description: "Model Context Protocol servers that provide tools and capabilities" },
  { name: "Developer Tools", slug: "developer-tools", description: "Tools for developers to build and test MCP integrations" },
  { name: "Databases", slug: "databases", description: "Database integrations for MCP" },
  { name: "File Systems", slug: "file-systems", description: "File system integrations and storage solutions" },
  { name: "Productivity", slug: "productivity", description: "Productivity and workflow automation tools" },
  { name: "APIs", slug: "apis", description: "API integrations and service connectors" },
  { name: "Cloud", slug: "cloud", description: "Cloud service integrations and deployment tools" },
  { name: "ML Platforms", slug: "ml-platforms", description: "Machine learning and AI platform integrations" },
  { name: "Browser", slug: "browser", description: "Browser extensions and web-based tools" },
  { name: "Version Control", slug: "version-control", description: "Version control and code management integrations" },
  { name: "Automation", slug: "automation", description: "Workflow automation and task scheduling tools" },
  { name: "Smart Devices", slug: "smart-devices", description: "IoT and smart device integrations" },
  { name: "Data Analytics", slug: "data-analytics", description: "Data analysis, visualization, and business intelligence tools" },
  { name: "Community", slug: "community", description: "Community-driven tools and open-source projects" },
  { name: "MCP Clients", slug: "mcp-clients", description: "Client applications for connecting to MCP servers" },
] as const;

async function main() {
  console.log("Seeding MCP subcategories...");

  for (const sub of MCP_SUBCATEGORIES) {
    await prisma.mCPSubCategory.upsert({
      where: { slug: sub.slug },
      update: { name: sub.name, description: sub.description },
      create: { name: sub.name, slug: sub.slug, description: sub.description },
    });
  }

  console.log(`Seeded ${MCP_SUBCATEGORIES.length} MCP subcategories.`);
}

main()
  .catch((e) => {
    console.error("Error seeding MCP subcategories:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
