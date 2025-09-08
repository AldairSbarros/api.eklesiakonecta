"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWebhook = exports.updateWebhook = exports.getWebhook = exports.listWebhooks = exports.createWebhook = void 0;
const prismaDynamic_1 = require("../utils/prismaDynamic");
const createWebhook = async (schema, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.webhook.create({ data });
};
exports.createWebhook = createWebhook;
const listWebhooks = async (schema) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.webhook.findMany();
};
exports.listWebhooks = listWebhooks;
const getWebhook = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.webhook.findUnique({
        where: { id }
    });
};
exports.getWebhook = getWebhook;
const updateWebhook = async (schema, id, data) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.webhook.update({
        where: { id },
        data
    });
};
exports.updateWebhook = updateWebhook;
const deleteWebhook = async (schema, id) => {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    return prisma.webhook.delete({
        where: { id }
    });
};
exports.deleteWebhook = deleteWebhook;
//# sourceMappingURL=webhook.controller.js.map