import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

app.get('/health', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok' });
  } catch (e: any) {
    res.status(500).json({ status: 'error', error: e.message });
  }
});

app.post('/usuarios', async (req: Request, res: Response) => {
  const { nome, email, senha } = req.body || {};
  if (!nome || !email || !senha) {
    return res.status(400).json({ message: 'nome, email, senha são obrigatórios' });
  }
  try {
    const existing = await prisma.usuario.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Email já cadastrado' });
    const senhaHash = await bcrypt.hash(senha, 10);
    const usuario = await prisma.usuario.create({ data: { nome, email, senhaHash } });
    res.status(201).json({ id: usuario.id, nome: usuario.nome, email: usuario.email });
  } catch (e: any) {
    res.status(500).json({ message: 'Erro ao criar usuário', error: e.message });
  }
});

app.get('/usuarios', async (_req: Request, res: Response) => {
  const usuarios = await prisma.usuario.findMany({ orderBy: { id: 'asc' } });
  res.json(usuarios.map(u => ({ id: u.id, nome: u.nome, email: u.email })));
});

app.get('/usuarios/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const usuario = await prisma.usuario.findUnique({ where: { id } });
  if (!usuario) return res.status(404).json({ message: 'Não encontrado' });
  res.json({ id: usuario.id, nome: usuario.nome, email: usuario.email });
});

app.put('/usuarios/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { nome } = req.body || {};
  if (!nome) return res.status(400).json({ message: 'nome obrigatório' });
  try {
    const updated = await prisma.usuario.update({ where: { id }, data: { nome } });
    res.json({ id: updated.id, nome: updated.nome, email: updated.email });
  } catch (e: any) {
    res.status(404).json({ message: 'Não encontrado' });
  }
});

app.delete('/usuarios/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    await prisma.usuario.delete({ where: { id } });
    res.json({ message: 'Removido' });
  } catch {
    res.status(404).json({ message: 'Não encontrado' });
  }
});

app.get('/', (_req: Request, res: Response) => {
  res.json({ name: 'API Eklesia Konecta - Single Tenant', status: 'ok' });
});

export { app };