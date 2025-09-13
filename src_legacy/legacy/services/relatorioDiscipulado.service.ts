// LEGACY: Relatório discipulado helpers (unused by current controller impl)
import { getPrismaForSchema } from '../../config/prismaDynamic';

export const countDiscipulandosPorDiscipulador = async (schema: string) => {
  return getPrismaForSchema(schema).member.groupBy({
    by: ['discipuladorId'],
    _count: { id: true },
    where: { discipuladorId: { not: null } },
  });
};

export const discipulandosSemEncontro = async (schema: string, dias: number) => {
  const dataLimite = new Date();
  dataLimite.setDate(dataLimite.getDate() - dias);

  return getPrismaForSchema(schema).member.findMany({
    where: {
      discipuladorId: { not: null },
      encontrosComoDiscipulando: {
        none: { data: { gte: dataLimite } }
      }
    },
    include: { discipulador: true }
  });
};
