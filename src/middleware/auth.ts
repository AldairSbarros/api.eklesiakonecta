import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  id: number;
  perfil: string;
  congregacaoId?: number;
  iat?: number;
  exp?: number;
}

interface AuthenticatedRequest extends Request {
  user?: DecodedToken;
}

export default function authMiddleware(perfisPermitidos: string[] = []) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Token não fornecido ou formato inválido' });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({ error: 'Token não fornecido' });
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'segredo') as DecodedToken;
      req.user = decoded;

<<<<<<< HEAD
=======
      // Permite SUPERUSER acessar tudo
      if (decoded.perfil === 'SUPERUSER' || (decoded as any).superuser === true) {
        return next();
      }
>>>>>>> 141763c47bccc97b5b7c143a9407e64c2990b451
      if (perfisPermitidos.length && !perfisPermitidos.includes(decoded.perfil)) {
        res.status(403).json({ error: 'Acesso negado para este perfil' });
        return;
      }
<<<<<<< HEAD

=======
>>>>>>> 141763c47bccc97b5b7c143a9407e64c2990b451
      next();
    } catch (err) {
      res.status(401).json({ error: 'Token inválido ou expirado' });
      return;
    }
  };
}