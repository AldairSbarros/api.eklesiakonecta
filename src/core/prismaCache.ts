// Centraliza instâncias Prisma por schema com cache LRU + TTL inativo

let prismaCache: Map<string, { client: any; lastAccess: number }> = new Map();
const MAX_CACHE = 20;
const INACTIVE_TTL_MS = Number(process.env.PRISMA_CLIENT_IDLE_TTL_MS || 300000);

export function getPrisma(schema: string = 'public') {
  const cached = prismaCache.get(schema);
  if (cached) {
    const elapsed = Date.now() - cached.lastAccess;
    if (elapsed < INACTIVE_TTL_MS) {
      // Refresh TTL
      cached.lastAccess = Date.now();
      return cached.client;
    }
    // TTL expirado, remover
    prismaCache.delete(schema);
  }

  // Criar novo client para o schema
  const baseUrl = process.env.DATABASE_URL!;
  const dbUrl = baseUrl.includes('schema=')
    ? baseUrl.replace(/schema=([a-zA-Z0-9_]+)/, `schema=${schema}`)
    : `${baseUrl}?schema=${schema}`;

  const { PrismaClient } = require('@prisma/client');
  const client = new PrismaClient({ datasources: { db: { url: dbUrl } } });

  // Manter cache dentro do limite
  if (prismaCache.size >= MAX_CACHE) {
    // Remover entrada mais antiga (simplificado)
    const firstKey = prismaCache.keys().next().value;
    if (firstKey) {
      prismaCache.delete(firstKey);
    }
  }

  prismaCache.set(schema, { client, lastAccess: Date.now() });
  return client;
}

export function clearPrismaCache() {
  prismaCache.forEach(({ client }) => client.$disconnect());
  prismaCache.clear();
}

export function shutdownPrismaCache() {
  clearPrismaCache();
}
