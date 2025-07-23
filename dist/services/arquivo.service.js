"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteArquivo = exports.updateArquivo = exports.getArquivo = exports.listArquivos = exports.createArquivo = void 0;
const prismaDynamic_1 = require("../utils/prismaDynamic");
const createArquivo = async (schema, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.arquivo.create({ data });
};
exports.createArquivo = createArquivo;
const listArquivos = async (schema) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.arquivo.findMany({
        include: {
            Usuario: true
        }
    });
};
exports.listArquivos = listArquivos;
const getArquivo = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.arquivo.findUnique({
        where: { id },
        include: {
            Usuario: true
        }
    });
};
exports.getArquivo = getArquivo;
const updateArquivo = async (schema, id, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.arquivo.update({
        where: { id },
        data
    });
};
exports.updateArquivo = updateArquivo;
const deleteArquivo = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.arquivo.delete({
        where: { id }
    });
};
exports.deleteArquivo = deleteArquivo;
//# sourceMappingURL=arquivo.service.js.map