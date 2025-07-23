"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUsuarioPermissao = exports.updateUsuarioPermissao = exports.getUsuarioPermissao = exports.listUsuarioPermissoes = exports.createUsuarioPermissao = void 0;
const prismaDynamic_1 = require("../utils/prismaDynamic");
const createUsuarioPermissao = async (schema, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.usuarioPermissao.create({ data });
};
exports.createUsuarioPermissao = createUsuarioPermissao;
const listUsuarioPermissoes = async (schema) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.usuarioPermissao.findMany({
        include: {
            Usuario: true,
            Permissao: true
        }
    });
};
exports.listUsuarioPermissoes = listUsuarioPermissoes;
const getUsuarioPermissao = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.usuarioPermissao.findUnique({
        where: { id },
        include: {
            Usuario: true,
            Permissao: true
        }
    });
};
exports.getUsuarioPermissao = getUsuarioPermissao;
const updateUsuarioPermissao = async (schema, id, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.usuarioPermissao.update({
        where: { id },
        data
    });
};
exports.updateUsuarioPermissao = updateUsuarioPermissao;
const deleteUsuarioPermissao = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.usuarioPermissao.delete({
        where: { id }
    });
};
exports.deleteUsuarioPermissao = deleteUsuarioPermissao;
//# sourceMappingURL=usuarioPermissao.service.js.map