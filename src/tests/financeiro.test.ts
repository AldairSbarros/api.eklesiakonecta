import request from 'supertest';
import app from '../app';

describe('Financeiro', () => {
  let token: string;
  let schemaCliente: string;
  let churchId: number;
  let congregacaoId: number;
  let memberId: number;

  beforeAll(async () => {
    // Cria uma igreja dinâmica
    const email = `igreja${Date.now()}@teste.com`;
    const resIgreja = await request(app)
      .post('/api/igrejas')
      .send({
        nome: 'Igreja Teste',
        email,
        password: 'SenhaForte123',
        endereco: 'Rua Teste, 123'
      });
    expect(resIgreja.status).toBe(201);
    schemaCliente = resIgreja.body.igreja.schema;
    churchId = resIgreja.body.igreja.id;
    // Login como admin da igreja criada
    const resLogin = await request(app)
      .post('/api/auth/login')
      .set('schema', schemaCliente)
      .send({ email, senha: 'SenhaForte123' });
    expect(resLogin.status).toBe(200);
    token = resLogin.body.token;

    // Crie uma congregação no novo schema
    const resCong = await request(app)
      .post('/api/congregacoes')
      .set('schema', schemaCliente)
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: 'Congregação Teste', churchId, endereco: 'Rua Teste' });
    expect(resCong.status).toBe(201);
    congregacaoId = resCong.body.id;

    // Crie um membro no novo schema
    const resMembro = await request(app)
      .post('/api/membros')
      .set('schema', schemaCliente)
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'Membro Teste',
        email: `membro${Date.now()}@teste.com`,
        congregacaoId
      });
    expect(resMembro.status).toBe(201);
    memberId = resMembro.body.id;
  }, 30000);

  it('deve cadastrar uma oferta', async () => {
    const res = await request(app)
      .post('/api/offerings')
      .set('schema', schemaCliente)
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: 'dizimo',
        valor: 100,
        data: new Date().toISOString(),
        congregacaoId,
        memberId
      });
    console.log('OFFERING RESPONSE:', res.status, res.body);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('deve listar ofertas', async () => {
    const res = await request(app)
      .get('/api/offerings')
      .set('schema', schemaCliente)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
