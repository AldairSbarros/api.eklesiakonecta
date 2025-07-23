"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listByChurch = exports.create = void 0;
const prismaDynamic_1 = require("../config/prismaDynamic"); // ajuste o caminho conforme necessário
// Cadastrar uma nova live/transmissão
const create = async (req, res) => {
    const { churchId, titulo, descricao, url, agendadaEm } = req.body;
    const prisma = (0, prismaDynamic_1.getPrismaForSchema)(churchId); // get PrismaClient for the schema
    const live = await prisma.liveStream.create({
        data: { churchId, titulo, descricao, url, agendadaEm }
    });
    res.status(201).json(live);
};
exports.create = create;
// Listar lives de uma igreja
const listByChurch = async (req, res) => {
    const { churchId } = req.params;
    const prisma = (0, prismaDynamic_1.getPrismaForSchema)(churchId);
    const lives = await prisma.liveStream.findMany({
        where: { churchId: Number(churchId) },
        orderBy: { agendadaEm: 'desc' }
    });
    res.json(lives);
};
exports.listByChurch = listByChurch;
//# sourceMappingURL=live.controller.js.map