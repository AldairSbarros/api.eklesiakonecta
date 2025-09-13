import { getPrisma } from '../../../src/utils/prismaDynamic';
import bcrypt from 'bcrypt';

const ADMIN_EMAIL = 'admin@tenant.test';
const SUPER_EMAIL = 'superuser@tenant.test';
const PASSWORD = 'Teste123!';

export async function seedAdminAndSuper(schema = 'tenant_test') {
  const prisma = getPrisma(schema);
  const senhaHash = await bcrypt.hash(PASSWORD, 10);

  // Garante uma Church base para relacionamentos (se não existir)
  try {
    const anyChurch = await prisma.church.findFirst();
    if (!anyChurch) {
      await prisma.church.create({
        data: {
          nome: 'Church Tenant Test',
          email: 'church@tenant.test',
          password: senhaHash,
          schema: schema,
          status: 'ativa'
        }
      });
    }
  } catch {}

  // Admin
  try {
    await prisma.usuario.upsert({
      where: { email: ADMIN_EMAIL },
      update: {},
      create: {
        nome: 'Admin Tenant',
        email: ADMIN_EMAIL,
        senha: senhaHash,
        perfil: 'ADMIN'
      }
    });
  } catch {}

  // Superuser dentro do tenant (perfil SUPERUSER)
  try {
    await prisma.usuario.upsert({
      where: { email: SUPER_EMAIL },
      update: {},
      create: {
        nome: 'Superuser Tenant',
        email: SUPER_EMAIL,
        senha: senhaHash,
        perfil: 'SUPERUSER'
      }
    });
  } catch {}

  return { adminEmail: ADMIN_EMAIL, superEmail: SUPER_EMAIL, password: PASSWORD };
}