import { Request, Response, NextFunction } from 'express';

export function onlySuperUser(req: Request, res: Response, next: NextFunction): void {
  const user = (req as any).user;
<<<<<<< HEAD
  if (user && user.superuser) {
=======
  if (user && (user.superuser === true || user.perfil === 'SUPERUSER')) {
>>>>>>> 141763c47bccc97b5b7c143a9407e64c2990b451
    next();
    return;
  }
  res.status(403).json({ error: 'Acesso restrito ao superusuário.' });
}