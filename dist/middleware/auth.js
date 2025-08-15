"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authMiddleware(perfisPermitidos = []) {
    return (req, res, next) => {
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
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'segredo');
            req.user = decoded;
            // Permite SUPERUSER acessar tudo
            if (decoded.perfil === 'SUPERUSER' || decoded.superuser === true) {
                return next();
            }
            if (perfisPermitidos.length && !perfisPermitidos.includes(decoded.perfil)) {
                res.status(403).json({ error: 'Acesso negado para este perfil' });
                return;
            }
            next();
        }
        catch (err) {
            res.status(401).json({ error: 'Token inválido ou expirado' });
            return;
        }
    };
}
//# sourceMappingURL=auth.js.map