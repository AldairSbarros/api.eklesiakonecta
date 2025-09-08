import request from 'supertest';
import app from '../app';

// Teste: superuser pode criar uma nova igreja

describe('Superuser pode criar igreja', () => {
  let token: string;

  beforeAll(async () => {
    // Login como superuser (devUser)
    const res = await request(app)
      .post('/api/auth/login')
      .set('schema', 'public')
      .send({ email: 'dev@eklesia.app.br', senha: 'devsenha123' }); // ajuste para um devUser válido
    token = res.body.token;
  });

  it('deve permitir que o superuser crie uma nova igreja', async () => {
    const uniqueSuffix = `${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    const email = `igreja${uniqueSuffix}@teste.com`;
    const schemaNovo = `igreja_${uniqueSuffix}`;

    const res = await request(app)
      .post('/api/igrejas')
      .set('schema', 'public')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'Igreja Superuser',
        email,
        password: 'SenhaForte123',
        schema: schemaNovo,
        endereco: 'Rua do Superuser, 123'
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('igreja');
    expect(res.body.igreja).toHaveProperty('id');
  });
});
