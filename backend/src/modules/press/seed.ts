import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding press releases...');

  // Create your first real announcement
  await prisma.pressRelease.create({
    data: {
      title: 'AI Orbit Reaches 10,000 Verified AI Tools Milestone',
      description: 'Our discovery engine has achieved a major telemetry milestone, officially mapping over 10,000 decentralized AI applications, models, and repositories globally.',
      tag: 'Product Milestone',
      date: 'August 28, 2026',
      published: true,
    },
  });

  // Create your second real announcement
  await prisma.pressRelease.create({
    data: {
      title: 'Introducing Advanced AI Agent Benchmarking & Multi-Agent Metrics',
      description: 'Empowering developers and researchers with next-generation benchmarking tools to track, filter, and compare complex agentic frameworks seamlessly.',
      tag: 'Ecosystem Update',
      date: 'August 15, 2026',
      published: true,
    },
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });