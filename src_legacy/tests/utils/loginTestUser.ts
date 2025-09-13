import request from 'supertest';
import app from '../../app';
import { seedAdminAndSuper } from '../utils/seedAdminSuperuser';

export async function loginTestUser(email = 'admin@tenant.test', senha = 'Teste123!', schema = 'tenant_test') {
  // Primeira tentativa
  let res = await request(app)
    .post('/api/auth/login')
    .set('schema', schema)
    .send({ email, senha });
  if (res.status === 200) return res.body.token as string;

  // Tenta semear e repetir (mitiga condições de corrida com resetTestSchema)
  await seedAdminAndSuper(schema);
  res = await request(app)
    .post('/api/auth/login')
    .set('schema', schema)
    .send({ email, senha });
  if (res.status !== 200) {
    throw new Error(`Falha no login de teste (${email}) status=${res.status} body=${JSON.stringify(res.body)}`);
  }
  return res.body.token as string;
}
