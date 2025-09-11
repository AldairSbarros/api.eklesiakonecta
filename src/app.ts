
/// <reference path="./@types/express/index.d.ts" />
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import churchRoutes from './routes/church.routes';
import congregacaoRoutes from './routes/congregacao.routes';
import memberRoutes from './routes/member.routes';
import offeringRoutes from './routes/offering.routes';
import usuarioRoutes from './routes/usuario.routes';
import dashboardRoutes from './routes/dashboard.routes';
import relatorioRoutes from './routes/relatorio.routes';
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
// import relatoriosRoutes from './routes/relatorios.routes'; // Corrigido: era arquivo.routes
import liveRoutes from './routes/live.routes';
import cadastroInicialRoutes from './routes/cadastroInicial.routes';
import * as usuarioController from './controllers/usuario.controller';
import asyncHandler from 'express-async-handler';
import discipuladoRoutes from './routes/discipulado.routes';
import './services/aniversariantes.service';
import swaggerSpec from './docs/swaggerConfig';

const app = express();
app.set('trust proxy', 1);

// Middlewares globais
import { NextFunction } from 'express';

// CORS liberado para todas as origens (apenas para testes)
app.use(cors({
  origin: '*',
  credentials: true
}));

// Middleware para aceitar JSON
app.use(express.json());

// Middleware CORS customizado para headers e métodos
app.use(function (req: Request, res: Response, next: NextFunction): void {
  const origin = req.headers.origin || '*';
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Church-Schema, schema');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});
// Rotas principais
app.use('/api/igrejas', churchRoutes);
app.use('/api/congregacoes', congregacaoRoutes);
app.use('/api/membros', memberRoutes);

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
app.use('/api/relatorio', relatorioRoutes);
app.use('/api/auth', authRoutes); // Inclui /api/auth/login, /api/auth/logout, etc

// Rota alternativa de login de usuário
app.post('/api/usuarios/login', asyncHandler(usuarioController.login));

// Rotas de super admin/dev
app.use('/api', devUserRoutes);

// Rotas para arquivos estáticos
app.use('/uploads', express.static('uploads'));

// Rota base de status
app.get('/', (req: Request, res: Response) => {
  res.send('API Eklesia Konecta rodando');
});

// Cron para backup agendado
const cron = require('node-cron');
const { exec } = require('child_process');
const path = require('path');

cron.schedule('0 2 * * *', () => {
  const scriptPath = path.join(__dirname, '..', '..', 'scripts', 'backupDatabase.js');
  exec(`node "${scriptPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error('Erro no backup agendado:', error);
    } else {
      console.log('Backup agendado executado:', stdout);
    }
  });
});

export default app;