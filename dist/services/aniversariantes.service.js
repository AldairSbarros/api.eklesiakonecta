"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const client_1 = require("@prisma/client");
const prismaDynamic_1 = require("../config/prismaDynamic"); // ajuste o caminho conforme seu projeto
const prisma = new client_1.PrismaClient();
// Cron job: roda todo dia às 8h da manhã para todas as igrejas
node_cron_1.default.schedule('0 8 * * *', async () => {
    const igrejas = await prisma.church.findMany();
    for (const igreja of igrejas) {
        const schema = igreja.schema; // ajuste conforme o nome do campo
        const aniversariantes = await (0, prismaDynamic_1.buscarAniversariantesPorSchema)(schema);
        if (aniversariantes.length > 0) {
            console.log(`Aniversariantes de hoje na igreja ${igreja.nome}:`, aniversariantes.map(a => a.nome));
            // Aqui você pode chamar o serviço de envio de WhatsApp ou e-mail
        }
        else {
            console.log(`Nenhum aniversariante hoje na igreja ${igreja.nome}.`);
        }
    }
});
//# sourceMappingURL=aniversariantes.service.js.map