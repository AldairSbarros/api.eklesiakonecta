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
const vendaController = __importStar(require("../controllers/venda.controller"));
const router = (0, express_1.Router)();
/**
 * @swagger
 * /venda:
 *   post:
 *     summary: Cria uma nova venda
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Venda criada com sucesso
 */
router.post('/', async (req, res, next) => {
    try {
        await vendaController.create(req, res);
    }
    catch (err) {
        next(err);
    }
});
/**
 * @swagger
 * /venda:
 *   get:
 *     summary: Lista todas as vendas
 *     responses:
 *       200:
 *         description: Lista de vendas retornada com sucesso
 */
router.get('/', async (req, res, next) => {
    try {
        await vendaController.list(req, res);
    }
    catch (err) {
        next(err);
    }
});
/**
 * @swagger
 * /venda/{id}:
 *   put:
 *     summary: Atualiza uma venda
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
 *         description: Venda atualizada com sucesso
 */
router.put('/:id', async (req, res, next) => {
    try {
        await vendaController.update(req, res);
    }
    catch (err) {
        next(err);
    }
});
/**
 * @swagger
 * /venda/{id}:
 *   delete:
 *     summary: Remove uma venda
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Venda removida com sucesso
 */
router.delete('/:id', async (req, res, next) => {
    try {
        await vendaController.remove(req, res);
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=venda.routes.js.map