import { getPrisma } from "../utils/prismaDynamic";
import { Request, Response } from 'express';
import { extractSchema, validateSchema } from '../utils/headerUtils';

export async function registrarLog(
  schema: string,
  {
    usuarioId,
    acao,
    detalhes,
    ip
  }: {
    usuarioId?: number;
    acao: string;
    detalhes?: string;
    ip?: string;
  }
) {
  const prisma = getPrisma(schema);
  await prisma.logAcesso.create({
    data: { usuarioId, acao, detalhes, ip }
  });
}

///////================MOCK==================////////

export function relatorioMensal(req: Request, res: Response) {
  return res.status(501).json({ error: 'Relatório mensal não implementado.' });
}
export function relatorioMensalPDF(req: Request, res: Response) {
  return res.status(501).json({ error: 'Relatório mensal PDF não implementado.' });
}

export async function relatorioCelulas(req: Request, res: Response) {
  return res.status(200).json({ message: 'Relatório de células OK' });
}

export async function relatorioFinanceiro(req: Request, res: Response) {
  try {
    const schema = extractSchema(req);
    const validationError = validateSchema(schema);
    console.log('[RELATORIO FINANCEIRO] HEADER schema:', schema);
    if (validationError.error) {
      console.error('[RELATORIO FINANCEIRO] ERRO: Schema não informado no header.');
      return res.status(400).json(validationError);
    }
    const { getPrismaTenant } = require('../services/church.service');
    const prisma = getPrismaTenant(schema!);
    // Busca todas as offerings do schema
    const offerings = await prisma.offering.findMany();
    const totalOfferings = offerings.reduce((acc: number, o: any) => acc + (o.value || 0), 0);
    await prisma.$disconnect();
    return res.status(200).json({ totalOfferings, offerings });
  } catch (error: any) {
    console.error('[RELATORIO FINANCEIRO] ERRO:', error);
    return res.status(404).json({ error: 'Erro ao consultar relatório financeiro', details: error?.message || error });
  }
}

export async function relatorioDiscipuladoPorDiscipulador(req: Request, res: Response) {
  return res.status(200).json({ message: 'Relatório de discipulado OK' });
}

