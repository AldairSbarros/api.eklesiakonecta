"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotificacao = exports.updateNotificacao = exports.getNotificacao = exports.listNotificacoes = exports.createNotificacao = void 0;
const prismaDynamic_1 = require("../utils/prismaDynamic");
const createNotificacao = async (schema, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.notificacao.create({ data });
};
exports.createNotificacao = createNotificacao;
const listNotificacoes = async (schema) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.notificacao.findMany({
        include: {
            Usuario: true
        }
    });
};
exports.listNotificacoes = listNotificacoes;
const getNotificacao = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.notificacao.findUnique({
        where: { id },
        include: {
            Usuario: true
        }
    });
};
exports.getNotificacao = getNotificacao;
const updateNotificacao = async (schema, id, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.notificacao.update({
        where: { id },
        data
    });
};
exports.updateNotificacao = updateNotificacao;
const deleteNotificacao = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.notificacao.delete({
        where: { id }
    });
};
exports.deleteNotificacao = deleteNotificacao;
//# sourceMappingURL=notificacao.service.js.map