"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removerReceita = exports.atualizarReceita = exports.obterReceita = exports.listarReceitas = exports.criarReceita = void 0;
const prismaDynamic_1 = require("../utils/prismaDynamic");
const criarReceita = async (schema, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.receita.create({ data });
};
exports.criarReceita = criarReceita;
const listarReceitas = async (schema) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.receita.findMany({
        orderBy: { data: 'desc' }
    });
};
exports.listarReceitas = listarReceitas;
const obterReceita = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.receita.findUnique({
        where: { id }
    });
};
exports.obterReceita = obterReceita;
const atualizarReceita = async (schema, id, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.receita.update({
        where: { id },
        data
    });
};
exports.atualizarReceita = atualizarReceita;
const removerReceita = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.receita.delete({
        where: { id }
    });
};
exports.removerReceita = removerReceita;
//# sourceMappingURL=receitas.controller.js.map