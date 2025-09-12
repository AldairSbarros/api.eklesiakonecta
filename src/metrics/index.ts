import client from 'prom-client';
import { getCacheMetrics } from '../utils/prismaCache';

const register = new client.Registry();
if (!global.__EK_METRICS_DEFAULTS__) {
  client.collectDefaultMetrics({ register, prefix: 'ek_' });
  (global as any).__EK_METRICS_DEFAULTS__ = true;
}

let existingGauge = register.getSingleMetric?.('ek_prisma_clients_active') as client.Gauge<string> | undefined;
export const prismaClientsGauge = existingGauge || new client.Gauge({
  name: 'ek_prisma_clients_active',
  help: 'Número de clientes Prisma ativos em cache'
});
if (!existingGauge) {
  try { register.registerMetric(prismaClientsGauge); } catch {}
}

let tenantCounter = register.getSingleMetric?.('ek_tenant_provision_total') as client.Counter<string> | undefined;
export const tenantProvisionCounter = tenantCounter || new client.Counter({
  name: 'ek_tenant_provision_total',
  help: 'Total de schemas provisionados (created=true)'
});
if (!tenantCounter) {
  try { register.registerMetric(tenantProvisionCounter); } catch {}
}

let reqSchemaCtr = register.getSingleMetric?.('ek_requests_per_schema_total') as client.Counter<string> | undefined;
export const requestPerSchemaCounter = reqSchemaCtr || new client.Counter({
  name: 'ek_requests_per_schema_total',
  help: 'Total de requisições por schema',
  labelNames: ['schema']
});
if (!reqSchemaCtr) {
  try { register.registerMetric(requestPerSchemaCounter); } catch {}
}

// Métricas HTTP adicionais
let httpReqCtr = register.getSingleMetric?.('ek_http_requests_total') as client.Counter<string> | undefined;
export const httpRequestsTotal = httpReqCtr || new client.Counter({
  name: 'ek_http_requests_total',
  help: 'Total de requisições HTTP',
  labelNames: ['method', 'route', 'status_class']
});
if (!httpReqCtr) { try { register.registerMetric(httpRequestsTotal); } catch {} }

let inFlight = register.getSingleMetric?.('ek_http_requests_in_flight') as client.Gauge<string> | undefined;
export const httpInFlightGauge = inFlight || new client.Gauge({
  name: 'ek_http_requests_in_flight',
  help: 'Requisições HTTP em processamento'
});
if (!inFlight) { try { register.registerMetric(httpInFlightGauge); } catch {} }

let httpErr = register.getSingleMetric?.('ek_http_errors_total') as client.Counter<string> | undefined;
export const httpErrorsTotal = httpErr || new client.Counter({
  name: 'ek_http_errors_total',
  help: 'Total de erros HTTP (status >=400)',
  labelNames: ['method', 'route', 'status']
});
if (!httpErr) { try { register.registerMetric(httpErrorsTotal); } catch {} }

// (duplicados já evitados acima)

export function collectPrismaCacheMetrics() {
  const cache = getCacheMetrics();
  prismaClientsGauge.set(cache.total);
}

export async function metricsHandler(req: any, res: any) {
  try {
    collectPrismaCacheMetrics();
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (e: any) {
    res.status(500).send(e.message);
  }
}

export { register };
