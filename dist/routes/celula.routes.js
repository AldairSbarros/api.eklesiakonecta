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
const celulaController = __importStar(require("../controllers/celula.controller"));
const autenticarJWT_1 = require("../middleware/autenticarJWT");
const autorizarRoles_1 = require("../middleware/autorizarRoles");
const router = (0, express_1.Router)();
// Handler para funções async
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
/**
 * @swagger
 * /celulas:
 *   post:
 *     summary: Cria uma nova célula
 *     responses:
 *       201:
 *         description: Célula criada
 */
router.post('/', asyncHandler(celulaController.create));
/**
 * @swagger
 * /celulas:
 *   get:
 *     summary: Lista todas as células
 *     responses:
 *       200:
 *         description: Lista de células
 */
router.get('/', asyncHandler(celulaController.list));
/**
 * @swagger
 * /celulas/{id}:
 *   get:
 *     summary: Busca uma célula por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Célula encontrada
 */
router.get('/:id', asyncHandler(celulaController.get));
/**
 * @swagger
 * /celulas/{id}:
 *   put:
 *     summary: Atualiza uma célula
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Célula atualizada
 */
router.put('/:id', asyncHandler(celulaController.update));
/**
 * @swagger
 * /celulas/{id}:
 *   delete:
 *     summary: Remove uma célula
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Célula removida
 */
router.delete('/:id', asyncHandler(celulaController.remove));
/**
 * @swagger
 * /celulas/{id}/localizacao:
 *   put:
 *     summary: Atualiza a localização da célula
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Localização atualizada
 */
router.put('/:id/localizacao', autenticarJWT_1.autenticarJWT, (0, autorizarRoles_1.autorizarRoles)(['ADMIN', 'LIDER']), asyncHandler(celulaController.atualizarLocalizacao));
/**
 * @swagger
 * /celulas/{id}/membros:
 *   post:
 *     summary: Adiciona um membro à célula
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Membro adicionado à célula
 */
router.post('/:id/membros', asyncHandler(celulaController.addMembro));
/**
 * @swagger
 * /celulas/{id}/membros/{membroId}:
 *   delete:
 *     summary: Remove um membro da célula
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: membroId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Membro removido da célula
 */
router.delete('/:id/membros/:membroId', asyncHandler(celulaController.removeMembro));
/**
 * @swagger
 * /celulas/{id}/membros:
 *   get:
 *     summary: Lista os membros de uma célula
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de membros da célula
 */
router.get('/:id/membros', celulaController.listarMembros);
exports.default = router;
//# sourceMappingURL=celula.routes.js.map