import { prisma } from '../core/prisma';
const prismaAny = prisma as any;
import { Prisma } from '@prisma/client';
import { AppError } from '../utils/AppError';
import path from 'path';

export const ReceitaService = {
  async nextNumero(congregacaoId: number) {
  const last = await prismaAny.receita.findFirst({ where: { congregacaoId }, orderBy: { numeroRecibo: 'desc' }, select: { numeroRecibo: true } });
    return (last?.numeroRecibo || 0) + 1;
  },
  async create(congregacaoId: number, payload: any, file?: Express.Multer.File) {
    const { tipo, valor, membroId, formaPagamento, cultoDescricao, data, observacao } = payload;
    if (!tipo || !valor || !formaPagamento) throw new AppError('tipo, valor, formaPagamento obrigatórios');
    const validTipos = ['DIZIMO','OFERTA','VOTO','OFERTA_ALCADA'];
    const validPag = ['ESPECIE','PIX'];
    if (!validTipos.includes(tipo)) throw new AppError('tipo inválido');
    if (!validPag.includes(formaPagamento)) throw new AppError('formaPagamento inválida');
  const cong = await prismaAny.congregacao.findUnique({ where: { id: congregacaoId } });
    if (!cong) throw new AppError('congregacaoId inválido');
  let membro: { id: number } | null = null;
    if (membroId) {
  membro = await prismaAny.membro.findUnique({ where: { id: Number(membroId) } });
      if (!membro) throw new AppError('membroId inválido');
    }
    const numeroRecibo = await this.nextNumero(congregacaoId);
    const fotoPath = file ? path.relative(process.cwd(), file.path) : undefined;
    const valorDecimal = new Prisma.Decimal(valor);
  return prismaAny.receita.create({ data: { congregacaoId, membroId: membro ? membro.id : null, tipo, formaPagamento, valor: valorDecimal, cultoDescricao, data: data ? new Date(data) : undefined, numeroRecibo, fotoPath, observacao } });
  },
  async list(congregacaoId: number, mes?: string) {
    let where: any = { congregacaoId };
    if (mes) {
      const [ano, m] = String(mes).split('-').map(Number);
      if (!ano || !m) throw new AppError('mes inválido');
      const start = new Date(Date.UTC(ano, m - 1, 1, 0, 0, 0));
      const end = new Date(Date.UTC(ano, m, 1, 0, 0, 0));
      where.data = { gte: start, lt: end };
    }
  return prismaAny.receita.findMany({ where, orderBy: [{ data: 'asc' }, { numeroRecibo: 'asc' }] });
  }
};
