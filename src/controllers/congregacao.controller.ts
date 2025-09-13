import { Request, Response } from 'express';
import { CongregacaoService } from '../services/congregacao.service';

export const CongregacaoController = {
  async create(req: Request, res: Response) { const item = await CongregacaoService.create(req.body); res.status(201).json(item); },
  async list(_req: Request, res: Response) { res.json(await CongregacaoService.list()); },
  async get(req: Request, res: Response) { res.json(await CongregacaoService.get(Number(req.params.id))); },
  async update(req: Request, res: Response) { res.json(await CongregacaoService.update(Number(req.params.id), req.body.nome)); },
  async remove(req: Request, res: Response) { await CongregacaoService.remove(Number(req.params.id)); res.json({ message: 'Removido' }); }
};
