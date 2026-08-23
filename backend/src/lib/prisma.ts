import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaNeon, PrismaNeonHttp } from '@prisma/adapter-neon';

function resolveDbUrl(env: unknown): string {
import { PrismaNeonHttp } from '@prisma/adapter-neon';

let _cachedWorkerPrisma: PrismaClient | null = null;
let _cachedDbUrl: string | null = null;

export function getPrisma(env: unknown) {
  const envObj = (typeof env === 'object' && env !== null) ? env as Record<string, unknown> : {};
  const dbUrl = (typeof envObj.DATABASE_URL === 'string' ? envObj.DATABASE_URL : undefined) || process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error('DATABASE_URL is not configured');
  }
  return dbUrl;
}

// Module-level cache for the Cloudflare Worker isolate context.
// Worker isolates are reused across requests, so this client must be safe
// to share across requests. PrismaNeonHttp (Neon's stateless HTTP driver)
// issues each query as an independent fetch with no persistent socket, so
// caching it here is safe and avoids the ~1.5-2s per-request connection
// cost. Do NOT swap this back to the WS-based PrismaNeon: a Pool/socket
// created in one request's I/O context and reused from a later request's
// handler throws "Cannot perform I/O on behalf of a different request" in
// Workers (this is what caused the 500s on GET endpoints like /api/v1/tools).
//
// Caveat inherited from PrismaNeonHttp: it can't run interactive
// `$transaction(async (tx) => ...)` callbacks (batch `$transaction([...])`
// is fine). Routes that need an interactive transaction must use
// getPrismaTx() below instead.
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

