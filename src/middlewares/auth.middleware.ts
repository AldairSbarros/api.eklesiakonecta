import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../services/jwt.service';
import { AppError } from '../utils/AppError';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Token não fornecido', 401));
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    return next();
  } catch (err) {
    return next(err);
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError('Não autenticado', 401));
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Acesso negado', 403));
    }
    next();
  };
}
