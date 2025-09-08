"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMembro_controller_1 = require("../controllers/authMembro.controller");
const router = (0, express_1.Router)();
// Helper to wrap async route handlers and forward errors to Express
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
/**
 * @swagger
 * /auth/login-membro:
 *   post:
 *     summary: Autentica um membro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Membro autenticado com sucesso
 */
router.post('/login-membro', asyncHandler(authMembro_controller_1.loginMembro));
exports.default = router;
//# sourceMappingURL=authMembro.routes.js.map