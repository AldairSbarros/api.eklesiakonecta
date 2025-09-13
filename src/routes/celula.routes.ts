import { Router } from 'express';
import { CelulaController } from '../controllers/celula.controller';
import { asyncHandler } from '../utils/asyncHandler';

const r = Router();
r.post('/celulas', asyncHandler(CelulaController.create));
r.get('/celulas', asyncHandler(CelulaController.list));
r.get('/celulas/:id', asyncHandler(CelulaController.get));
r.put('/celulas/:id', asyncHandler(CelulaController.update));
r.delete('/celulas/:id', asyncHandler(CelulaController.remove));
r.get('/congregacoes/:congregacaoId/celulas', asyncHandler(CelulaController.listByCongregacao));
r.post('/congregacoes/:congregacaoId/celulas', asyncHandler(CelulaController.create));
export default r;
