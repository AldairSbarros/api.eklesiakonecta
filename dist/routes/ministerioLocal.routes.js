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
const ministerioLocalController = __importStar(require("../controllers/ministerioLocal.controller"));
const router = (0, express_1.Router)();
/**
 * @swagger
 * /ministerio-local:
 *   post:
 *     summary: Cria um novo ministério local
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Ministério local criado com sucesso
 */
router.post('/', ministerioLocalController.create);
/**
 * @swagger
 * /ministerio-local:
 *   get:
 *     summary: Lista todos os ministérios locais
 *     responses:
 *       200:
 *         description: Lista de ministérios locais retornada com sucesso
 */
router.get('/', ministerioLocalController.list);
/**
 * @swagger
 * /ministerio-local/{id}:
 *   get:
 *     summary: Busca um ministério local por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ministério local encontrado com sucesso
 */
router.get('/:id', ministerioLocalController.get);
/**
 * @swagger
 * /ministerio-local/{id}:
 *   put:
 *     summary: Atualiza um ministério local
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
 *         description: Ministério local atualizado com sucesso
 */
router.put('/:id', ministerioLocalController.update);
/**
 * @swagger
 * /ministerio-local/{id}:
 *   delete:
 *     summary: Remove um ministério local
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Ministério local removido com sucesso
 */
router.delete('/:id', ministerioLocalController.remove);
exports.default = router;
//# sourceMappingURL=ministerioLocal.routes.js.map