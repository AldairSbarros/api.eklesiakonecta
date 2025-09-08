"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const financeiro_controller_1 = require("../controllers/financeiro.controller");
const autenticarJWT_1 = require("../middleware/autenticarJWT");
const autorizarRoles_1 = require("../middleware/autorizarRoles");
const exceljs_1 = __importDefault(require("exceljs"));
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
/**
 * @swagger
 * /financeiro/resumo:
 *   get:
 *     summary: Retorna o resumo financeiro
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resumo financeiro retornado com sucesso
 */
router.get('/resumo', autenticarJWT_1.autenticarJWT, (0, autorizarRoles_1.autorizarRoles)(['admin', 'tesoureiro']), (req, res, next) => {
    (0, financeiro_controller_1.resumoFinanceiro)(req, res).catch(next);
});
/**
 * @swagger
 * /financeiro/relatorio-mensal:
 *   get:
 *     summary: Retorna o relatório financeiro mensal
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Relatório mensal retornado com sucesso
 */
router.get('/relatorio-mensal', autenticarJWT_1.autenticarJWT, (0, autorizarRoles_1.autorizarRoles)(['admin', 'tesoureiro']), (req, res, next) => {
    (0, financeiro_controller_1.relatorioMensal)(req, res, next).catch(next);
});
/**
 * @swagger
 * /financeiro/resumo/excel:
 *   get:
 *     summary: Exporta o resumo financeiro em Excel
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: congregacaoId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: mes
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: ano
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Arquivo Excel gerado com sucesso
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Falta o parâmetro congregacaoId
 */
router.get('/resumo/excel', autenticarJWT_1.autenticarJWT, (0, autorizarRoles_1.autorizarRoles)(['admin', 'tesoureiro']), async (req, res, next) => {
    try {
        const { congregacaoId, mes, ano } = req.query;
        if (!congregacaoId) {
            res.status(400).json({ error: 'Informe o congregacaoId' });
            return;
        }
        let dateFilter = {};
        if (mes && ano) {
            const inicio = new Date(Number(ano), Number(mes) - 1, 1);
            const fim = new Date(Number(ano), Number(mes), 0, 23, 59, 59);
            dateFilter = { gte: inicio, lte: fim };
        }
        // Buscando receitas, despesas, offerings e investimentos
        const receitas = await prisma.receita.findMany({
            where: {
                congregacaoId: Number(congregacaoId),
                ...(mes && ano ? { data: dateFilter } : {})
            }
        });
        const despesas = await prisma.despesa.findMany({
            where: {
                congregacaoId: Number(congregacaoId),
                ...(mes && ano ? { data: dateFilter } : {})
            }
        });
        const offerings = await prisma.offering.findMany({
            where: {
                congregacaoId: Number(congregacaoId),
                ...(mes && ano ? { date: dateFilter } : {})
            }
        });
        const investimentos = await prisma.investimento.findMany({
            where: {
                congregacaoId: Number(congregacaoId),
                ...(mes && ano ? { data: dateFilter } : {})
            }
        });
        // Agrupando receitas e despesas por categoria
        const receitasPorCategoria = receitas.reduce((acc, r) => {
            const cat = r.categoria || 'Outros';
            acc[cat] = (acc[cat] || 0) + r.valor;
            return acc;
        }, {});
        const despesasPorCategoria = despesas.reduce((acc, d) => {
            const cat = d.categoria || 'Outros';
            acc[cat] = (acc[cat] || 0) + d.valor;
            return acc;
        }, {});
        // Agrupando offerings por tipo
        const offeringsPorTipo = offerings.reduce((acc, o) => {
            const tipo = o.type || 'Outros';
            acc[tipo] = (acc[tipo] || 0) + o.value;
            return acc;
        }, {});
        // Agrupando investimentos por categoria
        const investimentosPorCategoria = investimentos.reduce((acc, i) => {
            const cat = i.categoria || 'Outros';
            acc[cat] = (acc[cat] || 0) + i.valor;
            return acc;
        }, {});
        // Criando o Excel
        const workbook = new exceljs_1.default.Workbook();
        const sheet = workbook.addWorksheet('Resumo Financeiro');
        // Offerings
        sheet.addRow(['Offerings por Tipo']);
        sheet.addRow(['Tipo', 'Valor']);
        Object.entries(offeringsPorTipo).forEach(([tipo, val]) => sheet.addRow([tipo, val]));
        sheet.addRow([]);
        // Receitas
        sheet.addRow(['Receitas por Categoria']);
        sheet.addRow(['Categoria', 'Valor']);
        Object.entries(receitasPorCategoria).forEach(([cat, val]) => sheet.addRow([cat, val]));
        sheet.addRow([]);
        // Despesas
        sheet.addRow(['Despesas por Categoria']);
        sheet.addRow(['Categoria', 'Valor']);
        Object.entries(despesasPorCategoria).forEach(([cat, val]) => sheet.addRow([cat, val]));
        sheet.addRow([]);
        // Investimentos
        sheet.addRow(['Investimentos por Categoria']);
        sheet.addRow(['Categoria', 'Valor']);
        Object.entries(investimentosPorCategoria).forEach(([cat, val]) => sheet.addRow([cat, val]));
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=relatorio.xlsx');
        await workbook.xlsx.write(res);
        res.end();
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=financeiro.routes.js.map