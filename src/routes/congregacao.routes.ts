import { Router } from 'express';
import { CongregacaoController } from '../controllers/congregacao.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';

const r = Router();
r.post('/congregacoes', authMiddleware, asyncHandler(CongregacaoController.create));
r.get('/congregacoes', authMiddleware, asyncHandler(CongregacaoController.list));
r.get('/congregacoes/:id', authMiddleware, asyncHandler(CongregacaoController.get));
r.put('/congregacoes/:id', authMiddleware, asyncHandler(CongregacaoController.update));
r.delete('/congregacoes/:id', authMiddleware, asyncHandler(CongregacaoController.remove));
export default r;
