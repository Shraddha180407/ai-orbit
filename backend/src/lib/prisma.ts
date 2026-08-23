import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaNeon, PrismaNeonHttp } from '@prisma/adapter-neon';

function resolveDbUrl(env: unknown): string {
  const envObj = (typeof env === 'object' && env !== null) ? env as Record<string, unknown> : {};
  const dbUrl = (typeof envObj.DATABASE_URL === 'string' ? envObj.DATABASE_URL : undefined) || process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error('DATABASE_URL is not configured');
  }
  return dbUrl;
}

// Module-level cache for the Cloudflare Worker isolate context.
let _cachedWorkerPrisma: PrismaClient | null = null;
let _cachedDbUrl: string | null = null;

export function getPrisma(env: unknown) {
  const dbUrl = resolveDbUrl(env);

  if (_cachedWorkerPrisma && _cachedDbUrl === dbUrl) {
    return _cachedWorkerPrisma;
  }

  const adapter = new PrismaNeonHttp(dbUrl, {});
  const client = new PrismaClient({ adapter });
  client.$disconnect = async () => {};

  _cachedWorkerPrisma = client;
  _cachedDbUrl = dbUrl;
  return _cachedWorkerPrisma;
}

// Transaction-safe client for routes that require interactive transactions
let _cachedTxPrisma: PrismaClient | null = null;

export function getPrismaTx(env: unknown) {
  const dbUrl = resolveDbUrl(env);
  
  if (!_cachedTxPrisma) {
    const pool = new Pool({ connectionString: dbUrl });
    const adapter = new PrismaPg(pool);
    _cachedTxPrisma = new PrismaClient({ adapter });
  }
  
  return _cachedTxPrisma;
}

// Lazy fallback client for non-worker environments / scripts
let _fallbackPrisma: PrismaClient | null = null;

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    if (!_fallbackPrisma) {
      const dbUrl = process.env.DATABASE_URL;
      if (!dbUrl) {
        throw new Error('DATABASE_URL is not configured');
      }
      const adapter = new PrismaNeonHttp(dbUrl, {});
      _fallbackPrisma = new PrismaClient({ adapter });
      _fallbackPrisma.$disconnect = async () => {};
    }
    return (_fallbackPrisma as any)[prop];
  }
});