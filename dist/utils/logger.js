"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAuditoria = logAuditoria;
exports.logDebug = logDebug;
function logAuditoria(acao, detalhes) {
    const dataHora = new Date().toISOString();
    console.log(`[AUDITORIA] ${dataHora} | ${acao} |`, detalhes);
}
function logDebug(mensagem, detalhes) {
    const dataHora = new Date().toISOString();
    console.log(`[DEBUG] ${dataHora} | ${mensagem}`, detalhes || "");
}
//# sourceMappingURL=logger.js.map