import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaNeon } from '@prisma/adapter-neon';

// Module-level cache for the Cloudflare Worker isolate context.
// Worker isolates are reused across requests. Without caching, every
// call to getPrisma() creates a new PrismaClient + PrismaNeon adapter
// that is never $disconnect()ed, causing resource accumulation and
// eventual Cloudflare Error 1102 (resource limits exceeded).
let _cachedWorkerPrisma: PrismaClient | null = null;
let _cachedDbUrl: string | null = null;

export function getPrisma(env: unknown) {
  const envObj = (typeof env === 'object' && env !== null) ? env as Record<string, unknown> : {};
  const dbUrl = (typeof envObj.DATABASE_URL === 'string' ? envObj.DATABASE_URL : undefined) || process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error('DATABASE_URL is not configured');
  }

  // Reuse the PrismaClient within the same Worker isolate.
  // The Neon HTTP driver is stateless (each query is an independent
  // HTTP request), so sharing a client across concurrent requests is safe.
  if (_cachedWorkerPrisma && _cachedDbUrl === dbUrl) {
    return _cachedWorkerPrisma;
  }

  const adapter = new PrismaNeon({ connectionString: dbUrl });
  _cachedWorkerPrisma = new PrismaClient({ adapter });
  _cachedDbUrl = dbUrl;
  return _cachedWorkerPrisma;
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

