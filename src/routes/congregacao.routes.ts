import { Router } from 'express';
import { CongregacaoController } from '../controllers/congregacao.controller';
import { asyncHandler } from '../utils/asyncHandler';

const r = Router();
r.post('/congregacoes', asyncHandler(CongregacaoController.create));
r.get('/congregacoes', asyncHandler(CongregacaoController.list));
r.get('/congregacoes/:id', asyncHandler(CongregacaoController.get));
r.put('/congregacoes/:id', asyncHandler(CongregacaoController.update));
r.delete('/congregacoes/:id', asyncHandler(CongregacaoController.remove));
export default r;
