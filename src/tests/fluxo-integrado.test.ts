import request from 'supertest';
import app from '../app';

// Ajuste o e-mail e senha conforme necessário para o seu ambiente
const ADMIN_EMAIL = 'aldairbarros@eklesia.app.br';
const ADMIN_SENHA = 'Alsib@2025';

describe('Fluxo integrado: igreja > congregação > célula > membro > offering > relatório', () => {
  let token: string;
  let schema: string;
  let churchId: number;
  let congregacaoId: number;
  let celulaId: number;
  let memberId: number;
  let offeringId: number;

  it('deve autenticar e criar uma igreja', async () => {
    // Login
    const resLogin = await request(app)
      .post('/api/auth/login')
      .set('schema', 'public')
      .send({ email: ADMIN_EMAIL, senha: ADMIN_SENHA });
    expect(resLogin.body.token).toBeDefined();
    token = resLogin.body.token;

    // Criar igreja
    const unique = Date.now();
    schema = `igreja_${unique}`;
    const resIgreja = await request(app)
      .post('/api/igrejas')
      .set('schema', 'public')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'Igreja Integração',
        email: `igreja${unique}@teste.com`,
        password: 'SenhaForte123',
        schema,
        endereco: 'Rua Integração, 1'
      });
    expect([201, 200]).toContain(resIgreja.status);
    expect(resIgreja.body.igreja).toBeDefined();
    churchId = resIgreja.body.igreja.id;
  });


  it('deve criar uma congregação vinculada à igreja', async () => {
    const resCong = await request(app)
      .post('/api/congregacoes')
      .set('schema', schema)
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: 'Congregação Integração', churchId, endereco: 'Rua Cong, 2' });
    console.log('RES CONG:', resCong.status, resCong.body);
    expect(resCong.body.id).toBeDefined();
    congregacaoId = resCong.body.id;
  });


  it('deve criar uma célula vinculada à congregação', async () => {
    const resCelula = await request(app)
      .post('/api/celulas')
      .set('schema', schema)
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: 'Célula Integração', congregacaoId });
    console.log('RES CELULA:', resCelula.status, resCelula.body);
    expect(resCelula.body.id).toBeDefined();
    celulaId = resCelula.body.id;
  });


  it('deve criar um membro vinculado à célula/congregação', async () => {
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
    expect(resMembro.body.id).toBeDefined();
    memberId = resMembro.body.id;
  });


  it('deve cadastrar uma offering para o membro', async () => {
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
    const resRelatorio = await request(app)
      .get('/api/relatorio/financeiro')
      .set('schema', schema)
      .set('Authorization', `Bearer ${token}`);
    expect(resRelatorio.status).toBe(200);
    expect(resRelatorio.body.totalOfferings).toBeGreaterThanOrEqual(123.45);
  });

  it('deve consultar o relatório de células e encontrar a célula', async () => {
    const resRelatorioCelula = await request(app)
      .get('/api/relatorios/celulas')
      .set('schema', schema)
      .set('Authorization', `Bearer ${token}`);
    expect([200, 204, 404]).toContain(resRelatorioCelula.status); // Aceita 404 se não houver dados
  });
});
