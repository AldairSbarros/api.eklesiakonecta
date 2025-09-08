"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obterDespesa = exports.removerDespesa = exports.atualizarDespesa = exports.listarDespesas = exports.criarDespesa = void 0;
const prismaDynamic_1 = require("../utils/prismaDynamic");
const criarDespesa = async (schema, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.despesa.create({ data });
};
exports.criarDespesa = criarDespesa;
const listarDespesas = async (schema) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.despesa.findMany({
        orderBy: { data: 'desc' },
    });
};
exports.listarDespesas = listarDespesas;
const atualizarDespesa = async (schema, id, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.despesa.update({
        where: { id },
        data,
    });
};
exports.atualizarDespesa = atualizarDespesa;
const removerDespesa = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.despesa.delete({
        where: { id },
    });
};
exports.removerDespesa = removerDespesa;
const obterDespesa = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.despesa.findUnique({
        where: { id },
    });
};
exports.obterDespesa = obterDespesa;
//# sourceMappingURL=despesa.service.js.map