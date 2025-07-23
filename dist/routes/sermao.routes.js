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
const sermaoController = __importStar(require("../controllers/sermao.controller"));
const router = (0, express_1.Router)();
/**
 * @swagger
 * /sermao:
 *   post:
 *     summary: Cria um novo sermão
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Sermão criado com sucesso
 */
router.post('/', (req, res, next) => {
    Promise.resolve(sermaoController.create(req, res)).catch(next);
});
/**
 * @swagger
 * /sermao:
 *   get:
 *     summary: Lista todos os sermões
 *     responses:
 *       200:
 *         description: Lista de sermões retornada com sucesso
 */
router.get('/', (req, res, next) => {
    Promise.resolve(sermaoController.list(req, res)).catch(next);
});
/**
 * @swagger
 * /sermao/{id}:
 *   get:
 *     summary: Busca um sermão por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sermão encontrado com sucesso
 */
router.get('/:id', (req, res, next) => {
    Promise.resolve(sermaoController.get(req, res)).catch(next);
});
/**
 * @swagger
 * /sermao/{id}:
 *   put:
 *     summary: Atualiza um sermão
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
 *         description: Sermão atualizado com sucesso
 */
router.put('/:id', (req, res, next) => {
    Promise.resolve(sermaoController.update(req, res)).catch(next);
});
/**
 * @swagger
 * /sermao/{id}:
 *   delete:
 *     summary: Remove um sermão
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Sermão removido com sucesso
 */
router.delete('/:id', (req, res, next) => {
    Promise.resolve(sermaoController.remove(req, res)).catch(next);
});
exports.default = router;
//# sourceMappingURL=sermao.routes.js.map