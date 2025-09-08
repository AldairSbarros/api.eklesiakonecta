"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aniversariantesDoMes = exports.rankingPresenca = exports.mediaPresencaNoMes = exports.presencasPorReuniao = exports.membrosDaCelula = void 0;
const prismaDynamic_1 = require("../utils/prismaDynamic");
// 1. Lista de membros da célula
const membrosDaCelula = async (schema, celulaId) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.member.findMany({
        where: { celulaId }
    });
};
exports.membrosDaCelula = membrosDaCelula;
// 2. Presenças por reunião
const presencasPorReuniao = async (schema, celulaId) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.reuniaoCelula.findMany({
        where: { celulaId },
        include: {
            presencas: { include: { Member: true } }
        }
    });
};
exports.presencasPorReuniao = presencasPorReuniao;
// 3. Média de presença dos membros no mês
const mediaPresencaNoMes = async (schema, celulaId, mes, ano) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    const reunioes = await prisma.reuniaoCelula.findMany({
        where: {
            celulaId,
            data: {
                gte: new Date(ano, mes - 1, 1),
                lt: new Date(ano, mes, 1)
            }
        },
        include: {
            presencas: true
        }
    });
    const totalReunioes = reunioes.length;
    if (totalReunioes === 0)
        return 0;
    const totalPresencas = reunioes.reduce((acc, r) => acc + r.presencas.filter(p => p.presente).length, 0);
    const totalMembros = await prisma.member.count({ where: { celulaId } });
    if (totalMembros === 0)
        return 0;
    return totalPresencas / (totalReunioes * totalMembros);
};
exports.mediaPresencaNoMes = mediaPresencaNoMes;
// 4. Ranking dos mais presentes/faltosos no mês
const rankingPresenca = async (schema, celulaId, mes, ano) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    const reunioes = await prisma.reuniaoCelula.findMany({
        where: {
            celulaId,
            data: {
                gte: new Date(ano, mes - 1, 1),
                lt: new Date(ano, mes, 1)
            }
        },
        include: { presencas: true }
    });
    const presencasPorMembro = {};
    reunioes.forEach(r => {
        r.presencas.forEach(p => {
            if (!presencasPorMembro[p.membroId])
                presencasPorMembro[p.membroId] = { presentes: 0, faltas: 0 };
            if (p.presente)
                presencasPorMembro[p.membroId].presentes++;
            else
                presencasPorMembro[p.membroId].faltas++;
        });
    });
    return presencasPorMembro;
};
exports.rankingPresenca = rankingPresenca;
// 5. Aniversariantes do mês
const aniversariantesDoMes = async (schema, celulaId, mes) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    const membros = await prisma.member.findMany({
        where: { celulaId },
        select: {
            id: true,
            nome: true,
            telefone: true,
            email: true,
            senha: true,
            congregacaoId: true,
            dataNascimento: true
        }
    });
    return membros.filter(m => {
        const dataNascimento = m.dataNascimento;
        if (!dataNascimento)
            return false;
        const data = new Date(dataNascimento);
        return data.getMonth() + 1 === mes;
    });
};
exports.aniversariantesDoMes = aniversariantesDoMes;
//# sourceMappingURL=relatorioCelula.service.js.map