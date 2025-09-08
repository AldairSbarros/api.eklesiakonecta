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
const usuarioPermissaoController = __importStar(require("../controllers/usuarioPermissao.controller"));
const autenticarJWT_1 = require("../middleware/autenticarJWT");
const router = (0, express_1.Router)();
function asyncHandler(fn) {
    return function (req, res, next) {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
/**
 * @swagger
 * /usuario-permissao:
 *   post:
 *     summary: Cria uma nova permissão de usuário
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Permissão de usuário criada com sucesso
 */
router.post('/', autenticarJWT_1.autenticarJWT, asyncHandler(usuarioPermissaoController.create));
/**
 * @swagger
 * /usuario-permissao:
 *   get:
 *     summary: Lista todas as permissões de usuário
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de permissões de usuário retornada com sucesso
 */
router.get('/', autenticarJWT_1.autenticarJWT, asyncHandler(usuarioPermissaoController.list));
/**
 * @swagger
 * /usuario-permissao/{id}:
 *   put:
 *     summary: Atualiza uma permissão de usuário
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
 *         description: Permissão de usuário atualizada com sucesso
 */
router.put('/:id', autenticarJWT_1.autenticarJWT, asyncHandler(usuarioPermissaoController.update));
/**
 * @swagger
 * /usuario-permissao/{id}:
 *   delete:
 *     summary: Remove uma permissão de usuário
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Permissão de usuário removida com sucesso
 */
router.delete('/:id', autenticarJWT_1.autenticarJWT, asyncHandler(usuarioPermissaoController.remove));
exports.default = router;
//# sourceMappingURL=usuarioPermissao.routes.js.map