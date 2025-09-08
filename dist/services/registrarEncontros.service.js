"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarEncontros = exports.registrarEncontro = void 0;
const prismaDynamic_1 = require("../config/prismaDynamic");
const registrarEncontro = async (schema, data) => {
    return (0, prismaDynamic_1.getPrismaForSchema)(schema).encontros.create({ data });
};
exports.registrarEncontro = registrarEncontro;
const listarEncontros = async (schema, filtro) => {
    return (0, prismaDynamic_1.getPrismaForSchema)(schema).encontros.findMany({ where: filtro });
};
exports.listarEncontros = listarEncontros;
//# sourceMappingURL=registrarEncontros.service.js.map