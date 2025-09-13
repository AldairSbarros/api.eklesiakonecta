
import { Router } from 'express';
import * as encontroController from '../controllers/encontro.controller';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

/**
 * @swagger
 * /encontros:
 *   post:
 *     summary: Cria um novo encontro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Encontro criado com sucesso
 */
router.post('/', asyncHandler(encontroController.create));

/**
 * @swagger
 * /encontros:
 *   get:
 *     summary: Lista todos os encontros
 *     responses:
 *       200:
 *         description: Lista de encontros retornada com sucesso
 */
router.get('/', asyncHandler(encontroController.list));

/**
 * @swagger
 * /encontros/{id}:
 *   get:
 *     summary: Busca um encontro por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Encontro encontrado com sucesso
 */
router.get('/:id', asyncHandler(encontroController.get));

/**
 * @swagger
 * /encontros/{id}:
 *   put:
 *     summary: Atualiza um encontro
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
 *         description: Encontro atualizado com sucesso
 */
router.put('/:id', asyncHandler(encontroController.update));

/**
 * @swagger
 * /encontros/{id}:
 *   delete:
 *     summary: Remove um encontro
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Encontro removido com sucesso
 */
router.delete('/:id', asyncHandler(encontroController.remove));

export default router;