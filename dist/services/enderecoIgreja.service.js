"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEnderecoIgreja = exports.updateEnderecoIgreja = exports.getEnderecoIgreja = exports.listEnderecosIgreja = exports.createEnderecoIgreja = void 0;
const prismaDynamic_1 = require("../utils/prismaDynamic");
const createEnderecoIgreja = async (schema, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.enderecoIgreja.create({ data });
};
exports.createEnderecoIgreja = createEnderecoIgreja;
const listEnderecosIgreja = async (schema) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.enderecoIgreja.findMany({
        include: {
            igrejas: true
        }
    });
};
exports.listEnderecosIgreja = listEnderecosIgreja;
const getEnderecoIgreja = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.enderecoIgreja.findUnique({
        where: { id },
        include: {
            igrejas: true
        }
    });
};
exports.getEnderecoIgreja = getEnderecoIgreja;
const updateEnderecoIgreja = async (schema, id, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.enderecoIgreja.update({
        where: { id },
        data
    });
};
exports.updateEnderecoIgreja = updateEnderecoIgreja;
const deleteEnderecoIgreja = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.enderecoIgreja.delete({
        where: { id }
    });
};
exports.deleteEnderecoIgreja = deleteEnderecoIgreja;
//# sourceMappingURL=enderecoIgreja.service.js.map