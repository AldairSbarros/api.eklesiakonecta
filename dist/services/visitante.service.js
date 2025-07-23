"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVisitante = exports.updateVisitante = exports.getVisitante = exports.listVisitantes = exports.createVisitante = void 0;
const prismaDynamic_1 = require("../utils/prismaDynamic");
const createVisitante = async (schema, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.visitanteCelula.create({ data });
};
exports.createVisitante = createVisitante;
const listVisitantes = async (schema) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.visitanteCelula.findMany({
        include: {
            ReuniaoCelula: true
        }
    });
};
exports.listVisitantes = listVisitantes;
const getVisitante = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.visitanteCelula.findUnique({
        where: { id },
        include: {
            ReuniaoCelula: true
        }
    });
};
exports.getVisitante = getVisitante;
const updateVisitante = async (schema, id, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.visitanteCelula.update({
        where: { id },
        data
    });
};
exports.updateVisitante = updateVisitante;
const deleteVisitante = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.visitanteCelula.delete({
        where: { id }
    });
};
exports.deleteVisitante = deleteVisitante;
//# sourceMappingURL=visitante.service.js.map