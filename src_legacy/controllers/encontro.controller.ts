import { Request, Response } from 'express';

// Controller stub para evitar erro de build. Implementação futura poderá substituir.
export async function create(req: Request, res: Response) {
  res.status(501).json({ message: 'Rota de criação de encontro não implementada.' });
}
export async function list(req: Request, res: Response) {
  res.status(200).json([]);
}
export async function get(req: Request, res: Response) {
  res.status(404).json({ message: 'Encontro não encontrado.' });
}
export async function update(req: Request, res: Response) {
  res.status(501).json({ message: 'Atualização de encontro não implementada.' });
}
export async function remove(req: Request, res: Response) {
  res.status(501).json({ message: 'Remoção de encontro não implementada.' });
}
