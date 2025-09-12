import { Request, Response, NextFunction } from 'express';

const SCHEMA_REGEX = /^[a-z0-9_]{3,40}$/;

export function validarSchemaHeader(req: Request, res: Response, next: NextFunction) {
  const raw = (req.headers['x-church-schema'] || req.headers['schema']) as string | undefined;
  if (!raw) return next(); // algumas rotas (login inicial) podem não ter
  const schema = raw.toLowerCase();
  if (!SCHEMA_REGEX.test(schema)) {
    return res.status(400).json({ error: 'Schema inválido.' });
  }
  // normaliza para header schema
  (req as any).tenantSchema = schema;
  next();
}
