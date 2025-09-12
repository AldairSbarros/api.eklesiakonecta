import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { exec } from 'child_process';
import path from 'path';

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
  // ============ SUPERUSER GLOBAL (DevUser) ============
  const globalSuperEmail = process.env.SEED_GLOBAL_SUPER_EMAIL || 'super@eklesia.app.br';
  const globalSuperPassPlain = process.env.SEED_GLOBAL_SUPER_PASS || 'SuperGlobal123!';
  const globalSuperHash = await bcrypt.hash(globalSuperPassPlain, 10);

  await prismaPublic.devUser.upsert({
    where: { email: globalSuperEmail },
    update: {},
    create: {
      nome: 'Super Usuário Global',
      email: globalSuperEmail,
      senha: globalSuperHash,
      perfil: 'SUPERUSER',
      ativo: true
    }
  });
  console.log('[seed] DevUser SUPERUSER global ok');

  // ============ IGREJA PADRÃO + ADMIN & SUPERUSER TENANT ============
  const defaultChurchName = process.env.SEED_CHURCH_NAME || 'Igreja Seed';
  const defaultChurchEmail = process.env.SEED_CHURCH_EMAIL || 'igreja.seed@eklesia.local';
  const defaultChurchPassPlain = process.env.SEED_CHURCH_PASS || 'IgrejaSeed123!';
  const defaultSchema = process.env.SEED_CHURCH_SCHEMA || 'igreja_seed';
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@igreja.seed';
  const superEmail = process.env.SEED_SUPERUSER_EMAIL || 'superuser@igreja.seed';
  const adminPassPlain = process.env.SEED_ADMIN_PASS || 'AdminSeed123!';
  const superPassPlain = process.env.SEED_SUPERUSER_PASS || 'SuperSeed123!';

  // Church no schema público
  let church = await prismaPublic.church.findFirst({ where: { schema: defaultSchema } });
  if (!church) {
    const hashed = await bcrypt.hash(defaultChurchPassPlain, 10);
    church = await prismaPublic.church.create({
      data: {
        nome: defaultChurchName,
        email: defaultChurchEmail,
        password: hashed,
        schema: defaultSchema,
        status: 'ativa'
      }
    });
    console.log('[seed] Church padrão criada');
  } else {
    console.log('[seed] Church padrão já existente');
  }

  // Provisiona schema da church
  await ensureSchema(defaultSchema);

  // Prisma apontando para schema da church
  const prismaTenant = new PrismaClient({ datasources: { db: { url: buildDbUrlForSchema(defaultSchema) } } });
  const adminHash = await bcrypt.hash(adminPassPlain, 10);
  const superHash = await bcrypt.hash(superPassPlain, 10);

  // Admin
  await prismaTenant.usuario.upsert({
    where: { email: adminEmail },
    update: {},
    create: { nome: 'Admin Seed', email: adminEmail, senha: adminHash, perfil: 'ADMIN' }
  });
  // Superuser dentro do tenant
  await prismaTenant.usuario.upsert({
    where: { email: superEmail },
    update: {},
    create: { nome: 'Superuser Seed', email: superEmail, senha: superHash, perfil: 'SUPERUSER' }
  });
  console.log('[seed] Usuários ADMIN e SUPERUSER no tenant padrão ok');

  await prismaTenant.$disconnect();

  console.log('[seed] Concluído. Credenciais:');
  console.log('  DevUser SUPERUSER:', globalSuperEmail, globalSuperPassPlain);
  console.log('  Church:', defaultChurchEmail, defaultChurchPassPlain, 'schema=', defaultSchema);
  console.log('  Admin Tenant:', adminEmail, adminPassPlain);
  console.log('  Superuser Tenant:', superEmail, superPassPlain);
}

main()
  .catch(e => {
    console.error('[seed] ERRO', e);
    process.exit(1);
  })
  .finally(() => prismaPublic.$disconnect());