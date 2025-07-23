"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const church_controller_1 = __importDefault(require("../controllers/church.controller"));
const autorizarRoles_1 = require("../middleware/autorizarRoles");
const autenticarJWT_1 = require("../middleware/autenticarJWT");
const validarCadastroIgreja_1 = require("../middleware/validarCadastroIgreja");
const handleValidation_1 = require("../middleware/handleValidation");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /church:
 *   post:
 *     summary: Cria uma nova igreja
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
 *         description: Igreja criada
 */
router.post("/", autenticarJWT_1.autenticarJWT, (0, autorizarRoles_1.autorizarRoles)(["ADMIN"]), validarCadastroIgreja_1.validarCadastroIgreja, handleValidation_1.handleValidation, church_controller_1.default.create);
/**
 * @swagger
 * /church/{id}:
 *   put:
 *     summary: Atualiza uma igreja
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
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Igreja atualizada
 */
router.put("/:id", autenticarJWT_1.autenticarJWT, (0, autorizarRoles_1.autorizarRoles)(["ADMIN"]), church_controller_1.default.update);
/**
 * @swagger
 * /church/{id}:
 *   delete:
 *     summary: Remove uma igreja
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Igreja removida
 */
router.delete("/:id", autenticarJWT_1.autenticarJWT, (0, autorizarRoles_1.autorizarRoles)(["ADMIN"]), church_controller_1.default.remove);
/**
 * @swagger
 * /church/{id}/localizacao:
 *   put:
 *     summary: Atualiza a localização da igreja
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
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Localização da igreja atualizada
 */
router.put("/:id/localizacao", autenticarJWT_1.autenticarJWT, (0, autorizarRoles_1.autorizarRoles)(["ADMIN"]), church_controller_1.default.atualizarLocalizacao);
/**
 * @swagger
 * /church:
 *   get:
 *     summary: Lista todas as igrejas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de igrejas
 */
router.get("/", autenticarJWT_1.autenticarJWT, church_controller_1.default.list);
/**
 * @swagger
 * /church/{id}:
 *   get:
 *     summary: Busca uma igreja por ID
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
 *         description: Igreja encontrada
 */
router.get("/:id", autenticarJWT_1.autenticarJWT, church_controller_1.default.get);
exports.default = router;
//# sourceMappingURL=church.routes.js.map