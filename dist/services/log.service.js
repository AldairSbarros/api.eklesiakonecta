"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLog = exports.updateLog = exports.getLog = exports.listLogs = exports.createLog = void 0;
const prismaDynamic_1 = require("../utils/prismaDynamic");
const createLog = async (schema, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.log.create({ data });
};
exports.createLog = createLog;
const listLogs = async (schema) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.log.findMany();
};
exports.listLogs = listLogs;
const getLog = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.log.findUnique({
        where: { id }
    });
};
exports.getLog = getLog;
const updateLog = async (schema, id, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.log.update({
        where: { id },
        data
    });
};
exports.updateLog = updateLog;
const deleteLog = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.log.delete({
        where: { id }
    });
};
exports.deleteLog = deleteLog;
//# sourceMappingURL=log.service.js.map