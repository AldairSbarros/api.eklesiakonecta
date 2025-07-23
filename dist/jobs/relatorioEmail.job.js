"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const email_service_1 = require("../services/email.service");
const relatorio_service_1 = require("../services/relatorio.service");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Função que busca todos os clientes com configuração de e-mail
async function getAllClientesComConfigSMTP() {
    return prisma.configEmail.findMany();
}
// Agenda para todo dia 1º do mês às 08:00
node_cron_1.default.schedule('0 8 1 * *', async () => {
    console.log('Iniciando envio automático de relatórios mensais...');
    const clientes = await getAllClientesComConfigSMTP();
    for (const cliente of clientes) {
        try {
            const now = new Date();
            const mes = now.getMonth() + 1; // getMonth() is zero-based
            const ano = now.getFullYear();
            const relatorio = await (0, relatorio_service_1.gerarRelatorioMensalHTML)(cliente.clienteId, mes, ano);
            await (0, email_service_1.enviarEmail)({
                smtpConfig: {
                    smtpHost: cliente.smtpHost,
                    smtpPort: cliente.smtpPort,
                    smtpUser: cliente.smtpUser,
                    smtpPass: cliente.smtpPass,
                },
                to: cliente.email, // ou lista de destinatários
                subject: 'Relatório Mensal EklesiaApp',
                html: relatorio,
            });
            console.log(`Relatório mensal enviado para ${cliente.email}`);
        }
        catch (err) {
            console.error(`Erro ao enviar relatório para ${cliente.email}:`, err);
        }
    }
});
//# sourceMappingURL=relatorioEmail.job.js.map