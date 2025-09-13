import { Request, Response } from 'express';
import { GeracaoService } from '../services/geracao.service';

export const GeracaoController = {
  async list(_req: Request, res: Response) { res.json(await GeracaoService.list()); },
  async get(req: Request, res: Response) { const g = await GeracaoService.get(Number(req.params.id)); if(!g) return res.status(404).json({ message: 'Não encontrado'}); res.json(g); },
  async listByCongregacao(req: Request, res: Response) { res.json(await GeracaoService.listByCongregacao(Number(req.params.congregacaoId))); },
  async create(req: Request, res: Response) { const created = await GeracaoService.create(Number(req.params.congregacaoId), req.body); res.status(201).json(created); },
  async update(req: Request, res: Response) { const upd = await GeracaoService.update(Number(req.params.id), req.body); res.json(upd); },
  async remove(req: Request, res: Response) { await GeracaoService.remove(Number(req.params.id)); res.json({ message: 'Removido' }); }
};
