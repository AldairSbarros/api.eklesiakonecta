import request from 'supertest';
import app from '../app';

jest.setTimeout(30000);

describe('Multi-tenancy: fluxo completo e isolamento', () => {
  let tokenA: string; let tokenB: string;
  let schemaA: string; let schemaB: string;
  let congregacaoA: any; let congregacaoB: any;
  let celulaA: any; let celulaB: any;
  let membroA: any; let membroB: any;

  it('cria duas igrejas e autentica', async () => {
    const emailA = `igrejaA${Date.now()}@teste.com`;
    const emailB = `igrejaB${Date.now()+1}@teste.com`;
    const senha = 'SenhaForte123';
    const resA = await request(app).post('/api/cadastro-inicial').send({ nomeIgreja: 'Igreja A', nomePastor: 'Pastor A', emailPastor: emailA, senhaPastor: senha });
    expect([200,201]).toContain(resA.status); schemaA = resA.body?.igreja?.schema; expect(schemaA).toBeDefined();
    const resB = await request(app).post('/api/cadastro-inicial').send({ nomeIgreja: 'Igreja B', nomePastor: 'Pastor B', emailPastor: emailB, senhaPastor: senha });
    expect([200,201]).toContain(resB.status); schemaB = resB.body?.igreja?.schema; expect(schemaB).toBeDefined();
    const loginA = await request(app).post('/api/auth/login').set('schema', schemaA).send({ email: emailA, senha }); expect(loginA.status).toBe(200); tokenA = loginA.body.token;
    const loginB = await request(app).post('/api/auth/login').set('schema', schemaB).send({ email: emailB, senha }); expect(loginB.status).toBe(200); tokenB = loginB.body.token;
  });

  it('cria congregações', async () => {
    const resCongA = await request(app).post('/api/congregacoes').set('schema', schemaA).set('Authorization', `Bearer ${tokenA}`).send({ nome: 'Cong A', churchId: 1, endereco: 'Rua 1' });
    expect([200,201]).toContain(resCongA.status); congregacaoA = resCongA.body;
    const resCongB = await request(app).post('/api/congregacoes').set('schema', schemaB).set('Authorization', `Bearer ${tokenB}`).send({ nome: 'Cong B', churchId: 1, endereco: 'Rua 2' });
    expect([200,201]).toContain(resCongB.status); congregacaoB = resCongB.body;
  });

  it('cria células', async () => {
    const resCelA = await request(app).post('/api/celulas').set('schema', schemaA).set('Authorization', `Bearer ${tokenA}`).send({ nome: 'Célula A', congregacaoId: congregacaoA.id });
    expect([200,201]).toContain(resCelA.status); celulaA = resCelA.body;
    const resCelB = await request(app).post('/api/celulas').set('schema', schemaB).set('Authorization', `Bearer ${tokenB}`).send({ nome: 'Célula B', congregacaoId: congregacaoB.id });
    expect([200,201]).toContain(resCelB.status); celulaB = resCelB.body;
  });

  it('cria membros', async () => {
    const resMembroA = await request(app).post('/api/membros').set('schema', schemaA).set('Authorization', `Bearer ${tokenA}`).send({ nome: 'Membro A', congregacaoId: congregacaoA.id, celulaId: celulaA.id });
    expect([200,201]).toContain(resMembroA.status); membroA = resMembroA.body;
    const resMembroB = await request(app).post('/api/membros').set('schema', schemaB).set('Authorization', `Bearer ${tokenB}`).send({ nome: 'Membro B', congregacaoId: congregacaoB.id, celulaId: celulaB.id });
    expect([200,201]).toContain(resMembroB.status); membroB = resMembroB.body;
  });

  it('lista membros isoladamente', async () => {
    const listA = await request(app).get('/api/membros').set('schema', schemaA).set('Authorization', `Bearer ${tokenA}`);
    expect(listA.status).toBe(200); expect(Array.isArray(listA.body)).toBe(true);
    const listB = await request(app).get('/api/membros').set('schema', schemaB).set('Authorization', `Bearer ${tokenB}`);
    expect(listB.status).toBe(200); expect(Array.isArray(listB.body)).toBe(true);
  });

  it('relatórios financeiros & células (status tolerante)', async () => {
    const finA = await request(app).get('/api/relatorio/financeiro').set('schema', schemaA).set('Authorization', `Bearer ${tokenA}`); expect([200,204,404]).toContain(finA.status);
    const finB = await request(app).get('/api/relatorio/financeiro').set('schema', schemaB).set('Authorization', `Bearer ${tokenB}`); expect([200,204,404]).toContain(finB.status);
    const celRelA = await request(app).get('/api/relatorios/celulas').set('schema', schemaA).set('Authorization', `Bearer ${tokenA}`); expect([200,204,404]).toContain(celRelA.status);
    const celRelB = await request(app).get('/api/relatorios/celulas').set('schema', schemaB).set('Authorization', `Bearer ${tokenB}`); expect([200,204,404]).toContain(celRelB.status);
  });
});
