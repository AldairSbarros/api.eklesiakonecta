"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redefinirSenha = exports.solicitarRecuperacao = void 0;
const client_1 = require("@prisma/client");
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
// 1. Solicitar recuperação de senha
const solicitarRecuperacao = async (req, res) => {
    const { email } = req.body;
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario)
        return res.status(404).json({ error: "Usuário não encontrado." });
    const token = crypto_1.default.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hora
    await prisma.tokenRecuperacaoSenha.create({
        data: { token, usuarioId: usuario.id, expiresAt }
    });
    // Aqui você enviaria o e-mail com o link: ex: https://seusite.com/reset-password?token=TOKEN
    // Simulação:
    console.log(`Link de recuperação: https://seusite.com/reset-password?token=${token}`);
    res.json({ message: "E-mail de recuperação enviado (simulado)." });
};
exports.solicitarRecuperacao = solicitarRecuperacao;
// 2. Redefinir senha
const redefinirSenha = async (req, res) => {
    const { token, novaSenha } = req.body;
    const registro = await prisma.tokenRecuperacaoSenha.findUnique({ where: { token } });
    if (!registro || registro.used || registro.expiresAt < new Date()) {
        return res.status(400).json({ error: "Token inválido ou expirado." });
    }
    const hashed = await bcryptjs_1.default.hash(novaSenha, 10);
    await prisma.usuario.update({
        where: { id: registro.usuarioId },
        data: { senha: hashed }
    });
    await prisma.tokenRecuperacaoSenha.update({
        where: { token },
        data: { used: true }
    });
    res.json({ message: "Senha redefinida com sucesso." });
};
exports.redefinirSenha = redefinirSenha;
//# sourceMappingURL=password.controller.js.map