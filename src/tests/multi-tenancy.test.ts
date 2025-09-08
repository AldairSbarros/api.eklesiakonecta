import request from 'supertest';
import app from '../app';

describe('Multi-tenancy: isolamento entre igrejas', () => {
  let tokenA: string;
  let tokenB: string;
  let schemaA: string;
  let schemaB: string;
  let igrejaA: any;
  let igrejaB: any;
  let membroA: any;
  let membroB: any;

  it('deve criar duas igrejas distintas e autenticar em cada uma', async () => {
    // Cria igreja A
    const resA = await request(app)
      .post('/api/igrejas')
      .send({ nome: 'Igreja A', email: `igrejaA${Date.now()}@teste.com`, senha: '123456' });
    expect(resA.status).toBe(201);
    igrejaA = resA.body;
    schemaA = igrejaA.schema;

    // Cria igreja B
    const resB = await request(app)
      .post('/api/igrejas')
      .send({ nome: 'Igreja B', email: `igrejaB${Date.now()}@teste.com`, senha: '123456' });
    expect(resB.status).toBe(201);
    igrejaB = resB.body;
    schemaB = igrejaB.schema;

    // Autentica A
    const loginA = await request(app)
      .post('/api/auth/login')
      .send({ email: igrejaA.email, senha: '123456' });
    expect(loginA.status).toBe(200);
    tokenA = loginA.body.token;

    // Autentica B
    const loginB = await request(app)
      .post('/api/auth/login')
      .send({ email: igrejaB.email, senha: '123456' });
    expect(loginB.status).toBe(200);
    tokenB = loginB.body.token;
  });

  it('deve criar membros em cada igreja e garantir isolamento', async () => {
    // Membro A
    const resMembroA = await request(app)
      .post('/api/membros')
      .set('Authorization', `Bearer ${tokenA}`)
      .set('X-Church-Schema', schemaA)
      .send({ nome: 'Membro A', email: `membroA${Date.now()}@teste.com` });
    expect(resMembroA.status).toBe(201);
    membroA = resMembroA.body;

    // Membro B
    const resMembroB = await request(app)
      .post('/api/membros')
      .set('Authorization', `Bearer ${tokenB}`)
      .set('X-Church-Schema', schemaB)
      .send({ nome: 'Membro B', email: `membroB${Date.now()}@teste.com` });
    expect(resMembroB.status).toBe(201);
    membroB = resMembroB.body;
  });

  it('não deve permitir que igreja A veja membros da igreja B', async () => {
    const res = await request(app)
      .get('/api/membros')
      .set('Authorization', `Bearer ${tokenA}`)
      .set('X-Church-Schema', schemaA);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: membroA.id })
      ])
    );
    // Não deve conter membroB
    expect(res.body).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: membroB.id })
      ])
    );
  });

  it('não deve permitir que igreja B veja membros da igreja A', async () => {
    const res = await request(app)
      .get('/api/membros')
      .set('Authorization', `Bearer ${tokenB}`)
      .set('X-Church-Schema', schemaB);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: membroB.id })
      ])
    );
    // Não deve conter membroA
    expect(res.body).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: membroA.id })
      ])
    );
  });
});
