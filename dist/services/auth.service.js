"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUsuarioByEmail = exports.createUsuario = void 0;
const prismaDynamic_1 = require("../utils/prismaDynamic");
// Cria um novo usuário
const createUsuario = async (schema, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.usuario.create({ data });
};
exports.createUsuario = createUsuario;
// Busca usuário pelo e-mail
const findUsuarioByEmail = async (schema, email) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.usuario.findUnique({
        where: { email }
    });
};
exports.findUsuarioByEmail = findUsuarioByEmail;
//# sourceMappingURL=auth.service.js.map