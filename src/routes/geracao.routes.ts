import { Router } from 'express';
import { GeracaoController } from '../controllers/geracao.controller';
import { asyncHandler } from '../utils/asyncHandler';

const r = Router();
r.get('/geracoes', asyncHandler(GeracaoController.list));
r.get('/geracoes/:id', asyncHandler(GeracaoController.get));
r.get('/congregacoes/:congregacaoId/geracoes', asyncHandler(GeracaoController.listByCongregacao));
r.post('/congregacoes/:congregacaoId/geracoes', asyncHandler(GeracaoController.create));
r.put('/geracoes/:id', asyncHandler(GeracaoController.update));
r.delete('/geracoes/:id', asyncHandler(GeracaoController.remove));
export default r;
