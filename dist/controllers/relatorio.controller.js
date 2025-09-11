"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrarLog = registrarLog;
exports.relatorioMensal = relatorioMensal;
exports.relatorioMensalPDF = relatorioMensalPDF;
exports.relatorioCelulas = relatorioCelulas;
exports.relatorioFinanceiro = relatorioFinanceiro;
exports.relatorioDiscipuladoPorDiscipulador = relatorioDiscipuladoPorDiscipulador;
const prismaDynamic_1 = require("../utils/prismaDynamic");
const headerUtils_1 = require("../utils/headerUtils");
async function registrarLog(schema, { usuarioId, acao, detalhes, ip }) {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    await prisma.logAcesso.create({
        data: { usuarioId, acao, detalhes, ip }
    });
}
///////================MOCK==================////////
function relatorioMensal(req, res) {
    return res.status(501).json({ error: 'Relatório mensal não implementado.' });
}
function relatorioMensalPDF(req, res) {
    return res.status(501).json({ error: 'Relatório mensal PDF não implementado.' });
}
async function relatorioCelulas(req, res) {
    try {
        const schema = (0, headerUtils_1.extractSchema)(req);
        const validationError = (0, headerUtils_1.validateSchema)(schema);
        if (validationError.error) {
            return res.status(400).json(validationError);
        }
        // Busca todas as células do schema, incluindo membros
        const { listCelulas } = require('../services/celula.service');
        const celulas = await listCelulas(schema);
        return res.status(200).json({ celulas });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
async function relatorioFinanceiro(req, res) {
    try {
        const schema = (0, headerUtils_1.extractSchema)(req);
        const validationError = (0, headerUtils_1.validateSchema)(schema);
        console.log('[RELATORIO FINANCEIRO] HEADER schema:', schema);
        if (validationError.error) {
            console.error('[RELATORIO FINANCEIRO] ERRO: Schema não informado no header.');
            return res.status(400).json(validationError);
        }
        const { getPrismaTenant } = require('../services/church.service');
        const prisma = getPrismaTenant(schema);
        // Busca todas as offerings do schema
        const offerings = await prisma.offering.findMany();
        const totalOfferings = offerings.reduce((acc, o) => acc + (o.value || 0), 0);
        await prisma.$disconnect();
        return res.status(200).json({ totalOfferings, offerings });
    }
    catch (error) {
        console.error('[RELATORIO FINANCEIRO] ERRO:', error);
        return res.status(404).json({ error: 'Erro ao consultar relatório financeiro', details: error?.message || error });
    }
}
async function relatorioDiscipuladoPorDiscipulador(req, res) {
    return res.status(200).json({ message: 'Relatório de discipulado OK' });
}
//# sourceMappingURL=relatorio.controller.js.map