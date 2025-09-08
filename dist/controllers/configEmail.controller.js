"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertConfigEmail = upsertConfigEmail;
const express_1 = require("express");
const configEmailService = __importStar(require("../services/email.service"));
const router = (0, express_1.Router)();
// Rota para cadastrar ou atualizar as configurações SMTP do cliente
router.post('/config-email', async (req, res) => {
    const schema = req.headers['schema'];
    if (!schema) {
        res.status(400).json({ error: 'Schema não informado no header.' });
        return;
    }
    const { clienteId, smtpHost, smtpPort, smtpUser, smtpPass, email } = req.body;
    if (!clienteId || !smtpHost || !smtpPort || !smtpUser || !smtpPass || !email) {
        res.status(400).json({ error: 'Dados obrigatórios faltando.' });
        return;
    }
    try {
        // Chama o service, passando o schema
        const config = await configEmailService.upsertConfigEmail(schema, {
            clienteId,
            smtpHost,
            smtpPort,
            smtpUser,
            smtpPass,
            email
        });
        res.json({ ok: true, config });
    }
    catch (err) {
        res.status(500).json({ error: 'Erro ao salvar configuração de e-mail.' });
    }
});
exports.default = router;
// Simulated database (replace with real DB logic)
const configs = {};
/**
 * Inserts or updates the SMTP config for a client in the given schema.
 * @param schema The database schema/tenant.
 * @param data The config data.
 * @returns The saved config.
 */
async function upsertConfigEmail(schema, data) {
    // In a real implementation, use the schema to select the correct DB/tenant.
    // Here, we just use clienteId as key for simplicity.
    configs[data.clienteId] = { ...data };
    // Simulate async DB operation
    return Promise.resolve(configs[data.clienteId]);
}
//# sourceMappingURL=configEmail.controller.js.map