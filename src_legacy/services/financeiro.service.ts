import { getPrisma } from "../utils/prismaDynamic";
import manualCodigos from '../utils/manualCodigos.json';

export async function getResumoFinanceiro(schema: string, congregacaoId: number, mes?: number, ano?: number) {
  const prisma = getPrisma(schema);

  let dateFilter = {};
  if (mes && ano) {
    const inicio = new Date(ano, mes - 1, 1);
    const fim = new Date(ano, mes, 0, 23, 59, 59);
    dateFilter = { gte: inicio, lte: fim };
  }

  const [offerings, receitas, despesas, investimentos] = await Promise.all([
    prisma.offering.findMany({
      where: {
        congregacaoId,
        ...(mes && ano ? { date: dateFilter } : {}),
      },
    }),
    prisma.receita.findMany({
      where: {
        congregacaoId,
        ...(mes && ano ? { data: dateFilter } : {}),
      },
    }),
    prisma.despesa.findMany({
      where: {
        congregacaoId,
        ...(mes && ano ? { data: dateFilter } : {}),
      },
    }),
    prisma.investimento.findMany({
      where: {
        congregacaoId,
        ...(mes && ano ? { data: dateFilter } : {}),
      },
    }),
  ]);

  return { offerings, receitas, despesas, investimentos };
}

export async function getRelatorioMensal(schema: string, congregacaoId: number, mes: number, ano: number) {
  const prisma = getPrisma(schema);

  const inicio = new Date(ano, mes - 1, 1);
  const fim = new Date(ano, mes, 0, 23, 59, 59);

  const dizimos = await prisma.offering.findMany({
    where: {
      congregacaoId,
      type: 'dizimo',
      date: { gte: inicio, lte: fim }
    }
  });
  const totalDizimos = dizimos.reduce((acc, d) => acc + d.value, 0);

  const ofertas = await prisma.offering.findMany({
    where: {
      congregacaoId,
      type: 'oferta',
      date: { gte: inicio, lte: fim }
    }
  });
  const totalOfertas = ofertas.reduce((acc, o) => acc + o.value, 0);

  const totalEntradas = totalDizimos + totalOfertas;
  const comissaoIgreja = +(totalEntradas * 0.33).toFixed(2);
  const valorRecolhido = +(totalEntradas * 0.67).toFixed(2);

  const despesas = await prisma.despesa.findMany({
    where: {
      congregacaoId,
      data: { gte: inicio, lte: fim },
      codigoManual: { in: manualCodigos.despesas.map((d: { codigo: string }) => d.codigo) }
    }
  });
  const totalDespesas = despesas.reduce((acc, d) => acc + d.valor, 0);

  const investimentos = await prisma.investimento.findMany({
    where: {
      congregacaoId,
      data: { gte: inicio, lte: fim }
    }
  });
  const totalInvestimentos = investimentos.reduce((acc, i) => acc + i.valor, 0);

  const somaDespesasInvest = totalDespesas + totalInvestimentos;
  const despesasOk = somaDespesasInvest <= comissaoIgreja;

  return {
    mes,
    ano,
    congregacaoId,
    dizimos,
    totalDizimos,
    ofertas,
    totalOfertas,
    totalEntradas,
    comissaoIgreja,
    despesas,
    totalDespesas,
    investimentos,
    totalInvestimentos,
    despesasMaisInvestimentos: somaDespesasInvest,
    despesasDentroLimite: despesasOk,
    valorARecolher: valorRecolhido
  };
}

// Novo: gera (ou retorna se já existir) snapshot agregado mensal armazenado em RelatorioFinanceiroMensal
export async function getRelatorioFinanceiroMensalSnapshot(
  schema: string,
  congregacaoId: number,
  mes: number,
  ano: number,
  recomputar = false
) {
  const prisma = getPrisma(schema);

  // Tenta recuperar existente
  if (!recomputar) {
    const existente = await (prisma as any).relatorioFinanceiroMensal?.findUnique({
      where: { relatorio_financeiro_mensal_unico: { congregacaoId, ano, mes } }
    });
    if (existente) return existente;
  }

  const inicio = new Date(ano, mes - 1, 1);
  const fim = new Date(ano, mes, 0, 23, 59, 59);

  // Offerings (dizimos e ofertas)
  const offerings = await prisma.offering.findMany({
    where: { congregacaoId, date: { gte: inicio, lte: fim } },
    include: { Member: { select: { id: true, categoriaEclesiastica: true } } } as any
  }) as any[];

  const normalizaTipo = (t?: string | null) => (t || '').toLowerCase();

  // Receitas avulsas
  const receitasOutras = await prisma.receita.findMany({
    where: { congregacaoId, data: { gte: inicio, lte: fim } }
  });

  const dizimos = offerings.filter(o => normalizaTipo(o.type) === 'dizimo');
  const ofertas = offerings.filter(o => normalizaTipo(o.type) === 'oferta');

  const valorTotalDizimos = dizimos.reduce((acc, d) => acc + d.value, 0);
  const valorTotalOfertas = ofertas.reduce((acc, o) => acc + o.value, 0);
  const valorReceitasAvulsas = receitasOutras.reduce((acc, r) => acc + r.valor, 0);
  const valorTotalReceitas = valorTotalDizimos + valorTotalOfertas + valorReceitasAvulsas;

  const totalDizimistas = new Set(dizimos.map(d => d.memberId)).size;
  const totalOfertas = ofertas.length; // quantidade de lançamentos de oferta

  const valorComissao33 = +(valorTotalReceitas * 0.33).toFixed(2);
  const valorRepasseCentral = +(valorTotalReceitas - valorComissao33).toFixed(2);

  // Breakdown por categoria eclesiástica
  type CatKey = string; // usando string para permitir 'SEM_CATEGORIA'
  interface CatStats { dizimos: number; ofertas: number; countDizimos: number; countOfertas: number; }
  const mapa: Record<CatKey, CatStats> = {};
  const ensure = (k: CatKey) => (mapa[k] ||= { dizimos: 0, ofertas: 0, countDizimos: 0, countOfertas: 0 });

  for (const d of dizimos as any[]) {
    const cat = d.Member?.categoriaEclesiastica || 'SEM_CATEGORIA';
    const slot = ensure(cat);
    slot.dizimos += d.value;
    slot.countDizimos += 1;
  }
  for (const o of ofertas as any[]) {
    const cat = o.Member?.categoriaEclesiastica || 'SEM_CATEGORIA';
    const slot = ensure(cat);
    slot.ofertas += o.value;
    slot.countOfertas += 1;
  }

  const detalhesCategorias = mapa;

  // Upsert snapshot
  const snapshot = await (prisma as any).relatorioFinanceiroMensal.upsert({
    where: { relatorio_financeiro_mensal_unico: { congregacaoId, ano, mes } },
    create: {
      congregacaoId,
      ano,
      mes,
      totalDizimistas,
      totalOfertas,
      valorTotalDizimos,
      valorTotalOfertas,
      valorTotalReceitas,
      valorComissao33,
      valorRepasseCentral,
      detalhesCategorias
    },
    update: {
      totalDizimistas,
      totalOfertas,
      valorTotalDizimos,
      valorTotalOfertas,
      valorTotalReceitas,
      valorComissao33,
      valorRepasseCentral,
      detalhesCategorias,
      geradoEm: new Date()
    }
  });

  return snapshot;
}

export default {
  getResumoFinanceiro,
  getRelatorioMensal,
  getRelatorioFinanceiroMensalSnapshot
};