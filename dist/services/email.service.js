"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarTransporter = criarTransporter;
exports.enviarEmail = enviarEmail;
exports.upsertConfigEmail = upsertConfigEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
function criarTransporter({ smtpHost, smtpPort, smtpUser, smtpPass }) {
    return nodemailer_1.default.createTransport({
        host: smtpHost,
        port: Number(smtpPort),
        secure: false, // true para porta 465, false para 587/25
        auth: {
            user: smtpUser,
            pass: smtpPass,
        },
    });
}
// Função para enviar e-mail
async function enviarEmail({ smtpConfig, to, subject, html }) {
    const transporter = criarTransporter(smtpConfig);
    await transporter.sendMail({
        from: `"EklesiaApp" <${smtpConfig.smtpUser}>`, // Remetente
        to, // Destinatário(s)
        subject, // Assunto
        html, // Corpo do e-mail em HTML
    });
}
function upsertConfigEmail(schema, arg1) {
    throw new Error('Function not implemented.');
}
//# sourceMappingURL=email.service.js.map