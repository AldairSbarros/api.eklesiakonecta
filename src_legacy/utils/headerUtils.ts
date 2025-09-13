import { Request } from 'express';

/**
 * Extrai o schema dos headers da requisição.
 * Suporta tanto 'schema' quanto 'x-church-schema' para compatibilidade.
 */
export function extractSchema(req: Request): string | undefined {
  const headerCandidates = [
    'schema',
    'x-church-schema',
    'x-tenant-schema',
    'x-schema',
    'x-tenant'
  ];
  for (const key of headerCandidates) {
    const val = req.headers[key] as string | undefined;
    if (val) return val;
  }
  // Fallback: permitir vir no body (ex: login enviando schema explícito)
  if (req.body && typeof req.body.schema === 'string') return req.body.schema;
  return undefined;
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