import request from 'supertest';
import app from '../app';
import { loginTestUser } from './utils/loginTestUser';
import { seedAdminAndSuper } from './utils/seedAdminSuperuser';

// Teste básico do endpoint /financeiro/relatorio-mensal/snapshot
// Usa schema tenant_test preparado em jest.setup.ts

describe('Financeiro Snapshot (tenant_test)', () => {
  const schema = 'tenant_test';
  let token: string;
  let congregacaoId: number = 1;

  beforeAll(async () => {
    await seedAdminAndSuper(schema);
    token = await loginTestUser();
  });

  it('gera e recomputa snapshot mensal (sem reset intermediário)', async () => {
    // Garantir congregação existente para este teste (após seeds resetados globalmente)
    const resCong = await request(app)
      .post('/api/congregacoes')
      .set('schema', schema)
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: 'Cong Snap', churchId: 1, endereco: 'Rua X' });
    if ([200,201].includes(resCong.status)) {
      congregacaoId = resCong.body.id;
    } else {
      const list = await request(app)
        .get('/api/congregacoes')
        .set('schema', schema)
        .set('Authorization', `Bearer ${token}`);
      if (Array.isArray(list.body) && list.body.length) congregacaoId = list.body[0].id;
    }

    const agora = new Date();
    const mes = agora.getMonth() + 1;
    const ano = agora.getFullYear();

    // Primeira chamada (gera ou retorna)
    const primeira = await request(app)
      .get(`/api/financeiro/relatorio-mensal/snapshot?congregacaoId=${congregacaoId}&mes=${mes}&ano=${ano}`)
      .set('schema', schema)
      .set('Authorization', `Bearer ${token}`);
    expect([200,201]).toContain(primeira.status);

    // Segunda chamada forçando recomputar
    const segunda = await request(app)
      .get(`/api/financeiro/relatorio-mensal/snapshot?congregacaoId=${congregacaoId}&mes=${mes}&ano=${ano}&recomputar=true`)
      .set('schema', schema)
      .set('Authorization', `Bearer ${token}`);
    expect([200,201]).toContain(segunda.status);
  });
});
