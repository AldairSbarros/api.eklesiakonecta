import request from 'supertest';
import app from '../app';

/**
 * Testa os três fluxos de login:
 * 1. dev-superuser (global) sem schema
 * 2. church-admin (primeiro login da igreja) sem schema
 * 3. tenant-user (usuário normal) com schema em headers variantes
 */

describe('Auth multi-fluxos', () => {
  let churchSchema: string;
  let churchAdminEmail: string;
  let churchAdminSenha = '123456';
  let tenantUserEmail: string;

  beforeAll(async () => {
    // Gera emails únicos
    const ts = Date.now();
    churchAdminEmail = `igreja${ts}@teste.com`;
    tenantUserEmail = `usuario${ts}@teste.com`;

    // 1. Cria igreja via cadastro-inicial (gera church-admin)
    const resCadastro = await request(app)
      .post('/api/cadastro-inicial')
      .send({
        nomeIgreja: 'Igreja Fluxos',
        nomePastor: 'Pastor Fluxos',
        emailPastor: churchAdminEmail,
        senhaPastor: churchAdminSenha
      });
    expect([200,201]).toContain(resCadastro.status);
    churchSchema = resCadastro.body?.igreja?.schema;
    expect(churchSchema).toBeDefined();

    // 2. Login admin (church-admin) -> devolve token e tipo church-admin
    const loginAdmin = await request(app)
      .post('/api/auth/login')
      .send({ email: churchAdminEmail, senha: churchAdminSenha });
    expect(loginAdmin.status).toBe(200);
    expect(loginAdmin.body?.usuario?.tipo).toBe('church-admin');
    const adminToken = loginAdmin.body.token;

    // 3. Cria usuário tenant (perfil Tesoureiro) - ADMIN autenticado pode criar
    const resUsuario = await request(app)
      .post('/api/usuarios')
      .set('Authorization', `Bearer ${adminToken}`)
      .set('schema', churchSchema)
      .send({
        nome: 'Usuário Tenant',
        email: tenantUserEmail,
        senha: '123456',
        perfil: 'Tesoureiro'
      });
    expect([200,201]).toContain(resUsuario.status);
  });

  it('Fluxo 1: deve autenticar dev-superuser (se seed existir) ou pular teste', async () => {
    // Se não existir devUser, considerar teste como pendente.
    const maybeEmail = process.env.TEST_DEV_EMAIL || 'dev@eklesia.local';
    const maybeSenha = process.env.TEST_DEV_SENHA || 'dev123';

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: maybeEmail, senha: maybeSenha });

    if (res.status === 200 && res.body?.usuario?.tipo === 'dev-superuser') {
      expect(res.body.token).toBeDefined();
      expect(res.body.usuario).toEqual(expect.objectContaining({ tipo: 'dev-superuser', email: maybeEmail }));
    } else {
      // Marca como pendente se não seedado
      console.warn('Dev superuser não disponível para teste (ok).');
    }
  });

  it('Fluxo 2: deve autenticar church-admin sem schema', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: churchAdminEmail, senha: churchAdminSenha });
    expect(res.status).toBe(200);
    expect(res.body.usuario).toEqual(expect.objectContaining({ tipo: 'church-admin', schema: churchSchema }));
  });

  it('Fluxo 3a: deve autenticar tenant-user com header schema', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .set('schema', churchSchema)
      .send({ email: tenantUserEmail, senha: '123456' });
    expect(res.status).toBe(200);
    expect(res.body.usuario).toEqual(expect.objectContaining({ tipo: 'tenant-user', schema: churchSchema }));
  });

  it('Fluxo 3b: deve autenticar tenant-user usando header alternativo x-tenant-schema', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .set('x-tenant-schema', churchSchema)
      .send({ email: tenantUserEmail, senha: '123456' });
    expect(res.status).toBe(200);
    expect(res.body.usuario).toEqual(expect.objectContaining({ tipo: 'tenant-user', schema: churchSchema }));
  });

  it('Deve falhar sem schema quando não é dev-superuser nem church-admin', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: tenantUserEmail, senha: '123456' });
    expect(res.status).toBe(400); // espera "Schema não informado" para fluxo tenant
    expect(res.body.error).toMatch(/Schema/i);
  });
});
