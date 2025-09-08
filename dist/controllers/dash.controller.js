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
exports.resumoFinanceiroMensal = exports.resumoFinanceiro = void 0;
const dashService = __importStar(require("../services/dash.service"));
// Resumo financeiro geral (total do período)
const resumoFinanceiro = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        const { congregacaoId, ano, mes } = req.query;
        if (!schema)
            return res.status(400).json({ error: 'Schema não informado no header.' });
        if (!congregacaoId || !ano) {
            return res.status(400).json({ error: 'Informe congregacaoId e ano' });
        }
        const resumo = await dashService.getResumoFinanceiro(schema, String(congregacaoId), String(ano), mes ? String(mes) : undefined);
        res.json(resumo);
    }
    catch (error) {
        console.error('Erro ao obter resumo financeiro:', error);
        res.status(500).json({ error: 'Erro ao obter resumo financeiro' });
    }
};
exports.resumoFinanceiro = resumoFinanceiro;
// Resumo financeiro mensal (para gráficos)
const resumoFinanceiroMensal = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        const { congregacaoId, ano } = req.query;
        if (!schema)
            return res.status(400).json({ error: 'Schema não informado no header.' });
        if (!congregacaoId || !ano) {
            return res.status(400).json({ error: 'Informe congregacaoId e ano' });
        }
        const dados = await dashService.getResumoFinanceiroMensal(schema, String(congregacaoId), String(ano));
        res.json(dados);
    }
    catch (error) {
        console.error('Erro ao obter resumo financeiro mensal:', error);
        res.status(500).json({ error: 'Erro ao obter resumo financeiro mensal' });
    }
};
exports.resumoFinanceiroMensal = resumoFinanceiroMensal;
//# sourceMappingURL=dash.controller.js.map