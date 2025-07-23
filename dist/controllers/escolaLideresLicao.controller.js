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
exports.remove = exports.update = exports.get = exports.list = exports.create = void 0;
const licaoService = __importStar(require("../services/escolaLideresLicao.service"));
// Criar lição
const create = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema)
            return res.status(400).json({ error: 'Schema não informado no header.' });
        const licao = await licaoService.createLicao(schema, req.body);
        res.status(201).json(licao);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.create = create;
// Listar lições
const list = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema)
            return res.status(400).json({ error: 'Schema não informado no header.' });
        const licoes = await licaoService.listLicoes(schema);
        res.json(licoes);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.list = list;
// Obter lição por ID
const get = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema)
            return res.status(400).json({ error: 'Schema não informado no header.' });
        const { id } = req.params;
        const licao = await licaoService.getLicao(schema, Number(id));
        if (!licao)
            return res.status(404).json({ error: 'Lição não encontrada.' });
        res.json(licao);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.get = get;
// Atualizar lição
const update = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema)
            return res.status(400).json({ error: 'Schema não informado no header.' });
        const { id } = req.params;
        const licao = await licaoService.updateLicao(schema, Number(id), req.body);
        res.json(licao);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.update = update;
// Remover lição
const remove = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema)
            return res.status(400).json({ error: 'Schema não informado no header.' });
        const { id } = req.params;
        await licaoService.deleteLicao(schema, Number(id));
        res.json({ message: 'Lição removida com sucesso.' });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.remove = remove;
//# sourceMappingURL=escolaLideresLicao.controller.js.map