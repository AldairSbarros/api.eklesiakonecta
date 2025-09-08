"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCongregacao = exports.updateCongregacao = exports.listCongregacoes = exports.createCongregacao = void 0;
const prismaDynamic_1 = require("../utils/prismaDynamic");
// Todas as funções agora recebem o schema como parâmetro
const createCongregacao = async (schema, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.congregacao.create({ data });
};
exports.createCongregacao = createCongregacao;
const listCongregacoes = async (schema) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.congregacao.findMany();
};
exports.listCongregacoes = listCongregacoes;
const updateCongregacao = async (schema, id, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.congregacao.update({
        where: { id },
        data,
    });
};
exports.updateCongregacao = updateCongregacao;
const deleteCongregacao = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.congregacao.delete({
        where: { id },
    });
};
exports.deleteCongregacao = deleteCongregacao;
//# sourceMappingURL=congregacao.service.js.map