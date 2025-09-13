import { Request, Response } from 'express';
import { CelulaService } from '../services/celula.service';

export const CelulaController = {
  async create(req: Request, res: Response) {
    if (!req.body.congregacaoId && req.params.congregacaoId) {
      req.body.congregacaoId = Number(req.params.congregacaoId);
    }
    const c = await CelulaService.create(req.body);
    res.status(201).json(c);
  },
  async list(_req: Request, res: Response) { res.json(await CelulaService.list()); },
  async get(req: Request, res: Response) { res.json(await CelulaService.get(Number(req.params.id))); },
  async update(req: Request, res: Response) { res.json(await CelulaService.update(Number(req.params.id), req.body)); },
  async remove(req: Request, res: Response) { await CelulaService.remove(Number(req.params.id)); res.json({ message: 'Removido' }); },
  async listByCongregacao(req: Request, res: Response) { res.json(await CelulaService.listByCongregacao(Number(req.params.congregacaoId))); }
};
