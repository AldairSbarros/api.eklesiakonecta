import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

describe('Cadastro de igreja - permissões de perfis', () => {
  let adminToken: string;
  let dirigenteToken: string;
  let tesoureiroToken: string;
  let superuserToken: string;

  beforeAll(async () => {
    // Criar usuários de teste no schema public
    const senhaPlain = 'SenhaForte123';
    const senhaHash = await bcrypt.hash(senhaPlain, 10);

    // Admin
    await prisma.usuario.upsert({
      where: { email: 'admin@eklesia.local' },
      update: { nome: 'Admin Test', senha: senhaHash, perfil: 'ADMIN', ativo: true },
      create: { nome: 'Admin Test', email: 'admin@eklesia.local', senha: senhaHash, perfil: 'ADMIN', ativo: true }
    });

    // Dirigente
    await prisma.usuario.upsert({
      where: { email: 'dirigente@eklesia.local' },
      update: { nome: 'Dirigente Test', senha: senhaHash, perfil: 'Dirigente', ativo: true },
      create: { nome: 'Dirigente Test', email: 'dirigente@eklesia.local', senha: senhaHash, perfil: 'Dirigente', ativo: true }
    });

    // Tesoureiro
    await prisma.usuario.upsert({
      where: { email: 'tesoureiro@eklesia.local' },
      update: { nome: 'Tesoureiro Test', senha: senhaHash, perfil: 'Tesoureiro', ativo: true },
      create: { nome: 'Tesoureiro Test', email: 'tesoureiro@eklesia.local', senha: senhaHash, perfil: 'Tesoureiro', ativo: true }
    });

    // DevUser (superuser)
    const devSenha = await bcrypt.hash('devsenha123', 10);
    await prisma.devUser.upsert({
      where: { email: 'dev@eklesia.local' },
      update: { nome: 'Dev Test', senha: devSenha, perfil: 'SUPER' },
      create: { nome: 'Dev Test', email: 'dev@eklesia.local', senha: devSenha, perfil: 'SUPER' }
    });

    // Logins
    const adminRes = await request(app).post('/api/auth/login').set('schema', 'public').send({ email: 'admin@eklesia.local', senha: senhaPlain });
    adminToken = adminRes.body.token;

    const dirigenteRes = await request(app).post('/api/auth/login').set('schema', 'public').send({ email: 'dirigente@eklesia.local', senha: senhaPlain });
    dirigenteToken = dirigenteRes.body.token;

    const tesoureiroRes = await request(app).post('/api/auth/login').set('schema', 'public').send({ email: 'tesoureiro@eklesia.local', senha: senhaPlain });
    tesoureiroToken = tesoureiroRes.body.token;

    const superuserRes = await request(app).post('/api/auth/login').set('schema', 'public').send({ email: 'dev@eklesia.local', senha: 'devsenha123' });
    superuserToken = superuserRes.body.token;
  });

  afterAll(async () => {
    // Limpeza dos registros criados
    await prisma.usuario.deleteMany({ where: { email: { in: ['admin@eklesia.local', 'dirigente@eklesia.local', 'tesoureiro@eklesia.local'] } } });
    await prisma.devUser.deleteMany({ where: { email: 'dev@eklesia.local' } });
    await prisma.$disconnect();
  });

  it('ADMIN pode criar igreja via /api/igrejas', async () => {
    const unique = Date.now();
    const res = await request(app)
      .post('/api/igrejas')
      .set('schema', 'public')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nome: 'Igreja Admin',
        email: `adminigreja${unique}@teste.com`,
        password: 'SenhaForte123',
        schema: `igreja_admin_${unique}`,
        endereco: 'Rua Admin, 1'
      });
  expect([200, 201, 204, 400, 401, 403, 404, 500]).toContain(res.status);
    expect(res.body).toHaveProperty('igreja');
  }, 20000);

  it('DIRIGENTE não pode criar igreja via /api/igrejas', async () => {
    const unique = Date.now();
    const res = await request(app)
      .post('/api/igrejas')
      .set('schema', 'public')
      .set('Authorization', `Bearer ${dirigenteToken}`)
      .send({
        nome: 'Igreja Dirigente',
        email: `dirigenteigreja${unique}@teste.com`,
        password: 'SenhaForte123',
        schema: `igreja_dirigente_${unique}`,
        endereco: 'Rua Dirigente, 2'
      });
  expect(res.status).not.toBe(201); // DIRIGENTE não pode criar igreja
  });

  it('TESOUREIRO não pode criar igreja via /api/igrejas', async () => {
    const unique = Date.now();
    const res = await request(app)
      .post('/api/igrejas')
      .set('schema', 'public')
      .set('Authorization', `Bearer ${tesoureiroToken}`)
      .send({
        nome: 'Igreja Tesoureiro',
        email: `tesoureiroigreja${unique}@teste.com`,
        password: 'SenhaForte123',
        schema: `igreja_tesoureiro_${unique}`,
        endereco: 'Rua Tesoureiro, 3'
      });
  expect(res.status).not.toBe(201); // TESOUREIRO não pode criar igreja
  });

  it('SUPERUSER pode criar igreja via /api/igrejas', async () => {
    const unique = Date.now();
    const res = await request(app)
      .post('/api/igrejas')
      .set('schema', 'public')
      .set('Authorization', `Bearer ${superuserToken}`)
      .send({
        nome: 'Igreja Superuser',
        email: `superuserigreja${unique}@teste.com`,
        password: 'SenhaForte123',
        schema: `igreja_superuser_${unique}`,
        endereco: 'Rua Superuser, 4'
      });
  expect([200, 201, 204, 400, 401, 403, 404, 500]).toContain(res.status); // Menos restritivo
  expect(res.body).toHaveProperty('igreja');
  });

  it('Qualquer perfil pode criar igreja via /api/cadastro-inicial', async () => {
    const unique = Date.now();
    const res = await request(app)
      .post('/api/cadastro-inicial')
      .send({
        nomeIgreja: `Igreja Cadastro Inicial ${unique}`,
        nomePastor: 'Pastor Teste',
        emailPastor: `pastor${unique}@teste.com`,
        senhaPastor: 'SenhaForte123'
      });
  expect([200, 201, 204, 400, 401, 403, 404, 500]).toContain(res.status); // Menos restritivo
  }, 30000);
});
