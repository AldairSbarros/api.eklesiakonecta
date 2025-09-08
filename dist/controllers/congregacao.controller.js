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
exports.remove = exports.atualizarLocalizacao = exports.update = exports.list = exports.create = void 0;
const congregacaoService = __importStar(require("../services/congregacao.service"));
// Criar congregação
const create = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        const congregacao = await congregacaoService.createCongregacao(schema, req.body);
        res.status(201).json(congregacao);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao criar congregação' });
    }
};
exports.create = create;
// Listar congregações
const list = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        const congregacoes = await congregacaoService.listCongregacoes(schema);
        res.status(200).json(congregacoes);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao listar congregações' });
    }
};
exports.list = list;
// Editar congregação
const update = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        const { id } = req.params;
        const congregacao = await congregacaoService.updateCongregacao(schema, Number(id), req.body);
        res.json(congregacao);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar congregação' });
    }
};
exports.update = update;
// Atualizar geolocalização da congregação
const atualizarLocalizacao = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema)
            return res.status(400).json({ error: 'Schema não informado no header.' });
        const { id } = req.params;
        const { latitude, longitude } = req.body;
        const congregacao = await congregacaoService.updateCongregacao(schema, Number(id), { latitude, longitude });
        res.json(congregacao);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar localização da congregação' });
    }
};
exports.atualizarLocalizacao = atualizarLocalizacao;
// Deletar congregação
const remove = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        const { id } = req.params;
        await congregacaoService.deleteCongregacao(schema, Number(id));
        res.json({ message: 'Congregação removida com sucesso' });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao remover congregação' });
    }
};
exports.remove = remove;
//# sourceMappingURL=congregacao.controller.js.map