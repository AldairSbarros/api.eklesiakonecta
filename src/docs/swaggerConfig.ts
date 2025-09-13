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
                perfis: { type: 'array', items: { type: 'string' }, example: ['ADMIN'] }
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
          summary: 'Login de usuário (usar header schema)',
          tags: ['Autenticação'],
          parameters: [
            {
              name: 'schema',
              in: 'header',
              required: true,
              schema: { type: 'string' },
              description: 'Schema da igreja (ex: public para primeiro login)'
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
