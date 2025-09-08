"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRelatorioMensalData = getRelatorioMensalData;
exports.registrarLog = registrarLog;
exports.gerarRelatorioMensalHTML = gerarRelatorioMensalHTML;
const prismaDynamic_1 = require("../utils/prismaDynamic");
// Função mock para evitar erro de build/deploy
// Implemente a lógica real conforme sua necessidade!
async function getRelatorioMensalData(schema, congregacaoId, mes, ano) {
    // Exemplo de retorno mock
    return {
        listaDizimistas: [],
        // ...adicione outros campos conforme esperado pelo controller
    };
}
async function registrarLog(schema, { usuarioId, acao, detalhes, ip }) {
    const prisma = (0, prismaDynamic_1.getPrisma)(schema);
    await prisma.logAcesso.create({
        data: { usuarioId, acao, detalhes, ip }
    });
}
async function gerarRelatorioMensalHTML(clienteId, mes, ano) {
    // Aqui você pode buscar os dados no banco e montar o HTML do relatório
    // Exemplo mock:
    return `<h1>Relatório Mensal</h1><p>Cliente: ${clienteId}, Mês: ${mes}, Ano: ${ano}</p>`;
}
//# sourceMappingURL=relatorio.service.js.map