"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrismaClient = getPrismaClient;
const client_1 = require("@prisma/client");
function getPrismaClient(igrejaId) {
    // Corrigido para usar a porta 5433
    const dbUrl = `postgresql://user:senha@host:5433/igreja_${igrejaId}`;
    return new client_1.PrismaClient({ datasources: { db: { url: dbUrl } } });
}
//# sourceMappingURL=prismaClienFactory.js.map