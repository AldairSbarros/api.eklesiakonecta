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
exports.relatorioPresenca = exports.relatorioCompleto = void 0;
const relatorioService = __importStar(require("../services/relatorioCelula.service"));
const relatorioCompleto = async (req, res, next) => {
    const schema = req.headers['schema'];
    if (!schema)
        return res.status(400).json({ error: 'Schema não informado no header.' });
    const { celulaId } = req.params;
    let { mes, ano } = req.query;
    // Valores padrão: mês e ano atuais
    const now = new Date();
    const mesNum = mes ? Number(mes) : now.getMonth() + 1;
    const anoNum = ano ? Number(ano) : now.getFullYear();
    try {
        const membros = await relatorioService.membrosDaCelula(schema, Number(celulaId));
        const presencas = await relatorioService.presencasPorReuniao(schema, Number(celulaId));
        const media = await relatorioService.mediaPresencaNoMes(schema, Number(celulaId), mesNum, anoNum);
        const ranking = await relatorioService.rankingPresenca(schema, Number(celulaId), mesNum, anoNum);
        const aniversariantes = await relatorioService.aniversariantesDoMes(schema, Number(celulaId), mesNum);
        res.json({ membros, presencas, media, ranking, aniversariantes });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.relatorioCompleto = relatorioCompleto;
const relatorioPresenca = async (req, res, next) => {
    const schema = req.headers['schema'];
    if (!schema)
        return res.status(400).json({ error: 'Schema não informado no header.' });
    const { celulaId } = req.params;
    try {
        const presencas = await relatorioService.presencasPorReuniao(schema, Number(celulaId));
        res.json(presencas);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.relatorioPresenca = relatorioPresenca;
//# sourceMappingURL=relatorioCelula.controller.js.map