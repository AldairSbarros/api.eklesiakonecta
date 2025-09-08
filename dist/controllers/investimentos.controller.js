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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removerInvestimento = exports.atualizarInvestimento = exports.obterInvestimento = exports.listarInvestimentos = exports.criarInvestimento = void 0;
const investimentosService = __importStar(require("../services/investimentos.service"));
const manualCodigos_json_1 = __importDefault(require("../utils/manualCodigos.json"));
// CREATE
const criarInvestimento = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema)
            return res.status(400).json({ error: 'Schema não informado no header.' });
        let { congregacaoId, descricao, valor, data, categoria, codigoManual } = req.body;
        if (codigoManual && !descricao) {
            const found = manualCodigos_json_1.default.investimentos.find(i => i.codigo === codigoManual);
            if (found)
                descricao = found.descricao;
        }
        if (descricao && !codigoManual) {
            const found = manualCodigos_json_1.default.investimentos.find(i => i.descricao.toLowerCase() === descricao.toLowerCase());
            if (found)
                codigoManual = found.codigo;
        }
        if (!codigoManual || !descricao) {
            return res.status(400).json({ error: 'Código ou descrição de investimento inválidos.' });
        }
        const investimento = await investimentosService.criarInvestimento(schema, {
            congregacaoId: Number(congregacaoId),
            descricao,
            valor: Number(valor),
            data: new Date(data),
            categoria,
            codigoManual
        });
        res.status(201).json(investimento);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.criarInvestimento = criarInvestimento;
// READ ALL
const listarInvestimentos = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema)
            return res.status(400).json({ error: 'Schema não informado no header.' });
        const investimentos = await investimentosService.listarInvestimentos(schema);
        res.json(investimentos);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.listarInvestimentos = listarInvestimentos;
// READ ONE
const obterInvestimento = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema)
            return res.status(400).json({ error: 'Schema não informado no header.' });
        const { id } = req.params;
        const investimento = await investimentosService.obterInvestimento(schema, Number(id));
        if (!investimento)
            return res.status(404).json({ error: 'Investimento não encontrado' });
        res.json(investimento);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.obterInvestimento = obterInvestimento;
// UPDATE
const atualizarInvestimento = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema)
            return res.status(400).json({ error: 'Schema não informado no header.' });
        const { id } = req.params;
        const investimento = await investimentosService.atualizarInvestimento(schema, Number(id), req.body);
        res.json(investimento);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.atualizarInvestimento = atualizarInvestimento;
// DELETE
const removerInvestimento = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema)
            return res.status(400).json({ error: 'Schema não informado no header.' });
        const { id } = req.params;
        await investimentosService.removerInvestimento(schema, Number(id));
        res.json({ message: 'Investimento removido com sucesso' });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.removerInvestimento = removerInvestimento;
//# sourceMappingURL=investimentos.controller.js.map