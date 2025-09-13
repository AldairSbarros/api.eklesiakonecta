import { prisma } from '../core/prisma';
const prismaAny = prisma as any;
import { AppError } from '../utils/AppError';

export const MembroService = {
  async create(data: { nome: string; celulaId: number; email?: string; telefone?: string }) {
    const { nome, celulaId, email, telefone } = data;
    if (!nome || !celulaId) throw new AppError('nome e celulaId são obrigatórios');
  const cel = await prismaAny.celula.findUnique({ where: { id: celulaId } });
    if (!cel) throw new AppError('celulaId inválido');
    if (email) {
  const existing = await prismaAny.membro.findUnique({ where: { email } });
      if (existing) throw new AppError('Email já cadastrado', 409);
    }
  return prismaAny.membro.create({ data: { nome, celulaId, email, telefone } });
  },
  list() { return prismaAny.membro.findMany({ orderBy: { id: 'asc' } }); },
  async get(id: number) {
  const item = await prismaAny.membro.findUnique({ where: { id } });
    if (!item) throw new AppError('Não encontrado', 404);
    return item;
  },
  async update(id: number, data: { nome: string; telefone?: string; celulaId?: number }) {
    const { nome, telefone, celulaId } = data;
    if (!nome) throw new AppError('nome é obrigatório');
    let update: any = { nome, telefone };
    if (celulaId !== undefined) {
  const cel = await prismaAny.celula.findUnique({ where: { id: celulaId } });
      if (!cel) throw new AppError('celulaId inválido');
      update.celulaId = celulaId;
    }
  try { return await prismaAny.membro.update({ where: { id }, data: update }); }
    catch { throw new AppError('Não encontrado', 404); }
  },
  async remove(id: number) {
  try { await prismaAny.membro.delete({ where: { id } }); } catch { throw new AppError('Não encontrado', 404); }
  },
  listByCelula(celulaId: number) { return prismaAny.membro.findMany({ where: { celulaId }, orderBy: { id: 'asc' } }); }
};
