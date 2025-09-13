// Implementação mínima manual. Pode ser evoluída adicionando rotas reais
// com schemas de request/response conforme controllers.
const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'API Eklesia Konecta',
    version: '1.0.0',
    description: 'Documentação da API Single Tenant do Eklesia Konecta.'
  },
  servers: [ { url: '/' } ],
  tags: [
    { name: 'Infra', description: 'Rotas de infraestrutura e saúde.' },
    { name: 'Igrejas', description: 'Gestão de igrejas.' }
  ],
  paths: {
    '/health': {
      get: {
        tags: ['Infra'],
        summary: 'Healthcheck básico',
        responses: {
          '200': {
            description: 'OK',
            content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' } } } } }
          }
        }
      }
    },
    '/igrejas': {
      get: {
        tags: ['Igrejas'],
        summary: 'Listar igrejas',
        responses: { '200': { description: 'Lista de igrejas', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Igreja' } } } } } }
      },
      post: {
        tags: ['Igrejas'],
        summary: 'Criar igreja',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/IgrejaCreateInput' } } }
        },
        responses: { '201': { description: 'Criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Igreja' } } } } }
      }
    },
    '/igrejas/{id}': {
      get: {
        tags: ['Igrejas'],
        summary: 'Obter igreja por ID',
        parameters: [ { name: 'id', in: 'path', required: true, schema: { type: 'integer' } } ],
        responses: { '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Igreja' } } } }, '404': { description: 'Não encontrada' } }
      },
      put: {
        tags: ['Igrejas'],
        summary: 'Atualizar igreja',
        parameters: [ { name: 'id', in: 'path', required: true, schema: { type: 'integer' } } ],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/IgrejaUpdateInput' } } } },
        responses: { '200': { description: 'Atualizado' }, '404': { description: 'Não encontrada' } }
      },
      delete: {
        tags: ['Igrejas'],
        summary: 'Remover igreja',
        parameters: [ { name: 'id', in: 'path', required: true, schema: { type: 'integer' } } ],
        responses: { '204': { description: 'Removido' }, '404': { description: 'Não encontrada' } }
      }
    }
  },
  components: {
    schemas: {
      Igreja: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          nome: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        },
        required: ['id', 'nome']
      },
      IgrejaCreateInput: {
        type: 'object',
        properties: { nome: { type: 'string' } },
        required: ['nome']
      },
      IgrejaUpdateInput: {
        type: 'object',
        properties: { nome: { type: 'string' } }
      }
    }
  }
};

export default swaggerSpec;
