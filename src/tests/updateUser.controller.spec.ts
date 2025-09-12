import request from 'supertest';
import app from '../app';

let SCHEMA: string;
let token: string;

describe('Update User Controller', () => {
  beforeAll(async () => {
    // Cria uma igreja e obtém o schema dinâmico
    const emailIgreja = `igreja_updateuser_${Date.now()}@eklesia.app.br`;
    const churchRes = await request(app)
      .post('/api/cadastro-inicial')
      .send({
        nomeIgreja: 'Igreja Teste UpdateUser',
        nomePastor: 'Pastor UpdateUser',
        emailPastor: emailIgreja,
        senhaPastor: 'Alsib@2025'
      });
    console.log('CHURCH RESPONSE:', churchRes.status, churchRes.body);
  expect([200,201]).toContain(churchRes.status);
  SCHEMA = churchRes.body.igreja?.schema;
    // Faz login como admin da igreja criada
    const loginRes = await request(app)
      .post('/api/auth/login')
      .set('schema', SCHEMA)
      .send({ email: emailIgreja, senha: 'Alsib@2025' });
    console.log('LOGIN RESPONSE:', loginRes.status, loginRes.body);
    expect(loginRes.status).toBe(200);
    token = loginRes.body.token;
  });

  it('deve atualizar um usuário', async () => {
    const email = `update${Date.now()}@teste.com`;
    const resCadastro = await request(app)
      .post('/api/usuarios')
      .set('schema', SCHEMA)
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'Usuário Update',
        email,
        senha: 'Alsib@2025',
        perfil: 'ADMIN',
      });
    console.log('CADASTRO USUÁRIO RESPONSE:', resCadastro.status, resCadastro.body);
    expect(resCadastro.status).toBe(201);
    const userId = resCadastro.body.id;

    const resUpdate = await request(app)
      .put(`/api/usuarios/${userId}`)
      .set('schema', SCHEMA)
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: 'Usuário Atualizado' });

    expect(resUpdate.status).toBe(200);
    expect(resUpdate.body.nome).toBe('Usuário Atualizado');
  });
});
