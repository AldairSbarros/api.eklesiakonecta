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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const offeringController = __importStar(require("../controllers/offering.controller"));
const uploadComprovante_middleware_1 = require("../middleware/uploadComprovante.middleware");
const autenticarJWT_1 = require("../middleware/autenticarJWT");
const autorizarRoles_1 = require("../middleware/autorizarRoles");
const client_1 = require("@prisma/client");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
/**
 * @swagger
 * /offering:
 *   post:
 *     summary: Cria uma nova oferta/dízimo
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Oferta criada com sucesso
 */
router.post("/", autenticarJWT_1.autenticarJWT, (0, autorizarRoles_1.autorizarRoles)(["admin", "tesoureiro"]), offeringController.create);
/**
 * @swagger
 * /offering:
 *   get:
 *     summary: Lista todas as ofertas/dízimos
 *     responses:
 *       200:
 *         description: Lista de ofertas retornada com sucesso
 */
router.get("/", offeringController.list);
/**
 * @swagger
 * /offering/{id}:
 *   get:
 *     summary: Busca uma oferta/dízimo por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Oferta encontrada com sucesso
 */
router.get("/:id", offeringController.get);
/**
 * @swagger
 * /offering/{id}:
 *   put:
 *     summary: Atualiza uma oferta/dízimo
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
 *         description: Oferta atualizada com sucesso
 */
router.put("/:id", offeringController.update);
/**
 * @swagger
 * /offering/{id}:
 *   delete:
 *     summary: Remove uma oferta/dízimo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Oferta removida com sucesso
 */
router.delete("/:id", offeringController.remove);
/**
 * @swagger
 * /offering/{id}/receipt-photo:
 *   put:
 *     summary: Atualiza o comprovante da oferta
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               comprovante:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Comprovante atualizado com sucesso
 */
router.put("/:id/receipt-photo", offeringController.updateReceiptPhoto);
/**
 * @swagger
 * /offering/{id}/receipt-photo:
 *   delete:
 *     summary: Remove o comprovante da oferta
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Comprovante removido com sucesso
 */
router.delete("/:id/receipt-photo", offeringController.deleteReceiptPhoto);
/**
 * @swagger
 * /offering/comprovantes/list:
 *   get:
 *     summary: Lista todos os comprovantes de ofertas
 *     responses:
 *       200:
 *         description: Lista de comprovantes retornada com sucesso
 */
router.get("/comprovantes/list", offeringController.listReceipts);
/**
 * @swagger
 * /offering/{id}/upload-comprovante:
 *   post:
 *     summary: Faz upload do comprovante de uma oferta
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               comprovante:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Comprovante enviado com sucesso
 *       400:
 *         description: Arquivo não enviado
 *       500:
 *         description: Erro ao enviar comprovante
 */
router.post("/:id/upload-comprovante", autenticarJWT_1.autenticarJWT, (0, autorizarRoles_1.autorizarRoles)(["admin", "tesoureiro"]), uploadComprovante_middleware_1.uploadComprovante.single("comprovante"), async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.file) {
            res.status(400).json({ error: "Arquivo não enviado" });
            return;
        }
        await prisma.offering.update({
            where: { id: Number(id) },
            data: { receiptPhoto: req.file.path.replace(/\\/g, "/") },
        });
        res.json({
            message: "Comprovante enviado com sucesso",
            path: req.file.path,
        });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao enviar comprovante" });
    }
});
/**
 * @swagger
 * /offering/{id}/download-comprovante:
 *   get:
 *     summary: Faz download do comprovante de uma oferta
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Download realizado com sucesso
 *       404:
 *         description: Comprovante não encontrado
 *       500:
 *         description: Erro ao baixar comprovante
 */
router.get("/:id/download-comprovante", autenticarJWT_1.autenticarJWT, (0, autorizarRoles_1.autorizarRoles)(["admin", "tesoureiro"]), async (req, res) => {
    try {
        const { id } = req.params;
        const offering = await prisma.offering.findUnique({
            where: { id: Number(id) },
        });
        if (!offering || !offering.receiptPhoto) {
            res.status(404).json({ error: "Comprovante não encontrado" });
            return;
        }
        const filePath = path_1.default.resolve(offering.receiptPhoto);
        if (!fs_1.default.existsSync(filePath)) {
            res.status(404).json({ error: "Arquivo não encontrado no servidor" });
            return;
        }
        res.download(filePath);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao baixar comprovante" });
    }
});
/**
 * @swagger
 * /offering/{id}/comprovante:
 *   delete:
 *     summary: Remove o comprovante de uma oferta
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comprovante excluído com sucesso
 *       404:
 *         description: Comprovante não encontrado
 */
router.delete("/:id/comprovante", autenticarJWT_1.autenticarJWT, (0, autorizarRoles_1.autorizarRoles)(["admin", "tesoureiro"]), async (req, res) => {
    const { id } = req.params;
    const offering = await prisma.offering.findUnique({
        where: { id: Number(id) },
    });
    if (!offering || !offering.receiptPhoto) {
        res.status(404).json({ error: "Comprovante não encontrado" });
        return;
    }
    const filePath = path_1.default.resolve(offering.receiptPhoto);
    if (fs_1.default.existsSync(filePath)) {
        fs_1.default.unlinkSync(filePath);
    }
    await prisma.offering.update({
        where: { id: Number(id) },
        data: { receiptPhoto: null },
    });
    res.json({ message: "Comprovante excluído com sucesso" });
    return;
});
exports.default = router;
//# sourceMappingURL=offering.routes.js.map