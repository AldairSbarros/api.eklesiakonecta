import { prisma } from '../core/prisma';
// Nota: uso de prismaAny (any) para isolar pontos ainda sem tipos fortes enquanto demais services são tipados.
const prismaAny = prisma as any;
import { AppError } from '../utils/AppError';

export interface CreateIgrejaInput { nome: string }
export const IgrejaService = {
  async create(nome: string) {
    if (!nome) throw new AppError('nome é obrigatório');
  const exists = await prismaAny.igreja.findUnique({ where: { nome } });
    if (exists) throw new AppError('Nome já cadastrado', 409);
  return prismaAny.igreja.create({ data: { nome } });
  },
  list() { return prismaAny.igreja.findMany({ orderBy: { id: 'asc' } }); },
  async get(id: number) {
  const item = await prismaAny.igreja.findUnique({ where: { id } });
    if (!item) throw new AppError('Não encontrado', 404);
    return item;
  },
  async update(id: number, nome: string) {
    if (!nome) throw new AppError('nome é obrigatório');
  try { return await prismaAny.igreja.update({ where: { id }, data: { nome } }); }
    catch { throw new AppError('Não encontrado', 404); }
  },
  async remove(id: number) {
  try { await prismaAny.igreja.delete({ where: { id } }); } catch { throw new AppError('Não encontrado', 404); }
  },
  congregacoesByIgreja(igrejaId: number) {
  return prismaAny.congregacao.findMany({ where: { igrejaId }, orderBy: { id: 'asc' } });
  },
  async createCongregacao(igrejaId: number, nome: string) {
    if (!nome) throw new AppError('nome é obrigatório');
  const igreja = await prismaAny.igreja.findUnique({ where: { id: igrejaId } });
    if (!igreja) throw new AppError('igrejaId inválido');
  const existing = await prismaAny.congregacao.findFirst({ where: { igrejaId, nome } });
    if (existing) throw new AppError('Nome já usado para esta igreja', 409);
  return prismaAny.congregacao.create({ data: { nome, igrejaId } });
  }
};
