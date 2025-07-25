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
const encontroController = __importStar(require("../controllers/encontro.controller"));
const router = (0, express_1.Router)();
/**
 * @swagger
 * /encontros:
 *   post:
 *     summary: Cria um novo encontro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Encontro criado com sucesso
 */
router.post('/', (req, res, next) => {
    encontroController.create(req, res).catch(next);
});
/**
 * @swagger
 * /encontros:
 *   get:
 *     summary: Lista todos os encontros
 *     responses:
 *       200:
 *         description: Lista de encontros retornada com sucesso
 */
router.get('/', (req, res, next) => {
    encontroController.list(req, res).catch(next);
});
/**
 * @swagger
 * /encontros/{id}:
 *   get:
 *     summary: Busca um encontro por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Encontro encontrado com sucesso
 */
router.get('/:id', (req, res, next) => {
    encontroController.get(req, res).catch(next);
});
/**
 * @swagger
 * /encontros/{id}:
 *   put:
 *     summary: Atualiza um encontro
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
 *         description: Encontro atualizado com sucesso
 */
router.put('/:id', (req, res, next) => {
    encontroController.update(req, res).catch(next);
});
/**
 * @swagger
 * /encontros/{id}:
 *   delete:
 *     summary: Remove um encontro
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Encontro removido com sucesso
 */
router.delete('/:id', (req, res, next) => {
    encontroController.remove(req, res).catch(next);
});
exports.default = router;
//# sourceMappingURL=encontro.routes.js.map