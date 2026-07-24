import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaNeon } from '@prisma/adapter-neon';


export function getPrisma(env: unknown) {
  const envObj = (typeof env === 'object' && env !== null) ? env as Record<string, unknown> : {};
  const dbUrl = (typeof envObj.DATABASE_URL === 'string' ? envObj.DATABASE_URL : undefined) || process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error('DATABASE_URL is not configured');
  }
  const adapter = new PrismaNeon({ connectionString: dbUrl });
  return new PrismaClient({ adapter });
}

// Singleton pg client for non-worker environments (e.g. scripts / dev server / auth module fallback)
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

