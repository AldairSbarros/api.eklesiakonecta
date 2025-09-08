
import dotenv from 'dotenv';
dotenv.config();
import request from 'supertest';
import app from '../app';

let SCHEMA: string;
let token: string;


jest.setTimeout(30000);
beforeAll(async () => {
  // Cria igreja e faz login dinâmico
  const emailIgreja = `igreja_usuario_${Date.now()}@eklesia.app.br`;
  const senha = 'SenhaForte123';
  const churchRes = await request(app)
    .post('/api/igrejas')
    .send({
      nome: 'Igreja Teste Usuário',
      email: emailIgreja,
      senhaAdmin: senha,
      endereco: 'Rua dos Usuários, 123'
    });
  console.log('RES IGREJA:', churchRes.status, churchRes.body);
  expect(churchRes.status).toBe(201);
  expect(churchRes.body.igreja).toBeDefined();
  SCHEMA = churchRes.body.igreja?.schema;
  // Faz login como admin da igreja criada
  const loginRes = await request(app)
    .post('/api/auth/login')
    .set('schema', SCHEMA)
    .send({ email: emailIgreja, senha });
  console.log('RES LOGIN:', loginRes.status, loginRes.body);
  expect(loginRes.status).toBe(200);
  expect(loginRes.body.token).toBeDefined();
  token = loginRes.body.token;
});


describe('Usuário Controller', () => {
  it('deve cadastrar um novo usuário', async () => {
    expect(SCHEMA).toBeDefined();
    expect(token).toBeDefined();
    const res = await request(app)
      .post('/api/usuarios')
      .set('schema', SCHEMA)
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'Aldair Barros',
        email: `aldairbarros${Date.now()}@eklesia.app.br`,
        senha: 'SenhaForte123',
        perfil: 'ADMIN'
      });
    console.log('RES USUARIO CADASTRO:', res.status, res.body);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('deve listar usuários', async () => {
    expect(SCHEMA).toBeDefined();
    const res = await request(app)
      .get('/api/usuarios')
      .set('schema', SCHEMA)
      .set('Authorization', `Bearer ${token}`);
    console.log('RES USUARIO LIST:', res.status, res.body);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('deve autenticar um usuário e retornar token', async () => {
    expect(SCHEMA).toBeDefined();
    const email = `aldairbarros${Date.now()}@eklesia.app.br`;
    // Cadastra o usuário
    const resCadastro = await request(app)
      .post('/api/usuarios')
      .set('schema', SCHEMA)
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'Aldair Barros',
        email,
        senha: 'Alsib@2025',
        perfil: 'ADMIN'
      });
    console.log('RES USUARIO AUTH CADASTRO:', resCadastro.status, resCadastro.body);
    expect(resCadastro.status).toBe(201);
    // Faz login
    const res = await request(app)
      .post('/api/auth/login')
      .set('schema', SCHEMA)
      .send({ email, senha: 'Alsib@2025' });
    console.log('RES USUARIO AUTH LOGIN:', res.status, res.body);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});

