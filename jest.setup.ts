import { ensureSchema } from './src/utils/schemaProvisioner';
import { resetTestSchema } from './src/tests/utils/resetTestSchema';
import { seedAdminAndSuper } from './src/tests/utils/seedAdminSuperuser';
import { clearPrismaCache } from './src/utils/prismaDynamic';
import { shutdownPrismaCache } from './src/utils/prismaCache';
import { getRedis } from './src/utils/redis';

// Garante schema de teste antes da suíte
beforeAll(async () => {
  await ensureSchema('tenant_test');
  await resetTestSchema('tenant_test');
  await seedAdminAndSuper('tenant_test');
});

afterEach(async () => {
  await resetTestSchema('tenant_test');
  await seedAdminAndSuper('tenant_test');
});

// Fecha conexões ao final
afterAll(async () => {
  try { await resetTestSchema('tenant_test'); } catch {}
  try { clearPrismaCache(); } catch {}
  try { shutdownPrismaCache(); } catch {}
  try {
    const r = getRedis();
    if (r) await r.quit();
  } catch {}
});
