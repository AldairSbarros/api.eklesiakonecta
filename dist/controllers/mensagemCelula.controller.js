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
exports.listarMensagensPDF = exports.removerMensagem = exports.atualizarMensagem = exports.obterMensagem = exports.listarMensagens = exports.criarMensagem = void 0;
const mensagemCelulaService = __importStar(require("../services/mensagemCelula.service"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
// CRUD no banco
const criarMensagem = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema)
            return res.status(400).json({ error: 'Schema não informado no header.' });
        const mensagem = await mensagemCelulaService.criarMensagem(schema, req.body);
        res.status(201).json(mensagem);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.criarMensagem = criarMensagem;
const listarMensagens = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema)
            return res.status(400).json({ error: 'Schema não informado no header.' });
        const mensagens = await mensagemCelulaService.listarMensagens(schema);
        res.json(mensagens);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.listarMensagens = listarMensagens;
const obterMensagem = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema)
            return res.status(400).json({ error: 'Schema não informado no header.' });
        const { id } = req.params;
        const mensagem = await mensagemCelulaService.obterMensagem(schema, Number(id));
        if (!mensagem)
            return res.status(404).json({ error: 'Mensagem não encontrada.' });
        res.json(mensagem);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.obterMensagem = obterMensagem;
const atualizarMensagem = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema)
            return res.status(400).json({ error: 'Schema não informado no header.' });
        const { id } = req.params;
        const mensagem = await mensagemCelulaService.atualizarMensagem(schema, Number(id), req.body);
        res.json(mensagem);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.atualizarMensagem = atualizarMensagem;
const removerMensagem = async (req, res) => {
    try {
        const schema = req.headers['schema'];
        if (!schema)
            return res.status(400).json({ error: 'Schema não informado no header.' });
        const { id } = req.params;
        await mensagemCelulaService.removerMensagem(schema, Number(id));
        res.json({ message: 'Mensagem removida com sucesso.' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.removerMensagem = removerMensagem;
// Listar PDFs (mantendo sua lógica original)
const listarMensagensPDF = async (req, res) => {
    const pdfsDir = path_1.default.join(__dirname, '../../public/pdfs');
    try {
        if (!fs_1.default.existsSync(pdfsDir)) {
            res.json([]);
            return;
        }
        const files = fs_1.default.readdirSync(pdfsDir)
            .filter(f => f.endsWith('.pdf'))
            .map(f => ({
            nome: f,
            caminho: `/pdfs/${f}`,
            data: fs_1.default.statSync(path_1.default.join(pdfsDir, f)).mtime,
            titulo: '',
        }));
        files.sort((a, b) => b.data.getTime() - a.data.getTime());
        for (const file of files) {
            const dataBuffer = fs_1.default.readFileSync(path_1.default.join(pdfsDir, file.nome));
            try {
                const pdfData = await (0, pdf_parse_1.default)(dataBuffer);
                const linhas = pdfData.text ? pdfData.text.split('\n').filter(l => l.trim() !== '') : [];
                file.titulo = pdfData.info?.Title || (linhas[6] ? linhas[6].slice(0, 60) : file.nome);
            }
            catch (e) {
                console.error('Erro ao ler PDF:', file.nome, e);
                file.titulo = file.nome;
            }
        }
        res.json(files);
    }
    catch (err) {
        console.error('Erro ao listar mensagens:', err);
        res.status(500).json({ error: 'Erro ao listar mensagens.' });
    }
};
exports.listarMensagensPDF = listarMensagensPDF;
//# sourceMappingURL=mensagemCelula.controller.js.map