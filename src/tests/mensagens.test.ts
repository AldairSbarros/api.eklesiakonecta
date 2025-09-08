import request from 'supertest';
import app from '../app';

describe('Mensagens API', () => {
  jest.setTimeout(30000); // Increase timeout to 30 seconds
  let token: string;
  let celulaId: number;
  let schema: string;
  let igrejaId: number;
  let congregacaoId: number;

  beforeAll(async () => {
    // Cria igreja via API
    const churchRes = await request(app)
      .post('/api/igrejas')
      .send({
        nome: 'Igreja Teste',
        email: `igreja${Date.now()}@teste.com`,
        senhaAdmin: 'SenhaForte123!'
      });
    expect(churchRes.status).toBe(201);
    schema = churchRes.body.igreja.schema;
    igrejaId = churchRes.body.igreja.id;

    // Login admin
    const loginRes = await request(app)
      .post('/api/auth/login')
      .set('schema', schema)
      .send({ email: churchRes.body.igreja.email, senha: 'SenhaForte123!' });
    expect(loginRes.status).toBe(200);
    token = loginRes.body.token;

    // Cria congregação via API
    const congregacaoRes = await request(app)
      .post('/api/congregacoes')
      .set('Authorization', `Bearer ${token}`)
      .set('schema', schema)
      .send({ nome: 'Congregação Teste', churchId: igrejaId, endereco: 'Rua Teste' });
    expect(congregacaoRes.status).toBe(201);
    congregacaoId = congregacaoRes.body.id;

    // Cria célula via API
    const celulaRes = await request(app)
      .post('/api/celulas')
      .set('Authorization', `Bearer ${token}`)
      .set('schema', schema)
      .send({ nome: 'Célula Mensagem Teste', congregacaoId });
    expect(celulaRes.status).toBe(201);
    celulaId = celulaRes.body.id;
  });

  it('deve enviar mensagem interna para célula', async () => {
    const res = await request(app)
      .post('/api/mensagens-celula')
      .set('schema', schema)
      .set('Authorization', `Bearer ${token}`)
      .send({
        titulo: 'Aviso',
        conteudo: 'Reunião amanhã!'
      });
    expect(res.status === 200 || res.status === 201).toBe(true);
    expect(res.body).toHaveProperty('id');
  });
});
