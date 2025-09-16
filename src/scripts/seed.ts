import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { exec } from 'child_process';
import path from 'path';

/*
  Seed multi-schema (apenas um schema de igreja por enquanto)
  Execução em produção: node dist/scripts/seed.js
  Execução em dev: npm run seed:dev (usa ts-node-dev ou ts-node)
*/

const prismaPublic = new PrismaClient();

function buildDbUrlForSchema(schema: string) {
  const base = process.env.DATABASE_URL!;
  if (base.includes('schema=')) return base.replace(/schema=([a-zA-Z0-9_]+)/, `schema=${schema}`);
  const sep = base.includes('?') ? '&' : '?';
  return `${base}${sep}schema=${schema}`;
}

async function ensureSchema(schema: string) {
  const schemaPrismaPath = path.resolve(process.cwd(), 'prisma', 'schema.prisma');
  const dbUrl = buildDbUrlForSchema(schema);
  const cmd = `DATABASE_URL="${dbUrl}" npx prisma db push --schema "${schemaPrismaPath}" --skip-generate`;
  await new Promise<void>((resolve, reject) => {
    exec(cmd, { shell: '/bin/bash' }, (err, _stdout, stderr) => {
      if (err) return reject(new Error(stderr?.toString() || 'Falha ao aplicar schema para seed'));
      resolve();
    });
  });
}

async function main() {
  console.log('[seed] Iniciando seed...');

  // SUPERUSER GLOBAL
  const globalSuperEmail = process.env.SEED_GLOBAL_SUPER_EMAIL || 'super@eklesia.app.br';
  const globalSuperPassPlain = process.env.SEED_GLOBAL_SUPER_PASS || 'SuperGlobal123!';
  const globalSuperHash = await bcrypt.hash(globalSuperPassPlain, 10);

  await prismaPublic.usuario.upsert({
    where: { email: globalSuperEmail },
    update: {},
    create: { nome: 'Super Usuário Global', email: globalSuperEmail, senhaHash: globalSuperHash }
  });
  console.log('[seed] SUPERUSER global ok');

  // IGREJA PADRÃO
  const defaultChurchName = process.env.SEED_CHURCH_NAME || 'Igreja Seed';
  const defaultSchema = process.env.SEED_CHURCH_SCHEMA || 'igreja_seed';
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@igreja.seed';
  const superEmail = process.env.SEED_SUPERUSER_EMAIL || 'superuser@igreja.seed';
  const adminPassPlain = process.env.SEED_ADMIN_PASS || 'AdminSeed123!';
  const superPassPlain = process.env.SEED_SUPERUSER_PASS || 'SuperSeed123!';

  let church = await prismaPublic.igreja.findFirst({ where: { nome: defaultChurchName } });
  if (!church) {
    church = await prismaPublic.igreja.create({ data: { nome: defaultChurchName } });
    console.log('[seed] Igreja padrão criada');
  } else {
    console.log('[seed] Igreja padrão já existente');
  }

  await ensureSchema(defaultSchema);
  console.log('[seed] Schema do tenant garantido:', defaultSchema);

  const prismaTenant = new PrismaClient({ datasources: { db: { url: buildDbUrlForSchema(defaultSchema) } } });

  const adminHash = await bcrypt.hash(adminPassPlain, 10);
  const superHash = await bcrypt.hash(superPassPlain, 10);

  await prismaTenant.usuario.upsert({
    where: { email: adminEmail },
    update: {},
    create: { nome: 'Admin Seed', email: adminEmail, senhaHash: adminHash }
  });

  await prismaTenant.usuario.upsert({
    where: { email: superEmail },
    update: {},
    create: { nome: 'Superuser Seed', email: superEmail, senhaHash: superHash }
  });
  console.log('[seed] Usuários ADMIN e SUPERUSER criados/ok');

  await prismaTenant.$disconnect();

  console.log('\n[seed] Concluído. Credenciais:');
  console.log('  Global SUPERUSER:', globalSuperEmail, globalSuperPassPlain);
  console.log('  Igreja padrão:', defaultChurchName, 'schema=', defaultSchema);
  console.log('  Admin tenant:', adminEmail, adminPassPlain);
  console.log('  Superuser tenant:', superEmail, superPassPlain);
}

main().catch(err => {
  console.error('[seed] ERRO', err);
  process.exit(1);
}).finally(() => prismaPublic.$disconnect());
