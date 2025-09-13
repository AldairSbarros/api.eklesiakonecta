import request from 'supertest';
import { app } from '../app';

describe('Mínimo /health e /usuarios', () => {
  it('GET /health deve responder ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  let createdId: number;
  it('POST /usuarios cria usuário', async () => {
    const res = await request(app)
      .post('/usuarios')
      .send({ nome: 'Teste', email: `teste_${Date.now()}@t.com`, senha: '123456' });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    createdId = res.body.id;
  });

  it('GET /usuarios lista usuários', async () => {
    const res = await request(app).get('/usuarios');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /usuarios/:id retorna usuário criado', async () => {
    const res = await request(app).get(`/usuarios/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdId);
  });

  it('PUT /usuarios/:id atualiza nome', async () => {
    const res = await request(app)
      .put(`/usuarios/${createdId}`)
      .send({ nome: 'Atualizado' });
    expect(res.status).toBe(200);
    expect(res.body.nome).toBe('Atualizado');
  });

  it('DELETE /usuarios/:id remove', async () => {
    const res = await request(app).delete(`/usuarios/${createdId}`);
    expect(res.status).toBe(200);
  });
});
