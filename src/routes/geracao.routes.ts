import { Router } from 'express';
import { GeracaoController } from '../controllers/geracao.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';

const r = Router();
r.get('/geracoes', authMiddleware, asyncHandler(GeracaoController.list));
r.get('/geracoes/:id', authMiddleware, asyncHandler(GeracaoController.get));
r.get('/congregacoes/:congregacaoId/geracoes', authMiddleware, asyncHandler(GeracaoController.listByCongregacao));
r.post('/congregacoes/:congregacaoId/geracoes', authMiddleware, asyncHandler(GeracaoController.create));
r.put('/geracoes/:id', authMiddleware, asyncHandler(GeracaoController.update));
r.delete('/geracoes/:id', authMiddleware, asyncHandler(GeracaoController.remove));
export default r;
