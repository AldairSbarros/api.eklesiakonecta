"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enviarWhatsAppTwilio = enviarWhatsAppTwilio;
const twilio_1 = __importDefault(require("twilio"));
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = (0, twilio_1.default)(accountSid, authToken);
async function enviarWhatsAppTwilio(numeroDestino, mensagem) {
    await client.messages.create({
        from: 'whatsapp:+14155238886', // Número do Sandbox Twilio
        to: `whatsapp:${numeroDestino}`,
        body: mensagem,
    });
}
//# sourceMappingURL=twilio.service.js.map