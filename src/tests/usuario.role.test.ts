import request from 'supertest';
import { app } from '../app';

describe('Usuário com role', () => {
  it('cria igreja e usuário PASTOR vinculado', async () => {
    const ig = await request(app).post('/igrejas').send({ nome: 'Igreja Role ' + Date.now() });
    expect(ig.status).toBe(201);
    const igrejaId = ig.body.id;
    const res = await request(app).post('/usuarios').send({ nome: 'Pastor João', email: 'pastor'+Date.now()+'@ex.com', senha: '123456', igrejaId, role: 'PASTOR' });
    expect(res.status).toBe(201);
    expect(res.body.role).toBe('PASTOR');
    expect(res.body.igrejaId).toBe(igrejaId);
  });

  it('rejeita role inválido', async () => {
    const res = await request(app).post('/usuarios').send({ nome: 'X', email: 'inv'+Date.now()+'@ex.com', senha: '123456', role: 'INVALIDO' });
    expect(res.status).toBe(400);
  });
});
