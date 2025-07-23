"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrarAuditoria = registrarAuditoria;
// src/utils/auditoria.ts
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function registrarAuditoria({ acao, usuarioId, superuser = false, detalhes }) {
    await prisma.auditoria.create({
        data: {
            acao,
            usuarioId,
            superuser,
            detalhes: detalhes ? JSON.stringify(detalhes) : null
        }
    });
}
//# sourceMappingURL=auditoria.js.map