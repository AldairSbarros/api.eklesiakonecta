import request from 'supertest';
import app from '../app';

let SCHEMA: string;
let token: string;

describe('Remove User Controller', () => {
  beforeAll(async () => {
    // Cria uma igreja e obtém o schema dinâmico
    const emailIgreja = `igreja_removeuser_${Date.now()}@eklesia.app.br`;
    const churchRes = await request(app)
      .post('/api/igrejas')
      .send({
        nome: 'Igreja Teste RemoveUser',
        email: emailIgreja,
        senhaAdmin: 'Alsib@2025',
        endereco: 'Rua dos Usuários, 123',
      });
    console.log('CHURCH RESPONSE:', churchRes.status, churchRes.body);
    expect(churchRes.status).toBe(201);
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

  it('deve remover um usuário', async () => {
    // Cria um usuário para remover
    const email = `remove${Date.now()}@teste.com`;
    const resCadastro = await request(app)
      .post('/api/usuarios')
      .set('schema', SCHEMA)
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'Usuário Remove',
        email,
        senha: 'Alsib@2025',
        perfil: 'ADMIN',
      });
    console.log('CADASTRO USUÁRIO RESPONSE:', resCadastro.status, resCadastro.body);
    expect(resCadastro.status).toBe(201);
    const userId = resCadastro.body.id;

    // Remove o usuário
    const resDelete = await request(app)
      .delete(`/api/usuarios/${userId}`)
      .set('schema', SCHEMA)
      .set('Authorization', `Bearer ${token}`);

    console.log('Remover:', resDelete.status, resDelete.body);

    expect(resDelete.status).toBe(200);
    expect(resDelete.body.message).toMatch(/removido com sucesso/i);
  });
  });
