import request from 'supertest';
import { app } from '../app';

describe('Receitas / Dizimos / Ofertas', () => {
  let igrejaId:number; let congregacaoId:number; let celulaId:number; let membroId:number;
  const uniq = Date.now();
  const mes = new Date().toISOString().substring(0,7); // YYYY-MM

  it('setup estrutura', async () => {
    const ig = await request(app).post('/igrejas').send({ nome: 'Igreja Rec ' + uniq });
    expect(ig.status).toBe(201); igrejaId = ig.body.id;
    const cg = await request(app).post('/congregacoes').send({ nome: 'Cong Rec ' + uniq, igrejaId });
    expect(cg.status).toBe(201); congregacaoId = cg.body.id;
    const cl = await request(app).post('/celulas').send({ nome: 'Cel Rec ' + uniq, congregacaoId });
    expect(cl.status).toBe(201); celulaId = cl.body.id;
    const mb = await request(app).post('/membros').send({ nome: 'Membro Diz ' + uniq, celulaId });
    expect(mb.status).toBe(201); membroId = mb.body.id;
  });

  it('registra primeiro dizimo', async () => {
    const r = await request(app)
      .post(`/congregacoes/${congregacaoId}/receitas`)
      .field('tipo','DIZIMO')
      .field('valor','100.00')
      .field('formaPagamento','ESPECIE')
      .field('membroId', String(membroId));
    expect(r.status).toBe(201);
    expect(r.body.numeroRecibo).toBe(1);
  });

  it('registra segundo dizimo mesmo mês', async () => {
    const r = await request(app)
      .post(`/congregacoes/${congregacaoId}/receitas`)
      .field('tipo','DIZIMO')
      .field('valor','50.00')
      .field('formaPagamento','PIX')
      .field('membroId', String(membroId));
    expect(r.status).toBe(201);
    expect(r.body.numeroRecibo).toBe(2);
  });

  it('registra oferta de culto', async () => {
    const r = await request(app)
      .post(`/congregacoes/${congregacaoId}/receitas`)
      .field('tipo','OFERTA')
      .field('valor','80.00')
      .field('formaPagamento','ESPECIE')
      .field('cultoDescricao','Culto Noite');
    expect(r.status).toBe(201);
    expect(r.body.numeroRecibo).toBe(3);
  });

  it('lista receitas do mês', async () => {
    const r = await request(app).get(`/congregacoes/${congregacaoId}/receitas`).query({ mes });
    expect(r.status).toBe(200);
    expect(r.body.length).toBe(3);
  });

  it('gera relatório financeiro mensal', async () => {
    const r = await request(app).get(`/congregacoes/${congregacaoId}/relatorios/financeiro`).query({ mes });
    expect(r.status).toBe(200);
    expect(r.body.resumo.totalDizimos).toBe(150);
    expect(r.body.resumo.totalOfertas).toBe(80);
    expect(r.body.resumo.totalContribuicoes).toBe(230);
    expect(r.body.totalDizimistas).toBe(1);
    expect(r.body.dizimos.length).toBe(2);
    expect(r.body.ofertas.length).toBe(1);
  });
});
