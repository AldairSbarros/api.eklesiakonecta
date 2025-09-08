import request from 'supertest';
import app from '../app';

describe('Discipulado', () => {
  let token: string;
  let schema: string;
  let igrejaId: number;
  let congregacaoId: number;
  let membroId: number;
  let celulaId: number;

  beforeAll(async () => {
    // Cria igreja via API
    jest.setTimeout(30000);
    let token: string;
    let schema: string;
    let igrejaId: number;
    let congregacaoId: number;
    let membroId: number;
    let celulaId: number;

    beforeAll(async () => {
      // Cria igreja via API
      const churchRes = await request(app)
        .post('/api/igrejas')
        .send({
          nome: 'Igreja Teste',
          email: `igreja${Date.now()}@teste.com`,
          senhaAdmin: 'TestPassword123!'
        });
      console.log('RES IGREJA:', churchRes.status, churchRes.body);
      expect(churchRes.status).toBe(201);
      expect(churchRes.body.igreja).toBeDefined();
      schema = churchRes.body.igreja.schema;
      igrejaId = churchRes.body.igreja.id;

      // Login admin
      const loginRes = await request(app)
        .post('/api/auth/login')
        .set('schema', schema)
        .send({ email: churchRes.body.igreja.email, senha: 'TestPassword123!' });
      console.log('RES LOGIN:', loginRes.status, loginRes.body);
      expect(loginRes.status).toBe(200);
      expect(loginRes.body.token).toBeDefined();
      token = loginRes.body.token;

      // Cria congregação via API
      const congregacaoRes = await request(app)
        .post('/api/congregacoes')
        .set('Authorization', `Bearer ${token}`)
        .set('schema', schema)
        .send({
          nome: 'Congregação Teste',
          churchId: igrejaId,
          endereco: 'Rua Teste, 123'
        });
      console.log('RES CONG:', congregacaoRes.status, congregacaoRes.body);
      expect(congregacaoRes.status).toBe(201);
      expect(congregacaoRes.body.id).toBeDefined();
      congregacaoId = congregacaoRes.body.id;

      // Cria célula via API
      const celulaRes = await request(app)
        .post('/api/celulas')
        .set('Authorization', `Bearer ${token}`)
        .set('schema', schema)
        .send({
          nome: 'Célula Teste',
          congregacaoId: congregacaoId
        });
      console.log('RES CELULA:', celulaRes.status, celulaRes.body);
      expect(celulaRes.status).toBe(201);
      expect(celulaRes.body.id).toBeDefined();
      celulaId = celulaRes.body.id;

      // Cria discipulador via API
      const discipuladorRes = await request(app)
        .post('/api/membros')
        .set('Authorization', `Bearer ${token}`)
        .set('schema', schema)
        .send({
          nome: 'Discipulador Teste',
          congregacaoId: congregacaoId
        });
      console.log('RES DISCIPULADOR:', discipuladorRes.status, discipuladorRes.body);
      expect(discipuladorRes.status).toBe(201);
      expect(discipuladorRes.body.id).toBeDefined();
      membroId = discipuladorRes.body.id;

      // Cria discipulando via API
      const discipulandoRes = await request(app)
        .post('/api/membros')
        .set('Authorization', `Bearer ${token}`)
        .set('schema', schema)
        .send({
          nome: 'Discipulando Teste',
          congregacaoId: congregacaoId,
          discipuladorId: membroId,
          celulaId: celulaId
        });
      console.log('RES DISCIPULANDO:', discipulandoRes.status, discipulandoRes.body);
      expect(discipulandoRes.status).toBe(201);
      expect(discipulandoRes.body.id).toBeDefined();

  it('deve listar discipulandos de um discipulador', async () => {
    const res = await request(app)
      .get(`/api/discipulado/discipulandos/${membroId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('schema', schema);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('deve criar um discipulando', async () => {
    const res = await request(app)
      .post('/api/discipulado/discipulando')
      .set('Authorization', `Bearer ${token}`)
      .set('schema', schema)
      .send({
        nome: 'Novo Discipulando',
        congregacaoId: congregacaoId,
        discipuladorId: membroId,
        celulaId: celulaId
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.nome).toBe('Novo Discipulando');
  });
});