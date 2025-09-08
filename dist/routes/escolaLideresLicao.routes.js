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
const escolaLideresLicaoController = __importStar(require("../controllers/escolaLideresLicao.controller"));
const router = (0, express_1.Router)();
// Handler para funções async
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
/**
 * @swagger
 * /escola-lideres-licao:
 *   post:
 *     summary: Cria uma nova lição da escola de líderes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Lição criada com sucesso
 */
router.post('/', asyncHandler(escolaLideresLicaoController.create));
/**
 * @swagger
 * /escola-lideres-licao:
 *   get:
 *     summary: Lista todas as lições da escola de líderes
 *     responses:
 *       200:
 *         description: Lista de lições retornada com sucesso
 */
router.get('/', asyncHandler(escolaLideresLicaoController.list));
/**
 * @swagger
 * /escola-lideres-licao/{id}:
 *   get:
 *     summary: Busca uma lição da escola de líderes por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lição encontrada com sucesso
 */
router.get('/:id', asyncHandler(escolaLideresLicaoController.get));
/**
 * @swagger
 * /escola-lideres-licao/{id}:
 *   put:
 *     summary: Atualiza uma lição da escola de líderes
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
 *         description: Lição atualizada com sucesso
 */
router.put('/:id', asyncHandler(escolaLideresLicaoController.update));
/**
 * @swagger
 * /escola-lideres-licao/{id}:
 *   delete:
 *     summary: Remove uma lição da escola de líderes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Lição removida com sucesso
 */
router.delete('/:id', asyncHandler(escolaLideresLicaoController.remove));
exports.default = router;
//# sourceMappingURL=escolaLideresLicao.routes.js.map