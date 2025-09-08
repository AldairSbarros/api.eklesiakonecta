"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReuniao = exports.updateReuniao = exports.getReuniao = exports.listReunioes = exports.createReuniao = void 0;
const prismaDynamic_1 = require("../utils/prismaDynamic");
const createReuniao = async (schema, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.reuniaoCelula.create({ data });
};
exports.createReuniao = createReuniao;
const listReunioes = async (schema) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.reuniaoCelula.findMany({
        include: {
            Celula: true,
            presencas: true,
            visitantes: true
        }
    });
};
exports.listReunioes = listReunioes;
const getReuniao = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.reuniaoCelula.findUnique({
        where: { id },
        include: {
            Celula: true,
            presencas: true,
            visitantes: true
        }
    });
};
exports.getReuniao = getReuniao;
const updateReuniao = async (schema, id, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.reuniaoCelula.update({
        where: { id },
        data
    });
};
exports.updateReuniao = updateReuniao;
const deleteReuniao = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.reuniaoCelula.delete({
        where: { id }
    });
};
exports.deleteReuniao = deleteReuniao;
//# sourceMappingURL=reuniaoCelula.service.js.map