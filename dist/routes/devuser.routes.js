"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const devuser_controller_1 = require("../controllers/devuser.controller");
const autenticarJWT_1 = require("../middleware/autenticarJWT");
const onlySuperUser_1 = require("../middleware/onlySuperUser");
const asyncHandler_1 = require("../middleware/asyncHandler");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /devuser:
 *   post:
 *     summary: Cria um novo DevUser (apenas superusuário)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       201:
 *         description: DevUser criado com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Permissão insuficiente
 */
router.post('/devuser', autenticarJWT_1.autenticarJWT, onlySuperUser_1.onlySuperUser, (0, asyncHandler_1.asyncHandler)(devuser_controller_1.createDevUser));
exports.default = router;
//# sourceMappingURL=devuser.routes.js.map