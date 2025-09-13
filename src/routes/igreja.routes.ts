import { Router } from 'express';
import { IgrejaController } from '../controllers/igreja.controller';
import { asyncHandler } from '../utils/asyncHandler';

const r = Router();
r.post('/igrejas', asyncHandler(IgrejaController.create));
r.get('/igrejas', asyncHandler(IgrejaController.list));
r.get('/igrejas/:id', asyncHandler(IgrejaController.get));
r.put('/igrejas/:id', asyncHandler(IgrejaController.update));
r.delete('/igrejas/:id', asyncHandler(IgrejaController.remove));
// nested congregacoes
r.get('/igrejas/:igrejaId/congregacoes', asyncHandler(IgrejaController.listCongregacoes));
r.post('/igrejas/:igrejaId/congregacoes', asyncHandler(IgrejaController.createCongregacao));
export default r;
