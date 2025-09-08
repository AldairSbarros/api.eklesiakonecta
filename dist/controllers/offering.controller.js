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
exports.listReceipts = exports.deleteReceiptPhoto = exports.updateReceiptPhoto = exports.remove = exports.update = exports.get = exports.list = exports.create = void 0;
const offeringService = __importStar(require("../services/offering.service"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// CREATE
const create = async (req, res) => {
    try {
        console.log('BODY RECEBIDO:', req.body);
        const schema = req.headers['schema'];
        if (!schema) {
            res.status(400).json({ error: 'Schema não informado no header.' });
            return;
        }
        // Aceita os campos do seu teste
        const { valor, data, memberId, type, service, receiptPhoto, numeroRecibo, congregacaoId } = req.body;
        // Validação básica
        if (!valor || !data || !memberId || !congregacaoId) {
            res.status(400).json({ error: 'Campos obrigatórios não informados.' });
            return;
        }
        // Criação da oferta/dízimo
        const offering = await offeringService.createOffering(schema, {
            value: valor,
            date: new Date(data),
            memberId: memberId,
            type: type || "dizimo",
            service: service || null,
            receiptPhoto: receiptPhoto || null,
            numeroRecibo: numeroRecibo || null,
            congregacaoId: congregacaoId // <-- Adicione aqui!
        });
        res.status(201).json(offering);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.create = create;
// READ ALL
const list = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema) {
            res.status(400).json({ error: 'Schema não informado no header.' });
            return;
        }
        const { congregacaoId, memberId, type, mes, ano } = req.query;
        const where = {};
        if (congregacaoId)
            where.congregacaoId = Number(congregacaoId);
        if (memberId)
            where.memberId = Number(memberId);
        if (type)
            where.type = String(type);
        if (mes && ano) {
            const inicio = new Date(Number(ano), Number(mes) - 1, 1);
            const fim = new Date(Number(ano), Number(mes), 0, 23, 59, 59);
            where.date = { gte: inicio, lte: fim };
        }
        const offerings = await offeringService.listOfferings(schema, where);
        res.json(offerings);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.list = list;
// READ ONE
const get = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema) {
            res.status(400).json({ error: 'Schema não informado no header.' });
            return;
        }
        const { id } = req.params;
        const offering = await offeringService.getOffering(schema, Number(id));
        if (!offering) {
            res.status(404).json({ error: 'Registro não encontrado.' });
            return;
        }
        res.json(offering);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.get = get;
// UPDATE
const update = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema) {
            res.status(400).json({ error: 'Schema não informado no header.' });
            return;
        }
        const { id } = req.params;
        const data = req.body;
        const offering = await offeringService.updateOffering(schema, Number(id), data);
        res.json(offering);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.update = update;
// DELETE
const remove = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema) {
            res.status(400).json({ error: 'Schema não informado no header.' });
            return;
        }
        const { id } = req.params;
        await offeringService.removeOffering(schema, Number(id));
        res.json({ message: 'Registro removido com sucesso' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.remove = remove;
// UPDATE RECEIPT PHOTO
const updateReceiptPhoto = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema) {
            res.status(400).json({ error: 'Schema não informado no header.' });
            return;
        }
        const { id } = req.params;
        const { receiptPhoto } = req.body;
        const offering = await offeringService.updateOffering(schema, Number(id), { receiptPhoto });
        res.json(offering);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateReceiptPhoto = updateReceiptPhoto;
// DELETE RECEIPT PHOTO
const deleteReceiptPhoto = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema) {
            res.status(400).json({ error: 'Schema não informado no header.' });
            return;
        }
        const { id } = req.params;
        const offering = await offeringService.getOffering(schema, Number(id));
        if (!offering || !offering.receiptPhoto) {
            res.status(404).json({ error: 'Comprovante não encontrado' });
            return;
        }
        const filePath = path_1.default.resolve(__dirname, '../../', offering.receiptPhoto);
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
        }
        await offeringService.updateOffering(schema, Number(id), { receiptPhoto: null });
        res.json({ message: 'Comprovante removido com sucesso' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteReceiptPhoto = deleteReceiptPhoto;
// LIST RECEIPTS
const listReceipts = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema) {
            res.status(400).json({ error: 'Schema não informado no header.' });
            return;
        }
        const { congregacaoId, mes, ano } = req.query;
        if (!congregacaoId) {
            res.status(400).json({ error: 'Informe o congregacaoId' });
            return;
        }
        const where = {
            congregacaoId: Number(congregacaoId),
            receiptPhoto: { not: null }
        };
        if (mes && ano) {
            const inicio = new Date(Number(ano), Number(mes) - 1, 1);
            const fim = new Date(Number(ano), Number(mes), 0, 23, 59, 59);
            where.date = { gte: inicio, lte: fim };
        }
        const comprovantes = await offeringService.listReceipts(schema, where);
        res.json(comprovantes);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.listReceipts = listReceipts;
//# sourceMappingURL=offering.controller.js.map