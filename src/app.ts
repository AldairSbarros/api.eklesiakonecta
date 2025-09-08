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
<<<<<<< HEAD
// import relatoriosRoutes from './routes/relatorios.routes'; // Corrigido: era arquivo.routes
=======
// import relatoriosRoutes from './routes/relatorios.routes';
>>>>>>> 141763c47bccc97b5b7c143a9407e64c2990b451
import liveRoutes from './routes/live.routes';
import cadastroInicialRoutes from './routes/cadastroInicial.routes';
import * as usuarioController from './controllers/usuario.controller';
import asyncHandler from 'express-async-handler';
import discipuladoRoutes from './routes/discipulado.routes';
import './services/aniversariantes.service';

import swaggerSpec from './docs/swaggerConfig';

<<<<<<< HEAD

=======
>>>>>>> 141763c47bccc97b5b7c143a9407e64c2990b451
const app = express();

// Middlewares globais
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(helmet());
<<<<<<< HEAD
// CORS configurado para aceitar apenas o frontend local e permitir headers customizados
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Church-Schema, schema');
  next();
});
app.use(express.json());

// Rota de health check para o frontend (após CORS)
=======

// 🔐 CORS atualizado para ambientes local e de produção
const allowedOrigins = [
  'http://localhost:5173',
  'https://api.eklesia.app.br:3001',
  'https://eklesia.app.br',
  'http://eklesia.app.br',
  'https://www.eklesia.app.br',
  'http://www.eklesia.app.br'
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
>>>>>>> 141763c47bccc97b5b7c143a9407e64c2990b451
app.get('/test', (req: Request, res: Response) => {
  res.status(200).json({ ok: true });
});

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

<<<<<<< HEAD
// Rota de cadastro inicial (sem autenticação)
app.use('/api', cadastroInicialRoutes);

// Rotas de transmissões ao vivo (lives)
app.use('/api/lives', liveRoutes);

// Rotas principais de entidades
=======
// Rotas abertas
app.use('/api', cadastroInicialRoutes);
app.use('/api/lives', liveRoutes);

// Rotas principais
>>>>>>> 141763c47bccc97b5b7c143a9407e64c2990b451
app.use('/api/igrejas', churchRoutes);
app.use('/api/congregacoes', congregacaoRoutes);
app.use('/api/membros', memberRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/pastores', pastorRoutes);

<<<<<<< HEAD
// Rotas de células e reuniões
=======
// Células
>>>>>>> 141763c47bccc97b5b7c143a9407e64c2990b451
app.use('/api/celulas', celulaRoutes);
app.use('/api/reunioes-celula', reuniaoCelulaRoutes);
app.use('/api/presencas-celula', presencaCelulaRoutes);
app.use('/api/visitantes-celula', visitanteCelulaRoutes);
app.use('/api/mensagens-celula', mensagemCelulaRoutes);

<<<<<<< HEAD
// Rotas de discipulado (CRUD completo)
app.use('/api/discipulado', discipuladoRoutes);

// Rotas de ministérios e escola de líderes
=======
// Discipulado
app.use('/api/discipulado', discipuladoRoutes);

// Ministério & Escola de líderes
>>>>>>> 141763c47bccc97b5b7c143a9407e64c2990b451
app.use('/api/ministerios-locais', ministerioLocalRoutes);
app.use('/api/escola-lideres-turmas', escolaLideresTurmaRoutes);
app.use('/api/escola-lideres-licoes', escolaLideresLicaoRoutes);

<<<<<<< HEAD
// Rotas de finanças
=======
// Finanças
>>>>>>> 141763c47bccc97b5b7c143a9407e64c2990b451
app.use('/api/offerings', offeringRoutes);
app.use('/api/despesas', despesaRoutes);
app.use('/api/receitas', receitaRoutes);
app.use('/api/investimentos', investimentosRoutes);
app.use('/api/financeiro', financeiroRoutes);
app.use('/api/faturas', faturaRoutes);

<<<<<<< HEAD
// Outras rotas de funcionalidades
=======
// Funcionalidades
>>>>>>> 141763c47bccc97b5b7c143a9407e64c2990b451
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
<<<<<<< HEAD
app.use('/api/auth', authRoutes); // Inclui /api/auth/login, /api/auth/logout, etc

// Rota alternativa de login de usuário
app.post('/api/usuarios/login', asyncHandler(usuarioController.login));

// Rotas de super admin/dev
app.use('/api', devUserRoutes);

// Rotas para arquivos estáticos
app.use('/uploads', express.static('uploads'));

// Rota base de status
=======
app.use('/api/auth', authRoutes);

// Login alternativo
app.post('/api/usuarios/login', asyncHandler(usuarioController.login));

// Dev rotas
app.use('/api', devUserRoutes);

// Arquivos estáticos
app.use('/uploads', express.static('uploads'));

// Rota base
>>>>>>> 141763c47bccc97b5b7c143a9407e64c2990b451
app.get('/', (req: Request, res: Response) => {
  res.send('API Eklesia Konecta rodando');
});

<<<<<<< HEAD
// Cron para backup agendado
=======
// Cron de backup
>>>>>>> 141763c47bccc97b5b7c143a9407e64c2990b451
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