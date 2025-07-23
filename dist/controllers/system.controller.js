"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificarSistemaConfigurado = void 0;
const prismaDynamic_1 = require("../utils/prismaDynamic");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const verificarSistemaConfigurado = async (req, res) => {
    try {
        // Estratégia 1: Verificar se existe arquivo de controle
        const configFile = path_1.default.join(process.cwd(), 'sistema_configurado.flag');
        const configuradoPorArquivo = fs_1.default.existsSync(configFile);
        if (configuradoPorArquivo) {
            return res.json({
                configurado: true,
                message: 'Sistema já configurado'
            });
        }
        // Estratégia 2: Se não tem arquivo, tentar verificar no banco
        // Pode usar schema padrão ou tentar listar schemas existentes
        try {
            const prisma = (0, prismaDynamic_1.getPrisma)('public');
            // Tentar uma query simples para ver se existe estrutura
            await prisma.$queryRaw `SELECT 1`;
            await prisma.$disconnect();
            // Se chegou até aqui, sistema pode estar configurado
            // Criar arquivo de flag para próximas verificações
            fs_1.default.writeFileSync(configFile, new Date().toISOString());
            return res.json({
                configurado: true,
                message: 'Sistema já configurado'
            });
        }
        catch (dbError) {
            // Se der erro no banco, sistema não está configurado
            return res.json({
                configurado: false,
                message: 'Sistema não configurado'
            });
        }
    }
    catch (error) {
        console.error('Erro ao verificar configuração:', error);
        res.json({
            configurado: false,
            message: 'Sistema não configurado'
        });
    }
};
exports.verificarSistemaConfigurado = verificarSistemaConfigurado;
//# sourceMappingURL=system.controller.js.map