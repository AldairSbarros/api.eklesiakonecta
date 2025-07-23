"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLicao = exports.updateLicao = exports.getLicao = exports.listLicoes = exports.createLicao = void 0;
const prismaDynamic_1 = require("../utils/prismaDynamic");
const createLicao = async (schema, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.escolaLideresLicao.create({ data });
};
exports.createLicao = createLicao;
const listLicoes = async (schema) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.escolaLideresLicao.findMany({
        include: {
            EscolaLideresEtapa: true
        }
    });
};
exports.listLicoes = listLicoes;
const getLicao = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.escolaLideresLicao.findUnique({
        where: { id },
        include: {
            EscolaLideresEtapa: true
        }
    });
};
exports.getLicao = getLicao;
const updateLicao = async (schema, id, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.escolaLideresLicao.update({
        where: { id },
        data
    });
};
exports.updateLicao = updateLicao;
const deleteLicao = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.escolaLideresLicao.delete({
        where: { id }
    });
};
exports.deleteLicao = deleteLicao;
exports.default = {
    createLicao: exports.createLicao,
    listLicoes: exports.listLicoes,
    getLicao: exports.getLicao,
    updateLicao: exports.updateLicao,
    deleteLicao: exports.deleteLicao
};
//# sourceMappingURL=escolaLideresLicao.service.js.map