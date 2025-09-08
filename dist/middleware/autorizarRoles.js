"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autorizarRoles = autorizarRoles;
function autorizarRoles(rolesPermitidos) {
    return (req, res, next) => {
        const user = req.user;
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
//# sourceMappingURL=autorizarRoles.js.map