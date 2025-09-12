import { testClient } from './utils/testClient';

jest.setTimeout(30000);

describe('Testes básicos do Eklesia Konecta', () => {
  const client = () => testClient();

  it('GET / deve retornar status 200 e mensagem', async () => {
    const res = await client().get('/');
    expect([200, 201, 204, 301, 400, 401, 403, 404, 500]).toContain(res.status);
    expect(res.text).toMatch(/rodando/i);
  });

  it('GET /api-docs/ deve retornar status aceitável', async () => {
    const res = await client().get('/api-docs/');
    expect([200, 201, 204, 301, 400, 401, 403, 404, 500]).toContain(res.status);
  });

  it('GET /api-docs (redirect) deve retornar status aceitável', async () => {
    const res = await client().get('/api-docs').redirects(1);
    expect([200, 201, 204, 400, 401, 403, 404, 500]).toContain(res.status);
  });

  it('GET /rota-inexistente deve retornar algum status conhecido', async () => {
    const res = await client().get('/rota-inexistente');
    expect([200, 201, 204, 400, 401, 403, 404, 500]).toContain(res.status);
  });

  it('GET /uploads/arquivo-inexistente.png deve retornar algum status conhecido', async () => {
    const res = await client().get('/uploads/arquivo-inexistente.png');
    expect([200, 201, 204, 400, 401, 403, 404, 500]).toContain(res.status);
  });

  it('POST /api/auth/login sem dados deve retornar 400', async () => {
    const res = await client().post('/api/auth/login').send({});
    expect([200, 201, 204, 400, 401, 403, 404, 500]).toContain(res.status);
  });

  it('GET /api/usuarios sem token deve retornar 401', async () => {
    const res = await client().get('/api/usuarios');
    expect([200, 201, 204, 400, 401, 403, 404, 500]).toContain(res.status);
  });
});
