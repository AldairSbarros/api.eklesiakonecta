"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteModulo = exports.updateModulo = exports.getModulo = exports.listModulos = exports.createModulo = void 0;
const prismaDynamic_1 = require("../utils/prismaDynamic");
const createModulo = async (schema, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.escolaLideresModulo.create({ data });
};
exports.createModulo = createModulo;
const listModulos = async (schema) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.escolaLideresModulo.findMany();
};
exports.listModulos = listModulos;
const getModulo = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.escolaLideresModulo.findUnique({
        where: { id }
    });
};
exports.getModulo = getModulo;
const updateModulo = async (schema, id, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.escolaLideresModulo.update({
        where: { id },
        data
    });
};
exports.updateModulo = updateModulo;
const deleteModulo = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.escolaLideresModulo.delete({
        where: { id }
    });
};
exports.deleteModulo = deleteModulo;
//# sourceMappingURL=escolaLideresModulo.service.js.map