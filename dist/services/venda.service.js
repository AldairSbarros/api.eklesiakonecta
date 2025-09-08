"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVenda = exports.updateVenda = exports.getVenda = exports.listVendas = exports.createVenda = void 0;
const prismaDynamic_1 = require("../utils/prismaDynamic");
const createVenda = async (schema, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.venda.create({ data });
};
exports.createVenda = createVenda;
const listVendas = async (schema) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.venda.findMany({
        include: {
            Church: true,
            upgradeDe: true,
            upgrades: true,
            faturas: true
        }
    });
};
exports.listVendas = listVendas;
const getVenda = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.venda.findUnique({
        where: { id },
        include: {
            Church: true,
            upgradeDe: true,
            upgrades: true,
            faturas: true
        }
    });
};
exports.getVenda = getVenda;
const updateVenda = async (schema, id, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.venda.update({
        where: { id },
        data
    });
};
exports.updateVenda = updateVenda;
const deleteVenda = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.venda.delete({
        where: { id }
    });
};
exports.deleteVenda = deleteVenda;
//# sourceMappingURL=venda.service.js.map