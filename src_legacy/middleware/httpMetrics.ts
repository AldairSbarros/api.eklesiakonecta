import { Request, Response, NextFunction } from 'express';
import { httpRequestsTotal, httpInFlightGauge, httpErrorsTotal } from '../metrics';

function classify(status: number) {
  if (status < 200) return '1xx';
  if (status < 300) return '2xx';
  if (status < 400) return '3xx';
  if (status < 500) return '4xx';
  return '5xx';
}

export function httpMetricsMiddleware(req: Request, res: Response, next: NextFunction) {
  httpInFlightGauge.inc();
  const start = process.hrtime.bigint();
  const originalEnd = res.end;
  res.end = function (this: any, chunk: any, encoding?: any, cb?: any) {
    const route = (req as any).route?.path || req.path || 'unknown';
    const status = res.statusCode;
    const statusClass = classify(status);
    httpRequestsTotal.inc({ method: req.method, route, status_class: statusClass });
    if (status >= 400) {
      httpErrorsTotal.inc({ method: req.method, route, status: String(status) });
    }
    httpInFlightGauge.dec();
    return originalEnd.call(this, chunk, encoding, cb);
  } as any;
  next();
}
