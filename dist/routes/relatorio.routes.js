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
const relatorioController = __importStar(require("../controllers/relatorio.controller"));
const router = (0, express_1.Router)();
// Handler para funções async
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
/**
 * @swagger
 * /relatorio/mensal:
 *   get:
 *     summary: Retorna o relatório mensal
 *     responses:
 *       200:
 *         description: Relatório mensal retornado com sucesso
 */
router.get('/mensal', asyncHandler(async (req, res) => relatorioController.relatorioMensal(req)));
/**
 * @swagger
 * /relatorio/discipulado/por-discipulador:
 *   get:
 *     summary: Retorna o relatório de discipulado por discipulador
 *     responses:
 *       200:
 *         description: Relatório de discipulado retornado com sucesso
 */
router.get('/discipulado/por-discipulador', asyncHandler(relatorioController.relatorioDiscipuladoPorDiscipulador));
/**
 * @swagger
 * /relatorio/mensal/pdf:
 *   get:
 *     summary: Retorna o relatório mensal em PDF
 *     responses:
 *       200:
 *         description: PDF do relatório mensal retornado com sucesso
 */
router.get('/mensal/pdf', asyncHandler(async (req, res) => relatorioController.relatorioMensalPDF(req)));
/**
 * @swagger
 * /relatorio/celulas:
 *   get:
 *     summary: Retorna o relatório de células
 *     responses:
 *       200:
 *         description: Relatório de células retornado com sucesso
 */
router.get('/celulas', asyncHandler(relatorioController.relatorioCelulas));
/**
 * @swagger
 * /relatorio/financeiro:
 *   get:
 *     summary: Retorna o relatório financeiro
 *     responses:
 *       200:
 *         description: Relatório financeiro retornado com sucesso
 */
router.get('/financeiro', asyncHandler(relatorioController.relatorioFinanceiro));
exports.default = router;
//# sourceMappingURL=relatorio.routes.js.map