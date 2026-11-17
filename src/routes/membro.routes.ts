import { Router } from 'express';
import { MembroController } from '../controllers/membro.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';

const r = Router();
r.post('/membros', authMiddleware, asyncHandler(MembroController.create));
r.get('/membros', authMiddleware, asyncHandler(MembroController.list));
r.get('/membros/:id', authMiddleware, asyncHandler(MembroController.get));
r.put('/membros/:id', authMiddleware, asyncHandler(MembroController.update));
r.delete('/membros/:id', authMiddleware, asyncHandler(MembroController.remove));
r.get('/celulas/:celulaId/membros', authMiddleware, asyncHandler(MembroController.listByCelula));
r.post('/celulas/:celulaId/membros', authMiddleware, asyncHandler(MembroController.create));
// Discipulado
r.get('/membros/:membroId/etapas', authMiddleware, asyncHandler(MembroController.listEtapas));
r.post('/membros/:membroId/etapas', authMiddleware, asyncHandler(MembroController.registrarEtapa));
export default r;
