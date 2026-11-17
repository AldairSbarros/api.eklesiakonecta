import { Router } from 'express';
import { IgrejaController } from '../controllers/igreja.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';

const r = Router();
r.post('/igrejas', authMiddleware, requireRole('PASTOR', 'SUPERUSER'), asyncHandler(IgrejaController.create));
r.get('/igrejas', authMiddleware, asyncHandler(IgrejaController.list));
r.get('/igrejas/:id', authMiddleware, asyncHandler(IgrejaController.get));
r.put('/igrejas/:id', authMiddleware, asyncHandler(IgrejaController.update));
r.delete('/igrejas/:id', authMiddleware, requireRole('PASTOR', 'SUPERUSER'), asyncHandler(IgrejaController.remove));
// nested congregacoes
r.get('/igrejas/:igrejaId/congregacoes', authMiddleware, asyncHandler(IgrejaController.listCongregacoes));
r.post('/igrejas/:igrejaId/congregacoes', authMiddleware, asyncHandler(IgrejaController.createCongregacao));
export default r;
