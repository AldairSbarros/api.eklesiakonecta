"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrarOuAtualizarPresenca = exports.listarPresencasPorReuniao = exports.deletePresenca = exports.updatePresenca = exports.getPresenca = exports.listPresencas = exports.createPresenca = void 0;
const prismaDynamic_1 = require("../utils/prismaDynamic");
const createPresenca = async (schema, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.presencaCelula.create({ data });
};
exports.createPresenca = createPresenca;
const listPresencas = async (schema) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.presencaCelula.findMany({
        include: {
            Member: true,
            ReuniaoCelula: true
        }
    });
};
exports.listPresencas = listPresencas;
const getPresenca = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.presencaCelula.findUnique({
        where: { id },
        include: {
            Member: true,
            ReuniaoCelula: true
        }
    });
};
exports.getPresenca = getPresenca;
const updatePresenca = async (schema, id, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.presencaCelula.update({
        where: { id },
        data
    });
};
exports.updatePresenca = updatePresenca;
const deletePresenca = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.presencaCelula.delete({
        where: { id }
    });
};
exports.deletePresenca = deletePresenca;
const listarPresencasPorReuniao = async (schema, reuniaoId) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.presencaCelula.findMany({
        where: { reuniaoId },
        include: { Member: true }
    });
};
exports.listarPresencasPorReuniao = listarPresencasPorReuniao;
const registrarOuAtualizarPresenca = async (schema, reuniaoId, membroId, presente) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.presencaCelula.upsert({
        where: {
            presenca_unica: {
                reuniaoId,
                membroId
            }
        },
        update: { presente },
        create: { reuniaoId, membroId, presente }
    });
};
exports.registrarOuAtualizarPresenca = registrarOuAtualizarPresenca;
exports.default = {
    createPresenca: exports.createPresenca,
    listPresencas: exports.listPresencas,
    getPresenca: exports.getPresenca,
    updatePresenca: exports.updatePresenca,
    deletePresenca: exports.deletePresenca,
    listarPresencasPorReuniao: exports.listarPresencasPorReuniao,
    registrarOuAtualizarPresenca: exports.registrarOuAtualizarPresenca
};
//# sourceMappingURL=presencaCelula.service.js.map