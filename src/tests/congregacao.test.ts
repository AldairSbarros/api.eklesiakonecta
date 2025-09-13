import request from 'supertest';
import { app } from '../app';

describe('CRUD Congregacao', () => {
  let igrejaId: number;
  let congregacaoId: number;
  const baseIgreja = 'Igreja Cong Test ' + Date.now();
  const baseCong = 'Congregacao Test ' + Date.now();

  it('cria igreja base', async () => {
    const res = await request(app).post('/igrejas').send({ nome: baseIgreja });
    expect(res.status).toBe(201);
    igrejaId = res.body.id;
  });

  it('POST /congregacoes cria', async () => {
    const res = await request(app).post('/congregacoes').send({ nome: baseCong, igrejaId });
    expect(res.status).toBe(201);
    congregacaoId = res.body.id;
  });

  it('GET /congregacoes lista inclui', async () => {
    const res = await request(app).get('/congregacoes');
    expect(res.status).toBe(200);
    expect(res.body.find((c: any) => c.id === congregacaoId)).toBeTruthy();
  });

  it('GET /congregacoes/:id retorna', async () => {
    const res = await request(app).get(`/congregacoes/${congregacaoId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(congregacaoId);
  });

  it('PUT /congregacoes/:id atualiza', async () => {
    const novoNome = baseCong + ' Upd';
    const res = await request(app).put(`/congregacoes/${congregacaoId}`).send({ nome: novoNome });
    expect(res.status).toBe(200);
    expect(res.body.nome).toBe(novoNome);
  });

  it('GET nested /igrejas/:igrejaId/congregacoes inclui', async () => {
    const res = await request(app).get(`/igrejas/${igrejaId}/congregacoes`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('POST nested /igrejas/:igrejaId/congregacoes cria outra', async () => {
    const res = await request(app).post(`/igrejas/${igrejaId}/congregacoes`).send({ nome: baseCong + ' Nested2' });
    expect(res.status).toBe(201);
  });

  it('DELETE /congregacoes/:id remove', async () => {
    const res = await request(app).delete(`/congregacoes/${congregacaoId}`);
    expect(res.status).toBe(200);
  });

  it('GET /congregacoes/:id após delete 404', async () => {
    const res = await request(app).get(`/congregacoes/${congregacaoId}`);
    expect(res.status).toBe(404);
  });
});
