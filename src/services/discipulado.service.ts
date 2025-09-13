import { prisma } from '../core/prisma';
const prismaAny = prisma as any;
import { AppError } from '../utils/AppError';

const ORDEM_ETAPAS = [
  'MINICURSO',
  'ANDANDO_COM_CRISTO',
  'AGORA_QUE_SOU_DE_CRISTO',
  'CONSOLIDACAO',
  'ESCOLA_LIDERES_N1',
  'ESCOLA_LIDERES_N2',
  'ESCOLA_LIDERES_N3',
  'ENCONTRO_COM_DEUS',
  'BATISMO_AGUAS',
  'LIBERADO_LIDERAR'
];

function proxima(etapas: string[]) { for (const e of ORDEM_ETAPAS) if (!etapas.includes(e)) return e; return null; }

export const DiscipuladoService = {
  async listEtapas(membroId: number) {
  const membro = await prismaAny.membro.findUnique({ where: { id: membroId }, include: { etapas: true } });
    if (!membro) throw new AppError('Membro não encontrado', 404);
    const concluidas = membro.etapas.map(e => e.etapa);
    return { membroId, etapas: membro.etapas, proximaEtapa: proxima(concluidas) };
  },
  async registrarEtapa(membroId: number, data: { etapa: string; dataConclusao?: string; observacao?: string }) {
    const { etapa, dataConclusao, observacao } = data;
    if (!etapa) throw new AppError('etapa é obrigatória');
    if (!ORDEM_ETAPAS.includes(etapa)) throw new AppError('etapa inválida');
  const membro = await prismaAny.membro.findUnique({ where: { id: membroId }, include: { etapas: true } });
    if (!membro) throw new AppError('Membro não encontrado', 404);
    if (membro.etapas.find(e => e.etapa === etapa)) throw new AppError('Etapa já registrada', 409);
    const concluidas = membro.etapas.map(e => e.etapa);
    const prox = proxima(concluidas);
    if (prox !== etapa) throw new AppError(`Etapa fora de ordem. Próxima esperada: ${prox}`);
  const created = await prismaAny.membroEtapa.create({ data: { membroId, etapa, dataConclusao: dataConclusao ? new Date(dataConclusao) : null, observacao } });
    let flagUpdate: any = {};
    if (etapa === 'BATISMO_AGUAS') flagUpdate.ativoNaCongregacao = true;
    if (etapa === 'LIBERADO_LIDERAR') flagUpdate.aptoLiderar = true;
  if (Object.keys(flagUpdate).length) await prismaAny.membro.update({ where: { id: membroId }, data: flagUpdate });
    return created;
  }
};
