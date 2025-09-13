import { Request, Response } from 'express';
import { ReceitaService } from '../services/receita.service';
import { prisma } from '../core/prisma';
import { Prisma } from '@prisma/client';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import { Document, Packer, Paragraph, TextRun } from 'docx';

// ---------------- Tipagens auxiliares ----------------
// Tipo flexível para remover @ts-nocheck mantendo segurança mínima.
interface ReceitaComMembro {
  id: number;
  tipo?: string;
  numeroRecibo?: number;
  valor: Prisma.Decimal | number | string;
  data: Date;
  membroId?: number | null;
  membro?: { nome?: string | null } | null;
  cultoDescricao?: string | null;
}

interface ReceitaResumo {
  totalDizimos: number;
  totalOfertas: number;
  totalVotos: number;
  totalOfertasAlcadas: number;
  totalContribuicoes: number;
  parteCongregacao33: number;
  parteTesourariaGeral67: number;
}

interface RelatorioPayload {
  mes: string;
  congregacaoId: number;
  resumo: ReceitaResumo;
  dizimos: Array<{ numeroRecibo: number; data: Date; valor: number; membro: string | null }>;
  ofertas: Array<{ numeroRecibo: number; data: Date; valor: number; culto: string | null }>;
  votos: Array<{ numeroRecibo: number; data: Date; valor: number }>;
  ofertasAlcadas: Array<{ numeroRecibo: number; data: Date; valor: number }>;
  totalDizimistas: number;
}

// Cache simples mantido aqui (poderia ir para um util/cache.ts)
const relatorioCache: Record<string, { expires: number; data: RelatorioPayload }> = {};
const REL_TTL_MS = 60 * 1000;

function toNum(d: Prisma.Decimal | number | string): number {
  return Number(new Prisma.Decimal(d).toFixed(2));
}

async function gerarPayload(congregacaoId: number, mes: string): Promise<RelatorioPayload> {
  const [ano, m] = String(mes).split('-').map(Number);
  if (!ano || !m) throw new Error('mes inválido');
  const start = new Date(Date.UTC(ano, m - 1, 1, 0, 0, 0));
  const end = new Date(Date.UTC(ano, m, 1, 0, 0, 0));
  const receitas = await prisma.receita.findMany({
    where: { congregacaoId, data: { gte: start, lt: end } },
    orderBy: [{ data: 'asc' }, { id: 'asc' }],
    include: { membro: true } as any
  }) as unknown as ReceitaComMembro[];
  const dizimos = receitas.filter(r => r.tipo === 'DIZIMO');
  const ofertas = receitas.filter(r => r.tipo === 'OFERTA');
  const votos = receitas.filter(r => r.tipo === 'VOTO');
  const ofertasAlcadas = receitas.filter(r => r.tipo === 'OFERTA_ALCADA');
  const sumDec = (arr: ReceitaComMembro[]) => arr.reduce((acc, r) => acc.add(new Prisma.Decimal(r.valor)), new Prisma.Decimal(0));
  const totalDizimosDec = sumDec(dizimos);
  const totalOfertasDec = sumDec(ofertas);
  const totalVotosDec = sumDec(votos);
  const totalOfertasAlcadasDec = sumDec(ofertasAlcadas);
  const totalContribuicoesDec = totalDizimosDec.add(totalOfertasDec).add(totalVotosDec).add(totalOfertasAlcadasDec);
  const parteCongregacaoDec = totalContribuicoesDec.mul(new Prisma.Decimal(0.33));
  const parteTesourariaGeralDec = totalContribuicoesDec.sub(parteCongregacaoDec);
  return {
    mes,
    congregacaoId,
    resumo: {
      totalDizimos: toNum(totalDizimosDec),
      totalOfertas: toNum(totalOfertasDec),
      totalVotos: toNum(totalVotosDec),
      totalOfertasAlcadas: toNum(totalOfertasAlcadasDec),
      totalContribuicoes: toNum(totalContribuicoesDec),
      parteCongregacao33: toNum(parteCongregacaoDec),
      parteTesourariaGeral67: toNum(parteTesourariaGeralDec)
    },
    dizimos: dizimos.map(d => ({ numeroRecibo: d.numeroRecibo ?? 0, data: d.data, valor: Number(d.valor), membro: d.membro?.nome || null })),
    ofertas: ofertas.map(o => ({ numeroRecibo: o.numeroRecibo ?? 0, data: o.data, valor: Number(o.valor), culto: o.cultoDescricao || null })),
    votos: votos.map(v => ({ numeroRecibo: v.numeroRecibo ?? 0, data: v.data, valor: Number(v.valor) })),
    ofertasAlcadas: ofertasAlcadas.map(a => ({ numeroRecibo: a.numeroRecibo ?? 0, data: a.data, valor: Number(a.valor) })),
    totalDizimistas: new Set(dizimos.map(d => d.membroId).filter(Boolean)).size
  };
}

function renderRelatorioExport(res: Response, payload: RelatorioPayload, congregacaoId: number, mes: string, formato: string) {
  switch (formato) {
    case 'csv': {
      const csvLines = [
        'tipo,numeroRecibo,data,valor,membroOuCulto',
        ...payload.dizimos.map(d => `DIZIMO,${d.numeroRecibo},${d.data.toISOString()},${d.valor},${d.membro||''}`),
        ...payload.ofertas.map(o => `OFERTA,${o.numeroRecibo},${o.data.toISOString()},${o.valor},${o.culto||''}`),
        ...payload.votos.map(v => `VOTO,${v.numeroRecibo},${v.data.toISOString()},${v.valor},`),
        ...payload.ofertasAlcadas.map(a => `OFERTA_ALCADA,${a.numeroRecibo},${a.data.toISOString()},${a.valor},`),
        `RESUMO_TOTAL,,,$${payload.resumo.totalContribuicoes},`,
        `PARTE_CONGREGACAO_33%,,,$${payload.resumo.parteCongregacao33},`,
        `PARTE_TESOURARIA_67%,,,$${payload.resumo.parteTesourariaGeral67},`
      ];
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="relatorio-${congregacaoId}-${mes}.csv"`);
      return res.send(csvLines.join('\n'));
    }
    case 'pdf': {
      const doc = new PDFDocument({ margin: 40 });
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="relatorio-${congregacaoId}-${mes}.pdf"`);
      doc.pipe(res);
      doc.fontSize(16).text(`Relatório Financeiro - Congregação ${congregacaoId} - ${mes}`, { underline: true });
      doc.moveDown();
      const addSection = <T,>(title: string, arr: T[], mapFn: (r: T)=>string) => { if (!arr.length) return; doc.fontSize(12).text(title); arr.forEach(r => doc.fontSize(10).text(' - ' + mapFn(r))); doc.moveDown(0.5); };
      addSection('Dízimos', payload.dizimos, r=>`Recibo ${r.numeroRecibo} | ${r.data.toISOString().slice(0,10)} | R$ ${r.valor} | ${r.membro||'-'}`);
      addSection('Ofertas', payload.ofertas, r=>`Recibo ${r.numeroRecibo} | ${r.data.toISOString().slice(0,10)} | R$ ${r.valor} | ${r.culto||'-'}`);
      addSection('Votos', payload.votos, r=>`Recibo ${r.numeroRecibo} | ${r.data.toISOString().slice(0,10)} | R$ ${r.valor}`);
      addSection('Ofertas Alçadas', payload.ofertasAlcadas, r=>`Recibo ${r.numeroRecibo} | ${r.data.toISOString().slice(0,10)} | R$ ${r.valor}`);
      doc.moveDown();
      doc.fontSize(12).text('Resumo:');
      Object.entries(payload.resumo).forEach(([k,v])=> doc.fontSize(10).text(`${k}: ${v}`));
      doc.fontSize(10).text(`Total Dizimistas: ${payload.totalDizimistas}`);
      doc.end();
      return;
    }
    case 'xlsx': {
      const wb = new ExcelJS.Workbook();
      const ws = wb.addWorksheet('Relatorio');
      ws.addRow(['Relatório Financeiro', `Congregação ${congregacaoId}`, mes]); ws.addRow([]); ws.addRow(['Tipo','Número Recibo','Data','Valor','Membro/Culto']);
      const pushRows = <T,>(tipo:string, arr:T[], fn:(r:T)=>[any,any,any,any]) => arr.forEach(r=> ws.addRow([tipo, ...fn(r)]));
      pushRows('DIZIMO', payload.dizimos, r=>[r.numeroRecibo, r.data.toISOString().slice(0,10), r.valor, r.membro||'']);
      pushRows('OFERTA', payload.ofertas, r=>[r.numeroRecibo, r.data.toISOString().slice(0,10), r.valor, r.culto||'']);
      pushRows('VOTO', payload.votos, r=>[r.numeroRecibo, r.data.toISOString().slice(0,10), r.valor, '']);
      pushRows('OFERTA_ALCADA', payload.ofertasAlcadas, r=>[r.numeroRecibo, r.data.toISOString().slice(0,10), r.valor, '']);
      ws.addRow([]); ws.addRow(['Resumo']); Object.entries(payload.resumo).forEach(([k,v])=> ws.addRow([k, v])); ws.addRow(['totalDizimistas', payload.totalDizimistas]);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="relatorio-${congregacaoId}-${mes}.xlsx"`);
      wb.xlsx.write(res).then(()=> res.end());
      return;
    }
    case 'docx': {
      const paragraphs: Paragraph[] = [];
      paragraphs.push(new Paragraph({ children: [new TextRun({ text: `Relatório Financeiro - Congregação ${congregacaoId} - ${mes}`, bold: true })] }));
      const addGroup = <T,>(title:string, arr:T[], fmt:(r:T)=>string) => { if (!arr.length) return; paragraphs.push(new Paragraph({ children: [new TextRun({ text: title, bold: true })] })); arr.forEach(r => paragraphs.push(new Paragraph(fmt(r)))); };
      addGroup('Dízimos', payload.dizimos, r=> `Recibo ${r.numeroRecibo} | ${r.data.toISOString().slice(0,10)} | R$ ${r.valor} | ${r.membro||'-'}`);
      addGroup('Ofertas', payload.ofertas, r=> `Recibo ${r.numeroRecibo} | ${r.data.toISOString().slice(0,10)} | R$ ${r.valor} | ${r.culto||'-'}`);
      addGroup('Votos', payload.votos, r=> `Recibo ${r.numeroRecibo} | ${r.data.toISOString().slice(0,10)} | R$ ${r.valor}`);
      addGroup('Ofertas Alçadas', payload.ofertasAlcadas, r=> `Recibo ${r.numeroRecibo} | ${r.data.toISOString().slice(0,10)} | R$ ${r.valor}`);
      paragraphs.push(new Paragraph({ children: [new TextRun({ text: 'Resumo', bold: true })] }));
      Object.entries(payload.resumo).forEach(([k,v]) => paragraphs.push(new Paragraph(`${k}: ${v}`)));
      paragraphs.push(new Paragraph(`Total Dizimistas: ${payload.totalDizimistas}`));
      const doc = new Document({ sections: [{ properties: {}, children: paragraphs }] });
      Packer.toBuffer(doc).then(buffer => {
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename="relatorio-${congregacaoId}-${mes}.docx"`);
        res.send(Buffer.from(buffer));
      });
      return;
    }
    default:
      return res.json(payload);
  }
}

export const ReceitaController = {
  async create(req: Request, res: Response) {
    const congregacaoId = Number(req.params.congregacaoId);
    const receita = await ReceitaService.create(congregacaoId, req.body, req.file as Express.Multer.File | undefined);
    res.status(201).json(receita);
  },
  async list(req: Request, res: Response) {
    const congregacaoId = Number(req.params.congregacaoId);
    const mes = req.query.mes ? String(req.query.mes) : undefined;
    const receitas = await ReceitaService.list(congregacaoId, mes as string | undefined);
    res.json(receitas);
  },
  async relatorio(req: Request, res: Response) {
    const congregacaoId = Number(req.params.congregacaoId);
    const mes = String(req.query.mes || '');
    if (!mes) return res.status(400).json({ message: 'mes (YYYY-MM) obrigatório' });
    const formato = String(req.query.formato || '');
    const cacheKey = `${congregacaoId}:${mes}`;
    const now = Date.now();
    const cacheHit = relatorioCache[cacheKey];
    if (cacheHit && cacheHit.expires > now) {
      return renderRelatorioExport(res, cacheHit.data, congregacaoId, mes, formato);
    }
    try {
      const payload = await gerarPayload(congregacaoId, mes);
      relatorioCache[cacheKey] = { data: payload, expires: Date.now() + REL_TTL_MS };
      return renderRelatorioExport(res, payload, congregacaoId, mes, formato);
    } catch (e) {
      const err = e as Error;
      return res.status(500).json({ message: 'Erro ao gerar relatório', error: err.message });
    }
  }
};
