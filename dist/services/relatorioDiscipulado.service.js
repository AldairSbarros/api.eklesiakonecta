"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discipulandosSemEncontro = exports.countDiscipulandosPorDiscipulador = void 0;
const prismaDynamic_1 = require("../config/prismaDynamic");
// Quantidade de discipulandos por discipulador
const countDiscipulandosPorDiscipulador = async (schema) => {
    return (0, prismaDynamic_1.getPrismaForSchema)(schema).member.groupBy({
        by: ['discipuladorId'],
        _count: { id: true },
        where: { discipuladorId: { not: null } },
    });
};
exports.countDiscipulandosPorDiscipulador = countDiscipulandosPorDiscipulador;
// Discipulandos sem encontro nos últimos X dias
const discipulandosSemEncontro = async (schema, dias) => {
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - dias);
    return (0, prismaDynamic_1.getPrismaForSchema)(schema).member.findMany({
        where: {
            discipuladorId: { not: null },
            encontrosComoDiscipulando: {
                none: { data: { gte: dataLimite } }
            }
        },
        include: { discipulador: true }
    });
};
exports.discipulandosSemEncontro = discipulandosSemEncontro;
//# sourceMappingURL=relatorioDiscipulado.service.js.map