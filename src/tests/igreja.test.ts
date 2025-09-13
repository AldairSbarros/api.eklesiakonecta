import request from 'supertest';
import { app } from '../app';

describe('CRUD Igreja', () => {
  let id: number;
  const baseNome = 'Igreja Teste ' + Date.now();

  it('POST /igrejas deve criar', async () => {
    const res = await request(app)
      .post('/igrejas')
      .send({ nome: baseNome });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.nome).toBe(baseNome);
    id = res.body.id;
  });

  it('GET /igrejas lista deve conter a criada', async () => {
    const res = await request(app).get('/igrejas');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    const found = res.body.find((i: any) => i.id === id);
    expect(found).toBeTruthy();
  });

  it('GET /igrejas/:id deve retornar a igreja', async () => {
    const res = await request(app).get(`/igrejas/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(id);
  });

  it('PUT /igrejas/:id deve atualizar nome', async () => {
    const novoNome = baseNome + ' Atualizada';
    const res = await request(app)
      .put(`/igrejas/${id}`)
      .send({ nome: novoNome });
    expect(res.status).toBe(200);
    expect(res.body.nome).toBe(novoNome);
  });

  it('DELETE /igrejas/:id deve remover', async () => {
    const res = await request(app).delete(`/igrejas/${id}`);
    expect(res.status).toBe(200);
  });

  it('GET /igrejas/:id após delete deve 404', async () => {
    const res = await request(app).get(`/igrejas/${id}`);
    expect(res.status).toBe(404);
  });
});
