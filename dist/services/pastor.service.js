"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePastor = exports.updatePastor = exports.getPastor = exports.listPastores = exports.createPastor = void 0;
const prismaDynamic_1 = require("../utils/prismaDynamic");
const createPastor = async (schema, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.pastor.create({ data });
};
exports.createPastor = createPastor;
const listPastores = async (schema) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.pastor.findMany({
        include: {
            churchPrincipal: true,
            congregacoes: true
        }
    });
};
exports.listPastores = listPastores;
const getPastor = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.pastor.findUnique({
        where: { id },
        include: {
            churchPrincipal: true,
            congregacoes: true
        }
    });
};
exports.getPastor = getPastor;
const updatePastor = async (schema, id, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.pastor.update({
        where: { id },
        data
    });
};
exports.updatePastor = updatePastor;
const deletePastor = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.pastor.delete({
        where: { id }
    });
};
exports.deletePastor = deletePastor;
//# sourceMappingURL=pastor.service.js.map