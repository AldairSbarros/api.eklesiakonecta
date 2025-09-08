import request from 'supertest';
import app from '../app';

let token: string;
let newSchema: string;
let churchId: number;

beforeAll(async () => {
  // Cria igreja dinâmica
  const emailIgreja = `igreja${Date.now()}@teste.com`;
  const resChurch = await request(app)
    .post('/api/igrejas')
    .send({
      nome: 'Igreja Teste',
      email: emailIgreja,
      password: 'SenhaForte123',
      endereco: 'Rua Teste, 123'
    });
  expect(resChurch.status).toBe(201);
  churchId = resChurch.body.igreja.id;
  newSchema = resChurch.body.igreja.schema;
  // Login como admin da igreja criada
  const resLogin = await request(app)
    .post('/api/auth/login')
    .set('schema', newSchema)
    .send({ email: emailIgreja, senha: 'SenhaForte123' });
  expect(resLogin.status).toBe(200);
  token = resLogin.body.token;
});


it.only('should create a tithe', async () => {
  // Cria congregação
  const resCong = await request(app)
    .post('/api/congregacoes')
    .set('schema', newSchema)
    .set('Authorization', `Bearer ${token}`)
    .send({
      nome: 'Congregação Teste',
      churchId: churchId,
      endereco: 'Rua da Congregação, 456'
    });
  expect(resCong.status).toBe(201);
  const congregacaoId = resCong.body.id;

  // Cria membro
  const resMember = await request(app)
    .post('/api/membros')
    .set('schema', newSchema)
    .set('Authorization', `Bearer ${token}`)
    .send({
      nome: 'Membro Teste',
      email: `membro${Date.now()}@teste.com`,
      congregacaoId: congregacaoId
    });
  expect(resMember.status).toBe(201);
  const memberId = resMember.body.id;

  // Cria oferta/dízimo
  const resOffering = await request(app)
    .post('/api/offerings')
    .set('schema', newSchema)
    .set('Authorization', `Bearer ${token}`)
    .send({
      type: 'DIZIMO',
      valor: 100,
      data: new Date('2025-07-01').toISOString(),
      memberId: memberId,
      congregacaoId: congregacaoId
    });


  expect(resOffering.status).toBe(201);
  expect(resOffering.body).toHaveProperty('id');
});
