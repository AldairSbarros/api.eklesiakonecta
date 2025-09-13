import request from 'supertest';
import app from '../../app';

// Retorna um agente já com header schema aplicado
export function testClient() {
  const agent = request(app);
  // encapsula métodos HTTP para aplicar header automaticamente
  const wrap = (method: 'get'|'post'|'put'|'delete'|'patch') => (url: string) => agent[method](url).set('schema', 'tenant_test');
  return {
    get: wrap('get'),
    post: wrap('post'),
    put: wrap('put'),
    delete: wrap('delete'),
    patch: wrap('patch')
  };
}
