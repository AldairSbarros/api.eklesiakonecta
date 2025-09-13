import { prisma } from '../core/prisma';
const prismaAny = prisma as any;
import { AppError } from '../utils/AppError';

export const CelulaService = {
  async create(data: { nome: string; congregacaoId: number; geracaoId?: number; diaSemana?: string; horario?: string; localReuniao?: string }) {
    const { nome, congregacaoId, geracaoId, diaSemana, horario, localReuniao } = data;
    if (!nome || !congregacaoId) throw new AppError('nome e congregacaoId são obrigatórios');
  const cong = await prismaAny.congregacao.findUnique({ where: { id: congregacaoId } });
    if (!cong) throw new AppError('congregacaoId inválido');
    if (geracaoId) {
  const ger = await prismaAny.geracao.findUnique({ where: { id: geracaoId } });
      if (!ger || ger.congregacaoId !== congregacaoId) throw new AppError('geracaoId inválido para esta congregação');
    }
  const existing = await prismaAny.celula.findFirst({ where: { congregacaoId, nome } });
    if (existing) throw new AppError('Nome já usado nesta congregação', 409);
  return prismaAny.celula.create({ data: { nome, congregacaoId, geracaoId, diaSemana, horario, localReuniao } });
  },
  list() { return prismaAny.celula.findMany({ orderBy: { id: 'asc' } }); },
  async get(id: number) {
  const item = await prismaAny.celula.findUnique({ where: { id } });
    if (!item) throw new AppError('Não encontrado', 404);
    return item;
  },
  async update(id: number, data: any) {
    const { nome, geracaoId, diaSemana, horario, localReuniao, liderMembroId, viceLiderMembroId, secretarioMembroId, tesoureiroMembroId, anfitriaoMembroId } = data;
    if (!nome) throw new AppError('nome é obrigatório');
  const celula = await prismaAny.celula.findUnique({ where: { id } });
    if (!celula) throw new AppError('Não encontrado', 404);
    let update: any = { nome };
    if (geracaoId !== undefined) {
      if (geracaoId === null) update.geracaoId = null; else {
  const ger = await prismaAny.geracao.findUnique({ where: { id: Number(geracaoId) } });
        if (!ger || ger.congregacaoId !== celula.congregacaoId) throw new AppError('geracaoId inválido para esta célula');
        update.geracaoId = Number(geracaoId);
      }
    }
    if (diaSemana !== undefined) update.diaSemana = diaSemana === null ? null : diaSemana;
    if (horario !== undefined) update.horario = horario === null ? null : horario;
    if (localReuniao !== undefined) update.localReuniao = localReuniao === null ? null : localReuniao;

    async function ensureMembro(membroId: any, field: string) {
      if (membroId === undefined) return;
      if (membroId === null) { update[field] = null; return; }
  const membro = await prismaAny.membro.findUnique({ where: { id: Number(membroId) } });
      if (!membro || membro.celulaId !== celula.id) throw new AppError(`${field} inválido: membro não pertence à célula`);
      update[field] = Number(membroId);
    }
    await ensureMembro(liderMembroId, 'liderMembroId');
    await ensureMembro(viceLiderMembroId, 'viceLiderMembroId');
    await ensureMembro(secretarioMembroId, 'secretarioMembroId');
    await ensureMembro(tesoureiroMembroId, 'tesoureiroMembroId');
    await ensureMembro(anfitriaoMembroId, 'anfitriaoMembroId');

  return prismaAny.celula.update({ where: { id }, data: update });
  },
  async remove(id: number) {
  try { await prismaAny.celula.delete({ where: { id } }); } catch { throw new AppError('Não encontrado', 404); }
  },
  listByCongregacao(congregacaoId: number) { return prismaAny.celula.findMany({ where: { congregacaoId }, orderBy: { id: 'asc' } }); }
};
