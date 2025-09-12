import { getOrCreatePrisma } from './prismaCache';
import { tenantProvisionCounter } from '../metrics';
import { getRedis } from './redis';
import crypto from 'crypto';

interface ProvisionResult {
  created: boolean;
  schema: string;
}

// Mutex simples por schema
const pending: Record<string, Promise<ProvisionResult>> = {};

function normalizeSchema(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9_]/g, '_').slice(0, 30);
}

export async function provisionSchema(rawName: string): Promise<ProvisionResult> {
  const base = normalizeSchema(rawName) || 'tenant';
  // timestamp curto para evitar colisão se chamado diretamente
  const schema = `${base}_${Date.now().toString(36)}_${crypto.randomBytes(2).toString('hex')}`;
  return internalProvision(schema, true);
}

export async function ensureSchema(schema: string): Promise<ProvisionResult> {
  schema = normalizeSchema(schema);
  return internalProvision(schema, false);
}

async function internalProvision(schema: string, alwaysNew: boolean): Promise<ProvisionResult> {
  if (!alwaysNew && typeof pending[schema] !== 'undefined') return pending[schema];
  const start = Date.now();
  const promise = (async (): Promise<ProvisionResult> => {
    const redis = getRedis();
    const lockKey = `lock:provision:${schema}`;
    let haveLock = false;
    if (redis) {
      try {
        // Tenta adquirir lock (PX 15000 ms)
  const ok = await (redis as any).set(lockKey, process.pid.toString(), { NX: true, PX: 15000 });
        if (!ok) {
          // Espera até 5s por lock
          const limit = Date.now() + 5000;
            while (Date.now() < limit) {
              await new Promise(r => setTimeout(r, 150));
              const ok2 = await (redis as any).set(lockKey, process.pid.toString(), { NX: true, PX: 15000 });
              if (ok2) { haveLock = true; break; }
            }
          if (!haveLock) {
            // Outro processo provavelmente provisionou
            const prismaPublicTmp = getOrCreatePrisma('public');
            const existsTmp = await prismaPublicTmp.$queryRawUnsafe<{ schema: string }[]>(`SELECT schema FROM "Church" WHERE schema = '${schema}' LIMIT 1`);
            if (existsTmp.length && !alwaysNew) {
              const durWait = Date.now() - start;
              console.log(`[Provisioner] reuse-after-wait schema=${schema} duration=${durWait}ms`);
              return { created: false, schema };
            }
          }
        } else {
          haveLock = true;
        }
      } catch {}
    }
    const prismaPublic = getOrCreatePrisma('public');
    // Verifica se já existe registro em church
    const exists = await prismaPublic.$queryRawUnsafe<{ schema: string }[]>(`SELECT schema FROM "Church" WHERE schema = '${schema}' LIMIT 1`);
    if (exists.length && !alwaysNew) {
      const dur = Date.now() - start;
      console.log(`[Provisioner] reuse schema=${schema} duration=${dur}ms`);
      return { created: false, schema };
    }
  // Cria schema
    await prismaPublic.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);
    // Executa db push para o novo schema via instância isolada
    const { exec } = require('child_process');
    const path = require('path');
    const schemaPrismaPath = path.resolve(process.cwd(), 'prisma', 'schema.prisma');
    const dbUrl = buildDbUrl(schema);
    const cmd = `DATABASE_URL="${dbUrl}" npx prisma db push --schema "${schemaPrismaPath}" --skip-generate`;
  await new Promise((resolve, reject) => {
      exec(cmd, { shell: true }, (err: any, stdout: any, stderr: any) => {
        if (err) {
          console.error('[schemaProvisioner] db push error', stderr || err);
          return reject(new Error('Falha ao aplicar schema Prisma')); 
        }
        resolve(stdout);
      });
    });
  const dur = Date.now() - start;
  console.log(`[Provisioner] created schema=${schema} duration=${dur}ms`);
  try { tenantProvisionCounter.inc(); } catch {}
  if (haveLock) {
    try { await getRedis()?.del(lockKey); } catch {}
  }
  return { created: true, schema };
  })();
  if (!alwaysNew) pending[schema] = promise;
  try {
    const result = await promise;
    return result;
  } finally {
    if (!alwaysNew) delete pending[schema];
  }
}

function buildDbUrl(schema: string) {
  const base = process.env.DATABASE_URL!;
  if (base.includes('schema=')) return base.replace(/schema=([a-zA-Z0-9_]+)/, `schema=${schema}`);
  const sep = base.includes('?') ? '&' : '?';
  return `${base}${sep}schema=${schema}`;
}
