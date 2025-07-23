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
const memberController = __importStar(require("../controllers/member.controller"));
const autenticarJWT_1 = require("../middleware/autenticarJWT");
const autorizarRoles_1 = require("../middleware/autorizarRoles");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /members:
 *   post:
 *     summary: Cria um novo membro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Membro criado com sucesso
 */
router.post('/', memberController.create);
/**
 * @swagger
 * /members:
 *   get:
 *     summary: Lista todos os membros
 *     responses:
 *       200:
 *         description: Lista de membros retornada com sucesso
 */
router.get('/', memberController.list);
/**
 * @swagger
 * /members/{id}:
 *   get:
 *     summary: Busca um membro por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Membro encontrado com sucesso
 */
router.get('/:id', (req, res, next) => {
    memberController.get(req, res).catch(next);
});
/**
 * @swagger
 * /members/{id}:
 *   put:
 *     summary: Atualiza um membro
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
 *         description: Membro atualizado com sucesso
 */
router.put('/:id', memberController.update);
/**
 * @swagger
 * /members/{id}:
 *   delete:
 *     summary: Remove um membro
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Membro removido com sucesso
 */
router.delete('/:id', memberController.remove);
/**
 * @swagger
 * /members/{id}/localizacao:
 *   put:
 *     summary: Atualiza a localização do membro
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Localização do membro atualizada com sucesso
 */
router.put('/:id/localizacao', autenticarJWT_1.autenticarJWT, (0, autorizarRoles_1.autorizarRoles)(['ADMIN', 'LIDER']), (req, res, next) => {
    memberController.atualizarLocalizacao(req, res).catch(next);
});
exports.default = router;
//# sourceMappingURL=member.routes.js.map