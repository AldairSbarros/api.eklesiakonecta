
import request from 'supertest';
import app from '../app';

jest.setTimeout(30000); // Aumenta timeout global para 30s

describe('Multi-tenancy: isolamento entre igrejas', () => {
  let tokenA: string;
  let tokenB: string;
  let schemaA: string;
  let schemaB: string;
  let igrejaA: any;
  let igrejaB: any;
  let membroA: any;
  let membroB: any;
  let congregacaoA: any;
  let congregacaoB: any;

  it('deve criar duas igrejas distintas, congregações e autenticar em cada uma', async () => {
    // Cria igreja A
    const resA = await request(app)
      .post('/api/igrejas')
      .send({ nome: 'Igreja A', email: `igrejaA${Date.now()}@teste.com`, senhaAdmin: '123456' });
    expect(resA.status).toBe(201);
    igrejaA = resA.body.igreja;
    schemaA = igrejaA.schema;

    // Cria igreja B
    const resB = await request(app)
      .post('/api/igrejas')
      .send({ nome: 'Igreja B', email: `igrejaB${Date.now()}@teste.com`, senhaAdmin: '123456' });
    expect(resB.status).toBe(201);
    igrejaB = resB.body.igreja;
    schemaB = igrejaB.schema;

    // Autentica A
    const loginA = await request(app)
      .post('/api/auth/login')
      .set('schema', schemaA)
      .send({ email: igrejaA.email, senha: '123456' });
    expect(loginA.status).toBe(200);
    tokenA = loginA.body.token;

    // Autentica B
    const loginB = await request(app)
      .post('/api/auth/login')
      .set('schema', schemaB)
      .send({ email: igrejaB.email, senha: '123456' });
    expect(loginB.status).toBe(200);
    tokenB = loginB.body.token;

    // Cria congregação para igreja A
    const resCongA = await request(app)
      .post('/api/congregacoes')
      .set('Authorization', `Bearer ${tokenA}`)
      .set('schema', schemaA)
      .send({ nome: 'Congregação A', churchId: igrejaA.id, endereco: 'Rua Teste, 123' });
    expect(resCongA.status).toBe(201);
    congregacaoA = resCongA.body;

    // Cria congregação para igreja B
    const resCongB = await request(app)
      .post('/api/congregacoes')
      .set('Authorization', `Bearer ${tokenB}`)
      .set('schema', schemaB)
      .send({ nome: 'Congregação B', churchId: igrejaB.id, endereco: 'Rua Teste, 456' });
    expect(resCongB.status).toBe(201);
    congregacaoB = resCongB.body;
  });

  it('deve criar membros em cada igreja e garantir isolamento', async () => {
    // Membro A
    const resMembroA = await request(app)
      .post('/api/membros')
      .set('Authorization', `Bearer ${tokenA}`)
      .set('schema', schemaA)
      .send({ nome: 'Membro A', email: `membroA${Date.now()}@teste.com`, senha: '123456', congregacaoId: congregacaoA.id });
    expect(resMembroA.status).toBe(201);
    membroA = resMembroA.body;

    // Membro B
    const resMembroB = await request(app)
      .post('/api/membros')
      .set('Authorization', `Bearer ${tokenB}`)
      .set('schema', schemaB)
      .send({ nome: 'Membro B', email: `membroB${Date.now()}@teste.com`, senha: '123456', congregacaoId: congregacaoB.id });
    expect(resMembroB.status).toBe(201);
    membroB = resMembroB.body;
  });

  it('não deve permitir que igreja A veja membros da igreja B', async () => {
    const res = await request(app)
      .get('/api/membros')
      .set('Authorization', `Bearer ${tokenA}`)
      .set('X-Church-Schema', schemaA);
  expect(res.status).toBe(200);
  // Deve conter apenas o membro da igreja A
  expect(res.body.length).toBe(1);
  expect(res.body[0]).toEqual(expect.objectContaining({ nome: 'Membro A' }));
  });

  it('não deve permitir que igreja B veja membros da igreja A', async () => {
    const res = await request(app)
      .get('/api/membros')
      .set('Authorization', `Bearer ${tokenB}`)
      .set('X-Church-Schema', schemaB);
  expect(res.status).toBe(200);
  // Deve conter apenas o membro da igreja B
  expect(res.body.length).toBe(1);
  expect(res.body[0]).toEqual(expect.objectContaining({ nome: 'Membro B' }));
  });
});
