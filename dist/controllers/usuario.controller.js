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
exports.uploadComprovante = exports.login = exports.listDizimosCongregacao = exports.changePassword = exports.resetPassword = exports.get = exports.deleteUsuario = exports.update = exports.dirigenteOuTesoureiro = exports.adminOnly = exports.create = exports.list = void 0;
exports.listarUsuarios = listarUsuarios;
const usuarioService = __importStar(require("../services/usuario.service"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const registrarLogs_service_1 = require("../services/registrarLogs.service");
async function listarUsuarios(schema) {
    const prisma = require('../utils/prismaDynamic').getPrisma(schema);
    return prisma.usuario.findMany();
}
// Listar usuários
const list = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema)
            return res.status(400).json({ error: 'Schema não informado no header.' });
        const usuarios = await listarUsuarios(schema);
        res.json(usuarios);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.list = list;
// Criar usuário
const create = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema)
            return res.status(400).json({ error: 'Schema não informado no header.' });
        const { nome, email, senha, perfil, congregacaoId, token } = req.body;
        // Verificação de token para perfis especiais
        if (perfil === 'SUPERUSER' && token !== process.env.TOKEN_SUPERUSER) {
            return res.status(403).json({ error: 'Token de autorização inválido para admin.' });
        }
        if (perfil === 'ADMIN' && token !== process.env.TOKEN_ADMIN) {
            return res.status(403).json({ error: 'Token de autorização inválido para admin.' });
        }
        if (perfil === 'Dirigente' && token !== process.env.TOKEN_PASTOR) {
            return res.status(403).json({ error: 'Token de autorização inválido para dirigente.' });
        }
        if (perfil === 'Tesoureiro' && token !== process.env.TOKEN_TESOUREIRO) {
            return res.status(403).json({ error: 'Token de autorização inválido para tesoureiro.' });
        }
        if (perfil === 'Secretario' && token !== process.env.TOKEN_SECRETARIO) {
            return res.status(403).json({ error: 'Token de autorização inválido para secretario.' });
        }
        // >>>>>>>>>>>> HASH DA SENHA <<<<<<<<<<<<
        const senhaHash = await bcryptjs_1.default.hash(senha, 10);
        const usuario = await usuarioService.criarUsuario(schema, { nome, email, senha: senhaHash, perfil, congregacaoId });
        res.status(201).json({ id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.create = create;
const adminOnly = async (req, res) => {
    res.json({ message: "Acesso permitido apenas para admin.", user: req.user });
};
exports.adminOnly = adminOnly;
const dirigenteOuTesoureiro = async (req, res) => {
    res.json({ message: "Acesso permitido para dirigente ou tesoureiro.", user: req.user });
};
exports.dirigenteOuTesoureiro = dirigenteOuTesoureiro;
// Atualizar usuário
const update = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema)
            return res.status(400).json({ error: 'Schema não informado no header.' });
        const { id } = req.params;
        const { nome, email, perfil, congregacaoId, ativo } = req.body;
        const usuario = await usuarioService.atualizarUsuario(schema, Number(id), { nome, email, perfil, congregacaoId, ativo });
        await (0, registrarLogs_service_1.registrarLog)(schema, {
            usuarioId: req.user.id,
            acao: 'atualizacao_usuario',
            detalhes: `Atualizou usuário ${id}`,
            ip: req.ip
        });
        res.json({ id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil, ativo: usuario.ativo });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.update = update;
// Deletar usuário
const deleteUsuario = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema)
            return res.status(400).json({ error: 'Schema não informado no header.' });
        const { id } = req.params;
        await (0, registrarLogs_service_1.registrarLog)(schema, {
            usuarioId: req.user.id,
            acao: 'remocao_usuario',
            detalhes: `Removeu usuário ${id}`,
            ip: req.ip
        });
        res.json({ message: 'Usuário removido com sucesso' });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.deleteUsuario = deleteUsuario;
// Obter usuário por ID
const get = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema)
            return res.status(400).json({ error: 'Schema não informado no header.' });
        const { id } = req.params;
        const usuario = await usuarioService.obterUsuario(schema, Number(id));
        if (!usuario)
            return res.status(404).json({ error: "Usuário não encontrado." });
        res.json(usuario);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.get = get;
// Redefinir senha (admin) - você deve implementar no service se necessário
const resetPassword = async (req, res) => {
    res.status(501).json({ error: 'Funcionalidade não implementada no service.' });
};
exports.resetPassword = resetPassword;
// Trocar a própria senha (direto no Prisma, pois depende do usuário logado)
const changePassword = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema)
            return res.status(400).json({ error: 'Schema não informado no header.' });
        const { senhaAtual, novaSenha } = req.body;
        const usuarioId = req.user.id;
        const prisma = require('../utils/prismaDynamic').getPrisma(schema);
        const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
        if (!usuario)
            return res.status(404).json({ error: "Usuário não encontrado." });
        const valid = await bcryptjs_1.default.compare(senhaAtual, usuario.senha);
        if (!valid)
            return res.status(401).json({ error: "Senha atual inválida." });
        const hashed = await bcryptjs_1.default.hash(novaSenha, 10);
        await prisma.usuario.update({
            where: { id: usuarioId },
            data: { senha: hashed }
        });
        res.json({ message: "Senha alterada com sucesso." });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.changePassword = changePassword;
const listDizimosCongregacao = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema)
            return res.status(400).json({ error: 'Schema não informado no header.' });
        const perfil = req.user.perfil;
        let congregacaoId = undefined;
        // Só admin pode ver todos, os outros só a própria congregação
        if (perfil !== 'admin') {
            congregacaoId = req.user.congregacaoId;
            if (!congregacaoId)
                return res.status(400).json({ error: 'Congregação não encontrada para o usuário.' });
        }
        const dizimos = await usuarioService.listarDizimosPorCongregacao(schema, congregacaoId);
        res.json(dizimos);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.listDizimosCongregacao = listDizimosCongregacao;
const login = async (req, res) => {
    // Sua lógica de login aqui
    res.json({ message: "Login realizado com sucesso" });
};
exports.login = login;
const uploadComprovante = async (req, res) => {
    // Sua lógica de upload aqui
    res.json({ message: "Comprovante enviado com sucesso" });
};
exports.uploadComprovante = uploadComprovante;
//# sourceMappingURL=usuario.controller.js.map