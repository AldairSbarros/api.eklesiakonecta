import { Router } from 'express';
import { MembroController } from '../controllers/membro.controller';
import { asyncHandler } from '../utils/asyncHandler';

const r = Router();
r.post('/membros', asyncHandler(MembroController.create));
r.get('/membros', asyncHandler(MembroController.list));
r.get('/membros/:id', asyncHandler(MembroController.get));
r.put('/membros/:id', asyncHandler(MembroController.update));
r.delete('/membros/:id', asyncHandler(MembroController.remove));
r.get('/celulas/:celulaId/membros', asyncHandler(MembroController.listByCelula));
r.post('/celulas/:celulaId/membros', asyncHandler(MembroController.create));
// Discipulado
r.get('/membros/:membroId/etapas', asyncHandler(MembroController.listEtapas));
r.post('/membros/:membroId/etapas', asyncHandler(MembroController.registrarEtapa));
export default r;
