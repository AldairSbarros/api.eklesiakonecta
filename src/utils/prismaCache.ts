import { PrismaClient } from '@prisma/client';

interface CachedClient {
  client: PrismaClient;
  lastAccess: number;
}

const cache = new Map<string, CachedClient>();
const MAX_CLIENTS = Number(process.env.PRISMA_CLIENT_CACHE_MAX || 15);
const IDLE_TTL_MS = Number(process.env.PRISMA_CLIENT_IDLE_TTL_MS || 5 * 60 * 1000); // 5 min

function buildDbUrlForSchema(schema: string): string {
  const base = process.env.DATABASE_URL!;
  if (base.includes('schema=')) {
    return base.replace(/schema=([a-zA-Z0-9_]+)/, `schema=${schema}`);
  }
  const sep = base.includes('?') ? '&' : '?';
  return `${base}${sep}schema=${schema}`;
}

export function getOrCreatePrisma(schema: string): PrismaClient {
  const now = Date.now();
  const existing = cache.get(schema);
  if (existing) {
    existing.lastAccess = now;
    return existing.client;
  }

  const url = buildDbUrlForSchema(schema);
  const client = new PrismaClient({
    datasources: { db: { url } }
  });
  cache.set(schema, { client, lastAccess: now });
  enforceLimit();
  return client;
}

function enforceLimit() {
  if (cache.size <= MAX_CLIENTS) return;
  // remove mais antigos
  const entries = Array.from(cache.entries()).sort((a, b) => a[1].lastAccess - b[1].lastAccess);
  while (entries.length > 0 && cache.size > MAX_CLIENTS) {
    const [key, value] = entries.shift()!;
    try { value.client.$disconnect(); } catch {}
    cache.delete(key);
  }
}

export function pruneIdle() {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.lastAccess > IDLE_TTL_MS) {
      try { value.client.$disconnect(); } catch {}
      cache.delete(key);
    }
  }
}

// opcional: agendamento simples (mantemos referência para poder encerrar nos testes)
const PRUNE_INTERVAL_MS = 60 * 1000;
const pruneInterval = setInterval(pruneIdle, PRUNE_INTERVAL_MS);
// unref para não segurar o event loop em produção, mas ainda podemos limpar explicitamente em testes
pruneInterval.unref();

export function stopPruneInterval() {
  try { clearInterval(pruneInterval); } catch {}
}

export function disconnectAll() {
  for (const [, value] of cache.entries()) {
    try { value.client.$disconnect(); } catch {}
  }
  cache.clear();
}

export function shutdownPrismaCache() {
  stopPruneInterval();
  disconnectAll();
}

export function getCacheMetrics() {
  const now = Date.now();
  const clients = Array.from(cache.entries()).map(([schema, info]) => ({
    schema,
    idleMs: now - info.lastAccess
  }));
  return {
    total: cache.size,
    clients
  };
}
