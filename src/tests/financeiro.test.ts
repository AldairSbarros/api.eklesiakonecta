import request from 'supertest';
import app from '../app';

describe('Financeiro', () => {

  jest.setTimeout(30000);
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
    console.log('RES IGREJA:', resIgreja.status, resIgreja.body);
    expect(resIgreja.status).toBe(201);
    expect(resIgreja.body.igreja).toBeDefined();
    schemaCliente = resIgreja.body.igreja.schema;
    churchId = resIgreja.body.igreja.id;
    // Login como admin da igreja criada
    const resLogin = await request(app)
      .post('/api/auth/login')
      .set('schema', schemaCliente)
      .send({ email, senha: 'SenhaForte123' });
    console.log('RES LOGIN:', resLogin.status, resLogin.body);
    expect(resLogin.status).toBe(200);
    expect(resLogin.body.token).toBeDefined();
    token = resLogin.body.token;

    // Crie uma congregação no novo schema
    const resCong = await request(app)
      .post('/api/congregacoes')
      .set('schema', schemaCliente)
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: 'Congregação Teste', churchId, endereco: 'Rua Teste' });
    console.log('RES CONG:', resCong.status, resCong.body);
    expect(resCong.status).toBe(201);
    expect(resCong.body.id).toBeDefined();
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
    console.log('RES MEMBRO:', resMembro.status, resMembro.body);
    expect(resMembro.status).toBe(201);
    expect(resMembro.body.id).toBeDefined();
    memberId = resMembro.body.id;
  });

  it('deve cadastrar uma oferta', async () => {
    expect(schemaCliente).toBeDefined();
    expect(congregacaoId).toBeDefined();
    expect(memberId).toBeDefined();
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
    expect(schemaCliente).toBeDefined();
    const res = await request(app)
      .get('/api/offerings')
      .set('schema', schemaCliente)
      .set('Authorization', `Bearer ${token}`);
    console.log('LIST OFFERINGS:', res.status, res.body);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
