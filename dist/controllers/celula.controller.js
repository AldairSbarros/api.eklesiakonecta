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
exports.removeMembro = exports.addMembro = exports.remove = exports.update = exports.get = exports.list = exports.atualizarLocalizacao = exports.create = void 0;
exports.listarMembros = listarMembros;
const celulaService = __importStar(require("../services/celula.service"));
// Criar célula
const create = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema)
            return res.status(400).json({ error: 'Schema não informado no header.' });
        const celula = await celulaService.createCelula(schema, req.body);
        res.status(201).json(celula);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.create = create;
const atualizarLocalizacao = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema)
            return res.status(400).json({ error: 'Schema não informado no header.' });
        const { id } = req.params;
        const { latitude, longitude } = req.body;
        const celula = await celulaService.updateCelula(schema, Number(id), { latitude, longitude });
        res.json(celula);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.atualizarLocalizacao = atualizarLocalizacao;
// Listar células
const list = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema)
            return res.status(400).json({ error: 'Schema não informado no header.' });
        const celulas = await celulaService.listCelulas(schema);
        res.json(celulas);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.list = list;
// Obter célula por ID
const get = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema)
            return res.status(400).json({ error: 'Schema não informado no header.' });
        const { id } = req.params;
        const celula = await celulaService.getCelula(schema, Number(id));
        if (!celula)
            return res.status(404).json({ error: 'Célula não encontrada.' });
        res.json(celula);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.get = get;
// Atualizar célula
const update = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema)
            return res.status(400).json({ error: 'Schema não informado no header.' });
        const { id } = req.params;
        const celula = await celulaService.updateCelula(schema, Number(id), req.body);
        res.json(celula);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.update = update;
// Remover célula
const remove = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema)
            return res.status(400).json({ error: 'Schema não informado no header.' });
        const { id } = req.params;
        await celulaService.deleteCelula(schema, Number(id));
        res.json({ message: 'Célula removida com sucesso.' });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.remove = remove;
const addMembro = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema)
            return res.status(400).json({ error: 'Schema não informado no header.' });
        const { id } = req.params;
        const { membroId } = req.body;
        const membro = await celulaService.addMembroCelula(schema, Number(id), Number(membroId));
        res.status(201).json(membro);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.addMembro = addMembro;
const removeMembro = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema)
            return res.status(400).json({ error: 'Schema não informado no header.' });
        const { membroId } = req.params;
        await celulaService.removeMembroCelula(schema, Number(membroId));
        res.json({ message: 'Membro removido da célula.' });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.removeMembro = removeMembro;
function listarMembros(listarMembros) {
    throw new Error('Function not implemented.');
}
//# sourceMappingURL=celula.controller.js.map