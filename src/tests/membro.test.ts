import request from 'supertest';
import { app } from '../app';

describe('CRUD Membro', () => {
  let igrejaId: number;
  let congregacaoId: number;
  let celulaId: number;
  let membroId: number;
  const baseIgreja = 'Igreja Mem ' + Date.now();
  const baseCong = 'Cong Mem ' + Date.now();
  const baseCel = 'Cel Mem ' + Date.now();
  const baseMembro = 'Membro Test ' + Date.now();

  it('setup cadeia igreja->congregacao->celula', async () => {
    const ig = await request(app).post('/igrejas').send({ nome: baseIgreja });
    expect(ig.status).toBe(201); igrejaId = ig.body.id;
    const cg = await request(app).post('/congregacoes').send({ nome: baseCong, igrejaId });
    expect(cg.status).toBe(201); congregacaoId = cg.body.id;
    const cl = await request(app).post('/celulas').send({ nome: baseCel, congregacaoId });
    expect(cl.status).toBe(201); celulaId = cl.body.id;
  });

  it('POST /membros cria', async () => {
    const res = await request(app).post('/membros').send({ nome: baseMembro, celulaId, email: 'membro'+Date.now()+'@ex.com' });
    expect(res.status).toBe(201);
    membroId = res.body.id;
  });

  it('GET /membros lista inclui', async () => {
    const res = await request(app).get('/membros');
    expect(res.status).toBe(200);
    expect(res.body.find((m: any) => m.id === membroId)).toBeTruthy();
  });

  it('GET /membros/:id retorna', async () => {
    const res = await request(app).get(`/membros/${membroId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(membroId);
  });

  it('PUT /membros/:id atualiza', async () => {
    const res = await request(app).put(`/membros/${membroId}`).send({ nome: baseMembro + ' Upd', telefone: '11999990000' });
    expect(res.status).toBe(200);
    expect(res.body.nome).toContain('Upd');
  });

  it('GET nested /celulas/:celulaId/membros inclui', async () => {
    const res = await request(app).get(`/celulas/${celulaId}/membros`);
    expect(res.status).toBe(200);
    expect(res.body.find((m: any) => m.id === membroId)).toBeTruthy();
  });

  it('POST nested /celulas/:celulaId/membros cria outro', async () => {
    const res = await request(app).post(`/celulas/${celulaId}/membros`).send({ nome: baseMembro + ' 2' });
    expect(res.status).toBe(201);
  });

  it('DELETE /membros/:id remove', async () => {
    const res = await request(app).delete(`/membros/${membroId}`);
    expect(res.status).toBe(200);
  });

  it('GET /membros/:id após delete 404', async () => {
    const res = await request(app).get(`/membros/${membroId}`);
    expect(res.status).toBe(404);
  });
});
