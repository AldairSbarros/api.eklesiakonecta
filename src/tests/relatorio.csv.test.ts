import request from 'supertest';
import { app } from '../app';

// Testa exportação CSV e cache (segunda chamada deve vir mais rápido e mesmo conteúdo)

describe('Relatório financeiro CSV', () => {
  let congregacaoId:number; let igrejaId:number; let celulaId:number; let membroId:number; const mes = new Date().toISOString().substring(0,7);
  const uniq = Date.now();

  beforeAll(async () => {
    const ig = await request(app).post('/igrejas').send({ nome: 'Igreja CSV ' + uniq }); igrejaId = ig.body.id;
    const cg = await request(app).post('/congregacoes').send({ nome: 'Cong CSV ' + uniq, igrejaId }); congregacaoId = cg.body.id;
    const cl = await request(app).post('/celulas').send({ nome: 'Cel CSV ' + uniq, congregacaoId }); celulaId = cl.body.id;
    const mb = await request(app).post('/membros').send({ nome: 'Membro CSV ' + uniq, celulaId }); membroId = mb.body.id;
    // receitas
    await request(app).post(`/congregacoes/${congregacaoId}/receitas`).field('tipo','DIZIMO').field('valor','100').field('formaPagamento','ESPECIE').field('membroId', String(membroId));
    await request(app).post(`/congregacoes/${congregacaoId}/receitas`).field('tipo','OFERTA').field('valor','40').field('formaPagamento','PIX').field('cultoDescricao','Manhã');
  });

  it('exporta CSV', async () => {
    const r = await request(app).get(`/congregacoes/${congregacaoId}/relatorios/financeiro`).query({ mes, formato: 'csv' });
    expect(r.status).toBe(200);
    expect(r.headers['content-type']).toContain('text/csv');
    expect(r.headers['content-disposition']).toContain('attachment');
    const text = r.text.trim();
    expect(text).toContain('DIZIMO,1');
    expect(text).toContain('OFERTA,2');
    expect(text).toContain('RESUMO_TOTAL');
  });

  it('retorna JSON padrão sem formato', async () => {
    const r = await request(app).get(`/congregacoes/${congregacaoId}/relatorios/financeiro`).query({ mes });
    expect(r.status).toBe(200);
    expect(r.body.resumo.totalContribuicoes).toBe(140);
  });
});
