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
const visitanteController = __importStar(require("../controllers/visitanteCelula.controller"));
const router = (0, express_1.Router)();
/**
 * @swagger
 * /visitante:
 *   post:
 *     summary: Cria um novo visitante de célula
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Visitante criado com sucesso
 */
router.post('/', async (req, res, next) => {
    try {
        await visitanteController.create(req, res);
    }
    catch (err) {
        next(err);
    }
});
/**
 * @swagger
 * /visitante:
 *   get:
 *     summary: Lista todos os visitantes de célula
 *     responses:
 *       200:
 *         description: Lista de visitantes retornada com sucesso
 */
router.get('/', async (req, res, next) => {
    try {
        await visitanteController.list(req, res);
    }
    catch (err) {
        next(err);
    }
});
/**
 * @swagger
 * /visitante/{id}:
 *   get:
 *     summary: Busca um visitante de célula por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Visitante encontrado com sucesso
 */
router.get('/:id', async (req, res, next) => {
    try {
        await visitanteController.get(req, res);
    }
    catch (err) {
        next(err);
    }
});
/**
 * @swagger
 * /visitante/{id}:
 *   put:
 *     summary: Atualiza um visitante de célula
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
 *         description: Visitante atualizado com sucesso
 */
router.put('/:id', async (req, res, next) => {
    try {
        await visitanteController.update(req, res);
    }
    catch (err) {
        next(err);
    }
});
/**
 * @swagger
 * /visitante/{id}:
 *   delete:
 *     summary: Remove um visitante de célula
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Visitante removido com sucesso
 */
router.delete('/:id', async (req, res, next) => {
    try {
        await visitanteController.remove(req, res);
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=visitante.routes.js.map