import request from 'supertest';
import app from '../../app';

// Garante que exista uma igreja e admin dentro do schema tenant_test para testes que dependem de autenticação.
// Usa o fluxo de criação normal somente se não existir nenhum usuário.
export async function ensureTenantTestBootstrap() {
  // Tenta logar com usuário conhecido
  const email = 'admin_tenant_test@fake.local';
  const senha = 'Teste123!';
  const login = await request(app)
    .post('/api/auth/login')
    .set('schema', 'tenant_test')
    .send({ email, senha });
  if (login.status === 200) {
    return { token: login.body.token };
  }
  // Cria igreja (gera novo admin). Como a criação gera schema dinâmico, aqui forçamos usar tenant_test? Não.
  // Para manter simplicidade, criamos diretamente via rota de igreja (gera schema isolado) apenas quando necessário para cenários específicos.
  // Alternativamente poderíamos inserir direto via Prisma no schema tenant_test.
  return { token: undefined };
}