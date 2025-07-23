"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removerMensagem = exports.atualizarMensagem = exports.obterMensagem = exports.listarMensagens = exports.criarMensagem = void 0;
const prismaDynamic_1 = require("../utils/prismaDynamic");
const criarMensagem = async (schema, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.mensagemCelula.create({ data });
};
exports.criarMensagem = criarMensagem;
const listarMensagens = async (schema) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.mensagemCelula.findMany({
        orderBy: { data: 'desc' }
    });
};
exports.listarMensagens = listarMensagens;
const obterMensagem = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.mensagemCelula.findUnique({
        where: { id }
    });
};
exports.obterMensagem = obterMensagem;
const atualizarMensagem = async (schema, id, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.mensagemCelula.update({
        where: { id },
        data
    });
};
exports.atualizarMensagem = atualizarMensagem;
const removerMensagem = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.mensagemCelula.delete({
        where: { id }
    });
};
exports.removerMensagem = removerMensagem;
//# sourceMappingURL=mensagemCelula.service.js.map