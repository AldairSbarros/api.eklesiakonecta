import { Router } from 'express';
import { CadastroController } from '../controllers/cadastro.controller';
import { asyncHandler } from '../utils/asyncHandler';

const r = Router();
r.post('/cadastro-inicial', asyncHandler(CadastroController.cadastroInicial));
export default r;
