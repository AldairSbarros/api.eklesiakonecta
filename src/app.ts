import express from 'express';
import path from 'path';
import { prisma } from './core/prisma';
import usuarioRoutes from './routes/usuario.routes';
import igrejaRoutes from './routes/igreja.routes';
import congregacaoRoutes from './routes/congregacao.routes';
import geracaoRoutes from './routes/geracao.routes';
import celulaRoutes from './routes/celula.routes';
import membroRoutes from './routes/membro.routes';
import receitaRoutes from './routes/receita.routes';
import { AppError } from './utils/AppError';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './docs/swaggerConfig';

const app = express();
app.use(express.json());

// Arquivos estáticos (uploads)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Healthcheck
app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok' });
  } catch (e: any) {
    res.status(500).json({ status: 'error', error: e.message });
  }
});

// Root
app.get('/', (_req, res) => res.json({ name: 'API Eklesia Konecta - Single Tenant', status: 'ok' }));

// OpenAPI JSON
app.get('/openapi.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Montagem de rotas de domínio
app.use(usuarioRoutes);
app.use(igrejaRoutes);
app.use(congregacaoRoutes);
app.use(geracaoRoutes);
app.use(celulaRoutes);
app.use(membroRoutes);
app.use(receitaRoutes);

// 404 handler
app.use((req, res, next) => {
  if (res.headersSent) return next();
  res.status(404).json({ message: 'Rota não encontrada' });
});

// Error handler central
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof AppError) return res.status(err.status).json({ message: err.message });
  if (err?.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ message: 'Arquivo excede 5MB' });
  if (err?.message?.includes('Tipo de arquivo')) return res.status(400).json({ message: err.message });
  console.error('Erro não tratado:', err);
  res.status(500).json({ message: 'Erro interno' });
});

export { app };