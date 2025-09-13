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
    { name: 'Igrejas', description: 'Gestão de igrejas.' },
    { name: 'Congregações', description: 'Gestão de congregações.' },
    { name: 'Gerações', description: 'Gestão de gerações (faixas / ministérios).'},
    { name: 'Células', description: 'Gestão de células.' },
    { name: 'Membros', description: 'Gestão de membros e etapas.' },
    { name: 'Receitas', description: 'Lançamentos financeiros e relatórios.' },
    { name: 'Usuários', description: 'Gestão de usuários e permissões.' }
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
      // ===== Enums =====
      Role: { type: 'string', enum: ['PASTOR','DIRIGENTE','TESOUREIRO','SECRETARIO'] },
      ReceitaTipo: { type: 'string', enum: ['DIZIMO','OFERTA','VOTO','OFERTA_ALCADA'] },
      FormaPagamento: { type: 'string', enum: ['ESPECIE','PIX'] },
      DiaSemana: { type: 'string', enum: ['SEG','TER','QUA','QUI','SEX','SAB','DOM'] },
      EtapaDiscipulado: { type: 'string', enum: ['MINICURSO','ANDANDO_COM_CRISTO','AGORA_QUE_SOU_DE_CRISTO','CONSOLIDACAO','ESCOLA_LIDERES_N1','ESCOLA_LIDERES_N2','ESCOLA_LIDERES_N3','ENCONTRO_COM_DEUS','BATISMO_AGUAS','LIBERADO_LIDERAR'] },

      // ===== Infra =====
      Error: {
        type: 'object',
        properties: {
          statusCode: { type: 'integer' },
          message: { type: 'string' },
          details: { type: 'object', additionalProperties: true }
        },
        required: ['statusCode','message']
      },
      PaginationMeta: {
        type: 'object',
        properties: {
          total: { type: 'integer' },
          page: { type: 'integer' },
          pageSize: { type: 'integer' },
          pageCount: { type: 'integer' }
        },
        required: ['total','page','pageSize','pageCount']
      },
      PaginatedIgreja: {
        type: 'object',
        properties: {
          data: { type: 'array', items: { $ref: '#/components/schemas/Igreja' } },
          meta: { $ref: '#/components/schemas/PaginationMeta' }
        },
        required: ['data','meta']
      },
      // Reutilizável generic container (conceitual) - documenta estrutura, mas uso prático virá em cada rota
      PaginatedGeneric: {
        type: 'object',
        properties: {
          data: { type: 'array', items: { type: 'object' } },
          meta: { $ref: '#/components/schemas/PaginationMeta' }
        }
      },

      // ===== Core Schemas =====
      Igreja: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          nome: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        },
        required: ['id','nome']
      },
      IgrejaCreateInput: { type: 'object', properties: { nome: { type: 'string' } }, required: ['nome'] },
      IgrejaUpdateInput: { type: 'object', properties: { nome: { type: 'string' } } },

      Congregacao: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          nome: { type: 'string' },
          igrejaId: { type: 'integer' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        },
        required: ['id','nome','igrejaId']
      },
      CongregacaoCreateInput: { type: 'object', properties: { nome: { type: 'string' }, igrejaId: { type: 'integer' } }, required: ['nome','igrejaId'] },
      CongregacaoUpdateInput: { type: 'object', properties: { nome: { type: 'string' } } },

      Geracao: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          nome: { type: 'string' },
          congregacaoId: { type: 'integer' },
          liderGeracaoMembroId: { type: 'integer', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        },
        required: ['id','nome','congregacaoId']
      },
      GeracaoCreateInput: { type: 'object', properties: { nome: { type: 'string' }, congregacaoId: { type: 'integer' } }, required: ['nome','congregacaoId'] },
      GeracaoUpdateInput: { type: 'object', properties: { nome: { type: 'string' }, liderGeracaoMembroId: { type: 'integer', nullable: true } } },

      Celula: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          nome: { type: 'string' },
          congregacaoId: { type: 'integer' },
          geracaoId: { type: 'integer', nullable: true },
          diaSemana: { $ref: '#/components/schemas/DiaSemana' },
            horario: { type: 'string', nullable: true },
            localReuniao: { type: 'string', nullable: true },
          liderMembroId: { type: 'integer', nullable: true },
          viceLiderMembroId: { type: 'integer', nullable: true },
          secretarioMembroId: { type: 'integer', nullable: true },
          tesoureiroMembroId: { type: 'integer', nullable: true },
          anfitriaoMembroId: { type: 'integer', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        },
        required: ['id','nome','congregacaoId']
      },
      CelulaCreateInput: {
        type: 'object',
        properties: {
          nome: { type: 'string' },
          congregacaoId: { type: 'integer' },
          geracaoId: { type: 'integer', nullable: true },
          diaSemana: { $ref: '#/components/schemas/DiaSemana' },
          horario: { type: 'string', nullable: true },
          localReuniao: { type: 'string', nullable: true }
        },
        required: ['nome','congregacaoId']
      },
      CelulaUpdateInput: {
        type: 'object',
        properties: {
          nome: { type: 'string' },
          geracaoId: { type: 'integer', nullable: true },
          diaSemana: { $ref: '#/components/schemas/DiaSemana' },
          horario: { type: 'string' },
          localReuniao: { type: 'string' }
        }
      },

      Membro: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          nome: { type: 'string' },
          email: { type: 'string', nullable: true },
          telefone: { type: 'string', nullable: true },
          celulaId: { type: 'integer' },
          ativoNaCongregacao: { type: 'boolean' },
          aptoLiderar: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        },
        required: ['id','nome','celulaId']
      },
      MembroCreateInput: { type: 'object', properties: { nome: { type: 'string' }, celulaId: { type: 'integer' }, email: { type: 'string', nullable: true }, telefone: { type: 'string', nullable: true } }, required: ['nome','celulaId'] },
      MembroUpdateInput: { type: 'object', properties: { nome: { type: 'string' }, email: { type: 'string' }, telefone: { type: 'string' }, ativoNaCongregacao: { type: 'boolean' }, aptoLiderar: { type: 'boolean' } } },

      MembroEtapa: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          membroId: { type: 'integer' },
          etapa: { $ref: '#/components/schemas/EtapaDiscipulado' },
          dataConclusao: { type: 'string', format: 'date-time', nullable: true },
          observacao: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        },
        required: ['id','membroId','etapa']
      },
      MembroEtapaCreateInput: { type: 'object', properties: { etapa: { $ref: '#/components/schemas/EtapaDiscipulado' }, dataConclusao: { type: 'string', format: 'date-time', nullable: true }, observacao: { type: 'string', nullable: true } }, required: ['etapa'] },

      Receita: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          congregacaoId: { type: 'integer' },
          membroId: { type: 'integer', nullable: true },
          tipo: { $ref: '#/components/schemas/ReceitaTipo' },
          formaPagamento: { $ref: '#/components/schemas/FormaPagamento' },
          valor: { type: 'string', description: 'Decimal como string' },
          data: { type: 'string', format: 'date-time' },
          numeroRecibo: { type: 'integer' },
          cultoDescricao: { type: 'string', nullable: true },
          fotoPath: { type: 'string', nullable: true },
          observacao: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        },
        required: ['id','congregacaoId','tipo','formaPagamento','valor','numeroRecibo']
      },
      ReceitaCreateInput: {
        type: 'object',
        properties: {
          congregacaoId: { type: 'integer' },
          membroId: { type: 'integer', nullable: true },
          tipo: { $ref: '#/components/schemas/ReceitaTipo' },
          formaPagamento: { $ref: '#/components/schemas/FormaPagamento' },
          valor: { type: 'string' },
          cultoDescricao: { type: 'string', nullable: true },
          observacao: { type: 'string', nullable: true }
        },
        required: ['congregacaoId','tipo','formaPagamento','valor']
      },

      Usuario: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          nome: { type: 'string' },
          email: { type: 'string' },
          role: { $ref: '#/components/schemas/Role' },
          igrejaId: { type: 'integer', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        },
        required: ['id','nome','email','role']
      },
      UsuarioCreateInput: { type: 'object', properties: { nome: { type: 'string' }, email: { type: 'string' }, senha: { type: 'string' }, igrejaId: { type: 'integer', nullable: true }, role: { $ref: '#/components/schemas/Role' } }, required: ['nome','email','senha'] },
      UsuarioUpdateInput: { type: 'object', properties: { nome: { type: 'string' }, role: { $ref: '#/components/schemas/Role' } } }
    }
  }
};

export default swaggerSpec;
