"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEndereco = exports.updateEndereco = exports.getEndereco = exports.listEnderecos = exports.createEndereco = void 0;
const prismaDynamic_1 = require("../utils/prismaDynamic");
const createEndereco = async (schema, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.enderecoMembro.create({ data });
};
exports.createEndereco = createEndereco;
const listEnderecos = async (schema) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.enderecoMembro.findMany({
        include: {
            member: true
        }
    });
};
exports.listEnderecos = listEnderecos;
const getEndereco = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.enderecoMembro.findUnique({
        where: { id },
        include: {
            member: true
        }
    });
};
exports.getEndereco = getEndereco;
const updateEndereco = async (schema, id, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.enderecoMembro.update({
        where: { id },
        data
    });
};
exports.updateEndereco = updateEndereco;
const deleteEndereco = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.enderecoMembro.delete({
        where: { id }
    });
};
exports.deleteEndereco = deleteEndereco;
//# sourceMappingURL=enderecoMembro.service.js.map