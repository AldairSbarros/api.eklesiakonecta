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
const discipuladoController = __importStar(require("../controllers/discipulado.controller"));
const router = (0, express_1.Router)();
/**
 * @swagger
 * /discipulandos/{id}:
 *   get:
 *     summary: Lista os discipulandos de um discipulador
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de discipulandos retornada com sucesso
 */
router.get('/discipulandos/:id', discipuladoController.listarDiscipulandos); // lista discipulandos de um discipulador
/**
 * @swagger
 * /discipulandos:
 *   get:
 *     summary: Lista todos os discipulandos
 *     responses:
 *       200:
 *         description: Lista de todos os discipulandos retornada com sucesso
 */
router.get('/discipulandos', discipuladoController.listarTodosDiscipulandos); // lista todos
/**
 * @swagger
 * /discipulando:
 *   post:
 *     summary: Cria um novo discipulando
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Discipulando criado com sucesso
 */
router.post('/discipulando', discipuladoController.criarDiscipulando); // cria
/**
 * @swagger
 * /discipulando/{id}:
 *   put:
 *     summary: Atualiza um discipulando
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
 *         description: Discipulando atualizado com sucesso
 */
router.put('/discipulando/:id', discipuladoController.atualizarDiscipulando); // atualiza
/**
 * @swagger
 * /discipulando/{id}:
 *   delete:
 *     summary: Remove um discipulando
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Discipulando removido com sucesso
 */
router.delete('/discipulando/:id', discipuladoController.removerDiscipulando); // remove
/**
 * @swagger
 * /discipulador/{id}:
 *   put:
 *     summary: Troca o discipulador de um discipulando
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
 *         description: Discipulador trocado com sucesso
 */
router.put('/discipulador/:id', discipuladoController.trocarDiscipulador); // troca discipulador
exports.default = router;
//# sourceMappingURL=discipulado.routes.js.map