"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMinisterio = exports.updateMinisterio = exports.getMinisterio = exports.listMinisterios = exports.createMinisterio = void 0;
const prismaDynamic_1 = require("../utils/prismaDynamic");
const createMinisterio = async (schema, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.ministerio.create({ data });
};
exports.createMinisterio = createMinisterio;
const listMinisterios = async (schema) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.ministerio.findMany({
        include: {
            Congregacao: true,
            Lider: true,
            membros: true
        }
    });
};
exports.listMinisterios = listMinisterios;
const getMinisterio = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.ministerio.findUnique({
        where: { id },
        include: {
            Congregacao: true,
            Lider: true,
            membros: true
        }
    });
};
exports.getMinisterio = getMinisterio;
const updateMinisterio = async (schema, id, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.ministerio.update({
        where: { id },
        data
    });
};
exports.updateMinisterio = updateMinisterio;
const deleteMinisterio = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.ministerio.delete({
        where: { id }
    });
};
exports.deleteMinisterio = deleteMinisterio;
//# sourceMappingURL=ministerio.service.js.map