"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const login_controller_1 = require("../controllers/login.controller");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra um novo usuário
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
 *         description: Usuário registrado com sucesso
 */
router.post('/register', (req, res, next) => {
    Promise.resolve((0, auth_controller_1.register)(req, res)).catch(next);
});
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autentica um usuário
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
 *         description: Usuário autenticado com sucesso
 */
router.post('/login', (req, res, next) => {
    Promise.resolve((0, auth_controller_1.login)(req, res)).catch(next);
});
/**
 * @swagger
 * /auth/verify:
 *   get:
 *     summary: Verifica se o token JWT é válido
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token válido
 *       401:
 *         description: Token inválido ou expirado
 */
router.get('/verify', (req, res, next) => {
    Promise.resolve((0, login_controller_1.verificarToken)(req, res)).catch(next);
});
exports.default = router;
//# sourceMappingURL=auth.routes.js.map