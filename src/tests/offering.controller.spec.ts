import request from 'supertest';
import app from '../app';

let token: string;
let newSchema: string;
let churchId: number;

beforeAll(async () => {
  jest.setTimeout(30000);
  // Cria igreja dinâmica
  const emailIgreja = `igreja${Date.now()}@teste.com`;
  const resChurch = await request(app)
    .post('/api/cadastro-inicial')
    .send({
      nomeIgreja: 'Igreja Teste',
      nomePastor: 'Pastor Offering',
      emailPastor: emailIgreja,
      senhaPastor: 'SenhaForte123'
    });
  console.log('RES IGREJA:', resChurch.status, resChurch.body);
  expect([200,201]).toContain(resChurch.status);
  churchId = 1;
  newSchema = resChurch.body.igreja.schema;
  // Login como admin da igreja criada
  const resLogin = await request(app)
    .post('/api/auth/login')
    .set('schema', newSchema)
    .send({ email: emailIgreja, senha: 'SenhaForte123' });
  console.log('RES LOGIN:', resLogin.status, resLogin.body);
  expect(resLogin.status).toBe(200);
  expect(resLogin.body.token).toBeDefined();
  token = resLogin.body.token;
});


it('should create a tithe', async () => {
  expect(newSchema).toBeDefined();
  expect(typeof newSchema).toBe('string');
  expect(token).toBeDefined();
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
  console.log('RES CONG:', resCong.status, resCong.body);
  expect(resCong.status).toBe(201);
  expect(resCong.body.id).toBeDefined();
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
  console.log('RES MEMBER:', resMember.status, resMember.body);
  expect(resMember.status).toBe(201);
  expect(resMember.body.id).toBeDefined();
  const memberId = resMember.body.id;

  // Cria oferta/dízimo
  const payload = {
    type: 'dizimo',
    valor: 100,
    data: new Date('2025-07-01').toISOString(),
    memberId,
    congregacaoId
  };
  Object.values(payload).forEach((v) => expect(v).not.toBeUndefined());
  const resOffering = await request(app)
    .post('/api/offerings')
    .set('schema', newSchema)
    .set('Authorization', `Bearer ${token}`)
    .send(payload);
  console.log('RES OFFERING:', resOffering.status, resOffering.body);
  expect([200, 201]).toContain(resOffering.status);
  if (resOffering.status === 201) {
    expect(resOffering.body).toHaveProperty('id');
  }
});
