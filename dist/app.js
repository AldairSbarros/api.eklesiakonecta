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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="./@types/express/index.d.ts" />
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
// Importação dos módulos de rotas
const church_routes_1 = __importDefault(require("./routes/church.routes"));
const congregacao_routes_1 = __importDefault(require("./routes/congregacao.routes"));
const member_routes_1 = __importDefault(require("./routes/member.routes"));
const offering_routes_1 = __importDefault(require("./routes/offering.routes"));
const usuario_routes_1 = __importDefault(require("./routes/usuario.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const despesa_routes_1 = __importDefault(require("./routes/despesa.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const receita_routes_1 = __importDefault(require("./routes/receita.routes"));
const investimentos_routes_1 = __importDefault(require("./routes/investimentos.routes"));
const mensagemCelula_routes_1 = __importDefault(require("./routes/mensagemCelula.routes"));
const pastor_routes_1 = __importDefault(require("./routes/pastor.routes"));
const ministerioLocal_routes_1 = __importDefault(require("./routes/ministerioLocal.routes"));
const escolaLideresTurma_routes_1 = __importDefault(require("./routes/escolaLideresTurma.routes"));
const escolaLideresLicao_routes_1 = __importDefault(require("./routes/escolaLideresLicao.routes"));
const encontro_routes_1 = __importDefault(require("./routes/encontro.routes"));
const enderecoMembro_routes_1 = __importDefault(require("./routes/enderecoMembro.routes"));
const celula_routes_1 = __importDefault(require("./routes/celula.routes"));
const reuniaoCelula_routes_1 = __importDefault(require("./routes/reuniaoCelula.routes"));
const presencaCelula_routes_1 = __importDefault(require("./routes/presencaCelula.routes"));
const visitante_routes_1 = __importDefault(require("./routes/visitante.routes"));
const permissao_routes_1 = __importDefault(require("./routes/permissao.routes"));
const usuarioPermissao_routes_1 = __importDefault(require("./routes/usuarioPermissao.routes"));
const notificacao_routes_1 = __importDefault(require("./routes/notificacao.routes"));
const tokenRecuperacaoSenha_routes_1 = __importDefault(require("./routes/tokenRecuperacaoSenha.routes"));
const arquivo_routes_1 = __importDefault(require("./routes/arquivo.routes"));
const log_routes_1 = __importDefault(require("./routes/log.routes"));
const fatura_routes_1 = __importDefault(require("./routes/fatura.routes"));
const sermao_routes_1 = __importDefault(require("./routes/sermao.routes"));
const password_routes_1 = __importDefault(require("./routes/password.routes"));
const financeiro_routes_1 = __importDefault(require("./routes/financeiro.routes"));
const devuser_routes_1 = __importDefault(require("./routes/devuser.routes"));
// import relatoriosRoutes from './routes/relatorios.routes';
const live_routes_1 = __importDefault(require("./routes/live.routes"));
const cadastroInicial_routes_1 = __importDefault(require("./routes/cadastroInicial.routes"));
const usuarioController = __importStar(require("./controllers/usuario.controller"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const discipulado_routes_1 = __importDefault(require("./routes/discipulado.routes"));
require("./services/aniversariantes.service");
const swaggerConfig_1 = __importDefault(require("./docs/swaggerConfig"));
const app = (0, express_1.default)();
// Middlewares globais
app.use((0, express_rate_limit_1.default)({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use((0, helmet_1.default)());
// 🔐 CORS atualizado para ambientes local e de produção
const allowedOrigins = [
    'http://localhost:5173',
    'https://app.eklesia.app.br'
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Origem não permitida pelo CORS'));
        }
    },
    credentials: true
}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Church-Schema, schema');
    next();
});
app.use(express_1.default.json());
// Rota de health check
app.get('/test', (req, res) => {
    res.status(200).json({ ok: true });
});
// Documentação Swagger
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerConfig_1.default));
// Rotas abertas
app.use('/api', cadastroInicial_routes_1.default);
app.use('/api/lives', live_routes_1.default);
// Rotas principais
app.use('/api/igrejas', church_routes_1.default);
app.use('/api/congregacoes', congregacao_routes_1.default);
app.use('/api/membros', member_routes_1.default);
app.use('/api/usuarios', usuario_routes_1.default);
app.use('/api/pastores', pastor_routes_1.default);
// Células
app.use('/api/celulas', celula_routes_1.default);
app.use('/api/reunioes-celula', reuniaoCelula_routes_1.default);
app.use('/api/presencas-celula', presencaCelula_routes_1.default);
app.use('/api/visitantes-celula', visitante_routes_1.default);
app.use('/api/mensagens-celula', mensagemCelula_routes_1.default);
// Discipulado
app.use('/api/discipulado', discipulado_routes_1.default);
// Ministério & Escola de líderes
app.use('/api/ministerios-locais', ministerioLocal_routes_1.default);
app.use('/api/escola-lideres-turmas', escolaLideresTurma_routes_1.default);
app.use('/api/escola-lideres-licoes', escolaLideresLicao_routes_1.default);
// Finanças
app.use('/api/offerings', offering_routes_1.default);
app.use('/api/despesas', despesa_routes_1.default);
app.use('/api/receitas', receita_routes_1.default);
app.use('/api/investimentos', investimentos_routes_1.default);
app.use('/api/financeiro', financeiro_routes_1.default);
app.use('/api/faturas', fatura_routes_1.default);
// Funcionalidades
app.use('/api/dashboard', dashboard_routes_1.default);
app.use('/api/notificacoes', notificacao_routes_1.default);
app.use('/api/permissoes', permissao_routes_1.default);
app.use('/api/usuario-permissoes', usuarioPermissao_routes_1.default);
app.use('/api/tokens-recuperacao-senha', tokenRecuperacaoSenha_routes_1.default);
app.use('/api/arquivos', arquivo_routes_1.default);
app.use('/api/logs', log_routes_1.default);
app.use('/api/sermoes', sermao_routes_1.default);
app.use('/api/enderecos-membro', enderecoMembro_routes_1.default);
app.use('/api/encontros', encontro_routes_1.default);
app.use('/api/password', password_routes_1.default);
// app.use('/api/relatorios', relatoriosRoutes);
app.use('/api/auth', auth_routes_1.default);
// Login alternativo
app.post('/api/usuarios/login', (0, express_async_handler_1.default)(usuarioController.login));
// Dev rotas
app.use('/api', devuser_routes_1.default);
// Arquivos estáticos
app.use('/uploads', express_1.default.static('uploads'));
// Rota base
app.get('/', (req, res) => {
    res.send('API Eklesia Konecta rodando');
});
// Cron de backup
const cron = require('node-cron');
const { exec } = require('child_process');
const path = require('path');
cron.schedule('0 2 * * *', () => {
    const scriptPath = path.join(__dirname, '..', '..', 'scripts', 'backupDatabase.js');
    exec(`node "${scriptPath}"`, (error, stdout, stderr) => {
        if (error) {
            console.error('Erro no backup agendado:', error);
        }
        else {
            console.log('Backup agendado executado:', stdout);
        }
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map