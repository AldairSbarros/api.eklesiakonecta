"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrarLog = registrarLog;
exports.relatorioMensal = relatorioMensal;
exports.relatorioMensalPDF = relatorioMensalPDF;
exports.relatorioCelulas = relatorioCelulas;
exports.relatorioFinanceiro = relatorioFinanceiro;
exports.relatorioDiscipuladoPorDiscipulador = relatorioDiscipuladoPorDiscipulador;
const prismaDynamic_1 = require("../utils/prismaDynamic");
async function registrarLog(schema, { usuarioId, acao, detalhes, ip }) {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    await prisma.logAcesso.create({
        data: { usuarioId, acao, detalhes, ip }
    });
}
///////================MOCK==================////////
function relatorioMensal(relatorioMensal) {
    throw new Error('Function not implemented.');
}
function relatorioMensalPDF(relatorioMensalPDF) {
    throw new Error('Function not implemented.');
}
async function relatorioCelulas(req, res) {
    return res.status(200).json({ message: 'Relatório de células OK' });
}
async function relatorioFinanceiro(req, res) {
    return res.status(200).json({ message: 'Relatório financeiro OK' });
}
async function relatorioDiscipuladoPorDiscipulador(req, res) {
    return res.status(200).json({ message: 'Relatório de discipulado OK' });
}
//# sourceMappingURL=relatorio.controller.js.map