"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.atualizarToken = exports.removerToken = exports.obterToken = exports.criarToken = void 0;
const prismaDynamic_1 = require("../utils/prismaDynamic");
const criarToken = async (schema, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.tokenRecuperacaoSenha.create({ data });
};
exports.criarToken = criarToken;
const obterToken = async (schema, token) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.tokenRecuperacaoSenha.findUnique({
        where: { token }
    });
};
exports.obterToken = obterToken;
const removerToken = async (schema, token) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.tokenRecuperacaoSenha.delete({
        where: { token }
    });
};
exports.removerToken = removerToken;
const atualizarToken = async (schema, token, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.tokenRecuperacaoSenha.update({
        where: { token },
        data
    });
};
exports.atualizarToken = atualizarToken;
//# sourceMappingURL=tokenRecuperacaoSenha.service.js.map