"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obterInvestimento = exports.removerInvestimento = exports.atualizarInvestimento = exports.listarInvestimentos = exports.criarInvestimento = void 0;
const prismaDynamic_1 = require("../utils/prismaDynamic");
const criarInvestimento = async (schema, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.investimento.create({ data });
};
exports.criarInvestimento = criarInvestimento;
const listarInvestimentos = async (schema) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.investimento.findMany({
        orderBy: { data: 'desc' }
    });
};
exports.listarInvestimentos = listarInvestimentos;
const atualizarInvestimento = async (schema, id, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.investimento.update({
        where: { id },
        data
    });
};
exports.atualizarInvestimento = atualizarInvestimento;
const removerInvestimento = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.investimento.delete({
        where: { id }
    });
};
exports.removerInvestimento = removerInvestimento;
const obterInvestimento = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.investimento.findUnique({
        where: { id }
    });
};
exports.obterInvestimento = obterInvestimento;
//# sourceMappingURL=investimentos.service.js.map