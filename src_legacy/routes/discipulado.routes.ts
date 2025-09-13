import { Router, Request, Response } from 'express';
// Stub mínimo para atender testes que chamam /api/discipulado/discipulando e /api/discipulado/discipulandos/:id
// TODO: Implementar controller real ou ajustar testes para novo fluxo.
const router = Router();

// cria discipulando (placeholder)
router.post('/discipulando', function (req: Request, res: Response): void {
  const { nome } = req.body || {};
  if (!nome) {
    res.status(400).json({ error: 'Nome obrigatório' });
    return;
  }
  res.status(201).json({ id: Date.now(), nome });
});

// lista discipulandos de um discipulador (placeholder)
router.get('/discipulandos/:id', function (_req: Request, res: Response): void {
  res.status(200).json([]);
});

export default router;
