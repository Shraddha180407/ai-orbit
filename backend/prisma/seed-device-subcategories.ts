import "dotenv/config";
import { PrismaClient } from "@prisma/client";

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const DEVICE_SUBCATEGORIES = [
  { name: "AI PCs", slug: "ai-pcs", description: "Personal computers with integrated AI capabilities" },
  { name: "Smartphones", slug: "smartphones", description: "Mobile devices with on-device AI features" },
  { name: "Smart Home", slug: "smart-home", description: "AI-powered home automation and smart devices" },
  { name: "Wearables", slug: "wearables", description: "Wearable devices with AI processing capabilities" },
  { name: "AI Cameras", slug: "ai-cameras", description: "Cameras with AI-powered imaging and recognition" },
  { name: "Audio", slug: "audio", description: "AI-enhanced audio devices and speakers" },
  { name: "AR/VR", slug: "ar-vr", description: "Augmented and virtual reality headsets with AI" },
  { name: "Edge AI", slug: "edge-ai", description: "Devices performing AI inference at the edge" },
  { name: "Robotics Hardware", slug: "robotics-hardware", description: "Physical robots and robotic components" },
  { name: "Medical", slug: "medical", description: "AI-powered medical and health devices" },
  { name: "Development Boards", slug: "development-boards", description: "Boards for prototyping AI hardware projects" },
  { name: "Smart Sensors", slug: "smart-sensors", description: "Intelligent sensor devices with AI processing" },
  { name: "Automotive AI Devices", slug: "automotive-ai-devices", description: "AI devices for automotive and vehicle applications" },
  { name: "Microphones", slug: "microphones", description: "AI-enhanced microphones for voice and audio capture" },
  { name: "Farming", slug: "farming", description: "AI devices for agriculture and farming applications" },
] as const;

async function main() {
  console.log("Seeding device subcategories...");

  for (const sub of DEVICE_SUBCATEGORIES) {
    await prisma.deviceSubCategory.upsert({
      where: { slug: sub.slug },
      update: { name: sub.name, description: sub.description },
      create: { name: sub.name, slug: sub.slug, description: sub.description },
    });
  }

  console.log(`Seeded ${DEVICE_SUBCATEGORIES.length} device subcategories.`);
}

main()
  .catch((e) => {
    console.error("Error seeding device subcategories:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
