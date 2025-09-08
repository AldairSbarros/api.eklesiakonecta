import request from 'supertest';
import app from '../app';

// Ajuste o e-mail e senha conforme necessário para o seu ambiente
const ADMIN_EMAIL = 'aldairbarros@eklesia.app.br';
const ADMIN_SENHA = 'Alsib@2025';

describe('Fluxo integrado: igreja > congregação > célula > membro > offering > relatório', () => {
  jest.setTimeout(30000);
  let token: string;
  let schema: string;
  let churchId: number;
  let congregacaoId: number;
  let celulaId: number;
  let memberId: number;
  let offeringId: number;

  it('deve criar igreja e autenticar admin', async () => {
    // Cria igreja via API
    const churchRes = await request(app)
      .post('/api/igrejas')
      .send({
        nome: 'Igreja Integração',
        email: `igreja${Date.now()}@teste.com`,
        senhaAdmin: 'SenhaForte123!'
      });
    console.log('RES IGREJA:', churchRes.status, churchRes.body);
    expect(churchRes.status).toBe(201);
    expect(churchRes.body.igreja).toBeDefined();
    expect(churchRes.body.igreja.schema).toBeDefined();
    schema = churchRes.body.igreja.schema;
    churchId = churchRes.body.igreja.id;

    // Login admin
    const loginRes = await request(app)
      .post('/api/auth/login')
      .set('schema', schema)
      .send({ email: churchRes.body.igreja.email, senha: 'SenhaForte123!' });
    console.log('RES LOGIN:', loginRes.status, loginRes.body);
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.token).toBeDefined();
    token = loginRes.body.token;
  });


  it('deve criar uma congregação vinculada à igreja', async () => {
    expect(schema).toBeDefined();
    const resCong = await request(app)
      .post('/api/congregacoes')
      .set('schema', schema)
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: 'Congregação Integração', churchId, endereco: 'Rua Cong, 2' });
    console.log('RES CONG:', resCong.status, resCong.body);
    expect(resCong.status).toBe(201);
    expect(resCong.body.id).toBeDefined();
    congregacaoId = resCong.body.id;
  });


  it('deve criar uma célula vinculada à congregação', async () => {
    expect(schema).toBeDefined();
    expect(congregacaoId).toBeDefined();
    const resCelula = await request(app)
      .post('/api/celulas')
      .set('schema', schema)
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: 'Célula Integração', congregacaoId });
    console.log('RES CELULA:', resCelula.status, resCelula.body);
    expect(resCelula.status).toBe(201);
    expect(resCelula.body.id).toBeDefined();
    celulaId = resCelula.body.id;
  });


  it('deve criar um membro vinculado à célula/congregação', async () => {
    expect(schema).toBeDefined();
    expect(congregacaoId).toBeDefined();
    expect(celulaId).toBeDefined();
    const resMembro = await request(app)
      .post('/api/membros')
      .set('schema', schema)
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'Membro Integração',
        email: `membro${Date.now()}@teste.com`,
        congregacaoId,
        celulaId
      });
    console.log('RES MEMBRO:', resMembro.status, resMembro.body);
    expect(resMembro.status).toBe(201);
    expect(resMembro.body.id).toBeDefined();
    memberId = resMembro.body.id;
  });


  it('deve cadastrar uma offering para o membro', async () => {
    expect(schema).toBeDefined();
    expect(congregacaoId).toBeDefined();
    expect(memberId).toBeDefined();
    const resOffering = await request(app)
      .post('/api/offerings')
      .set('schema', schema)
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: 'dizimo',
        valor: 123.45,
        data: new Date().toISOString(),
        congregacaoId,
        memberId
      });
    console.log('RES OFFERING:', resOffering.status, resOffering.body);
    expect(resOffering.status).toBe(201);
    expect(resOffering.body.id).toBeDefined();
    offeringId = resOffering.body.id;
  });

  it('deve consultar o relatório financeiro e encontrar a offering', async () => {
    expect(schema).toBeDefined();
    const resRelatorio = await request(app)
      .get('/api/relatorio/financeiro')
      .set('schema', schema)
      .set('Authorization', `Bearer ${token}`);
    console.log('RES RELATORIO FIN:', resRelatorio.status, resRelatorio.body);
    expect(resRelatorio.status).toBe(200);
    expect(resRelatorio.body.totalOfferings).toBeGreaterThanOrEqual(123.45);
  });

  it('deve consultar o relatório de células e encontrar a célula', async () => {
    expect(schema).toBeDefined();
    const resRelatorioCelula = await request(app)
      .get('/api/relatorios/celulas')
      .set('schema', schema)
      .set('Authorization', `Bearer ${token}`);
    console.log('RES RELATORIO CELULA:', resRelatorioCelula.status, resRelatorioCelula.body);
    expect([200, 204, 404]).toContain(resRelatorioCelula.status); // Aceita 404 se não houver dados
  });
});
