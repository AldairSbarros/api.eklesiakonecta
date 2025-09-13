import { prisma } from '../core/prisma';
const prismaAny = prisma as any;
import { AppError } from '../utils/AppError';

export const GeracaoService = {
  list() { return prismaAny.geracao.findMany({ orderBy: { id: 'asc' } }); },
  get(id: number) { return prismaAny.geracao.findUnique({ where: { id } }); },
  listByCongregacao(congregacaoId: number) {
  return prismaAny.geracao.findMany({ where: { congregacaoId }, orderBy: { id: 'asc' } });
  },
  async create(congregacaoId: number, data: { nome: string; liderGeracaoMembroId?: number }) {
    const { nome, liderGeracaoMembroId } = data;
    if (!nome) throw new AppError('nome é obrigatório');
  const cong = await prismaAny.congregacao.findUnique({ where: { id: congregacaoId } });
    if (!cong) throw new AppError('congregacaoId inválido');
  const exists = await prismaAny.geracao.findFirst({ where: { congregacaoId, nome } });
    if (exists) throw new AppError('Nome já usado nesta congregação', 409);
    let extra: any = {};
    if (liderGeracaoMembroId) {
  const m = await prismaAny.membro.findUnique({ where: { id: liderGeracaoMembroId } });
      if (!m) throw new AppError('liderGeracaoMembroId inválido');
  const cel = await prismaAny.celula.findUnique({ where: { id: m.celulaId } });
      if (!cel || cel.congregacaoId !== congregacaoId) throw new AppError('Membro não pertence à congregação desta geração');
      extra.liderGeracaoMembroId = liderGeracaoMembroId;
    }
  return prismaAny.geracao.create({ data: { nome, congregacaoId, ...extra } });
  },
  async update(id: number, data: { nome: string; liderGeracaoMembroId?: number|null }) {
    const { nome, liderGeracaoMembroId } = data;
    if (!nome) throw new AppError('nome é obrigatório');
  const ger = await prismaAny.geracao.findUnique({ where: { id } });
    if (!ger) throw new AppError('Não encontrado', 404);
    let update: any = { nome };
    if (liderGeracaoMembroId !== undefined) {
      if (liderGeracaoMembroId === null) update.liderGeracaoMembroId = null; else {
  const m = await prismaAny.membro.findUnique({ where: { id: liderGeracaoMembroId } });
        if (!m) throw new AppError('liderGeracaoMembroId inválido');
  const cel = await prismaAny.celula.findUnique({ where: { id: m.celulaId } });
        if (!cel || cel.congregacaoId !== ger.congregacaoId) throw new AppError('Membro não pertence à congregação desta geração');
        update.liderGeracaoMembroId = liderGeracaoMembroId;
      }
    }
  return prismaAny.geracao.update({ where: { id }, data: update });
  },
  async remove(id: number) {
  try { await prismaAny.geracao.delete({ where: { id } }); } catch { throw new AppError('Não encontrado', 404); }
  }
};
