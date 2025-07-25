"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResumoFinanceiro = getResumoFinanceiro;
exports.getRelatorioMensal = getRelatorioMensal;
const prismaDynamic_1 = require("../utils/prismaDynamic");
const manualCodigos_json_1 = __importDefault(require("../utils/manualCodigos.json"));
async function getResumoFinanceiro(schema, congregacaoId, mes, ano) {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    let dateFilter = {};
    if (mes && ano) {
        const inicio = new Date(ano, mes - 1, 1);
        const fim = new Date(ano, mes, 0, 23, 59, 59);
        dateFilter = { gte: inicio, lte: fim };
    }
    const [offerings, receitas, despesas, investimentos] = await Promise.all([
        prisma.offering.findMany({
            where: {
                congregacaoId,
                ...(mes && ano ? { date: dateFilter } : {}),
            },
        }),
        prisma.receita.findMany({
            where: {
                congregacaoId,
                ...(mes && ano ? { data: dateFilter } : {}),
            },
        }),
        prisma.despesa.findMany({
            where: {
                congregacaoId,
                ...(mes && ano ? { data: dateFilter } : {}),
            },
        }),
        prisma.investimento.findMany({
            where: {
                congregacaoId,
                ...(mes && ano ? { data: dateFilter } : {}),
            },
        }),
    ]);
    return { offerings, receitas, despesas, investimentos };
}
async function getRelatorioMensal(schema, congregacaoId, mes, ano) {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    const inicio = new Date(ano, mes - 1, 1);
    const fim = new Date(ano, mes, 0, 23, 59, 59);
    const dizimos = await prisma.offering.findMany({
        where: {
            congregacaoId,
            type: 'dizimo',
            date: { gte: inicio, lte: fim }
        }
    });
    const totalDizimos = dizimos.reduce((acc, d) => acc + d.value, 0);
    const ofertas = await prisma.offering.findMany({
        where: {
            congregacaoId,
            type: 'oferta',
            date: { gte: inicio, lte: fim }
        }
    });
    const totalOfertas = ofertas.reduce((acc, o) => acc + o.value, 0);
    const totalEntradas = totalDizimos + totalOfertas;
    const comissaoIgreja = +(totalEntradas * 0.33).toFixed(2);
    const valorRecolhido = +(totalEntradas * 0.67).toFixed(2);
    const despesas = await prisma.despesa.findMany({
        where: {
            congregacaoId,
            data: { gte: inicio, lte: fim },
            codigoManual: { in: manualCodigos_json_1.default.despesas.map((d) => d.codigo) }
        }
    });
    const totalDespesas = despesas.reduce((acc, d) => acc + d.valor, 0);
    const investimentos = await prisma.investimento.findMany({
        where: {
            congregacaoId,
            data: { gte: inicio, lte: fim }
        }
    });
    const totalInvestimentos = investimentos.reduce((acc, i) => acc + i.valor, 0);
    const somaDespesasInvest = totalDespesas + totalInvestimentos;
    const despesasOk = somaDespesasInvest <= comissaoIgreja;
    return {
        mes,
        ano,
        congregacaoId,
        dizimos,
        totalDizimos,
        ofertas,
        totalOfertas,
        totalEntradas,
        comissaoIgreja,
        despesas,
        totalDespesas,
        investimentos,
        totalInvestimentos,
        despesasMaisInvestimentos: somaDespesasInvest,
        despesasDentroLimite: despesasOk,
        valorARecolher: valorRecolhido
    };
}
exports.default = {
    getResumoFinanceiro,
    getRelatorioMensal
};
//# sourceMappingURL=financeiro.service.js.map