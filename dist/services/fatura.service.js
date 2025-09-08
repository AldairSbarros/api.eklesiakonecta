"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFatura = exports.updateFatura = exports.getFatura = exports.listFaturas = exports.createFatura = void 0;
const prismaDynamic_1 = require("../utils/prismaDynamic");
const createFatura = async (schema, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.fatura.create({ data });
};
exports.createFatura = createFatura;
const listFaturas = async (schema) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.fatura.findMany();
};
exports.listFaturas = listFaturas;
const getFatura = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.fatura.findUnique({ where: { id } });
};
exports.getFatura = getFatura;
const updateFatura = async (schema, id, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.fatura.update({
        where: { id },
        data
    });
};
exports.updateFatura = updateFatura;
const deleteFatura = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.fatura.delete({
        where: { id }
    });
};
exports.deleteFatura = deleteFatura;
//# sourceMappingURL=fatura.service.js.map