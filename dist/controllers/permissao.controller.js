"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePermissao = exports.updatePermissao = exports.getPermissao = exports.listPermissoes = exports.createPermissao = void 0;
const prismaDynamic_1 = require("../utils/prismaDynamic");
const createPermissao = async (schema, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.permissao.create({ data });
};
exports.createPermissao = createPermissao;
const listPermissoes = async (schema) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.permissao.findMany({
        include: {
            usuarios: true
        }
    });
};
exports.listPermissoes = listPermissoes;
const getPermissao = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.permissao.findUnique({
        where: { id },
        include: {
            usuarios: true
        }
    });
};
exports.getPermissao = getPermissao;
const updatePermissao = async (schema, id, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.permissao.update({
        where: { id },
        data
    });
};
exports.updatePermissao = updatePermissao;
const deletePermissao = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.permissao.delete({
        where: { id }
    });
};
exports.deletePermissao = deletePermissao;
//# sourceMappingURL=permissao.controller.js.map