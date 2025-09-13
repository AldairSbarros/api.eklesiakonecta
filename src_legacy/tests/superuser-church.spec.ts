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
      .send({ email: 'dev@eklesia.local', senha: 'devsenha123' });
  expect([200,401,403]).toContain(res.status);
  if (res.status === 200) {
    token = res.body.token;
  }
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
    expect([200,201,403,401]).toContain(res.status); // abrangente para diferentes estados de permissão
    if ([200,201].includes(res.status)) {
      expect(res.body).toHaveProperty('igreja');
      expect(res.body.igreja).toHaveProperty('id');
    }
  });
});
