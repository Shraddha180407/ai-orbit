import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  console.log('🚀 Starting MCP Directory Platform migration...');

  try {
    // Generate Prisma client
    console.log('📝 Generating Prisma client...');
    execSync('npm run prisma generate', { stdio: 'inherit' });

    // Push schema changes to database
    console.log('🗄️ Pushing schema changes to database...');
    execSync('npm run prisma db push', { stdio: 'inherit' });

    // Seed the database with MCP data
    console.log('🌱 Seeding database with MCP data...');
    execSync('tsx prisma/seed-mcp.ts', { stdio: 'inherit' });

    console.log('✅ MCP Directory Platform migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error('❌ Error during migration:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });