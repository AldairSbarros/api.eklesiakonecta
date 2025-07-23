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
const despesaController = __importStar(require("../controllers/despesa.controller"));
const router = (0, express_1.Router)();
// Helper to wrap async route handlers and forward errors
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
/**
 * @swagger
 * /despesas:
 *   post:
 *     summary: Cria uma nova despesa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Despesa criada
 */
router.post('/', asyncHandler(despesaController.criarDespesa));
/**
 * @swagger
 * /despesas:
 *   get:
 *     summary: Lista todas as despesas
 *     responses:
 *       200:
 *         description: Lista de despesas
 */
router.get('/', asyncHandler(despesaController.listarDespesas));
/**
 * @swagger
 * /despesas/{id}:
 *   get:
 *     summary: Busca uma despesa por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Despesa encontrada
 */
router.get('/:id', asyncHandler(despesaController.obterDespesa));
/**
 * @swagger
 * /despesas/{id}:
 *   put:
 *     summary: Atualiza uma despesa
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Despesa atualizada
 */
router.put('/:id', asyncHandler(despesaController.atualizarDespesa));
/**
 * @swagger
 * /despesas/{id}:
 *   delete:
 *     summary: Remove uma despesa
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Despesa removida
 */
router.delete('/:id', asyncHandler(despesaController.removerDespesa));
exports.default = router;
//# sourceMappingURL=despesa.routes.js.map