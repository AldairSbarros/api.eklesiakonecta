"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = exports.tryDevUserAuth = void 0;
const authService = __importStar(require("../services/auth.service"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const secret = process.env.JWT_SECRET || "seuSegredoSuperSecreto";
// 1. Tenta autenticar como DevUser (superusuário global)
const tryDevUserAuth = async (email, senha, res) => {
    const devUser = await prisma.devUser.findUnique({ where: { email } });
    if (devUser && await bcryptjs_1.default.compare(senha, devUser.senha)) {
        const token = jsonwebtoken_1.default.sign({ id: devUser.id, superuser: true, perfil: devUser.perfil }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return res.json({ token, perfil: 'SUPERUSER', nome: devUser.nome });
    }
    return null;
};
exports.tryDevUserAuth = tryDevUserAuth;
// Cadastro
const register = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema)
            return res.status(400).json({ error: 'Schema não informado no header.' });
        const { nome, email, senha, perfil, congregacaoId } = req.body;
        if (!nome || !email || !senha || !perfil) {
            res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(senha, 10);
        const usuario = await authService.createUsuario(schema, {
            nome,
            email,
            senha: hashedPassword,
            perfil,
            congregacaoId
        });
        res.status(201).json({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            perfil: usuario.perfil,
            congregacaoId: usuario.congregacaoId
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.register = register;
// Login
const login = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema)
            return res.status(400).json({ error: 'Schema não informado no header.' });
        const { email, senha } = req.body;
        // 1. Tenta autenticar como DevUser (superusuário global)
        const devUserResult = await (0, exports.tryDevUserAuth)(email, senha, res);
        if (devUserResult)
            return; // Se autenticou como DevUser, já respondeu
        // 2. Fluxo normal para usuários comuns
        const usuario = await authService.findUsuarioByEmail(schema, email);
        if (!usuario) {
            res.status(401).json({ error: 'Usuário ou senha inválidos.' });
            return;
        }
        const valid = await bcryptjs_1.default.compare(senha, usuario.senha);
        if (!valid) {
            res.status(401).json({ error: 'Usuário ou senha inválidos.' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: usuario.id, perfil: usuario.perfil, congregacaoId: usuario.congregacaoId }, secret, { expiresIn: '7d' });
        res.json({
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                perfil: usuario.perfil,
                congregacaoId: usuario.congregacaoId
            }
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.login = login;
//# sourceMappingURL=auth.controller.js.map