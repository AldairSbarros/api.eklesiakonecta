/// <reference path="./@types/express/index.d.ts" />
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

// Importação dos módulos de rotas
import churchRoutes from './routes/church.routes';
import congregacaoRoutes from './routes/congregacao.routes';
import memberRoutes from './routes/member.routes';
import offeringRoutes from './routes/offering.routes';
import usuarioRoutes from './routes/usuario.routes';
import dashboardRoutes from './routes/dashboard.routes';
import despesaRoutes from './routes/despesa.routes';
import authRoutes from './routes/auth.routes';
import receitaRoutes from './routes/receita.routes';
import investimentosRoutes from './routes/investimentos.routes';
import mensagemCelulaRoutes from './routes/mensagemCelula.routes';
import pastorRoutes from './routes/pastor.routes';
import ministerioLocalRoutes from './routes/ministerioLocal.routes';
import escolaLideresTurmaRoutes from './routes/escolaLideresTurma.routes';
import escolaLideresLicaoRoutes from './routes/escolaLideresLicao.routes';
import encontroRoutes from './routes/encontro.routes';
import enderecoMembroRoutes from './routes/enderecoMembro.routes';
import celulaRoutes from './routes/celula.routes';
import reuniaoCelulaRoutes from './routes/reuniaoCelula.routes';
import presencaCelulaRoutes from './routes/presencaCelula.routes';
import visitanteCelulaRoutes from './routes/visitante.routes';
import permissaoRoutes from './routes/permissao.routes';
import usuarioPermissaoRoutes from './routes/usuarioPermissao.routes';
import notificacaoRoutes from './routes/notificacao.routes';
import tokenRecuperacaoSenhaRoutes from './routes/tokenRecuperacaoSenha.routes';
import arquivoRoutes from './routes/arquivo.routes';
import logRoutes from './routes/log.routes';
import faturaRoutes from './routes/fatura.routes';
import sermaoRoutes from './routes/sermao.routes';
import passwordRoutes from './routes/password.routes';
import financeiroRoutes from './routes/financeiro.routes';
import devUserRoutes from './routes/devuser.routes';
// import relatoriosRoutes from './routes/relatorios.routes';
import liveRoutes from './routes/live.routes';
import cadastroInicialRoutes from './routes/cadastroInicial.routes';
import * as usuarioController from './controllers/usuario.controller';
import asyncHandler from 'express-async-handler';
import discipuladoRoutes from './routes/discipulado.routes';
import './services/aniversariantes.service';

import swaggerSpec from './docs/swaggerConfig';

const app = express();

// Middlewares globais
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(helmet());

// 🔐 CORS atualizado para ambientes local e de produção
const allowedOrigins = [
  'http://localhost:5173',
  'https://api.eklesia.app.br:3001'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origem não permitida pelo CORS'));
    }
  },
  credentials: true
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Church-Schema, schema');
  next();
});

app.use(express.json());

// Rota de health check
app.get('/test', (req: Request, res: Response) => {
  res.status(200).json({ ok: true });
});

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas abertas
app.use('/api', cadastroInicialRoutes);
app.use('/api/lives', liveRoutes);

// Rotas principais
app.use('/api/igrejas', churchRoutes);
app.use('/api/congregacoes', congregacaoRoutes);
app.use('/api/membros', memberRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/pastores', pastorRoutes);

// Células
app.use('/api/celulas', celulaRoutes);
app.use('/api/reunioes-celula', reuniaoCelulaRoutes);
app.use('/api/presencas-celula', presencaCelulaRoutes);
app.use('/api/visitantes-celula', visitanteCelulaRoutes);
app.use('/api/mensagens-celula', mensagemCelulaRoutes);

// Discipulado
app.use('/api/discipulado', discipuladoRoutes);

// Ministério & Escola de líderes
app.use('/api/ministerios-locais', ministerioLocalRoutes);
app.use('/api/escola-lideres-turmas', escolaLideresTurmaRoutes);
app.use('/api/escola-lideres-licoes', escolaLideresLicaoRoutes);

// Finanças
app.use('/api/offerings', offeringRoutes);
app.use('/api/despesas', despesaRoutes);
app.use('/api/receitas', receitaRoutes);
app.use('/api/investimentos', investimentosRoutes);
app.use('/api/financeiro', financeiroRoutes);
app.use('/api/faturas', faturaRoutes);

// Funcionalidades
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notificacoes', notificacaoRoutes);
app.use('/api/permissoes', permissaoRoutes);
app.use('/api/usuario-permissoes', usuarioPermissaoRoutes);
app.use('/api/tokens-recuperacao-senha', tokenRecuperacaoSenhaRoutes);
app.use('/api/arquivos', arquivoRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/sermoes', sermaoRoutes);
app.use('/api/enderecos-membro', enderecoMembroRoutes);
app.use('/api/encontros', encontroRoutes);
app.use('/api/password', passwordRoutes);
// app.use('/api/relatorios', relatoriosRoutes);
app.use('/api/auth', authRoutes);

// Login alternativo
app.post('/api/usuarios/login', asyncHandler(usuarioController.login));

// Dev rotas
app.use('/api', devUserRoutes);

// Arquivos estáticos
app.use('/uploads', express.static('uploads'));

// Rota base
app.get('/', (req: Request, res: Response) => {
  res.send('API Eklesia Konecta rodando');
});

// Cron de backup
const cron = require('node-cron');
const { exec } = require('child_process');
const path = require('path');

cron.schedule('0 2 * * *', () => {
  const scriptPath = path.join(__dirname, '..', '..', 'scripts', 'backupDatabase.js');
  exec(`node "${scriptPath}"`, (error: import('child_process').ExecException | null, stdout: string, stderr: string) => {
    if (error) {
      console.error('Erro no backup agendado:', error);
    } else {
      console.log('Backup agendado executado:', stdout);
    }
  });
});

export default app;