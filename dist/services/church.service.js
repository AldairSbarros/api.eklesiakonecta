"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteChurch = exports.updateChurch = exports.getChurch = exports.listChurches = exports.createChurch = void 0;
exports.getPrismaTenant = getPrismaTenant;
const client_1 = require("@prisma/client");
const child_process_1 = require("child_process");
const bcrypt_1 = __importDefault(require("bcrypt"));
const logger_1 = require("../utils/logger");
// Prisma global (schema público)
const prismaGlobal = new client_1.PrismaClient();
// Cria um novo schema no PostgreSQL
async function criarSchema(nomeSchema) {
    await prismaGlobal.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${nomeSchema}"`);
}
// Roda as migrations do Prisma no novo schema
function rodarMigrationsNoSchema(schema) {
    const dbUrl = process.env.DATABASE_URL.replace(/schema=([a-zA-Z0-9_]+)/, `schema=${schema}`);
    (0, child_process_1.execSync)(`npx prisma migrate deploy`, {
        env: { ...process.env, DATABASE_URL: dbUrl }
    });
}
// Cria o usuário admin no novo schema
async function criarAdminNoSchema({ nome, email, senha, schema }) {
    const { PrismaClient: PrismaTenant } = require("@prisma/client");
    const dbUrl = process.env.DATABASE_URL.replace(/schema=([a-zA-Z0-9_]+)/, `schema=${schema}`);
    const prismaTenant = new PrismaTenant({
        datasources: {
            db: { url: dbUrl }
        }
    });
    await prismaTenant.usuario.create({
        data: {
            nome,
            email,
            senha,
            perfil: "ADMIN",
            ativo: true
        }
    });
    await prismaTenant.$disconnect();
}
// Função utilitária para validar campos obrigatórios
function validarCamposObrigatorios(data) {
    const erros = [];
    if (!data.nome || data.nome.trim() === "")
        erros.push("Nome é obrigatório.");
    if (!data.email || data.email.trim() === "")
        erros.push("E-mail é obrigatório.");
    return erros;
}
// Criação de igreja multi-tenant por schema
const createChurch = async (data) => {
    const erros = validarCamposObrigatorios(data);
    if (erros.length > 0) {
        throw new Error(erros.join(" "));
    }
    if (data.password && data.password.length < 6) {
        throw new Error("A senha deve ter pelo menos 6 caracteres.");
    }
    const senhaParaSalvar = await bcrypt_1.default.hash(data.password || "defaultPassword", 10);
    const nomeSchema = `igreja_${Date.now()}`;
    try {
        await criarSchema(nomeSchema);
        rodarMigrationsNoSchema(nomeSchema);
        await criarAdminNoSchema({
            nome: data.nome,
            email: data.email,
            senha: senhaParaSalvar,
            schema: nomeSchema
        });
    }
    catch (error) {
        throw new Error("Erro ao criar schema ou rodar migrations: " + error.message);
    }
    try {
        const novaIgreja = await prismaGlobal.church.create({
            data: {
                nome: data.nome,
                email: data.email,
                password: senhaParaSalvar,
                schema: nomeSchema,
                status: data.status || "ativa",
            },
        });
        (0, logger_1.logAuditoria)("Cadastro de igreja", { nome: data.nome, email: data.email });
        return novaIgreja;
    }
    catch (error) {
        if (error.code === "P2002") {
            throw new Error("E-mail já cadastrado.");
        }
        throw new Error("Erro ao cadastrar igreja: " + error.message);
    }
};
exports.createChurch = createChurch;
// Exemplo de função para obter PrismaClient do schema correto
function getPrismaTenant(schema) {
    const { PrismaClient: PrismaTenant } = require("@prisma/client");
    const dbUrl = process.env.DATABASE_URL.replace(/schema=([a-zA-Z0-9_]+)/, `schema=${schema}`);
    return new PrismaTenant({
        datasources: {
            db: { url: dbUrl }
        }
    });
}
// As funções listChurches, getChurch, updateChurch, deleteChurch continuam usando prismaGlobal
const listChurches = async () => {
    try {
        return await prismaGlobal.church.findMany();
    }
    catch (error) {
        throw new Error("Erro ao listar igrejas: " + error.message);
    }
};
exports.listChurches = listChurches;
const getChurch = async (id) => {
    try {
        const igreja = await prismaGlobal.church.findUnique({ where: { id } });
        if (!igreja) {
            throw new Error("Igreja não encontrada.");
        }
        return igreja;
    }
    catch (error) {
        throw new Error("Erro ao buscar igreja: " + error.message);
    }
};
exports.getChurch = getChurch;
const updateChurch = async (id, data) => {
    const erros = validarCamposObrigatorios(data);
    if (erros.length > 0) {
        throw new Error(erros.join(" "));
    }
    let dadosParaAtualizar = { ...data };
    if (data.password) {
        if (data.password.length < 6) {
            throw new Error("A senha deve ter pelo menos 6 caracteres.");
        }
        dadosParaAtualizar.password = await bcrypt_1.default.hash(data.password, 10);
    }
    try {
        const igreja = await prismaGlobal.church.update({
            where: { id },
            data: dadosParaAtualizar,
        });
        (0, logger_1.logAuditoria)("Atualização de igreja", {
            id,
            camposAtualizados: Object.keys(dadosParaAtualizar),
        });
        return igreja;
    }
    catch (error) {
        if (error.code === "P2025") {
            throw new Error("Igreja não encontrada para atualização.");
        }
        if (error.code === "P2002") {
            throw new Error("E-mail já cadastrado.");
        }
        throw new Error("Erro ao atualizar igreja: " + error.message);
    }
};
exports.updateChurch = updateChurch;
const deleteChurch = async (id) => {
    try {
        await prismaGlobal.church.delete({
            where: { id },
        });
        (0, logger_1.logAuditoria)("Remoção de igreja", { id });
        return;
    }
    catch (error) {
        if (error.code === "P2025") {
            throw new Error("Igreja não encontrada para remoção.");
        }
        throw new Error("Erro ao remover igreja: " + error.message);
    }
};
exports.deleteChurch = deleteChurch;
//# sourceMappingURL=church.service.js.map