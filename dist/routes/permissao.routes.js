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
const permissaoController = __importStar(require("../controllers/permissao.controller"));
const router = (0, express_1.Router)();
// Handler para funções async
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
/**
 * @swagger
 * /permissao:
 *   post:
 *     summary: Cria uma nova permissão
 *     parameters:
 *       - in: header
 *         name: schema
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
 *       201:
 *         description: Permissão criada com sucesso
 *       400:
 *         description: Schema não informado no header
 */
router.post('/', asyncHandler(async (req, res) => {
    const schema = req.headers['schema'];
    if (!schema) {
        return res.status(400).json({ error: 'Schema não informado no header.' });
    }
    const result = await permissaoController.createPermissao(schema, req.body);
    res.status(201).json(result);
}));
/**
 * @swagger
 * /permissao:
 *   get:
 *     summary: Lista todas as permissões
 *     parameters:
 *       - in: header
 *         name: schema
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de permissões retornada com sucesso
 *       400:
 *         description: Schema não informado no header
 */
router.get('/', asyncHandler(async (req, res) => {
    const schema = req.headers['schema'];
    if (!schema) {
        return res.status(400).json({ error: 'Schema não informado no header.' });
    }
    const permissoes = await permissaoController.listPermissoes(schema);
    res.json(permissoes);
}));
/**
 * @swagger
 * /permissao/{id}:
 *   get:
 *     summary: Busca uma permissão por ID
 *     parameters:
 *       - in: header
 *         name: schema
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Permissão encontrada com sucesso
 *       400:
 *         description: Schema não informado no header
 *       404:
 *         description: Permissão não encontrada
 */
router.get('/:id', asyncHandler(async (req, res) => {
    const schema = req.headers['schema'];
    const { id } = req.params;
    if (!schema) {
        return res.status(400).json({ error: 'Schema não informado no header.' });
    }
    const permissao = await permissaoController.getPermissao(schema, Number(id));
    if (!permissao) {
        return res.status(404).json({ error: 'Permissão não encontrada.' });
    }
    res.json(permissao);
}));
/**
 * @swagger
 * /permissao/{id}:
 *   put:
 *     summary: Atualiza uma permissão
 *     parameters:
 *       - in: header
 *         name: schema
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Permissão atualizada com sucesso
 *       400:
 *         description: Schema não informado no header
 */
router.put('/:id', asyncHandler(async (req, res) => {
    const schema = req.headers['schema'];
    const { id } = req.params;
    if (!schema) {
        return res.status(400).json({ error: 'Schema não informado no header.' });
    }
    const permissao = await permissaoController.updatePermissao(schema, Number(id), req.body);
    res.json(permissao);
}));
/**
 * @swagger
 * /permissao/{id}:
 *   delete:
 *     summary: Remove uma permissão
 *     parameters:
 *       - in: header
 *         name: schema
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Permissão removida com sucesso
 *       400:
 *         description: Schema não informado no header
 */
router.delete('/:id', asyncHandler(async (req, res) => {
    const schema = req.headers['schema'];
    const { id } = req.params;
    if (!schema) {
        return res.status(400).json({ error: 'Schema não informado no header.' });
    }
    await permissaoController.deletePermissao(schema, Number(id));
    res.json({ message: 'Permissão removida com sucesso.' });
}));
exports.default = router;
//# sourceMappingURL=permissao.routes.js.map