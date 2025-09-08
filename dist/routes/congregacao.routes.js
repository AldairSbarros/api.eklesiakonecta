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
const congregacaoController = __importStar(require("../controllers/congregacao.controller"));
const autenticarJWT_1 = require("../middleware/autenticarJWT");
const autorizarRoles_1 = require("../middleware/autorizarRoles");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /congregacoes:
 *   post:
 *     summary: Cria uma nova congregação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Congregação criada
 */
router.post('/', congregacaoController.create);
/**
 * @swagger
 * /congregacoes:
 *   get:
 *     summary: Lista todas as congregações
 *     responses:
 *       200:
 *         description: Lista de congregações
 */
router.get('/', congregacaoController.list);
/**
 * @swagger
 * /congregacoes/{id}:
 *   put:
 *     summary: Atualiza uma congregação
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
 *         description: Congregação atualizada
 */
router.put('/:id', congregacaoController.update);
/**
 * @swagger
 * /congregacoes/{id}:
 *   delete:
 *     summary: Remove uma congregação
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Congregação removida
 */
router.delete('/:id', congregacaoController.remove);
/**
 * @swagger
 * /congregacoes/{id}/localizacao:
 *   put:
 *     summary: Atualiza a localização da congregação
 *     security:
 *       - bearerAuth: []
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
 *         description: Localização da congregação atualizada
 */
router.put('/:id/localizacao', autenticarJWT_1.autenticarJWT, (0, autorizarRoles_1.autorizarRoles)(['ADMIN']), (req, res, next) => {
    Promise.resolve(congregacaoController.atualizarLocalizacao(req, res)).catch(next);
});
exports.default = router;
//# sourceMappingURL=congregacao.routes.js.map