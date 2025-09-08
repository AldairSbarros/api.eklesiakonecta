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
exports.remove = exports.atualizarLocalizacao = exports.update = exports.get = exports.list = exports.create = void 0;
const memberService = __importStar(require("../services/member.service"));
// CREATE
const create = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        const member = await memberService.createMember(schema, req.body);
        res.status(201).json(member);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.create = create;
// READ ALL
const list = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        const { congregacaoId } = req.query;
        const members = await memberService.listMembers(schema, congregacaoId ? Number(congregacaoId) : undefined);
        res.json(members);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.list = list;
// READ ONE
const get = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        const { id } = req.params;
        const member = await memberService.getMember(schema, Number(id));
        if (!member)
            return res.status(404).json({ error: 'Membro não encontrado.' });
        res.json(member);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.get = get;
// UPDATE
const update = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        const { id } = req.params;
        const member = await memberService.updateMember(schema, Number(id), req.body);
        res.json(member);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.update = update;
// Atualizar geolocalização do membro
const atualizarLocalizacao = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema)
            return res.status(400).json({ error: 'Schema não informado no header.' });
        const { id } = req.params;
        const { latitude, longitude } = req.body;
        const member = await memberService.updateMember(schema, Number(id), { latitude, longitude });
        res.json(member);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.atualizarLocalizacao = atualizarLocalizacao;
// DELETE
const remove = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        const { id } = req.params;
        await memberService.deleteMember(schema, Number(id));
        res.json({ message: 'Membro removido com sucesso.' });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.remove = remove;
//# sourceMappingURL=member.controller.js.map