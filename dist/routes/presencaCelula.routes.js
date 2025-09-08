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
const presencaController = __importStar(require("../controllers/presencaCelula.controller"));
const router = (0, express_1.Router)();
/**
 * @swagger
 * /presenca-celula:
 *   post:
 *     summary: Cria uma nova presença de célula
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Presença criada com sucesso
 */
router.post('/', presencaController.create);
/**
 * @swagger
 * /presenca-celula:
 *   get:
 *     summary: Lista todas as presenças de célula
 *     responses:
 *       200:
 *         description: Lista de presenças retornada com sucesso
 */
router.get('/', presencaController.list);
/**
 * @swagger
 * /presenca-celula/{id}:
 *   get:
 *     summary: Busca uma presença de célula por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Presença encontrada com sucesso
 */
router.get('/:id', presencaController.get);
/**
 * @swagger
 * /presenca-celula/{id}:
 *   put:
 *     summary: Atualiza uma presença de célula
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
 *         description: Presença atualizada com sucesso
 */
router.put('/:id', presencaController.update);
/**
 * @swagger
 * /presenca-celula/{id}:
 *   delete:
 *     summary: Remove uma presença de célula
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Presença removida com sucesso
 */
router.delete('/:id', presencaController.remove);
exports.default = router;
//# sourceMappingURL=presencaCelula.routes.js.map