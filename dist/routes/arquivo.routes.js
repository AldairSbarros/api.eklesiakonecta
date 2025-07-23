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
const arquivoController = __importStar(require("../controllers/arquivo.controller"));
const router = (0, express_1.Router)();
// Handler para funções async
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
/**
 * @swagger
 * /arquivos:
 *   post:
 *     summary: Cria um novo arquivo
 *     responses:
 *       201:
 *         description: Arquivo criado
 */
router.post('/', asyncHandler(arquivoController.create));
/**
 * @swagger
 * /arquivos:
 *   get:
 *     summary: Lista todos os arquivos
 *     responses:
 *       200:
 *         description: Lista de arquivos
 */
router.get('/', asyncHandler(arquivoController.list));
/**
 * @swagger
 * /arquivos/{id}:
 *   get:
 *     summary: Busca um arquivo por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Arquivo encontrado
 */
router.get('/:id', asyncHandler(arquivoController.get));
/**
 * @swagger
 * /arquivos/{id}:
 *   put:
 *     summary: Atualiza um arquivo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Arquivo atualizado
 */
router.put('/:id', asyncHandler(arquivoController.update));
/**
 * @swagger
 * /arquivos/{id}:
 *   delete:
 *     summary: Remove um arquivo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Arquivo removido
 */
router.delete('/:id', asyncHandler(arquivoController.remove));
exports.default = router;
//# sourceMappingURL=arquivo.routes.js.map