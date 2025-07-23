"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const exportacao_service_1 = require("../services/exportacao.service");
const relatorio_service_1 = require("../services/relatorio.service");
const router = express_1.default.Router();
router.get('/exportar/excel', async (req, res) => {
    try {
        const schema = req.headers['schema'];
        const { congregacaoId, mes, ano } = req.query;
        if (!schema) {
            res.status(400).json({ error: 'Schema não informado no header.' });
            return;
        }
        if (!congregacaoId || !mes || !ano) {
            res.status(400).json({ error: 'Parâmetros congregacaoId, mes e ano são obrigatórios.' });
            return;
        }
        const dados = await (0, relatorio_service_1.getRelatorioMensalData)(schema, String(congregacaoId), String(mes), String(ano));
        const buffer = await (0, exportacao_service_1.gerarExcel)(dados.listaDizimistas, 'Dizimistas');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=relatorio.xlsx');
        res.send(buffer);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});
router.get('/exportar/pdf', async (req, res) => {
    try {
        const schema = req.headers['schema'];
        const { congregacaoId, mes, ano } = req.query;
        if (!schema) {
            res.status(400).json({ error: 'Schema não informado no header.' });
            return;
        }
        if (!congregacaoId || !mes || !ano) {
            res.status(400).json({ error: 'Parâmetros congregacaoId, mes e ano são obrigatórios.' });
            return;
        }
        const dados = await (0, relatorio_service_1.getRelatorioMensalData)(schema, String(congregacaoId), String(mes), String(ano));
        const buffer = await (0, exportacao_service_1.gerarPDF)(dados.listaDizimistas, 'Dizimistas');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=relatorio.pdf');
        res.send(buffer);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});
exports.default = router;
//# sourceMappingURL=exportacao.controller.js.map