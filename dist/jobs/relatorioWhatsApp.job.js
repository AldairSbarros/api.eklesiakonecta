"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enviarWhatsAppComArquivo = enviarWhatsAppComArquivo;
const node_cron_1 = __importDefault(require("node-cron"));
const client_1 = require("@prisma/client");
const relatorio_service_1 = require("../services/relatorio.service");
const prisma = new client_1.PrismaClient();
node_cron_1.default.schedule('0 8 1 * *', async () => {
    const igrejas = await prisma.church.findMany({
        include: { pastorPrincipal: true }
    });
    const dataAtual = new Date();
    const mes = dataAtual.getMonth() + 1;
    const ano = dataAtual.getFullYear();
    for (const igreja of igrejas) {
        const pastor = igreja.pastorPrincipal;
        if (!pastor || !pastor.telefone)
            continue; // telefone = WhatsApp
        const relatorioHTML = await (0, relatorio_service_1.gerarRelatorioMensalHTML)(igreja.id, mes, ano);
        await enviarWhatsAppComArquivo(pastor.telefone, Buffer.from(relatorioHTML), 'RelatorioMensal.html');
    }
});
async function enviarWhatsAppComArquivo(numero, buffer, nomeArquivo) {
    console.log(`Enviando ${nomeArquivo} para ${numero} via WhatsApp`);
    // Aqui vai a integração real com a API do WhatsApp (ex: Twilio)
    return true;
}
//# sourceMappingURL=relatorioWhatsApp.job.js.map