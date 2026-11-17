import { Router } from 'express';
import { UsuarioController } from '../controllers/usuario.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';

const r = Router();
r.post('/usuarios', authMiddleware, requireRole('PASTOR', 'SUPERUSER'), asyncHandler(UsuarioController.create));
r.get('/usuarios', authMiddleware, asyncHandler(UsuarioController.list));
r.get('/usuarios/:id', authMiddleware, asyncHandler(UsuarioController.get));
r.put('/usuarios/:id', authMiddleware, asyncHandler(UsuarioController.update));
r.delete('/usuarios/:id', authMiddleware, requireRole('PASTOR', 'SUPERUSER'), asyncHandler(UsuarioController.remove));
export default r;
