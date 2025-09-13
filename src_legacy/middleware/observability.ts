import { Request, Response, NextFunction } from 'express';
import { Histogram, Counter } from 'prom-client';
import { register } from '../metrics';

export const httpRequestDuration = new Histogram({
  name: 'ek_http_request_duration_seconds',
  help: 'Duração das requisições HTTP em segundos',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.6, 1, 2, 5]
});

export const httpRequestErrors = new Counter({
  name: 'ek_http_request_errors_total',
  help: 'Total de respostas com erro (status >=400)',
  labelNames: ['method', 'route', 'status']
});

try {
  if (!register.getSingleMetric('ek_http_request_duration_seconds')) {
    register.registerMetric(httpRequestDuration);
  }
  if (!register.getSingleMetric('ek_http_request_errors_total')) {
    register.registerMetric(httpRequestErrors);
  }
} catch {}

export function metricsTimingMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime.bigint();
  const route = (req as any).route?.path || req.path || 'unknown';
  res.on('finish', () => {
    const diffNs = Number(process.hrtime.bigint() - start);
    const seconds = diffNs / 1e9;
    httpRequestDuration.labels({ method: req.method, route, status: String(res.statusCode) }).observe(seconds);
    if (res.statusCode >= 400) {
      httpRequestErrors.inc({ method: req.method, route, status: String(res.statusCode) });
    }
  });
  next();
}
