import { Request, Response } from 'express';
import { IgrejaService } from '../services/igreja.service';

export const IgrejaController = {
  async create(req: Request, res: Response) { const item = await IgrejaService.create(req.body.nome); res.status(201).json(item); },
  async list(_req: Request, res: Response) { res.json(await IgrejaService.list()); },
  async get(req: Request, res: Response) { res.json(await IgrejaService.get(Number(req.params.id))); },
  async update(req: Request, res: Response) { res.json(await IgrejaService.update(Number(req.params.id), req.body.nome)); },
  async remove(req: Request, res: Response) { await IgrejaService.remove(Number(req.params.id)); res.json({ message: 'Removido' }); },
  async listCongregacoes(req: Request, res: Response) { res.json(await IgrejaService.congregacoesByIgreja(Number(req.params.igrejaId))); },
  async createCongregacao(req: Request, res: Response) { const created = await IgrejaService.createCongregacao(Number(req.params.igrejaId), req.body.nome); res.status(201).json(created); }
};
