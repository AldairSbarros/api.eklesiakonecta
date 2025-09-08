"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
/**
 * @swagger
 * /doc:
 *   get:
 *     summary: Retorna a documentação em Markdown
 *     responses:
 *       200:
 *         description: Documentação retornada com sucesso
 *         content:
 *           text/markdown:
 *             schema:
 *               type: string
 *       500:
 *         description: Documentação não encontrada
 */
router.get('/', (_req, res) => {
    const docPath = path_1.default.resolve(__dirname, '../../DOCUMENTACAO.md');
    fs_1.default.readFile(docPath, 'utf8', (err, data) => {
        if (err)
            return res.status(500).send('Documentação não encontrada.');
        res.type('text/markdown').send(data);
    });
});
exports.default = router;
//# sourceMappingURL=doc.routes.js.map