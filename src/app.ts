
/// <reference path="./@types/express/index.d.ts" />
import express, { Request, Response } from 'express';
import helmet from 'helmet';
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
import financeiroRoutes from './routes/financeiro.routes';
import pastorRoutes from './routes/pastor.routes';
import celulaRoutes from './routes/celula.routes';
import devUserRoutes from './routes/devuser.routes';
import discipuladoRoutes from './routes/discipulado.routes';
import { getPrisma } from './utils/prismaDynamic';
import { pruneIdle, getCacheMetrics } from './utils/prismaCache';
import { validarSchemaHeader } from './middleware/schemaHeader';
import { metricsHandler, requestPerSchemaCounter } from './metrics';
import { httpMetricsMiddleware } from './middleware/httpMetrics';
import { metricsTimingMiddleware } from './middleware/observability';
import { getRedis } from './utils/redis';

// Flags de ambiente para MODO MÍNIMO
const DISABLE_METRICS = process.env.DISABLE_METRICS === 'true';
const DISABLE_RATE_LIMIT = process.env.DISABLE_RATE_LIMIT === 'true';
const DISABLE_SCHEMA_HEADER = process.env.DISABLE_SCHEMA_HEADER === 'true';
const DISABLE_MULTI_TENANCY = process.env.DISABLE_MULTI_TENANCY === 'true';

// Rate limit simples por schema em memória
const schemaHits: Record<string, { count: number; windowStart: number }> = {};
const WINDOW_MS = 60 * 1000;
const MAX_HITS = Number(process.env.TENANT_RATE_LIMIT || 600); // 600 req/min default

function rateLimitPorSchema(req: Request, res: Response, next: NextFunction) {
  const schema = (req.headers['schema'] || req.headers['x-church-schema']) as string | undefined;
  if (!schema) return next();
  try { requestPerSchemaCounter.inc({ schema }); } catch {}
  const redis = getRedis();
  if (!redis) {
    const now = Date.now();
    const rec = schemaHits[schema] || { count: 0, windowStart: now };
    if (now - rec.windowStart > WINDOW_MS) {
      rec.count = 0; rec.windowStart = now; }
    rec.count++;
    schemaHits[schema] = rec;
    if (rec.count > MAX_HITS) return res.status(429).json({ error: 'Rate limit excedido para este schema.' });
    return next();
  }
  const key = `rl:${schema}:${Math.floor(Date.now()/WINDOW_MS)}`;
  redis.multi().incr(key).pexpire(key, WINDOW_MS, 'NX').exec()
    .then(results => {
      const count = results?.[0]?.[1];
      if (typeof count === 'number' && count > MAX_HITS) {
        return res.status(429).json({ error: 'Rate limit excedido para este schema.' });
      }
      next();
    }).catch(() => next());
}
import cadastroInicialRoutes from './routes/cadastroInicial.routes';
import * as usuarioController from './controllers/usuario.controller';
import asyncHandler from 'express-async-handler';
// Módulos não essenciais removidos do build (discipulado, escola de líderes, etc.)
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

// Helmet básico (poderá ser expandido na revisão de segurança)
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false
}));
// Middleware para aceitar JSON com limite
app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || '1mb' }));
if (!DISABLE_METRICS) {
  try { app.use(metricsTimingMiddleware as any); } catch {}
  try { app.use(httpMetricsMiddleware as any); } catch {}
}

if (!DISABLE_SCHEMA_HEADER) {
  app.use(validarSchemaHeader as any);
}

if (!DISABLE_RATE_LIMIT) {
  app.use(rateLimitPorSchema as any);
}

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
app.use('/api/cadastro-inicial', cadastroInicialRoutes);
app.use('/api/igrejas', churchRoutes);
app.use('/api/congregacoes', congregacaoRoutes);
app.use('/api/membros', memberRoutes);

// Discipulado
app.use('/api/discipulado', discipuladoRoutes);
// Usuários (CRUD + login via /api/usuarios/login)
app.use('/api/usuarios', usuarioRoutes);

// Finanças
app.use('/api/offerings', offeringRoutes);
app.use('/api/despesas', despesaRoutes);
app.use('/api/receitas', receitaRoutes);
app.use('/api/financeiro', financeiroRoutes);

// Funcionalidades essenciais
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/relatorio', relatorioRoutes);
app.use('/api/pastores', pastorRoutes);
app.use('/api/celulas', celulaRoutes);
app.use('/api/auth', authRoutes); // Inclui /api/auth/login, /api/auth/logout, etc

// (Login já exposto em /api/usuarios/login pelas rotas de usuario)

// Rotas de super admin/dev
app.use('/api', devUserRoutes);

// Rotas para arquivos estáticos
app.use('/uploads', express.static('uploads'));

// Rota base de status
app.get('/', (req: Request, res: Response) => {
  res.send('API Eklesia Konecta rodando');
});

// Endpoint de métricas Prometheus
if (!DISABLE_METRICS) {
  app.get('/metrics', metricsHandler as any);
} else {
  app.get('/metrics', (req: Request, res: Response) => { res.status(204).end(); });
}

// Health multi-tenancy (informações simples)
app.get('/api/health/multi-tenancy', async (req: Request, res: Response) => {
  try {
    // Força prune e coleta de info básica
    pruneIdle?.();
    // Se multi-tenancy desabilitado, só testa schema public
    const prisma = getPrisma('public');
    let churches = 0;
    try { churches = await prisma.church.count(); } catch {}
    const cache = getCacheMetrics();
    res.json({ ok: true, churches, cache, multiTenancy: !DISABLE_MULTI_TENANCY });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Cron para backup agendado (desabilitado em ambiente de teste para não segurar Jest)
if (process.env.NODE_ENV !== 'test') {
  const cron = require('node-cron');
  const { exec } = require('child_process');
  const path = require('path');
  cron.schedule('0 2 * * *', () => {
    const scriptPath = path.join(__dirname, '..', '..', 'scripts', 'backupDatabase.js');
    exec(`node "${scriptPath}"`, (error: any, stdout: any) => {
      if (error) {
        console.error('Erro no backup agendado:', error);
      } else {
        console.log('Backup agendado executado:', stdout);
      }
    });
  });
}

export default app;