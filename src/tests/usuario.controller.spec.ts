
import dotenv from 'dotenv';
dotenv.config();
import request from 'supertest';
import app from '../app';

let SCHEMA: string;
let token: string;

beforeAll(async () => {
  // Cria uma igreja e obtém o schema dinâmico
  const emailIgreja = `igreja_usuario_${Date.now()}@eklesia.app.br`;
  const churchRes = await request(app)
    .post('/api/igrejas')
    .send({
      nome: 'Igreja Teste Usuário',
      email: emailIgreja,
      password: 'Alsib@2025',
      cnpj: `${Date.now()}12345`,
      token: process.env.TOKEN_ADMIN
    });
  console.log('churchRes.body:', churchRes.body);
  expect(churchRes.status).toBe(201);
  SCHEMA = churchRes.body.igreja?.schema;
  // Faz login como admin da igreja criada
  const loginRes = await request(app)
    .post('/api/auth/login')
    .set('schema', SCHEMA)
    .send({ email: emailIgreja, senha: 'Alsib@2025' });
  expect(loginRes.status).toBe(200);
  token = loginRes.body.token;
});

describe('Usuário Controller', () => {
  it('deve cadastrar um novo usuário', async () => {
    const res = await request(app)
      .post('/api/usuarios')
      .set('schema', SCHEMA)
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'Aldair Barros',
        email: `aldairbarros${Date.now()}@eklesia.app.br`,
        senha: 'Alsib@2025',
        perfil: 'ADMIN',
        token: process.env.TOKEN_ADMIN
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('deve listar usuários', async () => {
    const res = await request(app)
      .get('/api/usuarios')
      .set('schema', SCHEMA)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('deve autenticar um usuário e retornar token', async () => {
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
        perfil: 'ADMIN',
        token: process.env.TOKEN_ADMIN
      });
    expect(resCadastro.status).toBe(201);
    // Faz login
    const res = await request(app)
      .post('/api/auth/login')
      .set('schema', SCHEMA)
      .send({ email, senha: 'Alsib@2025' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});

