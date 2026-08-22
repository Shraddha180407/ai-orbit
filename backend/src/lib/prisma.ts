import { PrismaClient } from '@prisma/client';
import { PrismaNeonHttp } from '@prisma/adapter-neon';

let _cachedWorkerPrisma: PrismaClient | null = null;
let _cachedDbUrl: string | null = null;

export function getPrisma(env: unknown) {
  const envObj = (typeof env === 'object' && env !== null) ? env as Record<string, unknown> : {};
  const dbUrl = (typeof envObj.DATABASE_URL === 'string' ? envObj.DATABASE_URL : undefined) || process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error('DATABASE_URL is not configured');
  }

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

