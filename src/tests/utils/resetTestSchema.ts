import { getPrisma } from '../../utils/prismaDynamic';

// Limpa tabelas principais do schema de teste para reaproveitar evitando recriação de schemas
export async function resetTestSchema(schema = 'tenant_test') {
  const prisma = getPrisma(schema);
  // Ordem para evitar FKs – ajustar conforme necessário
  const tables = [
    '"Offering"', '"Despesa"', '"Receita"', '"Investimento"', '"UsuarioPermissao"', '"Notificacao"', '"MensagemCelula"',
    '"TokenRecuperacaoSenha"', '"Arquivo"', '"Log"', '"ReuniaoCelula"', '"PresencaCelula"', '"VisitanteCelula"', '"Celula"',
    '"Member"', '"Congregacao"', '"Church"', '"Pastor"', '"Usuario"'
  ];
  for (const t of tables) {
    try { await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${t} RESTART IDENTITY CASCADE`); } catch {}
  }
}
