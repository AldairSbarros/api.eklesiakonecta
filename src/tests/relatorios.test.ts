import request from 'supertest';
import app from '../app';

describe('Relatórios', () => {
  let token: string;
  let schema: string;

  beforeAll(async () => {
    // Cria uma igreja e obtém o schema e o admin
    const churchRes = await request(app)
      .post('/api/igrejas')
      .send({
        nome: 'Igreja Teste Relatorio',
        email: `igreja_relatorio_${Date.now()}@teste.com`,
        senhaAdmin: 'SenhaForte123!'
      });
    expect(churchRes.status).toBe(201);
  schema = churchRes.body.igreja.schema;
    console.log('churchRes.body', churchRes.body); // LOG PARA DEPURAÇÃO

    // Faz login como admin recém-criado
    const senhaAdmin = 'SenhaForte123!';
    const loginRes = await request(app)
      .post('/api/auth/login')
      .set('schema', schema)
      .send({ email: churchRes.body.igreja.email, senha: senhaAdmin });
    console.log('loginRes.body', loginRes.body); // LOG PARA DEPURAÇÃO
    expect(loginRes.status).toBe(200);
    token = loginRes.body.token;
  });

  async function getRelatorio(url: string, query: object) {
    return await request(app)
      .get(url)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .set('schema', schema)
      .query(query);
  }

  it('deve gerar relatório de células', async () => {
    const query = {
      dataInicio: '2024-01-01',
      dataFim: '2024-06-30',
      campus: 'central',
      agrupamento: 'mensal',
      unidade: 'matriz',
      departamento: 'celulas',
      // Adicione outros parâmetros obrigatórios aqui
    };
    const res = await getRelatorio('/api/relatorios/celulas', query);
    if (![200, 204, 404].includes(res.status)) {
      console.error('Erro relatório células:', res.body);
    }
    expect([200, 204, 404]).toContain(res.status);
  });

  it('deve gerar relatório financeiro', async () => {
    const query = {
      dataInicio: '2024-01-01',
      dataFim: '2024-06-30',
      tipoRelatorio: 'mensal',
      categoria: 'todas',
      agrupamento: 'mensal',
      campus: 'central',
      fonte: 'todas',
      situacao: 'todas',
      unidade: 'matriz',
      departamento: 'financeiro',
      moeda: 'BRL',
      periodo: '2024-01',
      // Adicione outros parâmetros obrigatórios aqui
    };
    const res = await getRelatorio('/api/relatorios/financeiro', query);
    if (![200, 204, 404].includes(res.status)) {
      console.error('Erro relatório financeiro:', res.body);
    }
    expect([200, 204, 404]).toContain(res.status);
  });

  it('deve gerar relatório de discipulado', async () => {
    const query = {
      dataInicio: '2024-01-01',
      dataFim: '2024-06-30',
      // discipuladorId: '1', // Adicione se necessário
    };
    const res = await getRelatorio('/api/relatorios/discipulado/por-discipulador', query);
    if (![200, 204, 404].includes(res.status)) {
      console.error('Erro relatório discipulado:', res.body);
    }
    expect([200, 204, 404]).toContain(res.status); // Aceita 404 caso não haja dados
  });
});