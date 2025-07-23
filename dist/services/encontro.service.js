"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEncontro = exports.updateEncontro = exports.getEncontro = exports.listEncontros = exports.createEncontro = void 0;
const prismaDynamic_1 = require("../utils/prismaDynamic");
const createEncontro = async (schema, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.encontro.create({ data });
};
exports.createEncontro = createEncontro;
const listEncontros = async (schema) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.encontro.findMany({
        include: {
            Congregacao: true,
            participantes: true
        }
    });
};
exports.listEncontros = listEncontros;
const getEncontro = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.encontro.findUnique({
        where: { id },
        include: {
            Congregacao: true,
            participantes: true
        }
    });
};
exports.getEncontro = getEncontro;
const updateEncontro = async (schema, id, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.encontro.update({
        where: { id },
        data
    });
};
exports.updateEncontro = updateEncontro;
const deleteEncontro = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.encontro.delete({
        where: { id }
    });
};
exports.deleteEncontro = deleteEncontro;
//# sourceMappingURL=encontro.service.js.map