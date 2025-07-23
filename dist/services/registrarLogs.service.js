"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrarLog = registrarLog;
const prismaDynamic_1 = require("../utils/prismaDynamic");
async function registrarLog(schema, { usuarioId, acao, detalhes, ip }) {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    await prisma.logAcesso.create({
        data: { usuarioId, acao, detalhes, ip }
    });
}
//# sourceMappingURL=registrarLogs.service.js.map