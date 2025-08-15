"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autenticarJWT = autenticarJWT;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.JWT_SECRET || "seuSegredoSuperSecreto";
function autenticarJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ error: "Token não fornecido." });
        return;
    }
    const token = authHeader.split(" ")[1];
    jsonwebtoken_1.default.verify(token, secret, (err, user) => {
        if (err) {
            res.status(403).json({ error: "Token inválido." });
            return;
        }
        req.user = user;
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
//# sourceMappingURL=autenticarJWT.js.map