"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTurma = exports.updateTurma = exports.getTurma = exports.listTurmas = exports.createTurma = void 0;
const prismaDynamic_1 = require("../utils/prismaDynamic");
const createTurma = async (schema, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.escolaLideresTurma.create({ data });
};
exports.createTurma = createTurma;
const listTurmas = async (schema) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.escolaLideresTurma.findMany({
        include: {
            Congregacao: true,
            alunos: true,
            etapas: true
        }
    });
};
exports.listTurmas = listTurmas;
const getTurma = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.escolaLideresTurma.findUnique({
        where: { id },
        include: {
            Congregacao: true,
            alunos: true,
            etapas: true
        }
    });
};
exports.getTurma = getTurma;
const updateTurma = async (schema, id, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.escolaLideresTurma.update({
        where: { id },
        data
    });
};
exports.updateTurma = updateTurma;
const deleteTurma = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.escolaLideresTurma.delete({
        where: { id }
    });
};
exports.deleteTurma = deleteTurma;
//# sourceMappingURL=escolaLideresTurma.service.js.map