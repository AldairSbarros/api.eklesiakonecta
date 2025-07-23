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
const ministerioService = __importStar(require("../services/ministerio.service"));
const autenticarJWT_1 = require("../middleware/autenticarJWT");
const router = (0, express_1.Router)();
// Handler para funções async
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
/**
 * @swagger
 * /ministerios:
 *   post:
 *     summary: Cria um novo ministério
 *     security:
 *       - bearerAuth: []
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
 *         description: Ministério criado com sucesso
 *       400:
 *         description: Schema não informado no header
 */
router.post('/', autenticarJWT_1.autenticarJWT, asyncHandler(async (req, res) => {
    const schema = req.headers['schema'];
    if (!schema)
        return res.status(400).json({ error: 'Schema não informado no header.' });
    const ministerio = await ministerioService.createMinisterio(schema, req.body);
    res.status(201).json(ministerio);
}));
/**
 * @swagger
 * /ministerios:
 *   get:
 *     summary: Lista todos os ministérios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: schema
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de ministérios retornada com sucesso
 *       400:
 *         description: Schema não informado no header
 */
router.get('/', autenticarJWT_1.autenticarJWT, asyncHandler(async (req, res) => {
    const schema = req.headers['schema'];
    if (!schema)
        return res.status(400).json({ error: 'Schema não informado no header.' });
    const ministerios = await ministerioService.listMinisterios(schema);
    res.json(ministerios);
}));
/**
 * @swagger
 * /ministerios/{id}:
 *   get:
 *     summary: Busca um ministério por ID
 *     security:
 *       - bearerAuth: []
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
 *         description: Ministério encontrado com sucesso
 *       400:
 *         description: Schema não informado no header
 *       404:
 *         description: Ministério não encontrado
 */
router.get('/:id', autenticarJWT_1.autenticarJWT, asyncHandler(async (req, res) => {
    const schema = req.headers['schema'];
    if (!schema)
        return res.status(400).json({ error: 'Schema não informado no header.' });
    const { id } = req.params;
    const ministerio = await ministerioService.getMinisterio(schema, Number(id));
    if (!ministerio)
        return res.status(404).json({ error: 'Ministério não encontrado.' });
    res.json(ministerio);
}));
/**
 * @swagger
 * /ministerios/{id}:
 *   put:
 *     summary: Atualiza um ministério
 *     security:
 *       - bearerAuth: []
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
 *         description: Ministério atualizado com sucesso
 *       400:
 *         description: Schema não informado no header
 */
router.put('/:id', autenticarJWT_1.autenticarJWT, asyncHandler(async (req, res) => {
    const schema = req.headers['schema'];
    if (!schema)
        return res.status(400).json({ error: 'Schema não informado no header.' });
    const { id } = req.params;
    const ministerio = await ministerioService.updateMinisterio(schema, Number(id), req.body);
    res.json(ministerio);
}));
/**
 * @swagger
 * /ministerios/{id}:
 *   delete:
 *     summary: Remove um ministério
 *     security:
 *       - bearerAuth: []
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
 *         description: Ministério removido com sucesso
 *       400:
 *         description: Schema não informado no header
 */
router.delete('/:id', autenticarJWT_1.autenticarJWT, asyncHandler(async (req, res) => {
    const schema = req.headers['schema'];
    if (!schema)
        return res.status(400).json({ error: 'Schema não informado no header.' });
    const { id } = req.params;
    await ministerioService.deleteMinisterio(schema, Number(id));
    res.json({ message: 'Ministério removido com sucesso.' });
}));
exports.default = router;
//# sourceMappingURL=ministerio.routes.js.map