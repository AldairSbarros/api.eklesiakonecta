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
    const churchRes = await request(app)
      .post('/api/igrejas')
      .send({
        nome: 'Igreja Teste',
        email: `igreja${Date.now()}@teste.com`,
        senhaAdmin: 'TestPassword123!'
      });
    expect(churchRes.status).toBe(201);
    schema = churchRes.body.igreja.schema;
    igrejaId = churchRes.body.igreja.id;

    // Login admin
    const loginRes = await request(app)
      .post('/api/auth/login')
      .set('schema', schema)
      .send({ email: churchRes.body.igreja.email, senha: 'TestPassword123!' });
    expect(loginRes.status).toBe(200);
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
    expect(congregacaoRes.status).toBe(201);
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
    expect(celulaRes.status).toBe(201);
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
    expect(discipuladorRes.status).toBe(201);
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
    expect(discipulandoRes.status).toBe(201);
  });

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