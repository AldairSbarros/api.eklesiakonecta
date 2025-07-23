"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removerUsuario = exports.atualizarUsuario = exports.obterUsuario = exports.listarDizimosPorCongregacao = exports.criarUsuario = void 0;
const prismaDynamic_1 = require("../utils/prismaDynamic");
const criarUsuario = async (schema, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.usuario.create({ data });
};
exports.criarUsuario = criarUsuario;
const listarDizimosPorCongregacao = async (schema, congregacaoId) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    // Se congregacaoId não for informado, retorna todos (admin)
    if (!congregacaoId) {
        return prisma.offering.findMany();
    }
    // Se informado, retorna só daquela congregação
    return prisma.offering.findMany({
        where: { congregacaoId }
    });
};
exports.listarDizimosPorCongregacao = listarDizimosPorCongregacao;
const obterUsuario = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.usuario.findUnique({
        where: { id }
    });
};
exports.obterUsuario = obterUsuario;
const atualizarUsuario = async (schema, id, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.usuario.update({
        where: { id },
        data
    });
};
exports.atualizarUsuario = atualizarUsuario;
const removerUsuario = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.usuario.delete({
        where: { id }
    });
};
exports.removerUsuario = removerUsuario;
//# sourceMappingURL=usuario.service.js.map