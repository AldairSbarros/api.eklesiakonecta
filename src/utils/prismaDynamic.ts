import { getOrCreatePrisma, disconnectAll } from './prismaCache';

export function getPrisma(schema: string) {
  return getOrCreatePrisma(schema);
}

export function clearPrismaCache() {
  disconnectAll();
}

export function getPrismaPublic() {
  return getOrCreatePrisma('public');
}