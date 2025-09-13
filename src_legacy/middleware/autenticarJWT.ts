import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "seuSegredoSuperSecreto";

export function autenticarJWT(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: "Token não fornecido." });
    return;
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, secret, (err, user) => {
    if (err) {
      res.status(403).json({ error: "Token inválido." });
      return;
    }
    (req as any).user = user;
    // Se for SUPERUSER, já libera
    if (user && typeof user === 'object' && ('perfil' in user || 'superuser' in user)) {
      // @ts-ignore
      if (user.perfil === 'SUPERUSER' || user.superuser === true) {
        return next();
      }
    }
    next();
  });
}