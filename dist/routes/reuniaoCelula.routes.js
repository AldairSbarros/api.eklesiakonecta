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
const reuniaoController = __importStar(require("../controllers/reuniaoCelula.controller"));
const router = (0, express_1.Router)();
/**
 * @swagger
 * /reuniao-celula:
 *   post:
 *     summary: Cria uma nova reunião de célula
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Reunião criada com sucesso
 */
router.post('/', (req, res, next) => {
    Promise.resolve(reuniaoController.create(req, res)).catch(next);
});
/**
 * @swagger
 * /reuniao-celula:
 *   get:
 *     summary: Lista todas as reuniões de célula
 *     responses:
 *       200:
 *         description: Lista de reuniões retornada com sucesso
 */
router.get('/', (req, res, next) => {
    Promise.resolve(reuniaoController.list(req, res)).catch(next);
});
/**
 * @swagger
 * /reuniao-celula/{id}:
 *   get:
 *     summary: Busca uma reunião de célula por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reunião encontrada com sucesso
 */
router.get('/:id', (req, res, next) => {
    Promise.resolve(reuniaoController.get(req, res)).catch(next);
});
/**
 * @swagger
 * /reuniao-celula/{id}:
 *   put:
 *     summary: Atualiza uma reunião de célula
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
 *         description: Reunião atualizada com sucesso
 */
router.put('/:id', (req, res, next) => {
    Promise.resolve(reuniaoController.update(req, res)).catch(next);
});
/**
 * @swagger
 * /reuniao-celula/{id}:
 *   delete:
 *     summary: Remove uma reunião de célula
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Reunião removida com sucesso
 */
router.delete('/:id', (req, res, next) => {
    Promise.resolve(reuniaoController.remove(req, res)).catch(next);
});
exports.default = router;
//# sourceMappingURL=reuniaoCelula.routes.js.map