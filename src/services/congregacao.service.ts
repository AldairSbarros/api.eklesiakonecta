import { prisma } from '../core/prisma';
const prismaAny = prisma as any;
import { AppError } from '../utils/AppError';

export const CongregacaoService = {
  async create(data: { nome: string; igrejaId: number }) {
    const { nome, igrejaId } = data;
    if (!nome || !igrejaId) throw new AppError('nome e igrejaId são obrigatórios');
    const igreja = await prismaAny.igreja.findUnique({ where: { id: igrejaId } });
    if (!igreja) throw new AppError('igrejaId inválido');
    const existing = await prismaAny.congregacao.findFirst({ where: { igrejaId, nome } });
    if (existing) throw new AppError('Nome já usado para esta igreja', 409);
    return prismaAny.congregacao.create({ data: { nome, igrejaId } });
  },
  list() { return prismaAny.congregacao.findMany({ orderBy: { id: 'asc' } }); },
  async get(id: number) {
    const item = await prismaAny.congregacao.findUnique({ where: { id } });
    if (!item) throw new AppError('Não encontrado', 404);
    return item;
  },
  async update(id: number, nome: string) {
    if (!nome) throw new AppError('nome é obrigatório');
    try { return await prismaAny.congregacao.update({ where: { id }, data: { nome } }); }
    catch { throw new AppError('Não encontrado', 404); }
  },
  async remove(id: number) {
    try { await prismaAny.congregacao.delete({ where: { id } }); } catch { throw new AppError('Não encontrado', 404); }
  }
};
