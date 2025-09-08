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
exports.removerDespesa = exports.atualizarDespesa = exports.obterDespesa = exports.listarDespesas = exports.criarDespesa = void 0;
const despesaService = __importStar(require("../services/despesa.service"));
const manualCodigos_json_1 = __importDefault(require("../utils/manualCodigos.json"));
// CREATE
const criarDespesa = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema)
            return res.status(400).json({ error: 'Schema não informado no header.' });
        let { congregacaoId, descricao, valor, data, categoria, codigoManual } = req.body;
        const notaFiscalFoto = req.file ? req.file.path.replace(/\\/g, '/') : null;
        if (codigoManual && !descricao) {
            const found = manualCodigos_json_1.default.despesas.find(d => d.codigo === codigoManual);
            if (found)
                descricao = found.descricao;
        }
        if (descricao && !codigoManual) {
            const found = manualCodigos_json_1.default.despesas.find(d => d.descricao.toLowerCase() === descricao.toLowerCase());
            if (found)
                codigoManual = found.codigo;
        }
        if (!codigoManual || !descricao) {
            return res.status(400).json({ error: 'Código ou descrição de despesa inválidos.' });
        }
        const despesa = await despesaService.criarDespesa(schema, {
            congregacaoId: Number(congregacaoId),
            descricao,
            valor: Number(valor),
            data: new Date(data),
            categoria,
            codigoManual,
            notaFiscalFoto
        });
        res.status(201).json(despesa);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.criarDespesa = criarDespesa;
// READ ALL
const listarDespesas = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema)
            return res.status(400).json({ error: 'Schema não informado no header.' });
        const despesas = await despesaService.listarDespesas(schema);
        res.status(200).json(despesas);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.listarDespesas = listarDespesas;
// READ ONE
const obterDespesa = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema)
            return res.status(400).json({ error: 'Schema não informado no header.' });
        const { id } = req.params;
        const despesa = await despesaService.obterDespesa(schema, Number(id));
        if (!despesa)
            return res.status(404).json({ error: 'Despesa não encontrada' });
        res.json(despesa);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.obterDespesa = obterDespesa;
// UPDATE
const atualizarDespesa = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema)
            return res.status(400).json({ error: 'Schema não informado no header.' });
        const { id } = req.params;
        const despesa = await despesaService.atualizarDespesa(schema, Number(id), req.body);
        res.json(despesa);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.atualizarDespesa = atualizarDespesa;
// DELETE
const removerDespesa = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema)
            return res.status(400).json({ error: 'Schema não informado no header.' });
        const { id } = req.params;
        await despesaService.removerDespesa(schema, Number(id));
        res.json({ message: 'Despesa removida com sucesso' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.removerDespesa = removerDespesa;
//# sourceMappingURL=despesa.controller.js.map