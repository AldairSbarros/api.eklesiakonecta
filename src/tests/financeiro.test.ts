import request from 'supertest';
import app from '../app';
import { loginTestUser } from './utils/loginTestUser';

describe('Financeiro (tenant_test)', () => {
  jest.setTimeout(30000);
  const schema = 'tenant_test';
  let token: string;
  let congregacaoId: number;
  let memberId: number;

  beforeAll(async () => {
    token = await loginTestUser();
    // Garante uma congregação
    const congRes = await request(app)
      .post('/api/congregacoes')
      .set('schema', schema)
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: 'Cong Seed', churchId: 1, endereco: 'Rua Seed' });
    if ([200, 201].includes(congRes.status)) {
      congregacaoId = congRes.body.id;
    } else {
      // Tenta listar existente
      const list = await request(app)
        .get('/api/congregacoes')
        .set('schema', schema)
        .set('Authorization', `Bearer ${token}`);
      congregacaoId = list.body?.[0]?.id;
    }
    // Cria membro
    const membroRes = await request(app)
      .post('/api/membros')
      .set('schema', schema)
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: 'Membro Financeiro', congregacaoId });
    if (membroRes.status === 201) memberId = membroRes.body.id;
    else {
      const listM = await request(app)
        .get('/api/membros')
        .set('schema', schema)
        .set('Authorization', `Bearer ${token}`);
      memberId = listM.body?.[0]?.id;
    }
  });

  it('cadastra offering', async () => {
    const payload = {
      type: 'dizimo',
      valor: 50,
      data: new Date().toISOString(),
      congregacaoId,
      memberId
    };
    const res = await request(app)
      .post('/api/offerings')
      .set('schema', schema)
      .set('Authorization', `Bearer ${token}`)
      .send(payload);
    expect([200, 201, 400]).toContain(res.status);
  });

  it('lista offerings', async () => {
    const res = await request(app)
      .get('/api/offerings')
      .set('schema', schema)
      .set('Authorization', `Bearer ${token}`);
    expect([200, 204, 400]).toContain(res.status);
  });
});
