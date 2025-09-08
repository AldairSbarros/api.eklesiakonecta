"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeMembroCelula = exports.addMembroCelula = exports.listarMembrosCelula = exports.deleteCelula = exports.updateCelula = exports.getCelula = exports.listCelulas = exports.createCelula = void 0;
const prismaDynamic_1 = require("../utils/prismaDynamic");
const createCelula = async (schema, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.celula.create({ data });
};
exports.createCelula = createCelula;
const listCelulas = async (schema) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.celula.findMany({
        include: {
            Congregacao: true,
            lider: true,
            anfitriao: true,
            membros: true,
            reunioes: true
        }
    });
};
exports.listCelulas = listCelulas;
const getCelula = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.celula.findUnique({
        where: { id },
        include: {
            Congregacao: true,
            lider: true,
            anfitriao: true,
            membros: true,
            reunioes: true
        }
    });
};
exports.getCelula = getCelula;
const updateCelula = async (schema, id, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.celula.update({
        where: { id },
        data
    });
};
exports.updateCelula = updateCelula;
const deleteCelula = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.celula.delete({
        where: { id }
    });
};
exports.deleteCelula = deleteCelula;
// Buscar membros da célula
const listarMembrosCelula = async (schema, celulaId) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.member.findMany({ where: { celulaId } });
};
exports.listarMembrosCelula = listarMembrosCelula;
// Associar membro à célula
const addMembroCelula = async (schema, celulaId, membroId) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.member.update({
        where: { id: membroId },
        data: { celulaId }
    });
};
exports.addMembroCelula = addMembroCelula;
// Remover membro da célula
const removeMembroCelula = async (schema, membroId) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.member.update({
        where: { id: membroId },
        data: { celulaId: null }
    });
};
exports.removeMembroCelula = removeMembroCelula;
//# sourceMappingURL=celula.service.js.map