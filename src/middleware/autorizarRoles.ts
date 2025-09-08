import { Request, Response, NextFunction } from "express";

export function autorizarRoles(rolesPermitidos: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;
    // Padronize para maiúsculo
    const perfil = user?.perfil?.toUpperCase();
    const roles = rolesPermitidos.map(r => r.toUpperCase());
<<<<<<< HEAD
    // Permite superuser acessar qualquer rota
    if (user?.superuser === true) {
      return next();
    }
    if (!user || !roles.includes(perfil)) {
=======
    // Permite SUPERUSER acessar tudo
    if (!user) {
      res.status(403).json({ error: "Acesso negado." });
      return;
    }
    if (perfil === 'SUPERUSER' || user.superuser === true) {
      return next();
    }
    if (!roles.includes(perfil)) {
>>>>>>> 141763c47bccc97b5b7c143a9407e64c2990b451
      res.status(403).json({ error: "Acesso negado." });
      return;
    }
    next();
  };
}