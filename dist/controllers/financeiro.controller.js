"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.relatorioMensal = exports.resumoFinanceiro = void 0;
const financeiroService = __importStar(require("../services/financeiro.service"));
// Resumo financeiro
const resumoFinanceiro = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        const { congregacaoId, mes, ano } = req.query;
        if (!schema) {
            return res.status(400).json({ error: "Schema não informado no header." });
        }
        if (!congregacaoId) {
            return res.status(400).json({ error: "Informe o congregacaoId" });
        }
        const data = await financeiroService.getResumoFinanceiro(schema, Number(congregacaoId), mes ? Number(mes) : undefined, ano ? Number(ano) : undefined);
        const { offerings, receitas, despesas, investimentos } = data;
        const totalOfferings = offerings.reduce((acc, o) => acc + o.value, 0);
        const totalReceitas = receitas.reduce((acc, r) => acc + r.valor, 0);
        const totalDespesas = despesas.reduce((acc, d) => acc + d.valor, 0);
        const totalInvestimentos = investimentos.reduce((acc, i) => acc + i.valor, 0);
        const totalEntradas = totalOfferings + totalReceitas;
        const totalSaidas = totalDespesas + totalInvestimentos;
        const saldo = totalEntradas - totalSaidas;
        const receitasPorCategoria = receitas.reduce((acc, r) => {
            acc[r.categoria || "Outros"] = (acc[r.categoria || "Outros"] || 0) + r.valor;
            return acc;
        }, {});
        const despesasPorCategoria = despesas.reduce((acc, d) => {
            acc[d.categoria || "Outros"] = (acc[d.categoria || "Outros"] || 0) + d.valor;
            return acc;
        }, {});
        res.json({
            totalOfferings,
            totalReceitas,
            totalDespesas,
            totalInvestimentos,
            totalEntradas,
            totalSaidas,
            receitasPorCategoria,
            despesasPorCategoria,
            saldo,
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.resumoFinanceiro = resumoFinanceiro;
// Relatório mensal
const relatorioMensal = async (req, res, next) => {
    try {
        const schema = req.headers['schema'];
        const { congregacaoId, mes, ano } = req.query;
        if (!schema) {
            return res.status(400).json({ error: "Schema não informado no header." });
        }
        if (!congregacaoId || !mes || !ano) {
            return res.status(400).json({ error: 'Informe congregacaoId, mes e ano' });
        }
        const relatorio = await financeiroService.getRelatorioMensal(schema, Number(congregacaoId), Number(mes), Number(ano));
        res.json(relatorio);
    }
    catch (err) {
        next(err);
    }
};
exports.relatorioMensal = relatorioMensal;
//# sourceMappingURL=financeiro.controller.js.map