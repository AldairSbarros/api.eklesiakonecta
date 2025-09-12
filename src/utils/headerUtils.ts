import { Request } from 'express';

/**
 * Extrai o schema dos headers da requisição.
 * Suporta tanto 'schema' quanto 'x-church-schema' para compatibilidade.
 */
export function extractSchema(req: Request): string | undefined {
  return req.headers['schema'] as string || req.headers['x-church-schema'] as string;
}

/**
 * Valida se o schema foi informado e retorna erro padronizado se não.
 */
export function validateSchema(schema: string | undefined): { error?: string } {
  if (!schema) {
    return { error: 'Schema não informado no header.' };
  }
  return {};
}