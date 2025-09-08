"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gerarExcel = gerarExcel;
exports.gerarPDF = gerarPDF;
const exceljs_1 = __importDefault(require("exceljs"));
const pdfkit_1 = __importDefault(require("pdfkit"));
async function gerarExcel(dados, nomePlanilha = 'Relatório') {
    const workbook = new exceljs_1.default.Workbook();
    const worksheet = workbook.addWorksheet(nomePlanilha);
    if (dados.length > 0) {
        worksheet.columns = Object.keys(dados[0]).map(key => ({ header: key, key }));
        worksheet.addRows(dados);
    }
    // Retorna o buffer do arquivo
    return await workbook.xlsx.writeBuffer();
}
function gerarPDF(dados, titulo = 'Relatório') {
    const doc = new pdfkit_1.default();
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => { });
    doc.fontSize(18).text(titulo, { align: 'center' });
    doc.moveDown();
    if (dados.length > 0) {
        Object.keys(dados[0]).forEach(key => doc.fontSize(12).text(key, { continued: true }).text(' | ', { continued: true }));
        doc.moveDown();
        dados.forEach(item => {
            Object.values(item).forEach(val => doc.fontSize(10).text(String(val), { continued: true }).text(' | ', { continued: true }));
            doc.moveDown();
        });
    }
    doc.end();
    return Buffer.concat(buffers);
}
//# sourceMappingURL=exportacao.service.js.map