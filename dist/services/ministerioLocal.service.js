"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMinisterioLocal = exports.updateMinisterioLocal = exports.getMinisterioLocal = exports.listMinisteriosLocais = exports.createMinisterioLocal = void 0;
const prismaDynamic_1 = require("../utils/prismaDynamic");
const createMinisterioLocal = async (schema, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.ministerioLocal.create({ data });
};
exports.createMinisterioLocal = createMinisterioLocal;
const listMinisteriosLocais = async (schema) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.ministerioLocal.findMany({
        include: {
            Congregacao: true,
            membros: true
        }
    });
};
exports.listMinisteriosLocais = listMinisteriosLocais;
const getMinisterioLocal = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.ministerioLocal.findUnique({
        where: { id },
        include: {
            Congregacao: true,
            membros: true
        }
    });
};
exports.getMinisterioLocal = getMinisterioLocal;
const updateMinisterioLocal = async (schema, id, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.ministerioLocal.update({
        where: { id },
        data
    });
};
exports.updateMinisterioLocal = updateMinisterioLocal;
const deleteMinisterioLocal = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.ministerioLocal.delete({
        where: { id }
    });
};
exports.deleteMinisterioLocal = deleteMinisterioLocal;
//# sourceMappingURL=ministerioLocal.service.js.map