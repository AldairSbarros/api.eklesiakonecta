import { Request, Response } from 'express';
import { UsuarioService } from '../services/usuario.service';

export const UsuarioController = {
  async create(req: Request, res: Response) {
    const usuario = await UsuarioService.create(req.body);
    res.status(201).json({ id: usuario.id, nome: usuario.nome, email: usuario.email, igrejaId: usuario.igrejaId, role: usuario.role });
  },
  async list(_req: Request, res: Response) {
    const list = await UsuarioService.list();
    res.json(list.map(u => ({ id: u.id, nome: u.nome, email: u.email, igrejaId: u.igrejaId, role: u.role })));
  },
  async get(req: Request, res: Response) {
    const u = await UsuarioService.get(Number(req.params.id));
    res.json({ id: u.id, nome: u.nome, email: u.email, igrejaId: u.igrejaId, role: u.role });
  },
  async update(req: Request, res: Response) {
    const u = await UsuarioService.update(Number(req.params.id), req.body);
    res.json({ id: u.id, nome: u.nome, email: u.email, igrejaId: u.igrejaId, role: u.role });
  },
  async remove(req: Request, res: Response) {
    await UsuarioService.remove(Number(req.params.id));
    res.json({ message: 'Removido' });
  }
};
