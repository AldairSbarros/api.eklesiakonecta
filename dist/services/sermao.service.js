"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSermao = exports.updateSermao = exports.getSermao = exports.listSermaos = exports.createSermao = void 0;
const prismaDynamic_1 = require("../utils/prismaDynamic");
const createSermao = async (schema, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.sermao.create({ data });
};
exports.createSermao = createSermao;
const listSermaos = async (schema) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.sermao.findMany();
};
exports.listSermaos = listSermaos;
const getSermao = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.sermao.findUnique({
        where: { id }
    });
};
exports.getSermao = getSermao;
const updateSermao = async (schema, id, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.sermao.update({
        where: { id },
        data
    });
};
exports.updateSermao = updateSermao;
const deleteSermao = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.sermao.delete({
        where: { id }
    });
};
exports.deleteSermao = deleteSermao;
//# sourceMappingURL=sermao.service.js.map