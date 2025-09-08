
import request from 'supertest';
import app from '../app';

let SCHEMA: string;
let token: string;

describe('List User Controller', () => {
  beforeAll(async () => {
    // Cria uma igreja e obtém o schema dinâmico
    const emailIgreja = `igreja_listuser_${Date.now()}@eklesia.app.br`;
    const churchRes = await request(app)
      .post('/api/igrejas')
      .send({
        nome: 'Igreja Teste ListUser',
        email: emailIgreja,
        senhaAdmin: 'Alsib@2025',
        endereco: 'Rua dos Usuários, 123',
      });
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

  it('deve listar usuários', async () => {
    const res = await request(app)
      .get('/api/usuarios')
      .set('schema', SCHEMA)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
