"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrismaForSchema = getPrismaForSchema;
exports.buscarAniversariantesPorSchema = buscarAniversariantesPorSchema;
const client_1 = require("@prisma/client");
function getPrismaForSchema(schema) {
    // Clona a variável de ambiente e troca o schema na connection string
    const url = process.env.DATABASE_URL?.replace('schema=public', `schema=${schema}`);
    return new client_1.PrismaClient({
        datasources: {
            db: {
                url,
            },
        },
    });
}
async function buscarAniversariantesPorSchema(schema) {
    const prismaSchema = getPrismaForSchema(schema);
    const hoje = new Date();
    const dia = hoje.getDate();
    const mes = hoje.getMonth() + 1;
    const aniversariantes = await prismaSchema.member.findMany({
        where: {
            dataNascimento: { not: null },
        },
    });
    // Filtra no JS
    return aniversariantes.filter((m) => {
        if (!m.dataNascimento)
            return false;
        const data = new Date(m.dataNascimento);
        return data.getDate() === dia && data.getMonth() + 1 === mes;
    });
}
//# sourceMappingURL=prismaDynamic.js.map