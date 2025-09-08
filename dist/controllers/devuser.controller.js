"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDevUser = createDevUser;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function createDevUser(req, res) {
    try {
        const { nome, email, senha, perfil } = req.body;
        if (!nome || !email || !senha || !perfil) {
            res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
            return;
        }
        const hashed = await bcryptjs_1.default.hash(senha, 10);
        const devUser = await prisma.devUser.create({
            data: { nome, email, senha: hashed, perfil }
        });
        res.status(201).json({ id: devUser.id, nome: devUser.nome, email: devUser.email, perfil: devUser.perfil });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}
//# sourceMappingURL=devuser.controller.js.map