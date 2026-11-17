import { Router } from 'express';
import { CelulaController } from '../controllers/celula.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';

const r = Router();
r.post('/celulas', authMiddleware, asyncHandler(CelulaController.create));
r.get('/celulas', authMiddleware, asyncHandler(CelulaController.list));
r.get('/celulas/:id', authMiddleware, asyncHandler(CelulaController.get));
r.put('/celulas/:id', authMiddleware, asyncHandler(CelulaController.update));
r.delete('/celulas/:id', authMiddleware, asyncHandler(CelulaController.remove));
r.get('/congregacoes/:congregacaoId/celulas', authMiddleware, asyncHandler(CelulaController.listByCongregacao));
r.post('/congregacoes/:congregacaoId/celulas', authMiddleware, asyncHandler(CelulaController.create));
export default r;
