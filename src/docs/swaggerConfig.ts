import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API EklesiaKonecta',
      version: '1.0.0',
      description: 'Documentação automática da API EklesiaKonecta'
    },
    servers: [
      { url: 'http://localhost:3001', description: 'Local' },
      { url: 'https://api.eklesia.app.br', description: 'Produção' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        CadastroInicialRequest: {
          type: 'object',
          required: ['nomeIgreja', 'nomePastor', 'emailPastor', 'senhaPastor'],
          properties: {
            nomeIgreja: { type: 'string', example: 'Igreja Exemplo' },
            nomePastor: { type: 'string', example: 'Fulano de Tal' },
            emailPastor: { type: 'string', format: 'email', example: 'pastor@exemplo.com' },
            senhaPastor: { type: 'string', example: 'SenhaForte123' }
          }
        },
        CadastroInicialResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Cadastro inicial realizado com sucesso!' },
            igreja: {
              type: 'object',
              properties: {
                nome: { type: 'string', example: 'Igreja Exemplo' },
                schema: { type: 'string', example: 'igreja_exemplo_ab12cd34' }
              }
            },
            pastor: {
              type: 'object',
              properties: {
                nome: { type: 'string', example: 'Fulano de Tal' },
                email: { type: 'string', example: 'pastor@exemplo.com' }
              }
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'senha'],
            properties: {
              email: { type: 'string', format: 'email', example: 'pastor@exemplo.com' },
              senha: { type: 'string', example: 'SenhaForte123' }
            }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            usuario: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1 },
                nome: { type: 'string', example: 'Fulano de Tal' },
                email: { type: 'string', example: 'pastor@exemplo.com' },
                perfil: { type: 'string', example: 'ADMIN' },
                schema: { type: 'string', example: 'igreja_exemplo_ab12cd34' },
                congregacaoId: { type: ['integer','null'], example: null },
                tipo: { type: 'string', example: 'tenant-user', description: 'tenant-user | church-admin | dev-superuser' }
              }
            }
          }
        },
        HealthMultiTenancyResponse: {
          type: 'object',
          properties: {
            ok: { type: 'boolean', example: true },
            churches: { type: 'integer', example: 12 },
            cache: {
              type: 'object',
              properties: {
                size: { type: 'integer', example: 3 },
                max: { type: 'integer', example: 15 }
              }
            },
            multiTenancy: { type: 'boolean', example: true }
          }
        }
      }
    },
    paths: {
      '/api/cadastro-inicial': {
        post: {
          summary: 'Realiza cadastro inicial (provisiona nova igreja)',
          tags: ['Onboarding'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CadastroInicialRequest' }
              }
            }
          },
          responses: {
            200: {
              description: 'Cadastro realizado',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/CadastroInicialResponse' }
                }
              }
            },
            400: { description: 'Dados inválidos' }
          }
        }
      },
      '/api/auth/login': {
        post: {
          summary: 'Login de usuário / admin / dev (multi-fluxo)',
          description: `Fluxos suportados:\n\n- (A) Primeiro login de uma igreja recém criada: NÃO enviar header de schema. O sistema procura o email na tabela global (church) e retorna tipo=church-admin com schema.\n- (B) Login de usuário de tenant: enviar um dos headers de schema (schema | x-church-schema | x-tenant-schema | x-schema | x-tenant) ou campo schema no body.\n- (C) Dev superuser global: usar email/senha do devUser (seed) e nenhum header de schema. Retorna tipo=dev-superuser.`,
          tags: ['Autenticação'],
          parameters: [
            {
              name: 'schema',
              in: 'header',
              required: false,
              schema: { type: 'string' },
              description: 'Schema do tenant (alternativas: x-church-schema, x-tenant-schema, x-schema, x-tenant). Opcional no primeiro login (church-admin) ou dev-superuser.'
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } }
            }
          },
          responses: {
            200: {
              description: 'Login OK',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/LoginResponse' } }
              }
            },
            400: { description: 'Schema ausente quando necessário' },
            401: { description: 'Credenciais inválidas' }
          }
        }
      },
      '/api/health/multi-tenancy': {
        get: {
          summary: 'Health multi-tenancy e métricas básicas de cache',
          tags: ['Health'],
          responses: {
            200: {
              description: 'OK',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/HealthMultiTenancyResponse' } }
              }
            }
          }
        }
      }
    },
    security: []
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts']
};

const swaggerSpec = swaggerJSDoc(options as any);

export default swaggerSpec;
