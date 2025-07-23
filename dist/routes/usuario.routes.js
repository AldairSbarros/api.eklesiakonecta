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
const usuarioController = __importStar(require("../controllers/usuario.controller"));
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
 * /usuario/login:
 *   post:
 *     summary: Realiza login do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 */
router.post('/login', asyncHandler(usuarioController.login));
/**
 * @swagger
 * /usuario/dizimos:
 *   get:
 *     summary: Lista todos os dízimos da congregação
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de dízimos retornada com sucesso
 */
router.get('/dizimos', autenticarJWT_1.autenticarJWT, (0, autorizarRoles_1.autorizarRoles)(['ADMIN', 'Tesoureiro', 'Dirigente']), asyncHandler(usuarioController.listDizimosCongregacao));
/**
 * @swagger
 * /usuario:
 *   get:
 *     summary: Lista todos os usuários
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 */
router.get('/', autenticarJWT_1.autenticarJWT, (0, autorizarRoles_1.autorizarRoles)(['ADMIN']), asyncHandler(usuarioController.list));
/**
 * @swagger
 * /usuario:
 *   post:
 *     summary: Cria um novo usuário
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
 *         description: Usuário criado com sucesso
 */
router.post('/', autenticarJWT_1.autenticarJWT, (0, autorizarRoles_1.autorizarRoles)(['ADMIN']), asyncHandler(usuarioController.create));
/**
 * @swagger
 * /usuario/{id}:
 *   put:
 *     summary: Atualiza um usuário
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
 *         description: Usuário atualizado com sucesso
 */
router.put('/:id', autenticarJWT_1.autenticarJWT, (0, autorizarRoles_1.autorizarRoles)(['ADMIN']), asyncHandler(usuarioController.update));
/**
 * @swagger
 * /usuario/{id}:
 *   delete:
 *     summary: Remove um usuário
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
 *         description: Usuário removido com sucesso
 */
router.delete('/:id', autenticarJWT_1.autenticarJWT, (0, autorizarRoles_1.autorizarRoles)(['ADMIN']), asyncHandler(usuarioController.deleteUsuario));
/**
 * @swagger
 * /usuario/{id}:
 *   get:
 *     summary: Busca um usuário por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário encontrado com sucesso
 */
router.get('/:id', autenticarJWT_1.autenticarJWT, (0, autorizarRoles_1.autorizarRoles)(['ADMIN']), asyncHandler(usuarioController.get));
/**
 * @swagger
 * /usuario/change-password:
 *   post:
 *     summary: Troca a própria senha
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
 *         description: Senha alterada com sucesso
 */
router.post('/change-password', autenticarJWT_1.autenticarJWT, asyncHandler(usuarioController.changePassword));
/**
 * @swagger
 * /usuario/upload-comprovante:
 *   post:
 *     summary: Upload de comprovante de dízimo
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               comprovante:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Comprovante enviado com sucesso
 */
router.post('/upload-comprovante', autenticarJWT_1.autenticarJWT, asyncHandler(usuarioController.uploadComprovante));
exports.default = router;
//# sourceMappingURL=usuario.routes.js.map