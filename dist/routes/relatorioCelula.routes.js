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
const express_1 = require("express");
const relatorioController = __importStar(require("../controllers/relatorioCelula.controller"));
const router = (0, express_1.Router)();
/**
 * @swagger
 * /relatorio-celula/{celulaId}/completo:
 *   get:
 *     summary: Retorna o relatório completo da célula
 *     parameters:
 *       - in: path
 *         name: celulaId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Relatório completo retornado com sucesso
 */
router.get('/:celulaId/completo', (req, res, next) => {
    relatorioController.relatorioCompleto(req, res, next).catch(next);
});
/**
 * @swagger
 * /relatorio-celula/{celulaId}/presencas:
 *   get:
 *     summary: Retorna o relatório de presenças da célula
 *     parameters:
 *       - in: path
 *         name: celulaId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Relatório de presenças retornado com sucesso
 */
router.get('/:celulaId/presencas', (req, res, next) => {
    relatorioController.relatorioPresenca(req, res, next).catch(next);
});
exports.default = router;
//# sourceMappingURL=relatorioCelula.routes.js.map