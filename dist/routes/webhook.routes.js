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
const webhookController = __importStar(require("../controllers/webhook.controller"));
const router = (0, express_1.Router)();
// Helper para funções async
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
/**
 * @swagger
 * /webhook:
 *   post:
 *     summary: Cria um novo webhook
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
 *         description: Webhook criado com sucesso
 *       400:
 *         description: Schema não informado no header
 */
router.post('/', asyncHandler(async (req, res) => {
    const schema = req.headers['schema'];
    if (!schema)
        return res.status(400).json({ error: 'Schema não informado no header.' });
    const webhook = await webhookController.createWebhook(schema, req.body);
    res.status(201).json(webhook);
}));
/**
 * @swagger
 * /webhook:
 *   get:
 *     summary: Lista todos os webhooks
 *     parameters:
 *       - in: header
 *         name: schema
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de webhooks retornada com sucesso
 *       400:
 *         description: Schema não informado no header
 */
router.get('/', asyncHandler(async (req, res) => {
    const schema = req.headers['schema'];
    if (!schema)
        return res.status(400).json({ error: 'Schema não informado no header.' });
    const webhooks = await webhookController.listWebhooks(schema);
    res.json(webhooks);
}));
/**
 * @swagger
 * /webhook/{id}:
 *   get:
 *     summary: Busca um webhook por ID
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
 *         description: Webhook encontrado com sucesso
 *       400:
 *         description: Schema não informado no header
 *       404:
 *         description: Webhook não encontrado
 */
router.get('/:id', asyncHandler(async (req, res) => {
    const schema = req.headers['schema'];
    const { id } = req.params;
    if (!schema)
        return res.status(400).json({ error: 'Schema não informado no header.' });
    const webhook = await webhookController.getWebhook(schema, Number(id));
    if (!webhook)
        return res.status(404).json({ error: 'Webhook não encontrado.' });
    res.json(webhook);
}));
/**
 * @swagger
 * /webhook/{id}:
 *   put:
 *     summary: Atualiza um webhook
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
 *         description: Webhook atualizado com sucesso
 *       400:
 *         description: Schema não informado no header
 */
router.put('/:id', asyncHandler(async (req, res) => {
    const schema = req.headers['schema'];
    const { id } = req.params;
    if (!schema)
        return res.status(400).json({ error: 'Schema não informado no header.' });
    const webhook = await webhookController.updateWebhook(schema, Number(id), req.body);
    res.json(webhook);
}));
/**
 * @swagger
 * /webhook/{id}:
 *   delete:
 *     summary: Remove um webhook
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
 *         description: Webhook removido com sucesso
 *       400:
 *         description: Schema não informado no header
 */
router.delete('/:id', asyncHandler(async (req, res) => {
    const schema = req.headers['schema'];
    const { id } = req.params;
    if (!schema)
        return res.status(400).json({ error: 'Schema não informado no header.' });
    await webhookController.deleteWebhook(schema, Number(id));
    res.json({ message: 'Webhook removido com sucesso.' });
}));
//# sourceMappingURL=webhook.routes.js.map