import { Router } from 'express';
import { UsuarioController } from '../controllers/usuario.controller';
import { asyncHandler } from '../utils/asyncHandler';

const r = Router();
r.post('/usuarios', asyncHandler(UsuarioController.create));
r.get('/usuarios', asyncHandler(UsuarioController.list));
r.get('/usuarios/:id', asyncHandler(UsuarioController.get));
r.put('/usuarios/:id', asyncHandler(UsuarioController.update));
r.delete('/usuarios/:id', asyncHandler(UsuarioController.remove));
export default r;
