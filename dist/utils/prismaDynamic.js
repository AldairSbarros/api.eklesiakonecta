"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrisma = getPrisma;
exports.clearPrismaCache = clearPrismaCache;
exports.getPrismaPublic = getPrismaPublic;
const client_1 = require("@prisma/client");
// Cache de conexões para evitar múltiplas instâncias
const prismaCache = {};
function getPrisma(schema) {
    // Se já existe no cache, retorna
    if (prismaCache[schema]) {
        return prismaCache[schema];
    }
    let dbUrl;
    if (schema === 'public') {
        // Para schema public, usar URL padrão sem modificação
        dbUrl = process.env.DATABASE_URL;
    }
    else {
        // Para outros schemas, modificar a URL
        dbUrl = process.env.DATABASE_URL.replace(/schema=([a-zA-Z0-9_]+)/, `schema=${schema}`);
    }
    // Criar nova instância
    const prisma = new client_1.PrismaClient({
        datasources: {
            db: { url: dbUrl }
        }
    });
    // Adicionar ao cache
    prismaCache[schema] = prisma;
    return prisma;
}
// Função para limpar cache (útil para testes)
function clearPrismaCache() {
    Object.values(prismaCache).forEach(prisma => {
        prisma.$disconnect();
    });
    Object.keys(prismaCache).forEach(key => {
        delete prismaCache[key];
    });
}
// Função específica para acessar tabelas do schema public
function getPrismaPublic() {
    return getPrisma('public');
}
//# sourceMappingURL=prismaDynamic.js.map