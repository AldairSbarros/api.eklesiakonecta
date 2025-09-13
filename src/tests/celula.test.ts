import request from 'supertest';
import { app } from '../app';

describe('CRUD Célula', () => {
  let igrejaId: number;
  let congregacaoId: number;
  let celulaId: number;
  const baseIgreja = 'Igreja Cel ' + Date.now();
  const baseCong = 'Cong Cel ' + Date.now();
  const baseCel = 'Celula Test ' + Date.now();

  it('cria igreja', async () => {
    const res = await request(app).post('/igrejas').send({ nome: baseIgreja });
    expect(res.status).toBe(201);
    igrejaId = res.body.id;
  });

  it('cria congregação', async () => {
    const res = await request(app).post('/congregacoes').send({ nome: baseCong, igrejaId });
    expect(res.status).toBe(201);
    congregacaoId = res.body.id;
  });

  it('POST /celulas cria', async () => {
    const res = await request(app).post('/celulas').send({ nome: baseCel, congregacaoId });
    expect(res.status).toBe(201);
    celulaId = res.body.id;
  });

  it('GET /celulas lista inclui', async () => {
    const res = await request(app).get('/celulas');
    expect(res.status).toBe(200);
    expect(res.body.find((c: any) => c.id === celulaId)).toBeTruthy();
  });

  it('GET /celulas/:id retorna', async () => {
    const res = await request(app).get(`/celulas/${celulaId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(celulaId);
  });

  it('PUT /celulas/:id atualiza', async () => {
    const novoNome = baseCel + ' Upd';
    const res = await request(app).put(`/celulas/${celulaId}`).send({ nome: novoNome });
    expect(res.status).toBe(200);
    expect(res.body.nome).toBe(novoNome);
  });

  it('GET nested /congregacoes/:congregacaoId/celulas inclui', async () => {
    const res = await request(app).get(`/congregacoes/${congregacaoId}/celulas`);
    expect(res.status).toBe(200);
    expect(res.body.find((c: any) => c.id === celulaId)).toBeTruthy();
  });

  it('POST nested /congregacoes/:congregacaoId/celulas cria outra', async () => {
    const res = await request(app).post(`/congregacoes/${congregacaoId}/celulas`).send({ nome: baseCel + ' Nested2' });
    expect(res.status).toBe(201);
  });

  it('DELETE /celulas/:id remove', async () => {
    const res = await request(app).delete(`/celulas/${celulaId}`);
    expect(res.status).toBe(200);
  });

  it('GET /celulas/:id após delete 404', async () => {
    const res = await request(app).get(`/celulas/${celulaId}`);
    expect(res.status).toBe(404);
  });
});
