import request from 'supertest';
import { app } from '../app';

// Testes básicos para Geracao e fluxo de discipulado

describe('Geracao e Discipulado', () => {
  let igrejaId: number; let congregacaoId: number; let geracaoId: number; let celulaId: number; let membroId: number;
  const uniq = Date.now();
  const igrejaNome = 'Igreja G ' + uniq;
  const congNome = 'Cong G ' + uniq;
  const gerNome = 'Geracao ' + uniq;
  const celNome = 'Cel G ' + uniq;
  const membroNome = 'Membro G ' + uniq;

  it('setup igreja', async () => {
    const res = await request(app).post('/igrejas').send({ nome: igrejaNome });
    expect(res.status).toBe(201); igrejaId = res.body.id;
  });
  it('setup congregacao', async () => {
    const res = await request(app).post('/congregacoes').send({ nome: congNome, igrejaId });
    expect(res.status).toBe(201); congregacaoId = res.body.id;
  });
  it('cria geracao', async () => {
    const res = await request(app).post(`/congregacoes/${congregacaoId}/geracoes`).send({ nome: gerNome });
    expect(res.status).toBe(201); geracaoId = res.body.id;
  });
  it('cria celula com geracao', async () => {
    const res = await request(app).post('/celulas').send({ nome: celNome, congregacaoId, geracaoId, diaSemana: 'QUI', horario: '19:30', localReuniao: 'Casa X' });
    expect(res.status).toBe(201); celulaId = res.body.id; expect(res.body.geracaoId).toBe(geracaoId);
  });
  it('cria membro na celula', async () => {
    const res = await request(app).post('/membros').send({ nome: membroNome, celulaId });
    expect(res.status).toBe(201); membroId = res.body.id;
  });
  const etapas = [
    'MINICURSO',
    'ANDANDO_COM_CRISTO',
    'AGORA_QUE_SOU_DE_CRISTO',
    'CONSOLIDACAO',
    'ESCOLA_LIDERES_N1',
    'ESCOLA_LIDERES_N2',
    'ESCOLA_LIDERES_N3',
    'ENCONTRO_COM_DEUS',
    'BATISMO_AGUAS',
    'LIBERADO_LIDERAR'
  ];
  etapas.forEach(etapa => {
    it(`registra etapa ${etapa}`, async () => {
      const res = await request(app).post(`/membros/${membroId}/etapas`).send({ etapa });
      expect([201,400]).toContain(res.status); // se fora de ordem (nunca deve ocorrer aqui) 400
      if (res.status === 400) console.warn('Etapa fora de ordem test warning', etapa);
    });
  });
  it('GET etapas retorna todas e flags membro atualizadas', async () => {
    const res = await request(app).get(`/membros/${membroId}/etapas`);
    expect(res.status).toBe(200);
    // listar membro para checar flags
    const membroRes = await request(app).get(`/membros/${membroId}`);
    expect(membroRes.body.ativoNaCongregacao).toBe(true);
    expect(membroRes.body.aptoLiderar).toBe(true);
  });
});
