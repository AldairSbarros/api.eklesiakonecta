import request from 'supertest';
import app from '../app';

describe('Multi-tenancy: fluxo completo e isolamento', () => {
  let tokenA: string;
  let tokenB: string;
  let schemaA: string;
  let schemaB: string;
  let igrejaA: any;
  let igrejaB: any;
  let congregacaoA: any;
  let congregacaoB: any;
  let celulaA: any;
  let celulaB: any;
  let membroA: any;
  let membroB: any;
  let userA: any;
  let userB: any;
  let offeringA: any;
  let offeringB: any;

  it('deve criar duas igrejas e autenticar', async () => {
    // Igreja A
    const emailA = `igrejaA${Date.now()}@teste.com`;
    const emailB = `igrejaB${Date.now()}@teste.com`;
    const password = '123456';

    // Igreja A
    const resA = await request(app)
      .post('/api/igrejas')
      .send({ nome: 'Igreja A', email: emailA, password });
    expect(resA.status).toBe(201);
    igrejaA = resA.body.igreja;
    schemaA = igrejaA.schema;
    console.log('IGREJA A:', igrejaA);
    console.log('SCHEMA A:', schemaA);

    // Igreja B
    const resB = await request(app)
      .post('/api/igrejas')
      .send({ nome: 'Igreja B', email: emailB, password });
    expect(resB.status).toBe(201);
    igrejaB = resB.body.igreja;
    schemaB = igrejaB.schema;
    console.log('IGREJA B:', igrejaB);
    console.log('SCHEMA B:', schemaB);

    // Login A
    const loginA = await request(app)
      .post('/api/auth/login')
      .send({ email: emailA, senha: password });
    console.log('LOGIN A STATUS:', loginA.status, loginA.body);
    expect(loginA.status).toBe(200);
    tokenA = loginA.body.token;

    // Login B
    const loginB = await request(app)
      .post('/api/auth/login')
      .send({ email: emailB, senha: password });
    console.log('LOGIN B STATUS:', loginB.status, loginB.body);
    expect(loginB.status).toBe(200);
    tokenB = loginB.body.token;
  });

  it('deve criar congregação, célula, membro e usuário em cada igreja', async () => {
    // Congregação A
    const resCongA = await request(app)
      .post('/api/congregacoes')
      .set('Authorization', `Bearer ${tokenA}`)
      .set('X-Church-Schema', schemaA)
      .send({ nome: 'Congregação A', churchId: igrejaA.id, endereco: 'Rua 1' });
    expect(resCongA.status).toBe(201);
    congregacaoA = resCongA.body;

    // Congregação B
    const resCongB = await request(app)
      .post('/api/congregacoes')
      .set('Authorization', `Bearer ${tokenB}`)
      .set('X-Church-Schema', schemaB)
      .send({ nome: 'Congregação B', churchId: igrejaB.id, endereco: 'Rua 2' });
    expect(resCongB.status).toBe(201);
    congregacaoB = resCongB.body;

    // Célula A
    const resCelA = await request(app)
      .post('/api/celulas')
      .set('Authorization', `Bearer ${tokenA}`)
      .set('X-Church-Schema', schemaA)
      .send({ nome: 'Célula A', congregacaoId: congregacaoA.id });
    expect(resCelA.status).toBe(201);
    celulaA = resCelA.body;

    // Célula B
    const resCelB = await request(app)
      .post('/api/celulas')
      .set('Authorization', `Bearer ${tokenB}`)
      .set('X-Church-Schema', schemaB)
      .send({ nome: 'Célula B', congregacaoId: congregacaoB.id });
    expect(resCelB.status).toBe(201);
    celulaB = resCelB.body;

    // Membro A
    const resMembroA = await request(app)
      .post('/api/membros')
      .set('Authorization', `Bearer ${tokenA}`)
      .set('X-Church-Schema', schemaA)
      .send({ nome: 'Membro A', email: `membroA${Date.now()}@teste.com`, congregacaoId: congregacaoA.id, celulaId: celulaA.id });
    expect(resMembroA.status).toBe(201);
    membroA = resMembroA.body;

    // Membro B
    const resMembroB = await request(app)
      .post('/api/membros')
      .set('Authorization', `Bearer ${tokenB}`)
      .set('X-Church-Schema', schemaB)
      .send({ nome: 'Membro B', email: `membroB${Date.now()}@teste.com`, congregacaoId: congregacaoB.id, celulaId: celulaB.id });
    expect(resMembroB.status).toBe(201);
    membroB = resMembroB.body;
  });

  it('deve registrar offerings (dízimo/oferta) em cada igreja e célula', async () => {
    // Dízimo A (igreja)
    const resOffA = await request(app)
      .post('/api/offerings')
      .set('Authorization', `Bearer ${tokenA}`)
      .set('X-Church-Schema', schemaA)
      .send({ type: 'dizimo', valor: 100, data: new Date().toISOString(), congregacaoId: congregacaoA.id, memberId: membroA.id });
    expect(resOffA.status).toBe(201);
    offeringA = resOffA.body;

    // Oferta B (célula)
    const resOffB = await request(app)
      .post('/api/offerings')
      .set('Authorization', `Bearer ${tokenB}`)
      .set('X-Church-Schema', schemaB)
      .send({ type: 'oferta', valor: 50, data: new Date().toISOString(), congregacaoId: congregacaoB.id, memberId: membroB.id, celulaId: celulaB.id });
    expect(resOffB.status).toBe(201);
    offeringB = resOffB.body;
  });

  it('deve consultar relatórios financeiros e de células, garantindo isolamento', async () => {
    // Relatório financeiro A
    const resRelA = await request(app)
      .get('/api/relatorio/financeiro')
      .set('Authorization', `Bearer ${tokenA}`)
      .set('X-Church-Schema', schemaA);
    expect(resRelA.status).toBe(200);
    expect(JSON.stringify(resRelA.body)).toContain('dizimo');
    expect(JSON.stringify(resRelA.body)).not.toContain('oferta');

    // Relatório financeiro B
    const resRelB = await request(app)
      .get('/api/relatorio/financeiro')
      .set('Authorization', `Bearer ${tokenB}`)
      .set('X-Church-Schema', schemaB);
    expect(resRelB.status).toBe(200);
    expect(JSON.stringify(resRelB.body)).toContain('oferta');
    expect(JSON.stringify(resRelB.body)).not.toContain('dizimo');

    // Relatório de células A
    const resCelRelA = await request(app)
      .get('/api/relatorio/celulas')
      .set('Authorization', `Bearer ${tokenA}`)
      .set('X-Church-Schema', schemaA);
    expect(resCelRelA.status).toBe(200);
    expect(JSON.stringify(resCelRelA.body)).toContain('Célula A');
    expect(JSON.stringify(resCelRelA.body)).not.toContain('Célula B');

    // Relatório de células B
    const resCelRelB = await request(app)
      .get('/api/relatorio/celulas')
      .set('Authorization', `Bearer ${tokenB}`)
      .set('X-Church-Schema', schemaB);
    expect(resCelRelB.status).toBe(200);
    expect(JSON.stringify(resCelRelB.body)).toContain('Célula B');
    expect(JSON.stringify(resCelRelB.body)).not.toContain('Célula A');
  });
});
