import { Request, Response } from 'express';
import { MembroService } from '../services/membro.service';
import { DiscipuladoService } from '../services/discipulado.service';

export const MembroController = {
  async create(req: Request, res: Response) {
    // Suporta rota nested /celulas/:celulaId/membros
    if (!req.body.celulaId && req.params.celulaId) {
      req.body.celulaId = Number(req.params.celulaId);
    }
    const m = await MembroService.create(req.body);
    res.status(201).json(m);
  },
  async list(_req: Request, res: Response) { res.json(await MembroService.list()); },
  async get(req: Request, res: Response) { res.json(await MembroService.get(Number(req.params.id))); },
  async update(req: Request, res: Response) { res.json(await MembroService.update(Number(req.params.id), req.body)); },
  async remove(req: Request, res: Response) { await MembroService.remove(Number(req.params.id)); res.json({ message: 'Removido' }); },
  async listByCelula(req: Request, res: Response) { res.json(await MembroService.listByCelula(Number(req.params.celulaId))); },
  // Discipulado
  async listEtapas(req: Request, res: Response) { res.json(await DiscipuladoService.listEtapas(Number(req.params.membroId))); },
  async registrarEtapa(req: Request, res: Response) { const created = await DiscipuladoService.registrarEtapa(Number(req.params.membroId), req.body); res.status(201).json(created); }
};
