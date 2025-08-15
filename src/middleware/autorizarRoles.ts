import { Request, Response, NextFunction } from "express";

export function autorizarRoles(rolesPermitidos: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;
    // Padronize para maiúsculo
    const perfil = user?.perfil?.toUpperCase();
    const roles = rolesPermitidos.map(r => r.toUpperCase());
    // Permite SUPERUSER acessar tudo
    if (!user) {
      res.status(403).json({ error: "Acesso negado." });
      return;
    }
    if (perfil === 'SUPERUSER' || user.superuser === true) {
      return next();
    }
    if (!roles.includes(perfil)) {
      res.status(403).json({ error: "Acesso negado." });
      return;
    }
    next();
  };
}