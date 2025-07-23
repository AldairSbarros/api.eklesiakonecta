"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listReceipts = exports.getOffering = exports.removeOffering = exports.updateOffering = exports.listOfferings = exports.createOffering = void 0;
exports.findCongregacaoByNome = findCongregacaoByNome;
exports.findMemberByNome = findMemberByNome;
const prismaDynamic_1 = require("../utils/prismaDynamic");
const createOffering = async (schema, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.offering.create({ data });
};
exports.createOffering = createOffering;
const listOfferings = async (schema, where = {}) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.offering.findMany({
        where,
        include: { Member: true, Congregacao: true }
    });
};
exports.listOfferings = listOfferings;
const updateOffering = async (schema, id, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.offering.update({
        where: { id },
        data
    });
};
exports.updateOffering = updateOffering;
const removeOffering = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.offering.delete({
        where: { id }
    });
};
exports.removeOffering = removeOffering;
const getOffering = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.offering.findUnique({
        where: { id },
        include: { Member: true, Congregacao: true }
    });
};
exports.getOffering = getOffering;
const listReceipts = async (schema, where = {}) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.offering.findMany({
        where,
        select: {
            id: true,
            memberId: true,
            value: true,
            date: true,
            service: true,
            receiptPhoto: true
        }
    });
};
exports.listReceipts = listReceipts;
function findCongregacaoByNome(schema, congregacaoNome) {
    throw new Error('Function not implemented.');
}
function findMemberByNome(schema, memberNome, id) {
    throw new Error('Function not implemented.');
}
//# sourceMappingURL=offering.service.js.map