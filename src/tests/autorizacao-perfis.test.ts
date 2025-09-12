import request from 'supertest';
import app from '../app';
import { loginTestUser } from './utils/loginTestUser';
import { seedAdminAndSuper } from './utils/seedAdminSuperuser';

// Testa regras básicas de autorização por perfil usando o schema tenant_test.
// Pré-condições: seed cria ADMIN (admin@tenant.test) e SUPERUSER (superuser@tenant.test)

const schema = 'tenant_test';

async function login(email: string) {
  const res = await request(app)
    .post('/api/auth/login')
    .set('schema', schema)
    .send({ email, senha: 'Teste123!' });
  if (res.status !== 200) throw new Error('Falha login teste ' + email);
  return res.body.token as string;
}

describe('Autorização por perfis (tenant_test)', () => {
  jest.setTimeout(20000);
  let adminToken: string;
  let superToken: string;

  beforeAll(async () => {
    await seedAdminAndSuper(schema);
    adminToken = await login('admin@tenant.test');
    superToken = await login('superuser@tenant.test');
  });

  it('SUPERUSER deve acessar rota protegida de usuários', async () => {
    const res = await request(app)
      .get('/api/usuarios')
      .set('schema', schema)
      .set('Authorization', `Bearer ${superToken}`);
    expect([200,204]).toContain(res.status);
  });

  it('ADMIN deve acessar listagem de usuários', async () => {
    const res = await request(app)
      .get('/api/usuarios')
      .set('schema', schema)
      .set('Authorization', `Bearer ${adminToken}`);
    expect([200,204]).toContain(res.status);
  });

  it('Requisição sem token deve retornar 401/403', async () => {
    const res = await request(app)
      .get('/api/usuarios')
      .set('schema', schema);
    expect([401,403]).toContain(res.status);
  });
});
